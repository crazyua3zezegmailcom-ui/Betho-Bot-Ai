// قسم الدين — يعرض أوامر القسم الديني
// الأمر: .م7

function extractCommands(plugin, usedPrefix) {
    let cmds = []
    const cmdDef = plugin.command
    if (!cmdDef) return cmds
    const addCmd = (c) => { if (typeof c === 'string' && c.trim()) cmds.push(usedPrefix + c.trim()) }
    if (Array.isArray(cmdDef)) {
        cmdDef.forEach(c => { if (!c.includes('-')) addCmd(c) })
    } else if (typeof cmdDef === 'string') {
        addCmd(cmdDef)
    } else if (cmdDef instanceof RegExp) {
        let src = cmdDef.source.replace(/^\^/, '').replace(/\$$/, '')
        let firstPart = src.split('|')[0].replace(/[()]/g, '')
        if (firstPart) cmds.push(usedPrefix + firstPart)
    }
    return cmds
}

const handler = async (m, { conn, usedPrefix }) => {
    const taguser = '@' + m.sender.split('@')[0]
    const currentDate = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
    const dayName    = new Date().toLocaleDateString('ar-EG', { weekday: 'long' })
    const imageUrl   = "https://i.postimg.cc/Fsx4fvfK/IMG-20260610-WA0075.jpg"

    let dinCommands = []
    if (global.plugins) {
        for (const plugin of Object.values(global.plugins)) {
            if (!plugin) continue
            const tags = plugin.tags || []
            if (
                (Array.isArray(tags) && tags.some(t => ['دين', 'quran', 'إسلام', 'islam'].includes(String(t).toLowerCase()))) ||
                plugin.din === true
            ) {
                dinCommands.push(...extractCommands(plugin, usedPrefix))
            }
        }
    }
    dinCommands = [...new Set(dinCommands)].sort()

    let menuText = `
╗═══≪ 🌙✨🌙 ≫═══╔
     𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢
    𝐵𝑦 𝐶𝑟𝑎𝑧𝑦 👑
╝═══≪ 🌙✨🌙 ≫═══╚

╮──────────────╭
🌙  مرحباً ${taguser}
📿  قسم الدين والقرآن الكريم
╯──────────────╰

╮───≪ 📿 الأوامر المتاحة ≫───╭`.trim()

    if (dinCommands.length === 0) {
        menuText += `\n│ ⌬ لا توجد أوامر متاحة حالياً`
    } else {
        for (const cmd of dinCommands) {
            menuText += `\n│ ⌬ ${cmd}`
        }
    }

    menuText += `
َ
╯───≪ 🌙✨🌙 ≫───╰

📿 𝐵𝑦 𝐶𝑟𝑎𝑧𝑦 ⚙️
؍ 🌸 تاريـخ: ${currentDate}
؍ 🌸 اليـوم: ${dayName}`.trim()

    const contextInfo = {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardingScore: 1,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363428186936884@newsletter',
            newsletterName: '𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢ 👑',
            serverMessageId: -1
        }
    }

    await conn.sendMessage(m.chat, {
        image: { url: imageUrl },
        caption: menuText,
        contextInfo
    }, {})
}

handler.command = /^(م7)$/i
handler.help    = ['م7']
handler.tags    = ['main']

export default handler
