// حہّٰقَـــوٰقَ 𝐶𝑟𝑎𝑧𝑦 💻🔥
// أمر بوتاتي — إحصائيات البوتات الرئيسية والفرعية (للمطور فقط)

import * as ws from 'ws'

const handler = async (m, { conn }) => {
  await m.reply('📊 *جاري جلب البيانات...*')

  const allConns  = global.conns || []
  const botId     = conn.user?.id || ''
  const botNum    = botId.split(':')[0].split('@')[0]

  // ─── إحصائيات الرسائل من قاعدة البيانات ───
  const users = global.db.data?.users || {}
  const totalMsgs = Object.values(users)
    .reduce((sum, u) => sum + (u?.commands || 0), 0)

  // ─── تحليل البوتات الفرعية ───
  const connected    = []
  const disconnected = []

  for (const c of allConns) {
    const num  = c?.user?.id?.split(':')[0]?.split('@')[0] || null
    const name = c?.user?.name || c?.user?.verifiedName || 'غير معروف'
    const isOpen = c?.ws?.socket?.readyState === 1

    if (num) {
      if (isOpen) {
        connected.push({ num, name })
      } else {
        disconnected.push({ num, name })
      }
    } else {
      disconnected.push({ num: '???', name: 'جلسة غير مكتملة' })
    }
  }

  const totalSubs    = allConns.length
  const totalConn    = connected.length
  const totalDisconn = disconnected.length

  // ─── RAM ───
  const mem       = process.memoryUsage()
  const heapMB    = (mem.heapUsed  / 1024 / 1024).toFixed(1)
  const heapTotMB = (mem.heapTotal / 1024 / 1024).toFixed(1)
  const rssMB     = (mem.rss       / 1024 / 1024).toFixed(1)

  // ─── uptime البوت ───
  const uptimeSec = Math.floor(process.uptime())
  const h = Math.floor(uptimeSec / 3600)
  const min = Math.floor((uptimeSec % 3600) / 60)
  const sec = uptimeSec % 60
  const uptimeStr = `${h}س ${min}د ${sec}ث`

  // ─── بناء الرسالة ───
  let msg =
    `╔══════════════════════╗\n` +
    `║  🤖 *إحصائيات البوتات*  ║\n` +
    `╚══════════════════════╝\n\n` +

    `🟢 *البوت الرئيسي*\n` +
    `   ├ الرقم: +${botNum}\n` +
    `   ├ الاسم: ${conn.user?.name || 'غير معروف'}\n` +
    `   └ الحالة: ✅ متصل\n\n` +

    `📨 *إجمالي الرسائل (كل البوتات)*\n` +
    `   └ ${totalMsgs.toLocaleString('ar-EG')} رسالة\n\n` +

    `🤖 *البوتات الفرعية*\n` +
    `   ├ الإجمالي:    ${totalSubs}\n` +
    `   ├ ✅ متصل:    ${totalConn}\n` +
    `   └ ❌ منقطع:   ${totalDisconn}\n`

  if (totalConn > 0) {
    msg += `\n*🟢 البوتات المتصلة:*\n`
    for (const b of connected) {
      msg += `   • +${b.num} — ${b.name}\n`
    }
  }

  if (totalDisconn > 0) {
    msg += `\n*🔴 البوتات المنقطعة:*\n`
    for (const b of disconnected) {
      msg += `   • +${b.num} — ${b.name}\n`
    }
  }

  msg +=
    `\n📊 *أداء البوت*\n` +
    `   ├ RAM: ${heapMB}MB / ${heapTotMB}MB\n` +
    `   ├ RSS: ${rssMB}MB\n` +
    `   └ وقت التشغيل: ${uptimeStr}`

  await conn.sendMessage(m.chat, { text: msg }, { quoted: m })
}

handler.help    = ['بوتاتي']
handler.tags    = ['owner']
handler.command = /^(بوتاتي|mybots|botstats)$/i
handler.owner   = true

export default handler
