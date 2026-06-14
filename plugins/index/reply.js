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

export default async function before(m, { conn }) {
  const devNumber = "584261208048";

  const triggers = {
    "السلام عليكم": ["*وعليكم السلام ورحمة الله وبركاته*", "*❤️ وعليكم السلام منور يغالي *"],
    "تست": ["*_هاي عمو ☺️_*", "*_أمرني أمر 🌚_*"],
    "هلا": ["*_هلا_*", "*_هلا بيك_*", "*_يا هلا_*"],
    "بنت": ["*_مظه🧕_*"],
    "كريزي": ["*_🔥انتباه_* ‼️‼️‼️ تم اكتشاف اسم مطوري 🤗 رحبو به ي ساده"],
    "صباح الخير": ["*صباح النور*", "*صباح الورد*", "*صباح الفل*"],
    "مساء الخير": ["*مساء النور*", "*مساء الورد*", "*مساء الفل*", "*مساء الجوري*"],
    "مساء النور": ["*مساء الورد*", "*مساء الفل*", "*الله نورك*"]
  };

  const devTriggers = {
    "بيثو": ["*_معاك ي قلبي 🌝_*", "*_أمرني ي مسكر💕_*"]
  };

  const senderNumber = m.sender?.replace(/@s\.whatsapp\.net.*/, "");

  if (senderNumber === devNumber) {
    const devReplies = findBestMatch(m.text, devTriggers, 0.75);
    if (devReplies) {
      const ranReply = devReplies[Math.floor(Math.random() * devReplies.length)];
      await m.reply(ranReply);
      return false;
    }
  }

  const replies = findBestMatch(m.text, triggers, 0.75);
  if (replies) {
    const ranReply = replies[Math.floor(Math.random() * replies.length)];
    m.reply(ranReply);
  }

  return false;
}
