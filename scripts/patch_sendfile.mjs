/**
 * Patch sendFile calls in downloader plugins to add downloadButtons message after them.
 * Only targets files that already have downloadButtons import.
 */
import fs from 'fs'
import path from 'path'

const PLUGINS_DIR = './plugins'

// Files that use sendFile and have downloader tag - need button msg after sendFile
const TARGET_FILES = [
  'appteka.js','capcutdl.js','capcut.js','fbturbo.js','gimg.js',
  'ig-post.js','igpost.js','igthubnmail.js','instagramdl.js','instagram.js',
  'keepvid.js','kiana-yt.js','mediafire-dl.js','mediafire.js','ncs.js',
  'on4t.js','pin.js','pinterest-img.js','play-chordmini.js','savetik.js',
  'snackvideo.js','threads-thumbnail.js','ttdl.js','twitterdl.js',
  'unsplash.js','uptodown.js','wallpaper.js'
]

// Pattern: conn.sendFile(...)  -- add button message after each occurrence
// We add a sendMessage with downloadButtons() right after sendFile

function patchSendFile(content, filename) {
  if (!content.includes('downloadButtons') && !content.includes('channelButton')) return content

  // Replace: await conn.sendFile(...)
  // With: await conn.sendFile(...) \n await conn.sendMessage(m.chat, { text: '⬇️ تم التحميل', footer: ..., buttons: downloadButtons() }, { quoted: m })
  // But only if not already patched
  if (content.includes('footer: \'『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』\'') && content.includes('downloadButtons()')) {
    return content // already has a button message somewhere
  }

  // Find sendFile calls and add button message after closing paren
  // Pattern: await conn.sendFile(args...) — multiline
  let patched = content.replace(
    /(await\s+conn\.sendFile\s*\([^)]+\)\s*)/g,
    (match) => {
      return match + `\n    try { await conn.sendMessage(m.chat, { text: '⬇️ *تم التحميل بنجاح*', footer: '『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』', buttons: downloadButtons() }, { quoted: m }) } catch {}\n    `
    }
  )

  return patched
}

let fixed = 0
let errors = []

for (const filename of TARGET_FILES) {
  const filePath = path.join(PLUGINS_DIR, filename)
  if (!fs.existsSync(filePath)) continue

  let content = fs.readFileSync(filePath, 'utf8')

  // Skip if already has downloadButtons message
  if (content.includes("text: '⬇️ *تم التحميل بنجاح*'")) {
    console.log(`⏩ Already patched: ${filename}`)
    continue
  }

  // Make sure it has downloadButtons import
  if (!content.includes('downloadButtons')) {
    content = `import { downloadButtons } from '../system/buttons.js'\n` + content
  }

  const patched = patchSendFile(content, filename)
  if (patched !== content) {
    fs.writeFileSync(filePath, patched, 'utf8')
    fixed++
    console.log(`✅ Patched sendFile: ${filename}`)
  }
}

console.log(`\n✅ sendFile patches applied: ${fixed} files`)
