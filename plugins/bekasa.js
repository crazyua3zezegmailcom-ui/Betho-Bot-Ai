// بكاسه - طرد عضو من المجموعة

const handler = async (m, { conn }) => {
  const chat = m.chat

  let target = null
  if (m.mentionedJid?.[0]) {
    target = m.mentionedJid[0]
  } else if (m.quoted) {
    target = m.quoted.sender || m.quoted.participant
  }

  if (!target)
    return m.reply('❌ عمل منشن على العضو أو ريبلاي على رسالته')

  const meta = await conn.groupMetadata(chat)
  const participant = meta.participants.find(p =>
    p.id.split(':')[0].split('@')[0] ===
    target.split(':')[0].split('@')[0]
  )

  if (!participant)
    return m.reply('❌ العضو ده مش في المجموعة')

  if (['admin', 'superadmin'].includes(participant.admin))
    return m.reply('❌ مينفعش تطرد أدمن')

  try {
    await conn.groupParticipantsUpdate(chat, [participant.id], 'remove')
    await conn.sendMessage(chat, {
      text:
        `👢 *تم طرد @${participant.id.split('@')[0]}*\n` +
        `📌 بواسطة: @${m.sender.split('@')[0]}`,
      mentions: [participant.id, m.sender]
    })
  } catch {
    await m.reply('❌ تعذّر الطرد — تأكد إن البوت أدمن')
  }
}

handler.command  = ['بكاسه']
handler.usage    = ['بكاسه']
handler.category = 'admin'
handler.group    = true
handler.admin    = true
handler.botAdmin = true
handler.bot      = false

export default handler
