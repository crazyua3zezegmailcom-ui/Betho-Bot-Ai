import { webp2mp4 } from '../lib/webp2mp4.js';
import { ffmpeg } from '../lib/converter.js'; 

const handler = async (m, { conn }) => {
  if (!m.quoted) {
    return conn.reply(m.chat, `⚠️ من فضلك قم بالرد على *ملصق* (Sticker) تريد تحويله إلى فيديو.`, m);
  }
  
  const mime = m.quoted.mimetype || '';
  if (!/webp/.test(mime)) {
    return conn.reply(m.chat, `⚠️ الملف الذي رددت عليه ليس ملصق. من فضلك رد على *Sticker* صحيح.`, m);
  }
  
  const media = await m.quoted.download();
  let out = Buffer.alloc(0);
  
  conn.reply(m.chat, `⏳ جاري معالجة الفيديو بأعلى جودة HD، برجاء الانتظار...`, m);

  if (/webp/.test(mime)) {
    // تحويل الملصق إلى فيديو
    out = await webp2mp4(media);
  } else if (/audio/.test(mime)) {
    // تحويل الصوت إلى فيديو بجودة HD وبأبعاد ممتازة
    out = await ffmpeg(media, [
      '-f', 'lavfi', 
      '-i', 'color=c=black:s=1280x720:r=25', // تحديد أبعاد HD (1280x720) وخلفية سوداء
      '-vcodec', 'libx264',
      '-crf', '18', // 18 تعني جودة عالية جداً وشبه خالية من التشويش (HD)
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac',
      '-b:a', '192k', // جودة صوت نقية وعالية
      '-shortest',
    ], 'mp3', 'mp4');
  }
  
  // إرسال الفيديو الناتج بجودة HD وبدون ضغط إضافي من الواتساب
  await conn.sendMessage(m.chat, { 
    video: (typeof out === 'string' ? { url: out } : out), 
    caption: `✅ تم تحويل الملصق إلى فيديو بجودة عالية **HD** 🎬`
  }, { quoted: m });
};

handler.help = ['لفيديو'];
handler.tags = ['تحويل'];
handler.group = true;
handler.register = true;
handler.command = ['لفيديو']; 

export default handler;