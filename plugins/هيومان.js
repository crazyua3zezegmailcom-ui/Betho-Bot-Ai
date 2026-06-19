/* تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: ᴇsᴄᴀɴᴏʀ 🍁 */
/* ִᗀᩙᰰ ̼𝆬🍒̸〫 ᮭ࣪࣪ ⸼۫  𝑵𝑰𝑵𝑶 𝑩𝑶𝑻 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🍒 */

import fetch from 'node-fetch';

// ========== إعدادات Allam API ==========
const ALLAM_CONFIG = {
    API_URL: 'https://api-allam.humain.ai/v1/message',
    REFRESH_URL: 'https://sso.humain.ai/realms/allam/protocol/openid-connect/token',
    CLIENT_ID: 'allam-auth',
    ORIGIN: 'https://chat.humain.ai',
    REFERER: 'https://chat.humain.ai/'
};

// التوكنات المحدثة (من cURL)
let accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJrRVQ0Sm9NQmJqdXh3eUZYcGRDV2RaUzQ0clNhaVpYWk1wMjJBWjNjU2dVIn0.eyJleHAiOjE3Nzg5MTUwNzAsImlhdCI6MTc3ODkxMzI3MCwiYXV0aF90aW1lIjoxNzc4ODc0MjQzLCJqdGkiOiJmNzdlZDRmYy05MmYwLTQyYmYtODUwZi04NjkyYjFlOTAxZjciLCJpc3MiOiJodHRwczovL3Nzby5odW1haW4uYWkvcmVhbG1zL2FsbGFtIiwiYXVkIjpbImFsbGFtLWF1dGgiLCJhY2NvdW50Il0sInN1YiI6IjQ1ODk5YWViLTU2OTYtNGEyNS1hY2ZiLTVkNTE0ODczNTdlZCIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFsbGFtLWF1dGgiLCJzaWQiOiI1N2ZiM2RmNy05N2ZlLTQ3ZWItOWU3OS0xMDFjZGUyYzQ0M2YiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vY2hhdC5odW1haW4uYWkiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtYWxsYW0iLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiQW1pbiBUaCIsInByZWZlcnJlZF91c2VybmFtZSI6ImFibTIyNDE0QGdtYWlsLmNvbSIsImdpdmVuX25hbWUiOiJBbWluIiwiZmFtaWx5X25hbWUiOiJUaCIsImVtYWlsIjoiYWJtMjI0MTRAZ21haWwuY29tIn0.IDiieP5Ls_kdARDff3OPuK38mgJMopL5O5D-OuxntuEcLy_JNo2p36kF9nR8JZi99nz74Cm0UGJnLR0bYtYsVvzPB6Yi4dl9URSiTXzQZWoUXWKf-NORUgBLCmdp3e7ul46n0rnfjU_ZMiCsLqusaHfD7POop7Nsf-kqyST4xxqIz_7VRuA6kcu_bUDePxcbrotmVQx0MLb0ZVHrVRqn74Jn-FO-Q3c-y61TWtHtzRQ5Mk0fEB2mCg7_GiejZsP8D2D_QkjZKBHXbBeRMqrCsBZPNVb0kROq71O8sKG3vt9U8d3KKoufzhcE5Qqo4MYgEx4IzQWQgL1FKVsYLVwfrQ';
const refreshToken = 'eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyODQ0NjEyZC04YWUwLTRhMWItYjE3Mi1hNDExODA5MDgxM2YifQ.eyJleHAiOjE3NzkxNzI0NzAsImlhdCI6MTc3ODkxMzI3MCwianRpIjoiODgxNjM0NjktOWIxNS00MWY5LThmMDMtMDU5NDkwM2NlMTNkIiwiaXNzIjoiaHR0cHM6Ly9zc28uaHVtYWluLmFpL3JlYWxtcy9hbGxhbSIsImF1ZCI6Imh0dHBzOi8vc3NvLmh1bWFpbi5haS9yZWFsbXMvYWxsYW0iLCJzdWIiOiI0NTg5OWFlYi01Njk2LTRhMjUtYWNmYi01ZDUxNDg3MzU3ZWQiLCJ0eXAiOiJSZWZyZXNoIiwiYXpwIjoiYWxsYW0tYXV0aCIsInNpZCI6IjU3ZmIzZGY3LTk3ZmUtNDdlYi05ZTc5LTEwMWNkZTJjNDQzZiIsInNjb3BlIjoib3BlbmlkIHdlYi1vcmlnaW5zIHNlcnZpY2VfYWNjb3VudCBwcm9maWxlIGJhc2ljIHJvbGVzIGFjciBlbWFpbCJ9.Hcg60BFs0SCl2-xYJMVS_KkkXu1v9lvldB59QkFSZkWDGfAtloyh0N26NwSYuRPfeTX5_-YVJFDg-N2E7QhmIw';

// تخزين تاريخ المحادثات
const userHistories = new Map();

// دالة تجديد التوكن
async function refreshAccessToken() {
    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'refresh_token');
        params.append('client_id', ALLAM_CONFIG.CLIENT_ID);
        params.append('refresh_token', refreshToken);

        const res = await fetch(ALLAM_CONFIG.REFRESH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Origin': ALLAM_CONFIG.ORIGIN,
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) Chrome/132'
            },
            body: params.toString()
        });

        if (!res.ok) throw new Error(`Refresh failed: ${res.status}`);
        const data = await res.json();
        accessToken = data.access_token;
        console.log('✅ تم تجديد التوكن بنجاح');
        return true;
    } catch (err) {
        console.error('❌ فشل تجديد التوكن:', err.message);
        return false;
    }
}

// إرسال رسالة إلى Allam API (معالجة SSE)
async function askAllam(message, contextEnabled = true, webSearch = false) {
    const payload = {
        message: message,
        context_enabled: contextEnabled,
        web_search: webSearch
    };

    const response = await fetch(ALLAM_CONFIG.API_URL, {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Origin': ALLAM_CONFIG.ORIGIN,
            'Referer': ALLAM_CONFIG.REFERER,
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) Chrome/132'
        },
        body: JSON.stringify(payload)
    });

    if (response.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) return askAllam(message, contextEnabled, webSearch);
        throw new Error('انتهت صلاحية التوكن ولا يمكن تجديده');
    }

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText.slice(0, 200)}`);
    }

    // معالجة التدفق (text/event-stream)
    const text = await response.text();
    const lines = text.split('\n');
    let fullReply = '';
    let inReply = false;

    for (const line of lines) {
        if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            if (data === '') continue;
            try {
                const json = JSON.parse(data);
                if (json.response) {
                    fullReply += json.response;
                } else if (json.message) {
                    fullReply += json.message;
                } else if (json.text) {
                    fullReply += json.text;
                } else if (json.content) {
                    fullReply += json.content;
                }
            } catch (e) {
                // تجاهل الأخطاء
            }
        }
    }

    if (!fullReply) throw new Error('لم يتم استلام رد من الخادم');
    return fullReply.trim();
}

// معالج الأمر الرئيسي
let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        let replyMsg = `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🍒̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n`;
        replyMsg += `*⃝🌿┆🤖 أهـلاً بـك في بـوت هـيـومـان*\n`;
        replyMsg += `*⃝🍒┆📝 أرسل سـؤالـك بعد الأمر*\n`;
        replyMsg += `*⃝🌿┆🔹 مثال: ${usedPrefix + command} كيف حالك؟*\n`;
        replyMsg += `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🍒̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n`;
        replyMsg += `*⃝🌿┆🗑️ لمسح السياق: ${usedPrefix + command} مسح*\n`;
        replyMsg += `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🍒̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n\n`;
        replyMsg += `𝅄 ۫ ִᗀᩙᰰ ̼𝆬🍒̸〫 ᮭ࣪࣪ ⸼۫  𝑵𝑰𝑵𝑶 𝑩𝑶𝑻* 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🍒\n© ʙʏ ᴇsᴄᴀɴᴏʀ`;
        return m.reply(replyMsg);
    }

    if (text.toLowerCase() === 'مسح') {
        userHistories.delete(m.sender);
        return m.reply(`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🍒̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n*⃝🌿┆🗑️ تم مسح سياق المحادثة*\n*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🍒̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`);
    }

    await m.react('⏳');
    try {
        const reply = await askAllam(text, true, false);
        
        // حفظ السياق
        let history = userHistories.get(m.sender) || [];
        history.push({ role: 'user', content: text });
        history.push({ role: 'assistant', content: reply });
        if (history.length > 20) history = history.slice(-20);
        userHistories.set(m.sender, history);

        const footer = `\n\n𝅄 ۫ ִᗀᩙᰰ ̼𝆬🍒̸〫 ᮭ࣪࣪ ⸼۫  𝑵𝑰𝑵𝑶 𝑩𝑶𝑻* 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🍒\n© ʙʏ ᴇsᴄᴀɴᴏʀ`;
        let finalMsg = `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🍒̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n`;
        finalMsg += `*⃝🌿┆🤖 هـيـومـان – ذكاء اصطناعي*\n`;
        finalMsg += `*⃝🍒┆📝 سـؤالـك:* ${text}\n`;
        finalMsg += `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🍒̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n`;
        finalMsg += `*💡 جـواب هـيـومـان:*\n${reply}${footer}`;

        await m.reply(finalMsg);
        await m.react('✅');
    } catch (err) {
        console.error(err);
        await m.react('❌');
        let errorMsg = `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🍒̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n`;
        errorMsg += `*⃝🌿┆❌ عـذراً، حـدث خـطـأ*\n`;
        errorMsg += `*⃝🍒┆⚠️ ${err.message}*\n`;
        errorMsg += `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🍒̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n\n`;
        errorMsg += `𝅄 ۫ ִᗀᩙᰰ ̼𝆬🍒̸〫 ᮭ࣪࣪ ⸼۫  𝑵𝑰𝑵𝑶 𝑩𝑶𝑻* 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🍒\n© ʙʏ ᴇsᴄᴀɴᴏʀ`;
        m.reply(errorMsg);
    }
};

handler.command = ['هيومان', 'humain', 'علام', 'allam'];
handler.tags = ['ai'];
handler.help = ['هيومان <سؤال>'];

export default handler;