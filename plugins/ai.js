/*
░▒▓█ بوت ذكاء اصطناعي – Pollinations.ai █▓▒░
☆ مجاني، لا يحتاج مفتاح، يعمل للأبد
☆ نموذج GPT-4o-mini سريع ودقيق
☆ يحافظ على السياق لكل مستخدم
*/

import fetch from 'node-fetch';

// تخزين تاريخ المحادثة لكل مستخدم
const userHistory = new Map();

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.sendMessage(m.chat, {
            text: `🧠 *AI Assistant (GPT-4o-mini)*\n\nاستخدم الأمر متبوعاً بسؤالك:\n${usedPrefix}${command} ما هو الذكاء الاصطناعي؟\n\nلبدء محادثة جديدة: ${usedPrefix}${command} مسح`
        }, { quoted: m });
    }

    if (text.toLowerCase() === 'مسح') {
        userHistory.delete(m.sender);
        return conn.sendMessage(m.chat, { text: '🗑️ تم مسح سياق المحادثة.' }, { quoted: m });
    }

    await conn.sendPresenceUpdate('composing', m.chat);
    let history = userHistory.get(m.sender) || [];

    // بناء الرسائل مع السياق (آخر 10 رسائل)
    const messages = [
        { role: 'system', content: 'أنت مساعد ذكي ومفيد. تحدث بالعربية بوضوح وأجب بدقة.' },
        ...history.slice(-10),
        { role: 'user', content: text }
    ];

    try {
        const response = await fetch('https://text.pollinations.ai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'openai',
                messages: messages,
                temperature: 0.7
            })
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const reply = data.choices[0]?.message?.content;
        if (!reply) throw new Error('لا يوجد رد');

        // تحديث التاريخ
        history.push({ role: 'user', content: text });
        history.push({ role: 'assistant', content: reply });
        if (history.length > 20) history.shift();
        userHistory.set(m.sender, history);

        await conn.sendMessage(m.chat, { text: reply }, { quoted: m });
    } catch (err) {
        console.error(err);
        await conn.sendMessage(m.chat, { text: `❌ خطأ: ${err.message}` }, { quoted: m });
    }
};

handler.command = /^(ai|ذكاء|اسال)$/i;
export default handler;