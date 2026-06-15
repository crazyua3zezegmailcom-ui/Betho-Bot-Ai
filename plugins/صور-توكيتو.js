import axios from "axios";
import cheerio from "cheerio";
const { generateWAMessageContent, generateWAMessageFromContent, proto } =
  (await import("@whiskeysockets/baileys")).default;

// الحقوق والستايل الخاص بك
const myCredit = `*_ .𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 _*`;
const emojis = `🌳🌴🍀 Pineapple 🍍🌿🍇 🍉`;

// قائمة الـ 40 برومبت لتوكيتو مويشيرو لضمان تنوع الصور وجودتها
const tokitoPrompts = [
  "Muichiro Tokito aesthetic", "Tokito Muichiro wallpaper HD", "Mist Breathing Tokito aesthetic", 
  "Muichiro Tokito badass moments HD", "Tokito Muichiro demon mark activation", "Muichiro Tokito vs Gyokko fanart", 
  "Tokito Muichiro pfp HD", "Muichiro Tokito icon aesthetic", "Tokito Muichiro with clouds aesthetic", 
  "Muichiro Tokito chibi cute", "Tokito Muichiro manga panels", "Muichiro Tokito minimalist wallpaper", 
  "Tokito Muichiro realistic art", "Muichiro Tokito sword close up", "Tokito Muichiro sad moments aesthetic", 
  "Muichiro Tokito and Yuichiro", "Tokito Muichiro watercolor painting", "Muichiro Tokito aesthetic mint green", 
  "Tokito Muichiro smiling anime", "Muichiro Tokito 7th form obscuring clouds", "Tokito Muichiro drawing cool", 
  "Muichiro Tokito phone wallpaper 4k", "Tokito Muichiro manga coloring", "Muichiro Tokito badass entrance", 
  "Tokito Muichiro glowing mist aura", "Muichiro Tokito legendary swordsman art", "Tokito Muichiro sword stance", 
  "Muichiro Tokito aesthetic blue hair", "Tokito Muichiro dark mood", "Muichiro Tokito and Tanjiro friends", 
  "Tokito Muichiro mist hashira wallpaper", "Muichiro Tokito aesthetic eyes", "Tokito Muichiro demon slayer fanart", 
  "Muichiro Tokito final battle aesthetic", "Tokito Muichiro combat mode", "Muichiro Tokito aesthetic background", 
  "Tokito Muichiro blue aesthetic wallpaper", "Muichiro Tokito anime moments HD", "Tokito Muichiro fanart badass cool",
  "Muichiro Tokito demon slayer wallpaper 4k"
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
  // اختيار برومبت عشوائي من الـ 40 لتوكيتو
  const randomPrompt = tokitoPrompts[Math.floor(Math.random() * tokitoPrompts.length)];

  await conn.sendMessage(m.chat, {
    text: `*_جاࢪي جلب صــور تـوكـيـتـو ☁️⚔️_*`
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
        text: `*_ صَـوٰࢪۿ تـوكـيـتـو ࢪقَــم࣬🍡 ${i++} _*`,
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
            body: { text: `*_ تـم جلـب صـور تـوكـيـتـو بـدقـه HD ☁️ _*\n\n${emojis}` },
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

handler.help = ["توكيتو"];
handler.tags = ["photo"];
handler.command = /^(توكيتو)$/i;

export default handler;