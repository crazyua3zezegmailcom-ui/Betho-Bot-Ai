import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'

const execAsync = promisify(exec)

const HEADER = `*•.¸♡¸.•**•.¸♡¸.•**•.¸♡¸.•**•.¸♡¸.•*
·͙⁺˚*•̩̩͙✩•̩̩͙*˚⁺‧͙·͙⁺˚*•̩̩͙✩•̩̩͙*˚⁺‧͙
꙰۪۫•°•❁•°•꙰۪۫•°•❁•°•꙰۪۫•°•❁•°•꙰۪۫
✨🌌 ╔══「 المطور 」══╗ 🌌✨
        ║  👑 Developer Info  ║
✨🌌 ╚══════════════════════╝ 🌌✨
꙰۪۫•°•❁•°•꙰۪۫•°•❁•°•꙰۪۫•°•❁•°•꙰۪۫
·͙⁺˚*•̩̩͙✩•̩̩͙*˚⁺‧͙·͙⁺˚*•̩̩͙✩•̩̩͙*˚⁺‧͙
*•.¸♡¸.•**•.¸♡¸.•**•.¸♡¸.•**•.¸♡¸.•*`

const FOOTER = `*•.¸♡¸.•**•.¸♡¸.•**•.¸♡¸.•**•.¸♡¸.•*
·͙⁺˚*•̩̩͙✩•̩̩͙*˚⁺‧͙·͙⁺˚*•̩̩͙✩•̩̩͙*˚⁺‧͙
꙰۪۫•°•❁•°•꙰۪۫•°•❁•°•꙰۪۫•°•❁•°•꙰۪۫
✨🌌 ~ 『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』 ~ 🌌✨
꙰۪۫•°•❁•°•꙰۪۫•°•❁•°•꙰۪۫•°•❁•°•꙰۪۫
·͙⁺˚*•̩̩͙✩•̩̩͙*˚⁺‧͙·͙⁺˚*•̩̩͙✩•̩̩͙*˚⁺‧͙
*•.¸♡¸.•**•.¸♡¸.•**•.¸♡¸.•**•.¸♡¸.•*`

async function convertToOggOpus(inputBuffer) {
  const tmpIn  = path.join(tmpdir(), `voice_in_${Date.now()}.mp3`)
  const tmpOut = path.join(tmpdir(), `voice_out_${Date.now()}.ogg`)
  try {
    fs.writeFileSync(tmpIn, inputBuffer)
    await execAsync(
      `ffmpeg -y -i "${tmpIn}" -c:a libopus -b:a 64k -ar 48000 -ac 1 "${tmpOut}"`
    )
    return fs.readFileSync(tmpOut)
  } finally {
    if (fs.existsSync(tmpIn))  fs.unlinkSync(tmpIn)
    if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut)
  }
}

let handler = async (m, { conn }) => {
  const devName  = '𝐶𝑟𝑎𝑧𝑦'
  const devNum   = '201214057674'
  const voiceUrl = 'https://media1.vocaroo.com/mp3/1m9sSiyVOX0B'
  const img      = 'https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg'

  const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${devName}\nTEL;type=CELL;waid=${devNum}:+${devNum}\nEND:VCARD`

  const caption = `${HEADER}

👑 اسم المطور : ${devName}

📱 رقم التواصل : +${devNum}

🔗 قناة البوت:
https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e

💬 جروب الدعم:
https://chat.whatsapp.com/JNUcrtcQjPGJpKoW78dkEc

${FOOTER}`

  await Promise.all([
    conn.sendMessage(m.chat, {
      image: { url: img },
      caption,
      mentions: [`${devNum}@s.whatsapp.net`]
    }, { quoted: m }),
    conn.sendMessage(m.chat, {
      contacts: {
        displayName: devName,
        contacts: [{ vcard }]
      }
    }, { quoted: m })
  ])

  try {
    const res = await fetch(voiceUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://vocaroo.com/'
      }
    })
    let mp3Buffer = Buffer.from(await res.arrayBuffer())
    let oggBuffer = await convertToOggOpus(mp3Buffer)
    mp3Buffer = null

    await conn.sendMessage(m.chat, {
      audio: oggBuffer,
      mimetype: 'audio/ogg; codecs=opus',
      ptt: true
    }, { quoted: m })

    oggBuffer = null
  } catch (e) {
    console.error('Voice error:', e.message)
  }
}

handler.help    = ['معلومات-المالك']
handler.tags    = ['infobot']
handler.command = /^(owner|مطور|المطور|مالك|المالك|معلومات-المالك)$/i
handler.bot     = false

export default handler
