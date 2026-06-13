import axios from 'axios';
import { downloadButtons } from '../system/buttons.js'

let handler = async (m, { conn, text, command }) => {
    
    // Check if user provided an app name
    // 'text' is the query (e.g., "Instagram")
    if (!text) {
        await conn.sendMessage(m.chat, {
            text: `*🔍 Please provide an app name to search.*\n\n_Usage:_\n.${command} Instagram`,
        footer: '『 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 』',
        buttons: downloadButtons()},{ quoted: m });
        return; // Stop execution
    }

    try {
        // React loading
        await conn.sendMessage(m.chat, { react: { text: "⬇️", key: m.key } });

        const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${encodeURIComponent(text)}/limit=1`;
        
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data.datalist || !data.datalist.list || !data.datalist.list.length) {
            await conn.sendMessage(m.chat, {
                text: "❌ *No APK found for your query.*"
            },{ quoted: m });
            return; // Stop execution
        }

        const app = data.datalist.list[0];
        const sizeMB = (app.size / (1024 * 1024)).toFixed(2);

        const caption = `
🎮 *App Name:* ${app.name}
📦 *Package:* ${app.package}
📅 *Last Updated:* ${app.updated}
📁 *Size:* ${sizeMB} MB
`.trim();

        // React upload
        await conn.sendMessage(m.chat, { react: { text: "⬆️", key: m.key } });

        // Send the document
        await conn.sendMessage(m.chat, {
            document: { url: app.file.path_alt },
            fileName: `${app.name}.apk`,
            mimetype: 'application/vnd.android.package-archive',
            caption: caption 
        }, { quoted: m }); // 'quoted: m' is the third argument (options)

        // Final reaction
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    } catch (e) {
        console.error(e);
        // Send error message to user
        await conn.sendMessage(m.chat, { text: `An error occurred: ${e.message}` }, { quoted: m });
    }
}

// Handler Configuration
handler.help = ['تطبيق2'];
handler.command = ['تطبيق2'];
handler.tags = ['downloader'];
handler.limit = true;
handler.args = true; // Requires arguments (the query)

export default handler;
