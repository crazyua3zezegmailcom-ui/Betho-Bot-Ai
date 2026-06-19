import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`*⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲𝜣 𝑩𝜣𝑻🕷⏤͟͞ू⃪*\n\n⚠️ يرجى كتابة سؤالك بعد الأمر.\n📝 *مثال:* \`${usedPrefix + command} من أنت؟\``);

    // التفاعل برمز التميز/النجم لجمالية البوت
    await m.react('⭐');

    const API_URL = "https://app.unlimitedai.chat/api/chat";

    // الهيدرز والكوكيز المنسخة بدقة 100% من الـ curl الخاص بك لضمان الدخول الآمن
    const headers = {
        "authority": "app.unlimitedai.chat",
        "accept": "*/*",
        "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "origin": "https://app.unlimitedai.chat",
        "referer": "https://app.unlimitedai.chat/chat/d4ba75bb-17f4-4af2-bcfd-c83a1c54f951",
        "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '"Android"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
        "x-next-intl-locale": "fr",
        "Cookie": "NEXT_LOCALE=fr; u_device_id=4f7fcfb4-f23e-45d4-afc6-12aea62e889a; __Host-authjs.csrf-token=19b9096919594ef733d8a7ff886b1dd0f853bfbd8474c258a76e6376d0849185%7C1bb1bd9436beea014b651cf8701e048dd7248b4f9a361973c442abc39e3ca3e8; _ga=GA1.1.666063914.1779138924; FCCDCF=%5Bnull%2Cnull%2Cnull%2C%5B%22CQkZ2EAQkZ2EAEsACBFRCfFoAP_gAEPgAARoK3oB_C7EbCFCiDJ3IKMEMAhHABBAYsAwAAYAAgAADBIQIAQCgkEYBASAFCACCAAAKASBAAAgCAAAAUAAIAAFAABAAAwAIBAIIAAAgAAAAEAAAAAACIAAEQCAAAAEAEAAkAgAAAIASEAAAAAAAACBAAAAAAAAAAAAAAAABAEAAQAAQAAAAAAAiAAAAAAAABAIAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAABAAAAAAAQgsIgH8LsRsIUKIMFcgowQwCFcAEABiwDAABgACAAAMEhAgBAKSQRIEAIAQIAAIAAAgBAEAACgICAAAQAAAABUAAEAADAAgEAgAQACAAABAQAAAAAAIgAARAIAAAAQAQACACAAAAgBIQAAAAAAAAIEAAAAAAAAAAAAAAAAAAQAAIADAAAAAAACIAAAAAAAAEAgQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAQAA.ILCIB_C7EbCFCiDJ3IKMEMAhXABBAYsAwAAYAAgAADBIQIAQCkkEaBASAFCACCAAAKASBAAAoCAgAAUAAIAAVAABAAAwAIBAIIEAAgAAAQEAAAAAACIAAEQCAAAAEAEAAkAgAAAIASEAAAAAAAACBAAAAAAAAAAAAAAAABAEAASAAwAAAAAAAiAAAAAAAABAIEAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAABAAAAAAAQgAAE%22%2C%222~61.89.122.161.184.196.230.314.340.442.445.494.550.576.827.1025.1029.1033.1046.1047.1051.1097.1126.1166.1301.1342.1415.1725.1765.1942.1958.1987.2068.2072.2074.2107.2213.2219.2223.2224.2328.2331.2416.2501.2567.2568.2575.2657.2686.2778.2869.2878.2908.2920.2963.3005.3023.3126.3234.3235.3253.3309.3731.6931.8931.13731.15731.33931~dv.%22%2C%228FB19704-ACE9-48DE-AB8E-5CAE30810DD6%22%5D%2Cnull%2Cnull%2C%5B%5B32%2C%22%5B%5C%22323d73b0-7613-43d4-9204-013aab36dfd5%5C%22%2C%5B1779138926%2C554000000%5D%5D%22%5D%5D%5D; __gads=ID=7bf9fd287c227332:T=1779138931:RT=1779138931:S=ALNI_Ma2lDjg38QQADhJ4vhB3iE5jv0_OQ; __gpi=UID=000013a7c95b5c13:T=1779138931:RT=1779138931:S=ALNI_Mbrk63PIK6EZ5f1MhC9WPK8eW6XLQ; __eoi=ID=cc4a883aadf0db80:T=1779138931:RT=1779138931:S=AA-Afjao3jmKpyO0oEQN_KDTLZqP; __Secure-authjs.callback-url=https%3A%2F%2Fapp.unlimitedai.chat%2F; u_anon_id=03b779ae-dcd1-4001-99a7-84a9d1022320; _cfuvid=zjP5xDN_AE3maKHNrKq2zYMx_1OrQUQVrGU12mb.4vU-1779138978.694809-1.0.1.1-4uQc5IOIGJVMYSdRMUFGetHN00WQwtuCiPNEsZ_vrkc; home_chat_id=d4ba75bb-17f4-4af2-bcfd-c83a1c54f951; FCNEC=%5B%5B%22AKsRol8UEtXFaBDCawTKKDNZTLDELzkQq00U1WE6etMCJCBSwQBCX_92I6hwUsa3BLclAssfo2LDomGIn_-JwuZ-1LV7oqrfUPz5S9SlYvaVmrUNSFkhWsRPWjx8hlZUfqUACCT2MHXmX0y-yM4VWwibiBpBZuQ-Sw%3D%3D%22%5D%5D; _ga_BB7FNJV4KQ=GS2.1.s1779138924$o1$g1$t1779139138$j53$l0$h0; __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoiWjg4dnFTTHBFMFEtSFVoQS0zbGZ4bzhSTGxFaWFSZDhWSEZBWWNlR19RLVJSU3hTbnAwSkIxS0dPOVlnWDFGamhxcVhSX1VmZzJTV0pPRl9hek4wX2cifQ..fg7U0QyW3vz3TC_NxLNvvQ.GhW-08PnunhpjFW2X3o2-3ncM0En4KhTkecZ37ZaaJTwT07O4lWkJhugSb89PXKi3laH7swdynFbKykPF50fHQ7_0iKiq505hSMiVUzeq8fgnVwiSwVIOO8mu2xOuKXui8V45o6B6vK5USWsQyNjmdtI1rM9WSzf7zH4GHwqeZRmVSVCDXNVd18VNEQW7qPUhZPmuoFIB-IfXX3CE5GRKxYN-sge0Z7cP2x7Ji9efef2dJjaQW3j6MEcEnL3hkz4r-aU7AfZd05Iz_8hgV_pDzw9XDcjsQ4mbbCkvpyelljMG_hhTqk0mXJ5ZSv0RyVg421UIiHjy7M4iOw29jJvL0CoMf4FF8DdNm_QNnFcGPS6ISN_0wsmSaSzdAlPTSk-i3pjoiPWEKOs3UfK0WmcQHK85OLyqBHgc9ZiR-MgZMzOfLIlxNnMkjyAL7--jY3YNf-nvRnseg9LrGoTQHRSk_ndzPTRcK0MnyYzT8Ui-bhbbJ3yPPEg7hsZPeHjVjEPtHlhK7p3LB77sMdQU43Sd2qH_i8wRxO5u495H8cuczLqBpjNj_WMMxpjmbYdvBqangnNk75eGeKJ05VWyquYyE7zokbAz4umiytqg1xGCyf-8In8KbcwGJjKq5-JPlki.drcKa88wyjLmV7PgOwpismWPHKqUrnA7tZ8MvHKeSeI"
    };

    // توليد معرفات فريدة تلقائياً لتجنب تكرار الجلسات والحدود
    const userMessageId = uuidv4();
    const assistantMessageId = uuidv4();
    const timestamp = new Date().toISOString();

    const payload = {
        "chatId": "d4ba75bb-17f4-4af2-bcfd-c83a1c54f951",
        "messages": [
            {
                "id": userMessageId,
                "role": "user",
                "content": text,
                "parts": [{ "type": "text", "text": text }],
                "createdAt": timestamp
            },
            {
                "id": assistantMessageId,
                "role": "assistant",
                "content": "",
                "parts": [{ "type": "text", "text": "" }],
                "createdAt": timestamp
            }
        ],
        "selectedChatModel": "chat-model-reasoning", // تفعيل نمط التفكير الذكي المتميز
        "selectedCharacter": null,
        "selectedStory": null,
        "deviceId": "4f7fcfb4-f23e-45d4-afc6-12aea62e889a",
        "locale": "fr"
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`Server Error [${response.status}]: ${errBody}`);
        }

        let fullReplyText = "";

        // معالجة تجميع تدفق أسطر الـ JSON المتتالية بدقة وعناية
        response.body.on('data', (chunk) => {
            const chunks = chunk.toString().split('\n');
            for (let part of chunks) {
                const trimmed = part.trim();
                if (!trimmed) continue;
                try {
                    const parsed = JSON.parse(trimmed);
                    // جلب الدلتا وإضافتها للرد النهائي
                    if (parsed.type === "delta" && parsed.delta) {
                        fullReplyText += parsed.delta;
                    }
                } catch (e) {
                    // تفادي أخطاء السطور الجزئية أثناء البث الحي للبيانات
                }
            }
        });

        response.body.on('end', async () => {
            const finalResult = fullReplyText.trim();
            if (finalResult) {
                await conn.sendMessage(m.chat, { 
                    text: `*⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲𝜣 𝑩𝜣𝑻🕷⏤͟͞ू⃪*\n\n${finalResult}` 
                }, { quoted: m });
                await m.react('✅');
            } else {
                m.reply("❌ لم أتمكن من استخراج رد مناسب من خادم التميز. يرجى مراجعة الكوكيز.");
                await m.react('⚠️');
            }
        });

        response.body.on('error', (err) => {
            throw err;
        });

    } catch (e) {
        console.error(e);
        m.reply("❌ حدث خطأ أثناء الاتصال بخوادم التميز AI.");
        await m.react('❌');
    }
};

handler.help = ['التميز'];
handler.tags = ['ai'];
handler.command = /^(التميز|تميز|unlimited)$/i;

export default handler;