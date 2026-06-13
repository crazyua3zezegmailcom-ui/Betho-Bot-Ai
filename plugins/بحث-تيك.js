// م࣬ــࢪحہּٰـبٚأ بٚـڪٰٖ فَــي أوٰأم࣬ـࢪ ۿأݪــڪٰٖي ؍ 🌸♡゙ ُ𓂁
// أوٰأم࣬ــوٰ ر م࣬ٺم࣬يــژۿ . ⊹
// حہּٰقَــــوٰقَ 𝒎𝒐𝒏𝒕𝒆 𝒅𝒆𝒗 🐦☕
// أسٰـم࣬ أݪأم࣬ــࢪ بحث-تيك.js
// ࢪأبٚــطَ قَنٰــأۿ أݪم࣬ــطَــوٰࢪ ..)✘🖤🧸.
// https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e

import axios from "axios";
import FormData from "form-data";
import baileys from "@whiskeysockets/baileys";

// الحقوق والستايل الخاص بك
const myCredit = `*_ .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢ _*`;
const emojis = `🌳🌴🍀 Pineapple 🍍🌿🍇 🍉`;

const ttSearch = async (query, count = 3) => {
    try {
        let d = new FormData();
        d.append("keywords", query);
        d.append("count", count);
        d.append("cursor", 0);
        d.append("web", 1);
        d.append("hd", 1);

        let h = { headers: { ...d.getHeaders() } };
        let { data } = await axios.post("https://tikwm.com/api/feed/search", d, h);

        if (!data.data || !data.data.videos) return [];
        
        const baseURL = "https://tikwm.com";
        return data.data.videos.map(video => ({
            play: baseURL + video.play
        }));
    } catch (e) {
        console.log(e);
        return [];
    }
}

async function sendVideoAlbum(conn, m, videos, caption) {
    const album = baileys.generateWAMessageFromContent(m.chat, {
        albumMessage: {
            expectedVideoCount: videos.length, 
            contextInfo: m.quoted ? {
                remoteJid: m.quoted.key.remoteJid,
                fromMe: m.quoted.key.fromMe,
                stanzaId: m.quoted.key.id,
                participant: m.quoted.key.participant || m.quoted.key.remoteJid,
                quotedMessage: m.quoted.message
            } : {}
        }
    }, { quoted: m });

    await conn.relayMessage(album.key.remoteJid, album.message, {
        messageId: album.key.id
    });

    for (const [index, video] of videos.entries()) {
        const msg = await baileys.generateWAMessage(album.key.remoteJid, {
            video: { url: video.play },
            ...(index === 0 ? { caption } : {}) 
        }, {
            upload: conn.waUploadToServer
        });

        msg.message.messageContextInfo = {
            messageAssociation: {
                associationType: 1,
                parentMessageKey: album.key
            }
        };
        await conn.relayMessage(msg.key.remoteJid, msg.message, {
            messageId: msg.key.id
        });
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`*_يرجى إدخال اسم المقطع الذي تريد البحث عنه 🔍_*\n\n*مثال:* ${usedPrefix + command} بيثو | 5`);

    // التفاعل بانتظار
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    let [query, count] = text.split("|").map(v => v.trim());
    count = parseInt(count) || 3;

    let videos = await ttSearch(query, count);
    if (!videos.length) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        return m.reply("*_لم يتم العثور على فيديوهات، جرب كلمات بحث أخرى 🎬_*");
    }

    const caption = `*_تم العثور على نتائج بحث تيك توك 🎬_*\n\n` +
                    `*_الطلب: ${query}_*\n` +
                    `*_العدد: ${videos.length}_*\n\n` +
                    `${myCredit}\n${emojis}`;

    await sendVideoAlbum(conn, m, videos, caption);

    // التفاعل بنجاح
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
}

handler.help = ['بحث-تيك'];
handler.tags = ['search'];
handler.command = ['بحث-تيك'];

export default handler;