import { channelButton } from '../system/buttons.js'
const handler = async (m, { conn, text }) => {
  if (!text) return m.reply("Example: .bratpro Betho Bot");

  try {
    const caption = `Please choose the desired type:\n\n1. *Image 🖼️*\n2. *Video 🎥*`;
    await conn.sendMessage(
      m.chat,
      {
        text: caption,
        footer: "Betho Bot ~ By Moureddine ouafy",
        buttons: [
          {
            buttonId: `.brat ${text}`,
            buttonText: { displayText: "Image 🖼️" },
          },
          {
            buttonId: `.bratvideo ${text}`,
            buttonText: { displayText: "Video 🎥" },
          },
        ],
        viewOnce: true,
      },
      { quoted: m }
    );
  } catch (err) {
    console.error(err);
    m.reply(`*An error occurred!* 😭\n${err.message || err}`);
  }
};

handler.help = ["برات-برو"];
handler.tags = ["sticker"];
handler.command = ["برات-برو"];
handler.limit = true;

export default handler;
