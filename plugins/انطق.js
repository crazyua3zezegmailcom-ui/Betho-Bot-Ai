// م࣬ــࢪحہּٰـبٚأ بٚـڪٰٖ فَــي أوٰأم࣬ـࢪ ۿأݪــڪٰٖي ؍ 🌸♡゙ ُ𓂁
// أوٰأم࣬ــࢪ م࣬ٺم࣬يــژۿ . ⊹
// حہּٰقَــــوٰقَ 𝐶𝑟𝑎𝑧𝑦 𝒅𝒆𝒗 🐦☕
// أݪــسٰࢪقَــۿ ݪأ ٺــفَـيډڪٰٖ يم࣬غٰــفَݪ لا تغير الحقوق فقط استعير
// أسٰـم࣬ أݪأم࣬ــࢪ انطق1.js
// ٺـأࢪيخَ صَـنٰأـ؏ٚـۿ أݪــبٚوٰٺ ؍ 🌸♡゙ ُ𓂁 2025_3_25
// ࢪأبٚــطَ قَنٰــأۿ أݪم࣬ــطَــوٰࢪ ..)✘🖤🧸.
// https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e

import axios from 'axios';
import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

const TTS_LIST_API = 'https://obito-mr-apis.vercel.app/api/tts/voice/list';
const TTS_GEN_API = 'https://obito-mr-apis.vercel.app/api/tts/voice/tts';

// الزخارف
const startDeco = `☽⚝ͫ͢❏ِꏍ🍡﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ ﷽⎆☽⚝ͫ͢❏ِ🍡ꏍﭕ﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ
╮ ⊰✫⊱─⊰✫⊱─⊰✫⊱╭`;
const endDeco = `┘⊰✫⊱─⊰✫⊱─⊰✫⊱└
☽⚝ͫ͢❏ِꏍ🍡﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ ﷽⎆☽⚝ͫ͢❏ِꏍﭕ🍡﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ`;

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

// دالة جلب قائمة الأصوات العربية
async function fetchArabicVoices() {
  try {
    const res = await axios.get(TTS_LIST_API);
    if (!res.data?.success) return [];
    const arabicLangs = res.data.languages.filter(lang => lang.code.startsWith('ar-'));
    const voices = [];
    for (const lang of arabicLangs) {
      for (const voice of lang.voices) {
        voices.push({
          id: voice.id,
          name: voice.name,
          gender: voice.gender === 'ذكر' ? '♂️' : '♀️',
          langName: lang.name
        });
      }
    }
    return voices;
  } catch (err) {
    console.error('Error fetching voices:', err);
    return [];
  }
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    // --- 1. الأمر الرئيسي: عرض قائمة الأصوات ---
    if (command === 'انطق1') {
      if (!text) {
        return conn.reply(
          m.chat,
          `${startDeco}\n\n*🎙️ تحويل النص إلى كلام (TTS)*\n\n📝 الاستخدام:\n${usedPrefix}انطق1 النص المراد نطقه\n\nمثال:\n${usedPrefix}انطق1 مرحبا بك\n\n${endDeco}`,
          contactQuote(m)
        );
      }

      await conn.reply(m.chat, `${startDeco}\n\n⏳ *جاري جلب قائمة الأصوات...*\n\n${endDeco}`, m);

      const voices = await fetchArabicVoices();
      if (!voices.length) throw 'لم يتم العثور على أصوات عربية';

      // بناء الصفوف (حد أقصى 10)
      const rows = voices.slice(0, 10).map(voice => ({
        title: `${voice.name} ${voice.gender}`,
        description: voice.langName,
        id: `${usedPrefix}اختر_لهجة ${voice.id}|${encodeURIComponent(text)}`
      }));

      const sections = [{
        title: '🎙️ اختر اللهجة المناسبة',
        rows
      }];

      const interactiveMessage = {
        body: {
          text: `${startDeco}\n\n*اختر اللهجة التي تريدها للنص:*\n\n"${text}"\n\n${endDeco}`
        },
        footer: { text: '𝒉𝒖𝒍𝒌 𝒃𝒐𝒕 𝒎𝒅' },
        nativeFlowMessage: {
          buttons: [{
            name: 'single_select',
            buttonParamsJson: JSON.stringify({ title: '🎤 اختر الصوت', sections })
          }]
        }
      };

      const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: { message: { interactiveMessage } }
      }, { userJid: conn.user.jid, quoted: m });

      return await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    }

    // --- 2. معالج اختيار اللهجة وتوليد الصوت ---
    if (command === 'اختر_لهجة') {
      if (!text) return;
      const [voiceId, encodedText] = text.split('|');
      if (!voiceId || !encodedText) throw 'بيانات غير صالحة';
      const originalText = decodeURIComponent(encodedText);

      await conn.reply(
        m.chat,
        `${startDeco}\n\n⏳ *جاري توليد الصوت...*\n🔊 اللهجة: ${voiceId}\n📝 النص: ${originalText}\n\n${endDeco}`,
        m
      );

      const genUrl = `${TTS_GEN_API}?txt=${encodeURIComponent(originalText)}&voice=${voiceId}`;
      const res = await axios.get(genUrl);
      if (!res.data?.success || !res.data?.data?.audio_url) throw 'فشل توليد الصوت';

      const audioUrl = res.data.data.audio_url;
      await conn.sendMessage(
        m.chat,
        {
          audio: { url: audioUrl },
          mimetype: 'audio/mpeg',
          fileName: `tts_${voiceId}.mp3`,
          ptt: false,
          caption: `${startDeco}\n\n✅ *تم توليد الصوت بنجاح*\n🎤 اللهجة: ${voiceId}\n📝 النص: ${originalText}\n\n${endDeco}`
        },
        { quoted: m }
      );
      return;
    }
  } catch (err) {
    console.error('TTS error:', err);
    await conn.reply(m.chat, `${startDeco}\n\n❌ خطأ: ${err.message || err}\n\n${endDeco}`, m);
  }
};

handler.help = ['انطق1'];
handler.tags = ['tools'];
handler.command = /^(انطق1|اختر_لهجة)$/i;

export default handler;