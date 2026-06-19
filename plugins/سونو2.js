/**
 * 🎤 Suno AI Text-to-Song — ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 سونو (توليد الأغاني بالذكاء الاصطناعي)
 * ⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓
 * https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e
 */

import axios from 'axios';
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = pkg;

const myCredit = `*_ .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓 _*`;

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const args = text ? text.split('|') : [];

    // --- أولاً: منطق الأزرار (عرض الكلمات أو تحميل الصوت) ---
    if (args.length === 2) {
        const action = args[0];
        const dataStr = Buffer.from(args[1], 'base64').toString('utf-8'); // فك تشفير البيانات الممررة
        const songData = JSON.parse(dataStr);

        if (action === 'lyrics') {
            return m.reply(`📜 *كـلـمـات الأغـنـيـة:* _${songData.title}_\n\n${songData.lyrics}`);
        }

        if (action === 'get_audio') {
            await m.react('⏳');
            await conn.sendMessage(m.chat, { text: `* .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀🍡 _*\n\n*_ جـاري إرسـال مـلـف الـصـوت... يـرجـى الانـتـظـار 🎧 _*` }, { quoted: m });
            try {
                await conn.sendMessage(m.chat, {
                    audio: { url: songData.url },
                    mimetype: 'audio/mpeg',
                    ptt: false
                }, { quoted: m });
                return await m.react('✅');
            } catch (e) {
                await m.react('❌');
                return m.reply('❌ *فشل إرسال ملف الصوت، قد يكون الرابط منتهياً.*');
            }
        }
    }

    // --- ثانياً: منطق الطلب الأساسي (صناعة الأغنية) ---
    if (!text) return m.reply(`*_ هـلا 🫠 _*\n\n*_ يـرجـى كـتـابـة الـوصـف (الـبـرومـبـت) بـعـد الأمـر _*\n*_ مـثال: ${usedPrefix + command} Sad song about rain _*`);

    await m.react('🪄');
    await m.reply(`* .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀🍡 _*\n\n*_ جـاري تـولـيـد الأغـنـيـة بـالـذڪـاء الاصـطـنـاعـي... قـد يـسـتـغـرق الأمـر دقيقة ⏳ _*`);

    try {
        const apiUrl = `https://omegatech-api.dixonomega.tech/api/ai/sonu3?action=full&prompt=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.success) {
            await m.react('❌');
            return m.reply('❌ *فـشـل الـسـيـرفـر فـي تـولـيـد الأغـنـيـة، حـاول لاحـقـاً!*');
        }

        // تحويل المدة بالثواني إلى صيغة دقائق وثواني
        const durationMin = data.duration ? `${Math.floor(data.duration / 60)}:${(data.duration % 60).toString().padStart(2, '0')}` : 'غير معروف';

        // تجهيز بيانات الأغنية لتمريرها للأزرار عبر الـ base64 لتجنب تخطي حجم الـ ID المسموح في الـ Buttons
        const payload = JSON.stringify({ title: data.title, url: data.url, lyrics: data.lyrics });
        const base64Payload = Buffer.from(payload).toString('base64');

        // تجهيز الكابتشن
        let caption = `✨ *تـم تـولـيـد الأغـنـيـة بـنـجـاح!* ✨\n\n` +
            `📝 *الـطـلـب:* ${data.prompt}\n` +
            `🎵 *الـعـنـوان:* ${data.title || 'بدون عنوان'}\n` +
            `🏷️ *الـتـصـنـيـف (Tags):* ${data.tags || 'لا يوجد'}\n` +
            `🍡 *الـمـدة:* ${durationMin}\n\n` +
            `*_ اضـغـط عـلـى الأزرار أدناه لـلـتـحـمـيـل أو قـراءة الـكـلـمـات 👇 _*`;

        // تحضير غلاف الأغنية التابع لـ سونو
        const thumbnail = data.thumbnail || 'https://placehold.co/600x400/png?text=Suno+AI';
        const media = await prepareWAMessageMedia({ image: { url: thumbnail } }, { upload: conn.waUploadToServer });

        // بناء الأزرار التفاعلية (Native Flow)
        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.fromObject({ text: caption }),
                        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: myCredit }),
                        header: proto.Message.InteractiveMessage.Header.fromObject({
                            title: `*_ 🎤 سـونـو AI نـيـزوكـو 🎤 _*`,
                            hasMediaAttachment: true,
                            imageMessage: media.imageMessage
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                            buttons: [
                                {
                                    name: "quick_reply",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "📥 تـحـمـيـل الـصـوت",
                                        id: `${usedPrefix + command} get_audio|${base64Payload}`
                                    })
                                },
                                {
                                    name: "quick_reply",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "📜 كـلـمـات الأغـنـيـة",
                                        id: `${usedPrefix + command} lyrics|${base64Payload}`
                                    })
                                }
                            ]
                        })
                    })
                }
            }
        }, { quoted: m });

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
        await m.react('✅');

    } catch (e) {
        console.error('Suno AI Error:', e);
        await m.react('❌');
        m.reply('❌ *حـصـل خـطأ أثـنـاء الاتـصـال بـالـخـادم أو تـولـيـد الأغـنـيـة.*');
    }
}

handler.help = ['سونو2'];
handler.tags = ['ai'];
handler.command = /^(سونو2|suno2)$/i;

export default handler;