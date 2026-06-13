// حہּٰقَــــوٰقَ 𝐶𝑟𝑎𝑧𝑦 💻🔥
// أمر حذف الرسائل بالزخرفة المطلوبة

const handler = async (m, { conn, isAdmin, isBotAdmin }) => {
  const quoted = m.quoted;

  // 1. التحقق من وجود رسالة مقتبسة
  if (!quoted) {
    return conn.reply(m.chat, '❌ *رد على الرسالة التي تريد حذفها!*', m);
  }

  // 2. التحقق من صلاحيات البوت
  if (!isBotAdmin) {
    return conn.reply(m.chat, '❌ *يجب أن يكون البوت مشرفاً ليتمكن من الحذف!*', m);
  }

  try {
    // 3. حذف الرسالة المقتبسة
    await conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: quoted.id.startsWith('BAE5') && quoted.id.length === 16,
        id: quoted.id,
        participant: quoted.sender
      }
    });

    // 4. حذف أمر ".حذف" نفسه ليبقى الشات نظيفاً
    await conn.sendMessage(m.chat, { delete: m.key });

    // 5. إرسال تأكيد بالزخرفة الجديدة
    let msg = `╗═══≪ 🌿🍉🍡 ≫═══╔
🗑️ *تم الحذف بنجاح*

𓆩⃞🍒𓆪 *الحالة:* تم التطهير ✅
𓆩⃞🍇𓆪 *بواسطة:* @${m.sender.split('@')[0]}

✨ *الشات الآن نظيف*
╝═══≪ 🌿🍉🍡 ≫═══╚`;

    const confirmation = await conn.sendMessage(m.chat, { 
        text: msg, 
        mentions: [m.sender] 
    });

    // 6. حذف رسالة التأكيد بعد 5 ثواني تلقائياً
    setTimeout(async () => {
      await conn.sendMessage(m.chat, { delete: confirmation.key });
    }, 5000);

  } catch (e) {
    console.error('Error:', e);
    await conn.reply(m.chat, '❌ *حصل خطأ، قد لا أملك صلاحية حذف هذه الرسالة.*', m);
  }
};

handler.help = ['حذف'];
handler.tags = ['group'];
handler.command = /^حذف$/i;

handler.group = true; 
handler.admin = true; 
handler.botAdmin = true; 

export default handler;