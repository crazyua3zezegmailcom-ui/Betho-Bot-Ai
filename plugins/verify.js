import { createHash } from 'crypto'
import fetch from 'node-fetch'
import { channelButton } from '../system/buttons.js'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, { conn, text, usedPrefix, command }) {
  let namae = conn.getName(m.sender)
  let user = global.db.data.users[m.sender]
  let ran = ["1","2","3","4","5","6","7","8","9"]
  const pp = await conn.profilePictureUrl(m.sender, "image").catch((_) => "https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg")

  try {
    if (user.registered === true) throw `You Have Already Registered In The Database, Do You Want To Re-Register? */unreg*`
    let age = ran.getRandom() * 2
    user.name = m.name
    user.age = age
    user.regTime = + new Date
    user.registered = true
    let sn = createHash('md5').update(m.sender).digest('hex')
    let cap = `
╭━━「 *Information*
│• *Name:* ${m.name}
│• *Age:* ${age} Years
│• *Status:* _Success_
│• *Serial Number:* ${sn}
╰╾•••
`
    try {
      await conn.sendMessage(m.chat, {
        image: { url: 'https://i.postimg.cc/P52T7Hh2/IMG-20260610-WA0073.jpg' },
        caption: cap,
        footer: '『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』',
        buttons: channelButton(),
        headerType: 4
      }, { quoted: m })
    } catch (_e) {
      await conn.sendMessage(m.chat, {
        text: cap,
        footer: '『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』',
        buttons: channelButton()
      }, { quoted: m })
    }
  } catch (e) {
    console.error('[verify] Error:', e.message || e)
    try {
      await conn.sendMessage(m.chat, {
        text: '❌ ' + (e.message || e),
        footer: '『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』',
        buttons: channelButton()
      }, { quoted: m })
    } catch (_e2) {}
  }
}

handler.help = ['@verify']
handler.tags = ['infobot']
handler.customPrefix = /^(@verify)/i
handler.command = new RegExp()

export default handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
