// 📂 قران-قران.js — تحميل القرآن الكريم MP3
// الأمر: .قران
// متوافق مع BETHO BOT

import axios from 'axios'
import cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'

const { generateWAMessageFromContent, prepareWAMessageMedia } = (await import('@whiskeysockets/baileys')).default

// صورة افتراضية للقسم
let IMAGE_URL = "https://i.postimg.cc/7LyrBXcM/unnamed.png"

// جلسات المستخدمين
const userSessions = new Map()

// أسماء السور
const SURAH_NAMES = [
    'الفاتحة','البقرة','آل عمران','النساء','المائدة','الأنعام','الأعراف','الأنفال','التوبة','يونس',
    'هود','يوسف','الرعد','إبراهيم','الحجر','النحل','الإسراء','الكهف','مريم','طه',
    'الأنبياء','الحج','المؤمنون','النور','الفرقان','الشعراء','النمل','القصص','العنكبوت','الروم',
    'لقمان','السجدة','الأحزاب','سبأ','فاطر','يس','الصافات','ص','الزمر','غافر',
    'فصلت','الشورى','الزخرف','الدخان','الجاثية','الأحقاف','محمد','الفتح','الحجرات','ق',
    'الذاريات','الطور','النجم','القمر','الرحمن','الواقعة','الحديد','المجادلة','الحشر','الممتحنة',
    'الصف','الجمعة','المنافقون','التغابن','الطلاق','التحريم','الملك','القلم','الحاقة','المعارج',
    'نوح','الجن','المزمل','المدثر','القيامة','الإنسان','المرسلات','النبأ','النازعات','عبس',
    'التكوير','الانفطار','المطففين','الانشقاق','البروج','الطارق','الأعلى','الغاشية','الفجر','البلد',
    'الشمس','الليل','الضحى','الشرح','التين','العلق','القدر','البينة','الزلزلة','العاديات',
    'القارعة','التكاثر','العصر','الهمزة','الفيل','قريش','الماعون','الكوثر','الكافرون','النصر',
    'المسد','الإخلاص','الفلق','الناس'
]

// قراء افتراضيون مع روابط mp3quran.net
function getDefaultReciters(surahNumber) {
    const n = String(surahNumber).padStart(3, '0')
    return [
        { id: '1',  name: 'عبد الرحمن السديس',  size: '~7 MB',  url: `https://server11.mp3quran.net/sds/${n}.mp3` },
        { id: '2',  name: 'سعود الشريم',          size: '~6 MB',  url: `https://server7.mp3quran.net/shur/${n}.mp3` },
        { id: '3',  name: 'سعد الغامدي',           size: '~5 MB',  url: `https://server7.mp3quran.net/s_gmd/${n}.mp3` },
        { id: '4',  name: 'ماهر المعيقلي',         size: '~8 MB',  url: `https://server12.mp3quran.net/maher/${n}.mp3` },
        { id: '5',  name: 'مشاري العفاسي',         size: '~7 MB',  url: `https://server8.mp3quran.net/afs/${n}.mp3` },
        { id: '6',  name: 'أبو بكر الشاطري',       size: '~9 MB',  url: `https://server11.mp3quran.net/shatri/${n}.mp3` },
        { id: '7',  name: 'إدريس أبكر',            size: '~11 MB', url: `https://server6.mp3quran.net/abkr/${n}.mp3` },
        { id: '8',  name: 'خالد الجليل',           size: '~8 MB',  url: `https://server11.mp3quran.net/khalid_jalil/${n}.mp3` },
        { id: '9',  name: 'ناصر القطامي',          size: '~8 MB',  url: `https://server6.mp3quran.net/qtm/${n}.mp3` },
        { id: '10', name: 'يحيى الثبيتي',          size: '~7 MB',  url: `https://server11.mp3quran.net/thubiti/${n}.mp3` },
    ]
}

// ─── إرسال قائمة السور ───
async function sendSurahsList(conn, m, page = 1) {
    const itemsPerPage = 15
    const total = SURAH_NAMES.length
    const totalPages = Math.ceil(total / itemsPerPage)
    const startIdx = (page - 1) * itemsPerPage
    const endIdx = Math.min(startIdx + itemsPerPage, total)

    const surahRows = []
    for (let i = startIdx; i < endIdx; i++) {
        surahRows.push({
            title: `${i + 1}. سورة ${SURAH_NAMES[i]}`,
            description: '📖 اضغط للاختيار',
            id: `.قران-اختيار-سورة ${i + 1}`
        })
    }

    const navRows = []
    if (page < totalPages) navRows.push({
        title: '📖 الصفحة التالية ▶',
        description: `السور ${endIdx + 1}–${Math.min(endIdx + itemsPerPage, total)}`,
        id: '.قران-سور-التالي'
    })
    if (page > 1) navRows.push({
        title: '◀ الصفحة السابقة',
        description: `السور ${startIdx - itemsPerPage + 1}–${startIdx}`,
        id: '.قران-سور-السابق'
    })

    const userId = m.sender
    if (!userSessions.has(userId)) userSessions.set(userId, new Map())
    userSessions.get(userId).set('surahPage', page)

    const messageText =
        `🕋 *القرآن الكريم* 🕋\n` +
        `📄 الصفحة *${page}* من *${totalPages}* (${startIdx + 1}–${endIdx})\n\n` +
        `اختر السورة التي تريد تحميلها:`

    try {
        const media = await prepareWAMessageMedia(
            { image: { url: IMAGE_URL } },
            { upload: conn.waUploadToServer }
        )
        const msg = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            header: { hasMediaAttachment: true, imageMessage: media.imageMessage },
                            body: { text: messageText },
                            footer: { text: '📿 القرآن الكريم — BETHO BOT' },
                            nativeFlowMessage: {
                                buttons: [{
                                    name: 'single_select',
                                    buttonParamsJson: JSON.stringify({
                                        title: '📖 سور القرآن',
                                        sections: [{ title: 'اختر السورة', rows: [...surahRows, ...navRows] }]
                                    })
                                }]
                            }
                        }
                    }
                }
            },
            { userJid: conn.user.jid, quoted: m }
        )
        return conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    } catch {
        let text = messageText + '\n'
        for (let i = startIdx; i < endIdx; i++) text += `\n${i + 1}. ${SURAH_NAMES[i]}`
        text += `\n\n📝 للاختيار: .قران-اختيار-سورة رقم_السورة`
        return m.reply(text)
    }
}

// ─── إرسال قائمة القراء ───
async function sendRecitersList(conn, m, surahNumber, surahName) {
    const reciters = getDefaultReciters(surahNumber)

    const userId = m.sender
    if (!userSessions.has(userId)) userSessions.set(userId, new Map())
    userSessions.get(userId).set('selectedSurah', { number: surahNumber, name: surahName })

    const reciterRows = reciters.map(r => ({
        title: r.name,
        description: `📥 ${r.size} — MP3`,
        id: `.قران-تحميل ${r.id}|${surahNumber}|${encodeURIComponent(surahName)}|${encodeURIComponent(r.url)}|${encodeURIComponent(r.name)}`
    }))

    reciterRows.push({
        title: '🏠 العودة إلى قائمة السور',
        description: 'اختيار سورة أخرى',
        id: '.قران'
    })

    const messageText =
        `🎙️ *اختيار القارئ*\n` +
        `📖 السورة: *${surahName}*\n\n` +
        `اختر القارئ:`

    try {
        const media = await prepareWAMessageMedia(
            { image: { url: IMAGE_URL } },
            { upload: conn.waUploadToServer }
        )
        const msg = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            header: { hasMediaAttachment: true, imageMessage: media.imageMessage },
                            body: { text: messageText },
                            footer: { text: `📿 سورة ${surahName}` },
                            nativeFlowMessage: {
                                buttons: [{
                                    name: 'single_select',
                                    buttonParamsJson: JSON.stringify({
                                        title: '🎙️ القراء',
                                        sections: [{ title: 'اختر القارئ', rows: reciterRows }]
                                    })
                                }]
                            }
                        }
                    }
                }
            },
            { userJid: conn.user.jid, quoted: m }
        )
        return conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    } catch {
        let text = messageText + '\n'
        reciters.forEach((r, i) => { text += `\n${i + 1}. ${r.name} — ${r.size}` })
        return m.reply(text)
    }
}

// ─── تحميل وإرسال ملف MP3 ───
async function downloadAndSendMp3(conn, m, mp3Url, surahName, reciterName) {
    try {
        const response = await axios({
            method: 'GET',
            url: mp3Url,
            responseType: 'arraybuffer',
            headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://mp3quran.net/' },
            timeout: 120000
        })

        const buffer = Buffer.from(response.data)
        const fileSizeMB = (buffer.length / 1024 / 1024).toFixed(2)

        if (buffer.length > 64 * 1024 * 1024) {
            return conn.sendMessage(m.chat, {
                text: `⚠️ الملف كبير جداً (${fileSizeMB} MB)\n🔗 استمع مباشرة:\n${mp3Url}`
            }, { quoted: m })
        }

        const caption =
            `📖 *سورة ${surahName}*\n` +
            `🎙️ *القارئ:* ${reciterName}\n` +
            `📊 *الحجم:* ${fileSizeMB} MB\n` +
            `✨ استمع وتدبر`

        await conn.sendMessage(m.chat, {
            audio: buffer,
            mimetype: 'audio/mpeg',
            fileName: `سورة_${surahName}_${reciterName}.mp3`,
            ptt: false
        }, { quoted: m })

        await conn.sendMessage(m.chat, { text: caption }, { quoted: m })

    } catch (e) {
        console.error('قران — خطأ تحميل:', e.message)
        await conn.sendMessage(m.chat, {
            text: `❌ فشل تحميل سورة *${surahName}*\nقد يكون الرابط معطلاً.\n\n🔗 حاول مباشرة:\n${mp3Url}`
        }, { quoted: m })
    }
}

// ─── المعالج الرئيسي ───
const handler = async (m, { conn, text, command }) => {

    // عرض قائمة السور
    if (command === 'قران' || command === 'quran') {
        await sendSurahsList(conn, m, 1)
        return
    }

    // اختيار سورة
    if (command === 'قران-اختيار-سورة') {
        const surahNumber = parseInt(text)
        if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114)
            return m.reply('❌ رقم السورة غير صحيح (1–114)')
        await sendRecitersList(conn, m, surahNumber, SURAH_NAMES[surahNumber - 1])
        return
    }

    // الصفحة التالية
    if (command === 'قران-سور-التالي') {
        const userId = m.sender
        const currentPage = userSessions.get(userId)?.get('surahPage') || 1
        await sendSurahsList(conn, m, currentPage + 1)
        return
    }

    // الصفحة السابقة
    if (command === 'قران-سور-السابق') {
        const userId = m.sender
        const currentPage = userSessions.get(userId)?.get('surahPage') || 1
        if (currentPage <= 1) return m.reply('❌ هذه هي الصفحة الأولى')
        await sendSurahsList(conn, m, currentPage - 1)
        return
    }

    // تحميل مباشر
    if (command === 'قران-تحميل') {
        const parts = (text || '').split('|')
        if (parts.length < 5)
            return m.reply('❌ حدث خطأ في رابط التحميل')

        const [, surahNumStr, surahNameEnc, urlEnc, reciterEnc] = parts
        const surahNumber  = parseInt(surahNumStr)
        const surahName    = decodeURIComponent(surahNameEnc)
        const mp3Url       = decodeURIComponent(urlEnc)
        const reciterName  = decodeURIComponent(reciterEnc)

        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
        await downloadAndSendMp3(conn, m, mp3Url, surahName, reciterName)
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        return
    }
}

handler.help    = ['قران', 'quran']
handler.tags    = ['دين']
handler.command = [
    'قران',
    'quran',
    'قران-اختيار-سورة',
    'قران-سور-التالي',
    'قران-سور-السابق',
    'قران-تحميل'
]

export default handler
