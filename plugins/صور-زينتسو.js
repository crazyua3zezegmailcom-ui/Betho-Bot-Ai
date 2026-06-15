import axios from "axios";
import cheerio from "cheerio";
const { generateWAMessageContent, generateWAMessageFromContent, proto } =
  (await import("@whiskeysockets/baileys")).default;

// الحقوق والستايل الخاص بك
const myCredit = `*_ .𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 _*`;
const emojis = `🌳🌴🍀 Pineapple 🍍🌿🍇 🍉`;

// قائمة الـ 40 برومبت لزينتسو أغاتسوما لضمان تنوع الصور وجودتها
const zenitsuPrompts = [
  "Zenitsu Agatsuma aesthetic", "Zenitsu Thunder Breathing wallpaper HD", "Zenitsu Godspeed wallpaper", 
  "Zenitsu Agatsuma sleeping badass fanart", "Zenitsu demon slayer aesthetic pink", "Zenitsu badass moments HD", 
  "Zenitsu vs Kaigaku fanart", "Zenitsu lightning effect aesthetic", "Zenitsu funny crying faces", 
  "Zenitsu Agatsuma pfp HD", "Zenitsu and Betho cute aesthetic", "Zenitsu Agatsuma Susanoo fanart", 
  "Zenitsu first form thunder and flash", "Zenitsu Agatsuma realistic art", "Zenitsu sword close up", 
  "Zenitsu Agatsuma wallpaper 4k phone", "Zenitsu chibi cute aesthetic", "Zenitsu emotional moments", 
  "Zenitsu Agatsuma manga panels", "Zenitsu minimalist wallpaper", "Zenitsu golden hair aesthetic", 
  "Zenitsu Agatsuma yellow aesthetic", "Zenitsu in the rain aesthetic", "Zenitsu Agatsuma watercolor painting", 
  "Zenitsu and Tanjiro Inosuke trio", "Zenitsu Agatsuma badass entrance", "Zenitsu glowing lightning aura", 
  "Zenitsu Agatsuma drawing cool", "Zenitsu sword stance aesthetic", "Zenitsu Agatsuma phone wallpaper HD", 
  "Zenitsu lightning god fanart", "Zenitsu Agatsuma icon HD", "Zenitsu sparrow Chuntaro cute", 
  "Zenitsu breathing technique animation style", "Zenitsu Agatsuma dark mood", "Zenitsu final battle fanart", 
  "Zenitsu and Betho romantic moments", "Zenitsu Agatsuma fanart badass cool", "Zenitsu Agatsuma aesthetic yellow background",
  "Zenitsu god of thunder fanart"
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
  // اختيار برومبت عشوائي من الـ 40 لزينتسو
  const randomPrompt = zenitsuPrompts[Math.floor(Math.random() * zenitsuPrompts.length)];

  await conn.sendMessage(m.chat, {
    text: `*_جاࢪي جلب صــور زيـنـتـسـو ⚡🧀_*`
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
        text: `*_ صَـوٰࢪۿ زيـنـتـسـو ࢪقَــم࣬🍡 ${i++} _*`,
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
            body: { text: `*_ تـم جلـب صـور زيـنـتـسـو بـدقـه HD ⚡ _*\n\n${emojis}` },
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

handler.help = ["زينتسو"];
handler.tags = ["photo"];
handler.command = /^(زينتسو)$/i;

export default handler;