import axios from "axios"

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply("فين النص؟")
    let { 
data: { message }} = await axios.get("https://itadori-x-adam-api.vercel.app/home/sections/Ai/api/api/v1/chats/simi", {
        params: {
            q: text,
            lang: "ar"
        }
    })
    await conn.sendMessage(m.chat, { text: message || "!" }, { quoted: m })
}

handler.help = ["سمسم"]
handler.command = ["سمسم", "سمسمي"]

export default handler