import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rootDir = process.cwd()
const photosDir = path.join(rootDir, 'src', 'photos')
let localBuffers = []

if (fs.existsSync(photosDir)) {
    const files = fs.readdirSync(photosDir)
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    for (const file of imageFiles) {
        try {
            localBuffers.push(path.join(photosDir, file))
        } catch (e) { console.error(`❌ خطأ في قراءة ${file}`) }
    }
}

const fallbackUrl = "https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg"

let handler = async (m, { conn, usedPrefix }) => {
    const taguser = '@' + m.sender.split('@')[0]
    
    let imagePath = localBuffers.length > 0 
        ? localBuffers[Math.floor(Math.random() * localBuffers.length)] 
        : fallbackUrl

    const menuText = `
𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢
⚙️ 𝗠𝗘𝗡𝗨 🧩
𝐵𝑦 𝐶𝑟𝑎𝑧𝑦

𝗐𝖾𝒍𝒄𝒐𝒎𝒆 ${taguser}

╭───≪⚙️𝗠𝗘𝗡𝗨🧩≫───╮
│ ⌬ ${usedPrefix}م1 ↫ (قسـم مشـرفـين) 👑 
│ ⌬ ${usedPrefix}م2 ↫ (قـسـم تحـمـيل) ⚙️ 
│ ⌬ ${usedPrefix}م3 ↫ (قـسـم صـور) 🧩 
│ ⌬ ${usedPrefix}م4 ↫ (قـسم الذكاء) ⚙️
│ ⌬ ${usedPrefix}م5 ↫ (قـسـم الألعاب) 🌳
│ ⌬ ${usedPrefix}م6 ↫ (قـسـم الـبـحث) 🌴 
│ ⌬ ${usedPrefix}م7 ↫ (قـسـم الـديـن) 📿
│ ⌬ ${usedPrefix}م8 ↫ (قـسم المطـوريـن) 💻
╯───≪ ⚙️🧩⚙️ ≫───╰
Betho Bot For Whatsapp`.trim()

    const sections = [
        {
            title: "قائمة أقسام بيثو 👑",
            rows: [
                { header: "SECTION 1", title: "قسم المشرفين 👑", description: "أوامر الإدارة والجروبات", id: ".م1" },
                { header: "SECTION 2", title: "قسم التحميل ⚙️", description: "تحميل من تيك توك، يوتيوب، إلخ", id: ".م2" },
                { header: "SECTION 3", title: "قسم الصور 🧩", description: "قسـم الصـور و شخصيات الانمـي ⚙️", id: ".م3" },
                { header: "SECTION 4", title: "قسم الذكاء ⚙️", description: "قـسم الذكـاء الاصطناعي و تـعديل الصـور 👑", id: ".م4" },
                { header: "SECTION 5", title: "قسم الألعاب 🌳", description: "فعاليات وألعاب بيثو", id: ".م5" },
                { header: "SECTION 6", title: "قسم البحث 🌴",      description: "البحث في المواقع والمنصات",      id: ".م6" },
                { header: "SECTION 7", title: "قسم الدين 📿",      description: "القرآن الكريم والمحتوى الديني",   id: ".م7" },
                { header: "SECTION 8", title: "قسم المطورين 💻",  description: "أوامر  للمطورين فقط",       id: ".م8" }
            ]
        }
    ]

    await conn.sendMessage(m.chat, {
        product: {
            productImage: { url: fallbackUrl },
            productId: '24529689176623820',
            title: '𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢',
            description: '𝐵𝑦 𝐶𝑟𝑎𝑧𝑦 👑',
            currencyCode: 'USD',
            priceAmount1000: '0',
            retailerId: '⚙️ 𝗠𝗘𝗡𝗨 🧩',
            productImageCount: 1
        },
        businessOwnerJid: '201116571308@s.whatsapp.net',
        caption: menuText,
        footer: '⏤͟͞ू⃪الاقــسام MENU 🤓⃝⃕𝆺𝅥𝆹𝅥',
        interactiveButtons: [
            {
                name: "single_select",
                buttonParamsJson: JSON.stringify({
                    title: "الاقسـام الـمتاحه ⚙️⏤͟͞ू⃪",
                    sections: sections
                })
            },
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: "قناة البوت 📢",
                    url: "https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e"
                })
            },
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: "🌐 موقع البوت",
                    url: "https://codepen.io/Betho-Bot-/full/xbggjOo"
                })
            }
        ]
    }, { quoted: m })
}

handler.command = /^(menu|قائمة|اوامر|أوامر)$/i
export default handler