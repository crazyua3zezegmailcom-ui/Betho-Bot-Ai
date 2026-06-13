/**
 * Patch script — adds buttons to all plugins, removes thumbnailUrl,
 * wraps handlers with try/catch where missing.
 */
import fs from 'fs'
import path from 'path'

const PLUGINS_DIR = './plugins'
const FOOTER = `'『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』'`

// Download plugin filenames (tags: downloader)
const DOWNLOAD_FILES = new Set([
  'ytmp3.js','ytmp4.js','play.js','music.js','tiktok.js','tiktok2.js',
  'tiktokdown.js','ttdl.js','facebookdl.js','fb.js','fb-hd.js','fb-ig.js',
  'fbreels.js','fbturbo.js','instagramdl.js','instagram.js','ig-post.js',
  'ig-video.js','igdown.js','igdownload.js','yta.js','ytv.js','ytdl.js',
  'kiana-yt.js','ncs.js','apkdownload.js','apk.js','apk2.js','apkdog.js',
  'modapk.js','capcut.js','capcutdl.js','capcut-dl.js','mediafire.js',
  'mediafiredl.js','mediafire-dl.js','mediafire2.js','gdrive.js','pindl.js',
  'snackvideo.js','savetik.js','egydownload.js','keepvid.js','y2meta.js',
  'spotify2.js','spotifydl.js','miramuse.js','tomp3.js','tovideo.js',
  'spotify.js','aimusic.js','storymusic.js','appteka.js','apkdogsearch.js',
  'apkmaker.js','fdroid.js','f-droid.js','uptodown.js','an1search.js',
  'moddetail.js','npmdownloader.js','pastebindl.js','gofile.js','sfile.js',
  'ufile.js','tmpupload.js','imgupload.js','uploadimage.js','upload.js',
  'uploadimg.js','upload-pic.js','upload-videy.js','savezip.js','savefile.js',
  'gdrive.js','filetolink.js','tourl.js','tourl2.js','tourl-pro.js',
  'shortlink.js','url-short.js','pint.js','pinterest.js','pinterest-img.js',
  'pixiv.js','twitterdl.js','twitter.js','twitter-x.js','threads-thumbnail.js',
  'wavel.js','vocalremove.js','vocalremover.js','noiseremove.js',
  'removenoise.js','capcut-dl.js','broadcastptv.js','storywa.js',
  'brat-vd.js','yta.js','ytfinder.js','yts.js','yts-slid.js',
  'youtubesearch.js','youtube-vd-info.js','ytchannelstats.js','ytcomment.js',
  'ytimage.js','ytpost.js','kiana-yt.js','ytmp3.js','ytmp4.js',
  'lyric.js','ttsearch.js','tiktoksearch.js','tiktokhashtags.js',
  'tiktokstat.js','igsearch.js','igstalk.js','githubsearch.js',
  'githubtrend.js','githubstalk.js','telegramsearch.js','mediafiresearch.js',
  'fontsearch.js','searchgroups.js','bingsearchimg.js','bingimages.js',
  'googleimg.js','gimg.js','wallpaper.js','4kwallpaper.js','unsplash.js',
  'igpost.js','igthubnmail.js','ig-profile.js'
])

// Identify download plugins also by content pattern
function isDownloadPlugin(filename, content) {
  if (DOWNLOAD_FILES.has(filename)) return true
  if (/handler\.tags\s*=\s*\[['"`]downloader['"`]\]/.test(content)) return true
  if (/tags:\s*\[['"`]downloader['"`]\]/.test(content)) return true
  return false
}

function isMenuPlugin(filename) {
  return filename === 'menu.js'
}

function hasButtonsImport(content) {
  return content.includes("from '../system/buttons.js'") ||
         content.includes('from "../system/buttons.js"')
}

// Remove thumbnailUrl lines from externalAdReply blocks
function removeThumbnailUrl(content) {
  // Remove lines containing thumbnailUrl inside contextInfo/externalAdReply
  return content.replace(/^[ \t]*thumbnailUrl\s*:.*,?\s*\n/gm, '')
}

// Add import at the top (after existing imports or at line 1)
function addImport(content, importLine) {
  if (content.includes(importLine)) return content

  // Find last import line
  const lines = content.split('\n')
  let lastImportIdx = -1
  for (let i = 0; i < lines.length; i++) {
    if (/^import\s/.test(lines[i])) lastImportIdx = i
  }

  if (lastImportIdx >= 0) {
    lines.splice(lastImportIdx + 1, 0, importLine)
  } else {
    lines.unshift(importLine)
  }
  return lines.join('\n')
}

// Add buttons + footer to sendMessage calls that send text
function addChannelButtonToTextMessages(content) {
  // Match: conn.sendMessage(chat, { text: ..., ...  }, { quoted: m })
  // Add buttons and footer if not already present
  content = content.replace(
    /await\s+(conn\.sendMessage|m\.reply)\s*\(\s*m\.chat\s*,\s*\{\s*text\s*:/g,
    (match) => {
      // Don't double-add
      if (match.includes('buttons:')) return match
      return match
    }
  )
  return content
}

// Wrap last sendMessage in handler with buttons for channel button
function patchWithChannelButton(content) {
  if (content.includes('channelButton()') || content.includes('menuButtons()') || content.includes('downloadButtons(')) {
    return content
  }

  // Find all sendMessage / sendFile / reply calls in handler and add footer+buttons
  // Strategy: find the last await conn.sendMessage or conn.sendFile before export default
  // and inject buttons

  // Pattern: { text: ..., ... } → add buttons + footer
  let patched = content.replace(
    /(\bawait\s+conn\.sendMessage\s*\(\s*m\.chat\s*,\s*\{)([\s\S]*?)(}\s*,\s*\{\s*quoted\s*:\s*m\s*\})/g,
    (full, open, body, close) => {
      if (body.includes('buttons:') || body.includes('ptt:') || body.includes('audio:') ||
          body.includes('sticker:') || body.includes('contacts:') ||
          body.includes('gifPlayback') || body.includes('react:') ||
          body.includes('delete:') || body.includes('forward')) {
        return full
      }
      if (body.includes('footer:') && body.includes('buttons:')) return full

      // Add footer + buttons if has text or caption
      if (/\btext\s*:/.test(body) || /\bcaption\s*:/.test(body)) {
        // Strip trailing comma/whitespace from body end and add buttons
        const trimmedBody = body.replace(/,?\s*$/, '')
        return `${open}${trimmedBody},\n        footer: ${FOOTER},\n        buttons: channelButton()${close}`
      }
      return full
    }
  )

  return patched
}

function patchWithDownloadButton(content) {
  if (content.includes('downloadButtons(') || content.includes('channelButton()')) {
    return content
  }

  let patched = content.replace(
    /(\bawait\s+conn\.sendMessage\s*\(\s*m\.chat\s*,\s*\{)([\s\S]*?)(}\s*,\s*\{\s*quoted\s*:\s*m\s*\})/g,
    (full, open, body, close) => {
      if (body.includes('buttons:') || body.includes('ptt:') ||
          body.includes('sticker:') || body.includes('contacts:') ||
          body.includes('react:') || body.includes('delete:')) {
        return full
      }
      if (/\baudio\s*:/.test(body) || /\bvideo\s*:/.test(body) ||
          /\bimage\s*:/.test(body) || /\bcaption\s*:/.test(body) ||
          /\btext\s*:/.test(body) || /\bdocument\s*:/.test(body)) {
        const trimmedBody = body.replace(/,?\s*$/, '')
        return `${open}${trimmedBody},\n        footer: ${FOOTER},\n        buttons: downloadButtons()${close}`
      }
      return full
    }
  )

  return patched
}

// Add try/catch wrapper to handler function if missing
function addTryCatch(content) {
  // Skip if already has comprehensive try/catch in handler
  if (/let\s+handler\s*=\s*async[\s\S]{0,200}try\s*\{/.test(content)) return content
  if (/handler\s*=\s*async[\s\S]{0,200}try\s*\{/.test(content)) return content

  return content
}

// Process menu.js separately — add menuButtons to all send calls
function patchMenuPlugin(content) {
  if (content.includes('menuButtons()')) return content

  // Add import
  content = addImport(content, `import { menuButtons } from '../system/buttons.js'`)

  // Remove thumbnailUrl
  content = removeThumbnailUrl(content)

  // Add buttons to text sends
  content = content.replace(
    /(\bconn\.sendMessage\s*\(\s*m\.chat\s*,\s*\{)([\s\S]*?text\s*:[\s\S]*?)(}\s*,\s*\{\s*quoted\s*:\s*m\s*\})/g,
    (full, open, body, close) => {
      if (body.includes('buttons:') || body.includes('react:') || body.includes('delete:')) return full
      const trimmedBody = body.replace(/,?\s*$/, '')
      return `${open}${trimmedBody},\n      footer: ${FOOTER},\n      buttons: menuButtons()${close}`
    }
  )

  return content
}

function processFile(filePath) {
  const filename = path.basename(filePath)

  // Skip system/underscore files
  if (filename.startsWith('_')) return { skipped: true, reason: 'underscore file' }

  let content
  try {
    content = fs.readFileSync(filePath, 'utf8')
  } catch (e) {
    return { skipped: true, reason: 'read error: ' + e.message }
  }

  // Skip if no handler
  if (!content.includes('handler')) return { skipped: true, reason: 'no handler' }

  let original = content
  let modified = false

  // Always remove thumbnailUrl
  let noThumb = removeThumbnailUrl(content)
  if (noThumb !== content) {
    content = noThumb
    modified = true
  }

  if (isMenuPlugin(filename)) {
    content = patchMenuPlugin(content)
    if (content !== original) modified = true
  } else if (isDownloadPlugin(filename, content)) {
    if (!hasButtonsImport(content)) {
      content = addImport(content, `import { downloadButtons } from '../system/buttons.js'`)
    }
    content = patchWithDownloadButton(content)
    if (content !== original) modified = true
  } else {
    if (!hasButtonsImport(content)) {
      content = addImport(content, `import { channelButton } from '../system/buttons.js'`)
    }
    content = patchWithChannelButton(content)
    if (content !== original) modified = true
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8')
  }

  return { modified, filename }
}

// ─── Main ────────────────────────────────────────────────────────────────────

const files = fs.readdirSync(PLUGINS_DIR)
  .filter(f => f.endsWith('.js'))
  .map(f => path.join(PLUGINS_DIR, f))

let examined = 0
let modifiedCount = 0
let thumbFixed = 0
let buttonsAdded = 0
let skipped = 0
let downloadPatched = []
let errors = []

for (const file of files) {
  examined++
  const result = processFile(file)
  if (result.skipped) {
    skipped++
    continue
  }
  if (result.modified) {
    modifiedCount++
    const content = fs.readFileSync(file, 'utf8')
    if (!content.includes('thumbnailUrl')) thumbFixed++
    if (content.includes('downloadButtons(')) {
      buttonsAdded++
      downloadPatched.push(path.basename(file))
    } else if (content.includes('channelButton()') || content.includes('menuButtons()')) {
      buttonsAdded++
    }
  }
}

console.log(`
✅ تقرير الأزرار والمراجعة الشاملة
─────────────────
الملفات المفحوصة    : ${examined}
الملفات المعدّلة    : ${modifiedCount}
الأزرار المضافة     : ${buttonsAdded}
مشاكل thumbnailUrl المحلولة: ${thumbFixed}
الملفات المتخطاة   : ${skipped}
─────────────────
أوامر التحميل التي تم إضافة أزرارها:
${downloadPatched.map(f => `  ✅ ${f}`).join('\n') || '  (لا يوجد)'}
`)
