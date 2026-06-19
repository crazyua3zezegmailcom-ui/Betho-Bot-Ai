import path from "path"
import fs from "fs"

let handler = async (m, { conn }) => {
  try {
    await conn.sendMessage(m.chat, {
      react: { text: "🧹", key: m.key }
    })
    await m.reply("*🧹╎ جاري التنظيف ...*")

    const sessionDir = path.join(process.cwd(), 'Sessions', 'Principal')

    let count = 0
    if (fs.existsSync(sessionDir)) {
      const files = fs.readdirSync(sessionDir)
      const targets = files.filter(f =>
        f.startsWith('pre-key-') || f.startsWith('device-list-')
      )
      count = targets.length
      for (const file of targets) {
        try { fs.unlinkSync(path.join(sessionDir, file)) } catch (_) {}
      }
    }

    await conn.sendMessage(m.chat, {
      react: { text: "🟢", key: m.key }
    })
    await m.reply(`*🗑️╎  تم تنظيف [ ${count} ] ملف*`)

  } catch (error) {
    await m.reply(`\`\`\`${error.message}\`\`\``)
  }
}

handler.command  = /^(تنظيف|clean|cleanup)$/i
handler.category = "owner"
handler.usage    = ["تنظيف"]
handler.owner    = true

export default handler
