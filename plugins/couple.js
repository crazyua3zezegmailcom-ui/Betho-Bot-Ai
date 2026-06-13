// instagram: 𝐶𝑟𝑎𝑧𝑦_ouafy

import axios from 'axios';
import { channelButton } from '../system/buttons.js'

const DATA_URL = 'https://github.com/rikikangsc2-eng/metadata/raw/refs/heads/main/couple.json';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

let handler = async (m, { conn }) => {
  await m.reply('📸 جاري البحث عن صور ثنائية مناسبة لك... 💑');

  try {
    const { data: coupleList } = await axios.get(DATA_URL);

    if (!coupleList || !Array.isArray(coupleList) || coupleList.length === 0) {
      throw '⚠️ لم يتم العثور على بيانات صالحة.';
    }

    const couple = coupleList[Math.floor(Math.random() * coupleList.length)];

    if (!couple.male || !couple.female) {
      throw '❌ البيانات غير مكتملة.';
    }

    const [maleResponse, femaleResponse] = await Promise.all([
      axios.get(couple.male, { responseType: 'arraybuffer', timeout: 30000 }),
      axios.get(couple.female, { responseType: 'arraybuffer', timeout: 30000 })
    ]);

    await conn.sendMessage(m.chat, { image: maleResponse.data, caption: '👦 صورة الشاب',
        footer: '『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』',
        buttons: channelButton()}, { quoted: m });
    await delay(300);
    await conn.sendMessage(m.chat, { image: femaleResponse.data, caption: '👧 صورة الفتاة',
        footer: '『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』',
        buttons: channelButton()}, { quoted: m });

  } catch (e) {
    console.error('❌ خطأ أثناء جلب صور الثنائي:', e);
    await m.reply('⚠️ حدث خطأ أثناء جلب الصور. الرجاء المحاولة لاحقًا.');
  }
};

handler.help = ['زوجان'];
handler.tags = ['tools'];
handler.command = ['زوجان'];
handler.limit = true;
export default handler;
