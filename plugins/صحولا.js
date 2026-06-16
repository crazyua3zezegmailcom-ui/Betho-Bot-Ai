// حہּٰقَــــوٰقَ 𝐶𝑟𝑎𝑧𝑦 💻🔥
import pkg from "@whiskeysockets/baileys";
const { generateWAMessageFromContent, proto } = pkg;

const questions = [
  { q: "أول من استخدم الشاي هم الصينيون.", a: true },
  { q: "عدد الكواكب في المجموعة الشمسية هو تسعة.", a: false },
  { q: "الذهب يذوب في الماء الساخن.", a: false },
  { q: "قارة إفريقيا هي الأكبر مساحة.", a: false },
  { q: "اللغة الإسبانية أكثر انتشارًا من اللغة الإنجليزية.", a: false },
  { q: "الخفاش من الثدييات.", a: true },
  { q: "أول جهاز كمبيوتر صنع في القرن العشرين.", a: true },
  { q: "الفيروسات كائنات حية.", a: false },
  { q: "اليابان تقع في قارة آسيا.", a: true },
  { q: "السمك لا ينام أبدًا.", a: false },
  { q: "القرآن نزل على النبي في مكة والمدينة.", a: true },
  { q: "الألماس أقوى مادة طبيعية على الأرض.", a: true },
  { q: "القمر أقرب إلى الأرض من الشمس.", a: true },
  { q: "الطائرة اخترعها الأخوان رايت.", a: true },
  { q: "الأكسجين يشكل 78٪ من الغلاف الجوي.", a: false },
  { q: "الإنسان يملك 206 عظمة في جسمه.", a: true },
  { q: "مصر تطل على البحر الأحمر فقط.", a: false },
  { q: "الإنترنت اخترع في أمريكا.", a: true },
  { q: "أصغر قارة في العالم هي أستراليا.", a: true },
  { q: "عدد قلوب الأخطبوط ثلاثة.", a: true },
  { q: "الحديد أثقل من الرصاص.", a: false },
  { q: "جبل إيفرست يقع في الهند.", a: false },
  { q: "سنة الكبيسة تتكرر كل 4 سنوات.", a: true },
  { q: "أكبر محيط في العالم هو المحيط الأطلسي.", a: false },
  { q: "الفيل هو أذكى الحيوانات.", a: false },
  { q: "الماء يغلي عند 100 درجة مئوية.", a: true },
  { q: "أقرب نجم إلى الأرض هو الشمس.", a: true },
  { q: "القهوة تحتوي على فيتامين C.", a: false },
  { q: "قارة أوروبا تضم دولة روسيا.", a: true },
  { q: "الثلج أخف من الماء.", a: true }
];

let activeGames = {};

const handler = async (m, { conn, command }) => {
  const id = m.chat;

  if (command === "صحولا") {
    if (activeGames[id]) {
        return conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_لا يزال هناك سؤال لم يحل بعد!_* ⏳\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
    }

    const q = questions[Math.floor(Math.random() * questions.length)];
    activeGames[id] = { question: q, askedBy: m.sender };

    const buttons = [
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({ display_text: "✅ صح", id: `.اجابة_صح` }),
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({ display_text: "❌ خطأ", id: `.اجابة_خطأ` }),
      },
    ];

    const message = generateWAMessageFromContent(
      id,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.create({
              header: proto.Message.InteractiveMessage.Header.create({
                hasMediaAttachment: false,
                title: `.𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥\n⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️\n𝐵𝑦 𝐶𝑟𝑎𝑧𝑦\n\n╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *هل العبارة التالية صحيحة؟* 🤔\n│ \n│ ⌬ \`\`\`${q.q}\`\`\`\n╯───≪ 🫐🪻🧩 ≫───╰`,
              }),
              body: proto.Message.InteractiveMessage.Body.create({ text: "" }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "🎯 اختر الإجابة الصحيحة من الأزرار 👇",
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

    await conn.relayMessage(id, message.message, { messageId: message.key.id });
  }

  if (command.startsWith("اجابة_")) {
    const answer = command.replace("اجابة_", "").trim();
    const game = activeGames[id];
    if (!game) return conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_لا توجد لعبة نشطة الآن 📯📍_* \n╯───≪ 🫐🪻🧩 ≫───╰`, m);

    const correct = (answer === "صح" && game.question.a) || (answer === "خطأ" && !game.question.a);

    if (correct) {
        await conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_إجابة صحيحة مبروك ✨✅_* \n│ 💰 *أحسنت يا بطل*\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
    } else {
        await conn.reply(m.chat, `╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮\n│ ⌬ *_إجابة خاطئة للأسف 🛠️❌_* \n│ 💡 *الجواب الصح هو:* ${game.question.a ? "✅ صح" : "❌ خطأ"}\n╯───≪ 🫐🪻🧩 ≫───╰`, m);
    }

    delete activeGames[id];
  }
};

handler.help = ['صحولا'];
handler.tags = ['العاب'];
handler.command = /^(صحولا|اجابة_صح|اجابة_خطأ)$/i;
export default handler;