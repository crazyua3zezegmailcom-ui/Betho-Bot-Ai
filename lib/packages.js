import crypto from 'crypto'
import { generateWAMessageContent } from '@whiskeysockets/baileys'

/**
 * نظام تحزيم وهندسة الملصقات المتوافق مع بروتوكول واتساب لبايلس v7
 * @param {Object} conn - اتصال البوت (conn) عشان نستخدم دوال الرفع
 * @param {Buffer[]} stickerBuffers - مصفوفة بافرز الملصقات (.webp)
 * @param {Object} options - معلومات الحزمة
 */
export async function createStickerPackMessage(conn, stickerBuffers, options = {}) {
    const packName = options.packName || '⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 Pack 🍓'
    const publisher = options.publisher || '⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 BOT'
    const caption = options.caption || ''

    let stickerMessages = []

    // الدوران على الملصقات ورفعها على سيرفرات واتساب للحصول على الـ Tokens والمسارات الرسمية
    for (const buf of stickerBuffers) {
        try {
            // استخدام دالة بايلس الداخلية لرفع الميديا كـ ملصق رسمي
            const upload = await conn.waUploadToServer(buf, {
                mediaType: 3 // 3 تعني Sticker / Image في بروتوكول واتساب
            })

            // حساب الـ Sha256 للبافر للحفاظ على سلامة الملف في السيرفر
            const fileSha256 = crypto.createHash('sha256').update(buf).digest()

            stickerMessages.push({
                stickerMessage: {
                    url: upload.url,
                    fileSha256: fileSha256,
                    fileEncSha256: upload.fileEncSha256,
                    mediaKey: upload.mediaKey,
                    mimetype: 'image/webp',
                    height: 512,
                    width: 512,
                    directPath: upload.directPath,
                    fileLength: buf.length,
                    isAnimated: false
                }
            })
        } catch (err) {
            console.error('⚠️ فشل رفع ملصق في الحزمة:', err)
        }
    }

    if (stickerMessages.length === 0) return null

    // بناء الهيكل النهائي والـ Nodes المقفلة للباكج الكلي
    return {
        stickerPackMessage: {
            stickers: stickerMessages,
            packId: crypto.randomBytes(16).toString('hex'),
            packName: packName,
            publisher: publisher,
            caption: caption
        }
    }
}
