import { Boom } from '@hapi/boom';
import Crypto from 'crypto';
import { Readable } from 'stream';
import { zipSync } from 'fflate';
import axios from 'axios';

// ================================================
// 🛠️ دوال التشفير والتحويل الصارمة (تحصين كامل ضد ArrayBuffer)
// ================================================
const sha256 = (buffer) => {
    const safeBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer.buffer || buffer);
    return Crypto.createHash('sha256').update(safeBuffer).digest();
};

const unixTimestampSeconds = () => Math.floor(Date.now() / 1000);

const generateMessageIDV2 = () => {
    return Crypto.randomBytes(16).toString('base64url').substring(0, 22);
};

const toReadable = (buffer) => {
    const readable = new Readable({ read() {}, highWaterMark: 64 * 1024 });
    readable.push(Buffer.from(buffer));
    readable.push(null);
    return readable;
};

const toBuffer = async (stream) => {
    if (Buffer.isBuffer(stream)) return stream;
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    if (stream.destroy) stream.destroy();
    return Buffer.from(Buffer.concat(chunks));
};

const getHttpStream = async (url) => {
    const response = await axios.get(url.toString(), {
        responseType: 'arraybuffer',
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 20000
    });
    return toReadable(Buffer.from(response.data));
};

const getStream = async (urlStr) => {
    if (Buffer.isBuffer(urlStr)) return { stream: toReadable(urlStr) };
    if (urlStr.startsWith('data:')) {
        const buffer = Buffer.from(urlStr.split(',')[1], 'base64');
        return { stream: toReadable(buffer) };
    }
    if (urlStr.startsWith('http://') || urlStr.startsWith('https://')) {
        return { stream: await getHttpStream(urlStr) };
    }
    throw new Boom('Unsupported url type');
};

const hkdf = (key, length, options) => {
    const info = typeof options === 'string' ? options : (options?.info || 'WhatsApp Image Keys');
    return Crypto.hkdfSync('sha256', key, '', Buffer.from(info), length);
};

async function getMediaKeys(mediaKey) {
    const expanded = hkdf(mediaKey, 112, 'WhatsApp Image Keys'); 
    return {
        iv: expanded.slice(0, 16),
        cipherKey: expanded.slice(16, 48),
        macKey: expanded.slice(48, 80)
    };
}

const isWebPBuffer = (buf) => {
    const safeBuf = Buffer.from(buf.buffer || buf);
    return safeBuf.length >= 12 &&
        safeBuf[0] === 0x52 && safeBuf[1] === 0x49 && safeBuf[2] === 0x46 && safeBuf[3] === 0x46 &&
        safeBuf[8] === 0x57 && safeBuf[9] === 0x45 && safeBuf[10] === 0x42 && safeBuf[11] === 0x50;
};

// ================================================
// 🚀 دالة الرفع المستقلة البديلة لتخطي إيرور بايلز المعدلة
// ================================================
async function nativeMetaUpload(encryptedBuffer, fileEncSha256, options) {
    // استخراج توكن البوت أو إعدادات الهيدرز من دالة الرفع الأصلية إذا كانت متوفرة
    const authHeader = options?.headers || {};
    const hosts = ['mms.whatsapp.net', 'mmg.whatsapp.net'];
    const randomHost = hosts[Math.floor(Math.random() * hosts.length)];
    
    const encSha256B64 = Buffer.from(fileEncSha256).toString('base64url');
    const uploadUrl = `https://${randomHost}/mms/sticker/${encSha256B64}`;

    const response = await axios.post(uploadUrl, Buffer.from(encryptedBuffer), {
        headers: {
            ...authHeader,
            'User-Agent': 'WhatsApp/2.24.4.76 A',
            'Content-Type': 'application/octet-stream',
            'Accept': 'application/json'
        },
        timeout: options?.timeoutMs || 60000
    });

    if (!response.data || !response.data.directPath) {
        throw new Boom('Failed to upload sticker pack natively to Meta servers');
    }

    return { directPath: response.data.directPath };
}

// ================================================
// 📦 الدالة الأساسية لإنشاء وتتشكيل حزمة الملصقات
// ================================================
export async function prepareStickerPackMessage(stickerPackData, options) {
    const { stickers, cover, name, publisher, packId, description } = stickerPackData;

    if (!stickers?.length) throw new Boom('Sticker pack must contain at least one sticker');
    
    const [libSharp, libJimp] = await Promise.all([
        import('sharp').catch(() => null),
        import('jimp').catch(() => null)
    ]);

    const stickerPackId = packId || generateMessageIDV2();
    const stickerData = {};

    // 1. معالجة وتوحيد صيغ الملصقات
    const stickerPromises = stickers.map(async (stickerObj, i) => {
        const { stream } = await getStream(stickerObj.sticker || stickerObj.data);
        const buffer = await toBuffer(stream);
        let webpBuffer = buffer;

        if (!isWebPBuffer(buffer)) {
            if (libSharp) {
                webpBuffer = await libSharp.default(buffer).webp().toBuffer();
            } else if (libJimp?.Jimp) {
                const jimpImage = await libJimp.Jimp.read(buffer);
                jimpImage.resize(512, 512);
                webpBuffer = await jimpImage.getBufferAsync('image/webp');
            }
        }

        const fileName = `${i + 1}.webp`;
        stickerData[fileName] = [new Uint8Array(webpBuffer.buffer || webpBuffer), { level: 0 }];
        return {
            fileName,
            mimetype: 'image/webp',
            isAnimated: stickerObj.isAnimated || false,
            isLottie: stickerObj.isLottie || false,
            emojis: stickerObj.emojis || ['✨']
        };
    });

    const stickerMetadata = await Promise.all(stickerPromises);

    // 2. معالجة غلاف الحزمة
    const { stream: coverStream } = await getStream(cover);
    const coverBuffer = await toBuffer(coverStream);
    const coverFileName = `${stickerPackId}.webp`;
    stickerData[coverFileName] = [new Uint8Array(coverBuffer.buffer || coverBuffer), { level: 0 }];

    // 3. بناء ملف الـ ZIP وتشفيره محلياً بصيغة بافر نود صلبة
    const rawZipBytes = zipSync(stickerData);
    const zipBuffer = Buffer.from(rawZipBytes.buffer || rawZipBytes);
    const safeCoverBuffer = Buffer.from(coverBuffer.buffer || coverBuffer);
    
    const mediaKey = Crypto.randomBytes(32);

    const encryptBuffer = async (buf) => {
        const safeBuf = Buffer.from(buf.buffer || buf);
        const { cipherKey, iv, macKey } = await getMediaKeys(mediaKey);
        const aes = Crypto.createCipheriv('aes-256-cbc', cipherKey, iv);
        let hmac = Crypto.createHmac('sha256', macKey).update(iv);
        
        const encPart1 = aes.update(safeBuf);
        const encPart2 = aes.final();
        const encBodyFinal = Buffer.concat([encPart1, encPart2]);
        
        hmac.update(encBodyFinal);
        const mac = hmac.digest().slice(0, 10);
        const encBody = Buffer.concat([encBodyFinal, mac]);
        
        return {
            encBody: Buffer.from(encBody),
            fileSha256: sha256(safeBuf),
            fileEncSha256: sha256(encBody)
        };
    };

    const zipEnc = await encryptBuffer(zipBuffer);
    const thumbEnc = await encryptBuffer(safeCoverBuffer);

    // 4. الرفع المستقل والمباشر لسيرفرات ميتأ (بدون استدعاء دالة بايلز المكسورة)
    const stickerPackUploadResult = await nativeMetaUpload(zipEnc.encBody, zipEnc.fileEncSha256, options);
    const thumbUploadResult = await nativeMetaUpload(thumbEnc.encBody, thumbEnc.fileEncSha256, options);

    // 5. الهيكل النهائي النظيف الجاهز للبث والـ relayMessage
    return {
        stickerPackMessage: {
            name,
            publisher,
            stickerPackId,
            packDescription: description || '',
            stickerPackOrigin: 2,
            stickerPackSize: zipBuffer.length,
            stickers: stickerMetadata,
            fileSha256: zipEnc.fileSha256,
            fileEncSha256: zipEnc.fileEncSha256,
            mediaKey,
            directPath: stickerPackUploadResult.directPath,
            fileLength: zipBuffer.length,
            mediaKeyTimestamp: unixTimestampSeconds(),
            trayIconFileName: coverFileName,
            imageDataHash: sha256(safeCoverBuffer).toString('base64'),
            thumbnailDirectPath: thumbUploadResult.directPath,
            thumbnailSha256: thumbEnc.fileSha256,
            thumbnailEncSha256: thumbEnc.fileEncSha256,
            thumbnailHeight: 96,
            thumbnailWidth: 96
        }
    };
}
