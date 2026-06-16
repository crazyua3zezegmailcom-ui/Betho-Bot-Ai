// م࣬ــࢪحہּٰـبٚأ بٚـڪٰٖ فَــي أوٰأم࣬ـࢪ بيثو ؍ 🌸♡゙ ُ𓂁
// أوٰأم࣬ــࢪ م࣬ٺم࣬يــژۿ . ⊹
// حہּٰقَــــوٰقَ 𝐶𝑟𝑎𝑧𝑦 𝒅𝒆𝒗 🐦☕
// أݪــسٰࢪقَــۿ ݪأ ٺــفَـيډڪٰٖ يم࣬غٰــفَݪ
// أسٰـم࣬ أݪأم࣬ــࢪ تحميل-مكتبات.js
// ٺـأࢪيخَ صَـنٰأـ؏ٚـۿ أݪــبٚوٰٺ ؍ 🌸♡゙ ُ𓂁 2024_9_22
// ࢪأبٚــطَ قَنٰــأۿ أݪم࣬ــطَــوٰࢪ ..)✘🖤🧸.
// https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e

import cp, {exec as _exec} from 'child_process';
import {promisify} from 'util';
const exec = promisify(_exec).bind(cp);
const handler = async (m, {conn, isOwner, command, text, usedPrefix, args, isROwner}) => {
  if (!isROwner) return;
  if (global.conn.user.jid != conn.user.jid) return;
  m.reply('\n*˼‏※⪤˹͟͞≽⌯⧽°⸂◞🖤◜⸃°⧼⌯≼˹͟͞⪤※˹⌝*\n_⌈⌞🐺⌝⌋ اتقل عبقال ما اخلص _\n*⌞˼‏※⪤˹͟͞≽⌯⧽°⸂◞🖤◜⸃°⧼⌯≼˹͟͞⪤※˹⌝*');
  let o;
  try {
    o = await exec(command.trimStart() + ' ' + text.trimEnd());
  } catch (e) {
    o = e;
  } finally {
    const {stdout, stderr} = o;
    if (stdout.trim()) m.reply(stdout);
    if (stderr.trim()) m.reply(stderr);
  }
};
handler.customPrefix = /^[$]/;
handler.command = new RegExp;
export default handler;