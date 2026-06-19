/**
 * 📢 Hidden Tag Pro (منشن مخفي مع دعم المنشنات اليدوية) — ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥
 * ⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓
 */

let handler = async (m, { conn, text, participants }) => {
    // 1. جلب قائمة كل الأعضاء للإشعار المخفي
    let allUsers = participants.map(u => u.id);

    // 2. التحقق من وجود رسالة (نص أو رد)
    let q = m.quoted ? m.quoted : m;
    let messageContent = text ? text : (m.quoted && m.quoted.text ? m.quoted.text : '');

    if (!messageContent && !m.quoted) {
        return m.reply('*⚠️ يـرجى كـتابة نـص أو الـرد على رسـالة لـعمل مـنشـن مـخفي.*');
    }

    // 3. جلب المنشنات اليدوية (لو كتبت @فلان في نص الأمر)
    // ندمج المنشنات الموجودة في الرسالة مع قائمة كل الأعضاء
    let mentions = [...allUsers]; 
    if (m.mentionedJid) {
        m.mentionedJid.forEach(jid => {
            if (!mentions.includes(jid)) mentions.push(jid);
        });
    }

    // 4. إرسال الرسالة
    // نستخدم دالة sendMessage مع خاصية mentions لضمان تفعيل الروابط الزرقاء
    await conn.sendMessage(m.chat, { 
        text: messageContent, 
        mentions: mentions 
    }, { quoted: m });
}

handler.help = ['مخفي'];
handler.tags = ['group'];
handler.command = /^(مخفي|hidetag)$/i;
handler.group = true;
handler.admin = true; // لضمان استخدامه من قبل المشرفين فقط

export default handler;