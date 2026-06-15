import axios from "axios";
import cheerio from "cheerio";
const { generateWAMessageContent, generateWAMessageFromContent, proto } =
  (await import("@whiskeysockets/baileys")).default;

// الحقوق والستايل الخاص بك
const myCredit = `*_ .𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 _*`;
const emojis = `🌳🌴🍀 Pineapple 🍍🌿🍇 🍉`;

// قائمة الـ 40 برومبت لميكاسا أكرمان لضمان تنوع الصور وجودتها
const mikasaPrompts = [
  "Mikasa Ackerman aesthetic", "Mikasa Ackerman wallpaper HD", "Mikasa Ackerman final season aesthetic", 
  "Mikasa Ackerman badass moments HD", "Mikasa Ackerman red scarf aesthetic", "Mikasa vs Titans fanart", 
  "Mikasa Ackerman pfp HD", "Mikasa Ackerman icon aesthetic", "Mikasa Ackerman and Eren Yeager", 
  "Mikasa Ackerman chibi cute", "Mikasa Ackerman manga panels", "Mikasa Ackerman minimalist wallpaper", 
  "Mikasa Ackerman realistic art", "Mikasa Ackerman sword action HD", "Mikasa Ackerman sad moments aesthetic", 
  "Mikasa Ackerman watercolor painting", "Mikasa Ackerman aesthetic dark", "Mikasa Ackerman smiling rare", 
  "Mikasa Ackerman 4k phone wallpaper", "Mikasa Ackerman manga coloring", "Mikasa Ackerman badass entrance", 
  "Mikasa Ackerman short hair aesthetic", "Mikasa Ackerman long hair aesthetic", "Mikasa Ackerman Ackerman blood awakening", 
  "Mikasa Ackerman glowing eyes", "Mikasa Ackerman legendary soldier art", "Mikasa Ackerman survey corps uniform", 
  "Mikasa Ackerman fight pose wallpaper", "Mikasa Ackerman aesthetic background", "Mikasa Ackerman blue aesthetic wallpaper", 
  "Mikasa Ackerman anime moments HD", "Mikasa Ackerman fanart cool badass", "Mikasa Ackerman adult version AOT", 
  "Mikasa Ackerman child version cute", "Mikasa Ackerman silhouette moon", "Mikasa Ackerman thunder spears action", 
  "Mikasa Ackerman queen of the battlefield", "Mikasa Ackerman beautiful anime girl HD", "Mikasa Ackerman attack on titan season 4",
  "Mikasa Ackerman aesthetic red and black"
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
  // اختيار برومبت عشوائي من الـ 40 لميكاسا
  const randomPrompt = mikasaPrompts[Math.floor(Math.random() * mikasaPrompts.length)];

  await conn.sendMessage(m.chat, {
    text: `*_جاࢪي جلب صــور مـيـكـاسـا 🧣⚔️_*`
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
        text: `*_ صَـوٰࢪۿ مـيـكـاسـا ࢪقَــم࣬🍡 ${i++} _*`,
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
            body: { text: `*_ تـم جلـب صـور مـيـكـاسـا بـدقـه HD 🧣 _*\n\n${emojis}` },
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

handler.help = ["ميكاسا"];
handler.tags = ["photo"];
handler.command = /^(ميكاسا|mikasa)$/i;

export default handler;