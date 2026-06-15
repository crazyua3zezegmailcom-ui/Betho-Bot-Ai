import axios from "axios";
import cheerio from "cheerio";
const { generateWAMessageContent, generateWAMessageFromContent, proto } =
  (await import("@whiskeysockets/baileys")).default;

// الحقوق والستايل الخاص بك
const myCredit = `*_ .𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 _*`;
const emojis = `🌳🌴🍀 Pineapple 🍍🌿🍇 🍉`;

// قائمة الـ 40 برومبت لساسكي أوتشيها لعرض نتائج HD ومتنوعة
const sasukePrompts = [
  "Sasuke Uchiha aesthetic", "Sasuke Shippuden wallpaper HD", "Sasuke Uchiha Rinnegan Sharingan", 
  "Sasuke Chidori action fanart", "Sasuke Uchiha Curse Mark form", "Sasuke dark aesthetic anime", 
  "Sasuke vs Naruto iconic moments", "Sasuke Kirin jutsu aesthetic", "Sasuke smiling rare cute", 
  "Sasuke Uchiha pfp HD", "Sasuke Taka outfit Akatsuki", "Sasuke Uchiha Susanoo perfect form", 
  "Kid Sasuke Uchiha Genin", "Sasuke and Itachi brothers fate", "Sasuke Uchiha realistic art", 
  "Sasuke Eternal Mangekyou Sharingan activation", "Sasuke sitting cool pose", "Sasuke Uchiha manga panels", 
  "Sasuke wallpaper 4k phone", "Adult Sasuke Boruto era wanderer", "Sasuke Uchiha chibi cute", 
  "Sasuke emotional sad moments", "Sasuke and Sakura romantic aesthetic", "Sasuke Amaterasu black flames action", 
  "Sasuke Uchiha aesthetic blue", "Sasuke eyes close up Sharingan Rinnegan", "Sasuke in the rain lone wolf", 
  "Sasuke Uchiha watercolor painting art", "Sasuke minimal wallpaper", "Sasuke training Orochimaru lair", 
  "Sasuke Uchiha badass entrance", "Sasuke lightning aura glowing", "Sasuke legendary Uchiha shinobi art", 
  "Sasuke perfect Susanoo full body", "Sasuke Uchiha sketching drawing", "Sasuke Hebi outfit with sword", 
  "Sasuke The Last movie design", "Sasuke and Team 7 Naruto Sakura", "Sasuke Uchiha fanart cool badass",
  "Sasuke Uchiha Indra Otsutsuki reincarnation wallpaper"
];

/* ========= دالة جهة الاتصال (Quote) الأصيلة ========= */


/* ========= إعدادات Pinterest الأصلية (المحرك الشغال) ========= */
const base = "https://www.pinterest.com";
const search = "/resource/BaseSearchResource/get/";

const headers = {
  accept: "application/json, text/javascript, */*, q=0.01",
  referer: "https://www.pinterest.com/",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "x-app-version": "a9522f",
  "x-pinterest-appstate": "active",
  "x-pinterest-pws-handler": "www/[username]/[slug].js",
  "x-requested-with": "XMLHttpRequest",
};

async function getCookies() {
  try {
    const response = await axios.get(base);
    const setHeaders = response.headers["set-cookie"];
    return setHeaders ? setHeaders.map(v => v.split(";")[0]).join("; ") : null;
  } catch { return null; }
}

async function searchPinterest(query) {
  try {
    const cookies = await getCookies();
    if (!cookies) return { status: false, message: "فشل جلب الكوكيز." };

    const params = {
      source_url: `/search/pins/?q=${query}`,
      data: JSON.stringify({
        options: { isPrefetch: false, query, scope: "pins", bookmarks: [""], page_size: 10 },
        context: {},
      }),
      _: Date.now(),
    };

    const { data } = await axios.get(`${base}${search}`, {
      headers: { ...headers, cookie: cookies },
      params,
    });

    const results = data.resource_response.data.results.filter(v => v.images?.orig);
    if (!results.length) return { status: false, message: "لم يتم العثور على نتائج." };

    return {
      status: true,
      pins: results.map(v => ({ id: v.id, image: v.images.orig.url })),
    };
  } catch { return { status: false, message: "حدث خطأ." }; }
}

/* ========= الأمر الرئيسي ========= */
let handler = async (m, { conn }) => {
  // اختيار برومبت عشوائي من الـ 40 لساسكي
  const randomPrompt = sasukePrompts[Math.floor(Math.random() * sasukePrompts.length)];

  await conn.sendMessage(m.chat, {
    text: `*_جاࢪي جلب صــور سـاسـكـي ⚡💜_*`
  }, {});

  async function createImage(url) {
    const { imageMessage } = await generateWAMessageContent(
      { image: { url } },
      { upload: conn.waUploadToServer }
    );
    return imageMessage;
  }

  let result = await searchPinterest(randomPrompt);
  if (!result.status)
    return m.reply(`*_ هـلا ❌ ${result.message || 'فـشـل الـجـلـب'} _*`);

  let pins = result.pins.slice(0, 10);
  let cards = [];
  let i = 1;

  for (let pin of pins) {
    cards.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: `*_ صَـوٰࢪۿ سـاسـكـي ࢪقَــم࣬🍡 ${i++} _*`,
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: myCredit,
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        hasMediaAttachment: true,
        imageMessage: await createImage(pin.image),
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: [
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: ".𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 👑",
              url: "https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e"
            }),
          },
        ],
      }),
    });
  }

  const bot = generateWAMessageFromContent(
    m.chat,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: { text: `*_ تـم جلـب صـور سـاسـكـي بـدقـه HD ⚡ _*\n\n${emojis}` },
            footer: { text: myCredit },
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
              cards,
            }),
          }),
        },
      },
    },
    {}
  );

  await conn.relayMessage(m.chat, bot.message, { messageId: bot.key.id });
};

handler.help = ["ساسكي"];
handler.tags = ["photo"];
handler.command = /^(ساسكي)$/i;

export default handler;