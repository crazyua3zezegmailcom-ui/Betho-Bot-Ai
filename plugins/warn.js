import { channelButton } from '../system/buttons.js'
let handler = async (m, {conn, 
text,
args,
usedPrefix, 
command,
participants
}) => {

  let who = m.mentionedJid[0] 
if (!who) return conn.sendMessage(m.chat, {text: `وسّم أو رد على الشخص الذي تريد تطبيق أمر ${command} عليه!`, mentions: participants.map(a => a.id)}, {quoted: m})
let user = db.data.users[who]
if (user.warn == undefined) user.warn = 0
if (user.warn >= 4) {
 conn.groupParticipantsUpdate(m.chat, [who], 'remove').then(_ =>{
 conn.reply(m.chat, '📣 *سيتم إزالتك من المجموعة لأن إجمالي إنذاراتك وصلت إلى 5 نقاط* ❗', m)
 user.warn = 0
  })
} else {
if (command == 'تحذير') {
user.warn += 1
conn.reply(m.chat, `*✅ تم إضافة تحذير لـ ${await conn.getName(who.split(`@`)[0] + '@s.whatsapp.net') || who.split(`@`)[0]}* •> ${user.warn}/5`, m, {mentions: participants.map(a => a.id)})
} else if (command == 'رفع-تحذير') {
user.warn -= 1
conn.reply(m.chat, `*✅ تم تقليل تحذيرات ${await conn.getName(who.split(`@`)[0] + '@s.whatsapp.net') || who.split(`@`)[0]}* •> ${user.warn}/5`, m, {mentions: participants.map(a => a.id)})
}
}
  }
handler.help = ['تحذير']
handler.tags = ['owner']
handler.command = /^(رفع-تحذير|تحذير)$/i
handler.admin = true
handler.group = true
handler.owner = true
export default handler
