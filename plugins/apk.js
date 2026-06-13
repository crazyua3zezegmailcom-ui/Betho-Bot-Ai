// apk.js - تحميل تطبيقات أندرويد من Aptoide بنظام الأزرار 🍉
// مطور بواسطة 𝐶𝑟𝑎𝑧𝑦 3ℝΑＢ 𝒅𝒆𝒗𝒔 👑

import { search, download } from 'aptoide-scraper';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tmpDir = path.join(__dirname, 'tmp');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

const MAX_UPLOAD_SIZE_MB = 230;
const myCredit = `.𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢`;
const emojis = `ⲂＹ 𝐶𝑟𝑎𝑧𝑦 3ℝΑＢ 𝒅𝒆𝒗𝒔 🥝👑`;

function formatSize(bytes) {
    if (!bytes || bytes === 0) return 'غير معروف';
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(2) + ' MB';
}

// دالة إضافية لجلب التفاصيل الكاملة (نظام الأندرويد) من صفحة التطبيق على Aptoide
async function getFullDetails(appId) {
    try {
        // استخدام واجهة download من aptoide-scraper تعطينا معظم المعلومات
        let info = await download(appId);
        // قد لا تحتوي على android_ver، نستخرجها من الـ id أو من رابط آخر
        // لكن سنضيف قيمة تقديرية
        let androidVer = info.android_ver || 'غير محدد';
        return {
            name: info.name,
            package: info.package,
            size: info.size,
            icon: info.icon,
            dllink: info.dllink,
            lastup: info.lastup,
            androidVer: androidVer
        };
    } catch (e) {
        console.error('جلب التفاصيل:', e);
        return null;
    }
}

async function downloadApk(url, outputPath) {
    const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
        timeout: 60000
    });
    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // معالجة اختيار التطبيق من الأزرار
    if (args.length === 2 && args[0] === 'select') {
        let appId = args[1];
        await m.react('⏳');
        try {
            let details = await getFullDetails(appId);
            if (!details || !details.dllink) throw new Error('لا يمكن الحصول على رابط التحميل');
            
            let sizeInMB = parseFloat(details.size);
            let caption = `🍇🍍🌴🍀🌳🌿🫠

╮───≪📱 *تطبيق* 📱≫───╭
│ ⌬ *الاسم:* ${details.name}
│ ⌬ *الحزمة:* ${details.package}
│ ⌬ *الحجم:* ${details.size}
│ ⌬ *نظام التشغيل:* Android 
│ ⌬ *آخر تحديث:* ${details.lastup || 'غير معروف'}
╯───≪ 🌿🍉🍡 ≫───╰ 

⏳ *جاري التحميل و الإرسال...*`;

            // إرسال صورة التطبيق والمعلومات
            await conn.sendFile(m.chat, details.icon, details.name + '.jpg', caption, m);

            if (sizeInMB <= MAX_UPLOAD_SIZE_MB) {
                let fileName = `${details.name.replace(/[^a-zA-Z0-9]/g, '_')}.apk`;
                let filePath = path.join(tmpDir, `${Date.now()}_${fileName}`);
                await downloadApk(details.dllink, filePath);
                await conn.sendMessage(m.chat, {
                    document: fs.readFileSync(filePath),
                    mimetype: 'application/vnd.android.package-archive',
                    fileName: fileName,
                    caption: myCredit
                }, { quoted: m });
                fs.unlinkSync(filePath);
                await m.react('✅');
            } else {
                let largeCaption = `⚠️ *حجم التطبيق عالي جداً!* ❌

*الحجم المسموح به:* ${MAX_UPLOAD_SIZE_MB} MB
*حجم ملفك الحالي:* ${details.size}

📥 *رابط التحميل المباشر:* ${details.dllink}

*من الأفضل تنزيله مباشر من الرابط أعلاه.*`;

                const interactiveMsg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                                body: proto.Message.InteractiveMessage.Body.fromObject({ text: largeCaption }),
                                footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: myCredit }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                    buttons: [{
                                        name: "cta_url",
                                        buttonParamsJson: JSON.stringify({
                                            display_text: "🌿 تحميل مباشر 🫰",
                                            url: details.dllink
                                        })
                                    }]
                                })
                            })
                        }
                    }
                }, { quoted: m });
                await conn.relayMessage(m.chat, interactiveMsg.message, { messageId: interactiveMsg.key.id });
                await m.react('⚠️');
            }
        } catch (error) {
            console.error(error);
            await m.reply(`❌ *بيثو AI* ❌\n\nحدث خطأ أثناء تحميل التطبيق.\n${error.message || 'حاول مرة أخرى'}\n\n${myCredit}`);
            await m.react('❌');
        }
        return;
    }

    // الأمر الرئيسي: البحث
    if (!args[0]) {
        return m.reply(`🍇 *أمر تحميل التطبيقات* 🍇\n\n⌬ الاستخدام:\n${usedPrefix}apk <اسم التطبيق>\n\n⌬ مثال:\n${usedPrefix}apk فيسبوك\n${usedPrefix}apk واتساب\n\n${myCredit}`);
    }

    await m.react('🔍');
    let query = args.join(' ');

    try {
        let searchResults = await search(query);
        if (!searchResults || searchResults.length === 0) {
            return m.reply(`🍃 *بيثو AI* 🍃\n\n⌬ لم أستطع العثور على تطبيق بهذا الاسم.\n⌬ حاول اسم آخر.\n\n${myCredit}`);
        }

        // عرض أول تطبيق كصورة مصغرة (اختياري)
        let firstApp = searchResults[0];
        if (firstApp.icon) {
            await conn.sendMessage(m.chat, {
                image: { url: firstApp.icon },
                caption: `🔎 *نتائج البحث عن:* ${query}\nتم العثور على ${searchResults.length} تطبيق. اختر من القائمة أدناه.`
            }, { quoted: m });
        } else {
            await m.reply(`🔎 *نتائج البحث عن:* ${query}\nتم العثور على ${searchResults.length} تطبيق. اختر من القائمة أدناه.`);
        }

        // بناء قائمة الأزرار (حد أقصى 10)
        const rows = searchResults.slice(0, 10).map((app, idx) => ({
            title: app.name,
            description: `📦 ${app.package || 'غير معروف'} | 📏 ${app.size || '?'}`,
            id: `${usedPrefix}apk select ${app.id}`
        }));

        const interactiveMsg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.fromObject({
                            text: `*_ اختر التطبيق الذي تريد تحميله:_*`
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: myCredit }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "📱 قائمة التطبيقات",
                                    sections: [{ title: "نتائج البحث", rows }]
                                })
                            }]
                        })
                    })
                }
            }
        }, { quoted: m });

        await conn.relayMessage(m.chat, interactiveMsg.message, { messageId: interactiveMsg.key.id });
        await m.react('✅');
    } catch (error) {
        console.error(error);
        await m.reply(`❌ *بيثو AI* ❌\n\nحدث خطأ أثناء البحث.\n${error.message || 'حاول مرة أخرى'}\n\n${myCredit}`);
        await m.react('❌');
    }
};

handler.help = ['apk <اسم التطبيق>'];
handler.tags = ['downloader'];
handler.command = /^(apk|تطبيق|بلاي)$/i;
handler.limit = true;

export default handler;