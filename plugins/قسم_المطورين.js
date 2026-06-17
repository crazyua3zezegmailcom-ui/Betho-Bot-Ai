// قسم المطورين — يعرض كل الأوامر الخاصة بالمطور
// الأمر: .م8

function extractCommands(plugin, usedPrefix) {
    let cmds = []
    const cmdDef = plugin.command
    if (!cmdDef) return cmds
    const addCmd = (c) => { if (typeof c === 'string' && c.trim()) cmds.push(usedPrefix + c.trim()) }
    if (Array.isArray(cmdDef)) {
        cmdDef.forEach(addCmd)
    } else if (typeof cmdDef === 'string') {
        addCmd(cmdDef)
    } else if (cmdDef instanceof RegExp) {
        let src = cmdDef.source.replace(/^\^/, '').replace(/\$$/, '')
        let firstPart = src.split('|')[0].replace(/[()]/g, '')
        if (firstPart) cmds.push(usedPrefix + firstPart)
    }
    return cmds
}

const handler = async (m, { conn, usedPrefix, isOwner }) => {
    if (!isOwner) return m.reply('❌ هذا القسم للمطورين فقط')

    const taguser    = '@' + m.sender.split('@')[0]
    const currentDate = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
    const dayName    = new Date().toLocaleDateString('ar-EG', { weekday: 'long' })
    const imageUrls  = [
        "https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg",
        "https://i.postimg.cc/gksCzK5n/IMG-20260610-WA0076.jpg",
        "https://i.postimg.cc/Fsx4fvfK/IMG-20260610-WA0075.jpg"
    ]
    const imageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)]

    let ownerCmds = []
    if (global.plugins) {
        for (const plugin of Object.values(global.plugins)) {
            if (!plugin) continue
            if (plugin.owner === true || plugin.rowner === true) {
                ownerCmds.push(...extractCommands(plugin, usedPrefix))
            }
        }
    }
    ownerCmds = [...new Set(ownerCmds)].sort()

    // تصنيف الأوامر
    const cleanupCmds  = ownerCmds.filter(c => /تنظيف|cleanup|clean/i.test(c))
    const botStatCmds  = ownerCmds.filter(c => /بوتاتي|mybots|botstats/i.test(c))
    const banCmds      = ownerCmds.filter(c => /حظر|بان|ban|unban/i.test(c))
    const broadcastCmds = ownerCmds.filter(c => /broadcast|نشر|رسالة/i.test(c))
    const otherCmds    = ownerCmds.filter(c =>
        ![...cleanupCmds, ...botStatCmds, ...banCmds, ...broadcastCmds].includes(c)
    )

    let menuText = `
╗═══≪ 💻🔥💻 ≫═══╔
     𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢
    𝐵𝑦 𝐶𝑟𝑎𝑧𝑦 👑
╝═══≪ 💻🔥💻 ≫═══╚

╮──────────────╭
💻  ${taguser}
🔑  قسـم المطـورين (OWNER)
╯──────────────╰`.trim()

    function addSection(title, cmds) {
        if (cmds.length === 0) return
        menuText += `\n\n╮───≪ ${title} ≫───╭`
        for (const cmd of cmds) menuText += `\n│ ⌬ ${cmd}`
        menuText += `\n╯────────────────────╰`
    }

    addSection('🧹 التنظيف والصيانة', cleanupCmds)
    addSection('🤖 إحصائيات البوتات', botStatCmds)
    addSection('🚫 الحظر والإدارة', banCmds)
    addSection('📢 البث والنشر', broadcastCmds)
    addSection('⚙️ أوامر أخرى', otherCmds)

    if (ownerCmds.length === 0) {
        menuText += `\n\n│ ⌬ لا توجد أوامر مطور محملة حالياً`
    }

    menuText += `

╮──────────────╭
📊 إجمالي أوامر المطور: ${ownerCmds.length}
╯──────────────╰

💻 𝐵𝑦 𝐶𝑟𝑎𝑧𝑦 ⚙️
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

handler.command = /^(م8)$/i
handler.help    = ['م8']
handler.tags    = ['main']
handler.owner   = true

export default handler
