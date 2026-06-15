// حہּٰقَــــوٰقَ 𝐶𝑟𝑎𝑧𝑦 💻🔥
let handler = async (m, { conn, text, usedPrefix, command, isOwner }) => {
    conn.rps = conn.rps ? conn.rps : {}
    let id = m.chat
    let room = conn.rps[id]
    
    // أرقام المطورين للطوارئ
    const devNumbers = ['201201756710', '584168100105'];
    const isDev = isOwner || devNumbers.some(num => m.sender.includes(num));

    // --- 1. فتح الغرفة ---
    if (command === 'مقص') {
        if (room) return conn.reply(m.chat, `╭───≪ 🍒 𝑩𝒆𝒕𝒉𝒐 🍇 ≫───╮\n│ ⌬ *_هناك تحدي قائم بالفعل!_* ⏳\n╯───≪ 🌿🍉🍡 ≫───╰`, m)
        conn.rps[id] = {
            id,
            creator: m.sender,
            p1: m.sender,
            p2: null,
            state: 'waiting',
            p1Choice: null,
            p2Choice: null
        }
        let capt = `.𓏲⋆˙⏤͟͞ू⃪𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢⃝⃕𝆺𝅥𝆹𝅥
🍒 𝑩𝒆𝒕𝒉𝒐 🍇
𝐵𝑦 𝐶𝑟𝑎𝑧𝑦

╭───≪ 🍒 𝑩𝒆𝒕𝒉𝒐 🍇 ≫───╮
│ ⌬ *تحدي:* حجرة - ورقة - مقص 🎮
│ 
│ ⌬ *المنشئ:* @${m.sender.split`@` [0]}
│ ⌬ *الحالة:* في انتظار خصم...
│ 
│ ⌬ *للانضمام:* .شارك
│ ⌬ *لإلغاء الغرفة:* .شيل
╯───≪ 🌿🍉🍡 ≫───╰`.trim()
        return conn.reply(m.chat, capt, m, { mentions: [m.sender] })
    }

    // --- 2. إلغاء الغرفة (شيل) ---
    if (command === 'شيل') {
        if (!room) return conn.reply(m.chat, `╭───≪ 🍒 𝑩𝒆𝒕𝒉𝒐 🍇 ≫───╮\n│ ⌬ *_لا توجد غرفة نشطة حالياً!_* ❌\n╯───≪ 🌿🍉🍡 ≫───╰`, m)
        if (m.sender === room.creator || isDev) {
            delete conn.rps[id]
            return conn.reply(m.chat, `╭───≪ 🍒 𝑩𝒆𝒕𝒉𝒐 🍇 ≫───╮\n│ ⌬ *_تم إلغاء التحدي بنجاح 🗑️_* \n╯───≪ 🌿🍉🍡 ≫───╰`, m)
        } else {
            return conn.reply(m.chat, `╭───≪ 🍒 𝑩𝒆𝒕𝒉𝒐 🍇 ≫───╮\n│ ⌬ *_عذراً، المنشئ فقط من يمكنه الإلغاء!_* 🚫\n╯───≪ 🌿🍉🍡 ≫───╰`, m)
        }
    }

    // --- 3. الانضمام (شارك) ---
    if (command === 'شارك') {
        if (!room) return conn.reply(m.chat, `╭───≪ 🍒 𝑩𝒆𝒕𝒉𝒐 🍇 ≫───╮\n│ ⌬ *_لا توجد غرفة، اكتب .مقص للبدء!_* 📯\n╯───≪ 🌿🍉🍡 ≫───╰`, m)
        if (room.state !== 'waiting') return conn.reply(m.chat, `╭───≪ 🍒 𝑩𝒆𝒕𝒉𝒐 🍇 ≫───╮\n│ ⌬ *_بدأت اللعبة بالفعل يا بطل!_* 🏁\n╯───≪ 🌿🍉🍡 ≫───╰`, m)
        if (room.p1 === m.sender) return conn.reply(m.chat, `╭───≪ 🍒 𝑩𝒆𝒕𝒉𝒐 🍇 ≫───╮\n│ ⌬ *_أنت صاحب التحدي بالفعل!_* ✅\n╯───≪ 🌿🍉🍡 ≫───╰`, m)
        
        room.p2 = m.sender
        room.state = 'choosing'
        
        conn.reply(m.chat, `╭───≪ 🍒 𝑩𝒆𝒕𝒉𝒐 🍇 ≫───╮\n│ ⌬ *_تم قبول التحدي! 🤝_* \n│ ⌬ *تفقدوا الخاص للاختيار* 📩\n╯───≪ 🌿🍉🍡 ≫───╰`, m)

        let players = [room.p1, room.p2]
        for (let jid of players) {
            await conn.sendMessage(jid, { 
                text: `╭───≪ 🍒 𝑩𝒆𝒕𝒉𝒐 🍇 ≫───╮\n│ ⌬ *لعبة حجرة ورقة مقص* 🎮\n│ \n│ ⌬ *أرسل اختيارك الآن:* \n│ ( حجرة - ورقة - مقص )\n╯───≪ 🌿🍉🍡 ≫───╰`
            })
        }
    }
}

handler.before = async function (m, { conn }) {
    this.rps = this.rps ? this.rps : {}
    
    if (!m.isGroup) {
        let room = Object.values(this.rps).find(r => (r.p1 === m.sender || r.p2 === m.sender) && r.state === 'choosing')
        if (!room) return

        let choice = m.text.trim().toLowerCase()
        let validChoices = ['حجرة', 'ورقة', 'مقص']
        
        if (!validChoices.includes(choice)) return m.reply(`╭───≪ 🍒 𝑩𝒆𝒕𝒉𝒐 🍇 ≫───╮\n│ ⌬ *_يرجى اختيار كلمة صحيحة!_* ❌\n╯───≪ 🌿🍉🍡 ≫───╰`)

        if (m.sender === room.p1) {
            if (room.p1Choice) return m.reply(`╭───≪ 🍒 𝑩𝒆𝒕𝒉𝒐 🍇 ≫───╮\n│ ⌬ *_لقد اخترت بالفعل، انتظر خصمك!_* ✅\n╯───≪ 🌿🍉🍡 ≫───╰`)
            room.p1Choice = choice
        } else {
            if (room.p2Choice) return m.reply(`╭───≪ 🍒 𝑩𝒆𝒕𝒉𝒐 🍇 ≫───╮\n│ ⌬ *_لقد اخترت بالفعل، انتظر خصمك!_* ✅\n╯───≪ 🌿🍉🍡 ≫───╰`)
            room.p2Choice = choice
        }
        
        m.reply(`╭───≪ 🍒 𝑩𝒆𝒕𝒉𝒐 🍇 ≫───╮\n│ ⌬ *تم تسجيل اختيارك:* ${choice} ✨\n│ ⌬ *عد للمجموعة لرؤية النتيجة* 🏃\n╯───≪ 🌿🍉🍡 ≫───╰`)

        if (room.p1Choice && room.p2Choice) {
            let p1 = room.p1
            let p2 = room.p2
            let c1 = room.p1Choice
            let c2 = room.p2Choice
            let result = ''

            if (c1 === c2) {
                result = `🤝 *تعادل!* كلاهما اختار ${c1}`
            } else if (
                (c1 === 'حجرة' && c2 === 'مقص') ||
                (c1 === 'مقص' && c2 === 'ورقة') ||
                (c1 === 'ورقة' && c2 === 'حجرة')
            ) {
                result = `🏆 *الفائز:* @${p1.split`@` [0]}\n💀 *الخاسر:* @${p2.split`@` [0]}\n\n✨ *${c1}* سحق *${c2}*`
            } else {
                result = `🏆 *الفائز:* @${p2.split`@` [0]}\n💀 *الخاسر:* @${p1.split`@` [0]}\n\n✨ *${c2}* سحق *${c1}*`
            }

            await conn.reply(room.id, `╭───≪ 🍒 𝑩𝒆𝒕𝒉𝒐 🍇 ≫───╮\n│ 🏁 *انتهت الجولة الملكية!* \n│ \n│ ⌬ @${p1.split`@` [0]}: ${c1}\n│ ⌬ @${p2.split`@` [0]}: ${c2}\n│ \n│ ${result}\n╯───≪ 🌿🍉🍡 ≫───╰`, null, { mentions: [p1, p2] })
            delete this.rps[room.id]
        }
        return
    }
}

handler.help = ['مقص']
handler.tags = ['العاب']
handler.command = /^(مقص|شارك|شيل)$/i
handler.group = true

export default handler