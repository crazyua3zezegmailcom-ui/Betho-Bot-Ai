// .𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥

import fs from 'fs'
import path from 'path'
import axios from 'axios'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'

const handler = async (m, { conn, command }) => {
  const q = m.quoted || m
  const mime = (q.msg || q).mimetype || q.mediaType || ''
  if (!mime) {
    return conn.sendMessage(m.chat, {
      text: `⚠️ أرسل الوسائط مع الأمر *.${command}* أو رد على وسائط بهذا الأمر.`,
    }, { quoted: m })
  }

  // تحميل الوسائط
  const media = await q.download()
  const tempDir = './temp'
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

  const ext = mime.split('/')[1] || 'dat'
  const fileName = `media_${Date.now()}.${ext}`
  const filePath = path.join(tempDir, fileName)
  fs.writeFileSync(filePath, media)

  const buffer = fs.readFileSync(filePath)

  // إرسال رد فعل "جار التحميل"
  await conn.sendMessage(m.chat, {
    react: { text: '⏳', key: m.key }
  })

  // رفع إلى خدمات استضافة الملفات المختلفة
  const uploadToSupa = async (buffer) => {
    try {
      const form = new FormData()
      form.append('file', buffer, 'upload.jpg')
      const res = await axios.post('https://i.supa.codes/api/upload', form, {
        headers: form.getHeaders()
      })
      return res.data?.link || null
    } catch (err) {
      console.error('خطأ Supa:', err?.response?.data || err.message)
      return null
    }
  }

  const uploadToTmpFiles = async (filePath) => {
    try {
      const buf = fs.readFileSync(filePath)
      const { ext, mime } = await fileTypeFromBuffer(buf)
      const form = new FormData()
      form.append('file', buf, {
        filename: `${Date.now()}.${ext}`,
        contentType: mime
      })
      const res = await axios.post('https://tmpfiles.org/api/v1/upload', form, {
        headers: form.getHeaders()
      })
      return res.data.data.url.replace('s.org/', 's.org/dl/')
    } catch (err) {
      console.error('خطأ TmpFiles:', err)
      return null
    }
  }

  const uploadToUguu = async (filePath) => {
    try {
      const form = new FormData()
      form.append('files[]', fs.createReadStream(filePath))
      const res = await axios.post('https://uguu.se/upload.php', form, {
        headers: form.getHeaders()
      })
      return res.data.files?.[0]?.url || null
    } catch (err) {
      console.error('خطأ Uguu:', err)
      return null
    }
  }

  const uploadToFreeImageHost = async (buffer) => {
    try {
      const form = new FormData()
      form.append('source', buffer, 'file')
      const res = await axios.post('https://freeimage.host/api/1/upload', form, {
        params: {
          key: '6d207e02198a847aa98d0a2a901485a5' // استبدل إذا تجاوزت الحصة
        },
        headers: form.getHeaders()
      })
      return res.data.image.url
    } catch (err) {
      console.error('خطأ FreeImageHost:', err?.response?.data || err.message)
      return null
    }
  }

  const [supa, tmp, uguu, freehost] = await Promise.all([
    uploadToSupa(buffer),
    uploadToTmpFiles(filePath),
    uploadToUguu(filePath),
    uploadToFreeImageHost(buffer),
  ])

  let message = '*✅ تم الرفع بنجاح إلى عدة خدمات:*\n'
  if (supa) message += `\n🔗 *أݪــࢪابــــط الاول* ${supa}`
  if (tmp) message += `\n🔗 *الــــࢪابــــط الثــــاني* ${tmp}`
  if (uguu) message += `\n🔗 *الࢪابــــط الــــثالــــث* ${uguu}`
  if (freehost) message += `\n🔗 *FreeImage.Host:* ${freehost}`

  await conn.sendMessage(m.chat, { text: message }, { quoted: m })
  await conn.sendMessage(m.chat, {
    react: { text: '✅', key: m.key }
  })

  // حذف الملف المؤقت
  fs.unlinkSync(filePath)
}

handler.help = ['tourl-pro']
handler.tags = ['uploader']
handler.command = /^(لرابط)$/i
handler.limit = true

export default handler