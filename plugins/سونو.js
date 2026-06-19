/**
 * 🎵 Sonu — AI Music Generator (⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 )
 * ⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓
 */

import fetch from 'node-fetch'

const API = 'https://omegatech-api.dixonomega.tech/api/ai/sonu3'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.sendMessage(
      m.chat,
      {
        text:
          `🎵 *سـونـو - صـانـع الـمـوسـيـقـى (AI)*\n` +
          `_قـم بـتـولـيـد أغـنـيـة كـامـلـة مـن أي وصـف_\n\n` +
          `*💡 الاسـتـخـدام:*\n` +
          `${usedPrefix + command} <وصف الأغنية>\n\n` +
          `*⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲𝜣 𝑩𝜣𝑻🍓*`,
      },
      { quoted: m }
    )
  }

  await m.react('🎵')
  await conn.sendPresenceUpdate('recording', m.chat)
  
  await conn.sendMessage(
    m.chat, 
    { text: `🎵 *جـاري تـولـيـد أغـنـيـتـك الـخـاصـة...*\n_قـد يـسـتـغـرق الأمـر حـوالي 90 ثـانـيـة._` }, 
    { quoted: m }
  )

  try {
    const res  = await fetch(`${API}?action=full&prompt=${encodeURIComponent(text.trim())}`)
    const data = await res.json()

    if (!data.success || !data.url) {
      await m.react('❌')
      return conn.sendMessage(m.chat, { text: '❌ *فـشـل تـولـيـد الـمـوسـيـقـى. حـاول مـرة أخرى لاحـقاً.*' }, { quoted: m })
    }

    const title    = data.title    || 'أغنية الذكاء الاصطناعي'
    const tags     = data.tags     || 'موسيقى ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥'
    const duration = data.duration || 0
    const mins     = Math.floor(duration / 60)
    const secs     = String(duration % 60).padStart(2, '0')
    const lyrics   = data.lyrics ? data.lyrics.slice(0, 500) + '...' : 'لا توجد كلمات'

    // 1. إرسال الصورة (البوستر) مع الكابتشن المنسق
    const caption = `
🎵 *الـعنوان:* ${title}

المـده 🍡 : ${mins}:${secs}
الٓـنوع 🍒 : ${tags}
كـلمات 🍍 : 
${lyrics}

.𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓`.trim()

    if (data.thumbnail) {
        await conn.sendMessage(m.chat, { 
            image: { url: data.thumbnail }, 
            caption: caption 
        }, { quoted: m })
    }

    // 2. إرسال ملف الأغنية (Audio)
    await conn.sendMessage(
      m.chat,
      {
        audio:    { url: data.url },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`,
        ptt:      false
      },
      { quoted: m }
    )

    await m.react('✅')

  } catch (e) {
    console.error('Sonu error:', e.message)
    await m.react('❌')
    await conn.sendMessage(m.chat, { text: '❌ *حـصـل خـطأ غـيـر مـتـوقـع. حـاول مـرة أخـرى.*' }, { quoted: m })
  }
}

handler.command     = ['سونو', 'sonu']
handler.help        = ['سونو <الوصف>']
handler.tags        = ['ai']

export default handler