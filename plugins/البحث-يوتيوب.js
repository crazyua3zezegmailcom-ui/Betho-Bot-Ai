// م࣬ــࢪحہּٰـبٚأ بٚـڪٰٖ فَــي أوٰأم࣬ـࢪ ۿأݪــڪٰٖي ؍ 🌸♡゙ ُ𓂁
// أوٰأم࣬ــوٰ ر م࣬ٺم࣬يــژۿ . ⊹
// حہּٰقَــــوٰقَ 𝐶𝑟𝑎𝑧𝑦 𝒅𝒆𝒗 🐦☕
// أسٰـم࣬ أݪأم࣬ــࢪ البحث-يوتيوب.js
// ࢪأبٚــطَ قَنٰــأۿ أݪم࣬ــطَــوٰࢪ ..)✘🖤🧸.
// https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e

import axios from 'axios';
import yts from 'yt-search';
import { createCanvas, loadImage } from 'canvas';
const { prepareWAMessageMedia, generateWAMessageFromContent, proto } = (await import("@whiskeysockets/baileys")).default;

// الإعدادات والخلفية
const BACKGROUND_IMAGE_URL = 'https://i.postimg.cc/gksCzK5n/IMG-20260610-WA0076.jpg';
const myCredit = `*_ .𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 _*`;

// الزخارف المطلوبة
const startDeco = `☽⚝ͫ͢❏ِꏍ🍡﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ ﷽⎆☽⚝ͫ͢❏ِ🍡ꏍﭕ﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ\n╮ ⊰✫⊱─⊰✫⊱─⊰✫⊱╭`;
const endDeco = `┘⊰✫⊱─⊰✫⊱─⊰✫⊱└\n☽⚝ͫ͢❏ِꏍ🍡﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ ﷽⎆☽⚝ͫ͢❏ِꏍﭕ🍡﴿ۦٕۛ۬٭ۦٕۛ۬❏ِ`;

/* ========= دالة جهة الاتصال (Quote) ========= */


// دالة لإنشاء بطاقة البحث مع التعديلات الجديدة للألوان والخطوط
async function createSearchCard(video) {
    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext('2d');

    try {
        const background = await loadImage(BACKGROUND_IMAGE_URL);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    } catch (err) {
        ctx.fillStyle = '#10101a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    try {
        const response = await axios.get(video.thumbnail, { responseType: 'arraybuffer' });
        const cover = await loadImage(Buffer.from(response.data));
        ctx.save();
        ctx.beginPath();
        ctx.arc(140, 200, 100, 0, Math.PI * 2, true);
        ctx.clip();
        ctx.drawImage(cover, 40, 100, 200, 200);
        ctx.restore();
        
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 5;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ffff';
        ctx.beginPath();
        ctx.arc(140, 200, 100, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.shadowBlur = 0;
    } catch (err) {
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(140, 200, 100, 0, Math.PI * 2, true);
        ctx.fill();
    }

    const setNeon = (ctx, color = '#ff00ff', blur = 8) => {
        ctx.shadowBlur = blur;
        ctx.shadowColor = color;
    };
    const resetShadow = (ctx) => {
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
    };

    // 1. العنوان (أكبر خط)
    ctx.font = 'bold 28px "Segoe UI", "Cairo"';
    ctx.fillStyle = '#ffffff';
    setNeon(ctx, '#ff00ff', 10);
    let title = video.title.length > 38 ? video.title.slice(0, 35) + '...' : video.title;
    ctx.fillText(title, 270, 130);
    resetShadow(ctx);

    // 2. القناة (أخضر نيون - خط كبير)
    ctx.font = 'bold 24px "Segoe UI"';
    ctx.fillStyle = '#39FF14'; 
    setNeon(ctx, '#39FF14', 8);
    ctx.fillText(`القناة: ${video.author.name}`, 270, 180);
    resetShadow(ctx);

    // 3. المدة (سماوي)
    ctx.font = '22px "Segoe UI"';
    ctx.fillStyle = '#00ffff';
    setNeon(ctx, '#00ffff', 6);
    ctx.fillText(`المدة: ${video.timestamp}`, 270, 230);
    resetShadow(ctx);

    // 4. النشر (زهري - خط واضح متساوي)
    ctx.font = 'bold 22px "Segoe UI"';
    ctx.fillStyle = '#FF66CC';
    setNeon(ctx, '#FF66CC', 7);
    ctx.fillText(`النشر: ${video.ago}`, 270, 280);
    resetShadow(ctx);

    // 5. المشاهدات (برتقالي)
    ctx.font = '18px "Segoe UI"';
    ctx.fillStyle = '#ffaa00';
    setNeon(ctx, '#ffaa00', 5);
    ctx.fillText(`المشاهدات: ${video.views.toLocaleString()}`, 270, 325);
    resetShadow(ctx);

    // شعار BETHO AI
    ctx.font = 'bold 20px "Segoe UI"';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    setNeon(ctx, '#00ffff', 5);
    ctx.fillText('BETHO AI', 640, 370);
    resetShadow(ctx);

    return canvas.toBuffer();
}

const handler = async (m, { conn, usedPrefix, command, text }) => {
  
  if (!text) {
    return conn.reply(m.chat, `${startDeco}\n\nيرجى كتابة اسم الفيديو للبحث على YouTube.\n\nمثال: \`${usedPrefix + command} اغنية حزينة\`\n\n${endDeco}`);
  }

  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

  try {
    const results = await yts(text);
    const videos = results.videos.slice(0, 10);

    if (!videos.length) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        return conn.reply(m.chat, `${startDeco}\n\nلم يتم العثور على أي نتائج!\n\n${endDeco}`);
    }

    const firstVideo = videos[0];
    const cardBuffer = await createSearchCard(firstVideo);

    const media = await prepareWAMessageMedia(
        { image: cardBuffer },
        { upload: conn.waUploadToServer }
    );

    const sections = videos.map(video => ({
        title: video.title,
        rows: [
        {
            title: `🎵 تحميل صوت | المدة: ${video.timestamp}`,
            description: `الناشر: ${video.author.name}`,
            id: `${usedPrefix}صوت ${video.url}`
        },
        {
            title: `🎬 تحميل فيديو | المدة: ${video.timestamp}`,
            description: `الناشر: ${video.author.name}`,
            id: `${usedPrefix}فيديو ${video.url}`
        }
        ]
    }));

    const interactiveMessage = {
        body: {
        text: `${startDeco}\n\nتم العثور على: \`${videos.length}\` نتيجة\n\nالعنوان: \`${firstVideo.title}\`\n\n${endDeco}`
        },
        footer: { text: '.𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥' },
        header: {
        title: '```🍉 نتائج البحث في YouTube```',
        hasMediaAttachment: true,
        imageMessage: media.imageMessage
        },
        nativeFlowMessage: {
        buttons: [
            {
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
                title: '🍷️ خيارات التحميل',
                sections: sections
            })
            }
        ]
        }
    };

    const userJid = conn?.user?.jid || m.key.participant || m.chat;
    const msg = generateWAMessageFromContent(m.chat, { interactiveMessage }, { userJid });
    
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (error) {
      console.error(error);
      m.reply('حدث خطأ أثناء معالجة البحث.');
  }
};

handler.help = ['يوتيوب <الاسم>'];
handler.tags = ['search'];
handler.command = ['يوتيوب'];

export default handler;