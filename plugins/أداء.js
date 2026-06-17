import { workerPool, cache } from '../system/perf.mjs';

const handler = async (m, { conn, isOwner }) => {
  if (!isOwner) return m.reply('❌ هذا الأمر للمطورين فقط');

  const used   = process.memoryUsage();
  const uptime = process.uptime();
  const hours  = Math.floor(uptime / 3600);
  const mins   = Math.floor((uptime % 3600) / 60);
  const secs   = Math.floor(uptime % 60);

  const report = `
╔══════════════════════════════╗
║       📊 تقرير الأداء        ║
╚══════════════════════════════╝

🕐 وقت التشغيل:
   ${hours}س ${mins}د ${secs}ث

💾 الذاكرة:
   RSS     : ${(used.rss      / 1024 / 1024).toFixed(1)} MB
   Heap    : ${(used.heapUsed / 1024 / 1024).toFixed(1)} MB
   External: ${(used.external  / 1024 / 1024).toFixed(1)} MB

⚙️ المعالجة:
   Active Workers : ${workerPool.getActive()}
   Cache Size     : ${cache.size} مدخل

🤖 الإصدار: BETHO BOT v2.0
  `.trim();

  await conn.sendMessage(m.chat, { text: report }, { quoted: m });
};

handler.rowner   = true;
handler.command  = /^(أداء|اداء|perf|performance)$/i;
handler.category = 'owner';
export default handler;
