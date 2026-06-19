import pkg from "@whiskeysockets/baileys";
const { generateWAMessageFromContent, proto } = pkg;

// خريطة تحويل الرقم إلى الإيموجي
const numToEmoji = {
  1: "1️⃣",
  2: "2️⃣",
  3: "3️⃣",
  4: "4️⃣",
  5: "5️⃣",
  6: "6️⃣",
  7: "7️⃣",
  8: "8️⃣",
  9: "9️⃣",
};

let handler = async (m, { conn, command }) => {
  if (!conn.xo) conn.xo = {};
  const id = m.chat;

  // ─── 🟢 إنشاء لعبة جديدة ───
  if (command === "اكسو") {
    if (conn.xo[id] && conn.xo[id].active)
      return m.reply("⚠️ هناك لعبة جارية بالفعل في هذه الدردشة.\nاستخدم `.كنسل` لإلغائها.");

    conn.xo[id] = {
      board: Array(9).fill(null),
      players: [m.sender],
      turn: 0,
      active: false,
      moves: {},
    };

    return conn.sendMessage(id, {
      text: `🎮 تم إنشاء لعبة *إكس أو*\n\n👤 اللاعب الأول: @${m.sender.split("@")[0]}\n🕹️ في انتظار لاعب آخر...\n\nاكتب \`.ادخل\` للانضمام.`,
      mentions: [m.sender],
    });
  }

  // ─── 🧩 انضمام لاعب ───
  if (command === "ادخل") {
    const game = conn.xo[id];
    if (!game) return m.reply("⚠️ لا توجد لعبة مفتوحة حالياً.\nابدأ واحدة بـ `.اكسو`");
    if (game.players.length >= 2) return m.reply("🎮 اللعبة ممتلئة بالفعل!");
    if (game.players.includes(m.sender)) return m.reply("😅 أنت بالفعل داخل اللعبة.");

    game.players.push(m.sender);
    game.active = true;
    game.moves[game.players[0]] = [];
    game.moves[game.players[1]] = [];

    const [p1, p2] = game.players;

    await sendBoard(
      conn,
      id,
      m,
      `🎮 بدأت اللعبة بين:\n\n❌ @${p1.split("@")[0]}\n⭕ @${p2.split("@")[0]}\n\n🔹 الدور الحالي: @${p1.split("@")[0]}`,
      game.players
    );
    return;
  }

  // ─── ❌ إلغاء اللعبة ───
  if (command === "كنسل") {
    const game = conn.xo[id];
    if (!game) return m.reply("⚠️ لا توجد لعبة لإلغائها.");
    if (!game.players.includes(m.sender))
      return m.reply("❗ فقط من يشاركون في اللعبة يمكنهم إلغاؤها.");

    delete conn.xo[id];
    return conn.sendMessage(id, {
      text: `💢 تم إلغاء اللعبة بواسطة @${m.sender.split("@")[0]}`,
      mentions: [m.sender],
    });
  }

  // ─── 🎯 تنفيذ حركة ───
  if (/^[1-9]$/.test(command)) {
    const game = conn.xo[id];
    if (!game || !game.active)
      return m.reply("⚠️ لا توجد لعبة جارية.\nابدأ بـ `.اكسو` أو انضم بـ `.ادخل`");

    const player = m.sender;
    const turnPlayer = game.players[game.turn];

    if (player !== turnPlayer)
      return m.reply(`❗ ليس دورك الآن.\n🎯 الدور الحالي: @${turnPlayer.split("@")[0]}`, {
        mentions: [turnPlayer],
      });

    const move = parseInt(command) - 1;
    if (game.board[move]) return m.reply("❗ هذا المكان مشغول بالفعل.");

    const symbol = game.turn === 0 ? "❌" : "⭕";
    game.board[move] = symbol;
    game.moves[player].push(move + 1);

    // فحص فوز
    if (checkWin(game.board)) {
      await sendBoard(conn, id, m, `🏆 الفائز هو @${player.split("@")[0]} 🎉`, [player]);
      delete conn.xo[id];
      return;
    }

    // فحص تعادل
    if (game.board.every((v) => v)) {
      await sendBoard(conn, id, m, "🤝 انتهت اللعبة بالتعادل!", []);
      delete conn.xo[id];
      return;
    }

    // تبديل الدور
    game.turn = game.turn === 0 ? 1 : 0;
    const next = game.players[game.turn];
    await sendBoard(conn, id, m, `🎯 الدور الآن على @${next.split("@")[0]}`, [next]);
  }
};

// ─── 🧱 دوال مساعدة ───
async function sendBoard(conn, chatId, m, caption, mentions = []) {
  const game = conn.xo[chatId];
  if (!game) return;

  const board = game.board.map((v, i) =>
    v ? v : numToEmoji[i + 1] // ← هنا نستخدم الإيموجي بدل الرقم العادي
  );

  const buttons = board.map((b, i) => ({
    name: "quick_reply",
    buttonParamsJson: JSON.stringify({
      display_text: b,
      id: /^[1-9]$/.test((i + 1).toString()) ? `.${i + 1}` : "noop",
    }),
  }));

  const msg = generateWAMessageFromContent(
    chatId,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: caption,
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "اختر الخانة للإكمال أو .كنسل لإلغاء اللعبة 👇",
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              hasMediaAttachment: false,
              title: renderBoard(board),
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons,
            }),
          }),
        },
      },
    },
    {}
  );

  return await conn.relayMessage(chatId, msg.message, {
    messageId: msg.key.id,
    mentions,
  });
}

// شكل اللوحة (إيموجي)
function renderBoard(b) {
  return `
${b[0]} | ${b[1]} | ${b[2]}
──────────────
${b[3]} | ${b[4]} | ${b[5]}
──────────────
${b[6]} | ${b[7]} | ${b[8]}
`.trim();
}

// فحص الفوز
function checkWin(b) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(([a,b1,c]) => b[a] && b[a] === b[b1] && b[a] === b[c]);
}

handler.command = /^(اكسو|ادخل|كنسل|[1-9])$/i;
export default handler;