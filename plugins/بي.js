/**
 * 📌 Pinterest Search Plugin — النسخة المعتمدة والمضمونة 100%
 * ⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓
 * تم تبسيط هيكلة إرسال الميديا لتتطابق مع كود التحميل الناجح وتجنب تعليق الدالة
 */

import axios from 'axios'

const myCredit = `*_ .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓 _*`;

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // 1. التحقق من وجود نص البحث
  if (!text) {
    return m.reply(`❌ *الاستخدام المعتمد:*\n${usedPrefix + command} <كلمة_البحث>\n\n*مثال:*\n${usedPrefix + command} ناروتو`)
  }

  await m.react('⏳');
  let statusMsg = await m.reply(`⏳ _جاري جلب وتحميل أعلى 5 صور من Pinterest..._`);

  try {
    // 2. استدعاء الـ API لجلب مصفوفة البيانات
    const apiUrl = `https://⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥.spcfy.eu/api/search/pinterest-search?q=${encodeURIComponent(text)}`
    const response = await axios.get(apiUrl)
    const res = response.data

    // التحقق من وجود نتائج
    if (!res.success || !res.results || res.results.length === 0) {
      await m.react('❌');
      return conn.sendMessage(m.chat, { text: `❌ *لم يتم العثور على نتائج لهذا البحث.*`, edit: statusMsg.key });
    }

    // أخذ أول 5 نتائج فقط
    const targetResults = res.results.slice(0, 5)

    // تفاعل البوت بعلامة البدء في إرسال الصور
    await m.react('🚀');

    // 3. حلقة تكرارية لتحميل الصور وإرسالها بنفس ميكانيكية كود التحميل المباشر
    for (let i = 0; i < targetResults.length; i++) {
      const pin = targetResults[i]
      
      // معالجة العناوين الفارغة لتجنب الـ undefined
      const titleText = pin.title && pin.title.trim() !== "" ? pin.title : `صورة ${text} رقم ${i + 1}`
      
      let captionText = `📌 *الـنـتـيـجـة:* [ ${i + 1} / 5 ]\n\n` +
                        `✨ *العنوان:* ${titleText}\n` +
                        `👤 *الناشر:* ${pin.publisher?.name || 'غير معروف'}\n\n` +
                        `${myCredit}`

      try {
        // تحميل الصورة كـ Buffer تماماً مثل كود التحميل الناجح
        const imageResponse = await axios.get(pin.image_url, { responseType: 'arraybuffer' })
        const imageBuffer = Buffer.from(imageResponse.data, 'binary')

        // إرسال الصورة بهيكلية نظيفة ومباشرة بدون إضافات قد تعطّلها
        await conn.sendMessage(m.chat, {
          image: imageBuffer,
          caption: captionText
        }, { quoted: m })

      } catch (imgErr) {
        console.error(`خطأ أثناء تحميل الصورة رقم ${i + 1}:`, imgErr.message)
        // إذا فشل رابط صورة واحدة، يستمر في الباقي ولا يعطل الأمر
        continue;
      }
      
      // تأخير بسيط بمقدار ثانية واحدة بين الصور لمنع تداخل الرسائل
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // مسح رسالة الانتظار بعد اكتمال الإرسال بنجاح
    return await conn.sendMessage(m.chat, { delete: statusMsg.key });

  } catch (e) {
    console.error('Pinterest Command Error:', e)
    await m.react('❌')
    return conn.sendMessage(m.chat, { 
      text: `❌ *حدث خطأ أثناء معالجة الطلب!* تواصل مع المطور أو تفقد لوحة السيرفر.`, 
      edit: statusMsg.key 
    }, { quoted: m });
  }
}

handler.help = ['بينترس']
handler.command = ['بينترس', 'بينترست', 'pin', 'pinterest']
handler.tags = ['search']

export default handler