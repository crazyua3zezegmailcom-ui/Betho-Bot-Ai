// كود Qwen AI – ذكاء اصطناعي من علي بابا (يعمل بشكل مباشر)
import fetch from 'node-fetch';

// إعدادات ثابتة من الكوكيز والتوكن (يجب تحديث التوكن إذا انتهت صلاحيته)
const CONFIG = {
    baseURL: 'https://chat.qwen.ai/api/v2',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFmZjM0ZDFhLTZkNWQtNDEwMC05ZDZmLTMyYjZiZGQwYTU2ZCIsImxhc3RfcGFzc3dvcmRfY2hhbmdlIjoxNzc4OTE4NjAyLCJleHAiOjE3ODE1MTE2NzB9.8SpFT_r49mZnbTPcr6dH2gAFo1IV55iIjAMX93JnhDg',
    chatId: 'ec40453f-e921-4aff-af59-3ba809b070b7', // من الـ cURL
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'fr-FR,fr;q=0.9',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://chat.qwen.ai/',
        'Origin': 'https://chat.qwen.ai',
        'source': 'h5',
        'bx-v': '2.5.36',
        'Cookie': 'acw_tc=0a06abd717789185748447132e239f8cf683f4e6964e4c3b996640038d4d07; x-ap=eu-central-1; _bl_uid=y4mh0p8z8eX2ng6U4xm03hd8jbOC; qwen-theme=light; qwen-locale=fr-FR; cna=tBKPImiCh0oCAc2TydZPPpIs; sca=9668ca97; xlly_s=1; cnaui=aff34d1a-6d5d-4100-9d6f-32b6bdd0a56d; aui=aff34d1a-6d5d-4100-9d6f-32b6bdd0a56d; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFmZjM0ZDFhLTZkNWQtNDEwMC05ZDZmLTMyYjZiZGQwYTU2ZCIsImxhc3RfcGFzc3dvcmRfY2hhbmdlIjoxNzc4OTE4NjAyLCJleHAiOjE3ODE1MTE2NzB9.8SpFT_r49mZnbTPcr6dH2gAFo1IV55iIjAMX93JnhDg; atpsida=676cd50bdac7bf02b5ebebe8_1778919695_19; tfstk=g2fx8l9eK-S38FP7vj2lIgnwsAauM8b4Vi7IshxmCgIRfiaqsN9mffIJqr7DGoS-6GTBffTXcACRxEL6lZt66AIp2rWMlx1JVGItfhMbQaiW7GmfXNz25hs1XhX0EWbVuCR_xGF3tZWFVm_OXE96FPTM5Ft_EKikRXHQxkV3ZvmMlmZhS1BXmLTwVETsGjaJNeYX1EtXlzKWWekscGO_yzLMRmTjhhMWNEYp1hs61zQW4Fd6lGO_yaty5eFKH3hDDfBPjxp2IJlm6fCJkKKtF3ctOPY6HH_X68yPwXJvAZt-so1peu-XR6Zo3epAl9vd3qGA5Z6FbesjcrLfhwCeL1Z86Q6R01phsmaW1dtypsOTa4-fLTjXya0ZeaJ1EsJFiuGvO97DiO_7JvtOnwfvpBsPX6fLhonHzQHYyzHZQKTP9MxT4527Bq8JxrQxQAJDwUK3yzHZQKTyyH4YMAkwnQC..; isg=BERELP6D8j_zZUZzKmDZ4TVgFcA2XWjHUsFghV7l1Y_Sie1ThW8yVIZvzX_0qqAf; ssxmod_itna=1-YqUx97DtD=0QDQG8FG0D2DRxW9D7K7jUA2tDXDUTqiQGgDYq7=GFKDCEE9326n_GYxIQYDIBrEY=SxGNdr3cxGCRD7eDE3ou02e=j77bwIPe_n0G2sHKgCu5eiV7EC9_6Qi=knFz5szNd3xDIDY=DCqGSDDNDDh_ADA=DjdhDTAeD44DvDBYxxAYKxDPD_4r3DG6NDB=YheDF7eTH_bqqH1WDA4GIDYPK=GX7xBoDGuFNOlTDI_rCKAypBCcaxBQWcGrDbR0NfOWTTpaHM6mxF7EudgAxUWUwj7hQCD_YK0l5lo_5zD_MqWoxSYMf5ZBY3rzKAeTu87kk1LKpBbqB1u2_5etkh=oGD7AeeA5VYYOGDlMxdihrDq70DdDt9qoIuwbWt=Ax0hD=YoxgNdAG52wRiGLTDD; ssxmod_itna2=1-YqUx97DtD=0QDQG8FG0D2DRxW9D7K7jUA2tDXDUTqiQGgDYq7=GFKDCEE9326n_GYxIQYDIBrEY=3xAEbql6YxbdFDj_p5qbWZohAp0eeTE5awQ7icPrfKKqKDlOZCScarDXCq16TjcRToYHaM6a7k=iqgrBq7CcqNi01TQYet_am6Z0_rY2w=0KKV70Gricw82pGp19sOa94Nn04pt04A9G8rnwPG4hCA6oaza_b51exZlTiOiDmNjGxm=ZUdiIDD'
    }
};

// تخزين معرفات المحادثة لكل مستخدم (اختياري)
const userChats = new Map();

async function askQwen(message, chatId) {
    // استخدام endpoint /chat/completions كما هو متوقع
    const endpoint = `${CONFIG.baseURL}/chat/completions`;
    const payload = {
        chat_id: chatId,           // مطلوب من الخطأ السابق
        messages: [
            { role: 'user', content: message }
        ],
        model: 'qwen-turbo',       // أو qwen-plus, qwen-max
        stream: false
    };

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            ...CONFIG.headers,
            'Authorization': `Bearer ${CONFIG.token}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText.slice(0, 200)}`);
    }

    const data = await response.json();
    // الرد يأتي غالباً في data.choices[0].message.content
    const reply = data.choices?.[0]?.message?.content || data.response || data.message;
    if (!reply) {
        console.error('الرد الخام:', JSON.stringify(data));
        throw new Error('لم يتم استلام رد صالح من Qwen');
    }
    return reply;
}

// معالج الأمر الرئيسي
let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`🤖 *Qwen AI (ذكاء اصطناعي)*\n\nأرسل سؤالك:\n${usedPrefix}${command} ما هو الذكاء الاصطناعي؟\n\nلبدء محادثة جديدة: ${usedPrefix}${command} جديد`);
    }

    if (text.toLowerCase() === 'جديد') {
        // يمكن إنشاء محادثة جديدة عبر API، لكننا سنستخدم نفس chatId للجميع حاليًا
        userChats.delete(m.sender);
        return m.reply('✅ تم إعادة تعيين المحادثة (ستستخدم نفس المعرف الثابت).');
    }

    await m.react('⏳');
    try {
        // نستخدم chatId ثابت من الـ cURL (يمكن تغييره إذا أردت لكل مستخدم)
        const chatId = userChats.get(m.sender) || CONFIG.chatId;
        const reply = await askQwen(text, chatId);
        await m.reply(reply);
        await m.react('✅');
    } catch (err) {
        console.error(err);
        let errorMsg = `❌ خطأ: ${err.message}`;
        if (err.message.includes('401') || err.message.includes('403')) {
            errorMsg += '\n⚠️ يبدو أن التوكن قد انتهت صلاحيته. يرجى تحديث التوكن من موقع chat.qwen.ai (Cookie و token).';
        } else if (err.message.includes('400')) {
            errorMsg += '\n⚠️ طلب غير صالح. قد تحتاج إلى تحديث معرف المحادثة أو التوكن.';
        }
        await m.reply(errorMsg);
        await m.react('❌');
    }
};

handler.command = /^(كوين|qwen)$/i;
export default handler;