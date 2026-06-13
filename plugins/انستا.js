import fetch from 'node-fetch'

// الحقوق الجديدة الخاصة بك
const myCredit = `.𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ Ａ ⃝🌿ᶦ🎀`

// دالة جهة الاتصال (تأثير كرت المطور)
function contactQuote(m) {
  return {
    key: {
      participants: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'BETHO'
    },
    message: {
      contactMessage: {
        displayName: m.pushName || 'User',
        vcard: `BEGIN:VCARD
VERSION:3.0
N:${m.pushName || 'User'};;;;
FN:${m.pushName || 'User'}
item1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}
item1.X-ABLabel:📞 WhatsApp
ORG:BETHO BOT ✓
TITLE:Developer
END:VCARD`
      }
    },
    participant: '0@s.whatsapp.net'
  }
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    const fkontak = contactQuote(m)

    // التحقق من وجود رابط
    if (!args[0]) {
        return conn.reply(
            m.chat,
            fkontak
        )
    }

    // رسالة التحميل بدون زخرفة
    await conn.reply(
        m.chat,
        `*⏳ جاري التحميل...*`,
        fkontak
    )

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
            { quoted: fkontak }
        )

    } catch (e) {
        console.error(e)
        await conn.reply(
            m.chat,
            `*❌ حدث خطأ أثناء التحميل:*\n${e.message || e}`,
            fkontak
        )
    }
}

handler.help = ['snap', 'snaptube']
handler.tags = ['download']
handler.command = /^(انستا)$/i

export default handler