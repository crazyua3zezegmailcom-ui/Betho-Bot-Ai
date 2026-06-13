import { channelButton } from '../system/buttons.js'
let handler = async (m, { conn, command }) => {
    if (!conn.muted) conn.muted = {};
    if (!conn.muted[m.chat]) conn.muted[m.chat] = [];

    try {
        let who;
        if (m.quoted) {
            who = m.message.extendedTextMessage.contextInfo.participant;
        } else {
            throw 'رد على رسالة المستخدم الذي تريد كتمه';
        }
        
        if (command === 'كتم') {
            if (conn.muted[m.chat].includes(who)) {
                throw 'المستخدم مكتوم بالفعل!';
            }
            conn.muted[m.chat].push(who);
            m.reply(`✅ تم كتم المستخدم بنجاح`);
        } else if (command === 'رفع-كتم') {
            if (!conn.muted[m.chat].includes(who)) {
                throw 'المستخدم غير مكتوم!';
            }
            let index = conn.muted[m.chat].indexOf(who);
            conn.muted[m.chat].splice(index, 1);
            m.reply(`✅ تم رفع الكتم عن المستخدم بنجاح`);
        }
    } catch (e) {
        m.reply(e);
    }
};

handler.before = async (m, { conn }) => {
    if (!m.isGroup) return;
    if (!conn.muted?.[m.chat]) return;
    
    if (conn.muted[m.chat].includes(m.sender)) {
        try {
            await conn.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: m.key.id,
                    participant: m.sender
                }
            });
        } catch (error) {
            console.log('Error deleting message:', error);
        }
    }
};

handler.help = ['كتم', 'رفع-كتم'];
handler.tags = ['owner'];
handler.command = /^(كتم|رفع-كتم)$/i;
handler.botAdmin = true;
handler.admin = true;
handler.group = true;
handler.owner = true;
export default handler;
