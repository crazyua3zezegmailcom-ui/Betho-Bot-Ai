import fs from 'fs'
import path from 'path'
import os from 'os'
import { createCanvas, loadImage } from 'canvas'
import { exec } from 'child_process'
import { promisify } from 'util'
import speed from "performance-now" // مكتبة حساب السرعة بدقة
import pkg from '@whiskeysockets/baileys'
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = pkg

const execAsync = promisify(exec)

// الروابط
const bgUrl = "https://i.postimg.cc/gksCzK5n/IMG-20260610-WA0076.jpg" 
const botAvatarUrl = "https://i.postimg.cc/gksCzK5n/IMG-20260610-WA0076.jpg"

// 1. دالة جهة الاتصال (كوت)
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
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${m.pushName || 'User'};;;;\nFN:${m.pushName || 'User'}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:📞 WhatsApp\nORG:HULK BOT ✓\nTITLE:Verified\nEND:VCARD`
      }
    },
    participant: '0@s.whatsapp.net'
  }
}

let handler = async (m, { conn }) => {
    // حساب السرعة (البداية)
    let timestamp = speed()
    
    // بيانات النظام
    let uptimeMs = process.uptime() * 1000
    let uptimeFormatted = clockString(uptimeMs)
    let today = new Date()
    let dateStr = `${today.getFullYear()}/${(today.getMonth()+1).toString().padStart(2,'0')}/${today.getDate().toString().padStart(2,'0')}`
    
    // عدد الملفات والأخطاء
    const pluginsDir = path.join(process.cwd(), './plugins')
    const totalFiles = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js')).length
    let totalErrors = global.db?.data?.stats?.errors || 0 

    // الرام والمعالج للصورة
    const totalRamSys = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2)
    const freeRamSys = (os.freemem() / 1024 / 1024 / 1024).toFixed(2)
    const usedRamSys = (totalRamSys - freeRamSys).toFixed(2)
    const cpuModel = os.cpus()[0].model.split(' ')[0] + " Core"

    // مساحة القرص
    let totalDisk = "100GB", usedDisk = "45GB" 
    try {
        const { stdout } = await execAsync(`df -h . | tail -1 | awk '{print $2,$3}'`)
        const parts = stdout.trim().split(/\s+/)
        if (parts.length >= 2) { totalDisk = parts[0]; usedDisk = parts[1]; }
    } catch (e) {}

    // --- تصميم الصورة (Canvas) ---
    const width = 1000, height = 650
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    try {
        const background = await loadImage(bgUrl)
        ctx.drawImage(background, 0, 0, width, height)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; ctx.fillRect(0, 0, width, height)

        const avatarX = 240, avatarY = 325, radius = 190
        ctx.save()
        ctx.shadowColor = 'rgba(255, 105, 180, 0.8)'; ctx.shadowBlur = 30
        ctx.beginPath(); ctx.arc(avatarX, avatarY, radius, 0, Math.PI * 2); ctx.fillStyle = 'white'; ctx.fill()
        ctx.restore()

        ctx.save()
        ctx.beginPath(); ctx.arc(avatarX, avatarY, radius - 5, 0, Math.PI * 2); ctx.clip()
        const avatar = await loadImage(botAvatarUrl)
        ctx.drawImage(avatar, avatarX - radius, avatarY - radius, radius * 2, radius * 2)
        ctx.restore()

        ctx.strokeStyle = '#ff69b4'; ctx.lineWidth = 10
        ctx.beginPath(); ctx.arc(avatarX, avatarY, radius - 5, 0, Math.PI * 2); ctx.stroke()

        const startX = 500, startY = 140, boxWidth = 460, boxHeight = 75, gap = 18
        const stats = [
            { label: 'تاريخ اليوم', value: dateStr },
            { label: 'وقت التشغيل', value: uptimeFormatted },
            { label: 'الرام (النظام)', value: `${usedRamSys}GB / ${totalRamSys}GB` },
            { label: 'الذاكرة (القرص)', value: `${usedDisk} / ${totalDisk}` },
            { label: 'المعالج (CPU)', value: cpuModel }
        ]

        ctx.font = 'bold 55px "Arial"'; ctx.fillStyle = '#ff1493'
        ctx.fillText('BETHO AI', startX + 20, 80)
        ctx.font = '24px "Arial"'; ctx.fillStyle = '#ffffff'
        ctx.fillText('3RAB_TOP_DEVS', startX + 25, 115)

        stats.forEach((stat, i) => {
            let y = startY + (i * (boxHeight + gap))
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'; ctx.strokeStyle = 'rgba(255, 105, 180, 0.6)'; ctx.lineWidth = 2
            roundRect(ctx, startX, y, boxWidth, boxHeight, 20, true, true)
            ctx.font = 'bold 24px "Arial"'; ctx.fillStyle = '#fff'
            ctx.fillText(stat.label, startX + 25, y + 45)
            ctx.textAlign = 'right'; ctx.fillStyle = '#ffc0cb'
            ctx.fillText(stat.value, startX + boxWidth - 25, y + 45)
            ctx.textAlign = 'left'
        })

        const buffer = canvas.toBuffer('image/png')
        
        // حساب زمن الاستجابة (النهاية)
        let latensi = speed() - timestamp

        // تجهيز الميديا
        let media = await prepareWAMessageMedia({ image: buffer }, { upload: conn.waUploadToServer })

        const caption = `*﹝ ✅⃝🌸 تـم تـولـيد تقرير النـظام بـنـجـاح ﹞*
*_🍡 .𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥​_*

*_🌳 عـدد الاوامـر_* ( ${totalFiles} ملف )
*_🍒 الايـرور_* ( ${totalFiles}/${totalErrors} )
*_🍇 سـرعـه الأداه_* ( ${latensi.toFixed(4)} _ms_ )
*_🍉 وقـت تشـغيل نـيزوكو_* ( ${uptimeFormatted} )


*_🥭 تـعلـم كيـفيه صـنعه_* ابحث في اليوتيوب بيثو ai free bot WhatsApp 3rab_top_devs | القناه عرب توب ديف |`.trim()

        // --- إرسال الرسالة بدون علامة التوجيه ---
        let msg = generateWAMessageFromContent(m.chat, {
          viewOnceMessage: {
            message: {
              interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                body: proto.Message.InteractiveMessage.Body.fromObject({ text: caption }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: "⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥" }),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                  hasMediaAttachment: true,
                  imageMessage: media.imageMessage
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                  buttons: [
                    {
                      name: "cta_url",
                      buttonParamsJson: JSON.stringify({
                        display_text: "Support Betho 👑",
                        url: "https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e"
                      })
                    }
                  ]
                }),
                contextInfo: {
                  mentionedJid: [m.sender],
                  forwardingScore: 0,   // تم تصفير السكور لإخفاء علامة التوجيه
                  isForwarded: false    // إيقاف علامة "معاد توجيهه"
                }
              })
            }
          }
        }, { quoted: contactQuote(m) })

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

    } catch (e) {
        console.error(e)
        m.reply("❌ حدث خطأ أثناء المعالجة.")
    }
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath(); ctx.moveTo(x + radius, y); ctx.lineTo(x + width - radius, y); ctx.quadraticCurveTo(x + width, y, x + width, y + radius); ctx.lineTo(x + width, y + height - radius); ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height); ctx.lineTo(x + radius, y + height); ctx.quadraticCurveTo(x, y + height, x, y + height - radius); ctx.lineTo(x, y + radius); ctx.quadraticCurveTo(x, y, x + radius, y); ctx.closePath()
    if (fill) ctx.fill(); if (stroke) ctx.stroke()
}

function clockString(ms) {
    let h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60
    return `${h}h ${m}m ${s}s`
}

handler.customPrefix = /^(تست|test)$/i
handler.command = new RegExp
export default handler