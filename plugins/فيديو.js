/**
 * 🎥 YouTube Video Downloader (Final Version) — ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥
 * ⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓
 * تعديل السكراب للموقع الجديد بالتوافق مع السيرفر ytdl.y2mp3.co
 */

import axios from 'axios';
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

const myCredit = `*_ .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀 _*`;

// إعداد الهيدرز الموحدة للسكراب الجديد لضمان تخطي الحماية
const customHeaders = {
    'accept': 'application/json',
    'accept-language': 'ar-SD',
    'cache-control': 'no-cache',
    'content-type': 'application/json',
    'origin': 'https://ytconvert.org',
    'pragma': 'no-cache',
    'referer': 'https://ytconvert.org/',
    'sec-ch-ua': '"Chromium";v="127", "Not)A;Brand";v="99", "Microsoft Edge Simulate";v="127", "Lemur";v="127"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36'
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const args = text ? text.split('|') : [];

    // --- المرحلة 2: تنفيذ التحميل والإرسال بالتنسيق المطلوب ---
    if (args.length === 3 && args[0] === 'getvid') {
        const url = args[1];
        const quality = args[2];
        await m.react('⏳');
        
        try {
            // إرسال طلب التحميل للسيرفر الجديد بالـ Payload الصحيح
            const apiRes = await axios.post("https://ytdl.y2mp3.co/api/v2/download", {
                url: url,
                output: { 
                    type: "video", 
                    format: "mp4", 
                    quality: quality 
                }
            }, { headers: customHeaders });

            let downloadUrl = apiRes.data.downloadUrl;
            const statusUrl = apiRes.data.statusUrl;

            // إذا لم يرجع الرابط فوراً وكان هناك رابط حالة، نتابع الحالة
            if (!downloadUrl && statusUrl) {
                // محاولة جلب الرابط بفحص الحالة في الخلفية
                for (let i = 0; i < 40; i++) {
                    const statusRes = await axios.get(statusUrl, { headers: { 'accept': 'application/json', 'user-agent': customHeaders['user-agent'] } });
                    const data = statusRes.data;
                    
                    if (data.status === "completed" || data.status === "success" || data.downloadUrl) {
                        downloadUrl = data.downloadUrl;
                        break;
                    }
                    if (data.status === "failed") throw new Error("Conversion failed");
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
            }

            if (!downloadUrl) throw new Error("Timeout or Link not found");

            // التنسيق المطلوب للرسالة
            let finalCaption = `✅ *تـم الـتـحـمـيـل بـنـجـاح!*\n\n` +
                `🎬 *الـدقة الـمختارة :* ${quality}\n` +
                `🔗 *رابط الـتحميل الـمباشر :*\n${downloadUrl}\n\n` +
                `${myCredit}`;

            // إرسال كفيديو عادي (MP4) قابل للعرض
            await conn.sendMessage(m.chat, {
                video: { url: downloadUrl },
                mimetype: 'video/mp4',
                caption: finalCaption,
            }, { quoted: m });

            return await m.react('✅');

        } catch (e) {
            console.error('⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 Download Error:', e);
            await m.react('❌');
            return m.reply(`❌ *حـصل خـطأ في التحميل.*\nتنبيه: الجودات العالية جداً (1080p+) قد لا تتوفر لبعض الفيديوهات الطويلة أو تحتاج وقتاً أطول.`);
        }
    }

    // --- المرحلة 1: عرض قائمة الجودات ---
    if (!text) return m.reply(`*_ هـلا 🍓 يـرجى وضـع رابط اليوتيوب _*\n*_ مثال: ${usedPrefix + command} https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e _*`);

    await m.react('🔍');

    try {
        // إرسال طلب مبدئي لمعرفة عنوان المقطع وفحص السيرفر
        const checkApi = await axios.post("https://ytdl.y2mp3.co/api/v2/download", {
            url: text,
            output: { 
                type: "video", 
                format: "mp4", 
                quality: "720p" 
            }
        }, { headers: customHeaders });

        const title = checkApi.data.title || "فيديو يوتيوب";
        
        // جودات التحميل المدعومة في السيرفر الجديد
        const qualities = ["360p", "480p", "720p", "1080p", "1440p"];

        const rows = qualities.map((q) => ({
            header: `دقة ${q}`,
            title: `🎬 تـحـميل بـجودة ${q}`,
            id: `${usedPrefix + command} getvid|${text}|${q}`
        }));

        let caption = `🎬 *عـنوان الـفيديو:* ${title}\n\n` +
            `*_ اخـتـر الـجـودة الـتـي تـريـدها مـن الـقـائـمة أدناه 👇 _*\n` +
            `*_ سـيصلك الـفيديو بـصـيغة MP4 للعرض الـمباشر 🍿 _*`;

        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.fromObject({ text: caption }),
                        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: myCredit }),
                        header: proto.Message.InteractiveMessage.Header.fromObject({
                            title: `*_ نـيـزوكـو - تـحـمـيل الـفيديو 🎥 _*`,
                            hasMediaAttachment: false
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: '🍥 اخـتر الـجودة',
                                    sections: [{ title: 'الـجودات الـمـتاحة 🍡', rows: rows }]
                                })
                            }]
                        })
                    })
                }
            }
        }, { quoted: m });

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
        await m.react('✅');

    } catch (e) {
        console.error('⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 Title Fetch Error:', e);
        await m.react('❌');
        m.reply("❌ *فـشل جـلب مـعلومات الـفيديو. تـأكد مـن الـرابط أو جرب لاحقاً.*");
    }
}

handler.help = ['فيديو'];
handler.tags = ['dl'];
handler.command = /^(فيديو|video|ytv)$/i;

export default handler;