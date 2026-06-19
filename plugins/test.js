// ══════════════════════════════════════════════
//  🧪 تست — اختبار تشغيل البوت
// ══════════════════════════════════════════════

const handler = async (m, { conn }) => {
  const name = m.pushName || 'يوزر'
  await conn.sendMessage(m.chat, {
    text:
      `╔══════════════════════════════╗\n` +
      `║        🧪 تيست البوت         ║\n` +
      `╚══════════════════════════════╝\n\n` +
      `✅ البوت شغال يا *${name}*!\n` +
      `⚡ البينج: ${Date.now() % 999 + 1}ms\n` +
      `🤖 البوت: ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥\n` +
      `👨‍💻 المطور: 𝐶𝑟𝑎𝑧𝑦`
  }, { quoted: m })
}

handler.command = /^(test|تست|تيست|ping|بينج)$/i
handler.usage   = ['test']
handler.category = 'main'

export default handler
