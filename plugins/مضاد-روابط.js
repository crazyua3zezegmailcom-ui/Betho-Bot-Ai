// ═══════════════════════════════════════════════
// مضاد الروابط مع 3 إنذارات ثم طرد
// ═══════════════════════════════════════════════

let linkRegex  = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
let linkRegex1 = /whatsapp\.com\/channel\/([0-9A-Za-z]{20,24})/i;

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, participants }) {

    if (!m.isGroup) return;
    if (isAdmin || isOwner || m.fromMe || isROwner) return;

    let chat = global.db.data.chats[m.chat];
    if (!chat.antiLink) return; // غير مفعل

    const isGroupLink = linkRegex.exec(m.text) || linkRegex1.exec(m.text);
    if (!isGroupLink) return;

    // رابط المجموعة نفسه مسموح
    if (isBotAdmin) {
        const linkThisGroup = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`;
        if (m.text.includes(linkThisGroup)) return;
    }

    // حذف الرسالة فوراً
    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.sender } });

    // إدارة الإنذارات
    let user = global.db.data.users[m.sender];
    if (!user.antilinkWarnings) user.antilinkWarnings = 0;
    user.antilinkWarnings += 1;
    let warns = user.antilinkWarnings;

    let msg = '';
    if (warns === 1) {
        msg = `⚠️ *إنذار 1/3* \n@${m.sender.split('@')[0]} ممنوع إرسال روابط المجموعات!`;
    } else if (warns === 2) {
        msg = `⚠️ *إنذار 2/3* \n@${m.sender.split('@')[0]} آخر إنذار قبل الطرد!`;
    } else if (warns >= 3) {
        msg = `🚫 *@${m.sender.split('@')[0]} تم طرده لإرساله روابط بعد 3 إنذارات*`;
        if (isBotAdmin) {
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
            delete user.antilinkWarnings; // إعادة تعيين بعد الطرد
        } else {
            msg += `\n⚠️ البوت ليس مشرفاً، لم يتم الطرد.`;
        }
    }

    if (msg) {
        await conn.sendMessage(m.chat, { text: msg, mentions: [m.sender] });
    }

    if (warns >= 3 && isBotAdmin) {
        // تم الطرد أعلاه
    }
}