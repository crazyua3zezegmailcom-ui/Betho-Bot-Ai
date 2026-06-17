// ══════════════════════════════════════════════
//  🤖 AntiBot — طرد البوتات التلقائي
//  أوامر: .انتي-بوت on | off | قائمة | اضف | احذف
// ══════════════════════════════════════════════

const GROUP_PARTICIPANT_ADD    = 27
const GROUP_PARTICIPANT_INVITE = 31

// ─── أنماط كشف البوتات ───────────────────────
// أرقام معروفة لبوتات واتساب الشائعة
const KNOWN_BOT_PREFIXES = [
  '15550', '15551', '15552', // WhatsApp test numbers
]

// كشف البوت عبر عدة طرق
const isLikelyBot = (jid, conn, knownBots = []) => {
  const number = jid.split('@')[0].split(':')[0]

  // 1) موجود في القائمة السوداء للمجموعة
  if (knownBots.includes(jid) || knownBots.includes(number)) return true

  // 2) نفس رقم البوت الحالي (لا يُطرد)
  const myNumber = (conn.user?.id || '').split(':')[0].split('@')[0]
  if (number === myNumber) return false

  // 3) رقم ضمن الأرقام المعروفة للبوتات
  if (KNOWN_BOT_PREFIXES.some(p => number.startsWith(p))) return true

  // 4) علامة Baileys الرسمية للبوت (إن وُجدت في المستقبل)
  return false
}

// ─── Handler الرئيسي (أوامر التحكم) ─────────
const handler = async (m, { conn, command, args, text, isAdmin, isOwner, isBotAdmin }) => {
  if (!m.isGroup) return m.reply('📌 هذا الأمر يعمل فقط داخل المجموعات.')
  if (!isAdmin && !isOwner) return m.reply('❌ هذا الأمر مخصص للمشرفين فقط.')

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = global.db.data.chats[m.chat]
  if (!Array.isArray(chat.botBlacklist)) chat.botBlacklist = []

  const sub = (args[0] || '').toLowerCase()

  // ─── .انتي-بوت on ─────────────────────────
  if (sub === 'on' || sub === 'تفعيل') {
    if (!isBotAdmin) return m.reply('⚠️ البوت لازم يكون مشرف عشان يقدر يطرد البوتات.')
    chat.antibot = true
    return m.reply(
      `╔══════════════════════════╗\n` +
      `║  🤖 AntiBot مُفعَّل ✅    ║\n` +
      `╚══════════════════════════╝\n\n` +
      `أي بوت يدخل المجموعة هيتطرد فوراً.\n` +
      `لإضافة بوت للقائمة: *.انتي-بوت اضف @mention*`
    )
  }

  // ─── .انتي-بوت off ────────────────────────
  if (sub === 'off' || sub === 'ايقاف') {
    chat.antibot = false
    return m.reply(
      `╔══════════════════════════╗\n` +
      `║  🤖 AntiBot مُوقَف ❌    ║\n` +
      `╚══════════════════════════╝`
    )
  }

  // ─── .انتي-بوت اضف ───────────────────────
  if (sub === 'اضف' || sub === 'add') {
    const targets = m.mentionedJid?.length
      ? m.mentionedJid
      : m.quoted?.sender
        ? [m.quoted.sender]
        : []

    if (!targets.length) return m.reply('📌 منشن البوت أو رد على رسالته.')

    let added = []
    for (const jid of targets) {
      if (!chat.botBlacklist.includes(jid)) {
        chat.botBlacklist.push(jid)
        added.push('@' + jid.split('@')[0])
      }
    }

    if (!added.length) return m.reply('✅ الأرقام دي موجودة بالفعل في القائمة.')

    await m.reply(
      `✅ تمت إضافة ${added.length} بوت للقائمة السوداء:\n` +
      added.join('\n'),
      null, { mentions: targets }
    )

    // طرد فوري لو antibot مفعّل
    if (chat.antibot && isBotAdmin) {
      for (const jid of targets) {
        await conn.groupParticipantsUpdate(m.chat, [jid], 'remove').catch(() => {})
      }
      await m.reply('🚪 تم طردهم من المجموعة فوراً.')
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

    if (!targets.length) return m.reply('📌 منشن البوت اللي عايز تشيله من القائمة.')

    const before = chat.botBlacklist.length
    chat.botBlacklist = chat.botBlacklist.filter(j => !targets.includes(j))
    const removed = before - chat.botBlacklist.length

    return m.reply(removed
      ? `✅ تم حذف ${removed} رقم من القائمة السوداء.`
      : `⚠️ الأرقام دي مش موجودة في القائمة.`
    )
  }

  // ─── .انتي-بوت قائمة ─────────────────────
  if (sub === 'قائمة' || sub === 'list') {
    const status = chat.antibot ? '✅ مُفعَّل' : '❌ مُوقَف'
    if (!chat.botBlacklist.length) {
      return m.reply(
        `🤖 *AntiBot — ${status}*\n\n` +
        `📋 القائمة السوداء فاضية.\n` +
        `أضف بوتات بـ: *.انتي-بوت اضف @mention*`
      )
    }
    const lines = chat.botBlacklist.map((j, i) => `${i + 1}. @${j.split('@')[0]}`).join('\n')
    return m.reply(
      `🤖 *AntiBot — ${status}*\n\n` +
      `📋 *القائمة السوداء:*\n${lines}`,
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
    `• *.انتي-بوت اضف @mention* — إضافة بوت للقائمة\n` +
    `• *.انتي-بوت احذف @mention* — إزالة من القائمة\n` +
    `• *.انتي-بوت قائمة* — عرض القائمة السوداء\n\n` +
    `⚠️ البوت لازم يكون مشرف عشان يشتغل.`
  )
}

handler.command  = /^(انتي-بوت|antibot|anti-bot)$/i
handler.group    = true
handler.admin    = true
handler.tags     = ['group']
handler.help     = ['انتي-بوت on/off']

// ─── Auto-Kick عند الانضمام ──────────────────
handler.before = async function (m, { conn, participants, groupMetadata }) {
  if (!m.isGroup || !m.messageStubType) return

  // فقط عند انضمام عضو جديد
  if (
    m.messageStubType !== GROUP_PARTICIPANT_ADD &&
    m.messageStubType !== GROUP_PARTICIPANT_INVITE
  ) return

  if (!global.db.data?.chats) return
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = global.db.data.chats[m.chat]

  // antibot مش مفعّل في المجموعة دي
  if (!chat.antibot) return

  // تأكد إن البوت مشرف
  const botJid = conn.user?.id ? conn.decodeJid(conn.user.id) : ''
  const botMember = (participants || []).find(p =>
    (p.jid || p.id || '') === botJid || conn.decodeJid(p.jid || p.id || '') === botJid
  )
  if (!botMember?.admin) return  // البوت مش مشرف — نوقف

  const knownBots = Array.isArray(chat.botBlacklist) ? chat.botBlacklist : []
  const stubParams = m.messageStubParameters || []
  if (!stubParams.length) return

  for (const joiningJid of stubParams) {
    // لا تطرد نفسك
    const joiningNum = joiningJid.split('@')[0].split(':')[0]
    const myNum = botJid.split('@')[0].split(':')[0]
    if (joiningNum === myNum) continue

    // كشف البوت
    if (!isLikelyBot(joiningJid, conn, knownBots)) continue

    try {
      // طرد
      await conn.groupParticipantsUpdate(m.chat, [joiningJid], 'remove')

      // إشعار المجموعة
      await conn.sendMessage(m.chat, {
        text:
          `╔══════════════════════════╗\n` +
          `║  🤖 تم كشف وطرد بوت ✅  ║\n` +
          `╚══════════════════════════╝\n\n` +
          `🚫 *الرقم:* @${joiningNum}\n` +
          `🛡️ *بواسطة:* AntiBot\n` +
          `📌 لإضافة بوتات يدوياً: *.انتي-بوت اضف*`,
        mentions: [joiningJid]
      })
    } catch (e) {
      console.error('[AntiBot] فشل الطرد:', e.message)
    }
  }
}

export default handler
