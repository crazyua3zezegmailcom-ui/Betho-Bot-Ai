// حہّٰقَـــوٰقَ 𝐶𝑟𝑎𝑧𝑦 💻🔥
// أمر دعوه — يبعت دعوة مجموعة حقيقية للشخص (للأدمن فقط)

import { proto, generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, isAdmin, isOwner, usedPrefix, command }) => {

  if (!text) return m.reply(
    `╔══════════════════╗\n` +
    `║   📨 *أمر الدعوة*  ║\n` +
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

    // ─── تاريخ الانتهاء (3 أيام) ───
    const inviteExpiration = Math.floor((Date.now() + 3 * 24 * 60 * 60 * 1000) / 1000)

    // ─── جلب صورة الجروب (اختياري) ───
    let jpegThumbnail = null
    try {
      const picUrl = await conn.profilePictureUrl(groupJid, 'image')
      const picRes = await fetch(picUrl)
      if (picRes.ok) {
        jpegThumbnail = Buffer.from(await picRes.arrayBuffer())
      }
    } catch {}

    // ─── بناء رسالة الدعوة بالمسار الصحيح ───
    const inviteMsg = proto.Message.GroupInviteMessage.fromObject({
      inviteCode,
      inviteExpiration,
      groupJid,
      groupName,
      caption: `🌟 تمت دعوتك للانضمام إلى *${groupName}*`,
      ...(jpegThumbnail ? { jpegThumbnail } : {})
    })

    const fullMsg = proto.Message.fromObject({ groupInviteMessage: inviteMsg })

    const waMsg = generateWAMessageFromContent(recipientJid, fullMsg, {
      userJid: conn.user.id
    })

    await conn.relayMessage(recipientJid, waMsg.message, {
      messageId: waMsg.key.id
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
