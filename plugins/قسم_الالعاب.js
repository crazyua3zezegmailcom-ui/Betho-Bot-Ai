// م5.js - قـسـم الألعاب 🌴🌳
// تم التعديل لاستخدام روابط سريعة وإرسال صورة/فيديو مثل الأقسام السابقة

import fetch from 'node-fetch';

// دالة اقتباس جهة الاتصال


// استخراج أسماء الأوامر من handler.command
function extractCommands(plugin, usedPrefix) {
  let cmds = [];
  let cmdDef = plugin.command;
  if (!cmdDef) return cmds;

  const addCmd = (c) => {
    if (typeof c === 'string' && c.trim()) {
      cmds.push(usedPrefix + c.trim());
    }
  };

  if (Array.isArray(cmdDef)) {
    cmdDef.forEach(addCmd);
  } else if (typeof cmdDef === 'string') {
    addCmd(cmdDef);
  } else if (cmdDef instanceof RegExp) {
    let src = cmdDef.source;
    src = src.replace(/^\^/, '').replace(/\$$/, '').replace(/\/[gis]*$/, '');
    let parts = src.split('|');
    let firstPart = parts[0].replace(/[()]/g, '');
    if (firstPart) cmds.push(usedPrefix + firstPart);
  }
  return cmds;
}

let handler = async (m, { conn, usedPrefix }) => {
  // 1. مصفوفة الروابط السريعة (مثل الأقسام السابقة)
  const assets = [
    "https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg",
    "https://i.postimg.cc/gksCzK5n/IMG-20260610-WA0076.jpg",
    "https://i.postimg.cc/Fsx4fvfK/IMG-20260610-WA0075.jpg",
    "https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg",
    "https://i.postimg.cc/02tkNSHj/commands.jpg",
    "https://i.postimg.cc/fbnj1GK0/welcome.jpg",
    "https://i.postimg.cc/wMvKKyVk/remove.jpg",
    "https://i.postimg.cc/P52T7Hh2/install.jpg",
    "https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg",
    ""
  ];

  // 2. اختيار عشوائي
  const selection = assets[Math.floor(Math.random() * assets.length)];
  const isVideo = selection.endsWith('.mp4');

  // 3. جمع أوامر قسم الألعاب (Games)
  let gamesCommands = [];
  if (global.plugins) {
    for (let plugin of Object.values(global.plugins)) {
      if (!plugin) continue;
      let isGameCmd = false;
      if (plugin.tags && Array.isArray(plugin.tags)) {
        if (plugin.tags.includes('game') || plugin.tags.includes('games') || plugin.tags.includes('لعبة') || plugin.tags.includes('العاب')) {
          isGameCmd = true;
        }
      }
      if (isGameCmd) {
        let cmds = extractCommands(plugin, usedPrefix);
        gamesCommands.push(...cmds);
      }
    }
  }
  gamesCommands = [...new Set(gamesCommands)].sort();

  const currentDate = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  const dayName = new Date().toLocaleDateString('ar-EG', { weekday: 'long' });
  const taguser = '@' + m.sender.split('@')[0];

  let menuText = `
╗═══≪ 🌴🎮🌳 ≫═══╔
 .𓏲⋆˙𝑵𝑬𝒁𝑼𝑲𝑶 𝑩𝑶𝑻🎀​
  𝖡𝖸  𝐶𝑟𝑎𝑧𝑦 dev 👑 
╝═══≪ 🌴🎮🌳 ≫═══╚

╮──────────────╭
𓆩⃞🎮𓆪  𝗐𝖾𝗅𝖼𝗈𝗆𝖾 ${taguser}
𓆩⃞🕹️𓆪  قـسـم الألعاب 🌴🌳
╯──────────────╰

╮───≪ 🎮 الأوامر المتاحة≫───╭`.trim();

  if (gamesCommands.length === 0) {
    menuText += `\n│ ⌬ لا توجد أوامر ألعاب حالياً`;
  } else {
    for (let cmd of gamesCommands) {
      menuText += `\n│ ⌬ ${cmd}`;
    }
  }

  menuText += `
ََ
╯───≪ 🌴🎮🌳 ≫───╰

𓆩⃞🎮𓆪 𝗕𝗬 𝐶𝑟𝑎𝑧𝑦 🕹️
؍ 🌸♡゙ تاريـخ: ${currentDate}
؍ 🌸♡゙ اليـوم: ${dayName}
`.trim();

  // 4. تجهيز التوجيه (forwardingScore = 1)
  const contextInfo = {
    mentionedJid: [m.sender],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363428186936884@newsletter',
      newsletterName: '.𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 CH 👑',
      serverMessageId: -1
    }
  };

  // 5. إرسال الوسائط مع النص
  if (isVideo) {
    await conn.sendMessage(m.chat, {
      video: { url: selection },
      caption: menuText,
      gifPlayback: true,
      contextInfo
    }, {});
  } else {
    await conn.sendMessage(m.chat, {
      image: { url: selection },
      caption: menuText,
      contextInfo
    }, {});
  }
};

handler.command = /^(م5)$/i;
handler.help = ['م5'];
handler.tags = ['menu'];

export default handler;