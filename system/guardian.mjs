import fs from 'fs';

// ═══════════════════════════════════════════
//  Error Logging → ./logs/errors.log
// ═══════════════════════════════════════════
const ERROR_LOG = './logs/errors.log';

export const logError = (type, err) => {
  try {
    if (!fs.existsSync('./logs')) fs.mkdirSync('./logs', { recursive: true });
    const line = `[${new Date().toISOString()}] [${type}] ${err?.message || err}\n`;
    fs.appendFileSync(ERROR_LOG, line);
    // Rotate at 1 MB
    const stat = fs.statSync(ERROR_LOG);
    if (stat.size > 1 * 1024 * 1024) fs.writeFileSync(ERROR_LOG, '');
  } catch {}
};

// ═══════════════════════════════════════════
//  Anti Crash — process-level handlers
// ═══════════════════════════════════════════
process.on('uncaughtException', (err) => {
  console.error('[GUARDIAN] uncaughtException:', err.message);
  logError('uncaughtException', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[GUARDIAN] unhandledRejection:', reason);
  logError('unhandledRejection', reason);
});

process.on('SIGTERM', () => {
  console.log('[GUARDIAN] SIGTERM — البوت بيقفل بأمان');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('[GUARDIAN] SIGINT — البوت بيقفل بأمان');
  process.exit(0);
});

// ═══════════════════════════════════════════
//  Safe Wrappers
// ═══════════════════════════════════════════
export const safeRun = async (fn, fallback = null) => {
  try {
    return await fn();
  } catch (e) {
    logError('safeRun', e);
    return fallback;
  }
};

export const safeReply = async (conn, jid, text, m) => {
  try {
    await conn.sendMessage(jid, { text }, { quoted: m });
  } catch (e) {
    logError('safeReply', e);
    try { await conn.sendMessage(jid, { text }); } catch {}
  }
};

// ═══════════════════════════════════════════
//  Memory Guardian — monitors every 60s
// ═══════════════════════════════════════════
const MEMORY_LIMIT_MB = 450;

setInterval(() => {
  const rssMB = process.memoryUsage().rss / 1024 / 1024;
  if (rssMB > MEMORY_LIMIT_MB) {
    console.warn(`[GUARDIAN] ذاكرة عالية: ${rssMB.toFixed(1)}MB — جاري التنظيف`);
    logError('MEMORY_WARNING', { message: `${rssMB.toFixed(1)}MB` });

    if (global.perfCache instanceof Map) global.perfCache.clear();

    setTimeout(() => {
      const after = process.memoryUsage().rss / 1024 / 1024;
      if (after > MEMORY_LIMIT_MB) {
        console.error('[GUARDIAN] الذاكرة لسه عالية — إعادة تشغيل');
        process.exit(1);
      }
    }, 5000);
  }
}, 60 * 1000);

console.log('[GUARDIAN] ✅ نظام الحماية شغال');
