// حہّٰقَـــوٰقَ 𝐶𝑟𝑎𝑧𝑦 💻🔥
// أمر فنش — ينزل كل المشرفين ويقفل الجروب (للمطور فقط)

const handler = async (m, { conn }) => {
  const from = m.chat;

  if (!m.isGroup) return m.reply('❌ *هذا الأمر يعمل في الجروبات فقط*');

  const botId     = conn.user.id.split(':')[0] + '@s.whatsapp.net';
  const senderId  = m.sender;

  // ─── جلب معلومات الجروب ───
  let metadata;
  try {
    metadata = await conn.groupMetadata(from);
  } catch {
    return m.reply('❌ *فشل جلب بيانات الجروب، تأكد أن البوت مشرف!*');
  }

  const participants = metadata.participants;
  const admins = participants
    .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
    .map(p => p.id);

  const senderIsAdmin = admins.includes(senderId);

  await conn.sendMessage(from, {
    text: '*🔴 جاري تنفيذ أمر فنش...*'
  });

  // ─── لو المطور مش أدمن، رقّيه أدمن الأول ───
  if (!senderIsAdmin) {
    try {
      await conn.groupParticipantsUpdate(from, [senderId], 'promote');
      await new Promise(r => setTimeout(r, 1000));
    } catch {
      await conn.sendMessage(from, {
        text: '⚠️ *فشل ترقية المطور — تأكد إن البوت أدمن*'
      });
    }
  }

  // ─── إعفاء كل الأدمن عدا البوت والمطور ───
  const tosDemote = admins.filter(id => id !== botId && id !== senderId);

  if (tosDemote.length > 0) {
    for (const adminId of tosDemote) {
      try {
        await conn.groupParticipantsUpdate(from, [adminId], 'demote');
        await new Promise(r => setTimeout(r, 800));
      } catch {}
    }
  }

  // ─── قفل الجروب ───
  try {
    await conn.groupSettingUpdate(from, 'announcement'); // فقط الأدمن يكتبون
  } catch {}

  try {
    await conn.groupSettingUpdate(from, 'locked'); // تعديل المعلومات للأدمن فقط
  } catch {}

  // ─── رسالة النهاية ───
  const demotedMentions = tosDemote;
  const demotedList = tosDemote.length > 0
    ? tosDemote.map(id => `• @${id.split('@')[0]}`).join('\n')
    : '• لا يوجد مشرفين آخرين';

  await conn.sendMessage(from, {
    text:
      `╔══════════════════╗\n` +
      `║   🔒 *تم تنفيذ فنش* 🔒   ║\n` +
      `╚══════════════════╝\n\n` +
      `✅ *تم إعفاء المشرفين التاليين:*\n${demotedList}\n\n` +
      `🔒 *الجروب مقفول — الكتابة للأدمن فقط*`,
    mentions: demotedMentions
  });
};

handler.help    = ['فنش'];
handler.tags    = ['owner'];
handler.command = /^(فنش|finish)$/i;
handler.owner   = true;
handler.group   = true;
handler.botAdmin = true;

export default handler;
