import crypto from "crypto"
import axios from "axios"

class SaveTube {
  constructor() {
    this.ky = 'C5D58EF67A7584E4A29F6C35BBC4EB12'
    this.m = /^((?:https?:)?\/\/)?((?:www|m|music)\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(?:embed\/)?(?:v\/)?(?:shorts\/)?([a-zA-Z0-9_-]{11})/
    this.is = axios.create({
      headers: {
        'content-type': 'application/json',
        'origin': 'https://yt.savetube.me',
        'user-agent': 'Mozilla/5.0 (Android 15; Mobile)'
      }
    })
  }

  async decrypt(enc) {
    if (!enc) throw new Error("البيانات المشفرة فارغة - الـ API لم يرجع بيانات")
    const buf = Buffer.from(enc, 'base64')
    const key = Buffer.from(this.ky, 'hex')
    const iv = buf.slice(0, 16)
    const data = buf.slice(16)
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()])
    return JSON.parse(decrypted.toString())
  }

  async getCdn() {
    const res = await this.is.get("https://media.savetube.vip/api/random-cdn")
    if (!res.data?.cdn) throw new Error("فشل في الحصول على CDN")
    return res.data.cdn
  }

  async download(url) {
    if (!this.m.test(url)) throw "رابط يوتيوب غير صالح"

    const cdn = await this.getCdn()

    const info = await this.is.post(`https://${cdn}/v2/info`, { url })
    if (!info.data?.status || !info.data?.data) {
      throw `فشل الاستعلام عن الفيديو: ${info.data?.message || 'خطأ غير معروف'}`
    }

    const dec = await this.decrypt(info.data.data)

    const dl = await this.is.post(`https://${cdn}/download`, {
      id: dec.id,
      downloadType: 'audio',
      quality: '128',
      key: dec.key
    })

    if (!dl.data?.data?.downloadUrl) {
      throw "فشل في الحصول على رابط التحميل"
    }

    return {
      title: dec.title,
      duration: dec.durationLabel || String(dec.duration),
      thumb: dec.thumbnail,
      download: dl.data.data.downloadUrl
    }
  }
}

/* ================= المعالج ================= */

let handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return m.reply(
      `❌ الاستخدام:\n.صوت <رابط_يوتيوب>\n\nمثال:\n.صوت https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e`
    )
  }

  const url = args[0]
  const st = new SaveTube()

  try {
    m.reply("جــــاࢪي الــــتحــــمــــيل مــــن يــــوتيــــوب مـــقــــطع صــــوتــــي.............")

    const res = await st.download(url)

    let caption = `
🎵 *اــــسم الاغــــنــــيه :* ${res.title}
⏱ *مــــدت الــــمــــقــــطــــ؏ الصــــوتــــي🍇:* ${res.duration}
📦 *الــــصــــيغــــه الــــمــــطلــــوبــــه:* MP3
`

    await conn.sendMessage(m.chat, {
      audio: { url: res.download },
      mimetype: 'audio/mpeg',
      fileName: `${res.title}.mp3`,
      caption
    }, { quoted: m })

  } catch (e) {
    m.reply(`❌ خطأ: ${e?.message || e}`)
  }
}

handler.help = ['صوت']
handler.command = ['صوت']
handler.tags = ['download']

export default handler
