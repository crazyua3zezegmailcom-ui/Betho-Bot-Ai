import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { bug } = require('../system/bug.cjs');
const { bugUrl } = require('../system/bugUrl.cjs');

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`*⚠️ أرسل رقم الشخص بعد الأمر!*\n*مثال:* ${usedPrefix + command} +20111xxxxxxx`);

    const number = text.replace(/[^0-9]/g, '');
    if (!number) return m.reply('❌ *الرقم غير صحيح!*');

    const jid = number + '@s.whatsapp.net';

    await m.react('⏳');

    try {
        await conn.sendMessage(jid, { text: bug });
        await conn.sendMessage(jid, { text: bugUrl });
        await m.react('✅');
        m.reply(`✅ *تم الإرسال إلى* +${number}`);
    } catch (e) {
        console.error('[متعه]', e);
        await m.react('❌');
        m.reply(`❌ *فشل الإرسال:* ${e.message}`);
    }
};

handler.help = ['متعه <رقم>'];
handler.tags = ['owner'];
handler.command = /^(متعه)$/i;
handler.rowner = true;

export default handler;
