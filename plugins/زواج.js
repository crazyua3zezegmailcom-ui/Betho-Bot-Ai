/**
 * 💍 أمر الزواج العشوائي للمزاح — ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥
 * ⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓
 */

let handler = async (m, { conn, participants, groupMetadata }) => {
    // الحصول على قائمة الأعضاء
    let users = participants.map(u => u.id)
    
    // اختيار الزوج والزوجة عشوائياً
    let husband = users[Math.floor(Math.random() * users.length)]
    let wife = users[Math.floor(Math.random() * users.length)]
    
    // التأكد أن الزوج ليس هو نفسه الزوجة (قدر الإمكان)
    if (husband === wife && users.length > 1) {
        wife = users.find(u => u !== husband)
    }

    // حساب نسبة الحب عشوائياً
    let lovePercentage = Math.floor(Math.random() * 101)
    
    // الحصول على تاريخ اليوم بتنسيق جميل
    let date = new Date().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    let caption = `🔔 *تـم اعـلان زواج الـيـوم!* 🔔\n\n`
    caption += `🤵 *الـزوج :* @${husband.split('@')[0]}\n`
    caption += `👰 *الـزوجه :* @${wife.split('@')[0]}\n`
    caption += `📅 *الـتـاريخ :* ${date}\n`
    caption += `💖 *نسـبه الحب بينهم :* ${lovePercentage}%\n`
    caption += `⚖️ *الـمأذون :* نـيـزوكـو 🍓\n\n`
    caption += `⚠️ *مـلاحـظـة:* هـذا الأمـر لـلـمـزاح فـقـط وإضـفـاء الـمـرح 🫠\n\n`
    caption += `*_ .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓 _*`

    // إرسال الرسالة مع المنشن
    await conn.sendMessage(m.chat, {
        text: caption,
        mentions: [husband, wife]
    }, { quoted: m })
}

handler.help = ['زواج']
handler.tags = ['fun']
handler.command = /^(زواج|marriage)$/i
handler.group = true // يعمل في المجموعات فقط

export default handler