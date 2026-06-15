// م࣬ــࢪحہּٰـبٚأ بٚـڪٰٖ فَــي أوٰأم࣬ـࢪ ۿأݪــڪٰٖي ؍ 🌸♡゙ ُ𓂁
// أوٰأم࣬ــࢪ م࣬ٺم࣬يــژۿ . ⊹
// حہּٰقَــــوٰقَ 𝒎𝒐𝒏𝒕𝒆 𝒅𝒆𝒗 🐦☕
// أݪــسٰࢪقَــۿ ݪأ ٺــفَـيډڪٰٖ يم࣬غٰــفَݪ
// أسٰـم࣬ أݪأم࣬ــࢪ ايديت.js
// ٺـأࢪيخَ صَـنٰأـ؏ٚـۿ أݪــبٚوٰٺ ؍ 🌸♡゙ ُ𓂁 2024_9_22
// ࢪأبٚــطَ قَنٰــأۿ أݪم࣬ــطَــوٰࢪ ..)✘🖤🧸.
// https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e

import axios from 'axios'
import { proto, generateWAMessageFromContent, generateWAMessageContent } from '@whiskeysockets/baileys'

// --- إعدادات القناة والتوجيه ---
const newsletterJid = '120363428186936884@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡『 𝒉𝒖𝒍𝒌 𝘾𝒉꯭𝐚𝑛𝑛𝒆𝑙:';
const botName = 'ḢＵĻΚ 𝒎𝒅 ؍ 🌸♡゙ ُ𓂁⩉⩉';
const botDesc = 'بوت تحميل وإيديتات تيك توك ⩉⩉ᤑ 🎬';

// الزخارف
const startDeco = `☽⚝ͫ͢❏ِꏍ🍡﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ ﷽⎆☽⚝ͫ͢❏ِ🍡ꏍﭕ﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ
╮ ⊰✫⊱─⊰✫⊱─⊰✫⊱╭`;
const endDeco = `┘⊰✫⊱─⊰✫⊱─⊰✫⊱└
☽⚝ͫ͢❏ِꏍ🍡﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ ﷽⎆☽⚝ͫ͢❏ِꏍﭕ🍡﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ`;

// دالة لإنشاء contextInfo مع إعادة التوجيه
function getContextInfo(m, additionalMentions = []) {
  const mentions = [m.sender, ...additionalMentions];
  return {
    mentionedJid: mentions,
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: {
      newsletterJid,
      newsletterName,
      serverMessageId: -1
    },
    externalAdReply: {
      title: botName,
      body: botDesc,
      thumbnail: global.icons,
      sourceUrl: global.redes,
      mediaType: 1,
      renderLargerThumbnail: false
    }
  };
}

// دالة لتزيين النص
const decorate = (text) => `${startDeco}\n\n${text}\n\n${endDeco}`;

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      decorate(`📌 *يرجى إدخال كلمة البحث أو رابط تيك توك*\n\nمثال:\n*${usedPrefix + command} رقص*\n*${usedPrefix + command} https://vm.tiktok.com/xxxx*`),
      m,
      { contextInfo: getContextInfo(m), quoted: m }
    );
  }

  const isUrl = /(?:https?:\/\/)?(?:www\.|vm\.|vt\.|t\.)?tiktok\.com\/([^\s&]+)/gi.test(text);

  try {
    await m.react('🕒');

    if (isUrl) {
      // معالجة الرابط
      const res = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(text)}?hd=1`);
      const data = res.data?.data;
      if (!data?.play && !data?.music) {
        return conn.reply(
          m.chat,
          decorate(`❌ *الرابط غير صالح أو لا يحتوي على محتوى قابل للتنزيل*`),
          m,
          { contextInfo: getContextInfo(m), quoted: m }
        );
      }

      const { title, author, play, music } = data;

      if (command === 'تيك_صوت' || command === 'ttaudio') {
        if (!music) {
          return conn.reply(
            m.chat,
            decorate(`❌ *لم يتم العثور على صوت في هذا الفيديو*`),
            m,
            { contextInfo: getContextInfo(m), quoted: m }
          );
        }

        await conn.sendMessage(
          m.chat,
          {
            audio: { url: music },
            mimetype: 'audio/mpeg',
            fileName: `tiktok_audio.mp3`,
            ptt: false
          },
          { contextInfo: getContextInfo(m), quoted: m }
        );
      } else {
        const caption = decorate(`🎬 *العنوان:* ${title || 'غير متوفر'}\n👤 *المؤلف:* ${author?.nickname || 'غير متوفر'}`);
        await conn.sendMessage(
          m.chat,
          { video: { url: play }, caption },
          { contextInfo: getContextInfo(m), quoted: m }
        );
      }
    } else {
      // البحث بالنص
      if (command === 'تيك_صوت' || command === 'ttaudio') {
        return conn.reply(
          m.chat,
          decorate(`🎵 *لتحميل الصوت يرجى إرسال رابط فيديو تيك توك*`),
          m,
          { contextInfo: getContextInfo(m), quoted: m }
        );
      }

      const res = await axios({
        method: 'POST',
        url: 'https://tikwm.com/api/feed/search',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data: { keywords: `${command} ${text}`, count: 5, cursor: 0, HD: 1 }
      });

      const results = res.data?.data?.videos?.filter(v => v.play) || [];
      if (!results.length) {
        return conn.reply(
          m.chat,
          decorate(`🔍 *لم يتم العثور على نتائج للبحث*`),
          m,
          { contextInfo: getContextInfo(m), quoted: m }
        );
      }

      const cards = [];
      for (let video of results) {
        cards.push({
          body: proto.Message.InteractiveMessage.Body.fromObject({ text: null }),
          footer: proto.Message.InteractiveMessage.Footer.fromObject({
            text: '»Ｈ꒷Ｕ↝ℒĸ 𝒃𝒐ᶧ ..)✘🖤🧸.'
          }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            title: video.title || 'بدون عنوان',
            hasMediaAttachment: true,
            videoMessage: (await generateWAMessageContent(
              { video: { url: video.play } },
              { upload: conn.waUploadToServer }
            )).videoMessage
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
            buttons: [
              // زر رابط خارجي فقط (كما طلبت)
              {
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                  display_text: '.𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥𝑩𝜣𝑻👑',
                  url: 'https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e'
                })
              }
            ]
          })
        });
      }

      const responseMessage = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              body: proto.Message.InteractiveMessage.Body.create({ text: decorate('🔎 *نتائج البحث عن إيديتات تيك توك*') }),
              footer: proto.Message.InteractiveMessage.Footer.create({ text: '『 𝒉𝒖𝒍𝒌 𝒃𝒐𝒕 』' }),
              header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
              carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards })
            })
          }
        }
      }, { quoted: m, contextInfo: getContextInfo(m) });

      await conn.relayMessage(m.chat, responseMessage.message, { messageId: responseMessage.key.id });
    }

    await m.react('✅');
  } catch (e) {
    console.error(e);
    await m.react('❌');
    await conn.reply(
      m.chat,
      decorate(`❌ *حدث خطأ:*\n${e.message}`),
      m,
      { contextInfo: getContextInfo(m), quoted: m }
    );
  }
};

handler.help = ['تيك_توك', 'تيك_صوت'];
handler.tags = ['search'];
handler.command = ['ايديت'];
handler.group = true;

export default handler;