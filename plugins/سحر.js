const handler = async (m, { conn }) => {
  const chat = m.chat;

  const groupMeta = await conn.groupMetadata(chat);
  const participants = groupMeta.participants;

  // ─── جيب العضو عن طريق المنشن أو الريبلاي ───
  let mentioned = null;
  if (m.mentionedJid?.[0]) {
    mentioned = m.mentionedJid[0];
  } else if (m.quoted) {
    mentioned = m.quoted.sender || m.quoted.participant;
  }

  if (!mentioned) {
    return m.reply('❌ عمل منشن على العضو أو ريبلاي على رسالته');
  }

  // ─── تأكد إن العضو موجود في المجموعة ───
  const mentionedRaw = mentioned.split(':')[0].split('@')[0];
  const targetParticipant = participants.find(p =>
    p.id.split(':')[0].split('@')[0] === mentionedRaw
  );
  if (!targetParticipant) {
    return m.reply('❌ العضو ده مش في المجموعة');
  }

  // ─── منع طرد الأدمن ───
  if (['admin', 'superadmin'].includes(targetParticipant.admin)) {
    return m.reply('❌ مينفعش تطرد أدمن');
  }

  // ─── الرسائل الخمسة ───
  const messages = [
    '*_اعزائي المشاهدين في كل بيت🌝 اعزائي المشاهدين في كل مكان🌚 _*',
    '*_السلام عليكم ورحمة الله وبركاتة وصباحكم لذيذ😊 ومسائكم تعيس🐦_*',
    '*_وقبل ما نبدأ ونقول احب اقولكو صلو علي الرسول💕_*',
    '*_معانا النهارده العضو الشقي الخطير 😇_*',
    '*_الي معانا النهارده هيختفي ويطير 🤡_*',
  ];

  for (const msg of messages) {
    await conn.sendMessage(chat, { text: msg, mentions: [mentioned] });
    await new Promise(r => setTimeout(r, 300));
  }

  // ─── اطرد العضو ───
  try {
    await conn.groupParticipantsUpdate(chat, [targetParticipant.id], 'remove');
  } catch {
    return m.reply('❌ تعذّر طرد العضو — تأكد إن البوت مشرف');
  }

  await conn.sendMessage(chat, { text: '*_تراراااا ✨_*' });
};

handler.command  = ['سحر'];
handler.usage    = ['سحر'];
handler.category = 'admin';
handler.group    = true;
handler.admin    = true;
handler.botAdmin = true;

export default handler;
