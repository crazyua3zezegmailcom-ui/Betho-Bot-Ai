import axios from 'axios';
import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

// دالة التوثيق (Contact Quote) كما طلبتها
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
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${m.pushName || 'User'};;;;\nFN:${m.pushName || 'User'}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:📞 WhatsApp\nORG:HULK BOT ✓\nTITLE:Verified\nEND:VCARD`
      }
    },
    participant: '0@s.whatsapp.net'
  };
}

// وظائف التحميل
async function startConversion(videoUrl, quality) {
  const payload = {
    url: videoUrl,
    os: "linux",
    output: { type: "video", format: "mp4" },
    video: { quality: quality }
  };
  const headers = { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" };
  const { data } = await axios.post("https://hub.ytconvert.org/api/download", payload, { headers });
  return data.statusUrl;
}

async function waitForDownload(statusUrl) {
  while (true) {
    const { data } = await axios.get(statusUrl);
    if (data.status === "completed" || data.status === "success") return data.downloadUrl;
    if (data.status === "failed") throw new Error("فشل تحويل الفيديو");
    await new Promise(r => setTimeout(r, 2000));
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const fkontak = contactQuote(m);

  // 1. عرض خيارات الجودة
  if (command === 'فيديو') {
    if (!text) return conn.reply(m.chat, `*🎬 تحميل فيديو يوتيوب*\n\nيرجى إرسال الرابط مع الأمر.\nمثال:\n${usedPrefix}فيديو https://youtu.be/xxx`, fkontak);
    
    const url = text.trim();
    if (!url.includes('youtu')) return conn.reply(m.chat, `❌ رابط يوتيوب غير صحيح.`, fkontak);

    // جميع الجودات المطلوبة
    const qualities = ["144p", "240p", "360p", "480p", "720p", "1080p", "1440p", "2160p"];
    const encodedUrl = Buffer.from(url).toString('base64');

    const buttons = qualities.map(q => ({
      name: 'quick_reply',
      buttonParamsJson: JSON.stringify({
        display_text: `📥 جودة ${q}`,
        id: `${usedPrefix}جودة_فيديو ${q}|${encodedUrl}`
      })
    }));

    const interactiveMessage = {
      body: { text: `🎬 *تحميل فيديو يوتيوب*\n\nاختر جودة التحميل المطلوبة:` },
      footer: { text: '𝑵𝑬𝒁𝑼𝑲𝑶 𝑩𝑶𝑻' },
      nativeFlowMessage: { buttons }
    };

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: { message: { interactiveMessage } }
    }, { userJid: conn.user.jid, quoted: fkontak });

    return await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
  }

  // 2. المعالجة والتحميل عند اختيار الجودة
  if (command === 'جودة_فيديو') {
    if (!text) return;
    const [quality, encodedUrl] = text.split('|');
    const videoUrl = Buffer.from(encodedUrl, 'base64').toString();

    // الرد الفوري عند الضغط
    await conn.reply(m.chat, `⏳ جاري تنزيل الفيديو بجودة - ${quality}\nيرجى الانتظار...`, fkontak);

    try {
      const statusUrl = await startConversion(videoUrl, quality.trim());
      const downloadUrl = await waitForDownload(statusUrl);

      const response = await axios({ method: 'GET', url: downloadUrl, responseType: 'arraybuffer' });
      
      await conn.sendMessage(m.chat, {
        video: Buffer.from(response.data),
        mimetype: 'video/mp4',
        caption: `✅ تم تحميل الفيديو بنجاح.\nالجودة: ${quality}`
      }, { quoted: fkontak });

    } catch (err) {
      await conn.reply(m.chat, `❌ فشل تحميل الفيديو: ${err.message}`, fkontak);
    }
  }
};

handler.command = /^(فيديو|جودة_فيديو)$/i;
handler.tags = ['download']
export default handler;