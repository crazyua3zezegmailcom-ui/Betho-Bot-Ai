import fetch from 'node-fetch';



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
  const assets = [
    "https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg",
    "https://i.postimg.cc/gksCzK5n/IMG-20260610-WA0076.jpg",
    "https://i.postimg.cc/Fsx4fvfK/IMG-20260610-WA0075.jpg",
    "https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg"
  ];

  const selection = assets[Math.floor(Math.random() * assets.length)];

  let adminCommands = [];
  if (global.plugins) {
    for (let plugin of Object.values(global.plugins)) {
      if (!plugin) continue;
      let isAdminCmd = false;
      if (plugin.tags && Array.isArray(plugin.tags) && plugin.tags.includes('admin')) isAdminCmd = true;
      if (plugin.admin === true) isAdminCmd = true;
      if (plugin.group && plugin.admin === true) isAdminCmd = true;
      if (isAdminCmd) {
        let cmds = extractCommands(plugin, usedPrefix);
        adminCommands.push(...cmds);
      }
    }
  }
  adminCommands = [...new Set(adminCommands)].sort();

  const currentDate = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  const dayName = new Date().toLocaleDateString('ar-EG', { weekday: 'long' });
  const taguser = '@' + m.sender.split('@')[0];

  let menuText = `
╗═══≪ ⚙️🧩⚙️ ≫═══╔
     𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢
    𝐵𝑦 𝐶𝑟𝑎𝑧𝑦 👑 
╝═══≪ ⚙️🧩⚙️ ≫═══╚

╮──────────────╭
𓆩⃞⚙️𓆪  𝗐𝖾𝗅𝖼𝗈𝗆𝖾 ${taguser}
𓆩⃞🧩𓆪  قسـم الإدارة (ADMIN) 👑
╯──────────────╰

╮───≪ ⚙️ الأوامر المتاحة≫───╭`.trim();

  if (adminCommands.length === 0) {
    menuText += `\n│ ⌬ لا توجد أوامر إدارة حالياً`;
  } else {
    for (let cmd of adminCommands) {
      menuText += `\n│ ⌬ ${cmd}`;
    }
  }

  menuText += `
َ
╯───≪ ⚙️🧩⚙️ ≫───╰

𓆩⃞⚙️𓆪 𝐵𝑦 𝐶𝑟𝑎𝑧𝑦 ⚙️
؍ 🌸♡゙ تاريـخ: ${currentDate}
؍ 🌸♡゙ اليـوم: ${dayName}
`.trim();

  const contextInfo = {
    mentionedJid: [m.sender],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363428186936884@newsletter',
      newsletterName: '𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢  👑',
      serverMessageId: -1
    }
  };

  await conn.sendMessage(m.chat, {
    image: { url: selection },
    caption: menuText,
    contextInfo
  }, {});
};

handler.command = /^(م1)$/i;
handler.help = ['م1'];
handler.tags = ['main'];

export default handler;
