// م࣬ــࢪحہּٰـبٚأ بٚـڪٰٖ فَــي أوٰأم࣬ـࢪ بيثو ؍ 🌸♡゙ ُ𓂁
// حہּٰقَــــوٰقَ 𝐶𝑟𝑎𝑧𝑦 💻🔥
// أسٰـم࣬ أݪأم࣬ــࢪ حفظ-جهة-اتصال.js

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // التأكد من أن المستخدم هو المطور
  if (!global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)) {
    return conn.reply(m.chat, '❌ هذا الأمر خاص بالمطور فقط.', m);
  }

  // إذا كان الأمر "عرض" أو "list"
  if (command === 'جهاتي' || (text && text.trim().toLowerCase() === 'list')) {
    let contacts = global.db.data.contacts || {};
    let list = Object.entries(contacts)
      .map(([number, name]) => `• ${name} : +${number}`)
      .join('\n');
    if (!list) list = 'لا توجد جهات اتصال محفوظة.';
    return conn.reply(m.chat, `📒 *جهات الاتصال المحفوظة:*\n${list}`, m);
  }

  // تنسيق المدخلات: الرقم والاسم
  let args = text.trim().split(/\s+/);
  if (args.length < 2) {
    return conn.reply(m.chat, `📌 *الاستخدام:*\n➤ حفظ: ${usedPrefix + command} <الرقم> <الاسم>\n➤ عرض: ${usedPrefix}جهاتي\nمثال:\n${usedPrefix + command} 201214057674 𝐶𝑟𝑎𝑧𝑦`, m);
  }

  let phoneNumber = args[0].replace(/[^0-9]/g, '');
  let name = args.slice(1).join(' ');

  if (!phoneNumber || phoneNumber.length < 8) {
    return conn.reply(m.chat, '❌ الرقم غير صالح.', m);
  }

  // حفظ في قاعدة البيانات
  if (!global.db.data.contacts) global.db.data.contacts = {};
  global.db.data.contacts[phoneNumber] = name;

  // إرسال vCard (جهة اتصال وهمية) للمستخدم ليتمكن من حفظها على هاتفه إذا أراد
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;waid=${phoneNumber}:${phoneNumber}
END:VCARD`;

  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: name,
      contacts: [{ vcard }]
    }
  }, { quoted: m });

  await conn.reply(m.chat, `✅ تم حفظ الرقم *${phoneNumber}* باسم *${name}* في قاعدة بيانات البوت.\nيمكنك استخدامه لاحقاً.`, m);
};

handler.help = ['حفظ-جهة <رقم> <اسم>', 'جهاتي'];
handler.tags = ['owner'];
handler.command = /^(حفظ-جهة|savecontact|جهاتي)$/i;
handler.owner = true;

export default handler;