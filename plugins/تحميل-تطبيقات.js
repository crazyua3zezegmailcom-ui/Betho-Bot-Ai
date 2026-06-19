import axios from 'axios';
import * as cheerio from 'cheerio';
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

// الحقوق والستايل
const myCredit = `*_ .𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 _*`;
const emojis = `𝐵𝑦 𝐶𝑟𝑎𝑧𝑦 👑`;

const HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // التحقق إذا كان الضغط من زر التحميل
    if (text && text.startsWith('pkg_dl|')) {
        let pkgUrl = text.split('|')[1];
        await m.react('⏳');
        
        try {
            // 1. الدخول لصفحة التطبيق لجلب المعلومات
            const { data: appData } = await axios.get(pkgUrl, { headers: HEADERS });
            let $ = cheerio.load(appData);
            
            const appName = $('.details-sdk span').text() || $('h1').text().trim();
            const appIcon = $('.main-info img').attr('src') || 'https://i.postimg.cc/Fsx4fvfK/IMG-20260610-WA0075.jpg';
            const packageName = pkgUrl.split('/').pop().split('?')[0];
            const dlPageBtn = $('a.normal-download-btn').attr('href');
            
            if (!dlPageBtn) return m.reply("❌ احم مش لاقي زر التحميل.");
            const dlPageUrl = dlPageBtn.startsWith('http') ? dlPageBtn : 'https://apkpure.com' + dlPageBtn;

            // 2. الدخول لصفحة التحميل لجلب الرابط النهائي
            const { data: dlPageData } = await axios.get(dlPageUrl, { headers: HEADERS });
            $ = cheerio.load(dlPageData);
            const finalLink = $('#download_link').attr('href') || $('.ga').attr('href');

            if (!finalLink) return m.reply("❌ فشل استخراج الرابط المباشر.");

            // 3. فحص الحجم (HEAD Request)
            const head = await axios.head(finalLink, { headers: HEADERS }).catch(() => null);
            const sizeBytes = head?.headers['content-length'] || 0;
            const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(2);

            if (sizeMB > 400) {
                return m.reply(`*_ حجم التطبيق عالي جداً! ❌ _*\n\n*_ الحجم المسموح به: 400 MB _*\n*_ حجم ملفك: ${sizeMB} MB _*`);
            }

            const caption = `
╭───≪ ⚙️ 𝗔𝗣𝗞 ⚙️ ≫───╮
│ ⌬ اسـم التطبيق : ${appName}
│ ⌬ اسـم الحـزمه : ${packageName}
│ ⌬ الـحجم : ${sizeMB} MB
│ ⌬ رابـط مباشر : [Click]
╯───≪ 🫐🪻🧩 ≫───╰

*_ جـاري التحـميل و الارسـال...... ⏳ _*`.trim();

            // إرسال صورة التطبيق والمعلومات
            await conn.sendMessage(m.chat, { image: { url: appIcon }, caption }, { quoted: m });

            // 4. تحميل الملف وإرساله
            const appBuffer = await axios.get(finalLink, { responseType: 'arraybuffer', headers: HEADERS });
            await conn.sendMessage(m.chat, { 
                document: Buffer.from(appBuffer.data), 
                mimetype: 'application/vnd.android.package-archive', 
                fileName: `${appName}.apk` 
            }, { quoted: m });

            return await m.react('✅');

        } catch (e) {
            console.error(e);
            return m.reply("❌ حدث خطأ أثناء جلب الرابط أو التحميل.");
        }
    }

    // أمر البحث الأساسي
    if (!text) return m.reply(`*_ احم 🫠 _*\n\n*_ يـرجـى كـتـابـة اسـم الـتـطـبـيـق بـعـد الأمـر _*\n*_ مـثـال: ${usedPrefix + command} WhatsApp _*`);

    await m.react('🔍');
    try {
        const searchUrl = `https://apkpure.com/ar/search?q=${encodeURIComponent(text)}`;
        const { data } = await axios.get(searchUrl, { headers: HEADERS });
        const $ = cheerio.load(data);
        
        let rows = [];
        $('li dl').each((i, el) => {
            if (i < 15) { // عرض 15 نتيجة
                const name = $(el).find('p.p1').text().trim();
                const link = $(el).find('a.dd').attr('href');
                if (name && link) {
                    const fullLink = link.startsWith('http') ? link : 'https://apkpure.com' + link;
                    rows.push({
                        header: `الـنـتـيـجـة ${i + 1}`,
                        title: `📥 ${name}`,
                        id: `${usedPrefix + command} pkg_dl|${fullLink}`
                    });
                }
            }
        });

        if (rows.length === 0) return m.reply("*_ ❌ لـم يـتـم الـعـثـور عـلـى تـطـبـيـق بـهـذا الاسـم _*");

        // إنشاء رسالة الأزرار
        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.fromObject({
                            text: `*_ هـلا 🫠 _*\n\n*_ نـتـائج الـبحث عـن: ${text} _*\n*_ اخـتـر الـتـطـبـيـق مـن الـقـائـمـة لـتحـميلـه فـوراً ✨ _*`
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: myCredit }),
                        header: proto.Message.InteractiveMessage.Header.fromObject({
                            title: `*_ 📥 مـحـمـل تـطـبـيـقـات بيثو 📥 _*`,
                            hasMediaAttachment: false
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: 'قـائـمـة الـتـطبـيـقـات 🍥',
                                    sections: [{
                                        title: 'اخـتـر لـلـتـحمـيـل الـمبـاشـر 🍡',
                                        rows: rows
                                    }]
                                })
                            }]
                        })
                    })
                }
            }
        }, { quoted: m });

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (e) {
        console.error(e);
        m.reply("❌ حدث خطأ في محرك البحث.");
    }
};

handler.help = ['تطبيق'];
handler.tags = ['download'];
handler.command = /^(تطبيق|app)$/i;

export default handler;