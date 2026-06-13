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
            return conn.reply(m.chat, `*[ ⚠️ ] الرقم غير صحيح، الرجاء إدخال رقم صالح!*`, m)
        }
    }

    if (!user) return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n*┯┷*\n*┠≽ ${usedPrefix}رفع @منشن*\n*┠≽ ${usedPrefix}رفع (بالرد على رسالة)*\n*┠≽ ${usedPrefix}رفع 2012xxxx*\n*┷┯*`, m)

    try {
        await conn.groupParticipantsUpdate(m.chat, [user], 'promote')
        
        let msg = `╗═══≪ ⚙️🧩⚙️ ≫═══╔
👑 *تمت الترقية بنجاح*

𓆩⃞⚙️𓆪 *المشرف الجديد:* @${user.split('@')[0]}
𓆩⃞🧩𓆪 *بواسطة:* @${m.sender.split('@')[0]}

🎉 *مبروك المنصب الجديد*
╝═══≪ ⚙️🧩⚙️ ≫═══╚`;

        await conn.sendMessage(m.chat, { 
            text: msg,
            mentions: [user, m.sender]
        }, { quoted: m });

    } catch (err) {
        console.error(err)
        conn.reply(m.chat, `❌ *فشلت الترقية، تأكد أن البوت مشرف!*`, m)
    }
}

handler.help = ['ترقيه @منشن', 'ترقيه (بالرد)'].map(v => v)
handler.tags = ['group']
handler.command = /^(ترقيه|رفع|ارفع|promote)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
