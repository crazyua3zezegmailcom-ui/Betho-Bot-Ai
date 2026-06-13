// حہּٰقَــــوٰقَ 𝐶𝑟𝑎𝑧𝑦 💻🔥
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const timeout = 60000;

let handler = async (m, { conn, command }) => {
    let jid = m.sender;
    if (command.startsWith('جوابي_')) {
        let id = m.chat;
        let ZIAD = conn.ZIAD[id];

        if (!ZIAD) {
            return conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 🧩 ≫───╮\n│ ⌬ *_لا توجد لعبة نشطة الان 📯📍_*\n╯───≪ ⚙️🧩⚙️ ≫───╰`, m);
        }

        let selectedAnswerIndex = parseInt(command.split('_')[1]);
        if (isNaN(selectedAnswerIndex) || selectedAnswerIndex < 1 || selectedAnswerIndex > 4) {
            return conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 🧩 ≫───╮\n│ ⌬ *_اختيار غير صالح يا اخي ❌_*\n╯───≪ ⚙️🧩⚙️ ≫───╰`, m);
        }

        let selectedAnswer = ZIAD.options[selectedAnswerIndex - 1];
        let isCorrect = ZIAD.correctAnswer === selectedAnswer;

        if (isCorrect) {
            await conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 🧩 ≫───╮\n│ ⌬ *_إجابة صحيحة مبروك ✨✅_*\n│ 💰 *الجائزة:* 500xp\n╯───≪ ⚙️🧩⚙️ ≫───╰`, m);
            global.db.data.users[m.sender].exp += 500;
            clearTimeout(ZIAD.timer);
            delete conn.ZIAD[id];
        } else {
            ZIAD.attempts -= 1;
            if (ZIAD.attempts > 0) {
                await conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 🧩 ≫───╮\n│ ⌬ *_إجابة خاطئة يا اخي 🛠️❌_*\n│ ⏳ *المحاولات المتبقية:* ${ZIAD.attempts}\n╯───≪ ⚙️🧩⚙️ ≫───╰`, m);
            } else {
                await conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 🧩 ≫───╮\n│ ⌬ *_إجابة خاطئة انتهت المحاولات 😢_*\n│ 💡 *الإجابة:* ${ZIAD.correctAnswer}\n╯───≪ ⚙️🧩⚙️ ≫───╰`, m);
                clearTimeout(ZIAD.timer);
                delete conn.ZIAD[id];
            }
        }
    } else {
        try {
            conn.ZIAD = conn.ZIAD || {};
            let id = m.chat;

            if (conn.ZIAD[id]) {
                return conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 🧩 ≫───╮\n│ ⌬ *_هناك لعبة جارية بالفعل لم تنتهي بعد ❌❄️_*\n╯───≪ ⚙️🧩⚙️ ≫───╰`, m);
            }

            const response = await fetch('https://gist.githubusercontent.com/Kyutaka101/98d564d49cbf9b539fee19f744de7b26/raw/f2a3e68bbcdd2b06f9dbd5f30d70b9fda42fec14/guessflag');
            const ZIADData = await response.json();

            if (!ZIADData) {
                throw new Error('فشل الحصول على المعلومات');
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
                    text: `.𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢\n⚙️ 𝑩𝒆𝒕𝒉𝒐 🧩\nＢＹ 𝐶𝑟𝑎𝑧𝑦\n\n╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 🧩 ≫───╮\n│ ⌬ *احزر اسم شخصية الأنمي* 🥢\n│\n│ ⌬ *الوقت:* 60 ثانية ⏳\n│ ⌬ *الجائزة:* 500xp 💰\n╯───≪ ⚙️🧩⚙️ ≫───╰`,
                },
                footer: { text: 'FREE BOT WHATSAPP 3RAB Life' },
                header: {
                    title: 'ㅤ',
                    subtitle: 'اختر الإجابة الصحيحة من هذه الاختيارات ⇊',
                    hasMediaAttachment: true,
                    imageMessage: media.imageMessage,
                },
                nativeFlowMessage: {
                    buttons: options.map((option, index) => ({
                        name: 'quick_reply',
                        buttonParamsJson: JSON.stringify({
                            display_text: `⌬ ↫ 〘 ${option} 〙`,
                            id: `.جوابي_${index + 1}`
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

            conn.ZIAD[id] = {
                correctAnswer: name,
                options: options,
                timer: setTimeout(async () => {
                    if (conn.ZIAD[id]) {
                        await conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 🧩 ≫───╮\n│ ⌛ *انتهى الوقت يا بطل*\n│ 💡 *الإجابة الصحيحة كانت:* ${name}\n╯───≪ ⚙️🧩⚙️ ≫───╰`, m);
                        delete conn.ZIAD[id];
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

handler.help = ['احزر'];
handler.tags = ['العاب'];
handler.command = /^(احزر|احزري|جوابي_\d+)$/i;

export default handler;