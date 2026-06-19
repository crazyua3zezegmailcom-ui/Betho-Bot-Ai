import fs from "fs";
import fetch from "node-fetch";
import { prepareWAMessageMedia, generateWAMessageFromContent } from "@whiskeysockets/baileys";

const timeout = 60000;
const points = 500;
const THUMB_URL = "https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg"; 

let handler = async (m, { conn, command }) => {
    let jid = m.sender;
    conn.capitalGame = conn.capitalGame || {};
  if (command.startsWith("اجابه_")) {
    let id = m.chat;
    let game = conn.capitalGame[id];
    if (!game) {
      return conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_لا توجد لعبة نشطة الان 📯📍_*\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
    }

    let selected = parseInt(command.split("_")[1]);
    if (isNaN(selected) || selected < 1 || selected > 4) {
      return conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_اختيار غير صالح يا اخي ❌_*\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
    }

    let chosenAnswer = game.options[selected - 1];
    let isCorrect = game.correct === chosenAnswer;

    if (isCorrect) {
      await conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_إجابة صحيحة مبروك ✨✅_*\n│ 💰 *الجائزة:* ${points}xp\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
      global.db.data.users[m.sender].exp += points;
      clearTimeout(game.timer);
      delete conn.capitalGame[id];
    } else {
      game.attempts -= 1;
      if (game.attempts > 0) {
        await conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_إجابة خاطئة يا اخي 🛠️❌_*\n│ ⏳ *المحاولات المتبقية:* ${game.attempts}\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
      } else {
        await conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_إجابة خاطئة انتهت المحاولات 😢_*\n│ 💡 *الإجابة:* ${game.correct}\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
        clearTimeout(game.timer);
        delete conn.capitalGame[id];
      }
    }
  } else {
    try {
      conn.capitalGame = conn.capitalGame || {};
      let id = m.chat;

      if (conn.capitalGame[id]) {
        return conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_هناك لعبة جارية بالفعل لم تنتهي بعد ❌❄️_*\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
      }

      // تحميل الأسئلة من ملف JSON
      let data = JSON.parse(fs.readFileSync("./src/game/عواصم.json"));
      let q = data[Math.floor(Math.random() * data.length)];

      // توليد خيارات عشوائية
      let options = [q.response];
      while (options.length < 4) {
        let random = data[Math.floor(Math.random() * data.length)].response;
        if (!options.includes(random)) options.push(random);
      }
      options.sort(() => Math.random() - 0.5);

      // تجهيز الصورة والرسالة التفاعلية
      const media = await prepareWAMessageMedia(
        { image: { url: THUMB_URL } },
        { upload: conn.waUploadToServer }
      );

      const interactiveMessage = {
        body: {
          text: `.𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥\n⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️\n𝐵𝑦 𝐶𝑟𝑎𝑧𝑦\n\n╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️≫───╮\n│ ⌬ *${q.question}* 🏦\n│\n│ ⌬ *الوقت:* ${(timeout / 1000).toFixed(0)} ثانية ⏳\n│ ⌬ *الجائزة:* ${points}xp 💰\n╯───≪ 🫐🪻🧩 ≫───╰`,
        },
        footer: { text: "⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥" },
        header: {
          title: "ㅤ",
          subtitle: "اختر الإجابة الصحيحة 👇",
          hasMediaAttachment: true,
          imageMessage: media.imageMessage,
        },
        nativeFlowMessage: {
          buttons: options.map((option, index) => ({
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
              display_text: `⌬ ↫ 〘 ${option} 〙`,
              id: `.اجابه_${index + 1}`,
            }),
          })),
        },
      };

      const msg = generateWAMessageFromContent(
        m.chat,
        { viewOnceMessage: { message: { interactiveMessage } } },
        { userJid: conn.user.jid, quoted: m }
      );

      conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

      conn.capitalGame[id] = {
        correct: q.response,
        options,
        timer: setTimeout(async () => {
          if (conn.capitalGame[id]) {
            await conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌛ *انتهى الوقت يا بطل*\n│ 💡 *الإجابة الصحيحة كانت:* ${q.response}\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
            delete conn.capitalGame[id];
          }
        }, timeout),
        attempts: 2,
      };
    } catch (err) {
      console.error(err);
      conn.reply(m.chat, "❌ حدث خطأ أثناء تشغيل اللعبة.", m);
    }
  }
};

handler.help = ["عاصمه"];
handler.tags = ["العاب"];
handler.command = /^(عاصمه|اجابه_\d+)$/i;

export default handler;