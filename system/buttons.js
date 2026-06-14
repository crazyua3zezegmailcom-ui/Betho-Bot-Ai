const CHANNEL_URL = 'https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e'
const DEVELOPER_NUMBER = '201214057674'

const channelButton = () => [
  {
    buttonId: 'open_channel',
    buttonText: { displayText: '📢 القناة' },
    type: 1
  }
]

const downloadButtons = (query = '') => {
  const id = String(query).replace(/\s+/g, '_').slice(0, 15)
  return [
    {
      buttonId: `dl_audio_${id}`,
      buttonText: { displayText: '🎵 تحميل صوت' },
      type: 1
    },
    {
      buttonId: `dl_video_${id}`,
      buttonText: { displayText: '🎬 تحميل فيديو' },
      type: 1
    },
    {
      buttonId: 'open_channel',
      buttonText: { displayText: '📢 القناة' },
      type: 1
    }
  ]
}

const menuButtons = () => [
  {
    buttonId: 'show_developer',
    buttonText: { displayText: '👨‍💻 المطور' },
    type: 1
  },
  {
    buttonId: 'show_commands',
    buttonText: { displayText: '📋 الأوامر' },
    type: 1
  },
  {
    buttonId: 'open_channel',
    buttonText: { displayText: '📢 القناة' },
    type: 1
  }
]

const downloaderCategoryButtons = () => [
  {
    buttonId: 'dl_youtube',
    buttonText: { displayText: '🎵 يوتيوب mp3' },
    type: 1
  },
  {
    buttonId: 'dl_tiktok',
    buttonText: { displayText: '🎬 تيك توك' },
    type: 1
  },
  {
    buttonId: 'open_channel',
    buttonText: { displayText: '📢 القناة' },
    type: 1
  }
]

const searchCategoryButtons = () => [
  {
    buttonId: 'search_google',
    buttonText: { displayText: '🔍 بحث جوجل' },
    type: 1
  },
  {
    buttonId: 'search_img',
    buttonText: { displayText: '🖼️ بحث صور' },
    type: 1
  },
  {
    buttonId: 'open_channel',
    buttonText: { displayText: '📢 القناة' },
    type: 1
  }
]

const addButtons = async (conn, jid, message, buttons, quoted) => {
  try {
    if (message.image) {
      await conn.sendMessage(jid, {
        ...message,
        footer: '『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』'
      }, { quoted })
      return
    }
    await conn.sendMessage(jid, {
      text: message.text || message.caption || '',
      footer: '『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』'
    }, { quoted })
  } catch (e) {
    try {
      await conn.sendMessage(jid, message, { quoted })
    } catch (err) {
      console.error('Send error:', err.message)
    }
  }
}

const handleButtonPress = async (conn, m, handleCommand) => {
  const buttonId = m.message?.buttonsResponseMessage?.selectedButtonId
  if (!buttonId) return
  const jid = m.key.remoteJid
  if (buttonId === 'show_commands') {
    await handleCommand('.اوامر', m, conn)
  } else if (buttonId === 'open_channel') {
    await conn.sendMessage(jid, { text: `📢 *قناة المطور*\n\n${CHANNEL_URL}` }, { quoted: m })
  } else if (buttonId === 'show_developer') {
    await handleCommand('.المطور', m, conn)
  } else if (buttonId === 'dl_youtube') {
    await conn.sendMessage(jid, { text: `أرسل:\n*.يوتيوب-mp3 رابط_أو_اسم_الأغنية*\nأو\n*.يوتيوب-mp4 رابط_أو_اسم_الفيديو*` }, { quoted: m })
  } else if (buttonId === 'dl_tiktok') {
    await conn.sendMessage(jid, { text: `أرسل:\n*.تيك-توك رابط_الفيديو*` }, { quoted: m })
  } else if (buttonId === 'search_google') {
    await conn.sendMessage(jid, { text: `أرسل:\n*.بحث الكلمة*` }, { quoted: m })
  } else if (buttonId === 'search_img') {
    await conn.sendMessage(jid, { text: `أرسل:\n*.بحث-صور-بينج الكلمة*` }, { quoted: m })
  } else if (buttonId.startsWith('dl_audio_')) {
    const query = buttonId.replace('dl_audio_', '').replace(/_/g, ' ')
    if (query) await handleCommand(`.يوتيوب-mp3 ${query}`, m, conn)
  } else if (buttonId.startsWith('dl_video_')) {
    const query = buttonId.replace('dl_video_', '').replace(/_/g, ' ')
    if (query) await handleCommand(`.يوتيوب-mp4 ${query}`, m, conn)
  }
}

export {
  channelButton,
  downloadButtons,
  menuButtons,
  downloaderCategoryButtons,
  searchCategoryButtons,
  addButtons,
  handleButtonPress,
  CHANNEL_URL,
  DEVELOPER_NUMBER
}
