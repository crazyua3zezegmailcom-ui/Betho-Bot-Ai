import vm from 'vm'
import syntaxError from 'syntax-error'

const codePatterns = [
    /import\s.+from/,
    /require\(/,
    /export\s+default/,
    /module\.exports/,
    /const\s+\w+/,
    /let\s+\w+/,
    /var\s+\w+/,
    /function\s+\w*/,
    /=>/,
    /if\s*\(/,
    /class\s+/,
    /async\s+/,
    /await\s+/,
    /handler\./,
    /m\.reply/,
    /conn\./,
    /global\./,
    /switch\s*\(/,
    /try\s*{/,
    /catch\s*\(/
]

export async function all(m) {
    try {
        // تجاهل الرسائل الفاضية
        if (!m?.text) return true

        // تجاهل رسائل البوت نفسه
        if (m.fromMe) return true

        const text = m.text.trim()

        // كشف ذكي للكود
        const looksLikeCode =
            codePatterns.some(x => x.test(text)) ||
            (
                text.includes('{') &&
                text.includes('}')
            ) ||
            text.includes('=>') ||
            text.includes(';')

        // إذا مو كود، تجاهل
        if (!looksLikeCode) return true

        // فحص Syntax
        const err = syntaxError(text, 'plugin.js', {
            sourceType: 'module',
            allowAwaitOutsideFunction: true
        })

        if (err) {
            await m.reply(
`❌ *تم اكتشاف خطأ بالكود*

📝 *السبب:*
${err.message}

📍 *السطر:* ${err.line || 'غير معروف'}
📍 *العمود:* ${err.column || 'غير معروف'}`
            )

            return true
        }

        // فحص Runtime مثل أخطاء التيرمنال
        try {
            new vm.Script(text)
        } catch (runtimeErr) {
            await m.reply(
`❌ *خطأ محتمل بالتيرمنال*

📝 ${runtimeErr.message}`
            )
        }

    } catch (e) {
        console.error(e)
    }

    return true
}