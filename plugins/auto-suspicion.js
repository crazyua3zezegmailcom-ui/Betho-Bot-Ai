// ══════════════════════════════════════════════════════════
//  🔍 Auto-Suspicion Anti-Bot
//  كشف تلقائي للبوتات عبر 3 معايير مستقلة
//  أوامر: .autosuspicion on/off | checkspeed | checkprefix | checkrepeat
// ══════════════════════════════════════════════════════════

// ─── ثوابت ────────────────────────────────────────────────
const BOT_PREFIXES       = ['.', '!', '#', '/']
const SPEED_THRESHOLD_MS = 1500        // 1.5 ثانية
const REPEAT_WINDOW_MS   = 10 * 60 * 1000  // 10 دقائق

// ─── حالة الذاكرة ─────────────────────────────────────────
// آخر رسالة في كل مجموعة
// chatId → { sender, text, timestamp, hadPrefix }
const groupLastMsg = new Map()

// سجل تكرار النص لكل عضو
// key = `chatId::senderJid`  →  Map(text → { count, warned, times[] })
const userRepeatMap = new Map()

// ─── تنظيف دوري للذاكرة (كل 30 دقيقة) ───────────────────
setInterval(() => {
  const cutoff = Date.now() - REPEAT_WINDOW_MS
  for (const [key, textMap] of userRepeatMap) {
    for (const [text, data] of textMap) {
      data.times = data.times.filter(t => t > cutoff)
      if (!data.times.length) textMap.delete(text)
    }
    if (!textMap.size) userRepeatMap.delete(key)
  }
}, 30 * 60 * 1000)

// ─── مساعد: تنظيف رسائل خارج النافذة الزمنية ────────────
const cleanOldTimes = (textMap) => {
  const cutoff = Date.now() - REPEAT_WINDOW_MS
  for (const [text, data] of textMap) {
    data.times = data.times.filter(t => t > cutoff)
    if (!data.times.length) textMap.delete(text)
  }
}

// ─── مساعد: استخراج timestamp بالميلي ثانية ──────────────
const getMsgTime = (m) => {
  const ts = m.messageTimestamp
  if (!ts) return Date.now()
  const n = typeof ts === 'object'
    ? (Number(ts.low ?? 0) || ts.toNumber?.() || Number(ts))
    : Number(ts)
  return n > 1e12 ? n : n * 1000
}

// ─── مساعد: طرد مع رسالة وتسجيل ──────────────────────────
const kickMember = async (conn, chatId, jid, reason) => {
  const num = jid.split('@')[0]
  try {
    await conn.groupParticipantsUpdate(chatId, [jid], 'remove')
    await conn.sendMessage(chatId, {
      text:
        `╔══════════════════════════════╗\n` +
        `║  🤖 تم طرد مشتبه به ✅      ║\n` +
        `╚══════════════════════════════╝\n\n` +
        `🚫 *الرقم:* @${num}\n` +
        `📋 *السبب:* ${reason}\n` +
        `🛡️ *بواسطة:* Auto-Suspicion`,
      mentions: [jid]
    })
    console.log(`[AutoSuspicion] طرد | رقم: ${num} | سبب: ${reason} | وقت: ${new Date().toISOString()}`)
    return true
  } catch (e) {
    console.error(`[AutoSuspicion] فشل طرد ${num}: ${e.message}`)
    return false
  }
}

// ══════════════════════════════════════════════════════════
//  Handler الرئيسي — أوامر التحكم
// ══════════════════════════════════════════════════════════
const handler = async (m, { conn, args, isAdmin, isOwner, isBotAdmin }) => {
  if (!m.isGroup) return m.reply('📌 هذا الأمر يعمل فقط داخل المجموعات.')
  if (!isAdmin && !isOwner) return m.reply('❌ هذا الأمر مخصص للمشرفين ومالك البوت فقط.')

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = global.db.data.chats[m.chat]

  const sub = (args[0] || '').toLowerCase()
  const val = (args[1] || '').toLowerCase()

  // ─── on ────────────────────────────────────────────────
  if (sub === 'on') {
    if (!isBotAdmin) return m.reply('⚠️ البوت لازم يكون مشرف في المجموعة أولاً.')
    chat.autoSuspicion = true
    if (chat.asCheckSpeed   === undefined) chat.asCheckSpeed   = true
    if (chat.asCheckPrefix  === undefined) chat.asCheckPrefix  = true
    if (chat.asCheckRepeat  === undefined) chat.asCheckRepeat  = true
    return m.reply(
      `╔══════════════════════════════════╗\n` +
      `║  🔍 Auto-Suspicion مُفعَّل ✅    ║\n` +
      `╚══════════════════════════════════╝\n\n` +
      `*الفحوصات النشطة:*\n` +
      `⚡ سرعة الرد: ${chat.asCheckSpeed  ? '✅ مُفعَّل' : '❌ مُوقَف'}\n` +
      `🔤 ردّ على بريفكس بوت: ${chat.asCheckPrefix ? '✅ مُفعَّل' : '❌ مُوقَف'}\n` +
      `🔁 تكرار نص (تحذير+طرد): ${chat.asCheckRepeat ? '✅ مُفعَّل' : '❌ مُوقَف'}\n\n` +
      `⚠️ *تحذير مهم:* انظر *.autosuspicion status* لفهم مخاطر كل فحص.`
    )
  }

  // ─── off ───────────────────────────────────────────────
  if (sub === 'off') {
    chat.autoSuspicion = false
    return m.reply(
      `╔══════════════════════════════════╗\n` +
      `║  🔍 Auto-Suspicion مُوقَف ❌     ║\n` +
      `╚══════════════════════════════════╝`
    )
  }

  // ─── checkspeed on/off ─────────────────────────────────
  if (sub === 'checkspeed') {
    if (!['on', 'off'].includes(val))
      return m.reply('📌 استخدم: .autosuspicion checkspeed on/off')
    chat.asCheckSpeed = (val === 'on')
    return m.reply(`⚡ فحص سرعة الرد: ${chat.asCheckSpeed ? '✅ مُفعَّل' : '❌ مُوقَف'}`)
  }

  // ─── checkprefix on/off ────────────────────────────────
  if (sub === 'checkprefix') {
    if (!['on', 'off'].includes(val))
      return m.reply('📌 استخدم: .autosuspicion checkprefix on/off')
    chat.asCheckPrefix = (val === 'on')
    return m.reply(`🔤 فحص الردّ على بريفكس: ${chat.asCheckPrefix ? '✅ مُفعَّل' : '❌ مُوقَف'}`)
  }

  // ─── checkrepeat on/off ────────────────────────────────
  if (sub === 'checkrepeat') {
    if (!['on', 'off'].includes(val))
      return m.reply('📌 استخدم: .autosuspicion checkrepeat on/off')
    chat.asCheckRepeat = (val === 'on')
    return m.reply(`🔁 فحص تكرار النص: ${chat.asCheckRepeat ? '✅ مُفعَّل' : '❌ مُوقَف'}`)
  }

  // ─── status / default ──────────────────────────────────
  const status = chat.autoSuspicion ? '✅ مُفعَّل' : '❌ مُوقَف'
  const sp = chat.asCheckSpeed  !== false
  const pr = chat.asCheckPrefix !== false
  const rp = chat.asCheckRepeat !== false
  return m.reply(
    `╔══════════════════════════════════╗\n` +
    `║    🔍 Auto-Suspicion             ║\n` +
    `╚══════════════════════════════════╝\n\n` +
    `*الحالة:* ${status}\n\n` +
    `*الفحوصات:*\n` +
    `⚡ سرعة الرد (<1.5ث)   ${sp ? '✅' : '❌'}  — طرد فوري بلا تحذير\n` +
    `🔤 ردّ فوري على بريفكس ${pr ? '✅' : '❌'}  — طرد فوري بلا تحذير\n` +
    `🔁 تكرار نص (10 دقائق)  ${rp ? '✅' : '❌'}  — تحذير في المرة 2، طرد في 3\n\n` +
    `⚠️ *خطر false positives:*\n` +
    `فحصا السرعة والبريفكس قد يطردان بشراً حقيقيين في الجروبات النشطة جداً.\n` +
    `فحص التكرار أكثر أماناً بسبب التحذير المسبق.\n\n` +
    `*الأوامر:*\n` +
    `• .autosuspicion on/off\n` +
    `• .autosuspicion checkspeed on/off\n` +
    `• .autosuspicion checkprefix on/off\n` +
    `• .autosuspicion checkrepeat on/off`
  )
}

handler.command = /^(autosuspicion|auto-suspicion|اوتوسسبيشن|اوتو-سسبيشن)$/i
handler.group   = true
handler.admin   = true
handler.tags    = ['group']
handler.help    = ['autosuspicion on/off']

// ══════════════════════════════════════════════════════════
//  handler.before — المراقبة التلقائية لكل رسالة
// ══════════════════════════════════════════════════════════
handler.before = async function (m, { conn, isROwner, isBotAdmin }) {
  if (!m.isGroup) return false

  // تجاهل رسائل البوت الداخلية
  if (m.isBaileys) return false

  if (!global.db.data?.chats) return false
  const chat = global.db.data.chats[m.chat]
  if (!chat?.autoSuspicion) return false

  // ─── استثناءات: البوت نفسه ومالك البوت ──────────────
  const botJid    = conn.user?.id ? conn.decodeJid(conn.user.id) : ''
  const botNum    = botJid.split('@')[0]
  const senderNum = (m.sender || '').split('@')[0].split(':')[0]

  if (senderNum === botNum) return false
  if (isROwner) return false
  const ownerNums = (global.owner || []).map(n => n.replace(/[^0-9]/g, ''))
  if (ownerNums.includes(senderNum)) return false

  const chatId  = m.chat
  const sender  = m.sender
  const now     = getMsgTime(m)
  const text    = (m.text || '').trim()
  const hadPrefix = BOT_PREFIXES.some(p => text.startsWith(p))

  // آخر رسالة قبل هذه الرسالة
  const lastMsg = groupLastMsg.get(chatId)

  // تحديث سجل آخر رسالة بالرسالة الحالية
  groupLastMsg.set(chatId, { sender, text, timestamp: now, hadPrefix })

  let kicked = false
  let notifiedNoAdmin = false

  // ══════════════════════════════════════════════════════
  //  فحص 1 و 2: السرعة والبريفكس (مجمّعان لتجنب طرد مضاعف)
  // ══════════════════════════════════════════════════════
  if (lastMsg && lastMsg.sender !== sender) {
    const diff = now - lastMsg.timestamp

    if (diff >= 0 && diff < SPEED_THRESHOLD_MS) {
      let shouldKick = false
      let reason     = ''

      // فحص 1: سرعة الرد على أي رسالة
      if (chat.asCheckSpeed !== false) {
        shouldKick = true
        reason     = `⚡ سرعة رد مشبوهة (${diff}ms أقل من 1500ms)`
      }

      // فحص 2: ردّ فوري على رسالة تبدأ ببريفكس بوت
      // (يُفعَّل فقط إذا كان فحص 1 مطفياً أو كانت الرسالة السابقة بها بريفكس)
      if (!shouldKick && chat.asCheckPrefix !== false && lastMsg.hadPrefix) {
        shouldKick = true
        reason     = `🔤 ردّ فوري على أمر بوت (prefix) في ${diff}ms`
      }

      if (shouldKick) {
        if (!isBotAdmin) {
          await conn.sendMessage(chatId, {
            text: '⚠️ البوت ليس أدمن، لا يمكنه طرد الأعضاء.'
          })
          notifiedNoAdmin = true
        } else {
          kicked = await kickMember(conn, chatId, sender, reason)
        }
      }
    }
  }

  // ══════════════════════════════════════════════════════
  //  فحص 3: تكرار النص الحرفي (تحذير ← طرد)
  // ══════════════════════════════════════════════════════
  if (!kicked && chat.asCheckRepeat !== false && text.length > 0) {
    const key = `${chatId}::${sender}`
    if (!userRepeatMap.has(key)) userRepeatMap.set(key, new Map())
    const textMap = userRepeatMap.get(key)

    cleanOldTimes(textMap)

    if (!textMap.has(text)) {
      // أول مرة يرسل هذا النص
      textMap.set(text, { count: 1, warned: false, times: [now] })
    } else {
      const data = textMap.get(text)
      data.times.push(now)
      data.count = data.times.length

      if (data.count === 2 && !data.warned) {
        // المرة الثانية → تحذير فقط
        data.warned = true
        await conn.sendMessage(chatId, {
          text:
            `⚠️ *تحذير لـ @${senderNum}*\n\n` +
            `تم رصد تكرار غير طبيعي في الرسائل.\n` +
            `التكرار مرة أخرى قد يؤدي للطرد كبوت مخالف.`,
          mentions: [sender]
        })

      } else if (data.count >= 3) {
        // المرة الثالثة فأكثر → طرد
        textMap.delete(text)

        if (!isBotAdmin && !notifiedNoAdmin) {
          await conn.sendMessage(chatId, {
            text: '⚠️ البوت ليس أدمن، لا يمكنه طرد الأعضاء.'
          })
        } else if (isBotAdmin) {
          await kickMember(
            conn, chatId, sender,
            `🔁 تكرار نص حرفي ${data.count} مرات خلال 10 دقائق`
          )
        }
      }
    }
  }

  return false
}

export default handler
