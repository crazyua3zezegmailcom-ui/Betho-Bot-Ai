import axios from 'axios'
import cheerio from 'cheerio'

// الحقوق والزخارف الخاصة بك
const myCredit = `.𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢`
const emojis = `ⲂＹ 𝐶𝑟𝑎𝑧𝑦 3ℝΑＢ 𝒅𝒆𝒗𝒔 🥝👑`

class MediaFire {
  constructor() {
    this.client = axios.create({
      timeout: 30000,
      maxRedirects: 5,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
      }
    })
  }

  async getFileInfo(url) {
    const res = await this.client.get(url)
    const $ = cheerio.load(res.data)

    const link = $('#downloadButton').attr('href') || null
    const name =
      $('.dl-btn-label').attr('title') ||
      $('.promoDownloadName .dl-btn-label').text().trim() ||
      'file'

    const size =
      $('.download_link .input').text().match(/\(([^)]+)\)/)?.[1] ||
      $('.details .size').text().trim() ||
      '-'

    return { link, name, size }
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`*_هـلا_* 🫠\n\n📌 يـرجـى وضـع رابـط مـيـديـافـايـر بـعـد الأمـر.\nمـثـال:\n${usedPrefix + command} https://www.mediafire.com/file/xxxx`)

  if (!text.includes('mediafire.com')) {
    return m.reply(`*_هـلا_* ❌\n\nالـرابـط الـذي أرسـلـتـه لـيـس رابـط مـيـديـافـايـر صـحـيـح.`)
  }

  await m.reply(`*_هـلا_* ⏳\n\nجـاري تـحـلـيـل الـرابـط وجـلـب الـمـلـف...`)

  try {
    const mf = new MediaFire()
    const res = await mf.getFileInfo(text)

    if (!res.link) {
      throw new Error('لـم يـتـم الـعـثـور عـلى رابـط الـتـحـمـيـل.')
    }

    const captionText = `*_هـلا_*\n\n✅ تـم الـتـحـمـيـل بـنـجـاح\n\n📄 *الاسـم:* ${res.name}\n📦 *الـحـجـم:* ${res.size}\n\n${emojis}\n\nتـم بـواسـطـة\n${myCredit}`

    // إرسال الملف مباشرة كوثيقة (Document) لضمان الجودة وبدون حفظ في tmp
    await conn.sendMessage(m.chat, {
      document: { url: res.link },
      fileName: res.name,
      mimetype: 'application/octet-stream',
      caption: captionText
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply(`*_هـلا_* ❌\n\nفـشـل فـي جـلـب الـمـلـف: ${e.message}`)
  }
}

handler.help = ['ميديافاير']
handler.command = ['ميديافاير']
handler.tags = ['downloader']

export default handler