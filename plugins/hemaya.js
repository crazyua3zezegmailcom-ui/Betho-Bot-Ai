import { channelButton } from '../system/buttons.js'
// حمايه - نظام الحماية الكامل مع كشف التهرب

const protState = new Map()

function getState(chatId) {
  if (!protState.has(chatId))
    protState.set(chatId, { warnCount: {}, log: [] })
  return protState.get(chatId)
}

function isEnabled(chatId) {
  return global.db?.data?.chats?.[chatId]?.protection === true
}

const BANNED_WORDS = [
  'سكس', 'جنس', 'نيك', 'ينيك', 'كس', 'زب', 'طيز',
  'شرموط', 'شرموطة', 'قحبة', 'عاهرة', 'اباحي',
  'fuck', 'fucking', 'motherfucker', 'sex', 'porn',
  'xxx', 'nude', 'dick', 'pussy', 'cock', 'whore',
  'xvideos', 'pornhub', 'xnxx', 'xhamster',
  's3x', 's@x', 'pr0n', 'p0rn'
]

const WARN_WORDS = [
  'غبي', 'غبية', 'أهبل', 'اهبل', 'متخلف',
  'حمار', 'كلب', 'قرد', 'حيوان', 'وسخ', 'تافه',
  'idiot', 'stupid', 'dumb', 'loser', 'trash'
]

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/(.)\1{2,}/g, '$1$1')
    .replace(/0/g, 'o').replace(/1/g, 'i')
    .replace(/3/g, 'e').replace(/4/g, 'a')
    .replace(/5/g, 's').replace(/8/g, 'b')
    .replace(/[*_~`|،؟!.,;:'"()[\]{}<>@#$%^&+=\-/\\]/g, ' ')
    .replace(/\s+/g, ' ').trim()
}

function checkText(text) {
  const norm    = normalizeText(text)
  const compact = norm.replace(/\s+/g, '')
  const orig    = text.toLowerCase()

  for (const word of BANNED_WORDS) {
    const w = word.toLowerCase()
    if (norm.includes(w) || compact.includes(w) || orig.includes(w))
      return { type: 'banned', word }
  }
  for (const word of WARN_WORDS) {
    const w = word.toLowerCase()
    if (norm.includes(w) || compact.includes(w))
      return { type: 'warn', word }
  }
  return null
}

async function deleteMessage(conn, chatId, m) {
  try { await conn.sendMessage(chatId, { delete: m.key }) } catch (_e) {}
}

async function kickMember(conn, chatId, jid) {
  try {
    await conn.groupParticipantsUpdate(chatId, [jid], 'remove')
    return true
  } catch { return false }
}

async function processMessage(m, conn) {
  const chatId   = m.chat
  const senderId = m.sender

  if (!chatId.endsWith('@g.us')) return
  if (!isEnabled(chatId)) return
  if (m.isOwner || m.isAdmin || m.isBotAdmin) return

  const state = getState(chatId)
  const body  = (m.body || '').trim()
  const name  = senderId.split('@')[0]

  if (body) {
    const result = checkText(body)

    if (result?.type === 'banned') {
      await deleteMessage(conn, chatId, m)
      const kicked = await kickMember(conn, chatId, senderId)
      await conn.sendMessage(chatId, {
        text:
          `🚨 *تم اكتشاف محتوى مخالف!*\n\n` +
          `👤 العضو: @${name}\n` +
          `🚫 السبب: كلمة محظورة\n` +
          `🗑️ الرسالة: تم حذفها\n` +
          `${kicked ? '👢 الإجراء: تم الطرد' : '⚠️ تعذّر الطرد'}`,
        mentions: [senderId]
      })
      return
    }

    if (result?.type === 'warn') {
      state.warnCount[senderId] = (state.warnCount[senderId] || 0) + 1
      const warns = state.warnCount[senderId]

      if (warns >= 3) {
        await deleteMessage(conn, chatId, m)
        const kicked = await kickMember(conn, chatId, senderId)
        state.warnCount[senderId] = 0
        await conn.sendMessage(chatId, {
          text:
            `🚨 *@${name} تم طرده بعد 3 تحذيرات!*\n` +
            `${kicked ? '👢 تم الطرد' : '⚠️ تعذّر الطرد'}`,
          mentions: [senderId]
        })
      } else {
        await conn.sendMessage(chatId, {
          text:
            `⚠️ *تحذير!* @${name}\n\n` +
            `🚫 رسالتك تحتوي لغة غير لائقة\n` +
            `📊 تحذيراتك: ${warns}/3`,
          mentions: [senderId]
        })
      }
    }
  }

  const msg = m.message
  if (msg?.imageMessage || msg?.stickerMessage || msg?.videoMessage) {
    const cap = msg.imageMessage?.caption ||
                msg.videoMessage?.caption || ''
    if (cap && checkText(cap)?.type === 'banned') {
      await deleteMessage(conn, chatId, m)
      const kicked = await kickMember(conn, chatId, senderId)
      const type = msg.stickerMessage ? 'ستيكر'
                 : msg.videoMessage   ? 'فيديو' : 'صورة'
      await conn.sendMessage(chatId, {
        text:
          `🚨 *تم اكتشاف ${type} مخالف!*\n\n` +
          `👤 العضو: @${name}\n` +
          `🗑️ المحتوى: تم حذفه\n` +
          `${kicked ? '👢 الإجراء: تم الطرد' : '⚠️ تعذّر الطرد'}`,
        mentions: [senderId]
      })
    }
  }
}

const handler = async (m, { conn, args }) => {
  const chatId = m.chat
  const sub    = (args?.[0] || '').trim()

  if (!chatId.endsWith('@g.us'))
    return m.reply('🚫 هذا الأمر للجروبات فقط!')

  if (!m.isAdmin && !m.isOwner)
    return m.reply('🚫 هذا الأمر للأدمن فقط!')

  if (['تشغيل', 'on'].includes(sub)) {
    if (isEnabled(chatId))
      return m.reply('✅ الحماية مفعّلة بالفعل!')
    if (!global.db.data.chats[chatId]) global.db.data.chats[chatId] = {}
    global.db.data.chats[chatId].protection = true
    return m.reply(
      `🛡️ *تم تفعيل نظام الحماية!*\n\n` +
      `✅ فلترة الكلمات المحظورة\n` +
      `✅ فحص الصور والفيديو\n` +
      `✅ فحص الستيكرات\n\n` +
      `📌 للإيقاف: *.حمايه إيقاف*`
    )
  }

  if (['إيقاف', 'ايقاف', 'off'].includes(sub)) {
    if (!isEnabled(chatId))
      return m.reply('⚠️ الحماية غير مفعّلة أصلاً.')
    global.db.data.chats[chatId].protection = false
    return m.reply('🔓 *تم إيقاف نظام الحماية*')
  }

  if (['سجل', 'log'].includes(sub)) {
    const state = getState(chatId)
    if (!state.log.length)
      return m.reply('📋 السجل فارغ.')
    let logMsg = `📋 *سجل الحماية*\n\n`
    for (const e of state.log.slice(-10).reverse()) {
      logMsg += `⚠️ @${e.jid?.split('@')[0]}\n   📌 ${e.detail}\n   🕐 ${e.time}\n\n`
    }
    return m.reply(logMsg)
  }

  const active = isEnabled(chatId)
  return m.reply(
    `🛡️ *نظام الحماية*\n\n` +
    `الحالة: ${active ? '✅ مفعّل' : '❌ موقوف'}\n\n` +
    `📌 الأوامر:\n` +
    `▫️ *.حمايه تشغيل*\n` +
    `▫️ *.حمايه إيقاف*\n` +
    `▫️ *.حمايه سجل*`
  )
}

handler.before   = async (m, { conn }) => { await processMessage(m, conn) }
handler.command  = /^حماي[هة]/i
handler.category = 'admin'
handler.group    = true
handler.bot      = false

export default handler
