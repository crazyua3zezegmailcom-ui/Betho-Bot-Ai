import axios from 'axios';
import * as cheerio from 'cheerio';

const myCredit = `*_ .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢ _*`;
const startDeco = `☽⚝ͫ͢❏ِꏍ🍡﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ ﷽⎆☽⚝ͫ͢❏ِ🍡ꏍﭕ﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ\n╮ ⊰✫⊱─⊰✫⊱─⊰✫⊱╭`;
const endDeco = `┘⊰✫⊱─⊰✫⊱─⊰✫⊱└\n☽⚝ͫ͢❏ِꏍ🍡﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ ﷽⎆☽⚝ͫ͢❏ِꏍﭕ🍡﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ`;

const EGYDEAD_BASE = 'https://tv9.egydead.live';

const AX = axios.create({
  timeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'ar,en;q=0.8',
    'Referer': EGYDEAD_BASE + '/',
  },
});

function contactQuote(m) {
  return {
    key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'HULK' },
    message: {
      contactMessage: {
        displayName: m.pushName || 'Unknown',
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${m.pushName || 'User'};;;;\nFN:${m.pushName || 'User'}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:📞 WhatsApp\nORG:BETHO BOT ✓\nTITLE:Verified\nEND:VCARD`
      }
    },
    participant: '0@s.whatsapp.net'
  };
}

// Search EgyDead and return matching posts
async function searchEgyDead(query) {
  const res = await AX.get(`${EGYDEAD_BASE}/?s=${encodeURIComponent(query)}`);
  const $ = cheerio.load(res.data);

  const results = [];
  const seen = new Set();

  // Target content links that look like movie/series slugs (contain a year or quality keyword)
  const CONTENT_PATTERN = /\d{4}|bluray|web-dl|webrip|1080p|720p|season|assembly/i;
  const SKIP_PATTERN = /\/category\/|\/series-category\/|\/page\/|\/tag\/|\/episode\/|#/;

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    if (
      href.startsWith(EGYDEAD_BASE + '/') &&
      href !== EGYDEAD_BASE + '/' &&
      !SKIP_PATTERN.test(href) &&
      CONTENT_PATTERN.test(href) &&
      text.length > 4 &&
      text.length < 120 &&
      !seen.has(href)
    ) {
      seen.add(href);
      results.push({ title: text, url: href });
    }
  });

  return results;
}

// Fetch download links from a movie/series page
async function getDownloadLinks(pageUrl) {
  const payload = new URLSearchParams({ View: 1 });
  const res = await AX.post(pageUrl, payload, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  const $ = cheerio.load(res.data);

  // Page title (movie name)
  const pageTitle = $('title').text().replace('| ايجي ديد', '').replace('مشاهدة', '').trim();

  // Poster image
  const poster =
    $('img.wp-post-image').attr('src') ||
    $('.single-thumbnail img').attr('src') ||
    $('.singleCover img').attr('src') ||
    null;

  // Extract download links: any external link not belonging to EgyDead
  const links = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    const text = $(el).text().trim() || 'تحميل';
    if (
      href.startsWith('http') &&
      !href.includes('egydead') &&
      !href.includes('google') &&
      !href.includes('facebook') &&
      !href.includes('twitter') &&
      !href.includes('x.com') &&
      !href.includes('youtube') &&
      !href.includes('telegram') &&
      href.length > 20
    ) {
      // Try to get a friendly host name
      let host = '';
      try { host = new URL(href).hostname.replace('www.', ''); } catch (_) {}
      links.push({ text: host || text, url: href });
    }
  });

  return { pageTitle, poster, links };
}

const handler = async (m, { conn, usedPrefix, command, text }) => {
  const fkontak = contactQuote(m);
  const isMovie = ['فليم', 'فيلم', 'movie'].includes(command);
  const label = isMovie ? '🎬 فيلم' : '📺 مسلسل';

  if (!text) {
    return conn.reply(
      m.chat,
      `${startDeco}\n\n${label}\n\nأرسل اسم المحتوى أو رابط الصفحة مباشرة.\n\nأمثلة:\n• \`${usedPrefix + command} sonic\`\n• \`${usedPrefix + command} https://tv9.egydead.live/sonic-the-hedgehog-3-2024/\`\n\n${endDeco}`,
      fkontak,
    );
  }

  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

  try {
    // If user passed a direct URL, skip search
    if (text.startsWith('http')) {
      const { pageTitle, poster, links } = await getDownloadLinks(text);

      if (!links.length) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        return conn.reply(m.chat, `${startDeco}\n\n❌ لم يتم العثور على روابط تحميل في هذه الصفحة.\n\n${endDeco}`, fkontak);
      }

      let msg = `${startDeco}\n\n${label}: *${pageTitle}*\n\n📥 *روابط التحميل:*\n`;
      links.slice(0, 12).forEach((l, i) => {
        msg += `\n${i + 1}. *${l.text}*\n🔗 ${l.url}\n`;
      });
      msg += `\n${endDeco}`;

      if (poster) {
        try {
          await conn.sendMessage(m.chat, { image: { url: poster }, caption: msg }, { quoted: fkontak });
        } catch (_) {
          await conn.reply(m.chat, msg, fkontak);
        }
      } else {
        await conn.reply(m.chat, msg, fkontak);
      }

      return await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    }

    // Otherwise: search
    const results = await searchEgyDead(text);

    if (!results.length) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
      return conn.reply(
        m.chat,
        `${startDeco}\n\n❌ لم يتم العثور على نتائج لـ: *${text}*\n\nجرّب كلمة مختلفة أو أرسل رابط الصفحة مباشرة.\n\n${endDeco}`,
        fkontak,
      );
    }

    if (results.length === 1) {
      // Only one result — go straight to download links
      const { pageTitle, poster, links } = await getDownloadLinks(results[0].url);

      if (!links.length) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        return conn.reply(m.chat, `${startDeco}\n\n❌ لم يتم العثور على روابط تحميل.\n\n${endDeco}`, fkontak);
      }

      let msg = `${startDeco}\n\n${label}: *${pageTitle || results[0].title}*\n\n📥 *روابط التحميل:*\n`;
      links.slice(0, 12).forEach((l, i) => {
        msg += `\n${i + 1}. *${l.text}*\n🔗 ${l.url}\n`;
      });
      msg += `\n${endDeco}`;

      if (poster) {
        try {
          await conn.sendMessage(m.chat, { image: { url: poster }, caption: msg }, { quoted: fkontak });
        } catch (_) {
          await conn.reply(m.chat, msg, fkontak);
        }
      } else {
        await conn.reply(m.chat, msg, fkontak);
      }
      return await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    }

    // Multiple results — show list and ask to resend URL
    let msg = `${startDeco}\n\n🔍 نتائج البحث عن: *${text}*\n\nوجدت ${results.length} نتيجة — أرسل الرابط المطلوب:\n\n`;
    results.slice(0, 10).forEach((r, i) => {
      msg += `${i + 1}. *${r.title}*\n🔗 ${r.url}\n\n`;
    });
    msg += `📌 مثال: \`${usedPrefix + command} ${results[0].url}\`\n\n${endDeco}`;

    await conn.reply(m.chat, msg, fkontak);
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (err) {
    console.error('[فليم-مسلسل]', err);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.reply(
      m.chat,
      `${startDeco}\n\n❌ حدث خطأ:\n${err.message}\n\n${endDeco}`,
      fkontak,
    );
  }
};

handler.help = ['فليم <اسم أو رابط>', 'مسلسل <اسم أو رابط>'];
handler.tags = ['تحميلات'];
handler.command = ['فليم', 'فيلم', 'movie', 'مسلسل', 'series'];

export default handler;
