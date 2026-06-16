// حہּٰقَــــوٰقَ 𝐶𝑟𝑎𝑧𝑦 💻🔥
import fs from 'fs';

let timeout = 60000; 
let poin = 500;

const handler = async (m, { conn }) => {
    conn.tekateki = conn.tekateki || {};
    let id = m.chat;

    if (conn.tekateki[id]) {
        return conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_لا يزال هناك سؤال جاري!_* ⚠️\n╯───≪ 🫐🪻🧩 ≫───╰`, conn.tekateki[id][0]);
    }

    let filePath = './src/game/dean.json';
    if (!fs.existsSync(filePath)) {
        return conn.reply(m.chat, '❌ للأسف، ملف اللعبة (dean.json) غير موجود!', m);
    }

    let tekateki;
    try {
        tekateki = JSON.parse(fs.readFileSync(filePath));
    } catch (e) {
        return conn.reply(m.chat, '❌ خطأ في قراءة ملف JSON!', m);
    }

    let json = tekateki[Math.floor(Math.random() * tekateki.length)];

    let caption = `.𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥
⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️
𝐵𝑦 𝐶𝑟𝑎𝑧𝑦

╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮
│ ⌬ *السؤال:* ${json.question} 🕋
│ 
│ ⌬ *الاعـب:* @${m.sender.split('@')[0]}
│ ⌬ *الوقت:* ${(timeout / 1000).toFixed(0)} ثانية ⏳
│ ⌬ *الجائزة:* ${poin}xp 💰
╯───≪ 🫐🪻🧩 ≫───╰
FREE BOT WHATSAPP 3RAB Life`.trim();

    conn.tekateki[id] = [
        await conn.reply(m.chat, caption, m, { mentions: [m.sender] }),
        json,
        poin,
        setTimeout(async () => {
            if (conn.tekateki[id]) {
                await conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌛ *انتهى الوقت يا بطل*\n│ 💡 *الإجابة كانت:* ${json.response}\n╯───≪ 🫐🪻🧩 ≫───╰`, conn.tekateki[id][0]);
                delete conn.tekateki[id];
            }
        }, timeout)
    ];
};

handler.help = ['دين'];
handler.tags = ['العاب'];
handler.command = /^(دين)$/i;

export default handler;