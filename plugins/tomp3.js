import { toAudio } from '../lib/converter.js'
import { downloadButtons } from '../system/buttons.js'

let handler = async (m, { conn, usedPrefix, command }) => {
    let chat = global.db.data.chats[m.chat]
    let q = m.quoted ? m.quoted : m
    let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
    
    if (!/video|audio/.test(mime)) throw `أرجو الرد على فيديو أو تسجيل صوتي لتحويله إلى صوت mp3 using the caption *${usedPrefix + command}*`
    
    let media = await q.download?.()
    if (!media) throw 'تعذّر تحميل الوسائط'
    
    let audio = await toAudio(media, 'mp4')
    if (!audio.data) throw 'تعذّر تحويل الوسائط إلى صوت'
    
    conn.sendFile(m.chat, audio.data, 'audio.mp3', '', m, null, { mimetype: 'audio/mp4', asDocument: chat.useDocument })
}

handler.help = ['تحويل-لصوت']
handler.tags = ['tools']
handler.command = /^(تحويل-لصوت|تحويل-لصوت-مفصل)$/i
handler.limit = true 
export default handler
