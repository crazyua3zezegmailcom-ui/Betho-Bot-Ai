import { readFileSync, writeFileSync } from 'fs'

let c = readFileSync('plugins/menu.js', 'utf8')

c = c.replace("handler.help = ['القائمة-الرئيسية']", "handler.help = ['اوامر']")
c = c.replace("handler.command = ['القائمة-الرئيسية']", "handler.command = ['اوامر']")
c = c.replace(/id: "\.menu " \+ key/g, 'id: ".اوامر " + key')
c = c.replace(/id: "\.menu all"/g, 'id: ".اوامر all"')
c = c.replace(/id: "\.sc"/g, 'id: ".سكريبت"')
c = c.replace(/id: "\.owner"/g, 'id: ".معلومات-المالك"')
c = c.replace(/id: "\.totalfitur"/g, 'id: ".الميزات"')
c = c.replace(/id: "\.os"/g, 'id: ".تفاصيل-القرص"')
c = c.replace(
  `"'${cmd}' could not be found. Use commands '${command} list' atau '${command} all' to see the available menu.",`,
  '`الأمر \'${cmd}\' غير موجود. استخدم \'${usedPrefix}${command} all\' لعرض كل الأوامر.`,'
)

writeFileSync('plugins/menu.js', c)
console.log('✅ تم')
console.log(c.match(/handler\.command.+/)[0])
console.log(c.match(/handler\.help.+/)[0])
