// ══════════════════════════════════════════════
//  📡 إذاعة — بث رسالة لكل الجروبات
//  يعمل على البوت الرئيسي + جميع البوتات الفرعية
// ══════════════════════════════════════════════

const run = async (m, { conn }) => {
  if (!m.quoted)
    return m.reply('📝 قم بالرد على الرسالة التي تريد إذاعتها')

  // جمع كل الاتصالات النشطة: البوت الرئيسي + الفرعية
  const allConns = [
    conn,
    ...(global.conns || []).filter(c => c?.user?.id)
  ]

  await m.reply(
    `╔══════════════════════════════╗\n` +
    `║      📡 بدء الإذاعة...       ║\n` +
    `╚══════════════════════════════╝\n\n` +
    `🤖 البوتات النشطة: ${allConns.length}\n` +
    `⏳ جاري جلب الجروبات...`
  )

  let totalGroups  = 0
  let totalSuccess = 0
  let totalFailed  = 0
  const botResults = []

  for (const connection of allConns) {
    const botNum = connection.user?.id?.split(':')[0] || 'مجهول'
    let botSuccess = 0
    let botFailed  = 0

    try {
      const groups    = await connection.groupFetchAllParticipating()
      const groupList = Object.values(groups)
      totalGroups += groupList.length

      for (const group of groupList) {
        try {
          await connection.sendMessage(group.id, {
            forward: m.quoted.fakeObj()
          })
          botSuccess++
          totalSuccess++
          // تأخير بين كل رسالة لتجنب الحظر
          await new Promise(r => setTimeout(r, 1500))
        } catch {
          botFailed++
          totalFailed++
        }
      }
    } catch (e) {
      console.error(`[إذاعة] فشل الاتصال بـ +${botNum}:`, e.message)
    }

    botResults.push(`+${botNum}: ✅${botSuccess} ❌${botFailed}`)
  }

  const details = botResults.join('\n')

  await m.reply(
    `╔══════════════════════════════╗\n` +
    `║      ✅ تمت الإذاعة          ║\n` +
    `╚══════════════════════════════╝\n\n` +
    `🤖 *البوتات:* ${allConns.length}\n` +
    `📋 *الجروبات:* ${totalGroups}\n` +
    `✅ *نجح:* ${totalSuccess}\n` +
    `❌ *فشل:* ${totalFailed}\n\n` +
    `*تفاصيل كل بوت:*\n${details}`
  )
}

run.command  = ['اذاعه', 'اذاعة']
run.usage    = ['اذاعه']
run.category = 'owner'
run.owner    = true
run.bot      = false

export default run
