// .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀​
import fs from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'


const LINE = '╭━━🌸 𝓝𝓮𝔃𝓾𝓴𝓸 𝓒𝓱𝓪𝓷 🌸━━╮'
const CROWN = '╰━━🎋𝓚𝓪𝓶𝓪𝓭𝓸 🎋━━╯'

if (ffmpegPath) {
    ffmpeg.setFfmpegPath(ffmpegPath)
}

function parseFlags(text = '') {
    const flags = {
        real: /(^|\s)--real(\s|$)/i.test(text),
        fps: Number((text.match(/--fps\s+(\d+)/i) || [])[1] || 12),
        scale: Number((text.match(/--scale\s+(\d+)/i) || [])[1] || 480),
        max: Number((text.match(/--max\s+(\d+)/i) || [])[1] || 8),
    }
    flags.fps = Math.max(1, Math.min(flags.fps, 24))
    flags.scale = Math.max(64, Math.min(flags.scale, 720))
    flags.max = Math.max(1, Math.min(flags.max, 15))
    return flags
}

function ffmpegRun(input, output, args = []) {
    return new Promise((resolve, reject) => {
        let command = ffmpeg(input)
        args.forEach(a => command.addOption(a))
        command
            .on('error', reject)
            .on('end', () => resolve(output))
            .save(output)
    })
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
    const flags = parseFlags(text)
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''

    if (!/image|video/.test(mime)) {
        return m.reply(
            `${LINE}\n🌸 *أرسـل صـورة أو فـيـديـو ثـم رد عـلـيـه بـالأمـر:* \n\n🎋 \`${usedPrefix}${command}\`\n🎋 \`${usedPrefix}${command} --real\` *لإخراج ملف GIF حقيقي.*\n${CROWN}`
        )
    }

    const media = await q.download()
    if (!media) throw `${LINE}\n🎋 *تعذر تنزيل الوسائط يا سيدي!* 🌸\n${CROWN}`

    const timestamp = Date.now()
    const inPath = join(tmpdir(), `in_${timestamp}`)
    await fs.promises.writeFile(inPath, media)

    const isImage = /^image\//i.test(mime)
    const outGifPath = join(tmpdir(), `out_${timestamp}.gif`)
    const outMp4Path = join(tmpdir(), `out_${timestamp}.mp4`)

    await conn.sendMessage(m.chat, { 
        text: `${LINE}\n> 🎀 *جـاري الـتـحـويـل الـسـحـري لـنـيـزوكـو...* 🎋✨\n${CROWN}` 
    }, { quoted: m })

    try {
        if (flags.real) {
            const palette = join(tmpdir(), `pal_${timestamp}.png`)

            await ffmpegRun(inPath, palette, [
                '-y',
                ...(isImage ? ['-loop', '1', '-t', '3'] : ['-t', `${flags.max}`]),
                '-vf', `scale=${flags.scale}:-1:flags=lanczos,fps=${flags.fps},palettegen=stats_mode=diff`
            ])

            await ffmpegRun(inPath, outGifPath, [
                '-y',
                ...(isImage ? ['-loop', '1', '-t', '3'] : ['-t', `${flags.max}`]),
                '-i', palette,
                '-filter_complex', `[0:v]scale=${flags.scale}:-1:flags=lanczos,fps=${flags.fps}[v];[v][1:v]paletteuse=dither=bayer:bayer_scale=3`,
                '-gifflags', '+transdiff'
            ])

            await conn.sendMessage(m.chat, { 
                document: { url: outGifPath }, 
                mimetype: 'image/gif', 
                fileName: '⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥_animation.gif', 
                caption: `${LINE}\n> 🎀 *تـم الـتـحـويـل إلـى 𝐆𝐈𝐅 حـقـيـقـي بـنـجـاح!* 🌸🍡\n${CROWN}` 
            }, { quoted: m })

            try { await fs.promises.unlink(palette) } catch {}
            try { await fs.promises.unlink(outGifPath) } catch {}

        } else {
            const args = [
                '-y',
                ...(isImage ? ['-loop', '1', '-t', '3'] : ['-t', `${flags.max}`]),
                '-vf', `scale=${flags.scale}:-2,fps=${flags.fps},format=yuv420p`, 
                '-c:v', 'libx264',
                '-profile:v', 'baseline',
                '-level', '3.0',
                '-an',
                '-movflags', 'faststart'
            ]

            await ffmpegRun(inPath, outMp4Path, args)

            await conn.sendMessage(m.chat, { 
                video: { url: outMp4Path }, 
                gifPlayback: true, 
                caption: `${LINE}\n> 🎋 *تـم الـتـحـويـل إلـى 𝐆𝐈𝐅 مـتـحـرك بـنـجـاح!* 🌸🎀\n${CROWN}` 
            }, { quoted: m })

            try { await fs.promises.unlink(outMp4Path) } catch {}
        }
    } catch (e) {
        console.error('GIF Converter Error:', e)
        throw `${LINE}\n🌸 *حـدث خـطـأ أثـنـاء الـتـحـويـل:* ${e?.message || e}\n${CROWN}`
    } finally {
        try { await fs.promises.unlink(inPath) } catch {}
    }
}

handler.help = ['gif']
handler.tags = ['tools'] // تم جعله في قسم التولز فقط هنا 🛠️
handler.command = /^لجيف$/i

export default handler