import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(
            `⚠️ *يرجى إدخال رابط الرسالة من القناة.*\n\n` +
            `📌 *الاستخدام:*\n` +
            `${usedPrefix + command} https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e/175\n\n` +
            `📝 *ملاحظة:*\n` +
            `• انسخ الرابط من القناة مباشرة\n` +
            `• الرابط يكون بالشكل: https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e/YYYY`
        );
    }

    // التفاعل برمز البحث
    await m.react('🔍');

    // استخراج معرف القناة ومعرف الرسالة من الرابط
    const urlMatch = text.match(/channel\/([a-zA-Z0-9_\-]+)\/(\d+)/);
    
    if (!urlMatch) {
        await m.react('❌');
        return m.reply(
            `❌ *رابط غير صالح!*\n\n` +
            `✅ *الرابط الصحيح:*\n` +
            `https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e/175\n\n` +
            `📌 *كيفية الحصول على الرابط:*\n` +
            `1. افتح القناة\n` +
            `2. اضغط مطولاً على الرسالة\n` +
            `3. اختر "نسخ الرابط"`
        );
    }

    const [, channelId, serverMsgId] = urlMatch;

    try {
        // محاولة جلب رسائل القناة
        let messages = [];

        // محاولة 1: جلب مباشر
        try {
            messages = await conn.newsletterFetchMessages('direct', channelId, 20);
        } catch (e1) {
            console.log(`⚠️ Direct fetch failed: ${e1.message}`);
            
            // محاولة 2: جلب عبر invite
            try {
                messages = await conn.newsletterFetchMessages('invite', channelId, 20);
            } catch (e2) {
                console.log(`⚠️ Invite fetch failed: ${e2.message}`);
                
                // محاولة 3: جلب عبر jid مباشر
                try {
                    const channelJid = channelId + '@newsletter';
                    messages = await conn.newsletterFetchMessages('jid', channelJid, 20);
                } catch (e3) {
                    console.log(`⚠️ JID fetch failed: ${e3.message}`);
                }
            }
        }

        if (!messages || messages.length === 0) {
            await m.react('❌');
            return m.reply(
                `❌ *لم يتم العثور على رسائل في القناة!*\n\n` +
                `🔒 *الأسباب المحتملة:*\n` +
                `• القناة خاصة (Private)\n` +
                `• لم تشترك في القناة\n` +
                `• القناة محذوفة\n\n` +
                `✅ *الحل:* تأكد من الاشتراك في القناة أولاً`
            );
        }

        // البحث عن الرسالة المحددة
        const targetMsg = messages.find(m => 
            m.serverId === serverMsgId || 
            m.messageId === serverMsgId ||
            m.key?.id === serverMsgId
        );

        // إعداد نص الرد
        let replyText = '';
        
        if (!targetMsg) {
            // إذا لم نجد الرسالة المحددة، نعرض آخر رسالة مع تنبيه
            const latestMsg = messages[0];
            const latestText = latestMsg.message?.conversation || 
                              latestMsg.message?.extendedTextMessage?.text ||
                              latestMsg.message?.imageMessage?.caption ||
                              latestMsg.message?.videoMessage?.caption ||
                              '';
            
            replyText = 
                `⚠️ *لم يتم العثور على الرسالة المحددة*\n` +
                `🆔 *Server ID المطلوب:* ${serverMsgId}\n\n` +
                `📌 *آخر رسالة متاحة في القناة:*\n` +
                `━━━━━━━━━━━━━━━━━━━━━━\n` +
                `${latestText || '(رسالة وسائط)'}\n` +
                `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `🆔 *Server ID المتاح:* ${latestMsg.serverId || 'غير معروف'}`;
            
            await m.react('⚠️');
        } else {
            // تم العثور على الرسالة
            const msgText = targetMsg.message?.conversation || 
                           targetMsg.message?.extendedTextMessage?.text ||
                           targetMsg.message?.imageMessage?.caption ||
                           targetMsg.message?.videoMessage?.caption ||
                           '';
            
            const sender = targetMsg.pushName || 
                          targetMsg.key?.participant || 
                          'قناة';
            
            const timestamp = targetMsg.messageTimestamp 
                ? new Date(targetMsg.messageTimestamp * 1000).toLocaleString('ar-SA') 
                : 'غير معروف';
            
            const msgType = targetMsg.message?.imageMessage ? '🖼️ صورة' :
                           targetMsg.message?.videoMessage ? '🎥 فيديو' :
                           targetMsg.message?.documentMessage ? '📄 ملف' :
                           targetMsg.message?.audioMessage ? '🎵 صوت' :
                           '💬 نص';

            replyText = 
                `📨 *تفاصيل الرسالة*\n` +
                `━━━━━━━━━━━━━━━━━━━━━━\n` +
                `👤 *المرسل:* ${sender}\n` +
                `🕐 *التاريخ:* ${timestamp}\n` +
                `🆔 *Server ID:* ${serverMsgId}\n` +
                `📎 *النوع:* ${msgType}\n` +
                `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `💬 *المحتوى:*\n` +
                `${msgText || '(لا يوجد نص - رسالة وسائط)'}`;
            
            await m.react('✅');
        }

        // إرسال الرد
        await conn.sendMessage(m.chat, { text: replyText }, { quoted: m });

        // إذا كانت الرسالة تحتوي على وسائط، نحاول إعادة توجيهها
        if (targetMsg && (targetMsg.message?.imageMessage || 
                         targetMsg.message?.videoMessage || 
                         targetMsg.message?.documentMessage)) {
            try {
                await conn.sendMessage(m.chat, {
                    forward: {
                        key: targetMsg.key,
                        message: targetMsg.message
                    }
                }, { quoted: m });
            } catch (fwdErr) {
                console.log(`⚠️ فشل إعادة توجيه الميديا: ${fwdErr.message}`);
                await conn.sendMessage(m.chat, { 
                    text: `⚠️ *تنبيه:* لم يتمكن البوت من إعادة توجيه المرفقات` 
                }, { quoted: m });
            }
        }

    } catch (err) {
        console.error(`❌ خطأ في getmsg:`, err);
        await m.react('❌');
        await conn.sendMessage(m.chat, { 
            text: `❌ *حدث خطأ أثناء جلب الرسالة!*\n\n` +
                   `📛 *السبب:* ${err.message}\n\n` +
                   `🔧 *جرب:*\n` +
                   `• تأكد من صحة الرابط\n` +
                   `• تأكد من اشتراكك في القناة\n` +
                   `• حاول مرة أخرى لاحقاً`
        }, { quoted: m });
    }
};

handler.help = ['getmsg'];
handler.tags = ['tools'];
handler.command = ['getmsg', 'جلب', 'رسالة'];
handler.desc = 'جلب رسالة من قناة واتساب باستخدام رابط الرسالة';

export default handler;