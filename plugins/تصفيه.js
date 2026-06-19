/**
 * 🧹 Group Purge & Reset — أمر تصفية وإعادة ضبط المجموعة بالكامل
 * ⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓
 * حقوق التعديل: Arab Top Dev
 */

const myCredit = `*_ .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓 _*`;

let handler = async (m, { conn, usedPrefix, command }) => {
    // 1. التأكد أن الأمر يتم استخدامه داخل مجموعة
    if (!m.isGroup) return m.reply('❌ *هـذا الأمـر مـخصص للـمجموعات فـقط!*');

    await m.react('⏳');
    
    // إرسال رسالة بدء العملية
    let statusMsg = await m.reply('☣️ *جـاري بـدء عـملية الـتصفية الشـاملة للمـجموعة... يـرجى الانـتظار*');

    try {
        // 2. جلب بيانات المجموعة والأعضاء
        const groupMetadata = await conn.groupMetadata(m.chat);
        const participants = groupMetadata.participants;

        // تصفية الأعضاء: استخراج الأعضاء العاديين فقط وتجنب المشرفين (Admins) والبوت نفسه
        const usersToKick = participants
            .filter(p => !p.admin && p.id !== conn.user.jid)
            .map(p => p.id);

        // 3. تنفيذ عملية الطرد الجماعي للأعضاء العاديين (نظام حزم آمن)
        if (usersToKick.length > 0) {
            for (let i = 0; i < usersToKick.length; i += 5) {
                const batch = usersToKick.slice(i, i + 5);
                await conn.groupParticipantsUpdate(m.chat, batch, 'remove').catch(e => console.log('Kick error:', e));
                await new Promise(resolve => setTimeout(resolve, 500)); 
            }
        }

        // 4. تغيير اسم المجموعة
        const newTitle = `ؔ⃠𓅓𓏲Ⅿ᭄̼̻̽ ⃟Ỏ᭄⃟ Ν᭄⃟ Τ᭄ᷜᷡᷱ⃟ Ｅ᭄̳͆⃞⃟🇦🇱 don`;
        await conn.groupUpdateSubject(m.chat, newTitle);

        // 5. تغيير وصف المجموعة
        const newDesc = `تم اخلاء اللعبه ب نجاح`;
        await conn.groupUpdateDescription(m.chat, newDesc);

        // 6. تغيير صورة المجموعة من رابط Catbox
        const targetImgUrl = 'https://i.postimg.cc/Fsx4fvfK/IMG-20260610-WA0075.jpg';
        await conn.updateProfilePicture(m.chat, { url: targetImgUrl });

        // 7. إرسال تقرير النجاح النهائي
        await m.react('✅');
        let finalReport = `👑 *تـم إنـهاء الـتصفية وإعـادة الضـبط بـنجاح!* 🍓\n\n` +
                           `🧹 *عـدد الـمطرودين:* ﹝ ${usersToKick.length} عضو ﹞\n` +
                           `📝 *الـوصف الـجديد:* ${newDesc}\n\n` +
                           `${myCredit}`;

        return await conn.sendMessage(m.chat, { text: finalReport, edit: statusMsg.key });

    } catch (e) {
        console.error('Purge Command Error:', e);
        await m.react('❌');
        return m.reply('❌ *حـصل خـطأ أثـناء الـتصفية، يـرجى الـتحقق من الـسيرفر.*');
    }
};

handler.help = ['تصفية'];
handler.tags = ['owner', 'group'];
handler.command = /^(تصفية|purge|clearall)$/i;

// حظر استخدام الأمر إلا لمالك البوت (Rowner)
handler.rowner = true; 

export default handler;