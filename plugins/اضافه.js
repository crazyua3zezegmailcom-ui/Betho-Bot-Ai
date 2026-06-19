// حہּٰقَــــوٰقَ 𝐶𝑟𝑎𝑧𝑦 💻🔥
// ملف اضافه.js - إضافة عضو للجروب عن طريق الرقم

let handler = async (m, { conn, usedPrefix, text, isAdmin, isOwner }) => {
    // 1. التحقق من الصلاحيات
    if (!isAdmin && !isOwner) return conn.reply(m.chat, '*[❗] هذا الأمر مخصص للمشرفين فقط!*', m)
    if (!text) return conn.reply(m.chat, `*[❗] الاستخدام الصحيح:*\n\n*┯┷*\n*┠≽ ${usedPrefix}اضافه 2012xxxxxxx*\n*┷┯*`, m)

    // 2. تنظيف الرقم من علامة + والمسافات
    let user = text.replace(/[^0-9]/g, '')
    if (user.length < 11 || user.length > 15) return conn.reply(m.chat, `*[ ⚠️ ] الرقم غير صحيح، الرجاء إدخال رقم صالح مع مفتاح الدولة!*`, m)
    
    let jid = user + '@s.whatsapp.net'

    try {
        // 3. تنفيذ الإضافة
        const response = await conn.groupParticipantsUpdate(m.chat, [jid], 'add')
        
        // التحقق مما إذا تم الإضافة بنجاح أو تم إرسال طلب انضمام (لو الخصوصية مفعلة)
        if (response[0].status === "403") {
            return conn.reply(m.chat, `❌ *فشلت الإضافة! الشخص مفعل خصوصية "من يمكنه إضافتي للمجموعات".*`, m)
        }

        // 4. الرسالة بالزخرفة الفخمة
        let msg = `╗═══≪ 🌿🍉🍡 ≫═══╔
➕ *تمت الإضافة بنجاح*

𓆩⃞🍒𓆪 *العضو الجديد:* @${user}
𓆩⃞🍇𓆪 *بواسطة:* @${m.sender.split('@')[0]}

✨ *منور الجروب يا بطل*
╝═══≪ 🌿🍉🍡 ≫═══╚`;

        await conn.sendMessage(m.chat, { 
            text: msg,
            mentions: [jid, m.sender]
        }, { quoted: m });

    } catch (err) {
        console.error(err)
        await conn.reply(m.chat, `❌ *حدث خطأ! تأكد أن الرقم صحيح وموجود في واتساب، وأن البوت مشرف.*`, m)
    }
}

handler.help = ['اضافه <الرقم>']
handler.tags = ['group']
handler.command = /^(اضافه|أضف|add|إضافة)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler