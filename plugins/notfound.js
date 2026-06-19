const handler = {}

handler.all = async function (m, { conn }) {
    try {
        if (!m.text) return

        // البادئة
        const prefixRegex = /^[./#!]/
        const usedPrefix = prefixRegex.exec(m.text)?.[0]

        // إذا مو أمر
        if (!usedPrefix) return

        // اسم الأمر
        const command = m.text
            .slice(usedPrefix.length)
            .trim()
            .split(/\s+/)[0]
            .toLowerCase()

        if (!command) return

        // تجاهل الأوامر الموجودة
        const plugins = Object.values(global.plugins)

        let found = false

        for (const plugin of plugins) {
            if (!plugin.command) continue

            const cmd = plugin.command

            // RegExp
            if (cmd instanceof RegExp) {
                if (cmd.test(command)) {
                    found = true
                    break
                }
            }

            // Array
            else if (Array.isArray(cmd)) {
                if (
                    cmd.some(c =>
                        c.toString().toLowerCase() === command
                    )
                ) {
                    found = true
                    break
                }
            }

            // String
            else {
                if (
                    cmd.toString().toLowerCase() === command
                ) {
                    found = true
                    break
                }
            }
        }

        // إذا الأمر مو موجود
        if (!found) {
            await conn.reply(
                m.chat,
`❌ *هذا الأمر غير موجود*

📌 *الأمر:* ${usedPrefix}${command}

اكتب *.menu* أو *.اوامر*
لعرض قائمة الأوامر`,
                m
            )
        }

    } catch (err) {
        console.error('notfound:', err)
    }
}

export default handler