// حہּٰقَــــوٰقَ 𝐶𝑟𝑎𝑧𝑦 💻🔥
import fs from 'fs';

let timeout = 60000;
let poin = 500;

// دالة التوثيق الملكية لبيثو بوت
function contactQuote(m) {
  return {
    key: {
      participants: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'BETHO'
    },
    message: {
      contactMessage: {
        displayName: m.pushName || 'User',
        vcard: `BEGIN:VCARD
VERSION:3.0
N:${m.pushName || 'User'};;;;
FN:${m.pushName || 'User'}
item1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}
item1.X-ABLabel:📞 WhatsApp
ORG:𝑵𝑬𝒁𝑼𝑲𝑶 𝑩𝑶𝑻 ✓
TITLE:Verified Developer
END:VCARD`
      }
    },
    participant: '0@s.whatsapp.net'
  }
}

let handler = async (m, { conn, usedPrefix }) => {
    conn.tekateki = conn.tekateki ? conn.tekateki : {};
    let id = m.chat;
    
    if (id in conn.tekateki) {
        return conn.reply(m.chat, `╭───≪ 🍒 𝑩𝒆𝒕𝒉𝒐 🍇 ≫───╮\n│ ⌬ *_لا يزال هناك لغز لم يحل بعد!_* 🧩\n╯───≪ 🌿🍉🍡 ≫───╰`, contactQuote(m));
    }

    let filePath = `./src/game/acertijo.json`;
    if (!fs.existsSync(filePath)) {
        return conn.reply(m.chat, '❌ ملف الألغاز (acertijo.json) غير موجود!', m);
    }

    let tekateki = JSON.parse(fs.readFileSync(filePath));
    let json = tekateki[Math.floor(Math.random() * tekateki.length)];

    let caption = `.𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢
🍒 𝑩𝒆𝒕𝒉𝒐 🍇
ＢＹ 𝐶𝑟𝑎𝑧𝑦

╭───≪ 🍒 𝑩𝒆𝒕𝒉𝒐 🍇 ≫───╮
│ ⌬ *اللغز:* ${json.question} 🍭
│ 
│ ⌬ *الاعـب:* @${m.sender.split('@')[0]}
│ ⌬ *الوقت:* ${(timeout / 1000).toFixed(0)} ثانية ⏳
│ ⌬ *الجائزة:* ${poin}xp 💰
╯───≪ 🌿🍉🍡 ≫───╰
FREE BOT WHATSAPP 3RAB Life`.trim();

    conn.tekateki[id] = [
        await conn.reply(m.chat, caption, contactQuote(m), { mentions: [m.sender] }),
        json, 
        poin,
        setTimeout(async () => {
            if (conn.tekateki[id]) {
                await conn.reply(m.chat, `╭───≪ 🍒 𝑩𝒆𝒕𝒉𝒐 🍇 ≫───╮\n│ ⌛ *انتهى الوقت يا عبقري*\n│ 💡 *الإجابة كانت:* ${json.response}\n╯───≪ 🌿🍉🍡 ≫───╰`, contactQuote(m));
            }
            delete conn.tekateki[id];
        }, timeout)
    ];
};

handler.help = ['سؤال'];
handler.tags = ['العاب'];
handler.command = /^(سؤال|لغز)$/i;

export default handler;