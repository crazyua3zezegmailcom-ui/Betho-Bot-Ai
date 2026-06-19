/*
░▒▓█ بوت g4f.space – ذكاء اصطناعي متعدد النماذج █▓▒░
☆ يستخدم واجهة g4f.space (مجانية)
☆ يحافظ على السياق عبر conversation_id
☆ يدعم التدفق (event-stream)
*/

import fetch from 'node-fetch';
import { EventSourceParserStream } from 'eventsource-parser/stream';

// ========== إعدادات g4f.space ==========
// ملاحظة: قد تحتاج إلى تحديث x-secret إذا توقف عن العمل.
// يمكنك استخراج x-secret جديد من موقع g4f.space عبر أدوات المطور (F12 -> Network -> طلب conversation -> نسخ قيمة x-secret)
const G4F_CONFIG = {
    apiUrl: 'https://g4f.space/backend-api/v2/conversation',
    headers: {
        'accept': 'text/event-stream',
        'accept-language': 'ar,fr;q=0.9',
        'content-type': 'application/json',
        'origin': 'https://g4f.dev',
        'referer': 'https://g4f.dev/',
        'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
        'x-secret': 'JPapuNAnnl5qxmnMcLRPfMisW22nzNFujWhr4dh1KNJhyuNpG3O9juZNGxfRfcVcb5Xux5CCffKj9gt/EWNXcMl3NN9xARebJlUw1Ms+BA74ayActu4Kin4eHH1RHuNDg10bKAjxezDd/fW5JwuR30q8WHuBEyNESbG2tKrAYhsNGRPF8f4VRuHeEylt5zvr5PLxlpzM2H00e2GfRBbTH/GtYYMgXOdo74ztdCiJIs3RUsgpZjbocHU+SftIb/3Xd6Eh6Hg6tuG929XhGTA/w4yGJFY592Ra4ODvg7CTLztaU8xnIov0wvnnaKyQq94xlAKk4iUAVP2anH5dop4RrfdTnvxSMlIEikjiv6RJj4R39DdxTvQ07+kAqhyrjxhhH+bl/Oc1lj+HA/Z/Mu6Ademtc0rd4CGbegQTZDsYEv1JTNKvx3xoyeeAsRGQ+omvHHXNRFLffZSU2cqPQVNOERZ+rf0x5a2oYHvqlixNLE3UIrkFmzjlrOJxOEWgCux8aITovYC+jy/ozbzgXdSQfYITKwe9y61pUk3hzen5ydATNgUA/3gW6bHeZGGLZwJp6x0u86F/yAKy8zgKTAZGPKD9FUxvWoFpR8CbeDOMiubSiIHgI48E6wzixy2hI0CUsn8axMdMLuAidAF00mGFZTleB/cx6Nbm3NcaQD6B8GQ='
    }
};

// تخزين conversation_id لكل مستخدم
const userConversations = new Map();

// توليد معرف محادثة عشوائي (UUID v4)
function generateConversationId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

// توليد رقم عشوائي كبير (id الطلب)
function generateRequestId() {
    return Math.floor(Math.random() * 1e19).toString();
}

/**
 * إرسال طلب إلى g4f.space والحصول على الرد من التدفق
 * @param {string} conversationId 
 * @param {string} userMessage 
 * @returns {Promise<string>}
 */
async function askG4F(conversationId, userMessage) {
    const payload = {
        id: generateRequestId(),
        conversation_id: conversationId,
        model: 'default',
        web_search: false,
        provider: 'AnyProvider',
        messages: [{ role: 'user', content: userMessage }],
        action: null,
        download_media: true,
        debug_mode: false,
        api_key: {
            PollinationsAI: null,
            HuggingFace: null,
            Together: null,
            GeminiPro: null,
            OpenRouter: null,
            OpenRouterFree: null,
            Groq: null,
            DeepInfra: null,
            Replicate: null,
            PuterJS: null,
            Azure: null,
            Nvidia: null,
            Ollama: null
        },
        ignored: [
            "AIBadgr", "Anthropic", "Azure", "BlackboxPro", "CachedSearch", "Cerebras",
            "Chatai", "Claude", "Cohere", "Custom", "DeepSeek", "FenayAI", "GigaChat",
            "GithubCopilotAPI", "GlhfChat", "GoogleSearch", "GradientNetwork", "Grok",
            "HailuoAI", "ItalyGPT", "MarkItDown", "MetaAI", "MicrosoftDesigner",
            "BingCreateImages", "MiniMax", "OpenaiAPI", "OpenAIFM", "OpenRouter",
            "PerplexityApi", "Pi", "Replicate", "TeachAnything", "ThebApi", "Together",
            "WeWordle", "WhiteRabbitNeo", "xAI", "YouTube", "Yqcloud"
        ],
        aspect_ratio: "9:16"
    };

    const response = await fetch(G4F_CONFIG.apiUrl, {
        method: 'POST',
        headers: G4F_CONFIG.headers,
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`g4f API error (${response.status}): ${errorText.substring(0, 200)}`);
    }

    // معالجة التدفق (text/event-stream)
    const body = response.body;
    const stream = body.pipeThrough(new TextDecoderStream());
    const parser = stream.pipeThrough(new EventSourceParserStream());

    let fullReply = '';
    for await (const event of parser) {
        if (event.type === 'event') {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'message' && data.content) {
                    fullReply += data.content;
                } else if (data.type === 'end') {
                    break;
                } else if (data.error) {
                    throw new Error(data.error);
                }
            } catch (e) {
                // تجاهل الأخطاء البسيطة في التحليل
            }
        }
    }
    
    if (!fullReply) throw new Error('لم يتم استلام أي رد من g4f');
    return fullReply;
}

// ========== الأمر الرئيسي ==========
let handler = async (m, { conn, text, usedPrefix, command }) => {
    let query = text;
    if (!query && m.quoted?.text) query = m.quoted.text;
    if (!query) {
        await conn.sendMessage(m.chat, {
            text: `🧠 *g4f.space AI (نماذج متعددة)*\n\nالاستخدام:\n${usedPrefix}${command} سؤالك\nمثال: ${usedPrefix}${command} ما هو الذكاء الاصطناعي؟\n\nيمكنك أيضاً الرد على رسالة واستخدام الأمر.\n\nلإعادة تعيين المحادثة: ${usedPrefix}${command} مسح`
        }, { quoted: m });
        return;
    }

    // أمر مسح المحادثة
    if (query.toLowerCase() === 'مسح') {
        const userId = m.sender;
        if (userConversations.delete(userId)) {
            await conn.sendMessage(m.chat, { text: '🗑️ تم مسح محادثتك مع g4f. سيتم إنشاء محادثة جديدة.' }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, { text: 'ℹ️ لا توجد محادثة نشطة.' }, { quoted: m });
        }
        return;
    }

    await conn.sendPresenceUpdate('composing', m.chat);
    const userId = m.sender;
    let conversationId = userConversations.get(userId);

    if (!conversationId) {
        conversationId = generateConversationId();
        userConversations.set(userId, conversationId);
    }

    try {
        const reply = await askG4F(conversationId, query);
        
        await conn.sendMessage(m.chat, {
            text: `✨ *g4f:*\n${reply}`,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: m });
    } catch (error) {
        console.error('g4f error:', error);
        let errorMsg = `❌ حدث خطأ: ${error.message}`;
        if (error.message.includes('stream') || error.message.includes('decoding')) {
            errorMsg += '\n⚠️ مشكلة في معالجة التدفق. قد يكون الخادم بطيئاً. حاول مرة أخرى.';
        } else if (error.message.includes('401') || error.message.includes('403')) {
            errorMsg += '\n⚠️ انتهت صلاحية المفتاح (x-secret). يرجى تحديثه من الموقع.';
        }
        await conn.sendMessage(m.chat, { text: errorMsg }, { quoted: m });
    }
};

handler.command = /^(g4f|جي فور)$/i;
handler.group = false;
handler.limit = true;

export default handler;