// instagram.com/𝐶𝑟𝑎𝑧𝑦_ouafy

import axios from 'axios'
import { downloadButtons } from '../system/buttons.js'

let handler = async (m, { text, command, conn }) => {
  if (!text) return m.reply('⛔ المرجو إدخال رابط TikTok للتحميل')

  try {
    const encodedParams = new URLSearchParams()
    encodedParams.set("url", text)
    encodedParams.set("hd", "1")

    const response = await axios({
      method: "POST",
      url: "https://tikwm.com/api/",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Cookie: "current_language=en",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
      },
      data: encodedParams,
    })

    let res = response.data.data
    await conn.sendFile(m.chat, res.play, 'tiktok.mp4', `🎬 ${res.title || 'لا يوجد عنوان'}`, m)
    await conn.sendMessage(m.chat, {
      text: `🎬 *${res.title || 'تيك توك'}*`,
      footer: '『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』',
      buttons: downloadButtons()
    }, { quoted: m })
  } catch (e) {
    console.error(e)
    m.reply('❌ حدث خطأ أثناء تحميل فيديو TikTok')
  }
}

handler.command = ['تيك-توك']
handler.help = ['تيك-توك']
handler.tags = ['downloader']
handler.limit = true 
export default handler
