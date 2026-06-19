import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const timeout = 60000;

let handler = async (m, { conn, command }) => {
    let jid = m.sender;
    if (command.startsWith('مجوب_')) {
        let id = m.chat;
        let 𝐶𝑟𝑎𝑧𝑦 = conn.𝐶𝑟𝑎𝑧𝑦[id];

        if (!𝐶𝑟𝑎𝑧𝑦) {
            return conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_لا توجد لعبة نشطة الان 📯📍_*\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
        }

        let selectedAnswerIndex = parseInt(command.split('_')[1]);
        if (isNaN(selectedAnswerIndex) || selectedAnswerIndex < 1 || selectedAnswerIndex > 4) {
            return conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_اختيار غير صالح يا اخي ❌_*\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
        }

        let selectedAnswer = 𝐶𝑟𝑎𝑧𝑦.options[selectedAnswerIndex - 1];
        let isCorrect = 𝐶𝑟𝑎𝑧𝑦.correctAnswer === selectedAnswer;

        if (isCorrect) {
            await conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_إجابة صحيحة مبروك ✨✅_*\n│ 💰 *الجائزة:* 500xp\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
            global.db.data.users[m.sender].exp += 500;
            clearTimeout(𝐶𝑟𝑎𝑧𝑦.timer);
            delete conn.𝐶𝑟𝑎𝑧𝑦[id];
        } else {
            𝐶𝑟𝑎𝑧𝑦.attempts -= 1;
            if (𝐶𝑟𝑎𝑧𝑦.attempts > 0) {
                await conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_إجابة خاطئة يا اخي 🛠️❌_*\n│ ⏳ *المحاولات المتبقية:* ${𝐶𝑟𝑎𝑧𝑦.attempts}\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
            } else {
                await conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_إجابة خاطئة انتهت المحاولات 😢_*\n│ 💡 *الإجابة:* ${𝐶𝑟𝑎𝑧𝑦.correctAnswer}\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
                clearTimeout(𝐶𝑟𝑎𝑧𝑦.timer);
                delete conn.𝐶𝑟𝑎𝑧𝑦[id];
            }
        }
    } else {
        try {
            conn.𝐶𝑟𝑎𝑧𝑦 = conn.𝐶𝑟𝑎𝑧𝑦 || {};
            let id = m.chat;

            if (conn.𝐶𝑟𝑎𝑧𝑦[id]) {
                return conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_هناك لعبة جارية بالفعل لم تنتهي بعد ❌🧶_*\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
            }

            const response = await fetch('https://raw.githubusercontent.com/DK3MK/worker-bot/main/eye.json');
            const ZIADData = await response.json();

            if (!ZIADData) {
                throw new Error('فشل الحصول على البيانات');
            }

            const ZIADItem = ZIADData[Math.floor(Math.random() * ZIADData.length)];
            const { img, name } = ZIADItem;

            let options = [name];
            while (options.length < 4) {
                let randomItem = ZIADData[Math.floor(Math.random() * ZIADData.length)].name;
                if (!options.includes(randomItem)) {
                    options.push(randomItem);
                }
            }
            options.sort(() => Math.random() - 0.5);

            const media = await prepareWAMessageMedia({ image: { url: img } }, { upload: conn.waUploadToServer });

            const interactiveMessage = {
                body: {
                    text: `.𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥\n⚙️ عـيـن ⚙️\n𝐵𝑦 𝐶𝑟𝑎𝑧𝑦\n\n╭───≪ ⚙️ 𝗚𝗔𝗠𝗘 ⚙️ ≫───╮\n│ ⌬ *تعرف على اسم الشخصية من عينها* 👁️\n│\n│ ⌬ *الوقت:* 60 ثانية ⏳\n│ ⌬ *الجائزة:* 500xp 💰\n╯───≪ 🌿🍉🍡 ≫───╰`,
                },
                footer: { text: 'FREE BOT WHATSAPP 3RAB Life' },
                header: {
                    title: 'ㅤ',
                    subtitle: 'المرجو اختيار اسم لاعب من هذه الاختيارات ⇊',
                    hasMediaAttachment: true,
                    imageMessage: media.imageMessage,
                },
                nativeFlowMessage: {
                    buttons: options.map((option, index) => ({
                        name: 'quick_reply',
                        buttonParamsJson: JSON.stringify({
                            display_text: `⌬ ↫ 〘 ${option} 〙`,
                            id: `.مجوب_${index + 1}`
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

            conn.𝐶𝑟𝑎𝑧𝑦[id] = {
                correctAnswer: name,
                options: options,
                timer: setTimeout(async () => {
                    if (conn.𝐶𝑟𝑎𝑧𝑦[id]) {
                        await conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌛ *انتهى الوقت يا بطل*\n│ 💡 *الإجابة كانت:* ${name}\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
                        delete conn.𝐶𝑟𝑎𝑧𝑦[id];
                    }
                }, timeout),
                attempts: 2
            };

        } catch (e) {
            console.error(e);
            conn.reply(m.chat, '❌ حدث خطأ في تشغيل اللعبة.', m);
        }
    }
};

handler.help = ['عين'];
handler.tags = ['العاب'];
handler.command = /^(عين|عيون|مجوب_\d+)$/i;

export default handler;