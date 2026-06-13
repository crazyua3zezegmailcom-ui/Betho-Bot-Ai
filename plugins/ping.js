import speed from "performance-now";
import { spawn, exec, execSync } from "child_process";
import { channelButton } from '../system/buttons.js'

let handler = async (m, { conn }) => {

  let timestamp = speed();
  let latensi = speed() - timestamp;
  exec(`neofetch --stdout`, (error, stdout, stderr) => {
    let child = stdout.toString("utf-8");
    let ssd = child.replace(/Memory:/, "Ram:");
    m.reply(`${ssd}乂  *السرعة* : ${latensi.toFixed(4)} _ms_`);
  });
  };
handler.help = ["سرعة-البوت"];
handler.tags = ["tools"];
handler.command = ["سرعة-البوت", "سرعة-الاتصال"];

export default handler;
