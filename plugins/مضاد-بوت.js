// ══════════════════════════════════════════════
//  🤖 AntiBot — طرد البوتات التلقائي
//  الطرد يشتغل فقط على أرقام يضيفها المشرف يدوياً
//  أوامر: .انتي-بوت on | off | قائمة | اضف | احذف
// ══════════════════════════════════════════════

const GROUP_PARTICIPANT_ADD    = 27
const GROUP_PARTICIPANT_INVITE = 31

// ─── Handler الرئيسي (أوامر التحكم) ─────────
const handler = async (m, { conn, args, isAdmin, isOwner, isBotAdmin }) => {
  if (!m.isGroup) return m.reply('📌 هذا الأمر يعمل فقط داخل المجموعات.')
  if (!isAdmin && !isOwner) return m.reply('❌ هذا الأمر مخصص للمشرفين فقط.')

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = global.db.data.chats[m.chat]
  if (!Array.isArray(chat.botBlacklist)) chat.botBlacklist = []

  const sub = (args[0] || '').toLowerCase()

  // ─── .انتي-بوت on ─────────────────────────
  if (sub === 'on' || sub === 'تفعيل') {
    if (!isBotAdmin) return m.reply('⚠️ البوت لازم يكون مشرف عشان يقدر يطرد.')
    chat.antibot = true
    return m.reply(
      `╔══════════════════════════════╗\n` +
      `║   🤖 AntiBot مُفعَّل ✅      ║\n` +
      `╚══════════════════════════════╝\n\n` +
      `أي بوت في *القائمة السوداء* يدخل المجموعة هيتطرد تلقائياً.\n\n` +
      `📌 لإضافة بوت للقائمة:\n*.انتي-بوت اضف @منشن*\nأو رد على رسالة البوت وابعت:\n*.انتي-بوت اضف*`
    )
  }

  // ─── .انتي-بوت off ────────────────────────
  if (sub === 'off' || sub === 'ايقاف') {
    chat.antibot = false
    return m.reply(
      `╔══════════════════════════════╗\n` +
      `║   🤖 AntiBot مُوقَف ❌       ║\n` +
      `╚══════════════════════════════╝`
    )
  }

  // ─── .انتي-بوت اضف ───────────────────────
  if (sub === 'اضف' || sub === 'add') {
    const targets = m.mentionedJid?.length
      ? m.mentionedJid
      : m.quoted?.sender
        ? [m.quoted.sender]
        : []

    if (!targets.length) {
      return m.reply('📌 منشن البوت أو رد على رسالته ثم أرسل الأمر.')
    }

    const added = []
    const already = []
    for (const jid of targets) {
      if (chat.botBlacklist.includes(jid)) {
        already.push('@' + jid.split('@')[0])
      } else {
        chat.botBlacklist.push(jid)
        added.push('@' + jid.split('@')[0])
      }
    }

    let reply = ''
    if (added.length)   reply += `✅ تمت إضافة ${added.length} رقم للقائمة السوداء:\n${added.join('\n')}\n`
    if (already.length) reply += `ℹ️ موجود مسبقاً: ${already.join(', ')}`

    await conn.sendMessage(m.chat, { text: reply.trim(), mentions: targets }, { quoted: m })

    // طرد فوري لو AntiBot مفعّل والبوت مشرف
    if (chat.antibot && isBotAdmin && added.length) {
      const kicked = []
      for (const jid of targets.filter(j => added.includes('@' + j.split('@')[0]))) {
        const res = await conn.groupParticipantsUpdate(m.chat, [jid], 'remove').catch(() => null)
        if (res) kicked.push('@' + jid.split('@')[0])
      }
      if (kicked.length) {
        await conn.sendMessage(m.chat, {
          text: `🚪 تم طرد ${kicked.length} بوت من المجموعة:\n${kicked.join('\n')}`,
          mentions: targets
        }, { quoted: m })
      }
    }
    return
  }

  // ─── .انتي-بوت احذف ──────────────────────
  if (sub === 'احذف' || sub === 'remove') {
    const targets = m.mentionedJid?.length
      ? m.mentionedJid
      : m.quoted?.sender
        ? [m.quoted.sender]
        : []

    if (!targets.length) return m.reply('📌 منشن الرقم اللي عايز تشيله من القائمة.')

    const before = chat.botBlacklist.length
    chat.botBlacklist = chat.botBlacklist.filter(j => !targets.includes(j))
    const removed = before - chat.botBlacklist.length

    return m.reply(removed
      ? `✅ تم حذف ${removed} رقم من القائمة السوداء.`
      : `⚠️ الأرقام دي مش موجودة في القائمة.`
    )
  }

  // ─── .انتي-بوت مسح ───────────────────────
  if (sub === 'مسح' || sub === 'clear') {
    const count = chat.botBlacklist.length
    if (!count) return m.reply('📋 القائمة فاضية أصلاً.')
    chat.botBlacklist = []
    return m.reply(`🗑️ تم مسح القائمة السوداء (${count} رقم).`)
  }

  // ─── .انتي-بوت قائمة ─────────────────────
  if (sub === 'قائمة' || sub === 'list') {
    const status = chat.antibot ? '✅ مُفعَّل' : '❌ مُوقَف'
    if (!chat.botBlacklist.length) {
      return m.reply(
        `🤖 *AntiBot — ${status}*\n\n` +
        `📋 القائمة السوداء فاضية.\n` +
        `أضف بوتات بـ: *.انتي-بوت اضف @منشن*`
      )
    }
    const lines = chat.botBlacklist.map((j, i) => `${i + 1}. @${j.split('@')[0]}`).join('\n')
    return m.reply(
      `🤖 *AntiBot — ${status}*\n\n📋 *القائمة السوداء:*\n${lines}`,
      null,
      { mentions: chat.botBlacklist }
    )
  }

  // ─── مساعدة ───────────────────────────────
  return m.reply(
    `╔══════════════════════════════╗\n` +
    `║    🤖 AntiBot — المساعدة     ║\n` +
    `╚══════════════════════════════╝\n\n` +
    `• *.انتي-بوت on* — تفعيل الحماية\n` +
    `• *.انتي-بوت off* — إيقاف الحماية\n` +
    `• *.انتي-بوت اضف @منشن* — إضافة بوت للقائمة\n` +
    `• *.انتي-بوت احذف @منشن* — إزالة من القائمة\n` +
    `• *.انتي-بوت قائمة* — عرض القائمة السوداء\n` +
    `• *.انتي-بوت مسح* — مسح القائمة كاملة\n\n` +
    `⚠️ البوت لازم يكون مشرف عشان يشتغل.\n` +
    `📌 *الطرد يشتغل فقط على أرقام تضيفها يدوياً.*`
  )
}

handler.command = /^(انتي-بوت|antibot|anti-bot)$/i
handler.group   = true
handler.admin   = true
handler.tags    = ['group']
handler.help    = ['انتي-بوت on/off']

// ─── Auto-Kick عند الانضمام (بالقائمة السوداء فقط) ──
handler.before = async function (m, { conn, participants }) {
  if (!m.isGroup || !m.messageStubType) return

  if (
    m.messageStubType !== GROUP_PARTICIPANT_ADD &&
    m.messageStubType !== GROUP_PARTICIPANT_INVITE
  ) return

  if (!global.db.data?.chats) return
  const chat = global.db.data.chats[m.chat]
  if (!chat?.antibot) return
  if (!Array.isArray(chat.botBlacklist) || !chat.botBlacklist.length) return

  // تحقق من أن البوت مشرف
  const botJid = conn.user?.id ? conn.decodeJid(conn.user.id) : ''
  const botMember = (participants || []).find(p =>
    conn.decodeJid(p.jid || p.id || '') === botJid
  )
  if (!botMember?.admin) return

  const myNum = botJid.split('@')[0]
  const stubParams = m.messageStubParameters || []

  for (const joiningJid of stubParams) {
    const joiningNum = joiningJid.split('@')[0].split(':')[0]

    // لا تطرد نفسك
    if (joiningNum === myNum) continue

    // فقط لو موجود في القائمة السوداء
    if (!chat.botBlacklist.includes(joiningJid) && !chat.botBlacklist.includes(joiningNum + '@s.whatsapp.net')) continue

    try {
      await conn.groupParticipantsUpdate(m.chat, [joiningJid], 'remove')
      await conn.sendMessage(m.chat, {
        text:
          `╔══════════════════════════╗\n` +
          `║  🤖 تم طرد بوت محظور ✅  ║\n` +
          `╚══════════════════════════╝\n\n` +
          `🚫 *الرقم:* @${joiningNum}\n` +
          `🛡️ *بواسطة:* AntiBot`,
        mentions: [joiningJid]
      })
    } catch (e) {
      console.error('[AntiBot] فشل الطرد:', e.message)
    }
  }
}

export default handler
