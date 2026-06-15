/**
 * ═══════════════════════════════════════════════════════
 *              🛡️ نظام الحماية - Betho Bot
 *         فلترة الكلمات + فحص الصور والستيكرات
 *   الحالة محفوظة في global.db.data.chats[chatId].protection
 * ═══════════════════════════════════════════════════════
 */

// ─── تخزين عدد التحذيرات والسجل ───
const protState = new Map();

function getState(chatId) {
  if (!protState.has(chatId)) {
    protState.set(chatId, { warnCount: {}, log: [] });
  }
  return protState.get(chatId);
}

function isEnabled(chatId) {
  return global.db.data.chats?.[chatId]?.protection === true;
}

// ═══════════════════════════════════════════════════════
//                  📋 قوائم الكلمات
// ═══════════════════════════════════════════════════════
const BANNED_WORDS = [
  'سكس','جنس','نيك','ينيك','ناك','متناك','اتناك',
  'كس','كسمك','كسم','زب','زبر','طيز','بزاز',
  'صدر عاري','عاري','عارية','عري','تعري',
  'علاقة جنسية','علاقة حميمية','علاقات حميمية',
  'ممارسة الجنس','ممارسة جنسية',
  'اغتصاب','دعارة','دعاره','مومس','زانية','زاني',
  'شرموط','شرموطة','شرموطه','قحبة','قحب',
  'عاهره','عاهرة',
  'اباحي','إباحي','اباحية','اباحيه','إباحية',
  'بورن','محتوى جنسي','محتوى للكبار','مقاطع ساخنة','مقاطع للكبار',
  'للكبار','اغراء','إغراء','مغري','مغرية',
  'لانجري','جسم عاري','فرج','قضيب','مص','لحس',
  'عرص','معرص','خول','يا خول','يا عرص',
  'ابن المتناكة','ابن المتناكه','ابن الكلب','ابن كلب',
  'ابن الحرام','ولد الحرام',
  'fuck','fucking','motherfucker','asshole',
  'son of a bitch','shit','shithead','dickhead',
  'scumbag','bastard',
  'sex','porn','xxx','nude','naked',
  'dick','pussy','cock','cum','whore','slut',
  'blowjob','handjob','anal','orgasm','horny',
  'boobs','bitch',
  'adult content','nsfw','erotic','escort','escorts',
  'camgirl','camgirls','webcam sex','sexual','fetish',
  'hentai','onlyfans','only fans',
  'hardcore','softcore','strip','stripper',
  'lingerie','bdsm','sexy',
  'xvideos','pornhub','xnxx','xhamster','redtube',
  'onlyfans.com','chaturbate','livejasmin',
  's3x','s@x','5nz1r','pr0n','p0rn',
];

const WARN_WORDS = [
  'غبي','غبية','أهبل','اهبل','متخلف','متخلفة',
  'حمار','كلب','كلبة','قرد','حيوان',
  'وسخ','تافه','تافهة','فاشل','فاشلة',
  'كلوت','مجنون','مجنونة',
  'idiot','stupid','dumb','loser','trash','jerk','moron',
];

// ═══════════════════════════════════════════════════════
//              🔍 دوال الفحص
// ═══════════════════════════════════════════════════════
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/(.)\1{2,}/g, '$1$1')
    .replace(/0/g,'o').replace(/1/g,'i').replace(/3/g,'e')
    .replace(/4/g,'a').replace(/5/g,'s').replace(/8/g,'b')
    .replace(/[*_~`|،؟!.,;:'"()[\]{}<>@#$%^&+=\-/\\]/g,' ')
    .replace(/\s+/g,' ').trim();
}

function compactText(text) {
  return normalizeText(text).replace(/\s+/g,'');
}

function checkText(text) {
  const norm     = normalizeText(text);
  const compact  = compactText(text);
  const original = text.toLowerCase().replace(/[\u064B-\u065F\u0670]/g,'');

  for (const word of BANNED_WORDS) {
    const w = word.toLowerCase();
    if (norm.includes(w))                       return { type:'banned', word };
    if (compact.includes(w.replace(/\s/g,'')))  return { type:'banned', word };
    if (original.includes(w))                   return { type:'banned', word };
  }
  for (const word of WARN_WORDS) {
    const w = word.toLowerCase();
    if (norm.includes(w))                       return { type:'warn', word };
    if (compact.includes(w.replace(/\s/g,'')))  return { type:'warn', word };
  }
  return null;
}

async function checkMedia(m) {
  try {
    const msg = m.message;
    if (!msg) return null;

    if (msg.stickerMessage) {
      const sticker = msg.stickerMessage;
      if (sticker.isAnimated && (sticker.fileLength || 0) > 500 * 1024)
        return { suspicious: true, reason: 'ستيكر بحجم غير طبيعي' };
      const suspiciousEmojis = ['🔞','💋','🍑','🍆','👙'];
      for (const cat of (sticker.categories || []))
        if (suspiciousEmojis.includes(cat))
          return { suspicious: true, reason: 'ستيكر يحتوي محتوى مشبوه' };
    }

    if (msg.imageMessage) {
      const captionCheck = checkText(msg.imageMessage.caption || '');
      if (captionCheck?.type === 'banned')
        return { suspicious: true, reason: `كابشن محظور: ${captionCheck.word}` };
      const url = msg.imageMessage.url || '';
      for (const site of ['xvideos','pornhub','xnxx','xhamster'])
        if (url.includes(site))
          return { suspicious: true, reason: 'صورة من موقع إباحي' };
    }

    if (msg.videoMessage) {
      const captionCheck = checkText(msg.videoMessage.caption || '');
      if (captionCheck?.type === 'banned')
        return { suspicious: true, reason: `كابشن فيديو محظور: ${captionCheck.word}` };
    }
  } catch {}
  return null;
}

async function deleteMessage(conn, chatId, m) {
  try { await conn.sendMessage(chatId, { delete: m.key }); } catch {}
}

async function kickMember(conn, chatId, jid) {
  try {
    await conn.groupParticipantsUpdate(chatId, [jid], 'remove');
    return true;
  } catch { return false; }
}

function logEvent(state, jid, type, detail) {
  state.log.push({ jid, type, detail, time: new Date().toLocaleString('ar-EG') });
  if (state.log.length > 50) state.log.shift();
}

// ═══════════════════════════════════════════════════════
//           دالة مشتركة لفحص الرسالة وتنفيذ الإجراء
// ═══════════════════════════════════════════════════════
async function processMessage(m, conn, { isOwner, isAdmin, isBotAdmin } = {}) {
  const chatId   = m.chat;
  const senderId = m.sender;

  if (!chatId.endsWith('@g.us')) return;
  if (!isEnabled(chatId)) return;
  if (isOwner || isAdmin || isBotAdmin) return;

  const state = getState(chatId);
  const body  = (m.body || '').trim();
  const msg   = m.message;
  const name  = senderId.split('@')[0];

  // ─── فحص النص ───
  if (body) {
    const result = checkText(body);

    if (result?.type === 'banned') {
      await deleteMessage(conn, chatId, m);
      const kicked = await kickMember(conn, chatId, senderId);
      logEvent(state, senderId, 'kick', `كلمة محظورة: "${result.word}"`);
      await conn.sendMessage(chatId, {
        text:
          `🚨 *تم اكتشاف محتوى مخالف!*\n\n` +
          `👤 العضو: @${name}\n` +
          `🚫 السبب: كلمة محظورة\n` +
          `🗑️ الرسالة: تم حذفها\n` +
          `${kicked ? '👢 الإجراء: تم الطرد' : '⚠️ تعذّر الطرد — تأكد إن البوت أدمن'}`,
        mentions: [senderId]
      });
      return;
    }

    if (result?.type === 'warn') {
      state.warnCount[senderId] = (state.warnCount[senderId] || 0) + 1;
      const warns = state.warnCount[senderId];
      logEvent(state, senderId, 'warn', `"${result.word}" (${warns}/3)`);

      if (warns >= 3) {
        await deleteMessage(conn, chatId, m);
        const kicked = await kickMember(conn, chatId, senderId);
        state.warnCount[senderId] = 0;
        logEvent(state, senderId, 'kick', 'تجاوز 3 تحذيرات');
        await conn.sendMessage(chatId, {
          text: `🚨 *@${name} تم طرده بعد 3 تحذيرات!*\n${kicked ? '👢 تم الطرد' : '⚠️ تعذّر الطرد'}`,
          mentions: [senderId]
        });
      } else {
        await conn.sendMessage(chatId, {
          text:
            `⚠️ *تحذير!* @${name}\n\n` +
            `🚫 رسالتك تحتوي لغة غير لائقة\n` +
            `📊 تحذيراتك: ${warns}/3\n` +
            `❗ عند الوصول لـ 3 تحذيرات سيتم طردك`,
          mentions: [senderId]
        });
      }
      return;
    }
  }

  // ─── فحص الوسائط ───
  if (msg?.imageMessage || msg?.stickerMessage || msg?.videoMessage) {
    const mediaResult = await checkMedia(m);
    if (mediaResult?.suspicious) {
      await deleteMessage(conn, chatId, m);
      const kicked = await kickMember(conn, chatId, senderId);
      logEvent(state, senderId, 'media', mediaResult.reason);
      const mediaType = msg.stickerMessage ? 'ستيكر' : msg.videoMessage ? 'فيديو' : 'صورة';
      await conn.sendMessage(chatId, {
        text:
          `🚨 *تم اكتشاف ${mediaType} مخالف!*\n\n` +
          `👤 العضو: @${name}\n` +
          `🚫 السبب: ${mediaResult.reason}\n` +
          `🗑️ المحتوى: تم حذفه\n` +
          `${kicked ? '👢 الإجراء: تم الطرد' : '⚠️ تعذّر الطرد'}`,
        mentions: [senderId]
      });
    }
  }
}

// ═══════════════════════════════════════════════════════
//           الهاندلر الرئيسي — أوامر الحماية
// ═══════════════════════════════════════════════════════
const handler = async (m, { conn, args, isAdmin, isOwner }) => {
  const chatId = m.chat;
  const sub    = (args?.[0] || '').trim();

  if (!chatId.endsWith('@g.us'))
    return m.reply('🚫 هذا الأمر للجروبات فقط!');

  if (!isAdmin && !isOwner)
    return m.reply('🚫 هذا الأمر للأدمن فقط!');

  // تأكد إن الـ chat موجود في الـ DB
  if (!global.db.data.chats[chatId]) global.db.data.chats[chatId] = {};

  // ─── تفعيل ───
  if (['تشغيل','on'].includes(sub)) {
    if (isEnabled(chatId))
      return m.reply('✅ الحماية مفعّلة بالفعل!\nللإيقاف: *.حماية إيقاف*');

    global.db.data.chats[chatId].protection = true;
    getState(chatId);
    return m.reply(
      `🛡️ *تم تفعيل نظام الحماية!*\n\n` +
      `✅ فلترة الكلمات المحظورة\n` +
      `✅ فحص الصور والفيديو\n` +
      `✅ فحص الستيكرات\n\n` +
      `⚠️ أي محتوى مخالف سيتم:\n` +
      `   🗑️ حذف الرسالة\n` +
      `   👢 طرد العضو\n\n` +
      `📌 للإيقاف: *.حماية إيقاف*`
    );
  }

  // ─── إيقاف ───
  if (['إيقاف','ايقاف','off'].includes(sub)) {
    if (!isEnabled(chatId))
      return m.reply('⚠️ الحماية غير مفعّلة أصلاً.\nللتفعيل: *.حماية تشغيل*');

    global.db.data.chats[chatId].protection = false;
    return m.reply('🔓 *تم إيقاف نظام الحماية*');
  }

  // ─── السجل ───
  if (['سجل','log'].includes(sub)) {
    if (!isEnabled(chatId))
      return m.reply('⚠️ الحماية غير مفعّلة. فعّلها أولاً بـ *.حماية تشغيل*');

    const state = getState(chatId);
    if (state.log.length === 0)
      return m.reply('📋 السجل فارغ حتى الآن.');

    let logMsg = `📋 *سجل الحماية (آخر ${Math.min(state.log.length, 10)} حدث)*\n\n`;
    for (const entry of state.log.slice(-10).reverse()) {
      const icon = entry.type === 'kick' ? '👢' : entry.type === 'media' ? '🖼️' : '⚠️';
      logMsg += `${icon} @${entry.jid.split('@')[0]}\n   📌 ${entry.detail}\n   🕐 ${entry.time}\n\n`;
    }
    return m.reply(logMsg);
  }

  // ─── الحالة الافتراضية ───
  const active = isEnabled(chatId);
  return m.reply(
    `🛡️ *نظام الحماية*\n\n` +
    `الحالة: ${active ? '✅ مفعّل' : '❌ موقوف'}\n\n` +
    `📌 الأوامر:\n` +
    `▫️ *.حماية تشغيل* — تفعيل\n` +
    `▫️ *.حماية إيقاف* — تعطيل\n` +
    `▫️ *.حماية سجل* — عرض السجل`
  );
};

// ═══════════════════════════════════════════════════════
//     handler.before — يشتغل تلقائياً على كل رسالة
// ═══════════════════════════════════════════════════════
handler.before = async (m, { conn, isOwner, isAdmin, isBotAdmin }) => {
  await processMessage(m, conn, { isOwner, isAdmin, isBotAdmin });
  return true;
};

handler.command  = /^حماي[هة]/i;
handler.usage    = ['حماية تشغيل', 'حماية إيقاف', 'حماية سجل'];
handler.category = 'admin';
handler.group    = true;

export default handler;
