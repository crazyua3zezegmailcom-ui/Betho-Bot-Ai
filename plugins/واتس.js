import axios from 'axios'

const myCredit = `*_ .𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 _*`;

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`*⚠️ يـرجى كـتابة رقـم الـهاتف بـعد الأمـر!*\n*مثال:* ${usedPrefix + command} +20111854xxxx`);

    let number = text.replace(/[^0-9]/g, '');
    if (!number) return m.reply('❌ *الـرقم الـمستخدَم غـير صـحيح!*');

    await m.react('⏳');

    let statusMsg = await m.reply(`*_ .𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 _*\n\n*_ جاري الفحص والتعديل يرجى الانتظار والصلاة على النبي..... 🕒 _*`);

    try {
        let jid = number + '@s.whatsapp.net';
        let [result] = await conn.onWhatsApp(jid);

        let accountType = 'لا يوجد حساب واتساب';
        if (result && result.exists) {
            accountType = result.biz ? 'حساب أعمال (Business)' : 'حساب عادي (Personal)';
        } else {
            throw new Error('الـرقم غـير مـسجل فـي الـواتساب أصـلاً.');
        }

        let profilePic;
        try {
            profilePic = await conn.profilePictureUrl(jid, 'image');
        } catch {
            profilePic = 'https://telegra.ph/file/24fa902eee85d33618514.png';
        }

        let country = 'دولة غير معروفة 🌍';
        if (number.startsWith('20')) country = 'مصر 🇪🇬';
        else if (number.startsWith('966')) country = 'السعودية 🇸🇦';
        else if (number.startsWith('968')) country = 'عُمان 🇴🇲';
        else if (number.startsWith('964')) country = 'العراق 🇮🇶';
        else if (number.startsWith('971')) country = 'الإمارات 🇦🇪';
        else if (number.startsWith('965')) country = 'الكويت 🇰🇼';
        else if (number.startsWith('974')) country = 'قطر 🇶🇦';
        else if (number.startsWith('973')) country = 'البحرين 🇧🇭';
        else if (number.startsWith('212')) country = 'المغرب 🇲🇦';
        else if (number.startsWith('213')) country = 'الجزائر 🇩🇿';
        else if (number.startsWith('216')) country = 'تونس 🇹🇳';
        else if (number.startsWith('249')) country = 'السودان 🇸🇩';
        else if (number.startsWith('962')) country = 'الأردن 🇯🇴';
        else if (number.startsWith('963')) country = 'سوريا 🇸🇾';
        else if (number.startsWith('961')) country = 'لبنان 🇱🇧';
        else if (number.startsWith('970')) country = 'فلسطين 🇵🇸';
        else if (number.startsWith('967')) country = 'اليمن 🇾🇪';
        else if (number.startsWith('218')) country = 'ليبيا 🇱🇾';

        let directLink = `https://wa.me/${number}`;

        let caption = `*🎁 تم أنتهاء التعديل والفحص*\n\n` +
                      `*الدوله :* ${country}\n` +
                      `*حساب واتس :* ${accountType}\n` +
                      `*متصل : زمن اخر اتصال :* لا يوجد 🔏\n` +
                      `*رابط مباشر :* ${directLink}\n\n` +
                      `${myCredit}`;

        await m.react('✅');
        await conn.sendMessage(m.chat, { text: `*✅ تم الانتهاء وجلب البيانات بنجاح!*`, edit: statusMsg.key });

        await conn.sendMessage(m.chat, {
            image: { url: profilePic },
            caption: caption
        }, { quoted: m });

        await conn.sendMessage(m.chat, { delete: statusMsg.key });

    } catch (e) {
        console.error(e);
        await m.react('❌');
        await conn.sendMessage(m.chat, {
            text: `*❌ خـطأ أثـناء الـفحص!*\n_${e.message || 'تأكد من كتابة الرقم مع كود الدولة الصحيح.'}_`,
            edit: statusMsg.key
        }, { quoted: m });
    }
};

handler.help = ['واتس <الرقم>'];
handler.tags = ['tools'];
handler.command = /^(واتس|رقم)$/i;

export default handler;
