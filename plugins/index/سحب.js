const handler = async (m, { conn }) => {
  const from = m.chat;

  if (!m.isGroup) return m.reply("❌ الأمر للمجموعات فقط");

  await conn.sendMessage(from, { text: "*_تم سحب البار براعايه كريزي ي كسمك وجاري طرد الكل 🫦_*" });

  try {
    await conn.groupUpdateSubject(from, "تم السحب برعاية كريزي ي كسمك 🫦");
  } catch {}

  try {
    await conn.groupUpdateDescription(from, `لينك جروب المطور 🔥👇\nhttps://chat.whatsapp.com/CDa5fFK3mLhHJYMLxHBQey?s=cl&p=a&mlu=1`);
  } catch {}

  try {
    await conn.groupParticipantsUpdate(from, [m.sender], "promote");
  } catch {}

  try {
    let metadata = await conn.groupMetadata(from);
    let participants = metadata.participants;
    let botId = conn.user.id.split(":")[0] + "@s.whatsapp.net";

    for (let participant of participants) {
      if (participant.id !== botId && participant.id !== m.sender) {
        try {
          await conn.groupParticipantsUpdate(from, [participant.id], "remove");
          await new Promise((resolve) => setTimeout(resolve, 800));
        } catch {}
      }
    }
  } catch {}

  try {
    await conn.groupSettingUpdate(from, "announcement");
  } catch {}

  try {
    await conn.groupSettingUpdate(from, "locked");
  } catch {}

  await conn.sendMessage(from, { text: "*_تم سحب الجروب وطرد الجميع بنجاح 🫦_*" });
};

handler.help    = ["سحب"];
handler.tags    = ["owner"];
handler.command = /^(سحب|sahb)$/i;
handler.owner   = true;
handler.group   = true;

export default handler;
