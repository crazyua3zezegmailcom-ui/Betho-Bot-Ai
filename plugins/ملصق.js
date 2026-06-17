import { createSticker } from '../system/utils.mjs';
import { runConcurrent, showTyping } from '../system/perf.mjs';

const handler = async (m, { conn }) => {
  if (!m.quoted) return m.reply('❤️ ~ يرجى الرد على صورة أو فيديو لتحويله إلى ملصق ~ 💙');

  await m.react('⏳');
  await showTyping(conn, m.chat);

  runConcurrent(m.sender, m.chat, async () => {
    try {
      const pack   = global.botname  || 'BETHO BOT';
      const author = global.author   || 'Crazy Dev';
      const q      = m.quoted;
      const buffer = await createSticker(await q.download(), { mime: q.mimetype, pack, author });

      await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m });

      await m.react('✅');
    } catch (err) {
      console.error('[ملصق]', err);
      await m.react('❌');
      await m.reply('❌ تعذّر إنشاء الملصق — جرّب مرة ثانية');
    }
  }, conn);
};

handler.usage    = ['ملصق'];
handler.command  = /^(ملصق|s|sticker)$/i;
handler.category = 'sticker';
export default handler;
