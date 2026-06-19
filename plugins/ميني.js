import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`⚠️ يرجى كتابة سؤالك بعد الأمر.\nمثال: ${usedPrefix + command} كيف حالك؟`);

    // التفاعل برمز الروبوت لبدء معالجة الطلب
    await m.react('🤖');

    const CONVERSATION_ID = "bd9e0579-17bc-499b-bd2d-490f94d9091a";
    const API_URL = `https://api.miniapps.ai/conversations/${CONVERSATION_ID}/messages`;

    // الهيدرز والكوكيز الكاملة المتطابقة تماماً مع طلب الـ curl الخاص بك
    const headers = {
        "authority": "api.miniapps.ai",
        "accept": "*/*",
        "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "origin": "https://miniapps.ai",
        "referer": "https://miniapps.ai/",
        "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '"Android"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
        "x-csrf-token": "bb08bba5429c45989f15e7c9ad98e0f3a5526f8615ce552917901994575ab5ddf1c8b9b0d007c0712dc9ddaa1883bc4e3c8344f24bfc0528dae3e0cab2d481c0",
        "Cookie": "__cf_bm=gylxuLKpzG2i0un97VoXY3Z0pf8AmvgGhtC3qJzucgg-1779014147.3314095-1.0.1.1-d4lZziP42cQaSvlXeGIlQSKohUwgJiEF1V9e0GUVTh160HrfneN.jq4_GzrQYsDdPDwHSsB_xSkIozB3NXQDFyVQJ8W9nqvnyj.44NPzIdkJazJUC70lMU4U1iU1GoCD; _ga=GA1.1.1080413572.1779014166; __Host-miniapps.x-csrf-token=957276a578447c7da341958817f0bd06212a54e46a02fe95eb3b7ee2aa10717c; jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkwNjhiZTc5LWE0ZGMtNDEzMi1iOWY1LTg5YTdkYTE3Njk5OCIsImVtYWlsIjoiYWJtMjI0MTRAZ21haWwuY29tIiwiaWF0IjoxNzc5MDE0NTEwLCJleHAiOjE3ODAzMTA1MTB9.0okIXhnxD0lHj-QSI4PsT1fyl4A0gkhN5gdF37YdO_c; _ga_9C3BKCCQZ1=GS2.1.s1779014166$o1$g1$t1779014535$j36$l0$h0"
    };

    const payload = {
        "text": text,
        "voiceId": null
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server status: ${response.status} - ${errorText}`);
        }

        let fullText = "";

        // معالجة تدفق البيانات (Stream) بنفس ميكانيكية الـ gpt
        response.body.on('data', (chunk) => {
            const lines = chunk.toString().split('\n');
            for (let line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith('data: ')) {
                    const jsonStr = trimmed.substring(6).trim();
                    if (jsonStr === '[DONE]') continue;
                    try {
                        const data = JSON.parse(jsonStr);
                        if (data.text) {
                            fullText += data.text;
                        } else if (data.elements && data.elements[0]?.text) {
                            fullText += data.elements[0].text;
                        }
                    } catch (e) {
                        // تفادي الأخطاء أثناء المعالجة التدفقية السريعة
                    }
                }
            }
        });

        response.body.on('end', async () => {
            const finalResult = fullText.trim();
            if (finalResult) {
                await conn.sendMessage(m.chat, { 
                    text: `*⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲𝜣 𝑩𝜣𝑻🕷⏤͟͞ू⃪*\n\n${finalResult}` 
                }, { quoted: m });
                await m.react('✅');
            } else {
                // نظام استدعاء احتياطي (Fallback) في حال كان تدفق النص فارغاً
                try {
                    const fallbackResponse = await fetch(`https://api.miniapps.ai/conversations/${CONVERSATION_ID}`, { headers });
                    const chatData = await fallbackResponse.json();
                    const assistantMsgs = chatData.messages.filter(msg => msg.origin === 'assistant');
                    const lastMsg = assistantMsgs[assistantMsgs.length - 1];
                    const backupText = lastMsg?.text || lastMsg?.elements?.[0]?.text || "";
                    
                    if (backupText) {
                        await conn.sendMessage(m.chat, { 
                            text: `*⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲𝜣 𝑩𝜣𝑻🕷⏤͟͞ू⃪*\n\n${backupText.trim()}` 
                        }, { quoted: m });
                        await m.react('✅');
                    } else {
                        m.reply("❌ لم يتم استقبال رد، قد تحتاج لتجديد الكوكيز أو التوكن.");
                        await m.react('⚠️');
                    }
                } catch (err) {
                    m.reply("❌ تعذر جلب الرد الاحتياطي من الجلسة.");
                    await m.react('❌');
                }
            }
        });

        response.body.on('error', (err) => {
            throw err;
        });

    } catch (e) {
        console.error(e);
        m.reply("❌ حدث خطأ أثناء الاتصال بخوادم Miniapps.ai.");
        await m.react('❌');
    }
};

handler.help = ['ميني'];
handler.tags = ['ai'];
handler.command = /^(مينيا|ميني|mini|miniapps)$/i;

export default handler;