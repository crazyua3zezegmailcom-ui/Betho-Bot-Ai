import axios from 'axios';
import FormData from 'form-data';

// دالة رفع الميديا لتحويلها لروابط
async function uploadMedia(m) {
    try {
        const q = m.quoted ? m.quoted : m;
        if (!/image|sticker/.test(q.mimetype || q.msg?.mimetype)) return null;

        const media = await q.download();
        const form = new FormData();
        form.append('file', media, { filename: 'image.jpg' });
        form.append('type', 'permanent');

        const res = await axios.post(
            'https://tmp.malvryx.dev/upload',
            form,
            { headers: form.getHeaders() }
        );

        return res.data?.cdnUrl || res.data?.directUrl || null;
    } catch (e) {
        return null;
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const prompt = text || m.quoted?.text || m.msg?.caption || "";
    const imageUrl = await uploadMedia(m);

    // التحقق من وجود نص الوصف
    if (!prompt) return m.reply(`⚠️ *استخدام خاطئ ياصاحبي*\n\nالاستخدام: ${usedPrefix + command} <وصف الصورة>\nمثال: \`${usedPrefix + command} فتاة انمي في الغابة\`\n\nأو قم بالرد على صورة لتعديلها!`);

    await m.react('🎨');

    try {
        let initRes;
        const baseUrl = "https://omegatech-api.dixonomega.tech/api/ai";

        // إذا كانت هناك صورة (وضع التعديل)
        if (imageUrl) {
            const { data } = await axios.post(`${baseUrl}/flux-pro2-edit`, {
                image1: imageUrl,
                prompt: prompt,
                aspect_ratio: "auto"
            });
            initRes = data;
        } else {
            // وضع التوليد من الصفر
            const { data } = await axios.get(`${baseUrl}/flux-pro2?prompt=${encodeURIComponent(prompt)}`);
            initRes = data;
        }

        if (!initRes.success || !initRes.task_id) throw new Error('فشل بدء المهمة، جرب لاحقاً.');

        const taskId = initRes.task_id;
        let resultUrl = null;
        let attempts = 0;

        // انتظار معالجة الصورة (نظام التاسك)
        while (!resultUrl && attempts < 25) {
            await new Promise(r => setTimeout(r, 5000));
            const { data: check } = await axios.get(`${baseUrl}/nano-banana2-result?task_id=${taskId}`);
            
            if (check.status === 'completed' && check.image_url) {
                resultUrl = check.image_url;
                break;
            }
            
            if (check.status === 'failed') throw new Error('فشلت المهمة على الخادم.');
            attempts++;
        }

        if (!resultUrl) throw new Error('انتهى وقت الانتظار، السيرفر مشغول.');

        // إرسال الصورة النهائية مع الزخرفة والحقوق الفخمة
        await conn.sendMessage(m.chat, { 
            image: { url: resultUrl }, 
            caption: `*𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢*\n\n✨ *تـم الـتخيل بـنجاح!*\n📝 *الـوصف:* ${prompt}\n🚀 *بواسطة:* Flux 2 Pro API\n\n*دمـت مـبدعـاً مـع بـيثو 🌟*` 
        }, { quoted: m });

        await m.react('✅');

    } catch (e) {
        await m.react('❌');
        m.reply(`❌ *حـصل خـطأ:* ${e.response?.data?.error || e.message}`);
    }
};

handler.help = ['تخيل4'];
handler.tags = ['ai'];
handler.command = /^(تخيل4)$/i;

export default handler;