// حہּٰقَــــوٰقَ 𝐶𝑟𝑎𝑧𝑦 💻🔥
// ملف تغيير_الاسم.js

let handler = async (m, { conn, text, isAdmin, isOwner, isBotAdmin }) => {
    if (!m.isGroup) return m.reply('❌ *هذا الأمر يعمل في الجروبات فقط*');
    if (!isAdmin && !isOwner) return m.reply('❌ *يجب أن تكون مشرفاً لاستخدام هذا الأمر*');
    if (!isBotAdmin) return m.reply('❌ *يجب أن يكون البوت مشرفاً*');
    if (!text) return m.reply(`╗═══≪ 🫐🪻🧩 ≫═══╔\n📝 *يرجى كتابة الاسم الجديد*\n\nمثال:\n.تغيير_الاسم بيثو بوت\n╝═══≪ 🫐🪻🧩 ≫═══╚`);

    try {
        await conn.groupUpdateSubject(m.chat, text);
        
        let successMsg = `╗═══≪ ⚙️🧩⚙️ ≫═══╔
✅ *تم تغيير اسم الجروب*

📝 *الاسم الجديد:* ${text}
👤 *بواسطة:* @${m.sender.split('@')[0]}
📅 *التاريخ:* ${new Date().toLocaleString('ar-EG')}

✨ *تم التحديث بنجاح*
╝═══≪ ⚙️🧩⚙️ ≫═══╚`;

        await conn.sendMessage(m.chat, { text: successMsg, mentions: [m.sender] }, { quoted: m });
    } catch (err) {
        m.reply('❌ *فشل تغيير الاسم، تأكد من صلاحيات البوت*');
    }
};

handler.help = ['تغيير_الاسم'];
handler.tags = ['group'];
handler.command = /^(تغيير_الاسم|الاسم|setname)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;