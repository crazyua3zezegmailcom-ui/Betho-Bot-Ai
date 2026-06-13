/* تـم التـعديل والـتـحـسـيـن بـحـسـب طـلـب الـمـطـور: ᴇsᴄᴀɴᴏʀ 🍁 */
/* ִᗀᩙᰰ ̼𝆬🍒̸〫 ᮭ࣪࣪ ⸼۫  𝑵𝑰𝑵𝑶 𝑩𝑶𝑻 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🍒 */

import fetch from 'node-fetch';

const spotifyDownloader = async (m, { conn, text }) => {
    if (!text) {
        return m.reply(`> *﹝ ✍️⃝🌿 يـرجـى إرسـال رابـط سـبـوتـيـفـاي • ˼‏🌟˹ •﹞*`);
    }

    const match = text.match(/https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/);
    if (!match) {
        return m.reply(`> *﹝ ⚠️ رابـط غـيـر صـحـيـح، يـرجـى الـتـأكـد • ˼‏🌟˹ •﹞*`);
    }

    const trackUrl = match[0];
    const trackId = match[1];
    await m.react('⏳');

    try {
        // 🔁 استخدام API بديل موثوق (SpotifyDown.com API)
        const apiUrl = `https://api.spotifydown.com/download/${trackId}`;
        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) throw new Error('فشل الاتصال بـ API');
        
        const data = await response.json();
        
        // التأكد من نجاح العملية وجود رابط التحميل
        if (!data.success || !data.link) {
            throw new Error('الـ API لم يُعد رابط تحميل صالح');
        }
        
        const downloadLink = data.link;
        
        // جلب ملف الأغنية من الرابط المباشر
        const audioResponse = await fetch(downloadLink);
        if (!audioResponse.ok) throw new Error('فشل تحميل ملف الأغنية');
        
        const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
        
        // التحقق من حجم الملف (أكبر من 500 كيلوبايت لتجنب الملفات التالفة)
        if (audioBuffer.length < 500000) {
            throw new Error('الملف الذي تم تحميله صغير جدًا - قد يكون خاطئًا');
        }

        await conn.sendMessage(m.chat, { 
            audio: audioBuffer, 
            mimetype: 'audio/mpeg', 
            ptt: false 
        }, { quoted: m });

        await m.react('✅');

    } catch (error) {
        console.error(error);
        await m.react('❌');
        m.reply(`*⎔═━═━ ╃━ ❌⃝❄ ━╄ ━═━═⎔*\n> *﹝ ⚠️ عـذراً، فشل تحميل الأغنية الصحيحة. قد يكون الرابط معطوبًا أو الخادم مشغولاً. • ˼‏🌟˹ •﹞*`);
    }
};

spotifyDownloader.command = ['spotify', 'سبوتيفاي'];
spotifyDownloader.help = ['spotify <الرابط>'];
export default spotifyDownloader;