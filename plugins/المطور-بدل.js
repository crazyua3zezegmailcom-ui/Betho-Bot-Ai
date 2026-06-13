// م࣬ــࢪحہּٰـبٚأ بٚـڪٰٖ فَــي أوٰأم࣬ـࢪ ۿأݪــڪٰٖي ؍ 🌸♡゙ ُ𓂁
// أوٰأم࣬ــࢪ م࣬ٺم࣬يــژۿ . ⊹
// حہּٰقَــــوٰقَ 𝒎𝒐𝒏𝒕𝒆 𝒅𝒆𝒗 🐦☕
// أݪــسٰࢪقَــۿ ݪأ ٺــفَـيډڪٰٖ يم࣬غٰــفَݪ
// أسٰـم࣬ أݪأم࣬ــࢪ المطور-بدل.js
// ٺـأࢪيخَ صَـنٰأـ؏ٚـۿ أݪــبٚوٰٺ ؍ 🌸♡゙ ُ𓂁 2024_9_22
// ࢪأبٚــطَ قَنٰــأۿ أݪم࣬ــطَــوٰࢪ ..)✘🖤🧸.
// https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e

import fs from 'fs';
import path from 'path';

// قائمة الأرقام المسموح لها بالتنفيذ
const allowedNumbers = [
  '15877004085@s.whatsapp.net',
  '201201756710@s.whatsapp.net'
];

const handler = async (m, { conn, text }) => {
  const emoji = '🍷️';
  const signature = '𝓗𝓤𝓛𝓚 𝓑𝓞𝓣 🍷️';

  if (!allowedNumbers.includes(m.sender)) {
    await conn.sendMessage(m.chat, { text: `${emoji} ❌ غير مسموح لك باستخدام هذا الأمر.\n\n${signature}` }, { quoted: m });
    return;
  }

  if (!text || !text.includes('|')) {
    await conn.sendMessage(m.chat, {
      text: `${emoji} ⚠️ يرجى كتابة الأمر بالشكل التالي:\n\n*.بدل الكلمة_القديمة|الكلمة_الجديدة*\n\n${signature}`
    }, { quoted: m });
    return;
  }

  const [oldWord, newWord] = text.split('|').map(s => s.trim());

  if (!oldWord || !newWord) {
    await conn.sendMessage(m.chat, {
      text: `${emoji} ⚠️ تأكد من أنك أدخلت الكلمتين بشكل صحيح (قديم|جديد).\n\n${signature}`
    }, { quoted: m });
    return;
  }

  const basePath = 'plugins';
  const files = fs.readdirSync(basePath).filter(file => file.endsWith('.js'));
  let changedFiles = 0;
  let errors = [];

  for (let file of files) {
    const filePath = path.join(basePath, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      if (content.includes(oldWord)) {
        const newContent = content.split(oldWord).join(newWord);
        fs.writeFileSync(filePath, newContent, 'utf-8');
        changedFiles++;
      }
    } catch (err) {
      errors.push({ file, error: err.message });
    }
  }

  let message = `${emoji} ✅ تم استبدال "${oldWord}" بـ "${newWord}" في ${changedFiles} ملف/ملفات.\n`;
  if (errors.length > 0) {
    message += `\n${emoji} ⚠️ حدثت أخطاء في بعض الملفات:\n`;
    errors.forEach(({ file, error }) => {
      message += `- الملف: ${file}\n  الخطأ: ${error}\n`;
    });
  }
  message += `\n${signature}`;

  await conn.sendMessage(m.chat, { text: message }, { quoted: m });
};

handler.help = ['بدل *<قديم>|<جديد>*'];
handler.tags = ['owner'];
handler.command = /^بدل$/i;
handler.owner = true;

export default handler;