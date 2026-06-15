import axios from 'axios';
import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

// الحقوق والزخارف الخاصة بك
const myCredit = `.𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥`;
const emojis = `ⲂＹ 𝐶𝑟𝑎𝑧𝑦 3ℝΑＢ 𝒅𝒆𝒗𝒔 🥝👑`;



let handler = async (m, { conn, text, usedPrefix, command }) => {

  if (command === 'تيك' || command === 'tiktok') {
    if (!text) return conn.reply(m.chat, `*_هـلا_* 🫠\n\n📌 يـرجـى إرسـال الـرابط مـع الأمـر.`);
    
    const url = text.trim();
    if (!url.includes('tiktok.com')) return conn.reply(m.chat, `*_هـلا_* ❌\n\nرابـط تـيـك تـوك غـيـر صـحـيـح.`);

    await conn.reply(m.chat, `*_هـلا_* ⏳\n\nجـاري جـلـب الـجـودات مـن تـيـك تـوك...`);

    try {
      let res = await axios.get(`https://www.tikwm.com/api/?url=${url}`);
      let data = res.data.data;

      if (!data) throw new Error('لم يتم العثور على الفيديو');

      let hdUrl = data.hdplay || data.play; 
      let sdUrl = data.play; 

      let encodedHd = Buffer.from(hdUrl).toString('base64');
      let encodedSd = Buffer.from(sdUrl).toString('base64');

      const buttons = [
        {
          name: 'quick_reply',
          buttonParamsJson: JSON.stringify({
            display_text: `📥 جـودة عـالـيـة (HD 1080p)`,
            id: `${usedPrefix}جودة_تيك HD|${encodedHd}`
          })
        },
        {
          name: 'quick_reply',
          buttonParamsJson: JSON.stringify({
            display_text: `📥 جـودة عـاديـة (SD)`,
            id: `${usedPrefix}جودة_تيك SD|${encodedSd}`
          })
        }
      ];

      const interactiveMessage = {
        body: { text: `*_هـلا_*\n\n🎬 *تـحـمـيـل تـيـك تـوك*\n\nأخـتـار الـجـودة الـلـي تـبـيـهـا 👇` },
        footer: { text: 'تـم بـواسـطـة ' + myCredit },
        nativeFlowMessage: { buttons }
      };

      const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: { message: { interactiveMessage } }
      }, { userJid });

      return await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (e) {
      return conn.reply(m.chat, `*_هـلا_* ❌\n\nفـشـل فـي جـلـب الـفـيـديـو.`);
    }
  }

  if (command === 'جودة_تيك') {
    if (!text) return;
    const [quality, encodedUrl] = text.split('|');
    const videoUrl = Buffer.from(encodedUrl, 'base64').toString('utf-8');

    await conn.reply(m.chat, `*_هـلا_* ⏳\n\nجـاري الـتـحـمـيـل بـدقـة ${quality} جـاري الـتـحـويـل لـوضـع HD...`);

    try {
      const captionText = `*_هـلا_*\n\n✅ تـم الـتـحـمـيـل بـنـجـاح\n🎬 الـجـودة: ${quality === 'HD' ? '1080p (High Quality)' : 'Standard'}\n\n${emojis}\n\nتـم بـواسـطـة\n${myCredit}`;

      // إرسال الفيديو مع تفعيل وضع الدقة العالية
      await conn.sendMessage(m.chat, {
        video: { url: videoUrl },
        mimetype: 'video/mp4',
        caption: captionText,
        fileName: `Betho_HD.mp4`,
        // هذه الإعدادات تجبر واتساب على محاولة عرضها كـ HD
        height: 1920,
        width: 1080,
        headerType: 4
      }, {});

    } catch (err) {
      await conn.reply(m.chat, `*_هـلا_* ❌\n\nفـشـل الـتـحـمـيـل: ${err.message}`);
    }
  }
};

handler.command = /^(تيك|tiktok|جودة_تيك)$/i;
handler.tags = ['downloader'];
export default handler;