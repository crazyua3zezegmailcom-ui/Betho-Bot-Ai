// .𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥

import fs from 'fs'
import path from 'path'
import axios from 'axios'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'

// ─── رفع عبر 0x0.st ──────────────────────────────────────
async function uploadTo0x0(buffer, fileName, mimeType) {
  const form = new FormData()
  form.append('file', buffer, { filename: fileName, contentType: mimeType })

  const res = await axios.post('https://0x0.st', form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    timeout: 60000
  })

  const url = (res.data || '').trim()
  if (!url.startsWith('http')) throw new Error('رابط غير صحيح من 0x0.st')
  return url
}

// ─── رفع عبر uguu.se (احتياطي) ───────────────────────────
async function uploadToUguu(buffer, fileName, mimeType) {
  const form = new FormData()
  form.append('files[]', buffer, { filename: fileName, contentType: mimeType })

  const res = await axios.post('https://uguu.se/upload.php', form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    timeout: 60000
  })

  const data = res.data
  const url = data?.files?.[0]?.url || data?.files?.[0]
  if (!url || !url.startsWith('http')) throw new Error('رابط غير صحيح من uguu.se')
  return url
}

// ─── الهاندلر الرئيسي ─────────────────────────────────────
const handler = async (m, { conn, command }) => {
  const q    = m.quoted || m
  const mime = (q.msg || q).mimetype || q.mediaType || ''

  if (!mime) {
    return conn.sendMessage(m.chat, {
      text: `⚠️ أرسل الوسائط مع الأمر *.${command}* أو رد على وسائط بهذا الأمر.`
    }, { quoted: m })
  }

  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

  let media
  try {
    media = await q.download()
  } catch (e) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    return conn.sendMessage(m.chat, {
      text: '❌ تعذّر تحميل الملف، تأكد من الرد على وسائط صحيحة.'
    }, { quoted: m })
  }

  const fileInfo = await fileTypeFromBuffer(media)
  const ext      = fileInfo?.ext || mime.split('/')[1] || 'dat'
  const mimeType = fileInfo?.mime || mime
  const fileName = `media_${Date.now()}.${ext}`

  let url = null
  let usedService = ''

  // حاول 0x0.st أولاً
  try {
    url = await uploadTo0x0(media, fileName, mimeType)
    usedService = '0x0.st'
  } catch (e1) {
    console.error('0x0.st فشل:', e1.message)
    // احتياطي: uguu.se
    try {
      url = await uploadToUguu(media, fileName, mimeType)
      usedService = 'uguu.se'
    } catch (e2) {
      console.error('uguu.se فشل:', e2.message)
    }
  }

  if (!url) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    return conn.sendMessage(m.chat, {
      text: '❌ فشل الرفع على جميع الخوادم، حاول لاحقاً.'
    }, { quoted: m })
  }

  await conn.sendMessage(m.chat, {
    text: `🔗 *الرابط:*\n${url}`
  }, { quoted: m })

  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}

handler.help    = ['لرابط']
handler.tags    = ['uploader']
handler.command = /^(لرابط)$/i
handler.limit   = true

export default handler
