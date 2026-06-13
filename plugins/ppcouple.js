import fetch from "node-fetch"
import { channelButton } from '../system/buttons.js'
let handler = async (m, { conn }) => {


  let data = await (await fetch('https://raw.githubusercontent.com/KazukoGans/database/main/anime/ppcouple.json')).json()
  let cita = data[Math.floor(Math.random() * data.length)]
  
  let cowi = await(await fetch(cita.cowo)).buffer()
  await conn.sendFile(m.chat, cowi, '', '_أرسلها لصديقتك♂️_ \nولا تنسى متابعتي هنا \ninstagram.com/𝐶𝑟𝑎𝑧𝑦_ouafy', m)
  let ciwi = await(await fetch(cita.cewe)).buffer()
  await conn.sendFile(m.chat, ciwi, '', '_ارسلها لصديقك♀️_\n ولا تنسى متابعتي هنا \ninstagram.com/𝐶𝑟𝑎𝑧𝑦_ouafy', m)
  }
handler.help = ['صورة-زوجان']
handler.tags = ['tools']
handler.command = ['صورة-زوجان'] 
handler.limit = true 
export default handler
