// حہّٰقَــــوٰقَ 𝐶𝑟𝑎𝑧𝑦-𝒅𝒗 💻🔥
// نظام التحكم في كتم المجموعات (فردي / مجموعات / الكل)

let handler = async (m, { conn, command, args, usedPrefix }) => {
  
  let groups = Object.values(await conn.groupFetchAllParticipating())

  switch (command) {
    
    case 'بان':
      if (args[0] === 'الكل') {
        groups.forEach(v => {
          global.db.data.chats[v.id].isBanned = true
        })
        return m.reply('*`❲🔒❳` تـم كـتـم جـمـيـع الـمـجـمـوعـات بـنـجـاح.*')
      }

      if (args[0] === 'مجموعة') {
        if (!args[1]) {
          let txt = '*`❲🔗❳` قـائـمـة مـجـموعات الـبـوت:*\n\n'
          groups.forEach((v, i) => {
            let status = global.db.data.chats[v.id]?.isBanned ? '🔒' : '✅'
            txt += `${i + 1}. ${status} ${v.subject}\n`
          })
          txt += `\n> اسـتـخدم: *${usedPrefix + command} مجموعة [الرقم]* للـكـتـم`
          return m.reply(txt)
        }

        let index = parseInt(args[1]) - 1
        if (!groups[index]) return m.reply('❌ رقـم الـمـجـمـوعـة غـيـر صـحـيـح.')
        let target = groups[index].id
        global.db.data.chats[target].isBanned = true
        return m.reply(`✅ تـم كـتـم الـمـجـمـوعـة:\n*${groups[index].subject}* بنجاح.`)
      }

      global.db.data.chats[m.chat].isBanned = true
      m.reply('*`❲🔒❳` تـم كـتـم الـمـحـادثـة*\n\n*`⛊ هـذه الـمـحـادثـة لـيـس لـهـا الأذن لاسـتـعـمـالـي الآن`*')
      break

    case 'بانفك':
      if (args[0] === 'الكل') {
        groups.forEach(v => {
          global.db.data.chats[v.id].isBanned = false
        })
        return m.reply('*`❲🔓❳` تـم فـك كـتـم جـمـيـع الـمـجـمـوعـات بـنـجـاح.*')
      }

      if (args[0] === 'مجموعة') {
        if (!args[1]) return m.reply(`🌿 اسـتـخـدم الـرقـم مـن الـقـائـمـة:\n*.بان مجموعة* أولاً لـرؤيـة الأرقـام.`)
        
        let index = parseInt(args[1]) - 1
        if (!groups[index]) return m.reply('❌ رقـم الـمـجـمـوعـة غـيـر صـحـيـح.')
        let target = groups[index].id
        global.db.data.chats[target].isBanned = false
        return m.reply(`✅ تـم إلـغـاء كـتـم الـمـجـمـوعـة:\n*${groups[index].subject}* بنجاح.`)
      }

      global.db.data.chats[m.chat].isBanned = false
      m.reply('*`❲🔓❳` تـم إلـغـاء كـتـم الـمـحـادثـة*\n\n*`⛊ هـذه الـمـحـادثـة لـهـا الأذن لاسـتـعـمـالـي الآن`*')
      break
  }
}

handler.help = ['banchat']
handler.tags = ['owner']
handler.command = ['بان', 'بانفك']
handler.rowner = true

export default handler