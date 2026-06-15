// =====================================================
// bot2/index.js — البوت الثاني المستقل (وضع كريزي)
// مستقل تماماً — لا يشارك أي شيء مع البوت الأول
// =====================================================

import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  makeCacheableSignalKeyStore
} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import pino from 'pino'
import fs from 'fs'
import chalk from 'chalk'

const BOT2_SESSION = '.bot2_session'
const BOT2_NUMBER  = '201270143026'

// إنشاء مجلد الجلسة إن لم يكن موجوداً
if (!fs.existsSync(BOT2_SESSION)) {
  fs.mkdirSync(BOT2_SESSION, { recursive: true })
}

async function startBot2() {
  const { state, saveCreds } = await useMultiFileAuthState(BOT2_SESSION)
  const { version } = await fetchLatestBaileysVersion()

  console.log(chalk.cyanBright('\n╔════════════════════════════╗'))
  console.log(chalk.cyanBright('║   🔥 𝐵𝑒𝑡ℎ𝑜 𝑏𝑜𝑡 2 يبدأ   ║'))
  console.log(chalk.cyanBright('╚════════════════════════════╝\n'))

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ['Ubuntu', 'Chrome', '20.0.04'],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
    },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: false,
    syncFullHistory: false,
    keepAliveIntervalMs: 55000,
    getMessage: async () => ({ conversation: '' })
  })

  // حفظ بيانات الاتصال تلقائياً
  sock.ev.on('creds.update', saveCreds)

  // طلب كود الاقتران عند أول تشغيل بدون جلسة
  const credsFile = `./${BOT2_SESSION}/creds.json`
  if (!fs.existsSync(credsFile) || !state.creds.registered) {
    await new Promise(r => setTimeout(r, 3000))
    try {
      const rawCode = await sock.requestPairingCode(BOT2_NUMBER)
      const formattedCode = rawCode?.match(/.{1,4}/g)?.join('-') || rawCode
      console.log(chalk.yellowBright('┌─────────────────────────────────┐'))
      console.log(chalk.yellowBright(`│  🔑 Bot 2 Pairing Code: ${formattedCode}  │`))
      console.log(chalk.yellowBright('└─────────────────────────────────┘'))
      console.log(chalk.gray('📲 ادخل هذا الكود في: واتساب → الأجهزة المرتبطة → ربط جهاز\n'))
    } catch (pairingErr) {
      console.error(chalk.red('❌ فشل طلب كود الاقتران:'), pairingErr.message || pairingErr)
    }
  } else {
    console.log(chalk.greenBright('✅ Bot 2: جلسة موجودة، جاري الاتصال...\n'))
  }

  // حالة الاتصال
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update

    if (connection === 'open') {
      console.log(chalk.greenBright('✅ Bot 2 (وضع كريزي) متصل بنجاح! 🔥'))
    }

    if (connection === 'close') {
      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode
      if (statusCode === DisconnectReason.loggedOut) {
        console.log(chalk.redBright('❌ Bot 2: تم تسجيل الخروج، جاري مسح الجلسة...'))
        try {
          const sessionFiles = fs.readdirSync(BOT2_SESSION)
          for (const f of sessionFiles) {
            fs.unlinkSync(`./${BOT2_SESSION}/${f}`)
          }
        } catch {}
        process.exit(0)
      } else {
        console.log(chalk.yellowBright(`⚠️ Bot 2: انقطع الاتصال (${statusCode}), إعادة محاولة بعد 5 ثواني...`))
        setTimeout(startBot2, 5000)
      }
    }
  })

  // معالجة الرسائل الواردة (Bot 2)
  sock.ev.on('messages.upsert', async (chatUpdate) => {
    try {
      const m = chatUpdate.messages[chatUpdate.messages.length - 1]
      if (!m || !m.message || m.key.fromMe) return

      const senderJid = m.key.participant || m.key.remoteJid || ''
      const body =
        m.message?.conversation ||
        m.message?.extendedTextMessage?.text ||
        m.message?.imageMessage?.caption ||
        m.message?.videoMessage?.caption ||
        ''

      if (!body) return
      console.log(chalk.cyan(`[Bot2] 📨 ${senderJid} → ${body}`))

      // أمر ping للاختبار
      if (body === '.ping2') {
        await sock.sendMessage(m.key.remoteJid, {
          text: '🏓 *Bot 2 شغال!* — وضع كريزي نشط 🔥'
        }, { quoted: m })
      }
    } catch (msgErr) {
      console.error('[Bot2] خطأ في معالجة رسالة:', msgErr)
    }
  })
}

startBot2().catch(err => {
  console.error(chalk.redBright('❌ Bot 2 فشل في البدء:'), err)
  process.exit(1)
})
