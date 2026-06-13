import yts from "yt-search";
import axios from 'axios';
import { downloadButtons, channelButton } from '../system/buttons.js'
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import('@adiwajshing/baileys')).default;

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`• *Example:* ${usedPrefix + command} 𝐶𝑟𝑎𝑧𝑦 ouafy betho bot`);

    await m.reply('*_`Loading`_*');

    async function createImage(url) {
        const { imageMessage } = await generateWAMessageContent({
            image: { url }
        }, {
            upload: conn.waUploadToServer
        });
        return imageMessage;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    let push = [];
    let results = await yts(text);
    let videos = results.videos.slice(0, 15); // Take the top 5 results
    shuffleArray(videos); // Randomize video results

    let i = 1;
    for (let video of videos) {
        let imageUrl = video.thumbnail;
        push.push({
            body: proto.Message.InteractiveMessage.Body.fromObject({
                text: `🎬 *Title:* ${video.title}\n⌛ *Duration:* ${video.timestamp}\n👀 *Views:* ${video.views}\n🔗 *Link:* ${video.url} \n ig : instagram.com/𝐶𝑟𝑎𝑧𝑦_ouafy`
            }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({
                text: '乂 Betho Bot 🧠' // Customize your watermark
            }),
            header: proto.Message.InteractiveMessage.Header.fromObject({
                title: `Video ke - ${i++}`,
                hasMediaAttachment: true,
                imageMessage: await createImage(imageUrl) // Thumbnail video
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                buttons: [
                    {
                        "name": "cta_url",
                        "buttonParamsJson": `{"display_text":"Watch on YouTube","url":"${video.url}"}`
                    }
                ]
            })
        });
    }

    const bot = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: "Search results complete..."
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: '乂 Betho Bot 🧠' // Customize your watermark
                    }),
                    header: proto.Message.InteractiveMessage.Header.create({
                        hasMediaAttachment: false
                    }),
                    carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                        cards: [...push] // Populates the carousel with video results
                    })
                })
            }
        }
    }, {});

    await conn.relayMessage(m.chat, bot.message, { messageId:
bot.key.id });
}

handler.help = ["عروض-يوتيوب"];
handler.tags = ["search"];
handler.command = /^(عروض-يوتيوب)$/i;
handler.limit = true 
export default handler;
