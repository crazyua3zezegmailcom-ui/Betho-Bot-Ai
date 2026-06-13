import { channelButton } from '../system/buttons.js'
let handler = async (m, { conn, text, usedPrefix, command }) => {
  const sgc = "https://chat.whatsapp.com/JNUcrtcQjPGJpKoW78dkEc";

  const message = {
    text: `انضم إلى جروب الدعم الرسمي: *[ ${sgc} ]*`,
  };

  await conn.sendMessage(m.chat, message, { quoted: m });
};

handler.help = ["بوت-المجموعة"];
handler.tags = ["tools"];
handler.command = ["بوت-المجموعة"];
handler.limit = true
export default handler;
