import axios from "axios";

// الحقوق الخاصة بك
const myCredit = `.𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ Ａ ⃝🌿ᶦ🎀`;

async function fesnuk(postUrl, cookie = "", userAgent = "") {
    if (!postUrl || !postUrl.trim()) throw new Error("يرجى تحديد رابط فيسبوك صالح.");
    if (!/(facebook.com|fb.watch)/.test(postUrl)) throw new Error("رابط فيسبوك غير صالح.");

    const headers = {
        "sec-fetch-user": "?1",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-site": "none",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "cache-control": "max-age=0",
        authority: "www.facebook.com",
        "upgrade-insecure-requests": "1",
        "accept-language": "en-GB,en;q=0.9",
        "sec-ch-ua": '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
        "user-agent": userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        cookie: cookie || "",
    };

    try {
        const { data } = await axios.get(postUrl, { headers });
        const extractData = data.replace(/"/g, '"').replace(/&/g, "&");

        const sdUrl = match(extractData, /"browser_native_sd_url":"(.*?)"/, /sd_src\s*:\s*"([^"]*)"/)?.[1];
        const hdUrl = match(extractData, /"browser_native_hd_url":"(.*?)"/, /hd_src\s*:\s*"([^"]*)"/)?.[1];

        if (sdUrl || hdUrl) {
            return {
                url: postUrl,
                quality: {
                    sd: parseString(sdUrl || ""),
                    hd: parseString(hdUrl || ""),
                },
            };
        } else {
            throw new Error("تعذر جلب الوسائط في هذا الوقت.");
        }
    } catch (error) {
        throw new Error("حدث خطأ أثناء الاتصال بخوادم فيسبوك.");
    }
}

function parseString(string) {
    try {
        return JSON.parse(`{"text": "${string}"}`).text;
    } catch (e) {
        return string;
    }
}

function match(data, ...patterns) {
    for (const pattern of patterns) {
        const result = data.match(pattern);
        if (result) return result;
    }
    return null;
}

let handler = async (m, { args, conn, usedPrefix }) => {
    if (!args[0]) {
        return conn.reply(m.chat, `*⚠️ خطأ:* يرجى إرسال رابط فيسبوك بعد الأمر.\nمثال: \`${usedPrefix}fb رابط_الفيديو\``, m);
    }

    await conn.reply(m.chat, `*⏳ جاري التحميل بدقة عالية...*`, m);

    try {
        let result = await fesnuk(args[0]);
        // محاولة جلب HD أولاً، إذا لم يوجد نستخدم SD
        let videoUrl = result.quality.hd || result.quality.sd;

        if (videoUrl) {
            await conn.sendMessage(m.chat, {
                video: { url: videoUrl },
                mimetype: 'video/mp4',
                caption: `✅ *تم التحميل بنجاح*\n\nتم بواسطه\n${myCredit}`
            }, { quoted: m });
        } else {
            conn.reply(m.chat, `*❌ خطأ:* تعذر العثور على روابط تحميل.`, m);
        }
    } catch (e) {
        conn.reply(m.chat, `*❌ خطأ:* ${e.message}`, m);
    }
};

handler.help = ['فيسبوك']
handler.tags = ['download']
handler.command = /^(فيسبوك|fb)$/i

export default handler