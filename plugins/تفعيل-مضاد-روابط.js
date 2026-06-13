// ═══════════════════════════════════════════════
// أمر تفعيل / إيقاف مضاد الروابط (3 إنذارات ثم طرد)
// ═══════════════════════════════════════════════

let handler = async (m, { conn, command, isAdmin, isOwner }) => {
    if (!m.isGroup) return m.reply('❌ هذا الأمر فقط للمجموعات');
    if (!isAdmin && !isOwner) return m.reply('❌ هذا الأمر للمشرفين فقط');

    let chat = global.db.data.chats[m.chat];
    let isEnable = command === 'تفعيل-مضاد-الروابط';
    
    if (isEnable) {
        chat.antiLink = true;
        m.reply('✅ *تم تفعيل مضاد الروابط*\nسيتم إنذار العضو 3 مرات ثم طرده.');
    } else {
        chat.antiLink = false;
        // مسح سجل الإنذارات عند الإيقاف (اختياري)
        m.reply('❌ *تم إيقاف مضاد الروابط*');
    }
};

handler.help = ['تفعيل-مضاد-الروابط', 'ايقاف-مضاد-الروابط'];
handler.tags = ['group'];
handler.command = /^(تفعيل-مضاد-الروابط|ايقاف-مضاد-الروابط)$/i;
handler.group = true;
handler.admin = true;

export default handler;