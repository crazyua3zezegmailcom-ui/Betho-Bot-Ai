/**
 * 📢 Channel Force React Pro — ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 تفاعل القنوات الاحترافي والجماعي (مصلح الأسماء)
 * ⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓
 * التوافقية الكاملة والمثبتة مع Baileys v7.0.0-rc (MEX Supported)
 */

const myCredit = `*_ .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓 _*`;

let handler = async (m, { conn, isOwner, text, usedPrefix, command }) => {
    if (!isOwner) return m.reply('*❌ هذا الأمر للمطور فقط*');

    // الإعدادات الافتراضية للعملية التلقائية إذا لم يتم إدخال رابط مخصص
    const FIXED_CODE = "0029Vb8AK5o7oQhjpG5naq3k";
    const FIXED_MSG_ID = "253";
    const FIXED_EMOJI = "🥷";

    let tasks = [];

    // تحليل المدخلات
    let args = text ? text.trim().split(/\s+/) : [];
    let inputUrl = args[0] && args[0].includes('whatsapp.com') ? args[0] : null;
    let customEmoji = args[1] ? args[1] : "🪐";

    if (inputUrl) {
        // استخراج كود القناة ومعرف الرسالة باستخدام الـ Regex الناجح الخاص بك
        let channelCode = inputUrl.match(/channel\/([^\/]+)/)?.[1];
        let messageId = inputUrl.split('/').pop().split('?')[0];
        
        if (channelCode && messageId) {
            tasks.push({ code: channelCode, msgId: messageId, emoji: customEmoji, isFixed: false });
        } else {
            return m.reply('*❌ الرابط المخصص الذي أدخلته غير صالح! تأكد أنه رابط رسالة قادم من قناة.*');
        }
    } else {
        // إضافة المهمة الافتراضية التلقائية
        tasks.push({ code: FIXED_CODE, msgId: FIXED_MSG_ID, emoji: FIXED_EMOJI, isFixed: true });
    }

    // جلب البوتات الفرعية النشطة (Multi-device sub-bots)
    let allSockets = [conn];
    if (global.conns && Array.isArray(global.conns)) {
        for (let sock of global.conns) {
            if (sock?.user) allSockets.push(sock);
        }
    }

    await m.react('⏳');

    // 1️⃣ إرسال الرسالة المبدئية التي سيتم تعديلها لاحقاً بالتحديثات
    let { key } = await conn.sendMessage(m.chat, { 
        text: `* .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀🍡 _*\n\n⏳ *جـاري جـلـب مـعـلـومـات الـمـنـشـور مـن الـقـنـاة...*` 
    }, { quoted: m });

    let reportMessage = `*⧗⧖⟬〔 REACTION REPORT 〕⟭⧗⧖*\n\n`;

    for (let task of tasks) {
        // جلب الميتاداتا لضمان التحقق من القناة
        let channelInfo = await conn.newsletterMetadata('invite', task.code).catch(() => null);
        if (!channelInfo || !channelInfo.id) {
            reportMessage += `❌ *قناة:* ${task.code}\n⚠️ تعذر الوصول للقناة (الرابط قد يكون منتهي أو محظور)\n---\n`;
            continue;
        }

        let channelJid = channelInfo.id;
        
        // فحص ذكي لجلب الاسم من أي حقل متوفر أو من ذاكرة البوت كحل احتياطي نهائي
        let channelName = channelInfo.name || 
                          channelInfo.subject || 
                          channelInfo.thread_metadata?.name?.text || 
                          (typeof conn.getName === 'function' ? conn.getName(channelJid) : null) || 
                          "قناة خاصة/غير معروفة";

        let successCount = 0;
        let failCount = 0;

        // 2️⃣ تعديل الرسالة فور جلب معلومات المنشور وقبل بدء التفاعل
        await conn.sendMessage(m.chat, {
            text: `* .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀🍡 _*\n\n✅ *تـم جـلـب الـمـعـلـومـات مـحـتـوى الـمـنـشـور:* \n📢 *الـقـنـاة:* ${channelName}\n📌 *معرف الرسالة:* #${task.msgId}\n✨ *التفاعل المستهدف:* [ ${task.emoji} ]\n\n⚡ *جـاري بدء إرسـال الـتـفـاعـل الآن بـواسطـة (${allSockets.length}) بـوت...*`,
            edit: key
        }, { quoted: m });

        for (let sock of allSockets) {
            let actionSuccess = false;
            try {
                // المتابعة التلقائية وإلغاء الكتم لضمان قبول السيرفر للتفاعل
                try {
                    await sock.newsletterFollow(channelJid).catch(() => {});
                    await sock.newsletterUpdateMuted(channelJid, false).catch(() => {});
                } catch (e) {}
                
                // انتظار طفيف بين الإجراءات
                await new Promise(resolve => setTimeout(resolve, 500));

                // المحاولة الأولى: استخدام دالة التفاعل المخصصة لـ Baileys المحدثة
                try {
                    await sock.newsletterReactMessage(channelJid, task.msgId, task.emoji);
                    actionSuccess = true;
                } catch (e) { 
                    actionSuccess = false;
                }

                // المحاولة الثانية: استخدام دالة الإرسال البديلة والمدعومة في النسخة المحدثة 7.x
                if (!actionSuccess) {
                    try {
                        await sock.sendMessage(channelJid, { 
                            react: { text: task.emoji, key: { remoteJid: channelJid, fromMe: false, id: task.msgId } } 
                        }, { newsletter: true });
                        actionSuccess = true;
                    } catch (err) {
                        actionSuccess = false;
                    }
                }

                if (actionSuccess) {
                    successCount++;
                } else {
                    failCount++;
                }

                // انتظار تفادي الحظر من سيرفر واتساب
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (sockError) {
                failCount++;
            }
        }

        reportMessage += `🎯 *القناة:* ${channelName}\n` +
                         `❤️ *التفاعل:* ${task.emoji}\n` +
                         `✅ نجح: ${successCount}\n` +
                         `❌ فشل: ${failCount}\n` +
                         `📌 *النوع:* ${task.isFixed ? 'دعم ثابت تلقائي' : 'رابط مخصص'}\n---\n`;
    }

    await m.react('✅');

    // 3️⃣ تعديل الرسالة النهائي لتأكيد نجاح التفاعل بالكامل وعرض التقرير النهائي المفصل
    await conn.sendMessage(m.chat, { 
        text: reportMessage + `\n${myCredit}\n> *POWERED BY SIR. AYANO*`,
        edit: key
    }, { quoted: m });
}

handler.help = ['تفاعل [الرابط] [الايموجي]'];
handler.tags = ['tools'];
handler.command = /^(🗿|🔥)$/i;
handler.rowner = true;

export default handler;