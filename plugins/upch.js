/**
⧉ feature : [upch]
⧉ source  : [https://whatsapp.com/channel/0029Vb67i65Fi8xX7rOtIc2S]
⧉ creator : [Hanz]
**/

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `Example:\n${usedPrefix + command} Hello world`
    }

    const idch = '120363428186936884@newsletter'
    const thumbUrl = 'https://i.postimg.cc/Fsx4fvfK/IMG-20260610-WA0075.jpg'

    let thumbnail = await fetch(thumbUrl)
        .then(res => res.buffer())
        .catch(() => null)

    await conn.sendMessage(m.chat, {
        react: { text: '😒', key: m.key }
    })

    let content = {
        text: text,
        contextInfo: {
            externalAdReply: {
                title: 'BETHO BOT - AI | بيثو بوت',
                body: 'https://instagram.com/𝐶𝑟𝑎𝑧𝑦_ouafy',
                thumbnail: thumbnail,
                mediaType: 1,
                renderLargerThumbnail: true,
                showAdAttribution: false
            }
        }
    }

    await conn.sendMessage(idch, content)

    await conn.sendMessage(m.chat, {
        react: { text: '✅', key: m.key }
    })

    m.reply('✅ Done. If you keep asking, that’s outside the system.')
}

handler.command = /^(رفع-ch)$/i
handler.help = ['رفع-ch']
handler.tags = ['owner']
handler.mods = true

export default handler
