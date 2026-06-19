// plugin by Const Offmon = Lana;
// instagram.com/noureddine_ouafy

import { prepareWAMessageMedia } from '@whiskeysockets/baileys'

// الزخارف
const startDeco = `☽⚝ͫ͢❏ِꏍ🍡﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ ﷽⎆☽⚝ͫ͢❏ِ🍡ꏍﭕ﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ
╮ ⊰✫⊱─⊰✫⊱─⊰✫⊱╭`

const endDeco = `┘⊰✫⊱─⊰✫⊱─⊰✫⊱└
☽⚝ͫ͢❏ِꏍ🍡﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ ﷽⎆☽⚝ͫ͢❏ِꏍﭕ🍡﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ`

// دالة جهة الاتصال
function contactQuote(m) {
  return {
    key: {
      participants: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'HULK'
    },
    message: {
      contactMessage: {
        displayName: m.pushName || 'Unknown',
        vcard: `BEGIN:VCARD
VERSION:3.0
N:${m.pushName || 'User'};;;;
FN:${m.pushName || 'User'}
item1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}
item1.X-ABLabel:📞 WhatsApp
ORG:HULK BOT ✓
TITLE:Verified
END:VCARD`
      }
    },
    participant: '0@s.whatsapp.net'
  }
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
    const fkontak = contactQuote(m)

    if (!text && !m.quoted) {
        return conn.reply(
            m.chat,
            `${startDeco}\n\n*مثال:* ${usedPrefix + command} نص الحالة\nأو قم بالرد على صورة/فيديو/صوت\n\n${endDeco}`,
            fkontak
        )
    }

    try {
        // حالة نصية فقط
        if (text) {
            await conn.relayMessage(
                m.chat,
                {
                    groupStatusMessageV2: {
                        message: { conversation: text }
                    }
                },
                {}
            )
            return conn.reply(m.chat, `${startDeco}\n\n✅ *تم رفع الحالة بنجاح*\n\n${endDeco}`, fkontak)
        }

        // حالة تحتوي على وسائط (إذا كان رداً)
        if (m.quoted) {
            const mime = m.quoted.mimetype || ''
            const buffer = await m.quoted.download()

            if (!buffer) return conn.reply(m.chat, `${startDeco}\n\n❌ *لا توجد وسائط متاحة للرفع*\n\n${endDeco}`, fkontak)

            let media

            if (/image/.test(mime)) {
                media = await prepareWAMessageMedia(
                    { image: buffer },
                    { upload: conn.waUploadToServer }
                )
            } else if (/video/.test(mime)) {
                media = await prepareWAMessageMedia(
                    { video: buffer },
                    { upload: conn.waUploadToServer }
                )
            } else if (/audio/.test(mime)) {
                media = await prepareWAMessageMedia(
                    {
                        audio: buffer,
                        mimetype: 'audio/mpeg',
                        ptt: false
                    },
                    { upload: conn.waUploadToServer }
                )
            } else {
                return conn.reply(m.chat, `${startDeco}\n\n❌ *صيغة الوسائط غير مدعومة*\n\n${endDeco}`, fkontak)
            }

            await conn.relayMessage(
                m.chat,
                {
                    groupStatusMessageV2: {
                        message: media
                    }
                },
                {}
            )

            return conn.reply(m.chat, `${startDeco}\n\n✅ *تم رفع الحالة بنجاح*\n\n${endDeco}`, fkontak)
        }
    } catch (err) {
        console.error(err)
        conn.reply(m.chat, `${startDeco}\n\n❌ *فشل رفع الحالة*\n\n${endDeco}`, fkontak)
    }
}

handler.command = /^(حالة|استوري)$/i
handler.owner = true
handler.group = true
handler.help = ["حالة"]
handler.tags = ["owner"]

export default handler