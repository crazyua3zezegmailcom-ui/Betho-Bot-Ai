import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const myCredit = `*_ .𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 _*`;
  const emojis = `𝐵𝑦 𝐶𝑟𝑎𝑧𝑦  👑`;

  try {
    const query = text ? text.trim() : '';

    if (!query) {
      return m.reply(
     `╭───≪  𝑷𝑳𝑨𝒀🎶≫───╮\n` +
        `│ ⌬ اح 🫠 نسيت تكتب حاجه!\n` +
        `│ ⌬ هات اسم الأغنية\n` +
        `│ ⌬ مثال: ${usedPrefix + command} صوت الخروف بينبح\n` +
        `╰───≪ 🫐🪻🧩 ≫───╯\n\n` +
        `${myCredit}`
      );
    }

    await conn.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

    if (query.length > 100) {
      return m.reply(`*_ احم ❌ اي يعم انت طالب اوردر بيتزا ! الحد الأقصى 100 حرف. _*`);
    }

    const response = await fetch(`https://api.nexray.web.id/downloader/ytplay?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (!data.status || !data.result?.download_url) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
      return m.reply(`*_ احم ❌ ملقتش نتائج لـ: "${query}" _*`);
    }

    const result     = data.result;
    const audioUrl   = result.download_url;
    const filename   = result.title    || 'Unknown Song';
    const thumbnail  = result.thumbnail || '';
    const duration   = result.duration  || '';
    const views      = result.views     || '';
    const channel    = result.channel   || '';

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      fileName: `${filename}.mp3`,
      contextInfo: thumbnail ? {
        externalAdReply: {
          title: filename,
          body: `Duration: ${duration} • Views: ${views}`,
          thumbnailUrl: thumbnail,
          sourceUrl: result.url || '',
          mediaType: 1,
          showAdAttribution: true,
          renderLargerThumbnail: true,
        },
      } : undefined,
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      document: { url: audioUrl },
      mimetype: 'audio/mpeg',
      fileName: `${filename.replace(/[<>:"/\\|?*]/g, '_')}.mp3`,
      caption:
        `╭───≪ 🎶 𝑩𝑬𝑻𝑯𝑶 𝑴𝑼𝑺𝑰𝑪 🎶≫───╮\n` +
        `│ ⌬ اسـم الأغـنـيـة: ${filename}\n` +
        `│ ⌬ الـمـدة: ${duration}\n` +
        `│ ⌬ الـمـشاهـدات: ${views}\n` +
        `│ ⌬ الـقـنـاة: ${channel}\n` +
        `╯───≪ 🫐🪻🧩 ≫───╰\n\n` +
        `${emojis}\n\n${myCredit}`
    }, { quoted: m });

  } catch (error) {
    console.error('Play error:', error);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await m.reply(`*_ احم ❌ وقع خطأ أثناء المعالجة: ${error.message} _*`);
  }
};

handler.help = ['اغنيه'];
handler.tags = ['search'];
handler.command = /^(اغنيه|اغنية)$/i;

export default handler;