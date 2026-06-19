import axios from "axios";
const { generateWAMessageContent, generateWAMessageFromContent, proto } =
  (await import("@whiskeysockets/baileys")).default;

/* ========= دالة جهة الاتصال (Quote) ========= */
function contactQuote(m) {
  return {
    key: {
      participants: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'HULK'
    },
    message: {
      contactMessage: {
        displayName: m.pushName || 'Unknown',
        vcard: `BEGIN:VCARD
VERSION:3.0
N:${m.pushName || 'User'};;;;
FN:${m.pushName || 'User'}
item1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}
item1.X-ABLabel:📞 WhatsApp
ORG:HULK BOT ✓
TITLE:Verified
END:VCARD`
      }
    },
    participant: '0@s.whatsapp.net'
  }
}

/* ========= الأمر ========= */
let handler = async (m, { conn }) => {
    // 1️⃣ قائمة الصور العشوائية لـ ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥
    const images = [
        "https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg",
        "https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg",
        "https://i.postimg.cc/Fsx4fvfK/IMG-20260610-WA0075.jpg",
        "https://i.postimg.cc/gksCzK5n/IMG-20260610-WA0076.jpg",
        "https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg",
        "https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg",
        "https://i.postimg.cc/Fsx4fvfK/IMG-20260610-WA0075.jpg",
        "https://i.postimg.cc/gksCzK5n/IMG-20260610-WA0076.jpg",
        "https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg"
    ];

    // 2️⃣ اختيار صورة عشوائية
    const randomImage = images[Math.floor(Math.random() * images.length)];

    // 3️⃣ دالة تجهيز ميديا الصورة للزر التفاعلي
    async function createImage(url) {
        const { imageMessage } = await generateWAMessageContent(
            { image: { url } },
            { upload: conn.waUploadToServer }
        );
        return imageMessage;
    }

    // 4️⃣ إنشاء الكارت التفاعلي وبناء هيكل الرسالة
    let cards = [{
        body: proto.Message.InteractiveMessage.Body.fromObject({
            text: `موقع apis ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 ai 🐦🫴\n\nادخلو في قسم ال ai تلاقي ال api تبع جي بي تي داكي`,
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
            text: "HULK BOT MD",
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
            hasMediaAttachment: true,
            imageMessage: await createImage(randomImage),
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
            buttons: [
                {
                    name: "cta_url",
                    buttonParamsJson: `{
                        "display_text": "❤️ .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀​ APIS✨",
                        "url": "https://⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥.hidenfree.com"
                    }`,
                },
            ],
        }),
    }];

    const bot = generateWAMessageFromContent(
        m.chat,
        {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: { text: "🔗 ╎ نـظام مـوقع الـذكاء الاصـطـناعي" },
                        footer: { text: "⚡ ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 AI System" },
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards,
                        }),
                    }),
                },
            },
        },
        { quoted: contactQuote(m) }
    );

    // 5️⃣ إرسال الرسالة إلى الشات
    await conn.relayMessage(m.chat, bot.message, { messageId: bot.key.id });
};

handler.command = /^(الموقع)$/i;

export default handler;