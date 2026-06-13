const CHANNEL_URL = 'https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e'

const channelButton = () => [
  {
    buttonId: 'channel',
    buttonText: { displayText: '📢 قناة المطور' },
    type: 1
  }
]

const downloadButtons = (query = '') => [
  {
    buttonId: `download_${query}`.slice(0, 20),
    buttonText: { displayText: '⬇️ تحميل مرة أخرى' },
    type: 1
  },
  {
    buttonId: 'channel',
    buttonText: { displayText: '📢 قناة المطور' },
    type: 1
  }
]

const menuButtons = () => [
  {
    buttonId: 'show_commands',
    buttonText: { displayText: '📂 عرض الأوامر' },
    type: 1
  },
  {
    buttonId: 'show_channel',
    buttonText: { displayText: '📢 قناة المطور' },
    type: 1
  },
  {
    buttonId: 'show_developer',
    buttonText: { displayText: '👑 المطور' },
    type: 1
  }
]

const addButtons = async (conn, jid, message, buttons, quoted) => {
  try {
    if (message.image) {
      await conn.sendMessage(jid, {
        ...message,
        buttons,
        footer: '『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』',
        headerType: 4
      }, { quoted })
      return
    }
    await conn.sendMessage(jid, {
      text: message.text || message.caption || '',
      footer: '『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』',
      buttons,
      headerType: 1
    }, { quoted })
  } catch {
    try {
      await conn.sendMessage(jid, message, { quoted })
    } catch (e) {
      console.error('Send error:', e.message)
    }
  }
}

const handleButtonPress = async (conn, m, handleCommand) => {
  const buttonId = m.message?.buttonsResponseMessage?.selectedButtonId
  if (!buttonId) return

  const jid = m.key.remoteJid

  if (buttonId === 'show_commands') {
    await handleCommand('.اوامر', m, conn)
  }
  if (buttonId === 'show_channel') {
    await conn.sendMessage(jid, {
      text: `📢 *قناة المطور*\n\n${CHANNEL_URL}`
    }, { quoted: m })
  }
  if (buttonId === 'show_developer') {
    await handleCommand('.المطور', m, conn)
  }
  if (buttonId === 'channel') {
    await conn.sendMessage(jid, {
      text: `📢 *قناة المطور*\n\n${CHANNEL_URL}`
    }, { quoted: m })
  }
  if (buttonId.startsWith('download_')) {
    const query = buttonId.replace('download_', '')
    if (query) await handleCommand(`.اغنيه ${query}`, m, conn)
  }
}

export {
  channelButton,
  downloadButtons,
  menuButtons,
  addButtons,
  handleButtonPress,
  CHANNEL_URL
}
