// @𝐶𝑟𝑎𝑧𝑦_ouafy

import { toPTT } from '../lib/converter.js'
import { channelButton } from '../system/buttons.js'

let handler = async (m, { conn, usedPrefix, command }) => {

  let q = m.quoted ? m.quoted : m
  let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''

  if (!/video|audio/.test(mime)) {
    throw `يرجى الرد على فيديو أو رسالة صوتية بـ *${usedPrefix + command}* لتحويله إلى رسالة صوتية.`
  }

  let media = await q.download?.()
  if (!media) throw 'تعذّر تحميل الوسائط.'

  let audio = await toPTT(media, 'mp4')
  if (!audio.data) throw 'تعذّر تحويل الوسائط إلى رسالة صوتية.'

  await conn.sendFile(m.chat, audio.data, 'audio.mp3', '', m, true, { mimetype: 'audio/mp4' })
  }

handler.help = ['رسالة-صوتية']
handler.tags = ['tools']
handler.command = /^(رسالة-صوتية|ptt)$/i
handler.limit = 4
export default handler
