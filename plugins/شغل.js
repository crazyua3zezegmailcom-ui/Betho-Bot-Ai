// م࣬ــࢪحہּٰـبٚأ بٚـڪٰٖ فَــي أوٰأم࣬ـࢪ ۿأݪــڪٰٖي ؍ 🌸♡゙ ُ𓂁
// أوٰأم࣬ــࢪ م࣬ٺم࣬يــژۿ . ⊹
// حہּٰقَــــوٰقَ 𝒎𝒐𝒏𝒕𝒆 𝒅𝒆𝒗 🐦☕
// أسٰـم࣬ أݪأم࣬ــࢪ شغل.js
// ࢪأبٚــطَ قَنٰــأۿ أݪم࣬ــطَــوٰࢪ ..)✘🖤🧸.
// https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e

import yts from 'yt-search';
import { createCanvas, loadImage } from 'canvas';
import axios from 'axios';
const { prepareWAMessageMedia, generateWAMessageFromContent } = (await import("@whiskeysockets/baileys")).default;

const BACKGROUND_IMAGE_URL = 'https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg';
const myCredit = `*_ .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢ _*`;
const emojis = `🌳🌴🍀 Pineapple 🍍🌿🍇 🍉`;

function secondString(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h ? h + " ساعة " : ""}${m ? m + " دقيقة " : ""}${s ? s + " ثانية" : ""}`.trim();
}

function MilesNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

async function createSongCard(video) {
    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext('2d');

    try {
        const background = await loadImage(BACKGROUND_IMAGE_URL);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    } catch (err) {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    try {
        const response = await axios.get(video.thumbnail, { responseType: 'arraybuffer' });
        const cover = await loadImage(Buffer.from(response.data));
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(50, 110, 180, 180, 20);
        ctx.clip();
        ctx.drawImage(cover, 50, 110, 180, 180);
        ctx.restore();
    } catch (err) {
        ctx.fillStyle = '#555';
        ctx.fillRect(50, 110, 180, 180);
    }

    const setNeon = (ctx, color, blur) => {
        ctx.shadowBlur = blur || 8;
        ctx.shadowColor = color || '#ff00ff';
    };
    const resetShadow = (ctx) => {
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
    };

    ctx.font = 'bold 28px "Segoe UI", "Cairo"';
    ctx.fillStyle = '#ffffff';
    setNeon(ctx, '#ff44aa', 6);
    let title = video.title.length > 35 ? video.title.slice(0, 32) + '...' : video.title;
    ctx.fillText(title, 260, 150);
    resetShadow(ctx);

    ctx.font = '20px "Segoe UI"';
    ctx.fillStyle = '#ff88bb';
    setNeon(ctx, '#ff66cc', 4);
    ctx.fillText(video.author.name, 260, 190);
    resetShadow(ctx);

    ctx.font = 'bold 22px "Segoe UI"';
    ctx.fillStyle = '#ffffff';
    setNeon(ctx, '#00ffff', 5);
    ctx.fillText('⏱️ ' + secondString(video.duration.seconds), 260, 240);
    resetShadow(ctx);

    ctx.font = '18px "Segoe UI"';
    ctx.fillStyle = '#cccccc';
    setNeon(ctx, '#aaaaaa', 3);
    ctx.fillText('📅 ' + video.ago, 260, 280);
    resetShadow(ctx);

    ctx.font = '18px "Segoe UI"';
    ctx.fillStyle = '#ffaa00';
    setNeon(ctx, '#ffaa00', 5);
    ctx.fillText('👁️ ' + MilesNumber(video.views), 260, 320);
    resetShadow(ctx);

    ctx.font = 'bold 20px "Segoe UI"';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    setNeon(ctx, '#00ffff', 5);
    ctx.fillText('BETHO AI', 630, 370);
    resetShadow(ctx);

    return canvas.toBuffer('image/jpeg', { quality: 0.93 });
}

async function sendCombinedMessage(conn, chatId, video, cardBuffer, results, usedPrefix, quoted) {
    const media = await prepareWAMessageMedia(
        { image: cardBuffer },
        { upload: conn.waUploadToServer }
    );

    const sections = [
        {
            title: '🎵 تحميل صوت (MP3)',
            rows: results.map(v => ({
                title: v.title.slice(0, 24),
                description: '⏱ ' + v.timestamp + ' | 📺 ' + v.author.name,
                id: usedPrefix + 'صوت ' + v.url
            }))
        },
        {
            title: '🎬 تحميل فيديو (MP4)',
            rows: results.map(v => ({
                title: v.title.slice(0, 24),
                description: '⏱ ' + v.timestamp + ' | 📺 ' + v.author.name,
                id: usedPrefix + 'فيديو ' + v.url
            }))
        }
    ];

    const caption =
        '🎵 *معلومات الأغنية* 🎵\n\n' +
        '🎬 *العنوان:* ' + video.title + '\n' +
        '📺 *القناة:* ' + video.author.name + '\n' +
        '⏱️ *المدة:* ' + secondString(video.duration.seconds) + '\n' +
        '📅 *تاريخ النشر:* ' + video.ago + '\n' +
        '👁️ *المشاهدات:* ' + MilesNumber(video.views) + '\n' +
        '🔗 *الرابط:* ' + video.url + '\n\n' +
        myCredit + '\n' + emojis;

    const interactiveMessage = {
        body: { text: caption },
        footer: { text: 'يـوٰٺـيوٰبٚ 𓆩 BETHO BOT 𓆪' },
        header: {
            hasMediaAttachment: true,
            imageMessage: media.imageMessage
        },
        nativeFlowMessage: {
            buttons: [
                {
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({ title: '📥 خيارات التحميل', sections })
                },
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '.𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢ 👑',
                        url: 'https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e'
                    })
                }
            ]
        }
    };

    const userJid = conn?.user?.jid || quoted?.key?.participant || chatId;
    const msg = generateWAMessageFromContent(chatId, { interactiveMessage }, { userJid, quoted });
    await conn.relayMessage(chatId, msg.message, { messageId: msg.key.id });
}

const handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) {
        return m.reply('∘₊✧──────🌹──────✧₊∘\n┊ ⚠️ *يرجى إدخال نص أو رابط للبحث*\n∘₊✧──────🌹──────✧₊∘');
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    try {
        let query = text.trim();
        const yt_play = await yts.search(query);
        if (!yt_play.videos.length) throw 'لا يوجد نتائج';

        const video = yt_play.videos[0];
        const results = yt_play.videos.slice(0, 10);

        const cardBuffer = await createSongCard(video);
        await sendCombinedMessage(conn, m.chat, video, cardBuffer, results, usedPrefix, m);
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } catch (e) {
        console.error(e);
        m.reply('❌ حدث خطأ أثناء المعالجة.');
    }
};

handler.command = /^(شغل)$/i;
handler.tags = ['search'];
export default handler;
