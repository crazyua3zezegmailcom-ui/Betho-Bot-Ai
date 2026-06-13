import fs from 'fs'
import { downloadButtons, channelButton } from '../system/buttons.js'

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Please enter the file name!')
  if (!m.quoted?.text) return m.reply('Reply to the file code!')

  fs.writeFileSync(text, m.quoted.text)
  m.reply(`Successfully added the fil
e "${text}"!`)
}

handler.command = /^(حفظ-ملف)$/i
handler.help = ['حفظ-ملف']
handler.tags = ['owner']
handler.owner = true

export default handler
