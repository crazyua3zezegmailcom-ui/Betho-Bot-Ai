import { addExif } from '../lib/sticker.js'

let handler = async (m, { conn, text }) => {
    try {
        // التحقق من وجود رد على استيكر
        if (!m.quoted) {
            return m.reply(`*▰▱▰ [ ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 ] ▰▱▰*

*┌──────────────⚠️*
*│⋄ الـحـالـة:* خـطـأ فـي الـاسـتـخـدام
*└──────────────⚡*

📝 *لازم ترد على الاستيكر اللي عايز تضيف عليه اسم الباكدج*

💡 *مثال:* .حقوق اسم الباكدج | اسم المؤلف

*─━─━─━─━─*
© ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥`);
        }

        // إرسال الرياكشن
        await conn.sendMessage(m.chat, { 
            react: { text: '🕷', key: m.key } 
        });

        let stiker = false
        try {
            let [packname, ...author] = text ? text.split('|') : ['']
            author = (author || []).join('|')
            let mime = m.quoted.mimetype || ''
            
            if (!/webp/.test(mime)) {
                return m.reply(`*▰▱▰ [ ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 ] ▰▱▰*

❌ *لازم ترد على استيكر عشان نضيف الاسم!*

*─━─━─━─━─*
© ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥`);
            }
            
            let img = await m.quoted.download()
            if (!img) {
                return m.reply(`*▰▱▰ [ ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 ] ▰▱▰*

❌ *فيه حاجة مش مزبوطه.. حاول تنزل الاستيكر تاني!*

*─━─━─━─━─*
© ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥`);
            }
            
            stiker = await addExif(img, packname || '', author || '')
        } catch (e) {
            console.error(e)
            if (Buffer.isBuffer(e)) stiker = e
        } finally {
            if (stiker) {
                await conn.sendMessage(m.chat, { 
                    sticker: stiker, 
                    mimetype: 'image/webp', 
                    contextInfo: {
                        externalAdReply: {
                            title: "⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥",
                            body: "⏤͟͞ू⃪ ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 𝑩𝑶𝑻⃝𖤐",
                            thumbnailUrl: "https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg",
                            mediaUrl: "https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e",
                            mediaType: 2,
                        }
                    }
                }, { quoted: m });
            } else {
                throw new Error('حصلت غلطة!')
            }
        }
        
    } catch (e) {
        console.error(e);
        await m.reply(`*▰▱▰ [ ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 ] ▰▱▰*

❌ *حصلت غلطة! تأكد انك رديت على استيكر وضفت اسم الباكدج*

*─━─━─━─━─*
© ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥`);
    }
}

handler.help = ['حقوق <packname>|<author>']
handler.tags = ['sticker']
handler.command = /^(حقوق)$/i

export default handler;