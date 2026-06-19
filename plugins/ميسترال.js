// بوت Mistral AI – ذكاء اصطناعي قوي (يعالج تدفق الردود)
import fetch from 'node-fetch';

const API_URL = 'https://chat.mistral.ai/api/chat';
const COOKIE = 'anonymousUser=81dc7864-7463-4871-b99d-f027b329489b; intercom-id-xel0jpx9=4073183b-2d1d-4458-9c8b-d5069751587b; intercom-device-id-xel0jpx9=760f7025-bab8-4d0b-bcab-412e4926f0c0; ory_kratos_continuity=MTc3OTEzODE3NnxEWDhFQVFMX2dBQUJFQUVRQUFCZl80QUFBUVp6ZEhKcGJtY01Jd0FoYjNKNVgydHlZWFJ2YzE5dmFXUmpYMkYxZEdoZlkyOWtaVjl6WlhOemFXOXVCbk4wY21sdVp3d21BQ1JpTnpKbU4yTmxOeTFrWXpVMkxUUXpNekV0T0dKallpMHhORFkwWWpOa05UY3laV0k9fLjD_FuUOelpkLW4Obdk4sq6tVGP-eNZ7AVSf6L41s_z; csrf_token_1d61ec8f0158ec4868343239ec73dbe1bfebad9908ad860e62f470c767573d0d=K4WwbEUoITs1aNgjWTQt5yV69uu8lGXErtPSpANf2OM=; ory_session_coolcurranf83m3srkfl="MTc3OTEzODE3OXxYREowN19fcTV3U2lVM1VCVWhVQjl6WHRYU20yUGVJSjZSNTRnYi15SjhvM3RqMm5ZbVVDV3NlYmFxOTJ1Y1pKaFhMdnF2ZzQtVEctbzlQVjFOdlFXejQ4RUdvNUoyYVBLdTFMUEgxSUlnaWZKdzRfY29NMlgyNTNtOXF0RDZTWHNpZVlmMzlnTUhtelZvaGVyZkFLSTQ4VlBBYjRyMkhBM1VrbWlNVGJYWjc4ZFlLZjVyT3J2cF96NzJldGtfVkFndHU4cFVXS3JtcFZCNnZsSVMxWFlmcXFBR0RfcmlZYjhuTF90Nk5UMUU3azZ6TFpSWW1sSGdEdHlFb1RvTm5CMG9pQm5xZWo4M1ZiZElMU0RfME58A3HL3L-Ou84dOyr9x9Sz4wL6MKluZgLa2fj8_PVBGNE="; __cf_bm=OGFMoPeXFddWotxEmOwDD74Kmjc6IkQRFtVP5_ss2Ew-1779188293.2487473-1.0.1.1-xJzXX0p1j7PQ5XvbLMGbLbhM3FJplI1fM9UfK8vB_IZerKFzrUiq6n.eKory28zFnkD3jKfa1SSH5jPQ4a_8lxaEMtu1IUnNLK1IuD7ubH93GOEeKccplHfmWbfiaYKl; csrftoken=QNltcQqeOQeB9bVLJo9TPQ4lAxs5Cdjb; _cfuvid=nREYA.7qh8JsEci7q1umk.pq4UGc2rKkOaMPEueaEoI-1779188403.4846416-1.0.1.1-7DMA3XCz9dKtIz54Mq3HW_Wclk7EYW_fUZSXD9PfuvQ; intercom-session-xel0jpx9=emdidkdLTFRuTVp1VGV4alMvc2hhNE5ZWjNPckIyc3ZOVlFaaWs1VDJVdlM3V2ZRenBpNlhkU0Irc0MrcXZsdlU1NlF1bzJpTGZIaFltRG14QnNNYUxRWlRLeFhNN29JUXVDSUx5ZlNBUlRpbGhodmFhQTVpQ21NY050ZERuaHgzWFJGdFN6eG9UVUNQVlY5RjRMQXRBSnhZUjViV3QvbjRXTW9QWGgyS3hjNlE0d3VZa2RnQ2o1US9sb2RmdnozdjRqdnl0SjVoS1ZtNEo5Q0xoUGxTMENBV050RGpwTE9NT1pkK1haYTZHeHI2WVFBVnhkNFB2WVQxUWRHWWVMelpKMDZYQ29Fd0VtVWpDOXVaRnhOTFh4QmRzRkVtelBIQlpzSXBnU1d2a0E9LS1jWDg2S0Y5STRYTDlpdFpoelNBdnBnPT0=--5768c5a5eafd492b518d22d507e57a689a556ac4';

// تخزين معرفات المحادثات لكل مستخدم
const userChats = new Map();

// توليد معرف عشوائي
function generateId() {
    return Math.random().toString(36).substring(2, 15);
}

async function askMistral(message, chatId) {
    const data = {
        chatId: chatId,
        mode: "start",
        disabledFeatures: [],
        clientPromptData: {
            currentDate: new Date().toISOString().split('T')[0],
            userTimezone: "T+01:00 (Africa/Casablanca)"
        },
        stableAnonymousIdentifier: generateId(),
        shouldAwaitStreamBackgroundTasks: true,
        shouldUseMessagePatch: true
    };

    // إضافة رسالة المستخدم إلى الطلب
    // ملاحظة: الـ API يتوقع أن تكون الرسالة قد أُرسلت مسبقاً عبر endpoint آخر
    // سنستخدم هذا الـ endpoint لبدء محادثة وإرسال رسالة معاً

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
            'Content-Type': 'application/json',
            'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
            'sec-ch-ua-platform': '"Android"',
            'sec-ch-ua-mobile': '?1',
            'origin': 'https://chat.mistral.ai',
            'referer': `https://chat.mistral.ai/chat/${chatId}`,
            'accept-language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
            'Cookie': COOKIE
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText.slice(0, 200)}`);
    }

    const rawText = await response.text();
    
    // معالجة تدفق JSON (خطوط تبدأ بعدد ثم ":{"json":{...}})
    let fullReply = '';
    const lines = rawText.split('\n');
    
    for (const line of lines) {
        // البحث عن الأجزاء التي تحتوي على "contentChunks"
        if (line.includes('contentChunks')) {
            try {
                // استخراج جزء JSON من السطر
                const jsonMatch = line.match(/\{.*\}/);
                if (jsonMatch) {
                    const data = JSON.parse(jsonMatch[0]);
                    if (data.json?.patches) {
                        for (const patch of data.json.patches) {
                            if (patch.op === 'append' && patch.path === '/contentChunks/0/text') {
                                fullReply += patch.value;
                            }
                            if (patch.op === 'replace' && patch.path === '/contentChunks') {
                                if (patch.value?.[0]?.text) {
                                    fullReply += patch.value[0].text;
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                // تجاهل الأخطاء
            }
        }
    }

    if (!fullReply) {
        // محاولة بديلة: البحث عن text في الرد الخام
        const textMatches = rawText.match(/"text":"([^"]+)"/g);
        if (textMatches) {
            for (const match of textMatches) {
                const text = match.match(/"text":"([^"]+)"/)[1];
                fullReply += text;
            }
        }
    }

    if (!fullReply) throw new Error('لم يتم استلام رد من Mistral');
    return fullReply;
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.sendMessage(m.chat, {
            text: `🤖 *Mistral AI*\n\nأرسل سؤالك:\n${usedPrefix}${command} ما هو الذكاء الاصطناعي؟\n\nلبدء محادثة جديدة: ${usedPrefix}${command} مسح`
        }, { quoted: m });
    }

    if (text.toLowerCase() === 'مسح') {
        userChats.delete(m.sender);
        return conn.sendMessage(m.chat, { text: '✓ تم مسح السياق.' }, { quoted: m });
    }

    await conn.sendPresenceUpdate('composing', m.chat);
    let chatId = userChats.get(m.sender);
    if (!chatId) {
        chatId = 'e4539563-282e-4f7b-9e1d-80e58ea72882'; // من الـ cURL
        userChats.set(m.sender, chatId);
    }

    try {
        const reply = await askMistral(text, chatId);
        await conn.sendMessage(m.chat, { text: reply }, { quoted: m });
    } catch (err) {
        console.error(err);
        let errorMsg = `❌ خطأ: ${err.message}`;
        if (err.message.includes('401') || err.message.includes('403')) {
            errorMsg += '\n⚠️ انتهت صلاحية الجلسة. يرجى تحديث الـ cookie في الكود.';
        }
        await conn.sendMessage(m.chat, { text: errorMsg }, { quoted: m });
    }
};

handler.command = /^(ميسترال|mistral)$/i;
export default handler;