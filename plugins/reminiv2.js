// Instagram: 𝐶𝑟𝑎𝑧𝑦_ouafy
// https://xyro.site/
import axios from 'axios';
import FormData from 'form-data';
import { channelButton } from '../system/buttons.js'

let handler = async (m, { conn, command, quoted, prefix, usedPrefix, text }) => {
  let q = quoted ? quoted : m;
  let mime = (q.msg || q).mimetype || '';

  // Check if the message contains an image
  if (!/image\/(jpe?g|png)/.test(mime)) {
    return m.reply(`Send or reply to an image with the caption *${usedPrefix + command}*`);
  }

  // Wait message
  await m.reply("⏳ Please wait a moment... \ninstagram.com/𝐶𝑟𝑎𝑧𝑦_ouafy");

  try {
    // Download image
    const media = await q.download();

    // Prepare form data
    const form = new FormData();
    form.append('image', media, {
      filename: 'image.jpg',
      contentType: mime
    });

    // Send to API
    const { data: upscaledBuffer } = await axios.post(
      'https://xyro.site/ai/upscaler',
      form,
      {
        headers: form.getHeaders(),
        responseType: 'arraybuffer'
      }
    );

    // Send result
    await conn.sendMessage(
      m.chat,
      {
        image: upscaledBuffer,
        caption: '✅ Image successfully upscaled',
        footer: '『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』',
        buttons: channelButton()},
      { quoted: m }
    );

  } catch (e) {
    console.error('[UPSCALE ERROR]', e);
    m.reply('❌ An error occurred while processing the image!');
  }
};

handler.help = ['تحسين-صور2'];
handler.tags = ['tools'];
handler.command = /^(تحسين-صور2)$/i;
handler.limit = true
export default handler;
