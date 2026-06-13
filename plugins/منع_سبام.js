const startDeco = `╗═══≪ ⚙️🧩⚙️ ≫═══╔`
const endDeco = `╝═══≪ ⚙️🧩⚙️ ≫═══╚`

if (!global.spamTracker) global.spamTracker = {}
if (!global.mutedUsers) global.mutedUsers = {}
if (!global.violationCounter) global.violationCounter = {}

let handler = async (m, { conn, command, isAdmin, isBotAdmin }) => {
    if (!m.isGroup) return
    let chat = global.db.data.chats[m.chat]
    if (!chat) global.db.data.chats[m.chat] = {}

    if (command === 'منع_سبام') {
        if (!isAdmin) return m.reply('❌ *هذا الأمر للمشرفين فقط!*')
        if (!isBotAdmin) return m.reply('❌ *ارفعني مشرف أولاً!*')
        chat.antiSpam = true
        return m.reply(`${startDeco}\n✅ *تم تفعيل مانع السبام*\n⏳ (طرد 5 دقائق للمتحايلين)\n${endDeco}`)
    }

    if (command === 'فتح_سبام') {
        if (!isAdmin) return m.reply('❌ *هذا الأمر للمشرفين فقط!*')
        chat.antiSpam = false
        return m.reply(`${startDeco}\n🔓 *تم تعطيل مانع السبام*\n${endDeco}`)
    }
}

handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {
    if (!m.isGroup || !isBotAdmin) return
    let chat = global.db.data.chats[m.chat]
    if (!chat || !chat.antiSpam) return
    if (isAdmin) return 

    let user = m.sender
    let chatId = m.chat
    let groupMetadata = await conn.groupMetadata(chatId)
    let groupName = groupMetadata.subject
    let uniqueId = chatId + user

    if (global.mutedUsers[uniqueId]) {
        let now = Date.now()
        if (now < global.mutedUsers[uniqueId]) {
            await conn.sendMessage(chatId, { delete: m.key })

            if (!global.violationCounter[uniqueId]) global.violationCounter[uniqueId] = 1
            else global.violationCounter[uniqueId]++

            if (global.violationCounter[uniqueId] >= 4) {
                delete global.violationCounter[uniqueId]
                delete global.mutedUsers[uniqueId]
                
                try {
                    await conn.sendMessage(user, { 
                        text: `🚫 *عقوبة طرد مؤقت*\n\nلقد تم طردك من مجموعة *[ ${groupName} ]* لمدة 5 دقائق بسبب السبام والتحايل.\n\nسيتم محاولة إعادتك أو إرسال رابط دعوة بعد انتهاء المدة.` 
                    })
                } catch (e) { console.log('تعذر مراسلة العضو') }

                await conn.groupParticipantsUpdate(chatId, [user], 'remove')
                
                await conn.sendMessage(chatId, { 
                    text: `${startDeco}\n🚫 *طرد مؤقت لمدة 5 دقائق*\n\nالعضو: @${user.split('@')[0]}\nالسبب: تخطي حدود الكتم.\n${endDeco}`, 
                    mentions: [user] 
                })
                
                setTimeout(async () => {
                    try {
                        let response = await conn.groupParticipantsUpdate(chatId, [user], 'add')
                        
                        if (response[0]?.status === "403") {
                            throw new Error("PrivacyBlock")
                        }

                        await conn.sendMessage(user, { text: `✅ *انتهت العقوبة*\n\nلقد تم إعادتك لمجموعة *[ ${groupName} ]* بنجاح.` })
                        await conn.sendMessage(chatId, { text: `✅ تم إعادة العضو @${user.split('@')[0]} بنجاح.`, mentions: [user] })

                    } catch (e) {
                        let code = await conn.groupInviteCode(chatId)
                        await conn.sendMessage(user, { 
                            text: `⚠️ *انتهت عقوبتك*\n\nلكن لم أستطع إضافتك تلقائياً بسبب "إعدادات الخصوصية" لديك.\n\nتفضل رابط المجموعة للعودة:\nhttps://chat.whatsapp.com/${code}` 
                        })
                        await conn.sendMessage(chatId, { text: `⚠️ انتهت عقوبة @${user.split('@')[0]} وتم إرسال رابط دعوة له في الخاص لأن خصوصيته تمنع إضافته.`, mentions: [user] })
                    }
                }, 300000) 
            }
            return false
        } else {
            delete global.mutedUsers[uniqueId]
            delete global.violationCounter[uniqueId]
            conn.reply(chatId, `✅ @${user.split('@')[0]} انتهى الكتم، يمكنك التحدث الآن.`, null, { mentions: [user] })
        }
    }

    if (!global.spamTracker[uniqueId]) {
        global.spamTracker[uniqueId] = { count: 1, lastTime: Date.now() }
    } else {
        let timeDiff = Date.now() - global.spamTracker[uniqueId].lastTime
        if (timeDiff < 5000) global.spamTracker[uniqueId].count++
        else global.spamTracker[uniqueId].count = 1
        global.spamTracker[uniqueId].lastTime = Date.now()

        if (global.spamTracker[uniqueId].count >= 5) {
            global.mutedUsers[uniqueId] = Date.now() + 30000
            global.spamTracker[uniqueId].count = 0
            global.violationCounter[uniqueId] = 0
            await conn.sendMessage(chatId, { delete: m.key })
            return conn.reply(chatId, `${startDeco}\n🚫 *كتم تلقائي (سبام)*\n\nالعضو: @${user.split('@')[0]}\n⚠️ أي محاولة إرسال الآن ستعرضك للطرد 5 دقائق!\n${endDeco}`, m, { mentions: [user] })
        }
    }
}

handler.help = ['منع_سبام', 'فتح_سبام']
handler.tags = ['الـحـمـايـة 🛡️']
handler.command = /^(منع_سبام|فتح_سبام)$/i
handler.group = true
handler.admin = true
handler.bot = false

export default handler
