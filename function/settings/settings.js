import { watchFile, unwatchFile } from 'fs'
import fs from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

/*
Setting
*/
global.setting = {
 clearSesi: false, // trash cleaner sessions 
 clearTmp: true, // tmp trash cleaner
 addReply: true, // create with thumbnail in message
 idgc: '120363315668824185@g.us' // id gc buat join only
 }

global.info = {
 nomerbot : '201116571308',
 pairingNumber : '201116571308',
 figlet: 'bethobot', // create a start console display
 nomorwa : '201116571308',
 nameown : '𝐶𝑟𝑎𝑧𝑦',
 nomerown : '201214057674',
 packname : 'sticker by ',
 author : 'Betho Bot',
 namebot : '乂 Betho Bot',
 wm : '𝑩𝒆𝒕𝒉𝒐 𝑩𝒐𝒕.',
 stickpack : 'Whatsapp',
 stickauth : '𝑩𝒆𝒕𝒉𝒐 𝑩𝒐𝒕',
 jid: '@s.whatsapp.net'
}

// Thumbnail 
global.media = {
 ppKosong : 'https://i.ibb.co/3Fh9V6p/avatar-contact.png',
 didyou : 'https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg',
 rulesBot : 'https://i.postimg.cc/gksCzK5n/IMG-20260610-WA0076.jpg',
 thumbnail : 'https://i.postimg.cc/Fsx4fvfK/IMG-20260610-WA0075.jpg',
 thumb : 'https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg',
 logo : 'https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg',
 unReg : 'https://i.postimg.cc/gksCzK5n/IMG-20260610-WA0076.jpg',
 registrasi : 'https://i.postimg.cc/Fsx4fvfK/IMG-20260610-WA0075.jpg',
 confess : 'https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg',
 access : 'https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg',
 tqto : 'https://i.postimg.cc/gksCzK5n/IMG-20260610-WA0076.jpg',
 spotify : 'https://i.postimg.cc/Fsx4fvfK/IMG-20260610-WA0075.jpg',
 weather : 'https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg',
 gempaUrl : 'https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg',
 akses : 'https://i.postimg.cc/gksCzK5n/IMG-20260610-WA0076.jpg',
 wel : 'https://telegra.ph/file/9dbc9c39084df8691ebdd.mp4',
 good : 'https://telegra.ph/file/1c05b8c019fa525567d01.mp4',
 sound: 'https://pomf2.lain.la/f/ymca9u8.opus'
}
// Social media
global.url = {
 sig: 'https://chat.whatsapp.com/JNUcrtcQjPGJpKoW78dkEc',
 sgh: 'https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e',
 sgc: 'https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e'
}
// Donasi
global.payment = {
 psaweria: 'https://saweria.co/mamad',
 ptrakterr: '-',
 pdana: '0823427570'
}
// Info Wait
global.msg = {
 wait: '⏱️ *يرجى التحلي بالصبر*\n\> نحاول تلبية طلبكم ...',
 eror: '🤖 *Betho Bot*\n\> عذراً، حدث خطأ أثناء تنفيذ الأمر.'
}
 
// api_id web suntik
global.apiId = {
 smm: '4524',
 lapak: '300672'
}

// Apikey
global.api = {
 user: '-', // api_id antinsfw 
 screet: '-', // api_screet nsfw after that, replace it yourself
 uptime: '-',
 xyro: '-',
 lol: 'GataDiosV2',
 smm: '-',
 lapak: '-',
 prodia: '-',
 bing: '1-HLkal9xPklSXn8H_NYBhugb9UnCJKJEzQp4Rk_PxP4xxBCqtm_Os-93cXF8mtFeqde_ZGjnx2C1MM4PCS0gH8mzdX5tJ5aoaDC4G0VruZATWvvOQlHs2UBDNID5PR4MtskWzX69idiBidGDqVwfNBNZYgqb3cgqkLbyEeZnWHxxrhO3es3O8YOI5wd8Y0a31_OiLKTAzwS1ba-wvcBP9khAHrUkuQpzXuoybpwfwpQ'

}
global.APIs = {
    xyro: "https://api.xyroinee.xyz",
    nightTeam: "https://api.tioxy.my.id",
    lol: "https://api.lolhumaan.xyz",
    smm: "https://smmnusantara.id",
    lapak: "https://panel.lapaksosmed.com"
}

//Apikey
global.APIKeys = {
    "https://api.xyroinee.xyz": "vRFLiyLPWu",
    "https://api.lolhumaan.xyz": "GataDiosV2"
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'settings.js'"))
  import(`${file}?update=${Date.now()}`)
})
