/* 
░▒▓█ بوت رايتر (Rytr) – الذكاء الاصطناعي للكتابة والمحادثة █▓▒░
☆ يعتمد على واجهة Rytr.me API
☆ يحافظ على السياق لكل مستخدم (آخر 5 أسئلة وأجوبة)
☆ المطور: بناءً على طلبك
☆ التاريخ: 2026-04-30
*/

import fetch from 'node-fetch';

// ========== إعدادات API (يجب تحديث التوكن عند انتهاء صلاحيته) ==========
const RYTR_CONFIG = {
    apiUrl: 'https://api.rytr.me/',
    // التوكن من الـ cURL – قد ينتهي صلاحيته، استبدله بتوكن جديد عند الحاجة
    bearerToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZjNkNzhjN2RiMDg2ODE5Yzk1ZGJkMSIsImlhdCI6MTc3NzU4ODEwOX0.Xc1AQLSdwbuBN-mIIRR50aQJR_hAhS3Yph54uLwrc3Y',
    // معرفات ثابتة من الطلب (يمكن تغييرها حسب حاجتك)
    languageId: '60c4eb424660040013ca8a9f',   // AR? EN? هذا المعرف للغة العربية أو الإنجليزية (يبدو عاماً)
    toneId: '60572a639bdd4272b8fe358b',       // نبرة المحادثة (عامة)
    // voiceId اختياري
    voiceId: '',
    // هذه العناوين مأخوذة من الـ cURL
    headers: {
        'authority': 'api.rytr.me',
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'content-type': 'application/json',
        'origin': 'https://app.rytr.me',
        'referer': 'https://app.rytr.me/create/chat',
        'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
        'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"'
    }
};

// تخزين سياق المحادثة لكل مستخدم (سجل آخر 5 رسائل)
const userHistories = new Map(); // key: userId, value: array of {role, content}

// ========== دوال مساعدة ==========

/**
 * بناء نص يحتوي على تاريخ المحادثة + السؤال الجديد
 * @param {Array} history - تاريخ المستخدم (كل عنصر: {role: 'user'/'assistant', content})
 * @param {string} newQuestion - سؤال المستخدم الجديد
 * @returns {string} - النص الكامل المُهيأ للإرسال إلى Rytr
 */
function buildContextText(history, newQuestion) {
    let context = '';
    // نأخذ آخر 10 رسائل (5 أزواج) لكي لا يتجاوز الطول المسموح
    const recent = history.slice(-10);
    for (const msg of recent) {
        const prefix = msg.role === 'user' ? '👤 المستخدم: ' : '🤖 المساعد: ';
        context += `${prefix}${msg.content}\n`;
    }
    context += `👤 المستخدم (السؤال الحالي): ${newQuestion}\n🤖 المساعد: `;
    return context;
}

/**
 * إرسال طلب إلى Rytr API والحصول على الرد
 * @param {string} textWithContext - النص المُجمَّع (محادثة سابقة + سؤال جديد)
 * @returns {Promise<string>} - رد Rytr
 */
async function askRytr(textWithContext) {
    const payload = {
        operation: 'chatExecute',
        params: {
            text: textWithContext,
            languageId: RYTR_CONFIG.languageId,
            toneId: RYTR_CONFIG.toneId,
            voiceId: RYTR_CONFIG.voiceId
        }
    };

    const response = await fetch(RYTR_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
            ...RYTR_CONFIG.headers,
            'authentication': `Bearer ${RYTR_CONFIG.bearerToken}`,
            // نضيف حقول إضافية قد تكون ضرورية من الـ cURL (مثل baggage, sentry-trace)
            'baggage': 'sentry-environment=production,sentry-public_key=e6537bb980668b14ad99ea7dbc545676,sentry-trace_id=8476345308ce417f9f652a614bc3f19a,sentry-org_id=4506933527511040,sentry-sampled=false,sentry-sample_rand=0.8788992278999532,sentry-sample_rate=0.2',
            'sentry-trace': '8476345308ce417f9f652a614bc3f19a-9e2c4de115f74611-0'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Rytr API error (${response.status}): ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    // استخراج الرد: حسب مثال Rytr، الرد قد يكون في data.data.reply أو data.data.content أو data.reply
    const reply = data?.data?.reply || data?.data?.content || data?.reply || data?.content || null;
    if (!reply) {
        throw new Error('لم نستطع استخراج الرد من Rytr: ' + JSON.stringify(data));
    }
    return reply;
}

// ========== الأمر الرئيسي ==========
const handler = async (m, { conn, text, usedPrefix, command }) => {
    let query = text;
    if (!query && m.quoted?.text) query = m.quoted.text;
    if (!query) {
        await conn.sendMessage(m.chat, {
            text: `✍️ *Rytr AI – مساعد الكتابة والمحادثة*\n\nالاستخدام:\n${usedPrefix}${command} سؤالك أو نص تريد كتابته\nمثال: ${usedPrefix}${command} اكتب لي مقدمة عن الذكاء الاصطناعي`
        }, { quoted: m });
        return;
    }

    await conn.sendPresenceUpdate('composing', m.chat);
    const userId = m.sender;
    let history = userHistories.get(userId) || [];

    // بناء النص المرسل مع السياق
    const fullQuery = buildContextText(history, query);

    try {
        const reply = await askRytr(fullQuery);
        
        // تحديث التاريخ (حفظ السؤال والرد)
        history.push({ role: 'user', content: query });
        history.push({ role: 'assistant', content: reply });
        // الاحتفاظ بآخر 20 رسالة (10 أسئلة + 10 أجوبة) كحد أقصى
        if (history.length > 20) history = history.slice(-20);
        userHistories.set(userId, history);
        
        // إرسال الرد
        await conn.sendMessage(m.chat, {
            text: `📝 *Rytr:*\n${reply}`,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: m });
    } catch (error) {
        console.error('Rytr error:', error);
        let errorMsg = `❌ فشل الاتصال بـ Rytr: ${error.message}`;
        if (error.message.includes('401') || error.message.includes('403') || error.message.includes('Bearer')) {
            errorMsg += '\n⚠️ يبدو أن رمز الوصول (Bearer token) انتهت صلاحيته. الرجاء تحديث التوكن في الكود.';
        }
        await conn.sendMessage(m.chat, { text: errorMsg }, { quoted: m });
    }
};

// أمر مسح السياق (بدء محادثة جديدة)
const resetHandler = async (m, { conn }) => {
    const userId = m.sender;
    if (userHistories.delete(userId)) {
        await conn.sendMessage(m.chat, { text: '🗑️ تم مسح محادثتك مع Ryrt. يمكنك البدء من جديد.' }, { quoted: m });
    } else {
        await conn.sendMessage(m.chat, { text: 'ℹ️ لا توجد محادثة نشطة.' }, { quoted: m });
    }
};

// ========== تسجيل الأوامر ==========
handler.command = /^(ريتر|رايتر|rytr)$/i;
handler.group = false;
handler.limit = true;

resetHandler.command = /^(ريتر مسح|rytr reset)$/i;
resetHandler.group = false;

export { resetHandler };
export default handler;