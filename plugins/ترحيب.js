import fetch from 'node-fetch'

const defaultImage = 'https://i.postimg.cc/fbnj1GK0/bb8dc478796cb54ded0fe27359854e1e.jpg'
const removeImage  = 'https://i.postimg.cc/wMvKKyVk/IMG-20260610-WA0074(1).jpg'

let handler = async (m, { conn, command, args, isAdmin, isOwner }) => {
  if (!m.isGroup) return m.reply('🔒 هذا الأمر مخصص للجروبات فقط.')

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = global.db.data.chats[m.chat]

  const type = (args[0] || '').toLowerCase()
  const enable = command === 'on'

  if (type !== 'welcome') return m.reply('⚙️ استخدم:\n*.on welcome* / *.off welcome*')

  if (!(isAdmin || isOwner)) return m.reply('❌ هذا الأمر للمشرفين فقط.')

  chat.welcome = enable
  return m.reply(`✅ تم ${enable ? 'تفعيل' : 'إيقاف'} الترحيب والمغادرة بنجاح.`)
}

handler.command = ['on', 'off']
handler.group = true
handler.admin = true
handler.tags = ['group']
handler.help = ['on welcome', 'off welcome']

handler.before = async (m, { conn }) => {
  if (!m.isGroup) return
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = global.db.data.chats[m.chat]
  if (!chat.welcome) return

  if ([27, 28, 32].includes(m.messageStubType)) {
    const groupMetadata = await conn.groupMetadata(m.chat)
    const groupName = groupMetadata.subject
    const groupDesc = groupMetadata.desc || "لا يوجد وصف للمجموعة ⚙️"
    const groupSize = groupMetadata.participants.length
    const userId = m.messageStubParameters?.[0] || m.sender
    const userMention = `@${userId.split('@')[0]}`
    let profilePic = defaultImage

    try {
      profilePic = await conn.profilePictureUrl(userId, 'image')
    } catch {
      try {
        profilePic = await conn.profilePictureUrl(userId, 'preview')
      } catch {
        profilePic = defaultImage
      }
    }

    if (!profilePic) profilePic = defaultImage

    if (m.messageStubType === 27) {
      const welcomeText = `
*مـــنـــور/ه يــقــلــب اخوك/ي* ✨

مـــنــور جروبنا المتواضع : ${groupName} 』
( ${userMention} ) مــــنـــور
عدد الاعضاء اصبح الان *${groupSize}*

> ممنوع إرسال الروابط
> ممنوع السب أو الإهانة
> ممنوع نشر أي محتوى غير لائق
> ممنوع الإعلان عن جروبات أو قنوات
> ممنوع التكرار أو الإزعاج
> يجب احترام جميع الأعضاء والمشرفين
> البوت للمساعدة والترفيه
> الردود ليست فورية، يُرجى الصبر
> أي مخالفة = إنذار أو طرد حسب الإدارة
      `.trim()

      await conn.sendMessage(m.chat, {
        image: { url: defaultImage },
        caption: welcomeText,
        mentions: [userId],
      })
    }

    if (m.messageStubType === 28 || m.messageStubType === 32) {
      const byeText = `
*مــع الــســلامه بالتوفيق* 👋

و الــيــوم خــرج مــن جــروبــنا عــضــو خــايــن جروبنا : ${groupName}
➪ ${userMention} الخاين
عدد الاعضاء الان 🙂💔 *${groupSize}*

> الي بعدو
      `.trim()

      await conn.sendMessage(m.chat, {
        image: { url: removeImage },
        caption: byeText,
        mentions: [userId],
      })
    }
  }
}

export default handler
