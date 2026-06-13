import fs from 'fs';
import { channelButton } from '../system/buttons.js'

let handler = async (m, { conn, text }) => {

    m.reply('لحظة سوف يتم تلبية طلبكم');

    // Read the content of creds.json
    let sesi = await fs.readFileSync('./sessions/creds.json', 'utf-8');
    
    // Send the content of creds.json as text
    await conn.sendMessage(m.chat, { text: sesi,
        footer: '『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』',
        buttons: channelButton()}, { quoted: m });

    // Send the creds.json file as a document
    return await conn.sendMessage(m.chat, { document: Buffer.from(sesi), mimetype: 'application/json', fileName: 'creds.json' }, { quoted: m });
    }

handler.help = ['جلب-الجلسة'];
handler.tags = ['owner'];
handler.command = /^جلب-الجلسة$/i;

handler.rowner = true;

export default handler;
