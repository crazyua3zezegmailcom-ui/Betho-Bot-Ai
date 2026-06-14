import { watchFile, unwatchFile } from "fs"
import chalk from "chalk"
import { fileURLToPath } from "url"
import fs from "fs"
// ملف الاعدادات يلزمك التعديل في بعض المناطق
global.botNumber = "201270143026"

// عدل في محل owenar لي كي تحط نفسك مالك للبوت 
global.owner = ["584261208048", "201214057674", "201201756710"]
global.suittag = ["201214057674"] 
global.prems = []


global.libreria = "Baileys Multi Device"
global.vs = "^1.8.2|Latest"
global.nameqr = "BETHO-BOT"
global.sessions = "Sessions/Principal"
global.jadi = "Sessions/SubBot"
global.yukiJadibts = true


global.botname = "𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢"
global.textbot = "𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢"
global.dev = "𝐶𝑟𝑎𝑧𝑦"
global.author = "𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢"
global.etiqueta = "𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢"
global.currency = "¥enes"
global.banner = "https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg"
global.icono = "https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg"
global.catalogo = fs.readFileSync('./lib/catalogo.jpg')

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.group = "https://chat.whatsapp.com/JNUcrtcQjPGJpKoW78dkEc"
global.community = "https://chat.whatsapp.com/JNUcrtcQjPGJpKoW78dkEc"
global.channel = "https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e"
global.ch = {
ch1: "120363428186936884@newsletter"
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.APIs = {
xyro: { url: "https://api.xyro.site", key: null },
yupra: { url: "https://api.yupra.my.id", key: null },
vreden: { url: "https://api.vreden.web.id", key: null },
delirius: { url: "https://api.delirius.store", key: null },
zenzxz: { url: "https://api.zenzxz.my.id", key: null },
siputzx: { url: "https://api.siputzx.my.id", key: null }
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
unwatchFile(file)
console.log(chalk.redBright("Update 'settings.js'"))
import(`${file}?update=${Date.now()}`)
})
