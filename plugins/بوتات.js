/**
 * 🤖 Sub-Bots Status & Info Plugin — أمر فحص معلومات البوتات الفرعية
 * ⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀
 * مخصص ومظبط بالكامل على توقيت عُمان، قياس الرام، وتحديد دول أرقام البوتات.
 */

import fs from 'fs'
import path from 'path'
import os from 'os'
import ws from 'ws'

// زخرفة القوالب بناءً على ثيم ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 الخاص بك
const startDeco = `╗═══≪ 🌿🍉🍡 ≫═══╔`;
const endDeco   = `╝═══≪ 🌿🍉🍡 ≫═══╚`;

// قائمة الصور المعتمدة للأمر ليتم اختيار واحدة منها عشوائياً
const bethoImages = [
  "https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg",
  "https://i.postimg.cc/Fsx4fvfK/IMG-20260610-WA0075.jpg",
  "https://i.postimg.cc/gksCzK5n/IMG-20260610-WA0076.jpg",
  "https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg",
  "https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg",
  "https://i.postimg.cc/Fsx4fvfK/IMG-20260610-WA0075.jpg",
  "https://i.postimg.cc/gksCzK5n/IMG-20260610-WA0076.jpg",
  "https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg",
  "https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg"
];

// دالة لتحديد اسم الدولة بناءً على رمز الاتصال الدولي للرقم
function getCountryByJid(jid) {
  let num = jid.split('@')[0];
  if (num.startsWith('968')) return 'سلطنة عُمان 🇴🇲';
  if (num.startsWith('966')) return 'المملكة العربية السعودية 🇸🇦';
  if (num.startsWith('971')) return 'الإمارات العربية المتحدة 🇦🇪';
  if (num.startsWith('965')) return 'الكويت 🇰🇼';
  if (num.startsWith('973')) return 'البحرين 🇧🇭';
  if (num.startsWith('974')) return 'قطر 🇶🇦';
  if (num.startsWith('20'))  return 'مصر 🇪🇬';
  if (num.startsWith('249')) return 'السودان 🇸🇩';
  if (num.startsWith('962')) return 'الأردن 🇯🇴';
  if (num.startsWith('961')) return 'لبنان 🇱🇧';
  if (num.startsWith('963')) return 'سوريا 🇸🇾';
  if (num.startsWith('964')) return 'العراق 🇮🇶';
  if (num.startsWith('970') || num.startsWith('972')) return 'فلسطين 🇵🇸';
  if (num.startsWith('967')) return 'اليمن 🇾🇪';
  if (num.startsWith('212')) return 'المغرب 🇲🇦';
  if (num.startsWith('213')) return 'الجزائر 🇩🇿';
  if (num.startsWith('216')) return 'تونس 🇹🇳';
  if (num.startsWith('218')) return 'ليبيا 🇱🇾';
  if (num.startsWith('1'))   return 'الولايات المتحدة / كندا 🇺🇸🇨🇦';
  if (num.startsWith('44'))  return 'المملكة المتحدة 🇬🇧';
  return 'دولة أخرى / غير محددة 🌍';
}

// دالة تحويل الملي ثانية إلى وقت مقروء (أيام، ساعات، دقائق)
function clockString(ms) {
  let h = Math.floor(ms / 3600000) % 24;
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return `${h} ساعة، ${m} دقيقة، ${s} ثانية`;
}

let handler = async (m, { conn }) => {
  // 1️⃣ إعدادات الوقت والتاريخ بتوقيت مسقط - عُمان 🇴🇲
  const optionsTime = { timeZone: 'Africa/Cairo', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const optionsDate = { timeZone: 'Africa/Cairo', year: 'numeric', month: '2-digit', day: '2-digit' };
  
  const currentTime = new Date().toLocaleTimeString('ar-EG', optionsTime);
  const currentDate = new Date().toLocaleDateString('ar-EG', optionsDate);

  // 2️⃣ حساب وقت تشغيل السيرفر (Uptime) واستطاعة الرام
  const uptimeMs = process.uptime() * 1000;
  const serverUptime = clockString(uptimeMs);
  
  // حساب الرام المستهلك من إجمالي الـ 3G المحددة الصافية لسيرفرك
  const usedRamRaw = (process.memoryUsage().rss / 1024 / 1024).toFixed(2); // ميجابايت
  const ramOutput = `${usedRamRaw} MB / 3072 MB (3G الصافي)`;

  // 3️⃣ قراءة المجلدات بداخل مجلد السيرفر الخاص بالبوتات الفرعية لعد الجلسات المخزنة
  const subBotPath = path.join(process.cwd(), 'Sessions/SubBot');
  let totalSubBotsCount = 0;
  let subBotsList = [];

  if (fs.existsSync(subBotPath)) {
    // جلب كافة المجلدات أو الملفات بداخل المسار
    const files = fs.readdirSync(subBotPath);
    // تنقية وفحص المجلدات التي تمثل أرقام/جلسات بوتات فرعية
    const subDirectories = files.filter(file => {
      return fs.statSync(path.join(subBotPath, file)).isDirectory();
    });
    totalSubBotsCount = subDirectories.length;
  }

  // 4️⃣ فحص البوتات الحية المتصلة حالياً بداخل المصفوفة العالمية conns
  // نتحقق من الاتصالات النشطة وغير المغلقة
  let activeConnections = global.conns ? global.conns.filter(c => c.user && c.ws && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED) : [];

  // بناء التقرير النصي الرئيسي
  let reportText = `✨ *مـعـلـومـات الـبـوتـات الـفـرعـيـة والـسـيـرفـر* ✨\n\n`;
  reportText += `👥 *عدد البوتات الفرعية الإجمالي:* ${totalSubBotsCount}\n`;
  reportText += `🟢 *عدد المتصلين حالياً:* ${activeConnections.length}\n`;
  reportText += `⏰ *الوقت:* ${currentTime} 🇪🇬 (بتوقيت مصر)\n`;
  reportText += `📅 *التاريخ:* ${currentDate}\n`;
  reportText += `⏳ *وقت تشغيل السيرفر:* ${serverUptime}\n`;
  reportText += `📊 *الرام المستهلك:* ${ramOutput}\n\n`;

  // 5️⃣ حلقة التكرار لطباعة بيانات كل بوت متصل أو مسجل
  if (activeConnections.length === 0) {
    reportText += `⚠️ *لا توجد بوتات فرعية متصلة نشطة حالياً في السيرفر.*\n`;
  } else {
    activeConnections.forEach((botConn, index) => {
      let botJid = botConn.user.jid || botConn.user.id;
      let cleanNumber = botJid.split('@')[0].split(':')[0];
      let botName = botConn.user.name || 'مجهول أو لم يحدد';
      
      // جلب وقت تشغيل البوت الفرعي الفردي إذا كان مسجلاً بالملي
      let botUptime = botConn.uptime ? clockString(Date.now() - botConn.uptime) : "غير محدد";

      reportText += `${startDeco}\n`;
      reportText += `🤖 *الـبـوت رقـم ${index + 1}*\n`;
      reportText += `📞 *الرقـم :* ${cleanNumber}\n`;
      reportText += `🔗 *الرقـم مع الرابـط :* wa.me/${cleanNumber}\n`;
      reportText += `⏱️ *وقـت الاتصال :* ${botUptime}\n`;
      reportText += `🟢 *متـصل حاليـاََ :* نعم\n`;
      reportText += `🗺️ *الدولـه :* ${getCountryByJid(botJid)}\n`;
      reportText += `👤 *الاسـم :* ${botName}\n`;
      reportText += `${endDeco}\n\n`;
    });
  }

  // اختيار صورة ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 عشوائية من القائمة التي زودتني بها لترسل مع الأمر
  const randomBethoImg = bethoImages[Math.floor(Math.random() * bethoImages.length)];

  // إرسال التقرير مزوداً بالصورة العشوائية وثيم ⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥 الرائع
  await conn.sendMessage(m.chat, {
    image: { url: randomBethoImg },
    caption: reportText.trim()
  }, { quoted: m });
};

handler.help = ['بوتات', 'الفرعية'];
handler.tags = ['info', 'tools'];
handler.command = /^(بوتات|الفرعية|subbots|bots)$/i;

export default handler;