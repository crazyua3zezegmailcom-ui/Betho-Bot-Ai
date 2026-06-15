// =====================================================
// bot2/index.js — البوت الثاني المستقل (وضع كريزي)
// مستقل تماماً — لا يشارك أي شيء مع البوت الأول
// =====================================================

import chalk from 'chalk'
import pino from 'pino'
import fs from 'fs'
import { Boom } from '@hapi/boom'
import NodeCache from 'node-cache'

// ── استيراد Baileys بنفس النمط الحرفي المستخدم في lib/simple.js و index.js ──
// الفورك baileys-by-hulk يُصدِّر makeWASocket تحت .default.default (نمط CJS)
const {
  default: makeWASocket
} = (await import('@whiskeysockets/baileys')).default

// النيمد exports تُستورد مباشرةً (نفس سطر 27 في index.js)
const {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} = await import('@whiskeysockets/baileys')

// ── إعدادات البوت الثاني ──
const BOT2_SESSION = '.bot2_session'
const BOT2_NUMBER  = '201270143026'

// إنشاء مجلد الجلسة إن لم يكن موجوداً
if (!fs.existsSync(BOT2_SESSION)) {
  fs.mkdirSync(BOT2_SESSION, { recursive: true })
}

// ── دالة التشغيل الرئيسية ──
async function startBot2() {
  const { state, saveCreds } = await useMultiFileAuthState(BOT2_SESSION)
  const { version }          = await fetchLatestBaileysVersion()
  const msgRetryCounterCache = new NodeCache({ stdTTL: 0, checkperiod: 0 })

  // بانر التشغيل
  console.log(chalk.cyanBright('\n╔════════════════════════════╗'))
  console.log(chalk.cyanBright('║   🔥 𝐵𝑒𝑡ℎ𝑜 𝑏𝑜𝑡 2 يبدأ   ║'))
  console.log(chalk.cyanBright('╚════════════════════════════╝\n'))

  // ── إنشاء الـ socket بنفس الإعدادات الأصلية من index.js ──
  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ['Windows', 'Chrome', 'Chrome 114.0.5735.198'],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(
        state.keys,
        pino({ level: 'fatal' }).child({ level: 'fatal' })
      )
    },
    markOnlineOnConnect: false,
    generateHighQualityLinkPreview: true,
    syncFullHistory: false,
    keepAliveIntervalMs: 55000,
    maxIdleTimeMs: 60000,
    defaultQueryTimeoutMs: undefined,
    msgRetryCounterCache,
    getMessage: async (key) => {
      return { conversation: '' }
    }
  })

  // حفظ بيانات الاتصال تلقائياً
  sock.ev.on('creds.update', saveCreds)

  // تحديد إذا كنا بحاجة لكود اقتران (جلسة جديدة)
  const credsFile = `./${BOT2_SESSION}/creds.json`
  let _pendingNumber = null
  if (!fs.existsSync(credsFile) || !state.creds.registered) {
    _pendingNumber = BOT2_NUMBER.replace(/[^0-9]/g, '')
    console.log(chalk.yellow(`[Bot2] 🆕 جلسة جديدة — سيُطلب كود الاقتران لـ: ${_pendingNumber}\n`))
  } else {
    console.log(chalk.greenBright('✅ [Bot2] جلسة موجودة، جاري الاتصال...\n'))
  }

  // ── معالجة حالة الاتصال ──
  // ⚠️ نمط طلب كود الاقتران مطابق لـ index.js سطر 194:
  // يُطلب الكود عند connection === 'connecting' وليس فور إنشاء الـ socket
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update

    // طلب كود الاقتران عند بداية الاتصال
    if (_pendingNumber && !sock.authState.creds.registered && connection === 'connecting') {
      console.log(chalk.green.bold('\n⏳ [Bot2] جاري توليد كود الاقتران...\n'))
      await new Promise(r => setTimeout(r, 2000))
      try {
        let code = await sock.requestPairingCode(_pendingNumber)
        code = code?.match(/.{1,4}/g)?.join('-') || code
        console.log(chalk.yellowBright('┌──────────────────────────────────────┐'))
        console.log(chalk.yellowBright(`│  🔑 Bot 2 Pairing Code: ${code}  │`))
        console.log(chalk.yellowBright('└──────────────────────────────────────┘'))
        console.log(chalk.gray('📲 ادخل هذا الكود في: واتساب → الأجهزة المرتبطة → ربط جهاز\n'))
        _pendingNumber = null // لا تطلب مرة ثانية
      } catch (pairErr) {
        console.error(chalk.red('❌ [Bot2] فشل طلب كود الاقتران:'), pairErr?.message || pairErr)
      }
    }

    // اتصال ناجح
    if (connection === 'open') {
      const botNum  = sock.user?.id?.split(':')[0] || BOT2_NUMBER
      const botName = sock.user?.name || '𝐵𝑒𝑡ℎ𝑜 𝑏𝑜𝑡 2'
      console.log(chalk.hex('#FFA500').bold('\n┌───────────────────────────────────┐'))
      console.log(chalk.hex('#FFA500').bold('│') + chalk.green.bold('     ✅ Bot 2 متصل بنجاح! 🔥     ') + chalk.hex('#FFA500').bold('│'))
      console.log(chalk.hex('#FFA500').bold('├───────────────────────────────────┤'))
      console.log(chalk.hex('#FFA500').bold('│') + chalk.white(` Name   : `) + chalk.cyan(botName.padEnd(27)) + chalk.hex('#FFA500').bold('│'))
      console.log(chalk.hex('#FFA500').bold('│') + chalk.white(` Number : `) + chalk.cyan(botNum.padEnd(27))  + chalk.hex('#FFA500').bold('│'))
      console.log(chalk.hex('#FFA500').bold('├───────────────────────────────────┤'))
      console.log(chalk.hex('#FFA500').bold('│') + chalk.magentaBright(' 𝐵𝑒𝑡ℎ𝑜 𝑏𝑜𝑡 2 — وضع كريزي نشط 🔥 ') + chalk.hex('#FFA500').bold('│'))
      console.log(chalk.hex('#FFA500').bold('└───────────────────────────────────┘\n'))
    }

    // انقطاع الاتصال
    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode

      // logout أو جلسة منتهية → مسح الجلسة والخروج
      if (DisconnectReason.loggedOut === reason || [401, 440, 428, 405].includes(reason)) {
        console.log(chalk.redBright(`❌ [Bot2] تم تسجيل الخروج (${reason}) — جاري مسح الجلسة...`))
        try {
          const files = fs.readdirSync(BOT2_SESSION)
          for (const f of files) {
            try { fs.unlinkSync(`./${BOT2_SESSION}/${f}`) } catch {}
          }
        } catch {}
        process.exit(0)
      }

      // انقطاع مؤقت → تنظيف الـ listeners ثم إعادة الاتصال
      console.log(chalk.yellowBright(`⚠️ [Bot2] انقطع الاتصال (${reason}) — إعادة المحاولة بعد 5 ثوانٍ...`))
      // ⚠️ تنظيف listeners القديمة لمنع تسرب الذاكرة
      sock.ev.removeAllListeners()
      setTimeout(startBot2, 5000)
    }
  })

  // ── معالجة الرسائل الواردة ──
  sock.ev.on('messages.upsert', async (chatUpdate) => {
    try {
      const m = chatUpdate.messages[chatUpdate.messages.length - 1]
      if (!m || !m.message) return

      // تجاهل رسائل البوت نفسه
      if (m.key.fromMe) return

      const senderJid = m.key.participant || m.key.remoteJid || ''
      const body =
        m.message?.conversation                      ||
        m.message?.extendedTextMessage?.text          ||
        m.message?.imageMessage?.caption              ||
        m.message?.videoMessage?.caption              ||
        m.message?.buttonsResponseMessage?.selectedButtonId ||
        m.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
        ''

      if (!body.trim()) return
      console.log(chalk.cyan(`[Bot2] 📨 ${senderJid} → ${body}`))

      // ── أوامر البوت الثاني ──

      // .ping2 — فحص أن البوت شغال
      if (body === '.ping2') {
        const ms = Date.now()
        await sock.sendMessage(m.key.remoteJid, {
          text: `🏓 *Bot 2 يعمل!*\n⚡ Ping: ${Date.now() - ms}ms\n🔥 وضع كريزي نشط`
        }, { quoted: m })
        return
      }

      // .info2 — معلومات البوت الثاني
      if (body === '.info2') {
        const botNum  = sock.user?.id?.split(':')[0] || BOT2_NUMBER
        const botName = sock.user?.name || '𝐵𝑒𝑡ℎ𝑜 𝑏𝑜𝑡 2'
        const uptime  = process.uptime()
        const mins    = Math.floor(uptime / 60)
        const secs    = Math.floor(uptime % 60)
        await sock.sendMessage(m.key.remoteJid, {
          text:
            `🤖 *معلومات Bot 2*\n` +
            `━━━━━━━━━━━━━━━━━\n` +
            `📛 الاسم : ${botName}\n` +
            `📱 الرقم : ${botNum}\n` +
            `⏱️ وقت التشغيل : ${mins}د ${secs}ث\n` +
            `🔥 الوضع : كريزي نشط\n` +
            `━━━━━━━━━━━━━━━━━`
        }, { quoted: m })
        return
      }

    } catch (msgErr) {
      console.error('[Bot2] خطأ في معالجة رسالة:', msgErr)
    }
  })
}

// ── بدء التشغيل ──
startBot2().catch(err => {
  console.error(chalk.redBright('❌ [Bot2] فشل في البدء:'), err)
  process.exit(1)
})
