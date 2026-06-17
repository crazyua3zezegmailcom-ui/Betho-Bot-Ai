import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';

const execAsync = promisify(exec);

// ===== تحويل أي صوت إلى OGG Opus حقيقي =====
async function convertToOggOpus(inputBuffer) {
  const tmpIn  = path.join(tmpdir(), `voice_in_${Date.now()}.mp3`);
  const tmpOut = path.join(tmpdir(), `voice_out_${Date.now()}.ogg`);
  try {
    fs.writeFileSync(tmpIn, inputBuffer);
    await execAsync(
      `ffmpeg -y -i "${tmpIn}" -c:a libopus -b:a 64k -ar 48000 -ac 1 "${tmpOut}"`
    );
    return fs.readFileSync(tmpOut);
  } finally {
    if (fs.existsSync(tmpIn))  fs.unlinkSync(tmpIn);
    if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
  }
}

// ===== دالة حساب المسافة بين كلمتين (Levenshtein Distance) =====
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

// ===== دالة البحث عن أقرب trigger =====
function findBestMatch(text, triggers, threshold = 0.75) {
  if (!text) return null;
  const input = text.trim().toLowerCase();

  if (triggers[input]) return triggers[input];
  if (triggers[text.trim()]) return triggers[text.trim()];

  let bestKey = null;
  let bestScore = 0;

  for (const key of Object.keys(triggers)) {
    const normalizedKey = key.trim().toLowerCase();
    const maxLen = Math.max(input.length, normalizedKey.length);
    if (maxLen === 0) continue;

    const dist = levenshtein(input, normalizedKey);
    const score = 1 - dist / maxLen;

    if (score > bestScore && score >= threshold) {
      bestScore = score;
      bestKey = key;
    }
  }

  return bestKey ? triggers[bestKey] : null;
}

// ===== دالة اختيار عشوائي =====
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ===== تحويل رابط voca.ro للرابط المباشر =====
function resolveVocarooUrl(url) {
  const match = url.match(/voca\.ro\/([A-Za-z0-9]+)/);
  if (match) return `https://media1.vocaroo.com/mp3/${match[1]}`;
  return url;
}

// ===== دالة إرسال رسالة صوتية =====
async function sendVoice(m, conn, url) {
  try {
    const directUrl = resolveVocarooUrl(url);
    const res = await fetch(directUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://vocaroo.com/'
      }
    });
    if (!res.ok) throw new Error(`فشل تحميل الصوت: ${res.status}`);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('audio') && !contentType.includes('octet-stream')) {
      throw new Error(`الرابط لم يرجع صوت، نوع المحتوى: ${contentType}`);
    }
    const inputBuffer = Buffer.from(await res.arrayBuffer());
    const oggBuffer = await convertToOggOpus(inputBuffer);
    await conn.sendMessage(
      m.key.remoteJid,
      {
        audio: oggBuffer,
        mimetype: "audio/ogg; codecs=opus",
        ptt: true,
      },
      { quoted: m }
    );
  } catch (e) {
    console.error("❌ خطأ في إرسال الصوت:", e.message);
  }
}

// ===== أرقام المطورين =====
const devNumbers = ["584261208048"];

// ===== Triggers النصية العادية =====
const textTriggers = {
  "السلام عليكم": ["*وعليكم السلام ورحمة الله وبركاته*", "*❤️ وعليكم السلام منور يغالي *"],
  "هلا": ["*_هلا_*", "*_هلا بيك_*", "*_يا هلا_*"],
  "بنت": ["*_مظه🧕_*"],
  "صباح الخير": ["*صباح النور*", "*صباح الورد*", "*صباح الفل*"],
  "مساء الخير": ["*مساء النور*", "*مساء الورد*", "*مساء الفل*", "*مساء الجوري*"],
  "مساء النور": ["*مساء الورد*", "*مساء الفل*", "*الله نورك*"],
};

// ===== Triggers النصية للمطور =====
const devTextTriggers = {
  "جوجو": ["*_معاك ي قلبي 🌝_*", "*_أمرني ي مسكر💕_*"],
  "كريزي": ["*_🔥انتباه_* ‼️‼️‼️ تم اكتشاف اسم مطوري 🤗 رحبو به ي ساده"],
};

// ===== Triggers الاحتواء النصية (للكل) =====
const containTextTriggers = [
  {
    keywords: ["احا"],
    replies: ["*_بس كخ_*", "*_اشحلها... متشتمش ياض_*"],
  },
];

// ===== Triggers الاحتواء النصية للمطور =====
const devContainTextTriggers = [
  {
    keywords: ["بيثو"],
    replies: [
      "*_أمرني ي باشا تشرب كاس ولا اجيب رقاصه علي طول 🤓_*",
      "*_يلا بينا انا مبلبع ڤيجرا وسخن 🫦_*",
    ],
  },
];

// ===== Triggers الاحتواء النصية لغير المطور =====
const normalContainTextTriggers = [
  {
    keywords: ["بيثو"],
    replies: [
      "*_انا بيثو الجن بشرب استنج بفتح مطاوي واقفل قهاوي هتيجي علي السكه هاخدك في الدقه 🫦_*",
      "*_يعم ارحم بق هو انا خلفتك ونسيتك دا انتا زنان يجدع 😒_*",
    ],
  },
];

// ===== Triggers الصوتية (بحث بالاحتواء داخل الجملة) =====
const voiceTriggers = [
  {
    keywords: [
      "بموت", "بموتتت", "بموتتتت",
      "😂😂", "😂😂😂", "😂😂😂😂", "😂😂😂😂😂",
      "بموتتت 😂😂😂", "بموت 😂😂😂",
      "بموتتتت 😂😂😂😂", "بموتتت 😂😂😂😂😂",
    ],
    urls: ["https://voca.ro/1kCpUDwAziNR"],
  },
  {
    keywords: [
      "اي الجمال دا", "اي الجمال",
      "موتتت", "حلو", "جامده",
      "في الطرش منه", "حلوه", "حلوه اوي", "جامده اوي", "جامد",
    ],
    urls: ["https://voca.ro/1ky0q6I4qK4a"],
  },
  {
    keywords: [
      "اي قله الادب دي", "قله الادب", "قلة الادب",
      "ي قليل الادب", "ياقليل الادب", "يا قليل الادب", "قليل الادب",
      "مش محترم", "مشمحترم", "مش متربي", "مشمتربي",
      "سافل", "ي سافل", "يسافل", "ياسافل", "يا سافل",
    ],
    urls: ["https://voca.ro/1njNBmUDPnKP"],
  },
  {
    keywords: [
      "بضاني", "يبضاني", "انت فرقعتهم",
      "ي بضان", "ي بيض", "يبضان", "يبيض", "ي بضين", "يبضين",
    ],
    urls: ["https://voca.ro/17KVA5jVERxa", "https://voca.ro/1lzOBL8DE0bU"],
  },
  {
    keywords: ["الو", "ألو"],
    urls: ["https://voca.ro/14KjvKvs1Jba", "https://voca.ro/1f7lc74M5b66"],
  },
  {
    keywords: ["برافو", "عاش عليك", "كمل", "استمر", "جدع"],
    urls: ["https://voca.ro/11V2Exm84WJS"],
  },
  {
    keywords: ["كريزي"],
    urls: ["https://voca.ro/14M3F0XqwKsK"],
  },
  {
    keywords: ["اتسرق", "سرقتيه", "سرقته", "يلهوي", "ي لهوي"],
    urls: ["https://voca.ro/14KzKrJ2adUg"],
  },
  {
    keywords: [
      "صوت", "صوتك", "سمعني", "اطربني", "اتحفني",
      "اطرشني", "عايزك تغني", "غني", "قول", "خروف", "معزه",
    ],
    urls: ["https://voca.ro/13qR6ZbFgpP3"],
  },
  {
    keywords: [
      "هقر", "هكر", "ليك في المجال",
      "انا بطير أرقام", "بطير ارقام",
      "بحظر أرقام", "بحظر ارقام",
      "بسحب داتا", "سحب داتا",
      "تشريد", "مجال يسطا", "انا بشرد",
      "ليا في التطير", "ليا في التشريد", "ليا في السحب",
    ],
    urls: ["https://voca.ro/1l9joTz8mXvP"],
  },
  {
    keywords: ["حبق", "بحبك", "نن حبك", "انا احبك", "حبك", "حبي"],
    urls: ["https://voca.ro/11TvjrPOhG4F"],
  },
  {
    keywords: [
      "قلبي", "جلبي", "مزه", "مزتي", "روحي", "ي روحي",
      "يقلبي", "يا قلبي", "يحبيبتي", "حبييتي", "ي قلبي",
      "يجلي", "ي جلبي", "يا جلبي",
      "حياتي انتي", "حياتي", "ي حياتي", "يحياتي", "يا حياتي",
    ],
    urls: ["https://voca.ro/1emG5GktC48A"],
  },
  {
    keywords: [
      "انا جيت", "جيت", "مسا مسا",
      "مساء الخير", "صباح الخير", "صباحو",
      "السلام عليكم", "سمو عليكو", "سمووو عليكو",
    ],
    urls: ["https://voca.ro/18GMztcmYQC3"],
  },
  {
    keywords: ["ما تيجي", "تيجي اورهولك", "تعال", "هركبك", "هزعلك", "اورهولك"],
    urls: ["https://voca.ro/19geqRJ1hCCV"],
  },
];

let handler = m => m

handler.before = async function before(m, { conn }) {
  const senderNumber = m.sender?.replace(/@s\.whatsapp\.net.*/, "");
  const text = m.text?.trim() || "";
  const lowerText = text.toLowerCase();
  const isDev = devNumbers.includes(senderNumber);

  if (!text) return false;

  // ===== لو المطور بيتكلم - Levenshtein triggers =====
  if (isDev) {
    const devReplies = findBestMatch(text, devTextTriggers, 0.75);
    if (devReplies) {
      await m.reply(pickRandom(devReplies));
      return false;
    }
  }

  // ===== الردود النصية العادية - Levenshtein =====
  const textReply = findBestMatch(text, textTriggers, 0.75);
  if (textReply) {
    await m.reply(pickRandom(textReply));
    return false;
  }

  // ===== Triggers الاحتواء المشتركة للكل =====
  for (const trigger of containTextTriggers) {
    const matched = trigger.keywords.some((kw) => lowerText.includes(kw.toLowerCase()));
    if (matched) {
      await m.reply(pickRandom(trigger.replies));
      return false;
    }
  }

  // ===== Triggers الاحتواء النصية حسب المطور أو لا =====
  const containPool = isDev ? devContainTextTriggers : normalContainTextTriggers;
  for (const trigger of containPool) {
    const matched = trigger.keywords.some((kw) => lowerText.includes(kw.toLowerCase()));
    if (matched) {
      await m.reply(pickRandom(trigger.replies));
      return false;
    }
  }

  // ===== الردود الصوتية (بالاحتواء) =====
  for (const trigger of voiceTriggers) {
    const matched = trigger.keywords.some((kw) => lowerText.includes(kw.toLowerCase()));
    if (matched) {
      const url = pickRandom(trigger.urls);
      await sendVoice(m, conn, url);
      return false;
    }
  }

  return false;
}

export default handler
