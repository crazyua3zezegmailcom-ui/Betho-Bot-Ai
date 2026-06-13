import { channelButton } from '../system/buttons.js'
const handler = async (m, { conn }) => {

  const channel = "120363428186936884@newsletter"

  // تأكد أن الرسالة تحتوي على فيديو
  let msg = m.quoted ? m.quoted : m
  let mime = (msg.msg || msg).mimetype || ""

  if (!mime.startsWith("video"))
    return m.reply("⚠️ Please send or reply to a video")

  // تحميل الفيديو
  let media = await msg.download()

  // إرسال كـ PTV
  await conn.sendMessage(channel, {
    video: media,
    mimetype: "video/mp4",
    ptv: true
  })

  m.reply("✅ Video sent as PTV successfully")
  }

handler.command = ["ارسال-لقناة-ptv"]
handler.owner = true

export default handler
