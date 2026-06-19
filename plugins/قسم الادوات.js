// م7.js - قـسـم الأدوات 🛠️
// تم التعديل لاستهداف الـ tags الخاصة بالـ tools بنفس نمط الأقسام السابقة

import fetch from 'node-fetch';

// دالة اقتباس جهة الاتصال
function contactQuote(m) {
  return {
    key: {
      participants: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: '⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥_MENU_TOOLS'
    },
    message: {
      contactMessage: {
        displayName: m.pushName || 'User',
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${m.pushName || 'User'};;;;\nFN:${m.pushName || 'User'}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:📞 WhatsApp\nORG:⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 BOT ✓\nTITLE:Verified\nEND:VCARD`
      }
    },
    participant: '0@s.whatsapp.net'
  };
}

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
  // 1. مصفوفة الروابط السريعة للصور والفيديو العشوائي ل⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥
  const assets = [
    "https://i.postimg.cc/gksCzK5n/IMG-20260610-WA0076.jpg",
    "https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg",
    "https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg",
    "https://i.postimg.cc/Fsx4fvfK/IMG-20260610-WA0075.jpg",
    "https://i.postimg.cc/gksCzK5n/IMG-20260610-WA0076.jpg",
    "https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg",
    "https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg",
    "https://i.postimg.cc/Fsx4fvfK/IMG-20260610-WA0075.jpg",
    "https://i.postimg.cc/gksCzK5n/IMG-20260610-WA0076.jpg",
    "https://raw.githubusercontent.com/mzml-gg/⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥-photos/main/⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥-video.mp4"
  ];

  // 2. اختيار عشوائي للأسيتس
  const selection = assets[Math.floor(Math.random() * assets.length)];
  const isVideo = selection.endsWith('.mp4');

  // 3. فحص وجمع أوامر قسم الأدوات (Tools)
  let toolsCommands = [];
  if (global.plugins) {
    for (let plugin of Object.values(global.plugins)) {
      if (!plugin) continue;
      let isToolsCmd = false;
      if (plugin.tags && Array.isArray(plugin.tags)) {
        // استهداف التاجز المطلوب للقسم الجديد
        if (plugin.tags.includes('tools') || plugin.tags.includes('أدوات') || plugin.tags.includes('tool')) {
          isToolsCmd = true;
        }
      }
      if (isToolsCmd) {
        let cmds = extractCommands(plugin, usedPrefix);
        toolsCommands.push(...cmds);
      }
    }
  }
  toolsCommands = [...new Set(toolsCommands)].sort();

  const currentDate = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  const dayName = new Date().toLocaleDateString('ar-EG', { weekday: 'long' });
  const taguser = '@' + m.sender.split('@')[0];

  // بناء كابشن القائمة بلمسة ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 الفخمة لقسم الأدوات
  let menuText = `
╗═══≪🌿🌹🍁 ≫═══╔
 .𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 𝑩𝑶𝑻🎀​
  𝖡𝖸  𝐶𝑟𝑎𝑧𝑦 Ж 𝐶𝑟𝑎𝑧𝑦 𝒅𝒆𝒗𝒔 👑 
╝═══≪ 🌿🌹🍁 ≫═══╚

╮──────────────╭
𓆩⃞🛠️𓆪  𝗐𝖾 locker𝗈𝗆𝖾 ${taguser}
𓆩⃞⚙️𓆪  قـسـم الأدوات 🛠️
╯──────────────╰

╮───≪🌴الأوامر المتاحة≫───╭`.trim();

  if (toolsCommands.length === 0) {
    menuText += `\n│ ⌬ لا توجد أوامر أدوات حالياً`;
  } else {
    for (let cmd of toolsCommands) {
      menuText += `\n│ ⌬ ${cmd}`;
    }
  }

  menuText += `
َ
╯───≪ 🍀🍇🍍 ≫───╰

𓆩⃞👑 𓆪 𝗕𝗬 𝐶𝑟𝑎𝑧𝑦 Ｘ 𝐶𝑟𝑎𝑧𝑦 👑 
؍ 🌸♡゙ تاريـخ: ${currentDate}
؍ 🌸♡゙ اليـوم: ${dayName}
`.trim();

  // 4. تجهيز التوجيه والنيوزليتر (forwardingScore = 1)
  const contextInfo = {
    mentionedJid: [m.sender],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363428186936884@newsletter',
      newsletterName: '.𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻 ＣＨ 👑',
      serverMessageId: -1
    }
  };

  // 5. إرسال الميديا العشوائية بناءً على نوع الملف مع نص المنيو وعرض الـ Quote
  if (isVideo) {
    await conn.sendMessage(m.chat, {
      video: { url: selection },
      caption: menuText,
      gifPlayback: true,
      contextInfo
    }, { quoted: contactQuote(m) });
  } else {
    await conn.sendMessage(m.chat, {
      image: { url: selection },
      caption: menuText,
      contextInfo
    }, { quoted: contactQuote(m) });
  }
};

handler.command = /^(م7)$/i;
handler.help = ['م7'];
handler.tags = ['menu'];

export default handler;