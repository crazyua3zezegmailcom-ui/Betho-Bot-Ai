// تخيل.js - إنشاء صور من وصف نصي باستخدام Pollinations.ai (مجاني)
import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply(`🧩 *أمر إنشاء الصور* 🧩

⌬ الاستخدام:
.تخيل <وصف الصورة>

⌬ مثال:
.تخيل قطة ترتدي نظارة شمسية على شاطئ البحر

⌬ ملاحظة: يستخدم Pollinations.ai المجاني`);
  }

  await m.react('⏳');
  const wait = await conn.sendMessage(m.chat, { text: "🎨 جاري إنشاء الصورة... قد يستغرق 10-20 ثانية" }, { quoted: m });

  try {
    const prompt = encodeURIComponent(text);
    // استخدام نموذج flux للحصول على جودة أفضل
    const apiUrl = `https://image.pollinations.ai/prompt/${prompt}?model=flux&width=1024&height=1024&nologo=true`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`فشل الاتصال: ${response.status}`);
    
    const imageBuffer = await response.buffer();
    
    const caption = `🫐🪻🧩⚙️💮🌷🫠

✅ *تم إنشاء الصورة بنجاح*

📝 *الوصف:* ${text}
🖌️ *أداة التوليد:* Pollinations.ai (مجاني)

${emojis}
${myCredit}`;

    await conn.sendMessage(m.chat, { image: imageBuffer, caption }, { quoted: m });
    await conn.sendMessage(m.chat, { delete: wait.key });
    await m.react('✅');
  } catch (error) {
    console.error(error);
    await conn.sendMessage(m.chat, { edit: wait.key, text: `❌ فشل إنشاء الصورة: ${error.message}` });
    await m.react('❌');
  }
};

handler.help = ['تخيل <وصف>'];
handler.tags = ['ai', 'image'];
handler.command = /^(تخيل2)$/i;
handler.limit = true;

const myCredit = `.𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥`;
const emojis = `𝐵𝑦 𝐶𝑟𝑎𝑧𝑦 👑`;

export default handler;