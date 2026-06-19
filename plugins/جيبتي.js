import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`⚠️ يرجى كتابة سؤالك بعد الأمر.\nمثال: ${usedPrefix + command} من أنت؟`);

    // التفاعل برمز البرق للاستجابة السريعة gpt-4.1-nano
    await m.react('⚡');

    const API_URL = "https://api.monica.im/api/custom_bot/chat";
    
    // الهيدرز والكوكيز الكاملة والمحدثة بناء على الـ curl الأخير الخاص بك لنموذج GPT
    const headers = {
        "authority": "api.monica.im",
        "accept": "*/*",
        "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "origin": "https://monica.im",
        "referer": "https://monica.im/",
        "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '"Android"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
        "x-client-id": "ebfd66d3-106e-4f17-b0c8-66b3358d2854",
        "x-client-locale": "ar",
        "x-client-type": "web",
        "x-client-version": "5.4.3",
        "x-from-channel": "NA",
        "x-product-name": "Monica",
        "x-time-zone": "Africa/Casablanca;-60",
        "Cookie": "_twpid=tw.1778976345401.254125032382385204; _fwb=241oMBCfV79XBi68JkwvMhA.1778976345534; _gcl_au=1.1.2105038180.1778976346; _ga=GA1.1.1423781428.1778976347; _fbp=fb.1.1778976349715.128555566397458679; session_id=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3Nzg5NzY0MTAsImlzcyI6Im1vbmljYSIsInVzZXJfaWQiOjE5OTc2NTYyNiwidXNlcl9uYW1lIjoiQW1pbiBUaCIsImp0aSI6ImYyZTdjYWRjZDY0ZjQ4NjI5M2U1YzZiZTRhZTJiYjI0IiwiY2xpZW50X3R5cGUiOiJ3ZWIifQ.f41RL4foGRRHVfKsefiR6cDCIM_bKSIXZR0Zh5aNjsM; _rdt_uuid=1778976415074.42c646cc-18b9-4c1c-bdd2-757452ba61f9; _uetsid=28885d20518411f18c186da1b5cb6287; _uetvid=288a1960518411f187144b67a79f4fa5; _ga_E249CNSDCV=GS2.1.s1778976346$o1$g1$t1778977647$j60$l0$h0; _ga_JDZPETSM4F=GS2.1.s1778976346$o1$g1$t1778977648$j59$l0$h0; _ga_RJYZXDEM8N=GS2.1.s1778976346$o1$g1$t1778977648$j59$l0$h1217248233"
    };

    const conversation_id = `conv:${uuidv4()}`;
    const welcome_item_id = `msg:${uuidv4()}`;
    const question_item_id = `msg:${uuidv4()}`;
    const pre_generated_reply_id = `msg:${uuidv4()}`;

    // الـ Payload الموجه لنموذج gpt-4.1-nano لتخطي فخ الفراغ
    const payload = {
        "task_uid": `task:${uuidv4()}`,
        "bot_uid": "gpt_4_1_nano",
        "data": {
            "conversation_id": conversation_id,
            "items": [
                {
                    "item_id": welcome_item_id,
                    "conversation_id": conversation_id,
                    "item_type": "reply",
                    "summary": "__RENDER_BOT_WELCOME_MSG__",
                    "data": { 
                        "type": "text", 
                        "content": "__RENDER_BOT_WELCOME_MSG__" 
                    }
                },
                {
                    "conversation_id": conversation_id,
                    "item_id": question_item_id,
                    "item_type": "question",
                    "summary": text,
                    "parent_item_id": welcome_item_id,
                    "data": { 
                        "type": "text", 
                        "content": text, 
                        "quote_content": "", 
                        "max_token": 0, 
                        "is_incognito": false 
                    }
                }
            ],
            "pre_generated_reply_id": pre_generated_reply_id,
            "pre_parent_item_id": question_id,
            "origin": "https://monica.im/ar/products/ai-chat",
            "origin_page_title": "دردشة AI مجانية - افتح حصتك اليومية من المحادثات",
            "trigger_by": "auto",
            "use_model": "gpt-4.1-nano",
            "is_incognito": false,
            "use_new_memory": true,
            "use_memory_suggestion": true
        },
        "language": "auto",
        "locale": "ar",
        "task_type": "chat",
        "tool_data": { "sys_skill_list": [] },
        "ai_resp_language": "Arabic"
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        let fullText = "";
        
        // معالجة تدفق البيانات المباشر SSE
        response.body.on('data', (chunk) => {
            const lines = chunk.toString().split('\n');
            for (let line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonStr = line.substring(6).trim();
                    if (!jsonStr) continue;
                    try {
                        const data = JSON.parse(jsonStr);
                        if (data.text) fullText += data.text;
                    } catch (e) {
                    }
                }
            }
        });

        response.body.on('end', async () => {
            const trimmedText = fullText.trim();
            if (trimmedText) {
                await conn.sendMessage(m.chat, { 
                    text: `*⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲𝜣 𝑩𝜣𝑻🕷⏤͟͞ू⃪*\n\n${trimmedText}` 
                }, { quoted: m });
                await m.react('✅');
            } else {
                m.reply("❌ عذراً، الرد الذي تم استلامه من موناكو فارغ. قد تحتاج لتحديث جلسة العمل (session_id).");
                await m.react('⚠️');
            }
        });

    } catch (e) {
        console.error(e);
        m.reply("❌ حدث خطأ أثناء محاولة الاتصال بخوادم GPT.");
        await m.react('❌');
    }
};

handler.help = ['جبتي'];
handler.tags = ['ai'];
handler.command = /^(جبتي|gpt|gpt4)$/i;

export default handler;