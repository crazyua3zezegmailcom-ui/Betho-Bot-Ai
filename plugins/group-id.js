import { channelButton } from '../system/buttons.js'


let handler = async (m, {
    conn,
    groupMetadata
}) => {
    conn.reply(m.chat, `${await groupMetadata.id}`, m)
}
handler.help = ['معرف-المجموعة']
handler.tags = ['owner']
handler.command = /^(معرف-المجموعة|معرف-مجموعة|رقم-المجموعة)$/i
handler.group = true
handler.owner = true
export default handler
