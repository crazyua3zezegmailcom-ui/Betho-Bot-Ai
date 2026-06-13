// م࣬ــࢪحہּٰـبٚأ بٚـڪٰٖ فَــي أوٰأم࣬ـࢪ ۿأݪــڪٰٖي ؍ 🌸♡゙ ُ𓂁
// أوٰأم࣬ــࢪ م࣬ٺم࣬يــژۿ . ⊹
// حہּٰقَــــوٰقَ 𝒎𝒐𝒏𝒕𝒆 𝒅𝒆𝒗 🐦☕
// أݪــسٰࢪقَــۿ ݪأ ٺــفَـيډڪٰٖ يم࣬غٰــفَݪ
// أسٰـم࣬ أݪأم࣬ــࢪ رستر.js
// ٺـأࢪيخَ صَـنٰأـ؏ٚـۿ أݪــبٚوٰٺ ؍ 🌸♡゙ ُ𓂁 2024_9_22
// ࢪأبٚــطَ قَنٰــأۿ أݪم࣬ــطَــوٰࢪ ..)✘🖤🧸.
// https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e

import { spawn } from 'child_process'
let handler = async (m, { conn, isROwner, text }) => {
//if (!process.send) throw 'Dont: node main.js\nDo: node index.js'
if (conn.user.jid == conn.user.jid) {
async function loading() {
var hawemod = ["10%", "30%", "50%", "80%", "100%" ]
let { key } = await conn.sendMessage(m.chat, {text: `*∘₊✧──────🌹──────✧₊∘*
*جَارِ إِعَادَةُ التَّشْغِيلِ...*
∘₊✧──────🌹──────✧₊∘*`}, {quoted: m})
for (let i = 0; i < hawemod.length; i++) {
await new Promise(resolve => setTimeout(resolve, 1000)); 
await conn.sendMessage(m.chat, {text: `*∘₊✧──────🌹──────✧₊∘*
${hawemod[i]}
∘₊✧──────🌹──────✧₊∘*`, edit: key}, {quoted: m})}
await conn.sendMessage(m.chat, {text: `*∘₊✧──────🌹──────✧₊∘*
🚀 جَارِ إِعَادَةُ تَشْغِيلِ الْبُوتِ...
يُرْجَى الْاِنْتِظَارُ لَحْظَةً
∘₊✧──────🌹──────✧₊∘*`, edit: key}, {quoted: m});         
//process.send("reset")
process.exit(0); 
}
loading()     
} else throw 'هَذَا الْأَمْرُ لِلْمَالِكِ فَقَطْ'
}
handler.help = ['restart', 'أعِد_التشغيل']
handler.tags = ['مالك']
handler.command = ['restart','reiniciar', 'رستر', 'إعادة_تشغيل'] 
handler.owner = true
export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))