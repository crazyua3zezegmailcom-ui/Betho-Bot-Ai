/**
 * 🎮 مسابقة تخمين الشخصيات (نظام الحسم بنقطتين) — ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥
 * ⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓
 */

import axios from 'axios';

let handler = async (m, { conn, command, usedPrefix }) => {
    conn.photo_game = conn.photo_game ? conn.photo_game : {};

    // --- أمر الإلغاء ---
    if (command === 'الغاء_المسابقة') {
        if (!conn.photo_game[m.chat]) return m.reply('*⚠️ لا توجد مسابقة جارية الآن.*');
        if (conn.photo_game[m.chat].creator !== m.sender) return m.reply('*❌ هذا الأمر مسموح به فقط لمنشئ المسابقة.*');
        clearTimeout(conn.photo_game[m.chat].timeout);
        delete conn.photo_game[m.chat];
        return m.reply('*🛑 تم إلغاء المسابقة.*');
    }

    // --- بدء المسابقة ---
    if (conn.photo_game[m.chat]) return m.reply('*⚠️ هناك مسابقة قائمة بالفعل في هذه المجموعة.*');

    try {
        const { data } = await axios.get('https://gist.githubusercontent.com/Kyutaka101/98d564d49cbf9b539fee19f744de7b26/raw/f2a3e68bbcdd2b06f9dbd5f30d70b9fda42fec14/guessflag');
        
        conn.photo_game[m.chat] = {
            creator: m.sender,
            questions: Array.isArray(data) ? data : [],
            players: {}, 
            noAnswerCount: 0, 
            currentIdx: -1,
            answer: '',
            msgId: null,
            timeout: null
        };

        m.reply('*🎮 تـم بـدء مـسابـقة الـصور! أول من يـجمع نـقطتين يـفوز 🏆*');
        return nextQuestion(conn, m.chat);

    } catch (e) {
        m.reply('*❌ فشل جلب بيانات المسابقة من السيرفر.*');
    }
}

// --- دالة السؤال التالي ---
async function nextQuestion(conn, chat) {
    let game = conn.photo_game[chat];
    if (!game) return;

    // إنهاء المسابقة إذا مرت 3 صور بدون إجابة نهائياً
    if (game.noAnswerCount >= 3) {
        return finishGame(conn, chat, true);
    }

    game.currentIdx = Math.floor(Math.random() * game.questions.length);
    let q = game.questions[game.currentIdx];
    game.answer = q.name.trim().toLowerCase();

    let msg = await conn.sendMessage(chat, {
        image: { url: q.img },
        caption: `*تـعرف عـلى هذه الـشـخـصية (الرد على الصورة) 🔍*\n\n*⏳ أمامكم 30 ثانية للإجابة!*`
    });

    game.msgId = msg.key.id;

    clearTimeout(game.timeout);
    game.timeout = setTimeout(() => {
        if (conn.photo_game[chat]) {
            conn.sendMessage(chat, { text: `*🕒 انتهى الوقت! الجواب كان: ${game.answer}*` });
            conn.photo_game[chat].noAnswerCount++;
            nextQuestion(conn, chat);
        }
    }, 30000);
}

// --- دالة إنهاء اللعبة وعرض النتائج النهائية ---
async function finishGame(conn, chat, isTimeout = false) {
    let game = conn.photo_game[chat];
    let ranking = Object.entries(game.players).sort((a, b) => b[1] - a[1]);
    
    let text = isTimeout ? `*📊 انـتهت الـمسـابـقة لعدم التفاعل! الـنتـائج:*\n\n` : `*🎊 تـم ربـح الـمـسـابـقة بـنـجاح! 🎊*\n\n`;
    
    if (ranking.length === 0) {
        text += `*❌ لـم يـجب أحـد عـلى الأسـئلة.*`;
    } else {
        let winner = ranking[0];
        text += `*الـفـائـز الـنـهـائـي 🥇: @${winner[0].split('@')[0]}*\n\n`;
        text += `*الـنـقـاط:*\n`;
        ranking.forEach(([id, points], i) => {
            text += `*${i + 1}- @${id.split('@')[0]} ↞ ${points} نـقـطة*\n`;
        });
    }
    text += `\n*شـكراً لـلعبكم! ✨*`;

    await conn.sendMessage(chat, { text, mentions: Object.keys(game.players) });
    delete conn.photo_game[chat];
}

// --- معالج الإجابات ---
handler.before = async function (m) {
    if (!m.chat || !m.text) return;
    let conn = this;
    let game = conn.photo_game && conn.photo_game[m.chat];

    if (!game) return;
    
    const isReplyToBot = m.quoted && m.quoted.id === game.msgId;
    if (!isReplyToBot) return;

    let userAnswer = m.text.trim().toLowerCase();
    
    if (userAnswer === game.answer) {
        clearTimeout(game.timeout);
        
        // إضافة النقطة للاعب
        game.players[m.sender] = (game.players[m.sender] || 0) + 1;
        game.noAnswerCount = 0; 

        let currentPoints = game.players[m.sender];

        // إذا وصل اللاعب لنقطتين يفوز فوراً وتنتهي المسابقة
        if (currentPoints >= 2) {
            return finishGame(conn, m.chat, false);
        }

        // إذا لم يصل لنقطتين، يعرض نقاطه ويطلب الصورة التالية
        let ranking = Object.entries(game.players).sort((a, b) => b[1] - a[1]);
        let progressText = `*✅ إجـابة صـحيـحة! ربـحت نـقـطة 🥳*\n\n*الـتـرتـيـب الـحـالـي:*\n`;
        ranking.forEach(([id, points]) => {
            progressText += `• @${id.split('@')[0]} ↞ ${points} نـقـطة\n`;
        });
        progressText += `\n*جـاري إرسـال الـصـورة الـتـالـيـة...*`;

        await conn.sendMessage(m.chat, { text: progressText, mentions: Object.keys(game.players) });

        setTimeout(() => {
            if (conn.photo_game[m.chat]) nextQuestion(conn, m.chat);
        }, 2000);
    }
};

handler.help = ['مسابقة_صور'];
handler.tags = ['game'];
handler.command = /^(مسابقة_صور|الغاء_المسابقة)$/i;
handler.group = true;

export default handler;