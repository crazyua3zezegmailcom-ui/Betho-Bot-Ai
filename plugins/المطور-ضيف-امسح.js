// أمر ضيف وامسح — إضافة وحذف البلجنات (للمطور فقط)

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pluginsDir = path.resolve(__dirname)

const handler = async (m, { text, usedPrefix, command, conn }) => {

  // ─── أمر ضيف / addp / addplugin ───
  if (/^(ضيف|addp|addplugin)$/i.test(command)) {

    if (!text)
      return conn.reply(m.chat,
        `📌 *طريقة الاستخدام:*\n\n` +
        `${usedPrefix}ضيف اسم_الملف\n` +
        `*(رد على رسالة تحتوي على كود البلجن)*\n\n` +
        `مثال: رد على كود وكتابة\n${usedPrefix}ضيف myPlugin`, m)

    if (!m.quoted || !m.quoted.text)
      return conn.reply(m.chat,
        `⚠️ *يجب الرد على رسالة تحتوي كود البلجن*\n\n` +
        `كيفية الاستخدام:\n` +
        `1️⃣ أرسل كود البلجن في الشات\n` +
        `2️⃣ ارد عليه وكتابة: ${usedPrefix}ضيف اسم_الملف`, m)

    // تنظيف اسم الملف من الأحرف الغير مسموح بها
    const safeName = text.trim().replace(/[/\\:*?"<>|]/g, '_').replace(/\.js$/i, '')
    const filePath = path.join(pluginsDir, `${safeName}.js`)

    try {
      fs.writeFileSync(filePath, m.quoted.text, 'utf8')

      // إعادة تحميل البلجنات
      try { await global.reloadHandler(true) } catch {}

      return conn.reply(m.chat,
        `✅ *تم حفظ البلجن بنجاح!*\n\n` +
        `📂 الاسم: \`${safeName}.js\`\n` +
        `📁 المسار: plugins/${safeName}.js\n` +
        `🔄 تم تحميله تلقائياً`, m)

    } catch (e) {
      return conn.reply(m.chat, `❌ *فشل الحفظ:*\n${e.message}`, m)
    }
  }

  // ─── أمر امسح / delp / delplugin ───
  if (/^(امسح|delp|delplugin|deleteplugin)$/i.test(command)) {

    if (!text)
      return conn.reply(m.chat,
        `📌 *طريقة الاستخدام:*\n\n` +
        `${usedPrefix}امسح اسم_الملف\n\n` +
        `مثال: ${usedPrefix}امسح myPlugin\n` +
        `*(بدون .js في النهاية)*`, m)

    const safeName = text.trim().replace(/[/\\:*?"<>|]/g, '_').replace(/\.js$/i, '')
    const filePath = path.join(pluginsDir, `${safeName}.js`)

    if (!fs.existsSync(filePath))
      return conn.reply(m.chat,
        `❌ *الملف غير موجود!*\n\n` +
        `📂 بحثت عن: plugins/${safeName}.js\n\n` +
        `💡 استخدم ${usedPrefix}getplugin لعرض الملفات المتاحة`, m)

    try {
      fs.unlinkSync(filePath)

      // إعادة تحميل البلجنات
      try { await global.reloadHandler(true) } catch {}

      return conn.reply(m.chat,
        `🗑️ *تم حذف البلجن بنجاح!*\n\n` +
        `📂 الملف المحذوف: plugins/${safeName}.js\n` +
        `🔄 تم تحديث القائمة تلقائياً`, m)

    } catch (e) {
      return conn.reply(m.chat, `❌ *فشل الحذف:*\n${e.message}`, m)
    }
  }
}

handler.help    = ['ضيف <اسم>', 'امسح <اسم>']
handler.tags    = ['owner']
handler.command = /^(ضيف|addp|addplugin|امسح|delp|delplugin|deleteplugin)$/i
handler.rowner  = true

export default handler
