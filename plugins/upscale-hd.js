/* 
• Upscale Plugin (HD Photo)
• Source: https://whatsapp.com/channel/0029VakezCJDp2Q68C61RH2C
• Source Scrape: https://whatsapp.com/channel/0029Vb5blhMEawdx2QFALZ1D
*/

import fetch from 'node-fetch'
import FormData from 'form-data'
import { channelButton } from '../system/buttons.js'

let handler = async (m, { conn, usedPrefix, command }) => {
  const quoted = m.quoted ? m.quoted : m
  const mime = quoted.mimetype || quoted.msg?.mimetype || ''

  if (!/image\/(jpe?g|png)/i.test(mime)) {
    await conn.sendMessage(m.chat, { react: { text: '❗', key: m.key } })
    return m.reply(`Send or *reply to an image* with the command:\n*${usedPrefix + command}*`)
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    const media = await quoted.download()
    const ext = mime.split('/')[1]
    const filename = `upscaled_${Date.now()}.${ext}`

    const form = new FormData()
    form.append('image', media, { filename, contentType: mime })
    form.append('scale', '2')

    const headers = {
      ...form.getHeaders(),
      'accept': 'application/json',
      'x-client-version': 'web',
      'x-locale': 'en'
    }

    const res = await fetch('https://api2.pixelcut.app/image/upscale/v1', {
      method: 'POST',
      headers,
      body: form
    })

    const json = await res.json()

    if (!json?.result_url || !json.result_url.startsWith('http')) {
      throw new Error('Failed to retrieve result URL from Pixelcut.')
    }

    const resultBuffer = await (await fetch(json.result_url)).buffer()

    await conn.sendMessage(m.chat, {
      image: resultBuffer,
      caption: `
✨ Your image has been upscaled to 2x resolution.

📈 Sharper quality & clearer details.

🔧 _Use this feature anytime to enhance blurry images._
`.trim()
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (err) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply(`❌ Upscaling failed:\n${err.message || err}`)
  }
}

handler.help = ['تحسين-دقة-عالية']
handler.tags = ['editor']
handler.command = /^تحسين-دقة-عالية$/i
handler.limit = true
export default handler
