
let handler = async (m, { usedPrefix, command, conn, text }) => {
  let noReg = Object.values(global.db.data.users).filter(user => user.registered == false)
  let user = db.data.users
  for (let data in user) {
  if (user[data].registered === false) {
    delete user[data];
  } 
  }
  conn.reply(m.chat, `*Successfully cleared users who were not registered* [ \`\`\`${noReg.length }\`\`\` ]`, fkon)
}

handler.help = ['مسح-الكاش']
handler.tags = ['owner']
handler.command = /^(مسح-الكاش)$/i
handler.rowner = true
export default handler
