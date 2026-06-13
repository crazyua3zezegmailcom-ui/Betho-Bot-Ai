// حہּٰقَــــوٰقَ 𝐶𝑟𝑎𝑧𝑦 💻🔥
// إصلاح خطأ الـ download في تغيير صورة الجروب

import { downloadContentFromMessage } from '@whiskeysockets/baileys';

let handler = async (m, { conn, isAdmin, isBotAdmin, isOwner }) => {
    if (!m.isGroup) return m.reply('❌ *هذا الأمر يعمل في الجروبات فقط*');
    if (!isAdmin && !isOwner) return m.reply('❌ *يجب أن تكون مشرفاً لاستخدام هذا الأمر*');
    if (!isBotAdmin) return m.reply('❌ *يجب أن يكون البوت مشرفاً*');

    // التأكد من الرد على صورة
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    
    if (!mime || !mime.includes('image')) return m.reply('❌ *الرجاء الرد على صورة فقط*');

    await m.reply('⏳ *جاري تغيير صورة الجروب...*');

    try {
        // الطريقة المضمونة للتحميل لجميع نسخ Baileys
        let media = await q.download(); 
        
        // إذا فشلت الطريقة السابقة، نستخدم الطريقة اليدوية
        if (!media) {
            let stream = await downloadContentFromMessage(q.msg || q, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            media = buffer;
        }

        // تنفيذ تغيير الصورة
        await conn.updateProfilePicture(m.chat, media);

        let successMsg = `╗═══≪ 🌿🍉🍡 ≫═══╔
✅ *تم تغيير الصورة بنجاح*

📸 *الصورة الجديدة تم تعيينها*
👤 *بواسطة:* @${m.sender.split('@')[0]}
📅 *التاريخ:* ${new Date().toLocaleString('ar-EG')}

✨ *الجروب الآن بمظهر جديد*
╝═══≪ 🌿🍉🍡 ≫═══╚`;

        await conn.sendMessage(m.chat, {
            image: media,
            caption: successMsg,
            mentions: [m.sender]
        }, { quoted: m });

    } catch (err) {
        console.error(err);
        await m.reply(`╗═══≪ 🌿🍉🍡 ≫═══╔
❌ *فشل تغيير صورة الجروب*

⚠️ *السبب:* ${err.message}
╝═══≪ 🌿🍉🍡 ≫═══╚`);
    }
};

handler.help = ['صورة_للجروب'];
handler.tags = ['group'];
handler.command = /^(صورة_للجروب|تغيير_صورة_الجروب|setgrouppp|icon)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;