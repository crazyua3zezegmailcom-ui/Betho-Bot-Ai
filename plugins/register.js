

import { createHash } from 'crypto'
import fetch from 'node-fetch'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, { text, usedPrefix, command }) {
// let idUser = await conn.groupMetadata(idgc)
    /*
if (Object.values(idUser.participants).find(user => user.id == m.sender)) {
*/
// nama
let namae = conn.getName(m.sender)
// database 
let user = global.db.data.users[m.sender]
// profile
const pp = await conn.profilePictureUrl(m.sender, "image").catch((_) => "https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg")
// checking user
  if (user.registered === true) throw `لقد قمت بالتسجيل مسبقاً! هل تريد إعادة التسجيل؟ *${usedPrefix}إلغاء-تسجيل*`
  // input 
  if (!Reg.test(text)) return m.reply(`Enter your name and age\nExample: .daftar 𝐶𝑟𝑎𝑧𝑦.17`)
  let [_, name, splitter, age] = text.match(Reg)
  if (!name) throw 'لا يمكن أن يكون الاسم فارغاً'
  if (!age) throw 'لا يمكن أن يكون العمر فارغاً'
  age = parseInt(age)
  if (age > 30) throw 'العمر كبير جداً!'
  if (age < 5) throw 'العمر صغير جداً!'
  user.name = name.trim()
  user.age = age
  user.regTime = + new Date
  user.registered = true
  let sn = createHash('md5').update(m.sender).digest('hex')
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.fromMe ? conn.user.jid : m.sender
  let cap = `
╭━━「 *معلومات التسجيل*
│• *الاسم:* ${name}
│• *العمر:* ${age} Years
│• *الحالة:* _تم بنجاح_ ✅
│• *الرقم التسلسلي:* ${sn}
╰╾━━━━━━━━━━━━
`
await conn.sendMessage(m.chat, { text: cap,
contextInfo:
					{
						"externalAdReply": {
							"title": " ✔️ تم التسجيل بنجاح",
							"body": "",
							"showAdAttribution": true,
							"mediaType": 1,
							"sourceUrl": '',
							"thumbnailUrl": pp,
							"renderLargerThumbnail": true

						}
					}}, m)
					/*} else {
					await conn.reply(m.chat, '📢 انضم إلى مجموعة Betho Bot Bot لتتمكن من التسجيل والوصول إلى مميزات البوت 😉', null)
					} */
}
handler.help = [ 'تسجيل']
handler.tags = ['infobot']

handler.command = /^(تسجيل2|تحقق|تسجيل3|تسجيل)$/i

export default handler

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}