import axios from 'axios';

// ذاكرة التخزين المؤقتة للحفاظ على سياق المحادثة
let memory = {};

const handler = async (m, { conn, command, text }) => {
  const userId = m.sender;
  const userName = m.pushName || "صديقي";

  // أمر نسيان الذاكرة
  if (command === 'نسيان' || command === 'حذف_ذاكرة_بيثو') {
    delete memory[userId];
    return m.reply('🌸 نيهيهي.. نسيت كل شيء! لنبدأ من جديد ✨');
  }

  // إذا لم يكتب المستخدم شيئاً (الرسالة الترحيبية بزخرفة غوكو)
  if (!text) {
    return m.reply(
`╮━─━─━─≪🌸≫─━─━─━╭
مـرًحـبا 🎀 ${userName}
أنـا نـيـزوكـو الـكـيـوت 🍡

تـحـب تـسـولـف مـعـي؟ 😏🌸
أو اسـتـخـدم بـاقي أوامـري 🎀🌹
╯━─━─━─≪🌸≫─━─━─━╰`
    );
  }

  // رسالة الصلاة على النبي بزخرفة غوكو
  await m.reply(
`☽⚝ͫ͢❏ِꏍ﴿ۦٕۛ۬٭🌸ْۦٕۛ۬❏ِ  ﷽⎆☽⚝ͫ͢❏ِꏍ🍡ﭕ﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ
🌸❤️صَــݪــي ـ؏ٚــݪـێ أݪـࢪسٰـوٰݪ 
يا
${userName}
☽⚝ͫ͢❏ِꏍ﴿ۦٕۛ۬٭🌸ْۦٕۛ۬❏ِ  ﷺ⎆☽⚝ͫ͢❏ِꏍ🍡ﭕ﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ`
  );

  await conn.sendMessage(m.chat, { react: { text: "🌸", key: m.key } });

  try {
    // تعليمات الشخصية المدمجة مع إضافة معلومات المطورين
    const systemMessage = `أنتِ بيثو 🎀. بنوتة كيوته، لطيفة، ومرحة. ردودك قصيرة ومختصرة. تحبين الإيموجيات (🌸, 🎀, 🍡). مطورينك هم (𝐶𝑟𝑎𝑧𝑦)، إذا سألك أحد من مطورك أو من صنعك أخبريهم أنهم 𝐶𝑟𝑎𝑧𝑦.`;
    const lastContext = memory[userId] || "لا يوجد";
    
    const promptText = `System:${systemMessage}\nPrevious:${lastContext}`;

    // استدعاء API Obito
    const apiUrl = `https://obito-mr-apis.vercel.app/api/ai/cai?prompt=${encodeURIComponent(promptText)}&text=${encodeURIComponent(text)}`;
    const res = await axios.get(apiUrl, { timeout: 15000 });

    const result = res.data?.result || res.data?.response || res.data?.data || "بيثو ناعسة.. 😴";

    // الرد النهائي بالزخرفة
    await m.reply(
`☽⚝ͫ͢❏ِꏍ﴿ۦٕۛ۬٭🍡ْۦٕۛ۬❏ِ  ﷽⎆☽⚝ͫ͢❏ِꏍ🍡ﭕ﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ
جهـزت الرد يـعـسـل 🎀 ${userName}  

${result}

—  
تحب نكمل؟ 😌  
ولا نغيّر ݪـي أوٰأم࣬ـــࢪ ٺأنٰيــِۃ؟ 🌸
☽⚝ͫ͢❏ِꏍ﴿ۦٕۛ۬٭🍡ْۦٕۛ۬❏ِ  ﷽⎆☽⚝ͫ͢❏ِꏍ🍡ﭕ﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ`
    );

    // حفظ السياق في الذاكرة
    memory[userId] = result.substring(0, 150);

  } catch (e) {
    console.error(e);
    await m.reply(
`╮━─━─━─≪❌≫─━─━─━╭
هـمـم 🤕
مـخـي عـلّـق شـوي  
جـرّب تـسـألـي مـرة ثـانـيـة 🎀
╯━─━─━─≪❌≫─━─━─━╭`
    );
  }
};

handler.help = ['بيثو', 'نسيان'];
handler.tags = ['AI'];
handler.command = /^(بيثو|betho|ai|نسيان|حذف_ذاكرة_بيثو)$/i;

export default handler;