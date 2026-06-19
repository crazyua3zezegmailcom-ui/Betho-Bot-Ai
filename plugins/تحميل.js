/**
 * 📥 Direct Media Downloader — أمر التحميل المباشر واختبار السيرفر
 * ⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓
 * يدعم: mp4, webp, jpg, png, jpeg
 * حقوق التطوير: Arab Top Dev
 */

import axios from 'axios'
import { fileTypeFromBuffer } from 'file-type'

const myCredit = `*_ .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓 _*`;

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // 1. التحقق من إدخال الرابط
    if (!text) return m.reply(`*⚠️ يـرجى كـتابة رابـط الـميديا الـمباشر بـعد الأمـر!*\n*مثال:* ${usedPrefix + command} https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg`);

    // تنظيف الرابط من أي فراغات
    const mediaUrl = text.trim();

    // التحقق المبدئي إذا كان الرابط يبدأ بـ http
    if (!/^https?:\/\//.test(mediaUrl)) return m.reply('❌ *الـرابط الـمستخدَم غـير صـحيح!*');

    await m.react('⏳');
    let statusMsg = await m.reply(`⏳ _جاري جلب وتحميل الميديا من الرابط المباشر..._`);

    try {
        // 2. تحميل الميديا كـ Buffer مباشرة لتفادي مشاكل الصيغ الميتة
        const response = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');

        if (!buffer || buffer.length === 0) throw new Error("الملف فارغ");

        // 3. فحص صيغة الملف الحقيقية من البافر تلقائياً
        const fileInfo = await fileTypeFromBuffer(buffer);
        let ext = fileInfo ? fileInfo.ext : mediaUrl.split('.').pop().toLowerCase();
        let mime = fileInfo ? fileInfo.mime : '';

        // 4. فحص الروابط والصيغ وتوجيهها بالشكل الصحيح
        
        // أ - إذا كان الملف فيديو MP4 أو لملصق متحرك Webp (نرسله كفيديو)
        if (ext === 'mp4' || ext === 'webp' || mime.includes('video') || mediaUrl.endsWith('.webp')) {
            await m.react('✅');
            await conn.sendMessage(m.chat, {
                video: buffer,
                caption: `🎬 *تـم الـتحميل بـنجاح كـمقطع فـيديو* 🍓\n\n🔗 *الـصيغة الـمكتشفة:* ${ext.toUpperCase()}\n\n${myCredit}`,
                mimetype: 'video/mp4'
            }, { quoted: m });
            
            return await conn.sendMessage(m.chat, { delete: statusMsg.key });
        }

        // ب - إذا كان الملف صورة JPG / PNG
        if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || mime.includes('image')) {
            await m.react('✅');
            await conn.sendMessage(m.chat, {
                image: buffer,
                caption: `📸 *تـم الـتحميل بـنجاح كـصورة دقيقة* 🌸\n\n🔗 *الـصيغة الـمكتشفة:* ${ext.toUpperCase()}\n\n${myCredit}`
            }, { quoted: m });

            return await conn.sendMessage(m.chat, { delete: statusMsg.key });
        }

        // جـ - إذا كانت صيغة أخرى غير مدعومة مباشرة في الفلاتر العلوية (نرسلها كملف مستند وثيقة)
        await m.react('📦');
        await conn.sendMessage(m.chat, {
            document: buffer,
            mimetype: mime || 'application/octet-stream',
            fileName: `downloaded_media.${ext}`,
            caption: `📦 *تـم الـتحميل كـملف مـستند (صيغة غير اعتيادية)*\n\n🔗 *الـصيغة:* ${ext.toUpperCase()}\n\n${myCredit}`
        }, { quoted: m });

        return await conn.sendMessage(m.chat, { delete: statusMsg.key });

    } catch (e) {
        console.error('Direct Downloader Error:', e);
        await m.react('❌');
        return conn.sendMessage(m.chat, { 
            text: `❌ *فـشلت عـملية جـلب الـملف!* تأكد أن الرابط مباشر ويعمل، أو أن حجم الملف ليس ضخماً.` , 
            edit: statusMsg.key 
        }, { quoted: m });
    }
}

handler.help = ['تحميل']
handler.tags = ['tools']
handler.command = /^(تحميل|download|dl)$/i

export default handler;