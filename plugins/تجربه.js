const handler = async (m, { conn }) => {
    // 1️⃣ قائمة الروابط
    const images = [
        "https://i.postimg.cc/Fsx4fvfK/IMG-20260610-WA0075.jpg",
        "https://i.postimg.cc/gksCzK5n/IMG-20260610-WA0076.jpg",
        "https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg",
        "https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg",
        "https://i.postimg.cc/Fsx4fvfK/IMG-20260610-WA0075.jpg",
        "https://i.postimg.cc/gksCzK5n/IMG-20260610-WA0076.jpg",
        "https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg",
        "https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg",
        "https://i.postimg.cc/Fsx4fvfK/IMG-20260610-WA0075.jpg"
    ];

    // 2️⃣ اختيار رابط عشوائي
    const randomImage = images[Math.floor(Math.random() * images.length)];

    // 3️⃣ إرسال الصورة مع الكابتشن والزر
    await conn.sendMessage(m.chat, {
        image: { url: randomImage },
        caption: `موقع apis ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 ai 🐦🫴\n\nادخلو في قسم ال ai تلاقي ال api تبع جي بي تي داكي`,
        viewOnce: true,
        headerType: 4,
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,
                title: "⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 AI API",
                body: "اكتشف خدمات الذكاء الاصطناعي",
                thumbnailUrl: randomImage,
                sourceUrl: "https://⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥.hidenfree.com"
            }
        },
        buttons: [
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: "api ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥-ai",
                    url: "https://⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥.hidenfree.com"
                })
            }
        ]
    }, { quoted: m });
};

handler.command = /^(الموقع)$/i;
export default handler;