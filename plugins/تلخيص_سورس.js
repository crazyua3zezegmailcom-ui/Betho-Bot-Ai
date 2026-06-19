import axios from 'axios'
import fs from 'fs'
import path from 'path'

const myCredit = `*_ .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓 _*`;

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // 1. التحقق من إدخال الرابط
    if (!text) return m.reply(`*⚠️ يـرجى كـتابة رابـط الـموقع بـعد الأمـر!*\n*مثال:* ${usedPrefix + command} https://witanime.you`);

    // تنظيف الرابط والتأكد من صيغته
    let targetUrl = text.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'https://' + targetUrl;
    }

    // استخراج اسم النطاق/الموقع لتسمية الملف بشكل ذكي
    let domainName = 'site';
    try {
        domainName = new URL(targetUrl).hostname.replace('www.', '');
    } catch {
        domainName = 'source';
    }

    // 2. التفاعل بـ ⏳
    await m.react('⏳');

    // 3. إرسال رسالة جاري جلب السورس
    let statusMsg = await m.reply(`* .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀🍡 _*\n\n*_ جاري فحص وقراءة سورس الموقع عبر Jina AI... يرجى الانتظار 🕒 _*`);

    try {
        // 4. بناء الرابط الخاص بـ Jina AI والاستعلام عنه
        let jinaApiUrl = `https://r.jina.ai/${targetUrl}`;
        
        // جلب البيانات مع وضع timeout مناسب لمنع تعليق البوت
        let response = await axios.get(jinaApiUrl, { timeout: 15000 });
        let resultData = response.data;

        if (!resultData || resultData.trim().length === 0) {
            throw new Error('لم يتم إرجاع أي بيانات من الموقع المطلوب.');
        }

        // 5. تجهيز النص للارسال (تحديد حجم النص لمنع تجاوز حدود رسائل الواتساب الاقصى)
        let previewText = resultData.length > 2000 
            ? resultData.substring(0, 2000) + '\n\n... (تم قص النص لطوله، النص الكامل بالملف المرفق بالأسفل) 📂' 
            : resultData;

        let caption = `*🎁 تم جلب وتلخيص السورس بنجاح*\n\n` +
                      `*🌐 الموقع المستهدف:* ${targetUrl}\n` +
                      `*🛠️ الخدمة المستخدمة:* Jina Reader API\n\n` +
                      `*📝 مقتطف من السورس:*\n\`\`\`${previewText}\`\`\`\n\n` +
                      `📂 تم إرفاق السورس بالكامل كملف نصي بالأسفل جاهز للاستخدام.\n\n` +
                      `${myCredit}`;

        // 6. إنشاء ملف الـ TXT المؤقت لحفظ السورس الكامل
        let fileName = `${domainName}.txt`;
        let filePath = path.join(process.cwd(), 'tmp', fileName);

        // التأكد من وجود مجلد tmp المؤقت في السيرفر لمنع كراش البوت
        if (!fs.existsSync(path.join(process.cwd(), 'tmp'))) {
            fs.mkdirSync(path.join(process.cwd(), 'tmp'));
        }

        fs.writeFileSync(filePath, resultData, 'utf-8');

        // 7. النجاح: تغيير التفاعل لـ ✅ وإرسال النص ومرفق معه الملف النصي
        await m.react('✅');
        await conn.sendMessage(m.chat, { text: `*✅ تم القراءة والمعالجة بنجاح!*`, edit: statusMsg.key });

        // إرسال الملف النصي مع الكابشن المخلص
        await conn.sendMessage(m.chat, {
            document: fs.readFileSync(filePath),
            mimetype: 'text/plain',
            fileName: fileName,
            caption: caption
        }, { quoted: m });

        // تنظيف وحذف الملف المؤقت من السيرفر بعد الإرسال مباشرة للحفاظ على مساحة الرام والهارديسك
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        // حذف رسالة "جاري الفحص" لتنظيف الشات
        await conn.sendMessage(m.chat, { delete: statusMsg.key });

    } catch (e) {
        console.error(e);
        await m.react('❌');
        await conn.sendMessage(m.chat, { 
            text: `*❌ خـطأ أثـناء جـلب الـسورس!*\n_${e.message || 'تأكد من أن الرابط يعمل بشكل صحيح أو حاول لاحقاً.'}_`, 
            edit: statusMsg.key 
        }, { quoted: m });
    }
};

handler.help = ['تلخيص_سورس <الرابط>'];
handler.tags = ['tools'];
handler.command = /^(تلخيص_سورس|تلخيص|سورس)$/i;

export default handler;