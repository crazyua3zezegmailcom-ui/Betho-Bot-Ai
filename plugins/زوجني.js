/**
 * 💍 أمر زوجني المخصص (ولد/بنت) — ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥
 * ⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // التأكد من الرد على رسالة
    let who = m.quoted ? m.quoted.sender : null
    if (!who) return m.reply(`*_ هـلا 🫠 يـرجى الـرد عـلى رسـالة الـشخص الـذي تـريد الـزواج مـنه _*\n*_ مـثال: .${command} ولد _* أو *_ .${command} بنت _*`)

    // تحديد الجنس المطلوب من النص
    let gender = text.trim().toLowerCase()
    if (!['ولد', 'بنت'].includes(gender)) {
        return m.reply(`*_ هـلا 🍓 حـدد الـنوع بـعد الأمـر _*\n*_ مـثال: .${command} ولد (لـتكوني أنتي الـزوجة) _*\n*_ مـثال: .${command} بنت (لـتكون أنـت الـزوج) _*`)
    }

    let husband, wife
    if (gender === 'ولد') {
        // لو اختار ولد: الشخص اللي رد عليه هو الزوج، والمستخدم هو الزوجة
        husband = who
        wife = m.sender
    } else {
        // لو اختار بنت: المستخدم هو الزوج، والشخص اللي رد عليه هو الزوجة
        husband = m.sender
        wife = who
    }

    // حساب نسبة الحب والتاريخ
    let lovePercentage = Math.floor(Math.random() * 101)
    let date = new Date().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    let caption = `🔔 *تـم عـقد الـقران بـنجاح!* 🔔\n\n`
    caption += `🤵 *الـزوج :* @${husband.split('@')[0]}\n`
    caption += `👰 *الـزوجه :* @${wife.split('@')[0]}\n`
    caption += `📅 *الـتـاريخ :* ${date}\n`
    caption += `💖 *نسـبه الحب بينهم :* ${lovePercentage}%\n`
    caption += `⚖️ *الـمأذون :* نـيـزوكـو 🍓\n\n`
    caption += `🎊 *ألـف مـبروك لـلعرسان!* 🎊\n\n`
    caption += `*_ .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓 _*`

    await conn.sendMessage(m.chat, {
        text: caption,
        mentions: [husband, wife]
    }, { quoted: m })
}

handler.help = ['زوجني']
handler.tags = ['fun']
handler.command = /^(زوجني)$/i
handler.group = true

export default handler