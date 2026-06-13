// instagram.com/𝐶𝑟𝑎𝑧𝑦_ouafy
/**
 * Plugin: .sc
 * Description: إرسال روابط السورس كود والقناة الرسمية
 */

let handler = async (m, { conn }) => {
  const teks = `📦 *رابط السورس كود الخاص بالبوت:*\n` +
    `https://github.com/𝐶𝑟𝑎𝑧𝑦ouafy/betho-lite-ofc\n\n` +
    `📢 *القناة الرسمية على واتساب:*\n` +
    `https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e\n\n` +
    `⭐ لا تنسَ وضع نجمة على المستودع إذا أعجبك المشروع!`;

  await conn.reply(m.chat, teks, m);
};

handler.help = handler.command = ['سكريبت2','سكريبت'];
handler.tags = ['tools'];
handler.limit = true;
export default handler;
