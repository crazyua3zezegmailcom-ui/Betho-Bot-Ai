import fetch from 'node-fetch';

const gameDuration = 60000; 
const basePoints = 500; 
const maxQuestions = 15; 
const maxHelps = 2; 
const maxHints = 1; 
const maxResponses = 1; 
const maxReducedOptions = 1;

const difficultyLevels = {
    easy: 1,
    medium: 2,
    hard: 3
};

export async function handler(m, { command, text, conn }) {
    let id = m.chat;
    conn.millionGame = conn.millionGame || {};
    let currentGame = conn.millionGame[id];

    // تحميل الأسئلة
    let src = await (await fetch('https://gist.githubusercontent.com/Dx-Tea/19102ea14b19d7ef685128e6186a277d/raw/867b4da16f68253f67ca184f77ce5295d1da4029/By-shanks')).json();

    if (!src || src.length === 0) {
        return conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 🧩 ≫───╮\n│ ⌬ *_لا توجد أسئلة متاحة حالياً ⚠️_*\n╯───≪ ⚙️🧩⚙️ ≫───╰`, m);
    }

    let shanks = 'https://qu.ax/Cnbf.jpg';

    if (currentGame) {
        if (!text) {
            return conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 🧩 ≫───╮\n│ ⌬ *هناك لعبة قيد التشغيل بالفعل*\n│ 📈 *المستوى:* ${currentGame[4]}\n│ 🆘 *المساعدات:* ${currentGame[5]}\n╯───≪ ⚙️🧩⚙️ ≫───╰`, m);
        } else if (text === currentGame[1].response) {
            m.react('✅');
            let currentLevel = currentGame[4];
            let points = basePoints * currentLevel;

            let timeTaken = gameDuration - (Date.now() - currentGame[2].startTime);
            let speedBonus = Math.max(0, Math.floor((timeTaken / 1000) * 50)); 
            let totalPoints = points + speedBonus;

            global.db.data.users[m.sender].exp += totalPoints;

            conn.sendButton(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 🧩 ≫───╮\n│ ⌬ *_إجابة صحيحة مبروك ✨✅_*\n│ 💰 *الجائزة:* ${totalPoints}xp\n│ ⚡ *بونص السرعة:* ${speedBonus}\n│ 📈 *المستوى التالي:* ${currentLevel + 1}\n╯───≪ ⚙️🧩⚙️ ≫───╰`, null, null, [[`↬ السؤال التالي`, `.المليون`]], null, null);

            if (currentLevel === 5 || currentLevel === 10) {
                conn.reply(m.chat, `🎉 مبروك! وصلت للمستوى ${currentLevel} وحصلت على مكافأة 1000xp إضافية!`, m);
                global.db.data.users[m.sender].exp += 1000;
            }

            clearTimeout(currentGame[3]);
            currentLevel++;

            if (currentLevel > maxQuestions) {
                conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 🧩 ≫───╮\n│ 🎊 *مبروك! لقد ربحت المليون!* 🎊\n╯───≪ ⚙️🧩⚙️ ≫───╰`, m);
                delete conn.millionGame[id];
            } else {
                startNewQuestion(conn, m, id, currentLevel, src);
            }

        } else if (text === 'قائمة المساعدات' && currentGame[5] > 0) {
            m.react('💡');
            let message = `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 🧩 ≫───╮\n│ ⌬ *قائمة المساعدات المتاحة:*\n│ ❶ *المساعدات:* ${currentGame[5]}\n│ ❷ *التلميحات:* ${currentGame[6]}\n│ ❸ *جمهور:* ${currentGame[7]}\n│ ❹ *حذف خيارين:* ${currentGame[8]}\n╯───≪ ⚙️🧩⚙️ ≫───╰`;

            await conn.sendButton(m.chat, message, null, shanks, [
                [`مساعدة 💡`, `.المليون مساعدة`],
                [`تلميح 💡`, `.المليون تلميح`],
                [`مساعدة الجمهور 🎥`, `.المليون جواب`],
                [`انسحاب 🏃‍♂️`, `.المليون انسحب`],
                [`حذف خيارين ✂️`, `.المليون إزالة اختيارين`]
            ], null, null);
        } else if (text === 'مساعدة' && currentGame[5] > 0) {
            let help = getHalfAnswer(currentGame[1].response);
            conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 🧩 ≫───╮\n│ 💡 *تلميح:* نصف الإجابة هو [ ${help} ]\n╯───≪ ⚙️🧩⚙️ ≫───╰`, m);
            currentGame[5]--;
        } else if (text === 'إزالة اختيارين' && currentGame[8] > 0) {
            let reducedOptions = removeTwoIncorrectOptions(currentGame[1].response, currentGame[1].options);
            conn.sendButton(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 🧩 ≫───╮\n│ 💡 *تم حذف خيارين بنجاح*\n│ *الخيارات المتبقية هي:* \n│ ⌬ ${reducedOptions.join(' أو ')}\n╯───≪ ⚙️🧩⚙️ ≫───╰`, null, shanks, [
                [`${reducedOptions[0]}`, `.المليون ${reducedOptions[0]}`],
                [`${reducedOptions[1]}`, `.المليون ${reducedOptions[1]}`]
            ], null, null);
            currentGame[8]--;
        } else if (text === 'تلميح' && currentGame[6] > 0) {
            let hint = getHint(currentGame[1].hint);
            conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 🧩 ≫───╮\n│ 💡 *التلميح:* ${hint}\n╯───≪ ⚙️🧩⚙️ ≫───╰`, m);
            currentGame[6]--;
        } else if (text === 'جواب' && currentGame[7] > 0) {
            let response = getAudienceHelp(currentGame[1].response);
            conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 🧩 ≫───╮\n│ 🎥 *الجمهور يقول:* الإجابة هي [ ${response} ]\n╯───≪ ⚙️🧩⚙️ ≫───╰`, m);
            currentGame[7]--;
        } else if (text === 'انسحب') {
            clearTimeout(currentGame[3]);
            conn.sendButton(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 🧩 ≫───╮\n│ 🏃‍♂️ *تم الانسحاب بنجاح*\n│ 💡 *الإجابة كانت:* ${currentGame[1].response}\n╯───≪ ⚙️🧩⚙️ ≫───╰`, null, null, [[`↬ لعبة جديدة`, `.المليون`]], null, null);
            delete conn.millionGame[id];
        } else {
            clearTimeout(currentGame[3]);
            m.react('❌');
            conn.sendButton(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 🧩 ≫───╮\n│ ❌ *_إجابة خاطئة للأسف_*\n│ 💡 *الإجابة الصحيحة كانت:* ${currentGame[1].response}\n╯───≪ ⚙️🧩⚙️ ≫───╰`, null, null, [[`↬ حاول مجدداً`, `.المليون`]], null, null);
            delete conn.millionGame[id];
        }
    } else {
        let currentLevel = 1;
        startNewQuestion(conn, m, id, currentLevel, src);
    }
}

async function startNewQuestion(conn, m, id, level, src) {
    let question = src[Math.floor(Math.random() * src.length)];
    let options = [...question.options];
    while (options.length < 4) {
        let randomOption = src[Math.floor(Math.random() * src.length)].response;
        if (!options.includes(randomOption)) options.push(randomOption);
    }
    options = options.sort(() => Math.random() - 0.5);

    let remainingHelps = conn.millionGame[id] ? conn.millionGame[id][5] : maxHelps;
    let remainingHints = conn.millionGame[id] ? conn.millionGame[id][6] : maxHints;
    let remainingResponses = conn.millionGame[id] ? conn.millionGame[id][7] : maxResponses;
    let remainingReducedOptions = conn.millionGame[id] ? conn.millionGame[id][8] : maxReducedOptions;

    conn.millionGame[id] = [m, question, { startTime: Date.now() }, setTimeout(() => {
        delete conn.millionGame[id];
        conn.sendButton(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 🧩 ≫───╮\n│ ⌛ *انتهى الوقت يا بطل*\n│ 💡 *الإجابة كانت:* ${question.response}\n╯───≪ ⚙️🧩⚙️ ≫───╰`, null, null, [[`↬ لعبة جديدة`, `.المليون`]], null, null);
    }, gameDuration), level, remainingHelps, remainingHints, remainingResponses, remainingReducedOptions];

    let message = `.𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥\n⚙️ 𝑩𝒆𝒕𝒉𝒐 🧩\n𝐵𝑦 𝐶𝑟𝑎𝑧𝑦\n\n╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 🧩 ≫───╮\n│ ⌬ *السؤال:* ${question.question}\n│\n│ ⌬ *المستوى:* ${level}\n│ ⌬ *الوقت:* 60 ثانية ⏳\n│ ⌬ *الجائزة:* ${basePoints * level}xp 💰\n╯───≪ ⚙️🧩⚙️ ≫───╰`;

    await conn.sendButton(m.chat, message, 'FREE BOT WHATSAPP 3RAB Life', 'https://qu.ax/Cnbf.jpg', [
        [`① ↫ ${options[0]}`, `.المليون ${options[0]}`],
        [`② ↫ ${options[1]}`, `.المليون ${options[1]}`],
        [`③ ↫ ${options[2]}`, `.المليون ${options[2]}`],
        [`④ ↫ ${options[3]}`, `.المليون ${options[3]}`],
        [`قائمة المساعدات 🆘`, `.المليون قائمة المساعدات`]
    ], null, null);
}

function getHint(hint) { return hint ? hint : 'لا يوجد تلميح متاح لهذا السؤال.'; }
function getAudienceHelp(response) { return response ? response : 'لا توجد إجابة متاحة من الجمهور.'; }
function getHalfAnswer(answer) { return answer.substring(0, Math.ceil(answer.length / 2)) + "..."; }
function removeTwoIncorrectOptions(correctAnswer, options) {
    let incorrectOptions = options.filter(option => option !== correctAnswer).sort(() => Math.random() - 0.5).slice(0, 2);
    return options.filter(option => !incorrectOptions.includes(option));
}

handler.help = ['المليون'];
handler.tags = ['العاب'];
handler.command = /^المليون$/i;

export default handler;