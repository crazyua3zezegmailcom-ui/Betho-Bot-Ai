// م࣬ــࢪحہּٰـبٚأ بٚـڪٰٖ فَــي أوٰأم࣬ـࢪ ۿأݪــڪٰٖي ؍ 🌸♡゙ ُ𓂁
// أوٰأم࣬ــࢪ م࣬ٺم࣬يــژۿ . ⊹
// حہּٰقَــــوٰقَ 𝒎𝒐𝒏𝒕𝒆 𝒅𝒆𝒗 🐦☕
// أݪــسٰࢪقَــۿ ݪأ ٺــفَـيډڪٰٖ يم࣬غٰــفَݪ
// أسٰـم࣬ أݪأم࣬ــࢪ افحص-كلمه.js
// ٺـأࢪيخَ صَـنٰأـ؏ٚـۿ أݪــبٚوٰٺ ؍ 🌸♡゙ ُ𓂁 2024_9_22
// ࢪأبٚــطَ قَنٰــأۿ أݪم࣬ــطَــوٰࢪ ..)✘🖤🧸.
// https://whatsapp.com/channel/0029Vb7AkG84inotOc8BXE1K

import fs from 'fs';
import path from 'path';

const pluginsDir = './plugins';

let handler = async (m, { text }) => {
  if (!text) return m.reply('🏦 ⇦ ≺أكتب الكلمة أو الجملة التي تريد البحث عنها بعد الأمر.≺\n\nمثال:\n.افحص-كلمه بنك');

  try {
    let files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js'));
    let results = [];

    for (let file of files) {
      let filePath = path.join(pluginsDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let lines = content.split('\n');

      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(text.toLowerCase())) {
          results.push(`🧊 *الملف:* ${file}\n📍 *السطر:* ${index + 1}\n💬 ${line.trim()}`);
        }
      });
    }

    if (results.length === 0)
      return m.reply(`🏦 ⇦ ≺لم يتم العثور على "${text}" في أي ملف من ملفات البلوجنز.≺`);

    let replyMsg = `🍎 ⇦ ≺نتائج البحث عن "${text}":≺\n\n` + results.join('\n\n');
    if (replyMsg.length > 4000)
      replyMsg = replyMsg.slice(0, 3990) + '\n\n🧊 ≺النتائج كثيرة، تم قطعها هنا.≺';

    m.reply(replyMsg);
  } catch (err) {
    console.error(err);
    m.reply('🏦 ⇦ ≺حدث خطأ أثناء البحث عن الكلمة!≺');
  }
};

handler.command = /^(كشف)$/i;
handler.owner = true
export default handler;