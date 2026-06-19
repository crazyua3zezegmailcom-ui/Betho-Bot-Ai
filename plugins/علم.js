import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const timeout = 60000;

let handler = async (m, { conn, command }) => {
    let jid = m.sender;
    conn.Crazy = conn.Crazy || {};
    if (command.startsWith('اجاب_')) {
        let id = m.chat;
        let Crazy = conn.Crazy[id];

        if (!Crazy) {
            return conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_لا توجد لعبة نشطة الان 📯📍_*\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
        }

        let selectedAnswerIndex = parseInt(command.split('_')[1]);
        if (isNaN(selectedAnswerIndex) || selectedAnswerIndex < 1 || selectedAnswerIndex > 4) {
            return conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_اختيار غير صالح يا اخي ❌_*\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
        }

        let selectedAnswer = Crazy.options[selectedAnswerIndex - 1];
        let isCorrect = Crazy.correctAnswer === selectedAnswer;

        if (isCorrect) {
            await conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_إجابة صحيحة مبروك ✨✅_*\n│ 💰 *الجائزة:* 500xp\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
            global.db.data.users[m.sender].exp += 500;
            clearTimeout(Crazy.timer);
            delete conn.Crazy[id];
        } else {
            Crazy.attempts -= 1;
            if (Crazy.attempts > 0) {
                await conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_إجابة خاطئة يا اخي 🛠️❌_*\n│ ⏳ *المحاولات المتبقية:* ${Crazy.attempts}\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
            } else {
                await conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_إجابة خاطئة انتهت المحاولات 😢_*\n│ 💡 *الإجابة:* ${Crazy.correctAnswer}\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
                clearTimeout(Crazy.timer);
                delete conn.Crazy[id];
            }
        }
    } else {
        try {
            conn.Crazy = conn.Crazy || {};
            let id = m.chat;

            if (conn.Crazy[id]) {
                return conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_هناك لعبة جارية بالفعل لم تنتهي بعد ❌❄️_*\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
            }

            const response = await fetch('https://raw.githubusercontent.com/ze819/game/master/src/game.js/luffy1.json');
            const CrazyData = await response.json();

            if (!CrazyData) {
                throw new Error('فشل الحصول على المعلومات');
            }

            const CrazyItem = CrazyData[Math.floor(Math.random() * CrazyData.length)];
            const { img, name } = CrazyItem;

            let options = [name];
            while (options.length < 4) {
                let randomItem = CrazyData[Math.floor(Math.random() * CrazyData.length)].name;
                if (!options.includes(randomItem)) {
                    options.push(randomItem);
                }
            }
            options.sort(() => Math.random() - 0.5);

            const media = await prepareWAMessageMedia({ image: { url: img } }, { upload: conn.waUploadToServer });

            const interactiveMessage = {
                body: {
                    text: `.𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥\n⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️\n𝐵𝑦 𝐶𝑟𝑎𝑧𝑦\n\n╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *لعبة تعرف على اسم علم الدولة* 🌍\n│\n│ ⌬ *الوقت:* 60 ثانية ⏳\n│ ⌬ *الجائزة:* 500xp 💰\n╯───≪ 🫐🪻🧩 ≫───╰`,
                },
                footer: { text: 'FREE BOT WHATSAPP 3RAB Life' },
                header: {
                    title: 'ㅤ',
                    subtitle: 'المرجو اختيار اسم الدولة من هذه الاختيارات ⇊',
                    hasMediaAttachment: true,
                    imageMessage: media.imageMessage,
                },
                nativeFlowMessage: {
                    buttons: options.map((option, index) => ({
                        name: 'quick_reply',
                        buttonParamsJson: JSON.stringify({
                            display_text: `⌬ ↫ 〘 ${option} 〙`,
                            id: `.اجاب_${index + 1}`
                        })
                    })),
                },
            };

            let msg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: { interactiveMessage },
                },
            }, { userJid: conn.user.jid, quoted: m });

            conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

            conn.Crazy[id] = {
                correctAnswer: name,
                options: options,
                timer: setTimeout(async () => {
                    if (conn.Crazy[id]) {
                        await conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌛ *انتهى الوقت يا بطل*\n│ 💡 *الإجابة الصحيحة كانت:* ${name}\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
                        delete conn.Crazy[id];
                    }
                }, timeout),
                attempts: 2
            };

        } catch (e) {
            console.error(e);
            conn.reply(m.chat, '❌ حدث خطأ في إرسال الرسالة.', m);
        }
    }
};

handler.help = ['علم'];
handler.tags = ['العاب'];
handler.command = /^(علم|اعلام|اجاب_\d+)$/i;

export default handler;