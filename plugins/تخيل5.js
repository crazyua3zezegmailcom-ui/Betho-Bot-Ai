/**
 * 🎨 Flux Pro 2 (Text to Image)
 * 𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢
 * نظام توليد الصور المتقدم عبر النصوص
 */

import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // التحقق من النص
    if (!text) return m.reply(`⚠️ *يـا هـلا بـك فـي مـعمل نـيزوكو*\n\nيرجى كتابة وصف للصورة التي تريد توليدها.\nمثال: \`${usedPrefix + command} مدينة مستقبلية بنظام النيون\``);

    await m.react('🎨');
    
    try {
        // 1. بدء مهمة التوليد (Flux Pro 2)
        const initUrl = `https://omegatech-api.dixonomega.tech/api/ai/flux-pro2?prompt=${encodeURIComponent(text)}`;
        const { data: initRes } = await axios.get(initUrl);

        if (!initRes.success || !initRes.task_id) {
            throw new Error('تعذر بدء عملية التصميم، حاول مرة أخرى.');
        }

        const taskId = initRes.task_id;
        let resultUrl = null;
        let attempts = 0;

        // 2. تتبع الحالة حتى اكتمال الصورة (Polling)
        while (!resultUrl && attempts < 25) {
            await new Promise(r => setTimeout(r, 5000)); // انتظار 5 ثوانٍ بين كل محاولة
            
            const checkUrl = `https://omegatech-api.dixonomega.tech/api/ai/nano-banana2-result?task_id=${taskId}`;
            const { data: check } = await axios.get(checkUrl);

            if (check.status === 'completed' && check.image_url) {
                resultUrl = check.image_url;
                break;
            }
            
            if (check.status === 'failed') {
                throw new Error('فشل السيرفر في توليد الصورة.');
            }
            
            attempts++;
        }

        if (!resultUrl) throw new Error('انتهى وقت الانتظار (Timeout)، السيرفر مضغوط حالياً.');

        // 3. إرسال الصورة النهائية بالوصف العربي والزخرفة
        await conn.sendMessage(m.chat, { 
            image: { url: resultUrl }, 
            caption: `*𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢*\n\n✨ *تـم رسـم خـيالك بـنجاح!*\n📝 *الـطلب:* ${text}\n🚀 *الـتقنية:* Flux Pro 2 v1.0\n\n*اسـتمتـع بـالنتيجة مـع نـيزوكو 🎀*` 
        }, { quoted: m });

        await m.react('✅');

    } catch (e) {
        console.error(e);
        await m.react('❌');
        m.reply(`❌ *فـشل الأمـر:* ${e.message}`);
    }
};

handler.help = ['تخيل5'];
handler.tags = ['ai'];
handler.command = /^(تخيل5)$/i;

export default handler;