import { channelButton } from '../system/buttons.js'
let handler = async (m, { conn, text, participants}) => {

	
    let users = participants.map(u => u.id).filter(v => v !== conn.user.jid)
    if (!m.quoted) throw `✳️ رد على رسالة`
    conn.sendMessage(m.chat, { forward: m.quoted.fakeObj, mentions: users } )
    }

handler.help =['منشن']
handler.tags = ['owner']
handler.command = /^(منشن)$/i
handler.admin = true
handler.group = true
export default handler
