import { downloadButtons, channelButton } from '../system/buttons.js'
let handler = async (m, { conn, text }) => {
if (!text) throw 'exemple : \n *.ytcomment* 𝐶𝑟𝑎𝑧𝑦 ouafy '
conn.sendFile(m.chat, global.API('https://some-random-api.com', '/canvas/misc/youtube-comment', {
avatar: await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'),
comment: text,
username: conn.getName(m.sender)
}), 'error.png', '*THANKS FOR COMMENT* by @𝐶𝑟𝑎𝑧𝑦 ouafy', m)
}
handler.help = ['تعليق-يوتيوب']
handler.tags = ['tools'] 
handler.command = /^(تعليق-يوتيوب)$/i
handler.limit = true
export default handler
