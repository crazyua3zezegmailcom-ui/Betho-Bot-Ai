// ══════════════════════════════════════════════
//  🧪 تست — اختبار تشغيل البوت
// ══════════════════════════════════════════════

const fallbackUrl = "https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg"

const handler = async (m, { conn }) => {
  const name    = m.pushName || 'يوزر'
  const ping    = Date.now() % 999 + 1
  const uptime  = process.uptime()
  const h       = Math.floor(uptime / 3600)
  const min     = Math.floor((uptime % 3600) / 60)
  const sec     = Math.floor(uptime % 60)

  const caption =
    `╔══════════════════════════════╗\n` +
    `║        🧪 تيست البوت         ║\n` +
    `╚══════════════════════════════╝\n\n` +
    `✅ البوت شغال يا *${name}*!\n` +
    `⚡ *البينج:* ${ping}ms\n` +
    `⏳ *وقت التشغيل:* ${h}س ${min}د ${sec}ث\n` +
    `🤖 *البوت:* ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥\n` +
    `👨‍💻 *المطور:* 𝐶𝑟𝑎𝑧𝑦`

  await conn.sendMessage(m.chat, {
    product: {
      productImage:      { url: fallbackUrl },
      productId:         '24529689176623820',
      title:             '⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥',
      description:       '𝐵𝑦 𝐶𝑟𝑎𝑧𝑦 👑',
      currencyCode:      'USD',
      priceAmount1000:   '0',
      retailerId:        '🧪 TEST',
      productImageCount: 1
    },
    businessOwnerJid: '201116571308@s.whatsapp.net',
    caption,
    footer: '⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕ البوت يعمل بكفاءة 💚',
    interactiveButtons: [
      {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
          display_text: "🌐 موقع البوت",
          url: "https://codepen.io/Betho-Bot-/full/xbggjOo"
        })
      },
      {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
          display_text: "📢 قناة البوت",
          url: "https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e"
        })
      }
    ]
  }, { quoted: m })
}

handler.command  = /^(test|تست|تيست|ping|بينج)$/i
handler.usage    = ['test']
handler.category = 'main'

export default handler
