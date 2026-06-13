// instagram.com/𝐶𝑟𝑎𝑧𝑦_ouafy

import axios from 'axios';
import FormData from 'form-data';
import * as cheerio from 'cheerio';
import { downloadButtons } from '../system/buttons.js'

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('المرجو إرسال رابط تغريدة يحتوي على فيديو');

  await m.reply('المرجو الانتظار قليلا لا تنسى ان تتابع \ninstagram.com/𝐶𝑟𝑎𝑧𝑦_ouafy');

  try {
    const form = new FormData();
    form.append('q', text);
    form.append('lang', 'en');
    form.append('cftoken', '');

    const { data } = await axios.post('https://savetwitter.net/api/ajaxSearch', form, {
      headers: {
        ...form.getHeaders()
      }
    });

    if (!data.data) throw 'لم يتم العثور على الفيديو أو الرابط غير صالح';

    const $ = cheerio.load(data.data);
    const thumbnail = $('.image-tw img').attr('src');
    const result = [];

    $('.dl-action a').each((_, el) => {
      const link = $(el).attr('href');
      const label = $(el).text().trim();
      if (link && label.includes('Download MP4')) {
        result.push({
          quality: label.replace('Download MP4', '').trim().replace('(', '').replace(')', ''),
          url: link,
          thumbnail
        });
      }
    });

    if (result.length === 0) throw 'لم يتم العثور على روابط تحميل الفيديو';

    const best = result[0]; // اختار أول جودة متوفرة (عادة الأفضل)
    const res = await axios.get(best.url, { responseType: 'arraybuffer' });

    await conn.sendFile(m.chat, Buffer.from(res.data), 'twitter.mp4', null, m);
    try { await conn.sendMessage(m.chat, { text: '⬇️ *تم التحميل بنجاح*', footer: '『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』', buttons: downloadButtons() }, { quoted: m }) } catch (_e) {}

  } catch (e) {
    console.error(e);
    m.reply('حدث خطأ أثناء تحميل فيديو تويتر. تأكد من أن الرابط صحيح.');
  }
};

handler.help = ['تحميل-تويتر'];
handler.tags = ['downloader'];
handler.command = /^تحميل-تويتر$/i;
handler.limit = true;
export default handler;
