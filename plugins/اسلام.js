/* تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: ᴇsᴄᴀɴᴏʀ 🍁 */

import fetch from 'node-fetch';

const WEBHOOK_URL = 'https://n8n.srv787268.hstgr.cloud/webhook/0eaacdaa-e724-4565-b3b3-21b7f92a6059/chat';

// تخزين sessionId لكل مستخدم للحفاظ على السياق
const userSessions = new Map();

// الإطارات والزخارف
const frame = "⏜᳦໋֗᷼ᮬ〪〫ᦷּ໋࠭͜⌢͜ᮬ۬𔖭𔖰︵ִ̥ׄׄ𝆬🌺̷̸᮫ּ〪᳟݂〫᪲ׄ፝֟⣾᮫ִ̥ׄׄׄ ໋⌢ּ᩿፝ᦡ۬ᩞ⏝᩠〪࣭〫〬";
const footerDec = "⏜᳦໋֗᷼ᮬ〪〫ᦷּ໋࠭͜⌢͜ᮬ۬꣼᩠໋ׅ〫𝆬〬🌺౿ּ࠭͜⌢ּ᩿፝ᦡ۬ᩞ⏝᩠໋〪࣭〫〬";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.sendMessage(m.chat, {
            text: `${frame}\n\n📖⃝🌿 *أهـلاً بـك فـي بـوت الإسـلام* 📖⃝🌿\n\n*أرسـل سـؤالك بـعـد الأمـر:*\n> ${usedPrefix}${command} ما هو الإسلام؟\n\n*💡 أمثلة:*\n• ${usedPrefix}${command} ما هي أركان الإسلام؟\n• ${usedPrefix}${command} من هو النبي محمد؟\n\n${footerDec}`,
            mentions: [m.sender]
        }, { quoted: m });
    }

    await m.react('⏳');
    
    // الحصول على sessionId للمستخدم أو إنشاء جديد
    let sessionId = userSessions.get(m.sender);
    if (!sessionId) {
        sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        userSessions.set(m.sender, sessionId);
    }

    try {
        const payload = {
            metadata: {
                clientCurrentDateTime: new Date().toString(),
                clientCurrentTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Casablanca',
                clientQueryParams: {},
                clientUserAgent: 'Mozilla/5.0 (Linux; Android 10; K) WhatsApp Bot'
            },
            action: "sendMessage",
            sessionId: sessionId,
            chatInput: text
        };

        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) Chrome/132'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        // قراءة الرد كنص خام
        const rawResponse = await response.text();
        
        let reply = '';
        
        // محاولة استخراج النص من الاستجابة إن كانت بصيغة JSON غير قياسية
        try {
            // أولاً نحاول تحليلها كـ JSON عادي
            const data = JSON.parse(rawResponse);
            reply = data?.answer || data?.response || data?.message || data?.output || data?.text || data?.content;
        } catch {
            // إذا فشل التحليل، نبحث عن نص داخل الاستجابة
            // بعض الخوادم ترد بنص عادي
            if (rawResponse.trim().startsWith('{') || rawResponse.trim().startsWith('[')) {
                // ربما JSON غير مكتمل
                reply = "الخادم أعاد استجابة غير صالحة.";
            } else {
                // رد نصي عادي
                reply = rawResponse;
            }
        }
        
        if (!reply || reply === "الخادم أعاد استجابة غير صالحة.") {
            // محاولة استخراج أي نص من الاستجابة كحل أخير
            const textMatch = rawResponse.match(/[^\{|\}\[\]"]+/g);
            if (textMatch) {
                reply = textMatch.filter(t => t.trim().length > 20).join(' ').trim();
            }
            if (!reply) reply = "لم أتمكن من الحصول على إجابة. حاول مرة أخرى.";
        }
        
        // تنظيف الرد من الأكواد
        reply = reply.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        
        // تقسيم الرد الطويل إلى أجزاء لأن واتساب له حدود
        const maxLength = 4096;
        if (reply.length > maxLength) {
            for (let i = 0; i < reply.length; i += maxLength) {
                const part = reply.substring(i, i + maxLength);
                const captionPart = `${frame}\n\n📖 *الإجابة:*\n${part}\n\n${footerDec}`;
                await conn.sendMessage(m.chat, { text: captionPart, mentions: [m.sender] }, { quoted: m });
            }
        } else {
            const caption = `${frame}\n\n📖 *الإجابة:*\n${reply}\n\n${footerDec}`;
            await conn.sendMessage(m.chat, { text: caption, mentions: [m.sender] }, { quoted: m });
        }
        
        await m.react('✅');
    } catch (err) {
        console.error(err);
        await m.reply(`❌ حـدث خـطـأ: ${err.message}`);
        await m.react('❌');
    }
};

handler.help = ['اسلام <سؤال>'];
handler.tags = ['islamic'];
handler.command = /^(اسلام|دين|islam)$/i;

export default handler;