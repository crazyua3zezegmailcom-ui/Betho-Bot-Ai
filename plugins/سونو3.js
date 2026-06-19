/**
 * 🎤 Suno AI Text-to-Song v3 — ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 سونو (توليد الأغاني بالذكاء الاصطناعي)
 * ⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓
 * الاصدار الثالث المطور - دعم دمج الغلاف العريض
 */

import axios from "axios";

const myCredit = `*_ .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓 _*`;

// ── دالة جلب البيانات من الـ API المعتمد ──
async function suno(prompt) {
  if (!prompt) throw "البرومبت أو الوصف مطلوب!";

  const url = `https://omegatech-api.dixonomega.tech/api/ai/sonu3?action=full&prompt=${encodeURIComponent(prompt)}`;
  const { data } = await axios.get(url);

  if (!data?.success) throw "فشل السيرفر في توليد الأغنية، حاول لاحقاً!";

  return {
    title: data.title,
    audio_url: data.url,
    image_url: data.thumbnail,
    lyrics: data.lyrics,
    tags: data.tags,
    duration: data.duration,
  };
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) {
      return m.reply(
        `*_ هـلا 🫠 _*\n\n*_ يـرجـى كـتـابـة الـوصـف (الـبـرومـبـت) بـعـد الأمـر _*\n*_ مـثال: ${usedPrefix + command} Sad song about rain _*`
      );
    }

    await m.react("🪄");
    await m.reply(`* .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀🍡 _*\n\n*_ جـاري تـولـيـد الأغـنـيـة بـالـذڪـاء الاصـطـنـاعـي (v3)... قـد يـسـتـغـرق الأمـر دقيقة ⏳ _*`);

    const track = await suno(text);

    // سحب الملفات الصوتية والصور كـ Buffers متوازية لتسريع المعالجة
    const [audioRes, imgRes] = await Promise.all([
      axios.get(track.audio_url, {
        responseType: "arraybuffer",
        headers: { "User-Agent": "Mozilla/5.0" }
      }),
      axios.get(track.image_url, {
        responseType: "arraybuffer"
      })
    ]);

    const audioBuffer = Buffer.from(audioRes.data);
    const imgBuffer = Buffer.from(imgRes.data);

    // تحويل المدة لصيغة دقائق وثواني مفهومة لبوت ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥
    const durationMin = `${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, '0')}`;

    // 1️⃣ إرسال ملف الصوت مع الميتاداتا والغلاف العريض الاحترافي
    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: "audio/mpeg",
      ptt: false,
      fileName: `${track.title || 'Suno_Track'}.mp3`,
      jpegThumbnail: imgBuffer,
      contextInfo: {
        externalAdReply: {
          title: `▶️ تـم الـتـولـيـد: ${track.title || 'بدون عنوان'}`,
          body: `🎵 الـتـصـنـيـف: ${track.tags || 'لا يوجد'} • ⏱️ الـمـدة: ${durationMin}`,
          thumbnailUrl: track.image_url,
          mediaType: 1,
          renderLargerThumbnail: true, // تفعيل الغلاف الكبير الفخم أسفل الرسالة
          sourceUrl: "https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e"
        }
      }
    }, { quoted: m });

    // 2️⃣ إرسال رسالة الكلمات المزخرفة بعناية ل⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 بوت
    let lyricsCaption = 
`✨ *𓏲⋆˙ ڪـلـمـات الأغـنـيـة المـولـدة 🎤 _*\n` +
`🌸 *الـعـنـوان:* ${track.title || 'بدون عنوان'}\n` +
`──────────────────\n\n` +
`${track.lyrics || "📜 لا توجد كلمات متوفرة لهذه الأغنية."}\n\n` +
`──────────────────\n` +
`✨ *🏷️ الـهـاشـتـاقـات:* ${track.tags || 'لا يوجد'}\n` +
`${myCredit}`;

    await conn.sendMessage(m.chat, { text: lyricsCaption }, { quoted: m });
    await m.react("✅");

  } catch (e) {
    console.error("Suno v3 Error:", e);
    await m.react("❌");
    m.reply(`❌ *حـصـل خـطأ أثـنـاء تـولـيـد الأغـنـيـة:* ${e}`);
  }
};

handler.help = ["سونو3"];
handler.tags = ["ai"];
handler.command = /^(سونو3|suno3)$/i;

export default handler;