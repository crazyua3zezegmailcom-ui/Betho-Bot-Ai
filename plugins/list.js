let handler = async (m, { conn }) => {
  let caption = `*بيثو بوت* هو بوت واتساب ذكي متعدد المهام، يتيح تحميل الوسائط، إدارة المجموعات، البحث، الترجمة، ومعالجة الصور والفيديو. تم تطويره من قبل *𝐶𝑟𝑎𝑧𝑦 وافي*، هاوٍ للتقنية والتعديل على الأكواد، ويشارك أفكاره ومشاريعه عبر إنستغرام

*Betho Bot Bot* is a smart, multi-purpose WhatsApp bot that allows media downloading, group management, searching, translation, and image/video processing. It was created by *𝐶𝑟𝑎𝑧𝑦 Ouafy*, a tech enthusiast who enjoys modifying codes, and shares his ideas and projects on Instagram: 📸 instagram.com/𝐶𝑟𝑎𝑧𝑦_ouafy`
  
  await conn.sendMessage(m.chat, {
    image: { url: 'https://i.postimg.cc/Fsx4fvfK/IMG-20260610-WA0075.jpg' },
    gifPlayback: true,
    caption,
    footer: '`betho Ai - 2025`',
    buttons: [{ buttonId: '.menu all', buttonText: { displayText: 'All Menu | جميع الأوامر' }, type: 1 }],
    headerType: 1,
    viewOnce: true
  }, { quoted: m })

  await conn.sendMessage(m.chat, {
    audio: { url: 'https://files.catbox.moe/5490j1.opus' },
    mimetype: 'audio/mp4',
    ptt: true
  }, { quoted: m })
}

handler.help = ['القائمة']
handler.command = ['القائمة']
handler.tags =['infobot']
handler.limit = true 
export default handler
