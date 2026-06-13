import { channelButton } from '../system/buttons.js'
/*
`PLUGIN SEND MESSAGE TO CHANNEL`
Note:
This plugin sends a message to a specified WhatsApp channel.
*/

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw(`Example:\n${usedPrefix}${command} Hello?`)
    conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    let idch = '120363428186936884@newsletter'
    let who = m.sender
    let username = conn.getName(who)

    await conn.sendMessage(`${idch}`, {
        text: `${text}`
    })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    m.reply('Your message has been sent. Please check your channel.')
}

handler.command = /^(رسالة-للقناة)$/i
handler.help = ['رسالة-للقناة']
handler.tags = ['owner']
handler.owner = true
export default handler
