// بوت Easemate AI – نسخة تصحيح (تطبع الرد الخام)
import fetch from 'node-fetch';

const API_URL = 'https://api.easemate.ai/api2/stream/exec_operation';
const AUTH_TOKEN = 'eyJ0eXAiOiJqd3QifQ.eyJzdWIiOiIxIiwiaXNzIjoiaHR0cDpcL1wvOiIsImV4cCI6MTc3OTE3NTc1NSwiaWF0IjoxNzc5MTMyNTU1LCJuYmYiOjE3NzkxMzI1NTUsInVpZCI6IjkxNTA4MjAyMDkzNzcyOCIsImVtYWlsIjoiYWJtMjI0MTRAZ21haWwuY29tIiwicyI6Im80VG5JbSIsImp0aSI6ImE2MmJhMWFhNTVjY2VkYmIxOWU4NTkwZTk4YjI5ZmFiIn0.MWU3OGVlYjgyOWMxMGI1NmFlYTY5M2VkN2NjOWM4YjI3NDY3MWU0Nw';

const userSessions = new Map();

async function askEasemate(message, sessionId = null, identityId = null) {
    const timestamp = Date.now().toString() + Math.floor(Math.random() * 10000);
    const sign = '83dedfdde3ce7abed2d5a31bb28ccdc4';

    const payload = {
        model_id: 4,
        session_id: sessionId || 1000567691,
        operation_info: {
            operation: message,
            id: 10000
        },
        parameters: JSON.stringify({
            webSearch: false,
            isThinking: false
        })
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'accept': 'text/event-stream',
            'authorization': `Bearer ${AUTH_TOKEN}`,
            'content-type': 'application/json;charset=UTF-8',
            'client-name': 'chatpdf',
            'client-type': 'web',
            'device-platform': 'Android,Chrome',
            'device-type': 'web',
            'device-uuid': '27f1033abc07b768b5e33a0c7c7fbc84',
            'identity-id': identityId || '8b3caa307c474c646c2587e84a0463259e2630816c337596613ad3bcec2dc1c9',
            'lang': 'en',
            'language': 'en-US',
            'origin': 'https://www.easemate.ai',
            'referer': 'https://www.easemate.ai/',
            'sign': sign,
            'site': 'www.easemate.ai',
            'timestamp': timestamp,
            'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText.slice(0, 200)}`);
    }

    const rawText = await response.text();
    console.log('📦 الرد الخام من Easemate:\n', rawText); // 🔍 لمعرفة بنية الرد

    const lines = rawText.split('\n');
    let fullReply = '';
    let newSessionId = sessionId;

    for (const line of lines) {
        if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;
            try {
                const data = JSON.parse(jsonStr);
                if (data.session_id && !newSessionId) newSessionId = data.session_id;
                // محاولة استخراج الرد من جميع الحقول الممكنة
                const possibleFields = ['text', 'content', 'message', 'response', 'answer', 'result', 'data'];
                for (const field of possibleFields) {
                    if (data[field]) {
                        fullReply += data[field];
                        break;
                    }
                }
                // إذا كان هناك choices[0].delta.content
                if (data.choices?.[0]?.delta?.content) fullReply += data.choices[0].delta.content;
                if (data.choices?.[0]?.message?.content) fullReply += data.choices[0].message.content;
            } catch (e) {}
        }
    }

    if (!fullReply) throw new Error('لم يتم استلام رد من Easemate');
    return { reply: fullReply, sessionId: newSessionId };
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.sendMessage(m.chat, {
            text: `🤖 *Easemate AI*\n\nأرسل سؤالك:\n${usedPrefix}${command} ما هو الذكاء الاصطناعي؟\n\nلبدء محادثة جديدة: ${usedPrefix}${command} مسح`
        }, { quoted: m });
    }

    if (text.toLowerCase() === 'مسح') {
        userSessions.delete(m.sender);
        return conn.sendMessage(m.chat, { text: '✓ تم مسح السياق.' }, { quoted: m });
    }

    await conn.sendPresenceUpdate('composing', m.chat);
    let session = userSessions.get(m.sender) || { sessionId: null, identityId: null };

    try {
        const { reply, sessionId } = await askEasemate(text, session.sessionId, session.identityId);
        userSessions.set(m.sender, { ...session, sessionId });
        await conn.sendMessage(m.chat, { text: reply }, { quoted: m });
    } catch (err) {
        console.error(err);
        let errorMsg = `❌ خطأ: ${err.message}`;
        if (err.message.includes('401') || err.message.includes('403')) {
            errorMsg += '\n⚠️ انتهت صلاحية التوكن. يرجى تحديثه في الكود.';
        }
        await conn.sendMessage(m.chat, { text: errorMsg }, { quoted: m });
    }
};

handler.command = /^(easemate|ايزميت)$/i;
export default handler;