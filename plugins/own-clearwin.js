import { tmpdir } from "os";
import path, { join } from "path";
import {
  readdirSync,
  statSync,
  unlinkSync,
  existsSync,
  readFileSync,
  watch,
} from "fs";
import { channelButton } from '../system/buttons.js'
let handler = async (m, { conn, usedPrefix: _p, __dirname, args }) => {
  conn.reply(m.chat, "Succes !", m);

  const tmp = [tmpdir(), join(__dirname, "../tmp")];
  const filename = [];
  tmp.forEach((dirname) =>
    readdirSync(dirname).forEach((file) => filename.push(join(dirname, file))),
  );
  return filename.map((file) => {
    const stats = statSync(file);
    unlinkSync(file);
  });
};
handler.help = ["مسح-ويندوز"];
handler.tags = ["owner"];
handler.command = /^(مسح-ويندوز)$/i;

handler.rowner = true;

export default handler;
