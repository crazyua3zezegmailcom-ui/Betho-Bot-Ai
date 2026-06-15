// .𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { exec } from 'child_process';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// دالة اقتباس جهة الاتصال


let handler = async (m, { conn }) => {
  // 1. استيراد الروابط من ملف data-photo.json
  let imageUrls = [];
  const jsonPath = '/home/container/src/data-photo.json';
  try {
    if (fs.existsSync(jsonPath)) {
      const rawData = fs.readFileSync(jsonPath, 'utf-8');
      imageUrls = JSON.parse(rawData);
    }
  } catch (e) {
    console.error('⚠️ خطأ في قراءة ملف الداتا:', e);
  }

  // روابط احتياطية في حال فشل القراءة
  if (!imageUrls || imageUrls.length === 0) {
    imageUrls = [
      'https://tmpfiles.org/dl/34008123/1776388457821.jpg',
      'https://tmpfiles.org/dl/34008126/1776388458756.jpg'
    ];
  }

  // اختيار رابط عشوائي وتحويله إلى https
  let randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
  randomImageUrl = randomImageUrl.replace('http://', 'https://');

  // تحميل الصورة
  let imageBuffer;
  try {
    const res = await fetch(randomImageUrl);
    if (res.ok) imageBuffer = await res.buffer();
  } catch (err) {
    console.error('❌ خطأ في تحميل الصورة:', err);
  }

  // بيانات التاريخ
  const currentDate = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  const dayName = new Date().toLocaleDateString('ar-EG', { weekday: 'long' });
  const taguser = '@' + m.sender.split('@')[0];

  // نص رسالة البداية (مزخرف مثل قائمة الأوامر)
  const startText = `
╗═══≪ 🌿🍉🍡 ≫═══╔
 .𓏲⋆˙𝑵𝑬𝒁𝑼𝑲𝑶 𝑩𝑶𝑻🎀​
  𝖡𝖸  𝐶𝑟𝑎𝑧𝑦 dev 👑 
╝═══≪ 🌿🍉🍡 ≫═══╚

╮──────────────╭
𓆩⃞🍒𓆪  𝗐𝖾𝗅𝖼𝗈𝗆𝖾 ${taguser}
𓆩⃞🍇𓆪  𝗍𝗈 𝗆𝗒 𝖻𝗈𝗍
𓆩⃞🍉𓆪  .𓏲⋆˙𝑵𝑬𝒁𝑼𝑲𝑶 𝑩𝑶𝑻🎀​
𓆩⃞🍡𓆪  free bot WhatsApp 
𓆩⃞🌿𓆪  24/7 𝗈𝗇𝗅𝗂𝗇𝖾
╯──────────────╰

╭───≪ 🍒 𝗧𝗢𝗢𝗟𝗦 🍇 ≫───╮
│ ⌬ جاري تحضير ملفات البوت...
│ ⌬ الرجاء الانتظار قليلاً
╯───≪ 🌿🍉🍡 ≫───╰

𓆩⃞🍒𓆪 BY 𝐶𝑟𝑎𝑧𝑦 𓆩⃞🍇𓆪 
╮──────────────╭
𓆩⃞🍒𓆪  24/7 𝗈𝗇𝗅𝗂𝗇𝖾🍍 
𓆩⃞🍉𓆪  .𓏲⋆˙𝑵𝑬𝒁𝑼𝑲𝑶 𝑩𝑶𝑻🎀​
╯──────────────╰
𓆩⃞🍡𓆪 𝗕𝗬 𝐶𝑟𝑎𝑧𝑦 🍒

؍ 🌸♡゙ ُ𓂁 تــــاࢪيــــخ الــــيــــوم: ${currentDate}
؍ 🌸♡゙ ُ𓂁 الــــيوم: ${dayName}
`.trim();

  // إرسال رسالة البداية مع الصورة المصغرة
  await conn.sendMessage(
    m.chat,
    {
      text: startText,
      mentions: [m.sender],
      contextInfo: {
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363428186936884@newsletter',
          newsletterName: '.𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 CH 👑',
          serverMessageId: -1
        },
        externalAdReply: {
          title: ".𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥​",
          body: "ᴍ𝒐𝒏𝒕𝒆 χ 𝒛𝒊𝒂𝒅 𝒅𝒆𝒗𝒔👑 ",
          mediaType: 1,
          thumbnail: imageBuffer,
          thumbnailUrl: randomImageUrl,
          sourceUrl: "https://wa.me/15877004085",
          renderLargerThumbnail: true
        }
      }
    },
    {}
  );

  // بدء عملية ضغط الملفات
  try {
    const botFolderPath = path.join(__dirname, '../');
    const zipFilePath = path.join(__dirname, '../bot_files.zip');

    console.log(`Reading files from: ${botFolderPath}`);
    const files = fs.readdirSync(botFolderPath);

    if (files.length === 0) {
      await conn.sendMessage(m.chat, { text: `⚠️ لا توجد ملفات لضغطها.` }, { quoted: m });
      return;
    }

    await conn.sendMessage(m.chat, { text: `🔄 تم العثور على ${files.length} ملف/مجلد. جاري إنشاء ملف ZIP...` }, { quoted: m });

    const zipCommand = `zip -rq "${zipFilePath}" . -x ".npm/*" "node_modules/*" "JadiBots/*"`;
    exec(zipCommand, { cwd: botFolderPath, maxBuffer: 1024 * 1024 * 50 }, async (error, stdout, stderr) => {
      if (error) {
        await conn.sendMessage(m.chat, { text: `❌ حدث خطأ أثناء إنشاء ملف ZIP: ${error.message}` }, { quoted: m });
        return;
      }

      if (!fs.existsSync(zipFilePath)) {
        await conn.sendMessage(m.chat, { text: `❌ لم يتم إنشاء ملف ZIP.` }, { quoted: m });
        return;
      }

      await conn.sendMessage(m.chat, { text: `✅ تم إنشاء ملف ZIP بنجاح. يتم الآن إرساله...` }, { quoted: m });
      await conn.sendMessage(m.chat, {
        document: fs.readFileSync(zipFilePath),
        mimetype: 'application/zip',
        fileName: 'bot_files.zip'
      }, { quoted: m });

      fs.unlink(zipFilePath, async (err) => {
        if (!err) {
          await conn.sendMessage(m.chat, { text: `🗑️ تم حذف ملف ZIP بعد الإرسال.` }, { quoted: m });
        }
      });
    });
  } catch (err) {
    await conn.sendMessage(m.chat, { text: `❌ فشل في معالجة ملفات البوت: ${err.message}` }, { quoted: m });
  }
};

handler.help = ['سكربتي'];
handler.tags = ['owner'];
handler.command = /^(سكربتي)$/i;
handler.owner = true;  // يسمح فقط للمطور المسجل في config.json

export default handler;