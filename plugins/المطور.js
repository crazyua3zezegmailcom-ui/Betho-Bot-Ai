import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';

const execAsync = promisify(exec);

const HEADER = `*•.¸♡¸.•**•.¸♡¸.•**•.¸♡¸.•**•.¸♡¸.•*
·͙⁺˚*•̩̩͙✩•̩̩͙*˚⁺‧͙·͙⁺˚*•̩̩͙✩•̩̩͙*˚⁺‧͙
꙰۪۫•°•❁•°•꙰۪۫•°•❁•°•꙰۪۫•°•❁•°•꙰۪۫
✨🌌 ╔══「 المطور 」══╗ 🌌✨
        ║  👑 Developer Info  ║
✨🌌 ╚══════════════════════╝ 🌌✨
꙰۪۫•°•❁•°•꙰۪۫•°•❁•°•꙰۪۫•°•❁•°•꙰۪۫
·͙⁺˚*•̩̩͙✩•̩̩͙*˚⁺‧͙·͙⁺˚*•̩̩͙✩•̩̩͙*˚⁺‧͙
*•.¸♡¸.•**•.¸♡¸.•**•.¸♡¸.•**•.¸♡¸.•*`;

const FOOTER = `*•.¸♡¸.•**•.¸♡¸.•**•.¸♡¸.•**•.¸♡¸.•*
·͙⁺˚*•̩̩͙✩•̩̩͙*˚⁺‧͙·͙⁺˚*•̩̩͙✩•̩̩͙*˚⁺‧͙
꙰۪۫•°•❁•°•꙰۪۫•°•❁•°•꙰۪۫•°•❁•°•꙰۪۫
✨🌌 ~ 『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』 ~ 🌌✨
꙰۪۫•°•❁•°•꙰۪۫•°•❁•°•꙰۪۫•°•❁•°•꙰۪۫
·͙⁺˚*•̩̩͙✩•̩̩͙*˚⁺‧͙·͙⁺˚*•̩̩͙✩•̩̩͙*˚⁺‧͙
*•.¸♡¸.•**•.¸♡¸.•**•.¸♡¸.•**•.¸♡¸.•*`;

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

async function fetchWithTimeout(url, timeout = 20000, options = {}) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    clearTimeout(id)
    return res
  } catch (e) {
    clearTimeout(id)
    throw e
  }
}

let handler = async (m, { conn }) => {
  const devName = '𝐶𝑟𝑎𝑧𝑦';
  const num1    = '201214057674';
  const num2    = '201275681011';
  const num3    = '201121605186';

  const vcard1 = `BEGIN:VCARD\nVERSION:3.0\nFN:${devName} ★\nTEL;type=CELL;waid=${num1}:+${num1}\nEND:VCARD`;
  const vcard2 = `BEGIN:VCARD\nVERSION:3.0\nFN:${devName}\nTEL;type=CELL;waid=${num2}:+${num2}\nEND:VCARD`;
  const vcard3 = `BEGIN:VCARD\nVERSION:3.0\nFN:${devName}\nTEL;type=CELL;waid=${num3}:+${num3}\nEND:VCARD`;

  const img      = 'https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg';
  const voiceUrl = 'https://media1.vocaroo.com/mp3/14l3O099fwcq';

  const caption = `${HEADER}

👑 اسم المطور : ${devName}

📱 رقم 1 : +${num1}
📱 رقم 2 : +${num2}
📱 رقم 3 : +${num3}

🔗 قناة البوت:
https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e

💬 جروب الدعم:
https://chat.whatsapp.com/JNUcrtcQjPGJpKoW78dkEc

${FOOTER}`;

  try {
    await conn.sendPresenceUpdate('composing', m.chat)
    await new Promise(r => setTimeout(r, 1000))
    await conn.sendPresenceUpdate('paused', m.chat)
  } catch {}

  await Promise.all([
    conn.sendMessage(m.chat, {
      image: { url: img },
      caption,
      mentions: [
        `${num1}@s.whatsapp.net`,
        `${num2}@s.whatsapp.net`,
        `${num3}@s.whatsapp.net`
      ]
    }, { quoted: m }),
    conn.sendMessage(m.chat, {
      contacts: {
        displayName: devName,
        contacts: [
          { vcard: vcard1 },
          { vcard: vcard2 },
          { vcard: vcard3 }
        ]
      }
    }, { quoted: m })
  ]);

  try {
    const voiceRes = await fetchWithTimeout(voiceUrl, 20_000, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://vocaroo.com/'
      }
    });
    let mp3Buffer = Buffer.from(await voiceRes.arrayBuffer());
    let oggBuffer = await convertToOggOpus(mp3Buffer);
    mp3Buffer = null;

    await conn.sendMessage(m.chat, {
      audio: oggBuffer,
      mimetype: 'audio/ogg; codecs=opus',
      ptt: true
    }, { quoted: m });

    oggBuffer = null;
  } catch (e) {
    console.error('Voice error:', e.message);
  }
};

handler.command = /^(owner|مطور|المطور)$/i;
handler.bot = false;
export default handler;
