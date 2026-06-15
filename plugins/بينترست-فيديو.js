import axios from 'axios'
import * as cheerio from 'cheerio'

// الحقوق والزخارف الخاصة بك
const myCredit = `.𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥`
const emojis = `ⲂＹ 𝐶𝑟𝑎𝑧𝑦 3ℝΑＢ 𝒅𝒆𝒗𝒔 🥝👑`

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const url = args[0]
  
  if (!url) return m.reply(`*_هـلا_* 🫠\n\n📌 يـرجـى وضـع الـرابط بـعـد الأمـر\nمثال:\n${usedPrefix + command} https://pin.it/xxxx`)

  await m.reply(`*_هـلا_* ⏳\n\nجـاري الـتـحـمـيـل بـدقـة عـالـيـة...`)

  try {
    const result = await snappinDownload(url)
    if (!result.status) throw result.message

    const captionText = `*_هـلا_*\n\n✅ تـم الـتـحـمـيـل بـنـجـاح\n\n${emojis}\n\nتـم بـواسـطـة\n${myCredit}`

    // الحل الجذري: الإرسال المباشر بدون استخدام مجلد tmp
    if (result.video) {
      await conn.sendMessage(m.chat, { 
          video: { url: result.video }, 
          caption: captionText,
          mimetype: 'video/mp4'
      }, { quoted: m })
    } else if (result.image) {
      await conn.sendMessage(m.chat, { 
          image: { url: result.image }, 
          caption: captionText 
      }, { quoted: m })
    } else {
      m.reply(`*_هـلا_* ❌\n\nلـم يـتـم الـعـثـور عـلى وسـائط.`)
    }

  } catch (err) {
    console.error(err)
    m.reply(`*_هـلا_* ❌\n\nفـشـل الـتـحـمـيـل: ${err}`)
  }
}

handler.help = ['بينترست-فيديو']
handler.command = ['بينترست-فيديو']
handler.tags = ['downloader']

export default handler

// ===== 🔽 FUNCTION: Snappin Scraper
export async function snappinDownload(pinterestUrl) {
  try {
    const { csrfToken, cookies } = await getSnappinToken()

    const postRes = await axios.post(
      'https://snappin.app/',
      { url: pinterestUrl },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
          Cookie: cookies,
          Referer: 'https://snappin.app',
          Origin: 'https://snappin.app',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    )

    const $ = cheerio.load(postRes.data)
    const thumb = $('img').attr('src')

    const downloadLinks = $('a.button.is-success')
      .map((_, el) => $(el).attr('href'))
      .get()

    let videoUrl = null
    let imageUrl = null

    for (const link of downloadLinks) {
      const fullLink = link.startsWith('http') ? link : 'https://snappin.app' + link
      const head = await axios.head(fullLink).catch(() => null)
      const contentType = head?.headers?.['content-type'] || ''

      if (link.includes('/download-file/')) {
        if (contentType.includes('video')) {
          videoUrl = fullLink
        } else if (contentType.includes('image')) {
          imageUrl = fullLink
        }
      } else if (link.includes('/download-image/')) {
        imageUrl = fullLink
      }
    }

    return {
      status: true,
      thumb,
      video: videoUrl,
      image: videoUrl ? null : imageUrl
    }

  } catch (err) {
    return {
      status: false,
      message: err?.response?.data?.message || err.message || 'Unknown Error'
    }
  }
}

async function getSnappinToken() {
  const { headers, data } = await axios.get('https://snappin.app/')
  const cookies = headers['set-cookie'].map(c => c.split(';')[0]).join('; ')
  const $ = cheerio.load(data)
  const csrfToken = $('meta[name="csrf-token"]').attr('content')
  return { csrfToken, cookies }
}