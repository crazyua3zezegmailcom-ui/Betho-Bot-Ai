/**
 * 📱 TikTok Profile Finder — جلب معلومات الحساب عبر سورس TikMatrix
 * ⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓
 * التوافقية: سحب مباشر من الـ HTML لضمان الاستقرار وسرعة الاستجابة
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

const myCredit = `*_ .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓 _*`;

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // 1️⃣ التحقق من إدخال اسم المستخدم
    if (!text) return m.reply(`*⚠️ يـرجى كـتابة اسـم الـمستخدم (Username) لـحساب تـيك تـوك!*\n*مثال:* ${usedPrefix + command} zipjj7`);

    // تنظيف اليوزر من الفراغات وعلامة @
    const username = text.replace('@', '').trim();
    
    await m.react('⏳');
    let statusMsg = await m.reply(`⏳ _جـاري جلـب معـلومات الحـساب ✨......_`);

    try {
        // 2️⃣ جلب السورس من موقع TikMatrix
        const targetUrl = `https://user.tikmatrix.com/?username=${encodeURIComponent(username)}`;
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'ar,en;q=0.9'
            },
            timeout: 15000 // مهلة 15 ثانية للطلب
        });

        // 3️⃣ تحميل السورس داخل cheerio لتبدأ عملية الفلترة
        const $ = cheerio.load(response.data);

        // التحقق من وجود الكارد الأساسي للحساب، إذا مش موجود يعني اليوزر غلط
        if ($('.user-card').length === 0) {
            throw "لم يتم العثور على هذا الحساب، تأكد من صحة اليوزر نيم!";
        }

        // 4️⃣ استخراج البيانات عبر الـ Selectors من السورس المرفق
        const nickname = $('.user-name').text().trim() || 'N/A';
        const handle = $('.user-handle').text().trim() || `@${username}`;
        const avatarUrl = $('.user-avatar').attr('src');
        const bio = $('.user-bio p').first().text().trim() || 'لا توجد سيرة ذاتية';
        
        // استخراج الإحصائيات (الفولورز، القلوب، الفيديوهات...) من الـ stats-card
        let stats = {};
        $('.stat-card').each((index, element) => {
            const number = $(element).find('.stat-number').text().trim();
            const label = $(element).find('.stat-label').text().trim().toLowerCase();
            
            if (label.includes('follower')) stats.followers = number;
            if (label.includes('following')) stats.following = number;
            if (label.includes('heart')) stats.hearts = number;
            if (label.includes('video')) stats.videos = number;
            if (label.includes('friend')) stats.friends = number;
        });

        // استخراج تفاصيل الحساب المتقدمة من الـ details-grid
        const userId = $('.userid-text').text().trim() || 'N/A';
        const secUid = $('.secuid-text').text().trim() || 'N/A';
        
        // جلب تاريخ إنشاء الحساب بالبحث عن النص التابع للـ Label
        let accountCreated = 'N/A';
        $('.detail-item').each((i, el) => {
            const labelText = $(el).find('.detail-label').text().trim();
            if (labelText.includes('Account Created:')) {
                accountCreated = $(el).contents().not($(el).find('.detail-label')).text().trim();
            }
        });

        // 5️⃣ بناء رسالة العرض الاحترافية
        let caption = `👤 *مـعـلـومـات حـسـاب تـيـك تـوك*\n\n` +
                      `✨ *الاسم المستعار:* ${nickname}\n` +
                      `📌 *اليوزر نيم:* ${handle}\n` +
                      `🆔 *معرف الحساب (ID):* \`${userId}\`\n` +
                      `📝 *البايو:* ${bio}\n\n` +
                      `📊 *الإحـصـائـيـات:*\n` +
                      `👥 *المتابعون:* [ ${stats.followers || '0'} ]\n` +
                      `➕ *المتابَعون:* [ ${stats.following || '0'} ]\n` +
                      `💖 *القلوب (Likes):* [ ${stats.hearts || '0'} ]\n` +
                      `🎬 *الفيديوهات:* [ ${stats.videos || '0'} ]\n` +
                      `👫 *الأصدقاء:* [ ${stats.friends || '0'} ]\n\n` +
                      `ℹ️ *تـفـاصـيـل الـتـسـجـيـل:*\n` +
                      `📅 *تاريخ الإنشاء:* ${accountCreated}\n` +
                      `🔗 *رابط SecUID:* \n\`\`\`${secUid}\`\`\`\n\n` +
                      `${myCredit}`;

        // 6️⃣ تحميل الأفاتار وإرسال الميديا كـ Buffer
        let avatarBuffer = null;
        if (avatarUrl && avatarUrl.startsWith('http')) {
            try {
                const imgRes = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
                avatarBuffer = Buffer.from(imgRes.data);
            } catch (e) {
                console.error("فشل تحميل صورة الأفاتار من السيرفر:", e.message);
            }
        }

        if (avatarBuffer) {
            await conn.sendMessage(m.chat, { image: avatarBuffer, caption: caption }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
        }

        await m.react('✅');
        await conn.sendMessage(m.chat, { delete: statusMsg.key });

    } catch (err) {
        console.error("TikMatrix Scraper Error:", err);
        await m.react('❌');
        const msgError = typeof err === 'string' ? err : "حدث خطأ أثناء الاتصال بالموقع أو الحساب محظور.";
        await conn.sendMessage(m.chat, { text: `❌ *عذراً، حصل خطأ أثناء السحب:* \n_${msgError}_`, edit: statusMsg.key }, { quoted: m });
    }
};

handler.help = ['تيك-يوزر'];
handler.tags = ['tools'];
handler.command = /^(تيك-يوزر|حساب-تيك|تيك_يوزر|tiktokuser)$/i;

export default handler;