// حہּٰقَــــوٰقَ 𝐶𝑟𝑎𝑧𝑦 💻🔥
// ملف تغيير_الوصف.js

let handler = async (m, { conn, text, isAdmin, isOwner, isBotAdmin }) => {
    if (!m.isGroup) return m.reply('❌ *هذا الأمر يعمل في الجروبات فقط*');
    if (!isAdmin && !isOwner) return m.reply('❌ *يجب أن تكون مشرفاً لاستخدام هذا الأمر*');
    if (!isBotAdmin) return m.reply('❌ *يجب أن يكون البوت مشرفاً*');
    if (!text) return m.reply(`╗═══≪ 🌿🍉🍡 ≫═══╔\n📝 *يرجى كتابة الوصف الجديد*\n\nمثال:\n.تغيير_الوصف أهلاً بكم في جروبنا المتواضع\n╝═══≪ 🌿🍉🍡 ≫═══╚`);

    try {
        await conn.groupUpdateDescription(m.chat, text);
        
        let successMsg = `╗═══≪ 🌿🍉🍡 ≫═══╔
✅ *تم تغيير وصف الجروب*

📜 *الوصف الجديد:* ${text}

👤 *بواسطة:* @${m.sender.split('@')[0]}
📅 *التاريخ:* ${new Date().toLocaleString('ar-EG')}
╝═══≪ 🌿🍉🍡 ≫═══╚`;

        await conn.sendMessage(m.chat, { text: successMsg, mentions: [m.sender] }, { quoted: m });
    } catch (err) {
        m.reply('❌ *فشل تغيير الوصف، تأكد من صلاحيات البوت*');
    }
};

handler.help = ['تغيير_الوصف'];
handler.tags = ['group'];
handler.command = /^(تغيير_الوصف|الوصف|setdesc)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;