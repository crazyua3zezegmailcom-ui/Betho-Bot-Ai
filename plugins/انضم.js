/**
 * 📥 Join Group Plugin — أمر انضمام البوت للمجموعات
 * ⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓
 * حقوق التعديل: Arab Top Dev
 */

const myCredit = `*_ .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓 _*`;

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // 1. التحقق من كتابة الرابط
    if (!text) return m.reply(`*⚠️ يـرجى كـتابة رابـط الـمجموعة بـعد الأمـر!*\n*مثال:* ${usedPrefix + command} https://chat.whatsapp.com/Code`);

    // استخراج الكود الخاص بالدعوة من الرابط باستخدام Regex
    const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
    const [ , code ] = text.match(linkRegex) || [];
    
    if (!code) return m.reply('❌ *رابـط الـمجموعة غـير صـحيح أو غـير مـدعوم!*');

    await m.react('⏳');

    try {
        // 2. محاولة الانضمام للمجموعة عبر كود الدعوة
        const resId = await conn.groupAcceptInvite(code);
        
        if (!resId) throw new Error("فشل الانضمام التلقائي");

        // 3. جلب بيانات المجموعة بعد الدخول مباشرة لمعرفة الاسم وعدد الأعضاء
        const groupMetadata = await conn.groupMetadata(resId).catch(() => null);
        const groupName = groupMetadata ? groupMetadata.subject : 'تعذر جلب الاسم';
        const memberCount = groupMetadata && groupMetadata.participants ? groupMetadata.participants.length : 'غير معروف';
        
        // استخراج رقم المطور الذي قام بطلب الأمر
        const developerNumber = m.sender.split('@')[0];

        // 4. إرسال رسالة ترحيبية فورية داخل الجروب الجديد الذي انضم إليه البوت
        await conn.sendMessage(resId, { 
            text: `👋 *تـم تـسجيل دخـول لـي بـنجاح فـي الـمجموعة!* 🌸\n\n_أنا هنا لمساعدتكم وتلبية أوامركم الممتعة._ 🍓\n${myCredit}` 
        });

        // 5. تجهيز تقرير النجاح الفخم لإرساله في الشات الحالي للمطور
        let reportCaption = `✨ *تم تسجيل دخول لي بنجاح* 🍓\n\n` +
                            `📦 *مجموعة :* ${groupName}\n` +
                            `🔗 *رابط المجموعة :* https://chat.whatsapp.com/${code}\n` +
                            `👥 *عدد الأعضاء :* ﹝ ${memberCount} عضو ﹞\n` +
                            `👑 *طلب من المطور :* wa.me/${developerNumber}\n\n` +
                            `${myCredit}`;

        await m.react('✅');
        return await conn.sendMessage(m.chat, { text: reportCaption }, { quoted: m });

    } catch (e) {
        console.error('Join Group Error:', e);
        await m.react('❌');
        return m.reply('❌ *حـصل خـطأ أثـناء الـمحاولة، قـد يـكون الـبوت مـطروداً سـابقاً من الـجروب أو أن الرابـط مـنتهي!*');
    }
};

handler.help = ['انضم'];
handler.tags = ['owner'];
handler.command = /^(انضم|join)$/i;

// جعل الأمر حصري للمطورين الأساسيين فقط لحماية البوت من الدخول العشوائي
handler.rowner = true; 

export default handler;