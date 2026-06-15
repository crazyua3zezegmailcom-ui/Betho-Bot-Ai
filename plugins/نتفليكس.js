import fetch from 'node-fetch';

const myCredit = `*_ .𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 _*`;
const startDeco = `☽⚝ͫ͢❏ِꏍ🍡﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ ﷽⎆☽⚝ͫ͢❏ِ🍡ꏍﭕ﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ\n╮ ⊰✫⊱─⊰✫⊱─⊰✫⊱╭`;
const endDeco = `┘⊰✫⊱─⊰✫⊱─⊰✫⊱└\n☽⚝ͫ͢❏ِꏍ🍡﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ ﷽⎆☽⚝ͫ͢❏ِꏍﭕ🍡﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ`;

const CATEGORY_LABELS = {
  ENGLISH_MOVIES: '🎬 أفلام',
  ENGLISH_TV: '📺 مسلسلات',
  NON_ENGLISH_MOVIES: '🎬 أفلام غير إنجليزية',
  NON_ENGLISH_TV: '📺 مسلسلات غير إنجليزية',
};



async function fetchNetflixTop10() {
  const res = await fetch('https://www.netflix.com/tudum/top10', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'ar,en;q=0.9',
    },
    timeout: 15000,
  });

  const html = await res.text();
  const match = html.match(/netflix\.reactContext\.models\.graphql = JSON\.parse\('([\s\S]*?)'\);/);
  if (!match) throw new Error('لم يتم العثور على بيانات Netflix');

  const raw = match[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
  const json = JSON.parse(raw);
  const data = json.data;

  const resolve = (ref) => (ref?.__ref ? data[ref.__ref] : ref);

  const top10Items = Object.values(data)
    .filter((v) => v?.__typename === 'PulseTop10ItemEntity')
    .map((item) => {
      const videoRef = resolve(item.top10Video);
      const category = item.top10?.category || 'ENGLISH_MOVIES';
      const imageKey = Object.keys(item.artwork?.sdpArt || {}).find((k) => k.startsWith('urlsSized'));
      const image = item.artwork?.sdpArt?.[imageKey]?.[0]?.url || null;

      return {
        rank: item.top10?.weeklyRank ?? 99,
        category,
        categoryLabel: CATEGORY_LABELS[category] || category,
        videoId: item.top10?.videoId,
        title: videoRef?.title || item.guid || 'بدون عنوان',
        weeklyHours: item.top10?.weeklyHoursViewed || 0,
        url: `https://www.netflix.com/title/${item.top10?.videoId}`,
        image,
      };
    })
    .sort((a, b) => {
      const catOrder = Object.keys(CATEGORY_LABELS);
      const catDiff = catOrder.indexOf(a.category) - catOrder.indexOf(b.category);
      return catDiff !== 0 ? catDiff : a.rank - b.rank;
    });

  // deduplicate by videoId (same movie appears once per category per week)
  const seen = new Set();
  return top10Items.filter((item) => {
    const key = `${item.category}-${item.videoId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const handler = async (m, { conn, usedPrefix, command, text }) => {

  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

  try {
    const items = await fetchNetflixTop10();

    // Group by category
    const grouped = {};
    for (const item of items) {
      if (!grouped[item.categoryLabel]) grouped[item.categoryLabel] = [];
      grouped[item.categoryLabel].push(item);
    }

    let msg = `${startDeco}\n\n🍿 *أكثر المحتويات مشاهدةً على Netflix هذا الأسبوع*\n\n`;

    for (const [catLabel, catItems] of Object.entries(grouped)) {
      msg += `━━━━━━ ${catLabel} ━━━━━━\n`;
      for (const item of catItems.slice(0, 10)) {
        const hours = item.weeklyHours >= 1_000_000
          ? `${(item.weeklyHours / 1_000_000).toFixed(1)}م`
          : `${(item.weeklyHours / 1000).toFixed(0)}ك`;
        msg += `${item.rank}. *${item.title}*\n`;
        msg += `   ⏱ ${hours} ساعة مشاهدة | 🔗 ${item.url}\n\n`;
      }
    }

    msg += endDeco;

    // Try to send with poster of #1 movie if available
    const topMovie = items.find((i) => i.rank === 1);
    if (topMovie?.image) {
      try {
        await conn.sendMessage(m.chat, {
          image: { url: topMovie.image },
          caption: msg,
        }, {});
      } catch (_) {
        await conn.reply(m.chat, msg);
      }
    } else {
      await conn.reply(m.chat, msg);
    }

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (err) {
    console.error('[نتفليكس]', err);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.reply(m.chat, `${startDeco}\n\n❌ حدث خطأ أثناء جلب بيانات Netflix:\n${err.message}\n\n${endDeco}`);
  }
};

handler.help = ['نتفليكس'];
handler.tags = ['تحميلات'];
handler.command = ['نتفليكس', 'netflix'];

export default handler;
