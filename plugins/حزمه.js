import axios from 'axios';

/**
 * 👑 ميزة البحث وتحميل حزم اللملصقات من Sticker.ly (نظام البافر المضمون)
 * ⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓
 */

const startDeco = `☽⚝ͫ͢❏ِꏍ🍡﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ ﷽⎆☽⚝ͫ͢❏ِ🍡ꏍﭕ﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ\n╮ ⊰✫⊱─⊰✫⊱─⊰✫⊱╭`;
const endDeco = `┘⊰✫⊱─⊰✫⊱─⊰✫⊱└\n☽⚝ͫ͢❏ِꏍ🍡﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ ﷽⎆☽⚝ͫ͢❏ِꏍﭕ🍡﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ`;

// روابط سيرفرات يوكي الاحتياطية المباشرة
const YUKI_API_URL = 'https://api.yuki.sh'; 
const YUKI_API_KEY = 'yuki';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const isStickerUrl = (url) => {
  return /^(https?:\/\/)?(www\.)?sticker\.ly\/s\/[a-zA-Z0-9]+$/i.test(url);
};

const searchPacks = async (query, attempt = 1) => {
  try {
    const { data } = await axios.get(`${YUKI_API_URL}/stickerly/search`, { params: { query, key: YUKI_API_KEY }, timeout: 10000 });
    return data;
  } catch (e) {
    if (e.response?.status === 429 && attempt <= 3) { await delay((e.response.headers['retry-after'] || 5) * 1000); return searchPacks(query, attempt + 1); }
    throw e;
  }
};

const downloadPack = async (url, attempt = 1) => {
  try {
    const { data } = await axios.get(`${YUKI_API_URL}/stickerly/detail`, { params: { url, key: YUKI_API_KEY }, timeout: 10000 });
    return data;
  } catch (e) {
    if (e.response?.status === 429 && attempt <= 3) { await delay((e.response.headers['retry-after'] || 5) * 1000); return downloadPack(url, attempt + 1); }
    if (e.response?.status === 500) return { status: false, error: 500 };
    throw e;
  }
};

const filterRelevantPacks = (packs, query) => {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return packs;
  return packs.filter(pack => {
    const packName = (pack.name || '').toLowerCase();
    return packName.includes(searchTerm);
  });
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) return conn.reply(m.chat, `${startDeco}\n\n⚠️ *تنبيه:* يرجى إدخال نص للبحث أو رابط حزمة من sticker.ly\n*مثال:* \`${usedPrefix + command} لوفي\`\n\n${endDeco}`, m);
    
    await m.react('⏳');
    const name = global.db?.data?.users?.[m.sender]?.name || m.sender.split('@')[0];
    let packData;
    
    const stickerMatch = text.match(/(?:sticker\.ly\/s\/)([a-zA-Z0-9]+)(?:\s|$)/);
    const url = stickerMatch ? 'https://sticker.ly/s/' + stickerMatch[1] : (isStickerUrl(text) ? text : null);
    
    if (url) {
      let detail = await downloadPack(url);
      if (!detail || !detail.status || detail.error === 500) {
        await m.react('❌');
        return conn.reply(m.chat, `${startDeco}\n\n❌ *عذراً:* الحزمة المطلوبة غير متاحة حالياً.\n\n${endDeco}`, m);
      }
      packData = detail.detalles;
    } else {
      const search = await searchPacks(text);
      if (!search.status || !search.resultados?.length) {
        await m.react('❌');
        return conn.reply(m.chat, `${startDeco}\n\n❌ لم يتم العثور على أي حزم لـ *${text}*.\n\n${endDeco}`, m);
      }
      const relevantPacks = filterRelevantPacks(search.resultados, text);
      let packsToTry = relevantPacks.length > 0 ? relevantPacks : search.resultados;
      let detail = null;
      let intentos = 0;
      const maxIntentos = Math.min(packsToTry.length, 3); // فحص أول 3 نتائج لسرعة الأداء
      
      while (intentos < maxIntentos && !detail) {
        const res = await downloadPack(packsToTry[intentos].url);
        if (res?.status && res?.detalles?.stickers?.length > 0) {
          detail = res.detalles;
          break;
        }
        intentos++;
      }
      if (!detail) {
        await m.react('❌');
        return conn.reply(m.chat, `${startDeco}\n\n❌ لم يتمكن البوت من تحميل حزمة صالحة.\n\n${endDeco}`, m);
      }
      packData = detail;
    }
    
    const { name: packName, author, stickers } = packData;
    if (!stickers?.length) {
      await m.react('❌');
      return conn.reply(m.chat, `${startDeco}\n\n⚠️ الحزمة فارغة.\n\n${endDeco}`, m);
    }
    
    // نأخذ أول 10 لملصقات فقط لضمان سرعة التحميل والارسال بالتوازي بدون كراش
    const selectedStickers = stickers.slice(0, 10);
    const stickersList = [];

    // 🔥 السحر هنا: تحميل اللملصقات كبافر بالتوازي مثل كود التينور تماماً!
    await Promise.all(
      selectedStickers.map(async (s) => {
        try {
          const { data } = await axios.get(s.imageUrl, { responseType: 'arraybuffer', timeout: 10000 });
          stickersList.push({
            sticker: data, // إرسال البافر النقي لبايلس مباشرة
            isAnimated: s.isAnimated || false,
            isLottie: false,
            emojis: ['🎭', '✨']
          });
        } catch (e) {
          console.error(`فشل تحميل اللملصق: ${s.imageUrl}`);
        }
      })
    );

    if (stickersList.length === 0) {
      await m.react('❌');
      return conn.reply(m.chat, `${startDeco}\n\n❌ فشل معالجة بافر اللملصقات.\n\n${endDeco}`, m);
    }
    
    const fullPackName = packName || `حزمة: ${text}`;
    const publisherName = author?.name || `⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 بوت لـ ${name}`;

    // 📦 الإرسال بنفس طريقة كود التينور الشغال عندك 100%
    await conn.sendMessage(m.chat, { 
      stickerPack: { 
        name: fullPackName, 
        publisher: publisherName, 
        description: '𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣 ͝ 𝑩𝜣𝑻🍓', 
        stickers: stickersList 
      } 
    }, { quoted: m });
    
    await m.react('✅');
  } catch (e) {
    await m.react('❌');
    return conn.reply(m.chat, `> 💥 *خطأ بالسيستم:* ${e.message}`, m);
  }
};

handler.help = ['ستيكرلي'];
handler.tags = ['stickers'];
handler.command = /^(stickerpack|spack|stickers|لملصقات2|حزمة2)$/i;

export default handler;