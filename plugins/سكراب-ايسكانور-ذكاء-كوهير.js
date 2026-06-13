/*
░▒▓█ بوت Cohere AI – نموذج Command A-03-2025 █▓▒░
☆ يعتمد على Cohere API الرسمي
☆ يحافظ على سياق المحادثة لكل مستخدم
☆ المطور: بناءً على طلبك
*/

import fetch from 'node-fetch';

// ========== إعدادات Cohere (ضع مفتاحك الحقيقي) ==========
const COHERE_CONFIG = {
    apiUrl: 'https://api.cohere.com/v2/chat',
    apiKey: '1d3mHSFcByNEydwbRctcDxwpWnUSalwx31jYOuLQ', // المفتاح من الـ cURL
    model: 'command-a-03-2025',
    temperature: 0.3,
    stream: false // نفضل false للبساطة، لكن يمكنك تفعيله
};

// تخزين تاريخ المحادثة لكل مستخدم (كل عنصر: { role, content })
const userHistories = new Map();

// ========== دالة الاتصال بـ Cohere ==========
async function askCohere(messages) {
    // تحويل رسائلنا إلى صيغة Cohere (messages تحتوي على role و content)
    // Cohere يتوقع أن يكون content إما string أو array of objects (type, text)
    const formattedMessages = messages.map(msg => ({
        role: msg.role, // 'user' أو 'assistant'
        content: [{ type: 'text', text: msg.content }]
    }));

    const payload = {
        messages: formattedMessages,
        model: COHERE_CONFIG.model,
        temperature: COHERE_CONFIG.temperature,
        stream: COHERE_CONFIG.stream
    };

    const response = await fetch(COHERE_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'authorization': `Bearer ${COHERE_CONFIG.apiKey}`,
            'content-type': 'application/json',
            'origin': 'https://dashboard.cohere.com',
            'referer': 'https://dashboard.cohere.com/'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cohere API error (${response.status}): ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    // الرد يأتي في data.message.content[0].text
    const reply = data?.message?.content?.[0]?.text || data?.text || 'عذراً، لم أستطع توليد رد.';
    return reply;
}

// ========== الأمر الرئيسي للواتساب ==========
const handler = async (m, { conn, text, usedPrefix, command }) => {
    let query = text;
    if (!query && m.quoted?.text) query = m.quoted.text;
    if (!query) {
        await conn.sendMessage(m.chat, {
            text: `🧠 *Cohere AI (Command A-03-2025)*\n\nالاستخدام:\n${usedPrefix}${command} سؤالك\nمثال: ${usedPrefix}${command} ما هو الذكاء الاصطناعي؟`
        }, { quoted: m });
        return;
    }

    await conn.sendPresenceUpdate('composing', m.chat);
    const userId = m.sender;
    let history = userHistories.get(userId) || [];

    // إضافة الرسالة الجديدة للمستخدم
    const newMessages = [...history, { role: 'user', content: query }];
    // الاحتفاظ بآخر 20 رسالة كحد أقصى (10 أزواج)
    if (newMessages.length > 20) newMessages.splice(0, newMessages.length - 20);

    try {
        const reply = await askCohere(newMessages);
        // تحديث التاريخ: نضيف سؤال المستخدم ورد المساعد
        history.push({ role: 'user', content: query });
        history.push({ role: 'assistant', content: reply });
        if (history.length > 20) history = history.slice(-20);
        userHistories.set(userId, history);

        await conn.sendMessage(m.chat, {
            text: `✨ *Cohere:*\n${reply}`,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: m });
    } catch (error) {
        console.error('Cohere error:', error);
        await conn.sendMessage(m.chat, {
            text: `❌ حدث خطأ: ${error.message}\nتأكد من صحة مفتاح API واتصال الإنترنت.`
        }, { quoted: m });
    }
};

// أمر مسح السياق (بدء محادثة جديدة)
const resetHandler = async (m, { conn }) => {
    const userId = m.sender;
    if (userHistories.delete(userId)) {
        await conn.sendMessage(m.chat, { text: '🗑️ تم مسح محادثتك مع Cohere.' }, { quoted: m });
    } else {
        await conn.sendMessage(m.chat, { text: 'ℹ️ لا توجد محادثة نشطة.' }, { quoted: m });
    }
};

// ========== تسجيل الأوامر ==========
handler.command = /^(كوهير|cohere)$/i;
handler.group = false;
handler.limit = true;

resetHandler.command = /^(كوهير مسح|cohere reset)$/i;

export { resetHandler };
export default handler;