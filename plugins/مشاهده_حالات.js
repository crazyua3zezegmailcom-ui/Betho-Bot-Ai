/**
 * 👁️ Auto Status Saw & React — مايلز
 * ⏤͟͞ू⃪𝑴𝑰𝑳𝜩𝑺 ͝ 𝑩𝜣𝑻🕷
 */

const emojis = ['👽', '🕷', '🐸', '🌿', '🔥', '🍷', '🕸', '🐦'];

let handler = m => m;

handler.all = async function (m) {
    // التحقق مما إذا كانت الرسالة عبارة عن تحديث حالة (Status)
    if (m.key && m.key.remoteJid === 'status@broadcast') {
        
        // 1. قراءة الحالة (مشاهدة)
        await this.readMessages([m.key]);

        // 2. اختيار إيموجي عشوائي من القائمة
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        // 3. التفاعل مع الحالة (Reaction)
        // ملاحظة: التفاعل مع الحالة يتطلب إرسال إيموجي كـ "رد" (Reply) على الحالة
        try {
            await this.sendMessage('status@broadcast', {
                react: {
                    text: randomEmoji,
                    key: m.key
                }
            }, { statusJidList: [m.key.participant] });
            
            console.log(`✅ تم مشاهدة حالة ${m.pushName} والتفاعل بـ ${randomEmoji}`);
        } catch (e) {
            // في حال لم يدعم إصدار المكتبة التفاعل المباشر، يكتفي بالمشاهدة
            console.error('Error reacting to status:', e);
        }
    }
}

export default handler;