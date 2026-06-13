// instagram.com/𝐶𝑟𝑎𝑧𝑦_ouafy
import fs from "fs";
import { channelButton } from '../system/buttons.js'

let handler = async (m, { conn }) => {

  let dir = fs.readdirSync("./plugins");
  if (dir.length < 1) return m.reply("No plugin files found.");

  let teks = "\n";
  for (let e of dir) {
    teks += `* ${e}\n`;
  }
  m.reply(teks);
  };

handler.command = ["قائمة-الاضافات"];
handler.help = ["قائمة-الاضافات"];
handler.tags= ["infobot"];
export default handler;
