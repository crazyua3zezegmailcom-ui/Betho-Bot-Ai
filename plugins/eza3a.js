import { channelButton } from '../system/buttons.js'
// اذاعه - إذاعة رسالة لكل الجروبات

const run = async (m, { conn }) => {
  if (!m.quoted)
    return m.reply('📝 قم بالرد على الرسالة التي تريد إذاعتها')

  const groups    = await conn.groupFetchAllParticipating()
  const groupList = Object.values(groups)

  if (!groupList.length)
    return m.reply('📭 لا توجد مجموعات')

  await m.reply(`📡 جاري الإذاعة لـ ${groupList.length} جروب...`)

  let success = 0
  let failed  = 0

  for (const group of groupList) {
    try {
      const metadata = await conn.groupMetadata(group.id)
      const mentions = metadata.participants.map(p => p.id)
      await conn.sendMessage(group.id, {
        forward: m.quoted.fakeObj,
        mentions
      })
      success++
      await new Promise(r => setTimeout(r, 2000))
    } catch { failed++ }
  }

  await m.reply(
    `✅ *تمت الإذاعة*\n` +
    `─────────────────\n` +
    `نجح     : ${success} جروب\n` +
    `فشل     : ${failed} جروب\n` +
    `الإجمالي: ${groupList.length} جروب`
  )
}

run.command  = ['اذاعه', 'اذاعة']
run.usage    = ['اذاعه']
run.category = 'owner'
run.owner    = true
run.bot      = false

export default run
