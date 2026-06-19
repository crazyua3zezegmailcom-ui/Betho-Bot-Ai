// حہּٰقَــــوٰقَ 𝐶𝑟𝑎𝑧𝑦 💻🔥
// ملف التحقق من إجابة لعبة فكك

export async function before(m) {
    let id = m.chat
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text || !/السؤال/i.test(m.quoted.text)) return !0
    
    this.tekateki = this.tekateki ? this.tekateki : {}
    if (!(id in this.tekateki)) return !0

    if (m.quoted.id == this.tekateki[id][0].id) {
        let json = JSON.parse(JSON.stringify(this.tekateki[id][1]))
        
        // التحقق من الإجابة (مع تجاهل المسافات وحالة الأحرف)
        if (m.text.toLowerCase().trim() == json.response.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += this.tekateki[id][2]
            
            await m.reply(`╭───≪ ⚙️ 𝑩𝒆𝒕𝒉𝒐 ⚙️ ≫───╮
│ ⌬ *_إجابة صحيحة مبروك ✨✅_*
│ 💰 *الجائزة:* ${this.tekateki[id][2]}xp
╯───≪ 🫐🪻🧩 ≫───╰`)
            
            clearTimeout(this.tekateki[id][3])
            delete this.tekateki[id]
        } else if (similarity(m.text.toLowerCase(), json.response.toLowerCase().trim()) >= 0.72) {
            await m.reply(`*قربت جداً! فاضل تكه وتجيبها صح 🤏*`)
        } else {
            // مفيش رد لو الإجابة غلط عشان ميزعجش الشات
        }
    }
    return !0
}

function similarity(a, b) {
    var lengthA = a.length;
    var lengthB = b.length;
    var distance = [];
    for (var i = 0; i <= lengthA; i++) distance[i] = [i];
    for (var j = 0; j <= lengthB; j++) distance[0][j] = j;
    for (var i = 1; i <= lengthA; i++) {
        for (var j = 1; j <= lengthB; j++) {
            var cost = (a.charAt(i - 1) === b.charAt(j - 1)) ? 0 : 1;
            distance[i][j] = Math.min(distance[i - 1][j] + 1, distance[i][j - 1] + 1, distance[i - 1][j - 1] + cost);
        }
    }
    return (1 - distance[lengthA][lengthB] / Math.max(lengthA, lengthB));
}