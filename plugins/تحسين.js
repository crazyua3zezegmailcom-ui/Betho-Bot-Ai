/**
 * 📸 AI Photo Upscaler HD — ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 لتحسين جودة الصور بدقة فائقة
 * ⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓
 * التوافقية: معالجة مباشرة عبر الـ API الفوري والرفع التلقائي على حسابك في Catbox
 */

import axios from 'axios';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

const myCredit = `*_ .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓 _*`;

const handler = async (m, { conn, args, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";
    
    // التحقق من أن المرفق عبارة عن صورة حصراً
    if (!/image\/(png|jpe?g|webp)/.test(mime)) {
        return m.reply(`*🌸 هـلا يـا غـالـي، يـرجـى الـرد عـلـى صـورة لـتـحـسـيـن جـودتـهـا إلـى دِقّـة HD! ✨*\n\n💡 *ميزة اختيار الجودة:*\n• \`${usedPrefix + command} 2\` أو \`2k\` للتحسين العادي\n• \`${usedPrefix + command} 4\` أو \`4k\` للتحسين الفائق`);
    }

    // تحديد الـ Scale (الجودة) بناءً على ما كتبه المستخدم بعد الأمر، والافتراضي 4
    let scale = '4';
    if (args[0]) {
        let param = args[0].toLowerCase();
        if (param === '2' || param === '2k') scale = '2';
        if (param === '4' || param === '4k') scale = '4';
    }
    
    await m.react('⏳');
    
    // إرسال الرسالة الأولى وبدء عملية الرفع
    let statusMsg = await conn.sendMessage(m.chat, { 
        text: `* .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀🍡 _*\n\n🔄 *جـاري تـحـمـيـل الـصـورة مـن سـيـرفـرات واتـسـاب ورفـعـهـا إلـى Catbox...*` 
    }, { quoted: m });
    
    try {
        let media = await q.download();
        if (!media) throw "فشل تحميل الملف من واتساب";

        // 1️⃣ الرفع المباشر إلى Catbox باستخدام الهاش الخاص بك
        let link = await catbox(media);
        if (!link || !link.includes('http')) throw "فشل الرفع إلى سيرفر التخزين المؤقت.";

        // تعديل الرسالة لإعلام المستخدم بنجاح الرفع وبدء التحسين بـ الذكاء الاصطناعي
        await conn.sendMessage(m.chat, { 
            text: `*✅ تـم رفـع الـصـورة بـنـجـاح!*\n🔗 *الـرابـط الـمـبـاشـر:* \n\`\`\`${link.trim()}\`\`\`\n\n⏳ *جـاري الآن تـحـسـيـن الـجـودة إلـى دِقّـة [ ${scale === '2' ? '2K' : '4K Ultra HD'} ] عبر السيرفر...*`, 
            edit: statusMsg.key 
        }, { quoted: m });

        // 2️⃣ استدعاء الـ API الجديدة المحددة من طرفك
        const upscaleUrl = `https://⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥.spcfy.eu/api/tools/img-to-hd?url=${encodeURIComponent(link.trim())}&scale=${scale}`;
        
        // جلب الصورة المعدلة كـ Buffer مباشر تماماً مثل تكنيك كود التحميل الناجح
        const response = await axios.get(upscaleUrl, { 
            responseType: 'arraybuffer',
            timeout: 120000 // مهلة دقيقتين نظراً لأن الـ HD يأخذ وقتاً في المعالجة والتوليد
        });

        if (!response.data || response.data.byteLength < 500) {
            throw "السيرفر أعاد ملفاً تالفاً، قد يكون حجم الصورة كبيراً جداً.";
        }

        const upscaledBuffer = Buffer.from(response.data);

        // 3️⃣ إرسال الصورة النهائية المحسنة وإشعار المستخدم بهيكلية نظيفة
        await conn.sendMessage(m.chat, {
            image: upscaledBuffer,
            caption: `*✨ تـم تـحـسـيـن الـجـودة بـنـجـاح — HD Image 📸*\n\n🚀 *مـقـيـاس الـتـكـبـيـر:* ${scale === '2' ? 'Scale 2x (2K)' : 'Ultra Scale 4x (4K)'}\n📊 *حـجـم الـصـورة الـجـديـد:* ${formatBytes(upscaledBuffer.length)}\n\n${myCredit}`
        }, { quoted: m });

        // حذف إشعار الانتظار المكتوب لتبقى المحادثة نظيفة
        await conn.sendMessage(m.chat, { delete: statusMsg.key });
        await m.react('✅');

    } catch (e) {
        console.error("Upscale Error:", e);
        await m.react('❌');
        
        const errorMsg = typeof e === 'string' ? e : e.message || 'خطأ في معالجة السيرفر';
        await conn.sendMessage(m.chat, { 
            text: `❌ *حـصـل خـطأ أثـنـاء الـتـحـسـيـن:*\n_${errorMsg}_\n\n💡 _تأكد من أن السيرفر يعمل وحاول مجدداً لاحقاً!_`, 
            edit: statusMsg.key 
        }, { quoted: m });
    }
};

handler.command = handler.help = ['تحسين', 'upscale', 'hd'];
handler.tags = ['tools'];
handler.group = false;

export default handler;

// ── دالة حساب وحجم الملفات المستخرجة ──
function formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

// ── دالة الرفع إلى سيرفر Catbox بنظام الهاش الثابت الخاص بالمطور ──
async function catbox(content) {
    try {
        const { ext, mime } = await fileTypeFromBuffer(content) || { ext: 'bin', mime: 'application/octet-stream' };
        const formData = new FormData();
        
        formData.append("reqtype", "fileupload");
        formData.append("userhash", "944145b0558412de8090cb6cb"); 
        
        formData.append("fileToUpload", content, {
            filename: Math.random().toString(36).substring(2, 10) + "." + ext,
            contentType: mime
        });

        const response = await axios.post("https://catbox.moe/user/api.php", formData, {
            headers: {
                ...formData.getHeaders(),
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        });

        return response.data;
    } catch (err) {
        throw "حدث خطأ أثناء الاتصال بسيرفر ومستودع Catbox";
    }
}