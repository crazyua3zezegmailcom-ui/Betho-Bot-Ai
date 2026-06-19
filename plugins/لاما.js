// بوت لاما (Llama 3.3 70B) عبر مونيكا – نسخة مستقرة
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

const CONFIG = {
    apiUrl: 'https://api.monica.im/api/custom_bot/chat',
    headers: {
        'accept': '*/*',
        'accept-language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7,ar;q=0.6',
        'content-type': 'application/json',
        'origin': 'https://monica.im',
        'referer': 'https://monica.im/',
        'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
        'x-client-id': 'ebfd66d3-106e-4f17-b0c8-66b3358d2854',
        'x-client-locale': 'ar',
        'x-client-type': 'web',
        'x-client-version': '5.4.3',
        'x-from-channel': 'NA',
        'x-product-name': 'Monica',
        'x-time-zone': 'Africa/Casablanca;-60',
        'cookie': '_twpid=tw.1778976345401.254125032382385204; _fwb=241oMBCfV79XBi68JkwvMhA.1778976345534; _gcl_au=1.1.2105038180.1778976346; _ga=GA1.1.1423781428.1778976347; _fbp=fb.1.1778976349715.128555566397458679; session_id=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3Nzg5NzY0MTAsImlzcyI6Im1vbmljYSIsInVzZXJfaWQiOjE5OTc2NTYyNiwidXNlcl9uYW1lIjoiQW1pbiBUaCIsImp0aSI6ImYyZTdjYWRjZDY0ZjQ4NjI5M2U1YzZiZTRhZTJiYjI0IiwiY2xpZW50X3R5cGUiOiJ3ZWIifQ.f41RL4foGRRHVfKsefiR6cDCIM_bKSIXZR0Zh5aNjsM; _rdt_uuid=1778976415074.42c646cc-18b9-4c1c-bdd2-757452ba61f9; locale=ar; _ga_E249CNSDCV=GS2.1.s1780747308$o4$g1$t1780748788$j60$l0$h0; _ga_JDZPETSM4F=GS2.1.s1780747308$o4$g1$t1780748789$j60$l0$h0; _ga_RJYZXDEM8N=GS2.1.s1780747308$o4$g1$t1780748790$j58$l0$h137313931; _uetsid=e02476d0619f11f1973db981fe635a79; _uetvid=288a1960518411f187144b67a79f4fa5'
    }
};

// تخزين conversation_id لكل مستخدم
const userConversations = new Map();

function generateId() {
    return uuidv4();
}

function getTimestamp() {
    return Date.now();
}

async function askLlama(message, conversationId) {
    const taskUid = `task:${generateId()}`;
    const questionItemId = `msg:${generateId()}`;
    const preGeneratedReplyId = `msg:${generateId()}`;
    const welcomeMsgId = `msg:${generateId()}`;

    // بناء العناصر (items) كما في الـ cURL
    const items = [
        {
            item_id: welcomeMsgId,
            conversation_id: conversationId,
            item_type: "reply",
            summary: "__RENDER_BOT_WELCOME_MSG__",
            data: { type: "text", content: "__RENDER_BOT_WELCOME_MSG__" }
        },
        {
            conversation_id: conversationId,
            item_id: questionItemId,
            item_type: "question",
            summary: message,
            parent_item_id: welcomeMsgId,
            data: {
                type: "text",
                content: message,
                quote_content: "",
                max_token: 0,
                is_incognito: false
            }
        }
    ];

    const payload = {
        task_uid: taskUid,
        bot_uid: "llama_3_3_70b",
        data: {
            conversation_id: conversationId,
            items: items,
            pre_generated_reply_id: preGeneratedReplyId,
            pre_parent_item_id: questionItemId,
            origin: "https://monica.im/ar/products/ask-ai",
            origin_page_title: "اسأل الذكاء الاصطناعي - إجابات دقيقة ومجانية",
            trigger_by: "auto",
            use_model: "llama-3.3-70b",
            is_incognito: false,
            use_new_memory: true,
            use_memory_suggestion: true
        },
        language: "auto",
        locale: "ar",
        task_type: "chat",
        tool_data: { sys_skill_list: [] },
        ai_resp_language: "Arabic"
    };

    const response = await fetch(CONFIG.apiUrl, {
        method: 'POST',
        headers: CONFIG.headers,
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText.slice(0, 200)}`);
    }

    const rawText = await response.text();
    
    // معالجة تنسيق "data: {...}" سطراً سطراً
    let fullReply = '';
    const lines = rawText.split('\n');
    
    for (const line of lines) {
        if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;
            try {
                const obj = JSON.parse(jsonStr);
                // الرد يأتي في حقل "text"
                if (obj.text) {
                    fullReply += obj.text;
                }
                // إذا وصلنا إلى نهاية الرد
                if (obj.finished === true) {
                    break;
                }
            } catch (e) {
                // تجاهل الأخطاء
            }
        }
    }

    // إذا لم نجد نصاً بالطريقة الأولى، نحاول البحث عن "content" أو "message"
    if (!fullReply) {
        try {
            const direct = JSON.parse(rawText);
            fullReply = direct.response || direct.message || direct.content || direct.text;
        } catch (e) {}
    }

    if (!fullReply) throw new Error('لم يتم استلام رد من لاما');
    return fullReply;
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.sendMessage(m.chat, {
            text: `🦙 *لاما (Llama 3.3 70B)*\n\nأرسل سؤالك:\n${usedPrefix}${command} ما هو الذكاء الاصطناعي؟\n\nلبدء محادثة جديدة: ${usedPrefix}${command} مسح`
        }, { quoted: m });
    }

    if (text.toLowerCase() === 'مسح') {
        userConversations.delete(m.sender);
        return conn.sendMessage(m.chat, { text: '✓ تم مسح السياق.' }, { quoted: m });
    }

    await conn.sendPresenceUpdate('composing', m.chat);
    let conversationId = userConversations.get(m.sender);
    if (!conversationId) {
        conversationId = `conv:${generateId()}`;
        userConversations.set(m.sender, conversationId);
    }

    try {
        const reply = await askLlama(text, conversationId);
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

handler.command = /^(لاما|llama|مونيكا)$/i;
export default handler;