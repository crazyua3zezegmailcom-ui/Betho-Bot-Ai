// حہّٰقَـــوٰقَ 𝐶𝑟𝑎𝑧𝑦 💻🔥
// أمر تنظيف — يحذف الملفات المؤقتة ويخفف البوت (للمطور فقط)

import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'

const handler = async (m, { conn }) => {
  await m.reply('🧹 *جاري التنظيف...*')

  const memBefore = process.memoryUsage()
  let deletedFiles = 0
  let deletedSize  = 0
  const errors     = []

  // ─── 1. حذف الملفات المؤقتة للصوت في /tmp ───
  const tmpDir = tmpdir()
  const tmpPatterns = [
    /^voice_in_.*\.mp3$/,
    /^voice_out_.*\.ogg$/,
    /^.*\.(mp3|ogg|mp4|webp|jpg|jpeg|png|gif|opus)$/,
  ]
  try {
    const tmpFiles = fs.readdirSync(tmpDir)
    for (const file of tmpFiles) {
      if (tmpPatterns.some(p => p.test(file))) {
        const fullPath = path.join(tmpDir, file)
        try {
          const stat = fs.statSync(fullPath)
          deletedSize += stat.size
          fs.unlinkSync(fullPath)
          deletedFiles++
        } catch {}
      }
    }
  } catch (e) { errors.push(`/tmp: ${e.message}`) }

  // ─── 2. حذف مجلد tmp المحلي للبوت (lib/tmp) ───
  const localTmp = path.join(process.cwd(), 'lib', 'tmp')
  if (fs.existsSync(localTmp)) {
    try {
      const localFiles = fs.readdirSync(localTmp)
      for (const file of localFiles) {
        const fullPath = path.join(localTmp, file)
        try {
          const stat = fs.statSync(fullPath)
          deletedSize += stat.size
          fs.unlinkSync(fullPath)
          deletedFiles++
        } catch {}
      }
    } catch (e) { errors.push(`lib/tmp: ${e.message}`) }
  }

  // ─── 3. تنظيف queue الرسائل المتراكمة ───
  let clearedQueues = 0
  const allConns = [conn, ...(global.conns || [])]
  for (const c of allConns) {
    if (Array.isArray(c?.msgqueque) && c.msgqueque.length > 0) {
      clearedQueues += c.msgqueque.length
      c.msgqueque = []
    }
  }

  // ─── 4. تنظيف store المحادثات القديمة (الغير نشطة 30 يوم) ───
  let clearedChats = 0
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
  if (conn.chats && typeof conn.chats === 'object') {
    for (const [jid, chat] of Object.entries(conn.chats)) {
      if (chat?.conversationTimestamp) {
        const ts = (chat.conversationTimestamp?.low || chat.conversationTimestamp || 0) * 1000
        if (ts > 0 && ts < thirtyDaysAgo) {
          delete conn.chats[jid]
          clearedChats++
        }
      }
    }
  }

  // ─── 5. تنظيف مستخدمين بدون نشاط (commands = 0 و لا مميزات) ───
  let clearedUsers = 0
  try {
    const users = global.db.data?.users || {}
    for (const [jid, user] of Object.entries(users)) {
      if (
        user &&
        (user.commands || 0) === 0 &&
        !user.premium &&
        !user.banned &&
        (user.coin || 0) === 0 &&
        (user.exp  || 0) === 0
      ) {
        delete global.db.data.users[jid]
        clearedUsers++
      }
    }
    if (clearedUsers > 0) await global.db.write().catch(() => {})
  } catch (e) { errors.push(`DB: ${e.message}`) }

  // ─── حساب الفرق في الذاكرة ───
  if (global.gc) try { global.gc() } catch {}
  const memAfter   = process.memoryUsage()
  const memFreedMB = ((memBefore.heapUsed - memAfter.heapUsed) / 1024 / 1024).toFixed(2)
  const heapUsedMB = (memAfter.heapUsed   / 1024 / 1024).toFixed(1)
  const heapTotMB  = (memAfter.heapTotal  / 1024 / 1024).toFixed(1)
  const fileSizeKB = (deletedSize / 1024).toFixed(1)

  const msg =
    `╔══════════════════════╗\n` +
    `║  🧹 *اكتمل التنظيف* 🧹  ║\n` +
    `╚══════════════════════╝\n\n` +
    `🗑️ *ملفات مؤقتة محذوفة:* ${deletedFiles} (${fileSizeKB} KB)\n` +
    `📨 *رسائل queue منظفة:*  ${clearedQueues}\n` +
    `💬 *محادثات قديمة نُظفت:* ${clearedChats}\n` +
    `👤 *مستخدمين غير نشطين:* ${clearedUsers}\n\n` +
    `📊 *الذاكرة بعد التنظيف:*\n` +
    `   ├ Heap: ${heapUsedMB}MB / ${heapTotMB}MB\n` +
    `   └ محرر: ${memFreedMB > 0 ? '+' : ''}${memFreedMB}MB\n` +
    (errors.length ? `\n⚠️ *تحذيرات:*\n${errors.map(e => `• ${e}`).join('\n')}` : `\n✅ *تم التنظيف بنجاح بدون أخطاء*`)

  await conn.sendMessage(m.chat, { text: msg }, { quoted: m })
}

handler.help    = ['تنظيف']
handler.tags    = ['owner']
handler.command = /^(تنظيف|cleanup|clean)$/i
handler.owner   = true

export default handler
