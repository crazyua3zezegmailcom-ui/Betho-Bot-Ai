import yts from 'yt-search'
import fs from  'fs'
import { downloadButtons, channelButton } from '../system/buttons.js'
let handler = async (m, {conn, text }) => {
  if (!text) throw ' هذا الامر خاص بالبحث في اليوتوب وأخذ رابط الفيديو \n مثلا :\n *.yts*   𝐶𝑟𝑎𝑧𝑦 ouafy whatsapp bot'
  await conn.reply(m.chat, global.wait, m)
  let results = await yts(text)
  let tes = results.all
  let teks = results.all.map(v => {
    switch (v.type) {
      case  'video' : return `
° *_${v.title}_*↳ 🫐 *_L :_* ${v.url}
↳ 🕒 *_D :_* ${v.timestamp}
↳ 📥 *_S :_* ${v.ago}
↳ 👁 *_V :_* ${v.views}`}}).filter(v => v).join('\n\n◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦\n\n' )
  conn.sendFile(m.chat, tes[0].thumbnail, 'yts.jpeg' , teks, m)
}
handler.help = [ 'بحث-يوتيوب' ] 
handler.tags = [ 'search']
handler.command = [ 'بحث-يوتيوب' ,  'بحث-يوتيوب2' ] 
handler.limit = 1
export default handler