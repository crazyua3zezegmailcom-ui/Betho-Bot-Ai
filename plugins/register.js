import { createHash } from 'crypto'
import fetch from 'node-fetch'
import { channelButton } from '../system/buttons.js'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, { text, usedPrefix, command }) {
  let namae = conn.getName(m.sender)
  let user = global.db.data.users[m.sender]
  const pp = await conn.profilePictureUrl(m.sender, "image").catch((_) => "https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg")

  if (user.registered === true) throw `لقد قمت بالتسجيل مسبقاً! هل تريد إعادة التسجيل؟ *${usedPrefix}إلغاء-تسجيل*`
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

    let cap = `
╭━━「 *معلومات التسجيل*
│• *الاسم:* ${name}
│• *العمر:* ${age} Years
│• *الحالة:* _تم بنجاح_ ✅
│• *الرقم التسلسلي:* ${sn}
╰╾━━━━━━━━━━━━
`
    try {
      await conn.sendMessage(m.chat, {
        image: { url: 'https://i.postimg.cc/P52T7Hh2/IMG-20260610-WA0073.jpg' },
        caption: cap,
        footer: '『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』',
        buttons: channelButton(),
        headerType: 4
      }, { quoted: m })
    } catch {
      await conn.sendMessage(m.chat, {
        text: cap,
        footer: '『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』',
        buttons: channelButton()
      }, { quoted: m })
    }
  }

handler.help = ['تسجيل']
handler.tags = ['infobot']
handler.command = /^(تسجيل2|تحقق|تسجيل3|تسجيل)$/i

export default handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
