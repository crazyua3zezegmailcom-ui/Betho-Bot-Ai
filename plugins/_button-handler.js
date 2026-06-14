import { CHANNEL_URL } from '../system/buttons.js'

let handler = (m) => m;

handler.before = async function (m, { conn }) {
  try {
    if (m.mtype !== 'buttonsResponseMessage') return false

    const buttonId = m.msg?.selectedButtonId
    if (!buttonId) return false

    if (buttonId === 'open_channel') {
      await conn.sendMessage(m.chat, {
        text: `📢 *قناة المطور*\n\n${CHANNEL_URL}`
      }, { quoted: m })
      return true
    }

    if (buttonId === 'show_commands') {
      m.text = '.اوامر'
      return false
    }

    if (buttonId === 'show_developer') {
      m.text = '.المطور'
      return false
    }

    if (buttonId === 'dl_youtube') {
      await conn.sendMessage(m.chat, {
        text: `أرسل:\n*.يوتيوب-mp3 رابط_أو_اسم_الأغنية*\nأو\n*.يوتيوب-mp4 رابط_أو_اسم_الفيديو*`
      }, { quoted: m })
      return true
    }

    if (buttonId === 'dl_tiktok') {
      await conn.sendMessage(m.chat, {
        text: `أرسل:\n*.تيك-توك رابط_الفيديو*`
      }, { quoted: m })
      return true
    }

    if (buttonId === 'search_google') {
      await conn.sendMessage(m.chat, {
        text: `أرسل:\n*.بحث الكلمة*`
      }, { quoted: m })
      return true
    }

    if (buttonId === 'search_img') {
      await conn.sendMessage(m.chat, {
        text: `أرسل:\n*.بحث-صور-بينج الكلمة*`
      }, { quoted: m })
      return true
    }

    if (buttonId.startsWith('dl_audio_')) {
      const query = buttonId.replace('dl_audio_', '').replace(/_/g, ' ').trim()
      if (query) m.text = `.يوتيوب-mp3 ${query}`
      return false
    }

    if (buttonId.startsWith('dl_video_')) {
      const query = buttonId.replace('dl_video_', '').replace(/_/g, ' ').trim()
      if (query) m.text = `.يوتيوب-mp4 ${query}`
      return false
    }

  } catch (e) {
    console.error('[button-handler]', e)
  }
  return false
}

export default handler
