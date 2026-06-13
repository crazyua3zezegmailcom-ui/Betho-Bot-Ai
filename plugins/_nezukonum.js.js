import { proto } from '@whiskeysockets/baileys'
import { serialize } from '../lib/simple.js'

let handler = async (m, { conn }) => {
    if (m.key.remoteJid.endsWith('@g.us')) return
    if (m.key.fromMe) return

    const userJid = m.sender

    if (!global.db.data.users[userJid]) {
        global.db.data.users[userJid] = {}
    }

    if (global.db.data.users[userJid].welcomed) return

    global.db.data.users[userJid].welcomed = true
    await global.db.write()

    const userName = m.pushName || 'مستخدم'
    const botNumber = conn.user?.id?.split(':')[0] || 'غير معروف'
    const date = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })

    const caption = `تـم الاتصـال ب الـبوت : ${userName}
رقـم البـوت : ${botNumber}
تـاريـخ الاتصـال : ${date}

مــــعلــــومات بــــسيطه الــــبوت يــــعمــــل فــــي الــــمجمــــوعه اســــࢪع مــــن الــــخاص

اشــــرك فــــي قــــنوات البوت علــــۍ واقع الــــتواصل`

    const imageUrl = 'https://i.postimg.cc/2jFJGwzS/IMG-20260610-WA0072.jpg'

    const buttons = [
        proto.Message.InteractiveMessage.Button.create({
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
                display_text: "📢 قناة البوت",
                url: "https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e"
            })
        }),
        proto.Message.InteractiveMessage.Button.create({
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
                display_text: "💬 جروب الدعم",
                url: "https://chat.whatsapp.com/JNUcrtcQjPGJpKoW78dkEc"
            })
        })
    ]

    try {
        await conn.sendMessage(
            userJid,
            {
                product: {
                    productImage: { url: imageUrl },
                    productId: 'welcome-' + Date.now(),
                    title: '✨ مرحباً بك في بوت بيثو ✨',
                    description: 'تم الاتصال بنجاح ✓',
                    currencyCode: 'USD',
                    priceAmount1000: '0',
                    retailerId: 'BETHO BOT',
                    productImageCount: 1
                },
                businessOwnerJid: conn.user.id,
                caption: caption,
                footer: '⚡ تابعنا ليصلك كل جديد',
                interactiveButtons: buttons
            },
            { quoted: m }
        )
    } catch (e) {
        console.error('❌ فشل إرسال Product Message:', e)
        try {
            await conn.sendMessage(
                userJid,
                {
                    image: { url: imageUrl },
                    caption: caption,
                    footer: '⚡ تابعنا ليصلك كل جديد',
                    templateButtons: buttons,
                    viewOnce: false
                },
                { quoted: m }
            )
        } catch (e2) {
            console.error('❌ فشلت الخطة البديلة:', e2)
            await conn.sendMessage(userJid, { text: caption }, { quoted: m }).catch(() => {})
        }
    }
}

handler.all = true

export default handler
