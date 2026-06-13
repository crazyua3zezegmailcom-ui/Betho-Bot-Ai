import { channelButton } from '../system/buttons.js'
let handler = async (m, {conn, text, config}) => {
    if (!text) return m.reply('where is the text ?');

    // Fallback for missing config.cenel
    const channelId = config?.cenel?.id || '120363428186936884@newsletter';
    const channelName = config?.cenel?.name || 'صلي  على النبي 😄';

    await conn.sendMessage(channelId, {
        text: text,
        contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 9999, 
            isForwarded: true, 
            forwardedNewsletterMessageInfo: {
                newsletterJid: channelId,
                serverMessageId: 20,
                newsletterName: channelName
            },
            externalAdReply: {
                title: "𝐶𝑟𝑎𝑧𝑦 Ouafy", 
                body: "هذه رسالة من بيثو الذكية | Betho Bot BOT",
                sourceUrl: null,
                mediaType: 1
            }
        }
    });

    m.reply('send successfully 😁');
}

handler.help = handler.command = ['ارسال-للقناة'];
handler.tags = ['owner'];
handler.owner = true
export default handler;
