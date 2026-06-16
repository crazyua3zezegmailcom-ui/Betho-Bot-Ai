import fs from 'fs';

const handler = async (m, { text, usedPrefix, command, conn }) => {
  if (!text) throw `🤔 احم....اسمي الامر االرد؟`;

  const path = `plugins/${text}.js`;

  if (command === 'ضيف' || command === 'addp' || command === 'addplugin') {
    if (!m.quoted || !m.quoted.text) throw `رد علي الرساله عشان احفظها يعم `;

    await fs.writeFileSync(path, m.quoted.text);

    m.reply(`✅ تم الحفظ باسم ${path} بنجاح!`);
  } else if (command === 'امسح') {
    if (!fs.existsSync(path)) throw `❌ الملف "${path}" مش موجوده عشان امسحها يحبيبي !`;

    fs.unlinkSync(path);

    m.reply(`🗑️ تم حذف الملف ${path} بنجاح!`);
  }
};

handler.help = ['saveplugin', 'deleteplugin'].map((v) => v + ' <nombre>');
handler.tags = ['owner'];
handler.command = ['ضيف', 'addp', 'addplugin', 'امسح'];
handler.rowner = true;

export default handler;