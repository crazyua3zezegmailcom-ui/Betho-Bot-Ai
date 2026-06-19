// م࣬ــࢪحہּٰـبٚأ بٚـڪٰٖ فَــي أوٰأم࣬ـࢪ ۿأݪــڪٰٖي ؍ 🌸♡゙ ُ𓂁
// أوٰأم࣬ــࢪ م࣬ٺم࣬يــژۿ . ⊹
// حہּٰقَــــوٰقَ 𝐶𝑟𝑎𝑧𝑦 𝒅𝒆𝒗 🐦☕
// أݪــسٰࢪقَــۿ ݪأ ٺــفَـيډڪٰٖ يم࣬غٰــفَݪ
// أسٰـم࣬ أݪأم࣬ــࢪ _allfake.js
// ٺـأࢪيخَ صَـنٰأـ؏ٚـۿ أݪــبٚوٰٺ ؍ 🌸♡゙ ُ𓂁 2024_9_22
// ࢪأبٚــطَ قَنٰــأۿ أݪم࣬ــطَــوٰࢪ ..)✘🖤🧸.
// https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e

import pkg from '@whiskeysockets/baileys'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg

var handler = m => m
handler.all = async function (m) { 
global.canalIdM = ["120363428186936884@newsletter", "120363428186936884@newsletter"]
global.canalNombreM = ["𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢", "مــــرحــــبٚأ بٚـڪٰٖ فَــي قَنٰأـِۃ أݪــبٚوٰٺ؍ 🌸♡゙ ُ𓂁"]
global.channelRD = await getRandomChannel()

global.d = new Date(new Date + 3600000)
global.locale = 'es'
global.dia = d.toLocaleDateString(locale, {weekday: 'long'})
global.fecha = d.toLocaleDateString('es', {day: 'numeric', month: 'numeric', year: 'numeric'})
global.mes = d.toLocaleDateString('es', {month: 'long'})
global.año = d.toLocaleDateString('es', {year: 'numeric'})
global.tiempo = d.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true})

var canal = 'https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e'  
var comunidad = 'https://chat.whatsapp.com/GHjmprZpU1I9EYB1nzqcFF'
var correo = 'thekingdestroy507@gmail.com'
global.redes = [canal, comunidad, correo].getRandom()

global.nombre = m.pushName || 'Anónimo'
global.packsticker = `°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°\nᰔᩚ Usuario: ${nombre}\n❀ Bot: ${botname}\n✦ Fecha: ${fecha}\nⴵ Hora: ${moment.tz('America/Caracas').format('HH:mm:ss')}`
global.packsticker2 = `\n°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°\n\n${dev}`


// دالة لإنشاء contextInfo مخصص لإعادة التوجيه من القناة
global.getFakeForward = async (thumbnail = null) => {
  const channel = await getRandomChannel()
  return {
    contextInfo: {
      isForwarded: true,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid: channel.id,
        serverMessageId: -1,
        newsletterName: channel.name
      },
      externalAdReply: {
        title: global.botname || 'HULK BOT',
        body: global.dev || 'Crazy dev',
        thumbnail: thumbnail || await (await fetch(global.icono || 'https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg')).buffer(),
        sourceUrl: global.redes,
        mediaType: 1,
        renderLargerThumbnail: false
      }
    }
  }
}

// دالة للتحقق مما إذا كانت الرسالة تحتوي على أزرار
function hasButtons(content) {
  if (!content) return false
  return !!(
    content.buttons ||
    content.interactiveMessage ||
    content.list ||
    (content.viewOnceMessage?.message?.interactiveMessage)
  )
}

// Monkey-patch لـ conn.sendMessage لإضافة contextInfo تلقائيًا
const conn = this.conn
if (conn && !conn._fakeForwardPatched) {
  const originalSendMessage = conn.sendMessage
  conn.sendMessage = async function (jid, content, options = {}) {
    // إذا كانت الرسالة تحتوي على أزرار، لا نضيف التوجيه
    if (!hasButtons(content) && !options.skipFakeForward) {
      const fakeForward = await global.getFakeForward()
      options = {
        ...options,
        contextInfo: {
          ...(options.contextInfo || {}),
          ...fakeForward.contextInfo
        }
      }
    }
    return originalSendMessage.call(this, jid, content, options)
  }
  conn._fakeForwardPatched = true
}

// تعريف rcanal القديم للتوافق (اختياري)
global.rcanal = await global.getFakeForward()
}

export default handler

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}

async function getRandomChannel() {
let randomIndex = Math.floor(Math.random() * canalIdM.length)
let id = canalIdM[randomIndex]
let name = canalNombreM[randomIndex]
return { id, name }
}