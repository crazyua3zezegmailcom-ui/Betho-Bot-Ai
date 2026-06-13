// أمر تخيل3 - باستخدام Omegatech API
import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`🎨 *أمر إنشاء الصور*\n\nالاستخدام:\n${usedPrefix + command} وصف الصورة\n\nمثال:\n${usedPrefix + command} نهر انمي صافي`);
    }

    await m.reply('🖌️ جاري إنشاء الصورة... قد تستغرق لحظات.');
    const prompt = encodeURIComponent(text);

    try {
        const apiUrl = `https://omegatech-api.dixonomega.tech/api/ai/nano-banana-pro?prompt=${prompt}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.success || !data.image) {
            throw new Error('فشل الحصول على رابط الصورة');
        }

        await conn.sendMessage(m.chat, {
            image: { url: data.image },
            caption: `✅ *تم إنشاء الصورة بنجاح!*\n📝 *الوصف:* ${text}\n🔗 [رابط مباشر](${data.image})`
        }, { quoted: m });

    } catch (err) {
        console.error(err);
        await m.reply(`❌ *فشل إنشاء الصورة*\n${err.message}`);
    }
};

handler.help = ['تخيل3'];
handler.tags = ['ai'];
handler.command = /^(تخيل)$/i;

export default handler;