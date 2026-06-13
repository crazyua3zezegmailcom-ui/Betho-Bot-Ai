import axios from 'axios';
import cheerio from 'cheerio';
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

// الحقوق والستايل
const myCredit = `*_ 𝑩𝒆𝒕𝒉𝒐 𖠌 𝑩𝒐𝒕 _*`;
const emojis = `ＢＹ 𝐶𝑟𝑎𝑧𝑦 👑`;

// القائمة المحدثة بالأنماط الجديدة (17 نمط حالياً)
const styles = [
    { name: "سلفر 3D", url: "https://en.ephoto360.com/create-glossy-silver-3d-text-effect-online-802.html" },
    { name: "زهور اللبلاب", url: "https://en.ephoto360.com/typography-texture-online-nature-theme-342.html" },
    { name: "أجنحة الفضاء", url: "https://en.ephoto360.com/angel-wing-effect-329.html" },
    { name: "رسم حائط شوارع", url: "https://en.ephoto360.com/graffiti-text-3-179.html" },
    { name: "شعار الأسد والتاج", url: "https://en.ephoto360.com/royal-text-effect-online-free-471.html" },
    { name: "فراشة الكون", url: "https://en.ephoto360.com/write-galaxy-online-18.html" },
    { name: "سحب وطائرات", url: "https://en.ephoto360.com/create-a-cloud-text-effect-in-the-sky-618.html" },
    { name: "رسم حائط مميز", url: "https://en.ephoto360.com/graffiti-text-text-effect-online-178.html" },
    { name: "برواز ذهبي مودرن", url: "https://en.ephoto360.com/modern-gold-5-215.html" },
    { name: "دب غاضب", url: "https://en.ephoto360.com/free-bear-logo-photo-online-673.html" },
    { name: "داخل الماء", url: "https://en.ephoto360.com/underwater-text-73.html" },
    { name: "على الرمال", url: "https://en.ephoto360.com/write-names-and-messages-on-the-sand-online-582.html" },
    { name: "نيون بنفسجي X اخضر", url: "https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html" },
    { name: "إطار اخضر", url: "https://en.ephoto360.com/metal-text-effect-blue-174.html" },
    { name: "اخضر جذاب", url: "https://en.ephoto360.com/create-unique-word-green-light-63.html" },
    { name: "بناتي زهري X اسود", url: "https://en.ephoto360.com/create-a-blackpink-neon-logo-text-effect-online-710.html" },
    { name: "ألعاب نارية (شكر) 🫠", url: "https://en.ephoto360.com/text-firework-effect-356.html" },
    { name: "أوبس 3D", url: "https://en.ephoto360.com/create-online-3d-comic-style-text-effects-817.html" }
];

// دالة السكراب الحديدية
async function ephotoScraper(text, url) {
    const session = axios.create({
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
        }
    });

    const initialRes = await session.get(url);
    const cookie = initialRes.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
    const $ = cheerio.load(initialRes.data);
    
    const token = $('input[name="token"]').val();
    const build_server = $('input[name="build_server"]').val();
    const build_server_id = $('input[name="build_server_id"]').val();

    const formData = new URLSearchParams();
    formData.append('text[]', text);
    formData.append('token', token);
    formData.append('build_server', build_server);
    formData.append('build_server_id', build_server_id);

    const postRes = await session.post(url, formData.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookie }
    });

    const $2 = cheerio.load(postRes.data);
    let formValueInputStr = $2('input[name="form_value_input"]').val();
    
    if (!formValueInputStr) {
        const script = $2('script').filter((i, el) => $2(el).html()?.includes('form_value_input')).first().html();
        if (script) {
            const match = script.match(/name="form_value_input" value="([^"]+)"/);
            if (match) formValueInputStr = match[1];
        }
    }

    let formValueInput = JSON.parse(formValueInputStr);
    if (formValueInput.text) {
        formValueInput['text[]'] = formValueInput.text;
        delete formValueInput.text;
    }

    const finalRes = await session.post('https://en.ephoto360.com/effect/create-image', new URLSearchParams(formValueInput).toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookie }
    });

    let result = finalRes.data;
    let imageUrl = typeof result === 'string' ? JSON.parse(result).image : result.image;
    return imageUrl.startsWith('http') ? imageUrl : build_server + imageUrl;
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // التحقق من الاختيار من القائمة
    const args = text ? text.split('|') : [];
    if (args.length === 2 && !isNaN(args[0])) {
        let index = parseInt(args[0]);
        let name = args[1];
        let selected = styles[index];

        await m.reply(`*_ هـلا ⏳ _*\n\n*_ جـاري تـصـمـيـم نـمـط: ${selected.name} لـلاسـم: ${name} ... _*`);
        
        try {
            const img = await ephotoScraper(name, selected.url);
            return conn.sendMessage(m.chat, { 
                image: { url: img }, 
                caption: `*_ هـلا 🫠 _*\n\n*_ ✅ تـم الـتـصـمـيـم بـنـجـاح _*\n*_ 📝 الـنـص: ${name} _*\n*_ 🎨 الـنـمـط: ${selected.name} _*\n\n${emojis}\n\n${myCredit}` 
            }, { quoted: m });
        } catch (e) {
            return m.reply(`*_ هـلا ❌ فـشـل الـتـصـمـيـم، حـاول مـرة أخرى. _*`);
        }
    }

    // إذا لم يكتب الاسم
    if (!text) return m.reply(`*_ هـلا 🫠 _*\n\n*_ يـرجـى كـتـابـة الاسـم بـعـد الأمـر _*\n*_ مـثـال: ${usedPrefix + command} 𝐶𝑟𝑎𝑧𝑦 _*`);

    // تجهيز الصفوف
    const rows = styles.map((s, i) => ({
        header: `الـنـمـط ${i + 1}`,
        title: `᪥ ${s.name} ❅✬ ⭕`,
        id: `${usedPrefix + command} ${i}|${text}`
    }));

    // رسالة الأزرار الاحترافية
    let msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                    body: proto.Message.InteractiveMessage.Body.fromObject({
                        text: `*_ هـلا 🫠 _*\n\n*_ اخـتـر الـنـمـط الـجـديـد الـذي يـعـجـبـك لـلاسـم: ${text} _*`
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: myCredit }),
                    header: proto.Message.InteractiveMessage.Header.fromObject({
                        title: `*_ 🎨 أنـمـاط بـيـثو الـمـطـورة 🎨 _*`,
                        hasMediaAttachment: false
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                        buttons: [{
                            name: "single_select",
                            buttonParamsJson: JSON.stringify({
                                title: 'اخـتـر الـنـمـط مـن هـنـا 🍥',
                                sections: [{
                                    title: 'قـائـمـة الأقـسـام الـمـتـاحـة 🍡',
                                    rows: rows
                                }]
                            })
                        }]
                    })
                })
            }
        }
    }, { quoted: m });

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

handler.help = ['اسمي'];
handler.tags = ['photo'];
handler.command = /^(اسمي|name)$/i;

export default handler;