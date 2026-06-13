import axios from 'axios';
import { randomBytes } from 'crypto';
import { writeFileSync, unlinkSync } from 'fs';
import { channelButton } from '../system/buttons.js'

const handler = async (m, { conn, text }) => {
    try {
        // Validate input
        if (!text) {
            return conn.sendMessage(m.chat, {
                text: `🎓 *DegreeGuru AI*\n\nUsage example:\n.degree <question>\nExample: .degree How to conduct scientific research?`
            }, { quoted: m });
        }

        // Typing indicator
        await conn.sendPresenceUpdate('composing', m.chat);

        // Execute request
        const apiResponse = await axios.post('https://degreeguru.vercel.app/api/guru', 
            {
                messages: [
                    {
                        role: "system",
                        content: "**Welcome to DegreeGuru**\n\nYour ultimate companion in navigating the academic landscape of Stanford."
                    },
                    {
                        role: "user",
                        content: text
                    }
                ]
            },
            {
                headers: {
                    'accept': '*/*',
                    'content-type': 'application/json',
                    'origin': 'https://degreeguru.vercel.app',
                    'referer': 'https://degreeguru.vercel.app/',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
                }
            }
        ).then(res => res.data).catch(() => ({ error: 'Failed to get API response' }));

        // Format response
        const resultText = apiResponse.error 
            ? `⚠️ Error: ${apiResponse.error}`
            : JSON.stringify(apiResponse, null, 2);

        // Handle long responses
        if (resultText.length > 1500) {
            const filename = `degree_${randomBytes(4).toString('hex')}.json`;
            writeFileSync(filename, resultText);
            
            await conn.sendMessage(m.chat, {
                document: { url: filename },
                fileName: `DegreeGuru_Result_${Date.now()}.json`,
                mimetype: 'application/json',
                caption: `📚 Result for: ${text.slice(0, 35)}${text.length > 35 ? '...' : ''}`,
        footer: '『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』',
        buttons: channelButton()}, { quoted: m });
            
            return unlinkSync(filename);
        }

        // Send as text
        await conn.sendMessage(m.chat, {
            text: `🎓 *DegreeGuru Result*\n\n${resultText}`,
            mentions: [m.sender],
        footer: '『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』',
        buttons: channelButton()}, { quoted: m });

    } catch (e) {
        console.error('Error:', e);
        await conn.sendMessage(m.chat, {
            text: `❌ Error: ${e.message}\nPlease try again or use a more specific question.`,
            mentions: [m.sender],
        footer: '『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』',
        buttons: channelButton()}, { quoted: m });
    }
};

// Handler configuration
handler.help = ['درجة-ذكاء'];
handler.tags = ['ai'];
handler.command = /^(درجة-ذكاء)$/i;
handler.limit = false;
handler.premium = false;

export default handler;
