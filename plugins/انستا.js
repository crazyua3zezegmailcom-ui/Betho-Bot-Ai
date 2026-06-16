import fetch from 'node-fetch'

// الحقوق الجديدة الخاصة بك
const myCredit = `.𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 🧩`

// دالة جهة الاتصال (تأثير كرت المطور)


let handler = async (m, { conn, args, usedPrefix, command }) => {
    // التحقق من وجود رابط
    if (!args[0]) {
        return conn.reply(
            m.chat)
    }

    // رسالة التحميل بدون زخرفة
    await conn.reply(
        m.chat,
        `*⏳ جاري التحميل...*`)

    try {
        const apiUrl = `https://tanjirodev.online/api/down-snap?url=${encodeURIComponent(args[0])}`
        
        let res = await fetch(apiUrl)
        let json = await res.json()

        // التحقق من نجاح العملية
        if (json.status !== "success" || !json.results || json.results.length === 0) {
            throw 'تعذر العثور على روابط تحميل لهذا الرابط.'
        }

        let downloadUrl = json.results[0].url
        let title = json.title || 'Instagram Downloader'

        // إرسال الفيديو بالحقوق الجديدة
        await conn.sendMessage(
            m.chat,
            {
                video: { url: downloadUrl },
                caption: `✅ *${title}*\n\nتم بواسطه\n${myCredit}\n\n*تم التحميل بنجاح*`
            },
            {}
        )

    } catch (e) {
        console.error(e)
        await conn.reply(
            m.chat,
            `*❌ حدث خطأ أثناء التحميل:*\n${e.message || e}`)
    }
}

handler.help = ['snap', 'snaptube']
handler.tags = ['download']
handler.command = /^(انستا)$/i

export default handler