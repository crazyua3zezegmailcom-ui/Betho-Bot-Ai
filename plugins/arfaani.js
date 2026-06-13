// ارفعني - ترقية المطور أدمن

const handler = async (m, { conn }) => {
  try {
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote')
    await m.reply(
      '*•.¸♡¸.•**•.¸♡¸.•**•.¸♡¸.•**•.¸♡¸.•*\n' +
      '✨🌌 ╔══「 ترقية 」══╗ 🌌✨\n' +
      '        ║  👑 Promoted  ║\n' +
      '✨🌌 ╚══════════════════════╝ 🌌✨\n' +
      '*•.¸♡¸.•**•.¸♡¸.•**•.¸♡¸.•**•.¸♡¸.•*\n\n' +
      '*تم رفعك أدمن يا مطوري 🌹*'
    )
  } catch {
    await m.reply('❌ تعذّر الرفع — تأكد إن البوت أدمن')
  }
}

handler.usage    = ['ارفعني']
handler.category = 'owner'
handler.command  = ['ارفعني']
handler.owner    = true
handler.botAdmin = true
handler.bot      = false

export default handler
