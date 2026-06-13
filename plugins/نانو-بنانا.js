import axios from 'axios';
import FormData from 'form-data';

global.bananaSession = global.bananaSession || {};

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
    const userId = m.sender;
    // تحديث فحص الأوامر لتشمل العربي
    const isNanoPro = /نانو-بنانا|نانوبنانا/i.test(command);
    const prompt = text || m.quoted?.text || m.msg?.caption || "";

    // --- النظام الأول: وضع تجميع الصور (نانو-بنانا / نانوبنانا) ---
    if (isNanoPro) {
        if (!global.bananaSession[userId]) global.bananaSession[userId] = { images: [] };

        if (text?.toLowerCase().startsWith('تم')) {
            const session = global.bananaSession[userId];
            const finalPrompt = text.replace(/تم/i, '').trim();

            if (session.images.length < 2) return m.reply("⚠️ *نانـو بنـانا برو*\n\nيرجى إضافة صورتين أو ملصقين على الأقل.");
            if (!finalPrompt) return m.reply(`⚠️ الاستخدام: ${usedPrefix + command} تم <وصف التعديل>`);

            await m.react('🕒');
            try {
                let apiUrl = `https://omegatech-api.dixonomega.tech/api/ai/nanobana-pro-v3?prompt=${encodeURIComponent(finalPrompt)}`;
                session.images.forEach((url, i) => { 
                    apiUrl += `&image${i + 1}=${encodeURIComponent(url)}`; 
                });

                const { data: initRes } = await axios.get(apiUrl);
                if (!initRes.success) throw new Error('فشل بدء المهمة.');

                let resultUrl = null;
                let attempts = 0;
                while (!resultUrl && attempts < 25) {
                    await new Promise(r => setTimeout(r, 5000));
                    const { data: check } = await axios.get(`https://omegatech-api.dixonomega.tech/api/ai/nano-banana2-result?task_id=${initRes.task_id}`);
                    if (check.status === 'completed' && check.image_url) {
                        resultUrl = check.image_url;
                        break;
                    }
                    attempts++;
                }

                if (!resultUrl) throw new Error('انتهى وقت الانتظار.');

                await conn.sendMessage(m.chat, { 
                    image: { url: resultUrl }, 
                    caption: `*𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢*\n\n🍌 *نـانو بنـانا بـرو*\n📝 *الـطلب:* ${finalPrompt}` 
                }, { quoted: m });

                await m.react('✅');
                delete global.bananaSession[userId];
            } catch (e) {
                await m.react('❌');
                m.reply(`❌ *خطأ:* ${e.message}`);
                delete global.bananaSession[userId];
            }
            return;
        }

        const link = await uploadMedia(m);
        if (!link) return m.reply(`📸 *وضـع التجميع*\n\nقم بالرد على *صورة/ملصق* بـ *${usedPrefix + command}*\nأرسل *${usedPrefix + command} تم <الوصف>* عند الانتهاء.`);
        
        if (global.bananaSession[userId].images.length >= 4) return m.reply("❌ *وصلت للحد الأقصى* (4 صور)");
        
        global.bananaSession[userId].images.push(link);
        await m.react('📥');
        return m.reply(`✅ *تم إضافة العنصر ${global.bananaSession[userId].images.length}/4*`);
    }

    // --- النظام الثاني: وضع التعديل المفرد (نانو) ---
    if (command === 'نانو') {
        const imageUrl = await uploadMedia(m);
        
        if (imageUrl) {
            if (!prompt) return m.reply(`⚠️ *مطلوب تعليمات*\n\nمثال: قم بالرد على الصورة بـ \`${usedPrefix}نانو حولها لكرتون\``);
            
            await m.react('🎨');
            try {
                const { data: init } = await axios.get(`https://omegatech-api.dixonomega.tech/api/ai/nano-banana2?prompt=${encodeURIComponent(prompt)}&image=${encodeURIComponent(imageUrl)}`);
                let resultUrl = null;
                for (let i = 0; i < 20; i++) {
                    await new Promise(r => setTimeout(r, 5000));
                    const { data: check } = await axios.get(`https://omegatech-api.dixonomega.tech/api/ai/nano-banana2-result?task_id=${init.task_id}`);
                    if (check.status === 'completed') { resultUrl = check.image_url; break; }
                }
                if (resultUrl) {
                    await conn.sendMessage(m.chat, { 
                        image: { url: resultUrl }, 
                        caption: `*𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢*\n\n✨ *تم التعديل بنجاح*` 
                    }, { quoted: m });
                    await m.react('✅');
                }
            } catch (e) {
                await m.react('❌');
                m.reply("❌ فشل التعديل.");
            }
        } else {
            if (!prompt) return m.reply(`⚠️ الاستخدام: ${usedPrefix}نانو <وصف الصورة>`);
            await m.react('⏳');
            try {
                const { data } = await axios.get(`https://omegatech-api.dixonomega.tech/api/ai/nano-banana-pro?prompt=${encodeURIComponent(prompt)}`);
                if (data.image) {
                    await conn.sendMessage(m.chat, { 
                        image: { url: data.image }, 
                        caption: `*𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢*\n\n🍌 *نانـو بـرو*` 
                    }, { quoted: m });
                    await m.react('✅');
                }
            } catch (e) {
                await m.react('❌');
                m.reply("❌ فشل التوليد.");
            }
        }
    }
};

handler.help = ['نانو', 'نانو-بنانا'];
handler.tags = ['ai'];
handler.command = /^(نانو|نانو-بنانا|نانوبنانا)$/i;

export default handler;