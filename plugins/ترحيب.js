// ====================================================
// 🟣 WELCOME/GOODBYE PLUGIN - NEON PURPLE STYLE
// Betho Bot
// ====================================================

import { createCanvas, loadImage } from 'canvas'

const dev = '𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢ 𝐵𝑂𝑇'

// WAMessageStubType values from @whiskeysockets/baileys
const GROUP_PARTICIPANT_ADD    = 27
const GROUP_PARTICIPANT_INVITE = 31
const GROUP_PARTICIPANT_LEAVE  = 32
const GROUP_PARTICIPANT_REMOVE = 28

let handler = async (m, { conn, command, args, isAdmin, isOwner }) => {
  if (!m.isGroup) return m.reply('🔒 هذا الأمر مخصص للجروبات فقط.')

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = global.db.data.chats[m.chat]

  const type   = (args[0] || '').toLowerCase()
  const enable = command === 'on'

  if (type !== 'welcome') return m.reply('⚙️ استخدم:\n*.on welcome* / *.off welcome*')
  if (!(isAdmin || isOwner)) return m.reply('❌ هذا الأمر للمشرفين فقط.')

  chat.welcome = enable
  return m.reply(`✅ تم ${enable ? 'تفعيل' : 'إيقاف'} الترحيب والمغادرة بنجاح.`)
}

handler.command = ['on', 'off']
handler.group   = true
handler.admin   = true
handler.tags    = ['group']
handler.help    = ['on welcome', 'off welcome']

handler.before = async function (m, { conn, participants, groupMetadata, chat: _chat }) {
  if (!m.isGroup || !m.messageStubType) return true

  // جلب الـ chat من الـ DB (مع ضمان وجوده)
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = _chat || global.db.data.chats[m.chat]

  
  const stubParams = m.messageStubParameters || []
  if (!Array.isArray(stubParams) || stubParams.length === 0) return true

  const userJid  = stubParams[0]
  const username = userJid.split('@')[0]
  const mention  = '@' + username
  const initialMemberCount = groupMetadata?.participants?.length || 0

  // ─── صورة البروفيل ───────────────────────────────────
  let avatarUrl
  try {
    avatarUrl = await conn.profilePictureUrl(userJid, 'image')
  } catch {
    avatarUrl = 'https://i.postimg.cc/gksCzK5n/IMG-20260610-WA0076.jpg'
  }

  // ─── بناء الصورة بأسلوب نيون بنفسجي ──────────────────
  async function buildNeonImage(type, memberCount) {
    const W = 800, H = 400
    const canvas = createCanvas(W, H)
    const ctx    = canvas.getContext('2d')

    const palette = type === 'welcome'
      ? { glow: 'rgba(168, 85, 247, ', accent: '#c084fc', ring: '#a855f7' }
      : { glow: 'rgba(248, 113, 113, ', accent: '#fca5a5', ring: '#f97316' }

    // خلفية سوداء
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, W, H)

    // هالات توهج
    const glow1 = ctx.createRadialGradient(650, 100, 0, 650, 100, 220)
    glow1.addColorStop(0, palette.glow + '0.35)')
    glow1.addColorStop(1, palette.glow + '0)')
    ctx.fillStyle = glow1
    ctx.fillRect(0, 0, W, H)

    const glow2 = ctx.createRadialGradient(150, 320, 0, 150, 320, 240)
    glow2.addColorStop(0, palette.glow + '0.30)')
    glow2.addColorStop(1, palette.glow + '0)')
    ctx.fillStyle = glow2
    ctx.fillRect(0, 0, W, H)

    // إطار نيون رفيع
    ctx.save()
    ctx.shadowColor = palette.ring
    ctx.shadowBlur  = 12
    ctx.strokeStyle = palette.ring
    ctx.lineWidth   = 2
    ctx.globalAlpha = 0.6
    roundRect(ctx, 6, 6, W - 12, H - 12, 14)
    ctx.stroke()
    ctx.restore()

    // ── صورة الأفاتار (دائرية بحلقة نيون) ──
    const avatarSize = 140
    const avatarX    = 55
    const avatarY    = 100

    ctx.save()
    ctx.shadowColor = palette.ring
    ctx.shadowBlur  = 18
    ctx.strokeStyle = palette.ring
    ctx.lineWidth   = 3
    ctx.globalAlpha = 0.85
    ctx.beginPath()
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 6, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()

    try {
      const avatarImg = await loadImage(avatarUrl)
      ctx.save()
      ctx.beginPath()
      ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()
      ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize)
      ctx.restore()
    } catch (_e) {}

    // ── النصوص ──
    ctx.direction = 'rtl'
    ctx.textAlign = 'right'
    const textX     = W - 100
    const textBaseY = 110

    if (type === 'welcome') {
      ctx.save()
      ctx.shadowColor = palette.ring
      ctx.shadowBlur  = 14
      ctx.font      = 'bold 38px sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.fillText('نورت/ي ', textX, textBaseY)
      ctx.restore()

      ctx.save()
      ctx.shadowColor = palette.ring
      ctx.shadowBlur  = 10
      ctx.font      = 'bold 26px sans-serif'
      ctx.fillStyle = palette.accent
      ctx.fillText(`@${username}`, textX, textBaseY + 50)
      ctx.restore()

      ctx.font      = '19px sans-serif'
      ctx.fillStyle = '#d4d4d8'
      const gName = groupMetadata.subject.length > 20
        ? groupMetadata.subject.slice(0, 20) + '...'
        : groupMetadata.subject
      ctx.fillText(`في ${gName}`, textX, textBaseY + 90)
    } else {
      ctx.save()
      ctx.shadowColor = palette.ring
      ctx.shadowBlur  = 14
      ctx.font      = 'bold 38px sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.fillText('وداعاً... ✦', textX, textBaseY)
      ctx.restore()

      ctx.save()
      ctx.shadowColor = palette.ring
      ctx.shadowBlur  = 10
      ctx.font      = 'bold 26px sans-serif'
      ctx.fillStyle = palette.accent
      ctx.fillText(`@${username}`, textX, textBaseY + 50)
      ctx.restore()

      ctx.font      = '19px sans-serif'
      ctx.fillStyle = '#d4d4d8'
      const gName = groupMetadata.subject.length > 20
        ? groupMetadata.subject.slice(0, 20) + '...'
        : groupMetadata.subject
      ctx.fillText(`غادر ${gName}`, textX, textBaseY + 90)
    }

    // خط فاصل نيون
    ctx.save()
    ctx.shadowColor = palette.ring
    ctx.shadowBlur  = 8
    ctx.strokeStyle = palette.ring
    ctx.globalAlpha = 0.6
    ctx.lineWidth   = 2
    ctx.beginPath()
    ctx.moveTo(380, 240)
    ctx.lineTo(700, 240)
    ctx.stroke()
    ctx.restore()

    // عدد الأعضاء
  ctx.direction = 'rtl'
  ctx.textAlign = 'right'
  ctx.font      = '17px sans-serif'
  ctx.fillStyle = '#a1a1aa'
  ctx.fillText(`👥 العضو رقم ${memberCount}`, textX, 275)

    // اسم البوت
    ctx.direction  = 'ltr'
    ctx.textAlign  = 'center'
    ctx.save()
    ctx.shadowColor = palette.ring
    ctx.shadowBlur  = 16
    ctx.font        = 'bold italic 36px sans-serif'
    ctx.fillStyle   = '#ffffff'
    drawSpacedText(ctx, 'Betho Bot', W / 2, 350, 6)
    ctx.restore()

    // السلوجن
    ctx.font      = '12px sans-serif'
    ctx.fillStyle = palette.ring
    ctx.globalAlpha = 0.85
    drawSpacedText(ctx, 'SMART • CUTE • UNSTOPPABLE', W / 2, 385, 3)
    ctx.globalAlpha = 1

    return canvas.toBuffer('image/jpeg', { quality: 0.93 })
  }

  // ─── دوال مساعدة ───────────────────────────────────
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
  }

  function drawSpacedText(ctx, text, cx, y, spacing) {
    const widths = [...text].map(ch => ctx.measureText(ch).width)
    const totalWidth = widths.reduce((a, b) => a + b, 0) + spacing * (text.length - 1)
    let x = cx - totalWidth / 2
    const prevAlign = ctx.textAlign
    ctx.textAlign = 'left'
    for (let i = 0; i < text.length; i++) {
      ctx.fillText(text[i], x, y)
      x += widths[i] + spacing
    }
    ctx.textAlign = prevAlign
  }

  // ─── استقبال عضو جديد ────────────────────────────────
  if (
    m.messageStubType === GROUP_PARTICIPANT_ADD ||
    m.messageStubType === GROUP_PARTICIPANT_INVITE
  ) {
    const memberCount = initialMemberCount

    const defaultWelcome =
      `*مرحباً @user في @subject!*\n\n` +
      `أنا *${dev}*، مساعدك الذكي\n` +
      `> عدد الاعضاء الآن: ${memberCount}\n` +
      `> اقرأ القوانين قبل المشاركة\n` +
      `> اكتب *#menu* لاكتشاف الاوامر\n\n` +
      `اهلاً وسهلاً بك!`

    const welcomeText = (chat.welcomeText || defaultWelcome)
      .replace('@user', mention)
      .replace('@subject', groupMetadata.subject)
      .replace('@desc', groupMetadata.desc?.toString() || '')

    let imgBuffer
    try { imgBuffer = await buildNeonImage('welcome', memberCount) }
    catch (e) { console.error('خطأ في الصورة:', e) }

    await conn.sendMessage(m.chat, {
      ...(imgBuffer ? { image: imgBuffer } : {}),
      caption: welcomeText,
      mentions: [userJid]
    }, {})

  // ─── مغادرة عضو ──────────────────────────────────────
  } else if (
    m.messageStubType === GROUP_PARTICIPANT_LEAVE ||
    m.messageStubType === GROUP_PARTICIPANT_REMOVE
  ) {
    const memberCount = initialMemberCount - 1

    const defaultBye =
      `*وداعاً @user...*\n\n` +
      `نتمنى لك التوفيق خارج @subject\n` +
      `> عدد الاعضاء الآن: ${memberCount}`

    const byeText = (chat.byeText || defaultBye)
      .replace('@user', mention)
      .replace('@subject', groupMetadata.subject)

    let imgBuffer
    try { imgBuffer = await buildNeonImage('goodbye', memberCount) }
    catch (e) { console.error('خطأ في الصورة:', e) }

    await conn.sendMessage(m.chat, {
      ...(imgBuffer ? { image: imgBuffer } : {}),
      caption: byeText,
      mentions: [userJid]
    }, {})
  }

  return true
}

export default handler
