import axios from "axios";
import cheerio from "cheerio";
const { generateWAMessageContent, generateWAMessageFromContent, proto } =
  (await import("@whiskeysockets/baileys")).default;

// الحقوق والستايل الخاص بك
const myCredit = `*_ .𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 _*`;
const emojis = `🌳🌴🍀 Pineapple 🍍🌿🍇 🍉`;

// قائمة الـ 40 برومبت لإينوسكي هاشيبيرا لضمان تنوع الصور وجودتها
const inosukePrompts = [
  "Inosuke Hashibira aesthetic", "Inosuke Beast Breathing wallpaper HD", "Inosuke Hashibira without mask fanart", 
  "Inosuke Hashibira badass moments HD", "Inosuke demon slayer aesthetic blue", "Inosuke vs Doma fanart", 
  "Inosuke dual swords action", "Inosuke Hashibira pfp HD", "Inosuke funny angry moments", 
  "Inosuke and Tanjiro Zenitsu trio", "Inosuke Hashibira realistic art", "Inosuke boar mask close up", 
  "Inosuke Hashibira wallpaper 4k phone", "Inosuke chibi cute aesthetic", "Inosuke emotional moments", 
  "Inosuke Hashibira manga panels", "Inosuke minimalist wallpaper", "Inosuke Hashibira flexible pose aesthetic", 
  "Inosuke blue hair tips aesthetic", "Inosuke in the forest aesthetic", "Inosuke Hashibira watercolor painting", 
  "Inosuke badass entrance", "Inosuke Hashibira drawing cool", "Inosuke dual nichirin blades aesthetic", 
  "Inosuke Hashibira phone wallpaper HD", "Inosuke savage beast fanart", "Inosuke Hashibira icon HD", 
  "Inosuke breathing technique animation style", "Inosuke Hashibira dark mood", "Inosuke final battle fanart", 
  "Inosuke and Kotoha mother memory", "Inosuke Hashibira aesthetic blue background", "Inosuke king of mountains fanart",
  "Inosuke Hashibira shirtless badass art", "Inosuke Hashibira flexing muscles fanart", "Inosuke boar head mask aesthetic",
  "Inosuke Hashibira manga cover style", "Inosuke fighting pose wallpaper", "Inosuke Hashibira fanart cool",
  "Inosuke Hashibira demon slayer wallpaper 4k"
];

/* ========= دالة جهة الاتصال (Quote) الأصيلة ========= */


/* ========= إعدادات Pinterest الأصلية (المحرك المعتمد) ========= */
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
  // اختيار برومبت عشوائي من الـ 40 لإينوسكي
  const randomPrompt = inosukePrompts[Math.floor(Math.random() * inosukePrompts.length)];

  await conn.sendMessage(m.chat, {
    text: `*_جاࢪي جلب صــور إيـنـوسـكـي 🦁 ⚔️_*`
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
        text: `*_ صَـوٰࢪۿ إيـنـوسـكـي ࢪقَــم࣬🍡 ${i++} _*`,
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
            body: { text: `*_تـم جلـب صـور إيـنـوسـكـي بـدقـه HD 🍉_*\n\n${emojis}` },
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

handler.help = ["اينوسكي"];
handler.tags = ["photo"];
handler.command = /^(اينوسكي)$/i;

export default handler;