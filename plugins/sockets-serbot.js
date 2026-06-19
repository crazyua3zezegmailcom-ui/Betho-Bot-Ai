// أوامر البوتات الفرعيه - تنصيب البوت
// BY 𝐶𝑟𝑎𝑧𝑦

const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, generateWAMessageFromContent, proto } = (await import("@whiskeysockets/baileys"))
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util'
import * as ws from 'ws'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'

let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = ""
let drm2 = ""

// رسائل بسيطة ومنطقية بدون زخارف مفرطة
let rtx = `📱 *وضع البوت الفرعي - رمز QR*

1️⃣ اضغط على النقاط الثلاث أعلى التطبيق
2️⃣ اختر "الأجهزة المرتبطة" (Linked Devices)
3️⃣ امسح رمز QR هذا لتسجيل البوت

⚠️ ملاحظة: ينتهي صلاحية الرمز خلال 45 ثانية`.trim()

let rtx2 = `🔢 *وضع البوت الفرعي - كود *

1️⃣ اضغط على النقاط الثلاث أعلى التطبيق
2️⃣ اختر "الأجهزة المرتبطة" (Linked Devices)
3️⃣ اختر "ربط باستخدام رقم الهاتف" (Link with phone number)
4️⃣ أدخل الكود الظاهر أدناه لبدء الجلسة

⚠️ لا يُنصح باستخدام حسابك الرئيسي`.trim()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const yukiJBOptions = {}
if (global.conns instanceof Array) console.log()
else global.conns = []

function isSubBotConnected(jid) {
    return global.conns.some(sock => sock?.user?.jid && sock.user.jid.split("@")[0] === jid.split("@")[0])
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // ── التحقق من تفعيل الخاصية (للبوت الرئيسي فقط، للفرعي يُسمح دائماً) ──
    const botSettings = globalThis.db.data.settings?.[conn.user.jid]
    if (botSettings && botSettings.jadibotmd === false)
        return m.reply(`⚠️ أمر *${command}* معطل حالياً.`)

    // ── Cooldown: 2 دقيقة بين كل تنصيب ──
    const userData = global.db.data.users[m.sender]
    const lastSubs = userData?.Subs || 0
    const cooldownLeft = 120000 - (Date.now() - lastSubs)
    if (cooldownLeft > 0)
        return conn.reply(m.chat, `⏳ يرجى الانتظار ${msToTime(cooldownLeft)} قبل إعادة ربط بوت فرعي.`, m)

    // ── حد أقصى 200 بوت فرعي ──
    let socklimit = global.conns.filter(sock => sock?.user).length
    if (socklimit >= 200)
        return m.reply(`🚫 لا توجد أماكن متاحة للبوتات الفرعيه حالياً. حاول لاحقاً.`)

    let mentionedJid = await m.mentionedJid
    let who = mentionedJid && mentionedJid[0] ? mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let id = `${who.split`@`[0]}`
    let pathYukiJadiBot = path.join(`./${jadi}/`, id)
    if (!fs.existsSync(pathYukiJadiBot)) {
        fs.mkdirSync(pathYukiJadiBot, { recursive: true })
    }
    yukiJBOptions.pathYukiJadiBot = pathYukiJadiBot
    yukiJBOptions.m = m
    yukiJBOptions.conn = conn
    yukiJBOptions.args = args
    yukiJBOptions.usedPrefix = usedPrefix
    yukiJBOptions.command = command
    yukiJBOptions.fromCommand = true
    yukiJadiBot(yukiJBOptions)
    if (userData) userData.Subs = Date.now()
}

handler.help    = ['تنصيب']
handler.tags    = ['serbot']
handler.command = ['تنصيب']
handler.bot     = false

export default handler

export async function yukiJadiBot(options) {
    let { pathYukiJadiBot, m, conn, args, usedPrefix, command } = options

    // تحديد إذا كان الأمر هو النوع الثاني (كود رقمي) بدلاً من QR
    let isCodeMode = true

    let mcode = isCodeMode
    args = args.filter(a => a !== '--code' && a !== 'code')

    let txtCode, codeBot, txtQR
    const pathCreds = path.join(pathYukiJadiBot, "creds.json")
    if (!fs.existsSync(pathYukiJadiBot)) {
        fs.mkdirSync(pathYukiJadiBot, { recursive: true })
    }
    try {
        args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
    } catch {
        conn.reply(m.chat, `❌ الرجاء استخدام الأمر بشكل صحيح: ${usedPrefix + command}`, m)
        return
    }

    const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
    exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
        const drmer = Buffer.from(drm1 + drm2, `base64`)
        let { version, isLatest } = await fetchLatestBaileysVersion()
        const msgRetry = (MessageRetryMap) => { }
        const msgRetryCache = new NodeCache()
        const { state, saveState, saveCreds } = await useMultiFileAuthState(pathYukiJadiBot)
        const connectionOptions = {
            logger: pino({ level: "fatal" }),
            printQRInTerminal: false,
            auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
            msgRetry,
            msgRetryCache,
            browser: ['Windows', 'Firefox'],
            version: version,
            generateHighQualityLinkPreview: true
        }
        let sock = makeWASocket(connectionOptions)
        sock.isInit = false
        let isInit = true

        setTimeout(async () => {
            if (!sock.user) {
                try { fs.rmSync(pathYukiJadiBot, { recursive: true, force: true }) } catch { }
                try { sock.ws?.close() } catch { }
                sock.ev.removeAllListeners()
                let i = global.conns.indexOf(sock)
                if (i >= 0) global.conns.splice(i, 1)
                console.log(`[تنظيف] جلسة ${path.basename(pathYukiJadiBot)} حُذفت: بيانات غير صالحة.`)
            }
        }, 60000)

        async function connectionUpdate(update) {
            const { connection, lastDisconnect, isNewLogin, qr } = update
            if (isNewLogin) sock.isInit = false

            // حالة عرض QR (طريقة QR العادية)
            if (qr && !mcode) {
                if (m?.chat) {
                    txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim() }, { quoted: m })
                } else {
                    return
                }
                if (txtQR && txtQR.key) {
                    setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key }) }, 30000)
                }
                return
            }

            // حالة عرض الكود الرقمي (طريقة code)
            if (qr && mcode) {
                let secret = await sock.requestPairingCode((m.sender.split`@`[0]), 'BETHO123')
                secret = secret.match(/.{1,4}/g)?.join("-") || secret
                console.log('[تنصيب] كود الاقتران:', secret)

                // إرسال صورة الدليل
                txtCode = await conn.sendMessage(m.chat, {
                    image: { url: 'https://i.postimg.cc/Fsx4fvfK/IMG-20260610-WA0075.jpg' },
                    caption: rtx2
                }, { quoted: m })

                // إرسال الكود مع زر "نسخ الكود"
                try {
                    const codeWAMsg = generateWAMessageFromContent(
                        m.chat,
                        {
                            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                                body: {
                                    text: `🔑 *كود الاقتران للبوت الفرعي:*\n\n\`\`\`${secret}\`\`\`\n\n_اضغط الزر لنسخ الكود تلقائياً_`
                                },
                                footer: { text: '© BETHO BOT' },
                                header: proto.Message.InteractiveMessage.Header.fromObject({
                                    hasMediaAttachment: false
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                    buttons: [{
                                        name: 'cta_copy',
                                        buttonParamsJson: JSON.stringify({
                                            display_text: '📋 نسخ الكود',
                                            copy_code: secret
                                        })
                                    }],
                                    messageParamsJson: ''
                                })
                            })
                        },
                        { userJid: conn.user.id, quoted: m }
                    )
                    codeBot = await conn.relayMessage(m.chat, codeWAMsg.message, { messageId: codeWAMsg.key.id })
                } catch (e) {
                    // fallback: إرسال نص عادي لو فشل الزر التفاعلي
                    console.error('[تنصيب] فشل زر النسخ، fallback للنص:', e.message)
                    codeBot = await conn.sendMessage(m.chat, {
                        text: `🔑 *كود الاقتران:*\n\n\`\`\`${secret}\`\`\``
                    }, { quoted: m })
                }
            }
            if (txtCode && txtCode.key) {
                setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key }) }, 30000)
            }
            if (codeBot && codeBot?.key) {
                setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key }) }, 30000)
            }

            const endSesion = async (loaded) => {
                if (!loaded) {
                    try { sock.ws.close() } catch { }
                    sock.ev.removeAllListeners()
                    let i = global.conns.indexOf(sock)
                    if (i < 0) return
                    delete global.conns[i]
                    global.conns.splice(i, 1)
                }
            }

            const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
            if (connection === 'close') {
                if (reason === 428) {
                    console.log(chalk.bold.magentaBright(`\n[!] تم إغلاق الجلسة (+${path.basename(pathYukiJadiBot)}) فجأة. جارٍ إعادة الاتصال...`))
                    await creloadHandler(true).catch(console.error)
                }
                if (reason === 408) {
                    console.log(chalk.bold.magentaBright(`\n[!] فقدان الاتصال (+${path.basename(pathYukiJadiBot)}). إعادة محاولة...`))
                    await creloadHandler(true).catch(console.error)
                }
                if (reason === 440) {
                    console.log(chalk.bold.magentaBright(`\n[!] تم استبدال الجلسة (+${path.basename(pathYukiJadiBot)}) بجلسة جديدة.`))
                    try {
                        if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathYukiJadiBot)}@s.whatsapp.net`, { text: '⚠️ تم اكتشاف جلسة جديدة، احذف الجلسة القديمة للمواصلة.' }, { quoted: m || null }) : ""
                    } catch (error) { }
                }
                if (reason == 405 || reason == 401) {
                    console.log(chalk.bold.magentaBright(`\n[!] الجلسة (+${path.basename(pathYukiJadiBot)}) أغلقت: بيانات غير صالحة.`))
                    try {
                        if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathYukiJadiBot)}@s.whatsapp.net`, { text: '⚠️ الجلسة معلقة. حاول إعادة الاتصال.' }, { quoted: m || null }) : ""
                    } catch (error) { }
                    fs.rmdirSync(pathYukiJadiBot, { recursive: true })
                }
                if (reason === 500) {
                    console.log(chalk.bold.magentaBright(`\n[!] فقد الاتصال للجلسة (+${path.basename(pathYukiJadiBot)}). جارٍ حذف البيانات...`))
                    if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathYukiJadiBot)}@s.whatsapp.net`, { text: '⚠️ تم فقد الاتصال. حاول يدوياً.' }, { quoted: m || null }) : ""
                    return creloadHandler(true).catch(console.error)
                }
                if (reason === 515) {
                    console.log(chalk.bold.magentaBright(`\n[!] إعادة تشغيل تلقائية للجلسة (+${path.basename(pathYukiJadiBot)}).`))
                    await creloadHandler(true).catch(console.error)
                }
                if (reason === 403) {
                    console.log(chalk.bold.magentaBright(`\n[!] الجلسة (+${path.basename(pathYukiJadiBot)}) أغلقت أو الحساب قيد الدعم.`))
                    fs.rmdirSync(pathYukiJadiBot, { recursive: true })
                }
            }

            if (global.db.data == null) loadDatabase()
            if (connection == `open`) {
                if (!global.db.data?.users) loadDatabase()
                await joinChannels(conn)
                let userName, userJid
                userName = sock.authState.creds.me.name || 'مجهول'
                userJid = sock.authState.creds.me.jid || `${path.basename(pathYukiJadiBot)}@s.whatsapp.net`
                console.log(chalk.bold.cyanBright(`\n✅ بوت فرعي جديد: ${userName} (+${path.basename(pathYukiJadiBot)}) تم الاتصال بنجاح.`))
                sock.isInit = true
                global.conns.push(sock)
                m?.chat ? await conn.sendMessage(m.chat, { text: isSubBotConnected(m.sender) ? `@${m.sender.split('@')[0]}، أنت متصل بالفعل.` : `✅ تم تسجيل بوت فرعي جديد! [@${m.sender.split('@')[0]}]\nيمكنك استخدام *infobot#* لعرض المعلومات.`, mentions: [m.sender] }, { quoted: m }) : ''
            }
        }

        setInterval(async () => {
            if (!sock.user) {
                try { sock.ws.close() } catch (e) { }
                sock.ev.removeAllListeners()
                let i = global.conns.indexOf(sock)
                if (i < 0) return
                delete global.conns[i]
                global.conns.splice(i, 1)
            }
        }, 60000)

        let handler = await import('../handler.js')
        let creloadHandler = async function (restatConn) {
            try {
                const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
                if (Object.keys(Handler || {}).length) handler = Handler
            } catch (e) {
                console.error('⚠️ خطأ: ', e)
            }
            if (restatConn) {
                const oldChats = sock.chats
                try { sock.ws.close() } catch { }
                sock.ev.removeAllListeners()
                sock = makeWASocket(connectionOptions, { chats: oldChats })
                isInit = true
            }
            if (!isInit) {
                sock.ev.off("messages.upsert", sock.handler)
                sock.ev.off("connection.update", sock.connectionUpdate)
                sock.ev.off('creds.update', sock.credsUpdate)
            }
            sock.handler = handler.handler.bind(sock)
            sock.connectionUpdate = connectionUpdate.bind(sock)
            sock.credsUpdate = saveCreds.bind(sock, true)
            sock.ev.on("messages.upsert", sock.handler)
            sock.ev.on("connection.update", sock.connectionUpdate)
            sock.ev.on("creds.update", sock.credsUpdate)
            isInit = false
            return true
        }
        creloadHandler(false)
    })
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
    hours = (hours < 10) ? '0' + hours : hours
    minutes = (minutes < 10) ? '0' + minutes : minutes
    seconds = (seconds < 10) ? '0' + seconds : seconds
    return minutes + ' دقيقة و ' + seconds + ' ثانية'
}

async function joinChannels(sock) {
    for (const value of Object.values(global.ch)) {
        if (typeof value === 'string' && value.endsWith('@newsletter')) {
            await sock.newsletterFollow(value).catch(() => { })
        }
    }
}