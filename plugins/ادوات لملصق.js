//𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝒃𝒚 𝒂𝒓𝒂𝒃 𝒕𝒐𝒑 𝒅𝒆𝒗 🪦😉
// أمر تحويل صورة/فيديو إلى لملصق - ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 Style 🎋🌸
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import fluent from 'fluent-ffmpeg'
import { fileTypeFromBuffer as fromBuffer } from 'file-type'
import { addExif } from '../lib/sticker.js'

// زخرفة ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 كامادو 🌸🎋
const LINE = '╭━━🌸 𝓝𝓮𝔃𝓾𝓴𝓸 𝓢𝓽𝓲𝓬𝓿𝓮𝓻 🌸━━╮'
const CROWN = '╰━━ 🎋𝓚𝓪𝓶𝓪𝓭𝓸 𝓝𝓮𝔃𝓾𝓴𝓸 🎋━━╯'

let handler = async (m, { conn, args, command }) => {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || q.mediaType || ''
    let buffer

    // الحصول على تاريخ اليوم وتنسيقه تلقائياً لعام 2026
    const dateObj = new Date()
    const year = dateObj.getFullYear()
    const month = dateObj.getMonth() + 1
    const day = dateObj.getDate()
    const historyString = `${year}/${month}/${day}`

    // مصفوفة الأيام بالعربية
    const daysArabic = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    const dayName = daysArabic[dateObj.getDay()]

    // إعدادات حقوق الحقوق المطلوبة بدقة داخل اللملصق
    const packname = `BY .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀\nHistory : ${historyString}\nday : ${dayName}`
    const author = `Every Poster Belongs to Me ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 MD Rights 🙃🎋`

    try {
        // التحقق من الوسائط أو رابط
        if (/image|video|webp|tgs|webm/g.test(mime) && q.download) {
            // تعديل الحد الأقصى لللملصق المتحرك ليصبح 10 ثوانٍ فقط
            if (/video|webm/.test(mime) && (q.msg || q).seconds > 10) {
                return conn.reply(m.chat, `${LINE}\n⚠️ *خـطـأ:* الـفـيـديـو طـويـل جـداً!\n\n🎋 ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 تقبل الفيديوهات التي مدتها *10 ثوانٍ أو أقل* فقط لعمل لملصق متحرك.\n${CROWN}`, m)
            }
            buffer = await q.download()
        } else if (args[0] && isUrl(args[0])) {
            const res = await fetch(args[0])
            buffer = await res.buffer()
        } else {
            // رسالة توضيحية للمستخدم مع طريقة الاستعمال بزخرفة ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥
            return conn.reply(m.chat, `${LINE}\n🌸 *طـريـقـة الاسـتـعـمـال:* \n\n🎋 رد على صـورة أو مـلـصـق أو فـيـديـو بـالأمـر:\n• \`.${command}\`\n\n📌 *ملاحظة:* الفيديوهات يجب أن تكون مدتها 10 ثوانٍ أو أقل.\n${CROWN}`, m)
        }

        await m.react('🕓') // تفاعل الساعة أثناء التحويل

        const stickerData = await toWebp(buffer)
        const finalSticker = await addExif(stickerData, packname, author)

        await conn.sendFile(m.chat, finalSticker, 'sticker.webp', '', m)
        await m.react('✅') // تم بنجاح

    } catch (e) {
        await m.react('✖️') // فشل
        console.error('❀ خطأ أثناء إنشاء اللملصق:', e)
        conn.reply(m.chat, `${LINE}\n🌸 *عذراً، حدث خطأ غير متوقع أثناء صنع اللملصق!* 🎋\n${CROWN}`, m)
    }
}

handler.help = ['لملصق']
handler.tags = ['tools'] // تم نقله لقسم الأدوات فقط
handler.command = /^لملصق$/i // الأمر باللغة العربية فقط وبدون مدخلات إنجليزية

export default handler

async function toWebp(buffer, opts = {}) {
    const { ext } = await fromBuffer(buffer)
    if (!/(png|jpg|jpeg|mp4|mkv|m4p|gif|webp|webm|tgs)/i.test(ext)) throw 'الوسائط غير مدعومة'

    const tempDir = global.tempDir || './tmp'
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

    const input = path.join(tempDir, `${Date.now()}.${ext}`)
    const output = path.join(tempDir, `${Date.now()}.webp`)

    fs.writeFileSync(input, buffer)

    const aspectRatio = opts.isFull
        ? `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease`
        : `scale='if(gt(iw,ih),-1,299):if(gt(iw,ih),299,-1)', crop=299:299:exact=1`

    // تم تعديل وقت المعالجة الأقصى في الـ ffmpeg لتتوافق مع الـ 10 ثوانٍ المحددة
    const options = [
        '-vcodec', 'libwebp',
        '-vf', `${aspectRatio}, fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
        ...(ext.match(/(mp4|mkv|m4p|gif|webm)/)
            ? ['-loop', '0', '-ss', '0', '-t', '10', '-preset', 'default', '-an', '-vsync', '0', '-y']
            : []
        )
    ]

    return new Promise((resolve, reject) => {
        fluent(input)
            .addOutputOptions(options)
            .toFormat('webp')
            .save(output)
            .on('end', () => {
                try {
                    const result = fs.readFileSync(output)
                    fs.unlinkSync(input)
                    fs.unlinkSync(output)
                    resolve(result)
                } catch (err) {
                    reject('فشل قراءة الملف بعد التحويل')
                }
            })
            .on('error', (err) => {
                console.error('FFMPEG Error:', err)
                if (fs.existsSync(input)) fs.unlinkSync(input)
                if (fs.existsSync(output)) fs.unlinkSync(output)
                reject('حدث خطأ أثناء تحويل الملف')
            })
    })
}

function isUrl(text) {
    return /^https?:\/\/\S+\.(jpg|jpeg|png|gif|webp)$/i.test(text)
}