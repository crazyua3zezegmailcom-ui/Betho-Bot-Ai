// حہّٰقَـــوٰقَ 𝐶𝑟𝑎𝑧𝑦 💻🔥
// أمر دعوه — يبعت دعوة مجموعة حقيقية للشخص (للأدمن فقط)

let handler = async (m, { conn, text, isAdmin, isOwner, usedPrefix, command }) => {

  if (!text) return m.reply(
    `╔══════════════════╗\n` +
    `║  📨 *أمر الدعوة*  ║\n` +
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

  try {
    // ─── جلب معلومات الجروب ───
    const metadata     = await conn.groupMetadata(m.chat)
    const groupName    = metadata.subject || 'مجموعة واتساب'
    const groupJid     = m.chat

    // ─── جلب كود الدعوة ───
    const inviteCode   = await conn.groupInviteCode(groupJid)
    if (!inviteCode) return m.reply('❌ *فشل جلب كود الدعوة، تأكد أن البوت أدمن!*')

    // ─── تاريخ الانتهاء (3 أيام من الآن) ───
    const inviteExpiration = Math.floor((Date.now() + 3 * 24 * 60 * 60 * 1000) / 1000)

    // ─── جلب صورة الجروب (اختياري) ───
    let thumbnail = null
    try {
      thumbnail = await conn.profilePictureUrl(groupJid, 'image')
        .then(url => fetch(url).then(r => r.arrayBuffer()).then(b => Buffer.from(b)))
        .catch(() => null)
    } catch {}

    // ─── إرسال الدعوة الحقيقية ───
    await conn.sendGroupV4Invite(
      groupJid,
      recipientJid,
      inviteCode,
      inviteExpiration,
      groupName,
      `🌟 تمت دعوتك للانضمام إلى مجموعة *${groupName}*`,
      thumbnail
    )

    // ─── تأكيد في الجروب ───
    await conn.sendMessage(m.chat, {
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
    if (err?.message?.includes('not-authorized') || err?.message?.includes('403')) {
      return m.reply('❌ *فشل! تأكد أن البوت أدمن في الجروب*')
    }
    if (err?.message?.includes('not on whatsapp') || err?.message?.includes('404')) {
      return m.reply('❌ *الرقم غير موجود على واتساب*')
    }
    m.reply('❌ *فشل إرسال الدعوة — تأكد من صحة الرقم وصلاحيات البوت*')
  }
}

handler.help     = ['دعوه <رقم>']
handler.tags     = ['group']
handler.command  = /^(دعوه|دعوة|invite)$/i
handler.group    = true
handler.admin    = true
handler.botAdmin = true

export default handler
