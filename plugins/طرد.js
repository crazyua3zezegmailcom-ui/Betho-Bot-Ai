// حہּٰقَــــوٰقَ 𝐶𝑟𝑎𝑧𝑦 💻🔥
// ملف طرد.js - طرد عضو من المجموعة

let handler = async (m, { conn, usedPrefix, text, isAdmin, isOwner }) => {
    if (!isAdmin && !isOwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمشرفين فقط!*', m)

    let user;
    if (m.mentionedJid && m.mentionedJid[0]) {
        user = m.mentionedJid[0]
    } else if (m.quoted && m.quoted.sender) {
        user = m.quoted.sender
    } else if (text) {
        let number = text.replace(/[^0-9]/g, '')
        if (number.length >= 11 && number.length <= 13) {
            user = number + '@s.whatsapp.net'
        } else {
            return conn.reply(m.chat, `*[ ⚠️ ] الرقم غير صحيح!*`, m)
        }
    }

    if (!user) return conn.reply(m.chat, `*[❗] منشن العضو المراد طرده!*`, m)

    try {
        await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
        
        let msg = `╗═══≪ 🌿🍉🍡 ≫═══╔
🚪 *تم الطرد بنجاح*

𓆩⃞🍒𓆪 *المطرود:* @${user.split('@')[0]}
𓆩⃞🍇𓆪 *بواسطة:* @${m.sender.split('@')[0]}

👋 *مع السلامة يا بطل*
╝═══≪ 🌿🍉🍡 ≫═══╚`;

        await conn.sendMessage(m.chat, { 
            text: msg,
            mentions: [user, m.sender]
        }, { quoted: m });

    } catch (err) {
        conn.reply(m.chat, `❌ *فشلت العملية، تأكد أن البوت مشرف!*`, m)
    }
}

handler.help = ['طرد @منشن']
handler.tags = ['group']
handler.command = /^(طرد|احذف|kick|remove)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler