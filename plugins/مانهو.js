// أمر مانهوا - AppSwat API (نسخة متوافقة مع handler.command)
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import axios from 'axios';
import sharp from 'sharp';
import os from 'os';
import baileys from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, prepareWAMessageMedia } = baileys;

// ==================== إعدادات API (كما هي) ====================
const AppSwatAPI = {
    config: {
        baseURL: "https://appswat.com/v2/api/v1",
        headers: {
            Accept: "application/json",
            "Accept-Charset": "UTF-8",
            "User-Agent": "ktor-client",
            "Accept-Encoding": "gzip"
        }
    },
    async request(path, options = {}) {
        const url = `${this.config.baseURL}${path}`;
        const res = await fetch(url, {
            method: options.method || "GET",
            headers: { ...this.config.headers, ...(options.headers || {}) },
            body: options.body ? JSON.stringify(options.body) : undefined
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    },
    buildQuery(params = {}) {
        const defaultParams = { page: 1, page_size: 100 };
        const finalParams = { ...defaultParams, ...params };
        const q = new URLSearchParams();
        Object.entries(finalParams).forEach(([k, v]) => { if (v !== undefined && v !== null) q.append(k, v); });
        return q.toString();
    },
    normalizeSeries(series) {
        return {
            id: series.id,
            title: series.title,
            slug: series.slug,
            type: series.type?.name,
            status: series.status?.name,
            genres: series.genres || [],
            poster: series.poster,
            rating: Number(series.rating) || series.rating,
            stats: { views: series.views_count, followers: series.followers_count, chapters: series.chapters_count },
            timestamps: { updatedAt: series.updated_at }
        };
    },
    normalizeChapter(chapter) {
        return {
            id: chapter.id,
            title: chapter.title,
            chapter: chapter.chapter,
            images: chapter.images || [],
            views: chapter.views_count,
            timestamps: { createdAt: chapter.created_at }
        };
    },
    normalizeReleases(item) {
        return {
            id: item.serie_id,
            title: item.title,
            genres: item.genres || [],
            poster: item.poster,
            rating: Number(item.rating) || item.rating,
            status: item.status?.name,
            latestChapters: (item.chapters || []).map(c => ({ id: c.id, title: c.title, chapter: c.chapter }))
        };
    },
    series: {
        async list(params = {}) {
            const q = AppSwatAPI.buildQuery(params);
            const res = await AppSwatAPI.request(`/series/?${q}`);
            return { ...res, results: res.results.map(AppSwatAPI.normalizeSeries.bind(AppSwatAPI)) };
        },
        async search(query, genreName = null, params = {}) {
            const searchParams = { ...params, search: query };
            if (genreName) {
                const genres = await AppSwatAPI.genres.list();
                const genre = genres.find(g => g.name.toLowerCase() === genreName.toLowerCase());
                if (!genre) throw new Error(`Genre not found: ${genreName}`);
                searchParams.genres = genre.id;
            }
            return this.list(searchParams);
        },
        async get(id) {
            const res = await AppSwatAPI.request(`/series/${id}/`);
            return AppSwatAPI.normalizeSeries(res);
        }
    },
    genres: {
        _cache: undefined,
        async list() {
            if (this._cache) return this._cache;
            const res = await AppSwatAPI.request("/genres/");
            this._cache = res;
            return res;
        }
    },
    releases: {
        async latest(params = {}) {
            const q = AppSwatAPI.buildQuery(params);
            const res = await AppSwatAPI.request(`/series/releases/?${q}`);
            return { ...res, results: res.results.map(AppSwatAPI.normalizeReleases.bind(AppSwatAPI)) };
        }
    },
    chapters: {
        async bySeries(seriesId, params = {}) {
            const q = AppSwatAPI.buildQuery({ serie: seriesId, ...params });
            const res = await AppSwatAPI.request(`/chapters/?${q}`);
            return { ...res, results: res.results.map(AppSwatAPI.normalizeChapter.bind(AppSwatAPI)) };
        },
        async get(id) {
            const res = await AppSwatAPI.request(`/chapters/${id}/`);
            return AppSwatAPI.normalizeChapter(res);
        }
    }
};

const DEFAULT_IMAGE = "https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg";
const footer = "🔏 AppSwat Manhwa 🔏";

// ==================== دوال مساعدة للواجهات ====================
async function sendInteractiveMessage(conn, m, message) {
    const msg = await generateWAMessageFromContent(
        m.chat,
        { viewOnceMessage: { message } },
        { userJid: conn.user.jid, quoted: m }
    );
    return conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}

async function sendList(conn, m, text, media, title, sections) {
    const mediaMessage = media
        ? await prepareWAMessageMedia({ image: { url: media } }, { upload: conn.waUploadToServer })
        : null;
    return sendInteractiveMessage(conn, m, {
        interactiveMessage: {
            body: { text },
            footer: { text: footer },
            header: mediaMessage ? { hasMediaAttachment: true, imageMessage: mediaMessage.imageMessage } : { hasMediaAttachment: false },
            nativeFlowMessage: {
                buttons: [{
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({ title, sections })
                }]
            }
        }
    });
}

function buildManhwaCaption(series) {
    return `🎬 *${series.title}*
---
🏷️ *النوع:* ${series.type || "-"}
🎞️ *الحالة:* ${series.status || "-"}
⭐ *التقييم:* ${series.rating} نجوم
📖 *الفصول:* ${series.stats.chapters}
👁️ *المشاهدات:* ${series.stats.views}
👥 *المتابعون:* ${series.stats.followers}
---
🏷️ *التصنيفات:* ${series.genres.map(g => g.name).join("، ")}
📅 *تاريخ التحديث:* ${new Date(series.timestamps.updatedAt).toLocaleDateString("ar-SA")}`;
}

function isJsonLikeString(str) {
    if (typeof str !== "string") return false;
    const s = str.trim();
    if (!s) return false;
    try {
        const parsed = JSON.parse(s);
        return typeof parsed === "object" && parsed !== null ? parsed : false;
    } catch { return false; }
}

// ==================== الأمر الرئيسي ====================
let handler = async (m, { conn, text, usedPrefix, command }) => {
    // رد فوري بتفاعل تحميل
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } }).catch(() => {});
    const reply = (t) => conn.sendMessage(m.chat, { text: t }, { quoted: m });

    try {
        // حالة 1: إذا كان النص يبدأ بـ { فهو JSON إما لاختيار سلسلة أو فصل
        const jsonData = isJsonLikeString(text);
        if (jsonData) {
            if (jsonData.type === "chapter") {
                // عرض فصل PDF
                const chapter = await AppSwatAPI.chapters.get(jsonData.id);
                if (!chapter.images?.length) return reply("❌ لا توجد صور لهذا الفصل.");
                await reply(`⏳ جاري تجهيز الفصل: *${chapter.title || "فصل " + chapter.chapter}*`);

                const pdfPath = path.join(os.tmpdir(), `chapter_${Date.now()}.pdf`);
                const doc = new PDFDocument({ autoFirstPage: false, margin: 0 });
                const stream = fs.createWriteStream(pdfPath);
                doc.pipe(stream);
                let addedPages = 0;
                for (const img of chapter.images) {
                    try {
                        const res = await axios.get(img.image, { responseType: "arraybuffer", timeout: 30000 });
                        const jpegBuffer = await sharp(res.data).jpeg({ quality: 55 }).toBuffer();
                        const { width, height } = await sharp(jpegBuffer).metadata();
                        if (!width || !height) continue;
                        doc.addPage({ size: [width, height], margins: { top: 0, bottom: 0, left: 0, right: 0 } });
                        doc.image(jpegBuffer, 0, 0, { width, height });
                        addedPages++;
                    } catch (err) { console.log(`فشل تحميل الصورة: ${img.image}`, err.message); }
                }
                if (addedPages === 0) { doc.destroy(); return reply("❌ فشل إنشاء PDF."); }
                doc.end();
                await new Promise((resolve, reject) => { stream.on("finish", resolve); stream.on("error", reject); });
                await conn.sendMessage(m.chat, {
                    document: { url: pdfPath },
                    mimetype: "application/pdf",
                    fileName: `${chapter.title || `chapter_${chapter.chapter}`}.pdf`
                }, { quoted: m });
                fs.unlink(pdfPath, () => {});
            } else {
                // افتراضي: اختيار سلسلة (مانهوا)
                const series = await AppSwatAPI.series.get(jsonData.id);
                const chaptersRes = await AppSwatAPI.chapters.bySeries(jsonData.id);
                if (!chaptersRes.results.length) return reply("😕 لا توجد فصول متاحة.");
                const caption = buildManhwaCaption(series);
                const rows = chaptersRes.results.map(cp => ({
                    header: `📅 ${new Date(cp.timestamps.createdAt).toLocaleDateString("ar-SA")}`,
                    title: cp.title || `الفصل ${cp.chapter}`,
                    description: `👁️ ${cp.views} مشاهدة`,
                    id: `${usedPrefix}${command} ${JSON.stringify({ type: "chapter", id: cp.id })}`
                }));
                const thumb = series.poster?.medium || series.poster?.thumbnail || DEFAULT_IMAGE;
                await sendList(conn, m, caption, thumb, "「 قائمة الفصول 」", [
                    { title: "📖 فصول المانهوا", highlight_label: footer, rows }
                ]);
            }
            return;
        }

        // حالة 2: الأمر مع نص (بحث)
        if (text && text.trim()) {
            await reply(`🔎 جاري البحث عن *"${text}"*...`);
            const res = await AppSwatAPI.series.search(text);
            if (!res.results || res.results.length === 0) return reply("😕 لم يتم العثور على نتائج.");
            const rows = res.results.slice(0, 20).map(item => ({
                header: `🎬 ${item.title}`,
                title: `التقييم: ${item.rating || "0"}`,
                description: item.genres.map(g => g.name).join("، "),
                id: `${usedPrefix}${command} ${JSON.stringify({ id: item.id })}`
            }));
            const thumb = res.results[0]?.poster?.medium || res.results[0]?.poster?.thumbnail || DEFAULT_IMAGE;
            await sendList(conn, m, `📖 *نتائج البحث عن:* ${text}\nاختر مانهوا من القائمة:`, thumb, "「 نتائج البحث 」", [
                { title: "🔍 مانهوات مشابهة", highlight_label: footer, rows }
            ]);
            return;
        }

        // حالة 3: الأمر بدون نص → عرض آخر التحديثات
        const releases = await AppSwatAPI.releases.latest();
        const rows = releases.results.slice(0, 15).map(item => ({
            header: `⭐ ${item.title}`,
            title: `الحالة: ${item.status || "مستمر"}`,
            description: item.genres.map(g => g.name).join("، "),
            id: `${usedPrefix}${command} ${JSON.stringify({ id: item.id })}`
        }));
        await sendList(conn, m, "👋 أهلًا بك في *AppSwat Manhwa*!\n\nاختر مانهوا من القائمة أو ابحث باسمها.", DEFAULT_IMAGE, "「 آخر التحديثات 」", [
            { title: "🆕 مانهوات أضيفت حديثاً", highlight_label: footer, rows }
        ]);

    } catch (err) {
        console.error(err);
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => {});
        await reply(`❌ حدث خطأ: ${err.message}`);
    }
};

handler.command = /^(مانهوا|منهو)$/i;
handler.help = ['مانهوا <اسم>', 'منهو'];
handler.tags = ['manhwa'];
export default handler;