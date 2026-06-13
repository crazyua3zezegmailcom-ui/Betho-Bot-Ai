import { channelButton } from '../system/buttons.js'
const handler = async (m, { conn }) => {

	if (!m.quoted) {
		return m.reply("Reply to viewOnce message");
	}

	const quoted = m.quoted;
	const isViewOnce = Object.keys(quoted?.message || {})
		.map((key) => quoted?.message[key]?.viewOnce)
		.includes(true);

	if (!isViewOnce) {
		return m.reply("Reply to viewOnce message");
	}

	const buffer = await m?.quoted?.download?.().catch(() => {});
	const media = m?.quoted?.mediaMessage[m?.quoted?.mediaType];
	const mtype = media?.mimetype;
	const isImage = /image/.test(mtype) ? "image" : "video";
	const isMedia = isImage || false;

	conn.sendMessage(
		m.chat,
		{
			...(isMedia && { [isMedia]: buffer }),
			...(media?.caption && { caption: media?.caption }),
		},
		{ quoted: m }
	);
	};

handler.help = ["قراءة-مرة-واحدة"];
handler.tags = ["tools"];
handler.command = ["قراءة-مرة-واحدة", "rvo"];
handler.limit = true 
export default handler;
