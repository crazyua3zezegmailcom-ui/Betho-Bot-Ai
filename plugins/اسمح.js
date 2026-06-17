let handler = async (m, { conn, isAdmin, isOwner }) => {
    if (!m.isGroup) return m.reply('🚫 هذا الأمر للجروبات فقط!');
    if (!isAdmin && !isOwner) return m.reply('🚫 هذا الأمر للمشرفين فقط!');

    let user;
    if (m.mentionedJid && m.mentionedJid[0]) {
        user = m.mentionedJid[0];
    } else if (m.quoted && m.quoted.sender) {
        user = m.quoted.sender;
    }

    if (!user) return m.reply(`*[❗] منشن المستخدم أو رد على رسالته لمسح تحذيراته والسماح له.*`);

    const db = global.db.data.users[user];
    if (db) {
        db.antilinkWarnings = 0;
        db.banned = false;
    }

    const st = global.db.data.chats?.[m.chat];
    if (st?.protection) {
        const { protState } = global;
        if (protState && typeof protState.get === 'function') {
            const state = protState.get(m.chat);
            if (state) state.warnCount[user] = 0;
        }
    }

    const name = user.split('@')[0];
    await conn.sendMessage(m.chat, {
        text:
            `╗═══≪ ✅🧩✅ ≫═══╔\n` +
            `🔓 *تم السماح بنجاح*\n\n` +
            `𓆩⃞✅𓆪 *العضو:* @${name}\n` +
            `𓆩⃞🧩𓆪 *بواسطة:* @${m.sender.split('@')[0]}\n\n` +
            `📌 تم مسح جميع التحذيرات السابقة\n` +
            `╝═══≪ ✅🧩✅ ≫═══╚`,
        mentions: [user, m.sender]
    }, { quoted: m });
};

handler.help = ['اسمح @منشن'];
handler.tags = ['group'];
handler.command = /^(اسمح|سماح|allow)$/i;
handler.group = true;
handler.admin = true;

export default handler;
