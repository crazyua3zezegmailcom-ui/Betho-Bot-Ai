// ══════════════════════════════════════════════
//  🌐 موقع — رابط الموقع الرسمي للبوت
// ══════════════════════════════════════════════

const handler = async (m, { conn }) => {
  const img = 'https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg'
  const url  = 'https://codepen.io/Betho-Bot-/full/xbggjOo'

  let imgBuffer
  try {
    const res = await fetch(img)
    imgBuffer  = Buffer.from(await res.arrayBuffer())
  } catch (_) {
    imgBuffer = null
  }

  const caption =
    `╔══════════════════════════════╗\n` +
    `║      🌐 موقع البوت الرسمي    ║\n` +
    `╚══════════════════════════════╝\n\n` +
    `🤖 *⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥*\n\n` +
    `🔗 *رابط الموقع:*\n${url}\n\n` +
    `👨‍💻 *المطور:* 𝐶𝑟𝑎𝑧𝑦\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `_اضغط على الرابط لزيارة الموقع_ 👆`

  if (imgBuffer) {
    await conn.sendMessage(m.chat, {
      image: imgBuffer,
      caption
    }, { quoted: m })
  } else {
    await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
  }
}

handler.command  = /^(موقع|website|site|ويب|web)$/i
handler.usage    = ['موقع']
handler.category = 'main'

export default handler
