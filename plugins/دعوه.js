// حہّٰقَـــوٰقَ 𝐶𝑟𝑎𝑧𝑦 💻🔥
// أمر دعوه — يبعت دعوة مجموعة حقيقية للشخص (للأدمن فقط)

let handler = async (m, { conn, text, isAdmin, isOwner, usedPrefix, command }) => {

  if (!text) return m.reply(
    `╔══════════════════╗\n` +
    `║   📨 *أمر الدعوة*   ║\n` +
    `╚══════════════════╝\n\n` +
    `📌 *الاستخدام:*\n` +
    `${usedPrefix}${command} <رقم الهاتف>\n\n` +
    `📝 *مثال:*\n` +
    `${usedPrefix}${command} 201012345678`
  )

  // ─── تنظيف الرقم ───
  const number = text.replace(/[^0-9]/g, '')
  if (number.length < 7 || number.length > 15) {
    return m.reply('❌ *رقم غير صحيح، أدخل الرقم مع مفتاح الدولة*\nمثال: 201012345678')
  }

  const recipientJid = number + '@s.whatsapp.net'
  const groupJid     = m.chat

  try {
    // ─── جلب معلومات الجروب ───
    const metadata  = await conn.groupMetadata(groupJid)
    const groupName = metadata.subject || 'مجموعة واتساب'

    // ─── جلب كود الدعوة ───
    const inviteCode = await conn.groupInviteCode(groupJid)
    if (!inviteCode) return m.reply('❌ *فشل جلب كود الدعوة، تأكد أن البوت أدمن!*')

    // ─── تاريخ الانتهاء (3 أيام بالثواني) ───
    const inviteExpiration = Math.floor((Date.now() + 3 * 24 * 60 * 60 * 1000) / 1000)

    // ─── إرسال الدعوة عبر sendMessage بالطريقة الصحيحة ───
    await conn.sendMessage(recipientJid, {
      groupInvite: {
        jid:              groupJid,
        subject:          groupName,
        inviteCode:       inviteCode,
        inviteExpiration: inviteExpiration,
        text:             `🌟 تمت دعوتك للانضمام إلى *${groupName}*`
      }
    })

    // ─── تأكيد في الجروب ───
    await conn.sendMessage(groupJid, {
      text:
        `╔══════════════════╗\n` +
        `║  ✅ *تم إرسال الدعوة* ║\n` +
        `╚══════════════════╝\n\n` +
        `📨 *المُرسَل إليه:* wa.me/${number}\n` +
        `👥 *المجموعة:* ${groupName}\n` +
        `⏳ *تنتهي بعد:* 3 أيام\n\n` +
        `📌 *بواسطة:* @${m.sender.split('@')[0]}`,
      mentions: [m.sender]
    }, { quoted: m })

  } catch (err) {
    console.error('❌ خطأ في إرسال الدعوة:', err?.message || err)
    if (err?.message?.includes('403') || err?.message?.includes('not-authorized')) {
      return m.reply('❌ *فشل! تأكد أن البوت أدمن في الجروب*')
    }
    if (err?.message?.includes('404') || err?.message?.includes('not on whatsapp')) {
      return m.reply('❌ *الرقم غير موجود على واتساب*')
    }
    m.reply('❌ *فشل إرسال الدعوة — تأكد من صلاحيات البوت*')
  }
}

handler.help     = ['دعوه <رقم>']
handler.tags     = ['group']
handler.command  = /^(دعوه|دعوة|invite)$/i
handler.group    = true
handler.admin    = true
handler.botAdmin = true

export default handler
