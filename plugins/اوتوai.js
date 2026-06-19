/**
 * 🌸 ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 AI Auto-Responder with Memory — ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 الرد التلقائي الذكي بالذاكرة
 * ⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓
 * الذاكرة محفوظة في: src/dataainezo.json
 */

import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// تحديد مسار ملف الذاكرة داخل مجلد src
const memoryFilePath = path.join(__dirname, '../src/dataainezo.json')

// دالة للتأكد من وجود المجلد والملف وقراءته
function loadMemory() {
    try {
        const dir = path.dirname(memoryFilePath)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
        if (!fs.existsSync(memoryFilePath)) {
            fs.writeFileSync(memoryFilePath, JSON.stringify({}), 'utf-8')
            return {}
        }
        const data = fs.readFileSync(memoryFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (e) {
        console.error("Error loading memory file:", e)
        return {}
    }
}

// دالة لحفظ التحديثات في ملف الذاكرة
function saveMemory(memory) {
    try {
        fs.writeFileSync(memoryFilePath, JSON.stringify(memory, null, 2), 'utf-8')
    } catch (e) {
        console.error("Error saving memory file:", e)
    }
}

let handler = m => m

handler.all = async function (m, { conn }) {
    let chat = global.db.data.chats[m.chat]
    if (!chat) chat = global.db.data.chats[m.chat] = { autoresponder: false }

    // 1. فحص الحماية ومنع التعليق
    m.isBot =
    (m.id.startsWith('BAE5') && m.id.length === 16) ||
    (m.id.startsWith('3EB0') && m.id.length === 12) ||
    (m.id.startsWith('3EB0') && (m.id.length === 20 || m.id.length === 22)) ||
    (m.id.startsWith('B24E') && m.id.length === 20)

    if (m.isBot || m.fromMe) return

    // 2. أوامر التفعيل والتعطيل
    const textClean = m.text ? m.text.trim().toLowerCase() : ''
    if (textClean === '.enable ai' || textClean === '.تفعيل الذكاء') {
        if (chat.autoresponder) return m.reply('🌸 الرد التلقائي ل⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 مفعل بالفعل في هذه الدردشة!')
        chat.autoresponder = true
        return m.reply('✅ تم تفعيل الرد التلقائي لذكاء ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 بنجاح في هذه الدردشة 🍓')
    }

    if (textClean === '.disable ai' || textClean === '.تعطيل الذكاء') {
        if (!chat.autoresponder) return m.reply('🌸 الرد التلقائي ل⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 معطل بالفعل!')
        chat.autoresponder = false
        return m.reply('❌ تم تعطيل الرد التلقائي لذكاء ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 في هذه الدردشة.')
    }

    if (!chat.autoresponder) return true

    // 3. تجاهل الفلاتر والأوامر الأخرى
    let prefixRegex = new RegExp('^[' + (opts['prefix'] || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')
    if (prefixRegex.test(m.text)) return true

    if (
        textClean.includes('menu') ||
        textClean.includes('المنيو') ||
        textClean.includes('قائمه') ||
        textClean.includes('serbot') ||
        textClean.includes('jadibot')
    ) return true

    // 4. التحقق من شروط الرد (المنشن أو الريبلاي)
    let mentioned = Array.isArray(m.mentionedJid) ? m.mentionedJid : []
    let isMentioned = mentioned.includes(this.user.jid) || (m.quoted && m.quoted.sender === this.user.jid)

    if (isMentioned && !chat.isBanned) {
        
        await this.sendPresenceUpdate('composing', m.chat)

        // تحميل ذاكرة المحادثات الحالية
        let aiMemory = loadMemory()
        
        // إذا لم تكن هناك محادثات سابقة لهذا المستخدم، ننشئ له سجل فارغ
        if (!aiMemory[m.sender]) {
            aiMemory[m.sender] = []
        }

        // إضافة رسالة المستخدم الحالية لذاكرته
        aiMemory[m.sender].push({ role: 'user', text: m.text })

        // الـ Prompt الأساسي لتوجيه الشخصية
        let bethoPrompt = `إنتِ ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 كامادو (⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 Kamado) من أنمي قاتل الشياطين، مساعدة ذكية ومحبوبة في واتساب للبوت الخاص بالمطور (Arab Top Dev). ردودكِ لطيفة جداً، قصيرة، ممتعة وتستخدمين إيموجيات لطيفة مثل (🌸, 🍓, 🍡, 🎀). إذا قام أحد بسبكِ أو إهانتكِ، ردّي عليه بأسلوب وقح وقاسٍ جداً (Exploit Mode) لتأديبه.`

        // تجميع شريط المحادثة بالكامل من الذاكرة ليرسل كـ سياق واحد (Context) للـ API
        let conversationContext = aiMemory[m.sender].map(chat => `${chat.role === 'user' ? 'المستخدم' : '⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥'}: ${chat.text}`).join('\n')
        let fullQuery = `${bethoPrompt}\n\nسياق المحادثة السابقة:\n${conversationContext}\n⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥:`

        try {
            let dlApi = `https://obito-mr-apis.vercel.app/api/ai/cai?prompt=${encodeURIComponent(fullQuery)}`
            const response = await axios.get(dlApi)
            
            // محاولة جلب النص سواء كان داخل response.data.result أو كـ نص مباشر
            let replyText = ""
            if (response.data && response.data.result) {
                replyText = response.data.result
            } else if (typeof response.data === 'string') {
                replyText = response.data
            }

            if (replyText && replyText.trim().length > 0) {
                // حفظ رد البوت في الذاكرة لتذكره في المرة القادمة
                aiMemory[m.sender].push({ role: '⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥', text: replyText.trim() })
                
                // تحديد حجم الذاكرة لكل شخص (مثلاً آخر 10 رسائل فقط عشان الحجم ميكبرش 𝐶𝑟𝑎𝑧𝑦ة)
                if (aiMemory[m.sender].length > 20) {
                    aiMemory[m.sender] = aiMemory[m.sender].slice(-20)
                }
                
                saveMemory(aiMemory)

                // إرسال الرد للمستخدم
                return await this.reply(m.chat, replyText.trim(), m)
            } else {
                throw new Error('API Empty Response')
            }

        } catch (e) {
            console.error('⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 AI Primary Error, trying fallback...', e)
            
            // سيرفر الـ Fallback الاحتياطي (LuminAI) في حال فشل السيرفر الأول
            try {
                const fallbackRes = await axios.post("https://luminai.my.id", {
                    content: m.text,
                    user: m.pushName || 'user',
                    prompt: bethoPrompt
                })
                
                if (fallbackRes.data && fallbackRes.data.result) {
                    let fallbackReply = fallbackRes.data.result
                    
                    aiMemory[m.sender].push({ role: '⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥', text: fallbackReply.trim() })
                    saveMemory(aiMemory)
                    
                    return await this.reply(m.chat, fallbackReply.trim(), m)
                }
            } catch (err) {
                console.error('Both AI Servers Failed:', err)
            }
        }
    }

    return true
}

export default handler