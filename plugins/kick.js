import { channelButton } from '../system/buttons.js'
let handler = async (m, { conn, text, participants }) => {

    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : text ? (text.replace(/\D/g, '') + '@s.whatsapp.net') : ''
    if (!who || who == m.sender) throw 'رد على عضو أو وسّمه'
    if (participants.filter(v => v.jid == who).length == 0) throw `المستخدم المستهدف ليس في المجموعة!`
    conn.groupParticipantsUpdate(m.chat, [who], 'remove')
        .then(_ => m.reply('✅ تم الطرد بنجاح'))
    }

handler.help = ['طرد']
handler.tags = ['owner']
handler.command = /^(طرد)$/i

handler.owner = true 
handler.group = true
handler.botAdmin = true
handler.admin = true

export default handler
