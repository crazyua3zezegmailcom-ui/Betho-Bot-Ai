/**
 * 🎬 WitAnime Pure API Engine — محرك ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 وايت أنمي الصافي الكامل
 * ⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓
 * معتمد مباشرة على مسارات السيرفر الرسمية الصحيحة 100% بدون مكتبات خارجية
 * متوافق بالكامل مع أزرار البايلس الصافي بنظام الـ args المقسم بـ |
 * تطوير وتنسيق وتصحيح: Arab Top Dev & 𝐶𝑟𝑎𝑧𝑦 Devs
 */

import axios from 'axios';
import pkg from '@whiskeysockets/baileys';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = pkg;

// التوقيع أو الحقوق الخاصة بالبوت أسفل الرسائل
const myCredit = `*_ .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓 _*`;
const BASE_URL = 'https://auralix-api.vercel.app';
const API_KEY = 'venianime';

// ═══════════════════════════════════════════════════════════════
// 🧠 المحرك الذكي لاستخراج الروابط المباشرة من السيرفرات (تخطي الحماية)
// ═══════════════════════════════════════════════════════════════
async function extractDirectUrl(url) {
    if (!url) return null;
    if (url.match(/\.(mp4|mkv|avi|mov|webm)(\?|$)/i)) return url;
    
    try {
        if (url.includes('mediafire.com')) {
            let res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            let html = await res.text();
            let $ = cheerio.load(html);
            let directUrl = $('a[aria-label="Download file"]').attr('href') || $('#downloadButton').attr('href') || $('.download-link').attr('href');
            return directUrl;
        }
        
        if (url.includes('mp4upload.com')) {
            let id = url.match(/embed-([^.]+)/)?.[1];
            if (!id) return null;
            let res = await fetch(`https://www.mp4upload.com/api/file/info?id=${id}`);
            let data = await res.json();
            return data.file?.url || null;
        }
        
        if (url.includes('uqload.com') || url.includes('uqload.is') || url.includes('vidmoly')) {
            let res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            let html = await res.text();
            let match = html.match(/file\s*:\s*["']([^"']+\.mp4[^"']*)["']/i) || html.match(/file:\s*["']([^"']+)["']/i);
            return match ? match[1] : null;
        }
        
        if (url.includes('gofile.io')) {
            let code = url.split('/').pop();
            let res = await fetch(`https://api.gofile.io/contents/${code}`);
            let data = await res.json();
            if (data.status === 'ok' && data.data?.contents) {
                let firstFile = Object.values(data.data.contents)[0];
                return firstFile?.link || null;
            }
        }
        
        // محاولة عامة لأي سيرفر مجهول آخر متوفر في الحلقة
        let res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        let html = await res.text();
        let match = html.match(/https?:\/\/[^\s"']+\.mp4[^\s"']*/i);
        return match ? match[0] : null;
    } catch (e) {
        console.error('Extraction Error:', e);
        return null;
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // تقسيم النص بناءً على العلامة | لتحديد رقم المرحلة والبيانات الممررة
    const args = text ? text.split('|') : [];

    // ─── [ الـمرحـلة الـثانـية: عـرض قائمة الـحلقات المتاحة للأنمي المحدد ] ───
    if (args.length === 3 && args[0] === 'anime_info') {
        const animeId = args[1];
        const animeTitle = args[2];
        await m.react('⏳');

        try {
            // استدعاء الـ Endpoint الرسمي لجلب تفاصيل الأنمي وقائمة الحلقات
            const { data: resData } = await axios.get(`${BASE_URL}/api/anime/witanime-download?id=${encodeURIComponent(animeId)}&key=${API_KEY}`);
            const data = resData.data;
            if (!data || !data.episodes || data.episodes.length === 0) throw new Error('لا توجد حلقات متاحة لهذا الأنمي حالياً.');

            // ترتيب وعرض أول 35 حلقة لتفادي ثقل الرسالة في الواتساب
            const rows = data.episodes.slice(0, 35).map(ep => ({
                header: `${ep.name}`,
                title: `📥 تصفح جودات الحلقة`,
                description: `📅 تاريخ الرفع: ${ep.air_date || 'متوفرة'}`,
                id: `${usedPrefix + command} fetch_servers|${animeId}|${encodeURIComponent(animeTitle)}|${ep.episode_number}`
            }));

            let caption = `🎬 *${data.name}*\n\n⭐ *التقييم:* ${data.rating} | 👁️ *المشاهدات:* ${data.views?.toLocaleString() || 'غير محدد'}\n📅 *الرفع الأول:* ${data.first_air_date || 'غير محدد'}\n🎭 *التصنيف:* ${data.genres?.join(", ") || "غير محدد"}\n📝 *القصة:* ${data.overview?.slice(0, 200) || 'لا يوجد وصف...'}...\n\n*_ اضـغط عـلـى الـزر أدناه لـعـرض الحلقات والتحميل المباشر 👇 _*`;
            const posterUrl = data.poster || 'https://witanime.life/wp-content/uploads/2023/08/cropped-Logo-WITU-192x192.png';
            const media = await prepareWAMessageMedia({ image: { url: posterUrl } }, { upload: conn.waUploadToServer });

            let msg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                            body: proto.Message.InteractiveMessage.Body.fromObject({ text: caption }),
                            footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: myCredit }),
                            header: proto.Message.InteractiveMessage.Header.fromObject({
                                title: `*_ 📺 قـائـمـة الـحـلـقـات 📺 _*`,
                                hasMediaAttachment: true,
                                imageMessage: media.imageMessage
                            }),
                            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                buttons: [{
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: '🍥 قـائـمـة الـحـلـقـات',
                                        sections: [{ title: `📺 حلقات الأنمي (${data.episodes.length})`, rows: rows }]
                                    })
                                }]
                            })
                        })
                    }
                }
            }, { quoted: m });

            await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
            return await m.react('✅');
        } catch (err) {
            await m.react('❌');
            return m.reply(`❌ خطأ: ${err.message}`);
        }
    }

    // ─── [ الـمرحـلة الـثالـثة: جـلب الـسيرفرات والـجودات الـخاصة بالحلقة ] ───
    if (args.length === 4 && args[0] === 'fetch_servers') {
        const [_, animeId, encodedTitle, epNum] = args;
        const animeTitle = decodeURIComponent(encodedTitle);
        await m.react('⏳');

        try {
            // إعادة طلب بيانات الأنمي للوصول لروابط الحلقة المحددة بدقة
            const { data: resData } = await axios.get(`${BASE_URL}/api/anime/witanime-download?id=${encodeURIComponent(animeId)}&key=${API_KEY}`);
            const episode = resData.data.episodes.find(ep => ep.episode_number == epNum);

            if (!episode || !episode.download_links || episode.download_links.length === 0) throw new Error('لا توجد روابط تحميل متوفرة لهذه الحلقة حالياً.');

            const rows = episode.download_links.slice(0, 15).map(link => ({
                header: `📥 جودة: ${link.quality || 'سيرفر تحميل'}`,
                title: `تحميل كملف فيديو مباشر`,
                description: `السيرفر: ${link.name || 'سريع'}`,
                id: `${usedPrefix + command} download_video|${link.url}|${encodeURIComponent(animeTitle)}|${encodeURIComponent(episode.name)}`
            }));

            let caption = `📺 *${animeTitle}*\n🎬 *${episode.name}*\n📅 *تاريخ الرفع:* ${episode.air_date || 'غير محدد'}\n\n🎀 اختر جودة وسيرفر التحميل المناسب لك من القائمة أدناه ليقوم البوت بجلبه كفيديو فوري:`;
            const media = await prepareWAMessageMedia({ image: { url: resData.data.poster || 'https://witanime.life/wp-content/uploads/2023/08/cropped-Logo-WITU-192x192.png' } }, { upload: conn.waUploadToServer });

            let msg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                            body: proto.Message.InteractiveMessage.Body.fromObject({ text: caption }),
                            footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: myCredit }),
                            header: proto.Message.InteractiveMessage.Header.fromObject({
                                title: `*_ 📥 سـيـرفـرات الـتـحـمـيـل 📥 _*`,
                                hasMediaAttachment: true,
                                imageMessage: media.imageMessage
                            }),
                            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                buttons: [{
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: '📥 اخـتـر الـجـودة',
                                        sections: [{ title: 'السيرفرات المتاحة ✨', rows: rows }]
                                    })
                                }]
                            })
                        })
                    }
                }
            }, { quoted: m });

            await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
            return await m.react('✅');
        } catch (err) {
            await m.react('❌');
            return m.reply(`❌ خطأ: ${err.message}`);
        }
    }

    // ─── [ الـمرحـلة الـرابعـة: فـك الـحماية، الـتحميل والإرسـال كـملف أو فـيديو مع أزرار رابط مباشر ] ───
    if (args.length === 4 && args[0] === 'download_video') {
        const [_, videoUrl, encodedAnimeTitle, encodedEpTitle] = args;
        const animeTitle = decodeURIComponent(encodedAnimeTitle);
        const epTitle = decodeURIComponent(encodedEpTitle);

        await m.react('⏳');
        let statusMsg = await m.reply(`* .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀🍡 _*\n\n*_ جـاري فـك حـماية الـسيرفر وتـنزيل الـفيديو... يـرجى الانـتظار 🕒 _*`);

        try {
            let directUrl = await extractDirectUrl(videoUrl);
            if (!directUrl) throw new Error('فشل استخراج الرابط المباشر من السيرفر، يرجى تجربة سيرفر أو جودة أخرى.');

            let res = await fetch(directUrl, { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': videoUrl } });
            let buffer = await res.buffer();
            let sizeBytes = buffer.length;
            let sizeMB = (sizeBytes / 1024 / 1024).toFixed(2);

            // حذف رسالة الانتظار فور الانتهاء من التنزيل بداخل الذاكرة
            try { await conn.sendMessage(m.chat, { delete: statusMsg.key }); } catch (e) {}

            // 💡 إذا تخطى الحجم الـ 50 ميجابايت يتم تحويل الإرسال كمستند لمنع تجميد السيرفر مع زر CTA تفاعلي
            if (parseFloat(sizeMB) > 50.00) {
                let caption = `عذراً @${m.sender.split('@')[0]} حجم هذه الحلقة (${sizeMB} MB) والمطور محدد أكثر شيء 50 MB لأسباب ضعف السيرفر، فلقد تم إرسال الحلقة على شكل ملف فيديو.\n\n📺 *${animeTitle}*\n🎬 *${epTitle}*\n\n*_ يمكنـك أيضاً الضـغط على الزر أدناه للتحميل أو المشاهدة المباشرة عبر المتصفح 👇 _*`;

                let msg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                                body: proto.Message.InteractiveMessage.Body.fromObject({ text: caption }),
                                footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: myCredit }),
                                header: proto.Message.InteractiveMessage.Header.fromObject({
                                    title: `*⚠️ تـنـبـيـه حـجـم الـحـلـقـة ⚠️*`,
                                    hasMediaAttachment: false
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                    buttons: [
                                        {
                                            name: "cta_url",
                                            buttonParamsJson: JSON.stringify({
                                                display_text: "🎬 اضغط هنا للتحميل المباشر",
                                                url: directUrl
                                            })
                                        }
                                    ]
                                })
                            })
                        }
                    }
                }, { quoted: m, mentions: [m.sender] });

                // إرسال ملف الفيديو أولاً
                await conn.sendMessage(m.chat, {
                    document: buffer,
                    mimetype: 'video/mp4',
                    fileName: `${animeTitle} - ${epTitle}.mp4`
                }, { quoted: m });

                // إرسال رسالة الاعتذار الممنشنة مع الزر التفاعلي ثانياً
                await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

            } else {
                // إذا كان الحجم أقل من 50 ميجابايت يرسل كفيديو طبيعي ومباشر في الشات
                await conn.sendMessage(m.chat, {
                    video: buffer,
                    caption: `📺 *${animeTitle}*\n🎬 *${epTitle}*\n📦 *الحجم:* ${sizeMB} MB\n\n${myCredit}`,
                    mimetype: 'video/mp4'
                }, { quoted: m });
            }

            return await m.react('✅');

        } catch (err) {
            await m.react('❌');
            try { await conn.sendMessage(m.chat, { delete: statusMsg.key }); } catch (e) {}
            return m.reply(`❌ *فشل التحميل التلقائي:*\n${err.message}\n\n🔗 *رابط السيرفر الخارجي للتحميل اليدوي:*\n${videoUrl}`);
        }
    }

    // ─── [ الـمرحـلة الأولـى: الـبـحث الـرئـيسي عـند كـتابة الأمـر أول مرة ] ───
    if (!text) return m.reply(`*_ هـلا 🫠 _*\n\n*_ يـرجـى كـتـابـة اسـم الأنـمـي بـعد الأمـر بـالعربـي أو الإنجـلـيزي _*\n*_ مـثال: ${usedPrefix + command} Naruto _*`);

    await m.react('🔍');

    try {
        // الاتصال بالـ Endpoint الجديد المستخرج للبحث الصافي عبر ?q=
        const { data: resData } = await axios.get(`${BASE_URL}/api/anime/witanime-search?q=${encodeURIComponent(text.trim())}&key=${API_KEY}`);
        const results = resData.data;

        if (!results || results.length === 0) {
            await m.react('❌');
            return m.reply(`❌ *لـم يـتـم الـعـثـور عـلـى نـتـائـج للـبـحث عـن:* "${text}"`);
        }

        // تحويل نتائج السيرفر إلى قائمة منسدلة تفاعلية
        const rows = results.slice(0, 15).map((anime, i) => ({
            header: `النتيجة ${i + 1}`,
            title: `🎬 ${anime.name}`,
            description: `⭐ ${anime.rating || 'لا يوجد'} | 📅 ${anime.release_date || '?'}`,
            id: `${usedPrefix + command} anime_info|${anime.id}|${anime.name}`
        }));

        let caption = `✨ *نـتـائـج الـبـحث عـن:* ${text}\n\n` +
            `🎬 *أول نـتـيـجة:* ${results[0].name}\n` +
            `⭐ *الـتـقـيـيـم:* ${results[0].rating || 'لا يوجد'}\n` +
            `📅 *الـسـنـة:* ${results[0].release_date || 'غير محدد'}\n\n` +
            `*_ اضـغط عـلـى الـزر أدناه لـعـرض قائمة الأنميات المتاحة 👇 _*`;

        const topThumbnail = results[0].poster || 'https://witanime.life/wp-content/uploads/2023/08/cropped-Logo-WITU-192x192.png';
        const media = await prepareWAMessageMedia({ image: { url: topThumbnail } }, { upload: conn.waUploadToServer });

        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.fromObject({ text: caption }),
                        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: myCredit }),
                        header: proto.Message.InteractiveMessage.Header.fromObject({
                            title: `*_ 📺 أنـمـي نـيـزوكـو 📺 _*`,
                            hasMediaAttachment: true,
                            imageMessage: media.imageMessage
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: '🍥 قائمة الأنميات المتوفرة',
                                    sections: [{ title: 'اخـتـر الأنمـي الـمطلوب 🍡', rows: rows }]
                                })
                            }]
                        })
                    })
                }
            }
        }, { quoted: m });

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
        return await m.react('✅');

    } catch (e) {
        console.error('WitAnime Pure API Error:', e);
        await m.react('❌');
        m.reply('❌ *حصل خطأ غير متوقع أثناء الاتصال بـ API، يرجى المحاولة لاحقاً.*');
    }
};

handler.help = ['انمي'];
handler.tags = ['search', 'dl'];
handler.command = /^(انمي|anime)$/i;

export default handler;