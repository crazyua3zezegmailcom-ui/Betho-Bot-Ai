/* 
░▒▓█ بوت كوالا (Koala) – ذكاء اصطناعي متكامل مع Supabase █▓▒░
☆ يستخدم نفس API الخاصة بموقع Koala.sh
☆ يحافظ على السياق لكل دردشة
☆ المطور: بناءً على طلبك
*/

import fetch from 'node-fetch';

// ========== إعدادات Koala (من الـ cURL) ==========
const KOALA_CONFIG = {
    apiBase: 'https://sb.koala.sh/rest/v1',
    apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZWJpeWdxdm9jb2pkbHJ5aXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzYzMDA0MDMsImV4cCI6MTk5MTg3NjQwM30.GoveiPXyIN-WNkfqBbdDyvf0veNfNvGP6Zk_kQYfejg',
    authToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6Im9MNVEzeW54YlZPclZxNy8iLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3FzZWJpeWdxdm9jb2pkbHJ5aXF1LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIwZDdhM2JhNC05YjZhLTRmOWQtOThjMy1lYjM5YWQ5MTQ2OGIiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzc4MjMzMjIwLCJpYXQiOjE3Nzc2Mjg0MjEsImVtYWlsIjoiYWJtMjI0MTRAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJnb29nbGUiLCJwcm92aWRlcnMiOlsiZ29vZ2xlIl19LCJ1c2VyX21ldGFkYXRhIjp7ImF2YXRhcl91cmwiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKTTVfNFVUSzVLT0NRWmpfeUM0Vkh2ZjR3QzRjY3g1U2wybGlwQzNRRWxwT2hEMGc9czk2LWMiLCJlbWFpbCI6ImFibTIyNDE0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmdWxsX25hbWUiOiJBbWluIFRoIiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tIiwibmFtZSI6IkFtaW4gVGgiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKTTVfNFVUSzVLT0NRWmpfeUM0Vkh2ZjR3QzRjY3g1U2wybGlwQzNRRWxwT2hEMGc9czk2LWMiLCJwcm92aWRlcl9pZCI6IjExMjMyMjQwMTk2OTM4NDYwOTA2NCIsInN1YiI6IjExMjMyMjQwMTk2OTM4NDYwOTA2NCJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6Im9hdXRoIiwidGltZXN0YW1wIjoxNzc3NjI4NDIxfV0sInNlc3Npb25faWQiOiIxNjE3YjkzMy03MGMzLTRiOGEtOGJiYi1jM2NkMTc1YzFhOTQiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.k_mBp-xgWVDoLGUV94ocAQGxwiRzqRVgrDFzm3G39H4',
    userId: '0d7a3ba4-9b6a-4f9d-98c3-eb39ad91468b', // من الـ cURL
    defaultChatId: '1b6f14e8-87fc-46ae-8802-0fd507950aee', // مثال، لكننا سننشئ لكل مستخدم أو نستخدم واحداً
    defaultModel: 'gemini-3-flash', // النموذج المُستخدم في الرد
    // إعدادات الذكاء الاصطناعي (نموذج بديل - OpenAI)
    aiProvider: 'openai', // 'openai' أو 'gemini' (إذا كان لديك مفتاح)
    openaiApiKey: 'YOUR_OPENAI_API_KEY', // ضع مفتاحك هنا
    openaiModel: 'gpt-4o-mini'
};

// تخزين chat_id لكل مستخدم (لتمييز المحادثات)
const userChats = new Map(); // userId -> chatId

// ========== دوال مساعدة ==========

/**
 * إدراج رسالة في جدول chat_messages
 * @param {string} chatId - معرف المحادثة
 * @param {string} role - 'user' أو 'assistant'
 * @param {string} text - نص الرسالة
 * @param {string|null} model - اسم النموذج (للمساعد فقط)
 */
async function insertMessage(chatId, role, text, model = null) {
    const payload = {
        user_id: KOALA_CONFIG.userId,
        chat_id: chatId,
        role: role,
        text: text,
        attachments: [],
        created_at: new Date().toISOString()
    };
    if (model && role === 'assistant') payload.model = model;

    const response = await fetch(`${KOALA_CONFIG.apiBase}/chat_messages`, {
        method: 'POST',
        headers: {
            'apikey': KOALA_CONFIG.apiKey,
            'authorization': `Bearer ${KOALA_CONFIG.authToken}`,
            'content-type': 'application/json',
            'prefer': 'return=representation'
        },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Insert message failed (${response.status}): ${err}`);
    }
    return response.json();
}

/**
 * استدعاء الذكاء الاصطناعي (OpenAI أو Gemini)
 */
async function fetchAIReply(messages) {
    if (KOALA_CONFIG.aiProvider === 'openai') {
        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${KOALA_CONFIG.openaiApiKey}`
            },
            body: JSON.stringify({
                model: KOALA_CONFIG.openaiModel,
                messages: messages,
                max_tokens: 1024,
                temperature: 0.7
            })
        });
        if (!resp.ok) throw new Error(`OpenAI error: ${resp.status}`);
        const data = await resp.json();
        return data.choices[0].message.content;
    }
    // يمكن إضافة Gemini API هنا إذا وفرت المفتاح
    throw new Error('AI provider not configured properly');
}

/**
 * جلب آخر رسائل المحادثة من قاعدة البيانات للسياق
 */
async function getChatHistory(chatId, limit = 10) {
    const response = await fetch(
        `${KOALA_CONFIG.apiBase}/chat_messages?chat_id=eq.${chatId}&order=created_at.asc&limit=${limit}`,
        {
            headers: {
                'apikey': KOALA_CONFIG.apiKey,
                'authorization': `Bearer ${KOALA_CONFIG.authToken}`
            }
        }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.map(row => ({
        role: row.role,
        content: row.text
    }));
}

// ========== الأمر الرئيسي ==========
const handler = async (m, { conn, text, usedPrefix, command }) => {
    let query = text;
    if (!query && m.quoted?.text) query = m.quoted.text;
    if (!query) {
        await conn.sendMessage(m.chat, {
            text: `🐨 *كوالا (Koala AI) – ذكاء اصطناعي متكامل*\n\nالاستخدام:\n${usedPrefix}${command} سؤالك\nمثال: ${usedPrefix}${command} كيف أتعلم البرمجة؟`
        }, { quoted: m });
        return;
    }

    await conn.sendPresenceUpdate('composing', m.chat);
    const waUserId = m.sender;
    let chatId = userChats.get(waUserId);
    if (!chatId) {
        // نستخدم chatId افتراضي أو ننشئ معرفاً جديداً (UUID)
        chatId = KOALA_CONFIG.defaultChatId;
        userChats.set(waUserId, chatId);
    }

    try {
        // 1. إدراج رسالة المستخدم
        await insertMessage(chatId, 'user', query);

        // 2. جلب تاريخ المحادثة (لتقديم سياق للـ AI)
        const history = await getChatHistory(chatId, 10);
        const messagesForAI = history.map(h => ({ role: h.role, content: h.content }));
        // إضافة التعليمات النظامية (System Prompt)
        messagesForAI.unshift({
            role: 'system',
            content: 'أنت مساعد ذكي ومفيد يدعى "كوالا". أجب بدقة واحترافية.'
        });

        // 3. الحصول على الرد من OpenAI (أو Gemini)
        const aiReply = await fetchAIReply(messagesForAI);

        // 4. إدراج رد المساعد
        await insertMessage(chatId, 'assistant', aiReply, KOALA_CONFIG.defaultModel);

        // 5. إرسال الرد للمستخدم
        await conn.sendMessage(m.chat, {
            text: `🐨 *Koala:*\n${aiReply}`,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: m });
    } catch (error) {
        console.error(error);
        let errorMsg = `❌ خطأ: ${error.message}`;
        if (error.message.includes('OpenAI')) {
            errorMsg += '\n🔑 يرجى وضع مفتاح OpenAI API صالح في متغير openaiApiKey.';
        }
        await conn.sendMessage(m.chat, { text: errorMsg }, { quoted: m });
    }
};

// أمر مسح محادثة المستخدم (تغيير chat_id)
const resetHandler = async (m, { conn }) => {
    const waUserId = m.sender;
    if (userChats.delete(waUserId)) {
        await conn.sendMessage(m.chat, { text: '🗑️ تم مسح محادثتك مع كوالا. سيتم إنشاء محادثة جديدة.' }, { quoted: m });
    } else {
        await conn.sendMessage(m.chat, { text: 'ℹ️ لا توجد محادثة نشطة.' }, { quoted: m });
    }
};

// ========== تسجيل الأوامر ==========
handler.command = /^(كوالا|koala)$/i;
handler.group = false;
handler.limit = true;

resetHandler.command = /^(كوالا مسح|koala reset)$/i;

export { resetHandler };
export default handler;