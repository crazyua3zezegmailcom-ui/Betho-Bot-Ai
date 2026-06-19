/**
 * 🤖 Deebx AI Chat Plugin — أمر شاتي (نسخة تخطي حظر الحماية 503)
 * ⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀
 * تم الاعتماد على Native Fetch المدمج ليتطابق الطلب 100% مع الـ Curl ويتخطى جدار الحماية
 */

import crypto from 'crypto';

const newsletterJid  = '120363428186936884@newsletter';
const newsletterName = '.𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`❌ *الاستخدام المعتمد:*\n${usedPrefix + command} <الرسالة>\n\n*مثال:*\n${usedPrefix + command} هلا بك`)
  }

  const contextInfo = {
    mentionedJid: [m.sender],
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: {
      newsletterJid: newsletterJid,
      newsletterName: newsletterName,
      serverMessageId: -1
    },
    externalAdReply: {
      title: '.𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀',
      body: 'الذكاء الاصطناعي والمحادثة الفورية المتقدمة 🧠',
      thumbnail: global.icons || '', 
      sourceUrl: 'https://powerv1.site/deebx/',
      mediaType: 1,
      renderLargerThumbnail: false
    }
  };

  // توليد كود جلسة فريد ونظيف لضمان استقرار الشات
  const chatSessionId = crypto.randomUUID();

  // هيدرز مطابقة تماماً وبنفس الترتيب الدقيق لمنع الـ 503 الفوري
  const headers = {
    'accept': '*/*',
    'accept-language': 'ar-SD',
    'cache-control': 'no-cache',
    'content-type': 'application/json',
    'origin': 'https://powerv1.site',
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'referer': 'https://powerv1.site/deebx/',
    'sec-ch-ua': '"Chromium";v="127", "Not)A;Brand";v="99", "Microsoft Edge Simulate";v="127", "Lemur";v="127"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36'
  };

  const payload = {
    "token": "",
    "prompt": text,
    "chat_session_id": chatSessionId,
    "parent_message_id": 2,
    "thinking_enabled": true,
    "search_enabled": true
  };

  try {
    // تشغيل مؤشر الكتابة في الشات
    await conn.sendPresenceUpdate('composing', m.chat);

    // استخدام الـ fetch المدمج بدلاً من axios لمنع كشف بصمة السكربت (TLS Fingerprint)
    const response = await fetch('https://powerv1.site/deebx/', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    // إذا استمر السيرفر في العناد، نطبع الكود لتسهيل الفحص والتعرف على المشكلة
    if (!response.ok) {
      throw new Error(`سيرفر الموقع رفض الطلب برمز حماية: ${response.status}`);
    }

    // قراءة النص الكامل القادم من السيرفر دفعة واحدة
    const responseData = await response.text();
    
    let fullResponseText = '';
    const lines = responseData.split('\n');
    
    for (let line of lines) {
      line = line.trim();
      if (line.startsWith('data:')) {
        const jsonString = line.replace('data:', '').trim();
        try {
          const parsedData = JSON.parse(jsonString);
          // تجميع كلمات الرد الصافية الموجهة للمستمع وتفادي التفكير الداخلي
          if (parsedData.type === 'answer' && parsedData.text) {
            fullResponseText += parsedData.text;
          }
        } catch (e) {
          continue; // تخطي الأسطر الختامية الفارغة
        }
      }
    }

    fullResponseText = fullResponseText.trim();

    if (!fullResponseText) {
      return conn.reply(m.chat, `❌ *السيرفر لم يرسل استجابة نصية، قد تكون الحماية مفعلة للقروبات.*`, m, { contextInfo });
    }

    // إرسال الرد النهائي الصافي للمستخدم بجروب الواتساب
    await conn.reply(m.chat, fullResponseText, m, { contextInfo });

  } catch (err) {
    console.error(err);
    await conn.reply(
      m.chat,
      `❌ *حدث خطأ أثناء معالجة الطلب:*\n_${err.message || err}_`,
      m,
      { contextInfo }
    );
  }
};

handler.help = ['شاتي'];
handler.command = ['شاتي', 'chat', 'deebx'];
handler.tags = ['ai'];

export default handler;