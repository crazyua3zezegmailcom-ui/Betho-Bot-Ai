import fs from 'fs';

let timeout = 60000;
let poin = 500;

let handler = async (m, { conn, usedPrefix }) => {
    conn.tekateki = conn.tekateki ? conn.tekateki : {};
    let id = m.chat;
    if (id in conn.tekateki) {
        return conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_لا توجد لعبة نشطة الان 📯📍_*\n╯───≪ 🫐🪻🧩 ≫───╰`, conn.tekateki[id][0]);
    }
    
    let tekateki = JSON.parse(fs.readFileSync(`./src/game/miku.json`));
    let json = tekateki[Math.floor(Math.random() * tekateki.length)];
    
    let caption = `.𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥
⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️
𝐵𝑦 𝐶𝑟𝑎𝑧𝑦

╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮
│ ⌬ *السؤال:* ${json.question} 🧩
│ 
│ ⌬ *الاعـب:* @${m.sender.split('@')[0]}
│ ⌬ *الوقت:* ${(timeout / 1000).toFixed(0)} ثانية ⏳
│ ⌬ *الجائزة:* ${poin}xp 💰
╯───≪ 🫐🪻🧩 ≫───╰
FREE BOT WHATSAPP 3RAB Life`.trim();

    conn.tekateki[id] = [
        await conn.reply(m.chat, caption, m, { mentions: [m.sender] }),
        json, poin,
        setTimeout(async () => {
            if (conn.tekateki[id]) await conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌛ *انتهى الوقت يا بطل*\n│ 💡 *الإجابة كانت:* ${json.response}\n╯───≪ 🫐🪻🧩 ≫───╰`, conn.tekateki[id][0]);
            delete conn.tekateki[id];
        }, timeout)
    ];
};

handler.help = ['فكك'];
handler.tags = ['العاب'];
handler.command = /^(فكك)$/i;

export default handler;