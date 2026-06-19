/**
 * 📂 القرآن-قران.js - سكريبت تحميل القرآن الكريم MP3 (بالكامل)
 * 👤 الأمر : قران
 * 👨🏻‍💻 (𝑻𝒂𝒊𝒃 بواسطة)
 * 🎯 𝐕𝐢𝐭𝐨 𝐂𝐨𝐫𝐥𝐞𝐨𝐧𝐞 𝐁𝐎𝐓 𝐕𝟐
 */

import pkg from "@whiskeysockets/baileys";
const { generateWAMessageFromContent, prepareWAMessageMedia } = pkg;
import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

// صورة القسم الافتراضية (في حالة فشل الجلب)
let DEFAULT_IMAGE_URL = "https://i.postimg.cc/5NkJJV6H/IMG-20260610-WA0080.jpg";

// تخزين صور السور في الكاش (لتجنب الجلب المتكرر)
const surahImagesCache = new Map();

// تخزين جلسات المستخدمين
const userSessions = new Map();

// ========== جلب صورة غلاف السورة من موقع المصطبة ==========
async function fetchSurahImage(surahNumber, surahName) {
    // التحقق من وجود الصورة في الكاش
    if (surahImagesCache.has(surahNumber)) {
        console.log(`📸 استخدام صورة ${surahName} من الكاش`);
        return surahImagesCache.get(surahNumber);
    }
    
    try {
        console.log(`📸 جلب صورة سورة ${surahName} (${surahNumber})...`);
        
        // بناء رابط صفحة السورة
        const surahNameEn = getSurahName(surahNumber);
        const url = `https://almstba.com/surah-${surahNameEn}-mp3/`.toLowerCase();
        
        console.log(`🌐 جلب من: ${url}`);
        
        const { data } = await axios.get(url, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml',
                'Accept-Language': 'ar,en;q=0.9'
            },
            timeout: 15000
        });
        
        const $ = cheerio.load(data);
        let surahImage = null;
        
        // محاولة جلب الصورة من عدة مصادر
        
        // 1. من meta property="og:image"
        const ogImage = $('meta[property="og:image"]').attr('content');
        if (ogImage && ogImage.startsWith('http') && (ogImage.includes('.jpg') || ogImage.includes('.png') || ogImage.includes('.jpeg'))) {
            surahImage = ogImage;
            console.log(`✅ تم العثور على صورة من og:image`);
        }
        
        // 2. من meta name="twitter:image"
        if (!surahImage) {
            const twitterImage = $('meta[name="twitter:image"]').attr('content');
            if (twitterImage && twitterImage.startsWith('http')) {
                surahImage = twitterImage;
                console.log(`✅ تم العثور على صورة من twitter:image`);
            }
        }
        
        // 3. من الصورة المميزة في المقال
        if (!surahImage) {
            const featuredImage = $('.wp-post-image').attr('src') || $('.featured-image img').attr('src');
            if (featuredImage && featuredImage.startsWith('http')) {
                surahImage = featuredImage;
                console.log(`✅ تم العثور على صورة من wp-post-image`);
            }
        }
        
        // 4. من أي صورة داخل المقال (حجم مناسب)
        if (!surahImage) {
            const articleImage = $('.entry-content img').first().attr('src');
            if (articleImage && articleImage.startsWith('http') && articleImage.includes('wp-content/uploads')) {
                surahImage = articleImage;
                console.log(`✅ تم العثور على صورة من entry-content`);
            }
        }
        
        // 5. صورة افتراضية حسب رقم السورة (بديل)
        if (!surahImage) {
            // استخدام صورة من PostImages أو خدمة مشابهة مع إسم السورة
            surahImage = `https://i.postimg.cc/Fsx4fvfK/IMG-20260610-WA0075.jpg`;
            console.log(`⚠️ لم يتم العثور على صورة، استخدام الافتراضية`);
        }
        
        // تخزين الصورة في الكاش
        surahImagesCache.set(surahNumber, surahImage);
        console.log(`✅ تم حفظ صورة سورة ${surahName} في الكاش`);
        
        return surahImage;
        
    } catch (error) {
        console.error(`❌ خطأ في جلب صورة سورة ${surahName}:`, error.message);
        return DEFAULT_IMAGE_URL;
    }
}

// ========== جلب صورة القسم العامة ==========
async function fetchSectionImage() {
    try {
        console.log(`📡 جلب صورة القسم...`);
        
        const { data } = await axios.get('https://almstba.com/islam/', {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml',
                'Accept-Language': 'ar,en;q=0.9'
            },
            timeout: 10000
        });
        
        const $ = cheerio.load(data);
        
        let sectionImage = null;
        
        const imgSelectors = [
            'meta[property="og:image"]',
            'link[rel="image_src"]',
            '.wp-post-image',
            '.featured-image img',
            'img'
        ];
        
        for (const selector of imgSelectors) {
            if (selector.startsWith('meta')) {
                const metaImg = $(selector).attr('content');
                if (metaImg && metaImg.startsWith('http') && metaImg.includes('almstba.com')) {
                    sectionImage = metaImg;
                    break;
                }
            } else {
                const imgTag = $(selector).first();
                if (imgTag.length) {
                    const imgSrc = imgTag.attr('data-src') || imgTag.attr('src');
                    if (imgSrc && imgSrc.startsWith('http') && imgSrc.includes('almstba.com')) {
                        sectionImage = imgSrc;
                        break;
                    }
                }
            }
        }
        
        if (!sectionImage) {
            const iconImg = $('link[rel="icon"]').attr('href');
            if (iconImg && iconImg.startsWith('http')) {
                sectionImage = iconImg;
            } else {
                sectionImage = DEFAULT_IMAGE_URL;
            }
        }
        
        DEFAULT_IMAGE_URL = sectionImage;
        console.log(`✅ تم تحديث صورة القسم: ${DEFAULT_IMAGE_URL}`);
        
        return DEFAULT_IMAGE_URL;
        
    } catch (error) {
        console.error(`❌ خطأ في جلب الصورة:`, error.message);
        return DEFAULT_IMAGE_URL;
    }
}

// ========== جلب قائمة سور القرآن ==========
async function fetchSurahs() {
    try {
        console.log(`📡 جلب قائمة سور القرآن...`);
        
        const surahNames = [
            'الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة', 'الأنعام', 'الأعراف', 'الأنفال', 'التوبة', 'يونس',
            'هود', 'يوسف', 'الرعد', 'إبراهيم', 'الحجر', 'النحل', 'الإسراء', 'الكهف', 'مريم', 'طه',
            'الأنبياء', 'الحج', 'المؤمنون', 'النور', 'الفرقان', 'الشعراء', 'النمل', 'القصص', 'العنكبوت', 'الروم',
            'لقمان', 'السجدة', 'الأحزاب', 'سبأ', 'فاطر', 'يس', 'الصافات', 'ص', 'الزمر', 'غافر',
            'فصلت', 'الشورى', 'الزخرف', 'الدخان', 'الجاثية', 'الأحقاف', 'محمد', 'الفتح', 'الحجرات', 'ق',
            'الذاريات', 'الطور', 'النجم', 'القمر', 'الرحمن', 'الواقعة', 'الحديد', 'المجادلة', 'الحشر', 'الممتحنة',
            'الصف', 'الجمعة', 'المنافقون', 'التغابن', 'الطلاق', 'التحريم', 'الملك', 'القلم', 'الحاقة', 'المعارج',
            'نوح', 'الجن', 'المزمل', 'المدثر', 'القيامة', 'الإنسان', 'المرسلات', 'النبأ', 'النازعات', 'عبس',
            'التكوير', 'الانفطار', 'المطففين', 'الانشقاق', 'البروج', 'الطارق', 'الأعلى', 'الغاشية', 'الفجر', 'البلد',
            'الشمس', 'الليل', 'الضحى', 'الشرح', 'التين', 'العلق', 'القدر', 'البينة', 'الزلزلة', 'العاديات',
            'القارعة', 'التكاثر', 'العصر', 'الهمزة', 'الفيل', 'قريش', 'الماعون', 'الكوثر', 'الكافرون', 'النصر',
            'المسد', 'الإخلاص', 'الفلق', 'الناس'
        ];
        
        const surahs = [];
        for (let i = 1; i <= 114; i++) {
            surahs.push({
                number: i,
                name: surahNames[i - 1],
                nameAr: surahNames[i - 1]
            });
        }
        
        console.log(`✅ تم جلب ${surahs.length} سورة`);
        return surahs;
        
    } catch (error) {
        console.error(`❌ خطأ في جلب السور:`, error.message);
        const surahs = [];
        for (let i = 1; i <= 114; i++) {
            surahs.push({ number: i, name: i.toString(), nameAr: i.toString() });
        }
        return surahs;
    }
}

// ========== جلب قائمة القراء ==========
async function fetchReciters(surahNumber) {
    try {
        console.log(`📡 جلب قائمة القراء لسورة ${surahNumber}...`);
        
        const surahName = getSurahName(surahNumber);
        const url = `https://almstba.com/surah-${surahName}-mp3/`.toLowerCase();
        
        let reciters = [];
        
        try {
            console.log(`🌐 محاولة جلب: ${url}`);
            const { data } = await axios.get(url, {
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'text/html,application/xhtml+xml',
                    'Accept-Language': 'ar,en;q=0.9'
                },
                timeout: 15000
            });
            
            const $ = cheerio.load(data);
            
            const table = $('#NewTable');
            
            if (table.length) {
                console.log(`✅ تم العثور على الجدول #NewTable`);
                
                const rows = table.find('tbody tr, tr');
                
                rows.each((i, row) => {
                    const firstCell = $(row).find('th').first();
                    if (firstCell.length && firstCell.text().trim() === '#') {
                        return;
                    }
                    
                    const cells = $(row).find('td');
                    
                    if (cells.length >= 3) {
                        const number = $(cells[0]).text().trim();
                        const name = $(cells[1]).text().trim();
                        const size = $(cells[2]).text().trim();
                        
                        let downloadLink = null;
                        
                        let linkElement = $(cells[2]).find('a');
                        if (linkElement.length) {
                            downloadLink = linkElement.attr('href');
                        }
                        
                        if (!downloadLink && cells.length >= 4) {
                            linkElement = $(cells[3]).find('a');
                            if (linkElement.length) {
                                downloadLink = linkElement.attr('href');
                            }
                        }
                        
                        if (name && name.length > 2 && downloadLink && downloadLink.includes('.mp3')) {
                            reciters.push({
                                id: number || i.toString(),
                                name: name,
                                size: size || 'غير محدد',
                                url: downloadLink
                            });
                            console.log(`   ✓ تم إضافة: ${name}`);
                        }
                    }
                });
            } else {
                console.log(`⚠️ لم يتم العثور على #NewTable في الصفحة`);
                
                const anyTable = $('table:has(a[href*=".mp3"])');
                if (anyTable.length) {
                    console.log(`✅ تم العثور على جدول بديل`);
                    const rows = anyTable.find('tr');
                    
                    rows.each((i, row) => {
                        const cells = $(row).find('td');
                        if (cells.length >= 2) {
                            const name = $(cells[0]).text().trim() || $(cells[1]).text().trim();
                            const linkElement = $(row).find('a[href*=".mp3"]');
                            const downloadLink = linkElement.attr('href');
                            const size = $(cells).filter((_, cell) => $(cell).text().includes('MB') || $(cell).text().includes('KB')).first().text().trim();
                            
                            if (name && name.length > 2 && downloadLink) {
                                reciters.push({
                                    id: i.toString(),
                                    name: name,
                                    size: size || 'غير محدد',
                                    url: downloadLink
                                });
                            }
                        }
                    });
                }
            }
        } catch (e) {
            console.log(`❌ خطأ في جلب صفحة السورة ${surahNumber}: ${e.message}`);
        }
        
        console.log(`✅ تم جلب ${reciters.length} قارئ لسورة ${surahNumber}`);
        
        if (reciters.length === 0) {
            console.log(`⚠️ استخدام القائمة الافتراضية للقراء`);
            reciters = [
                { id: '1', name: 'أبو بكر الشاطري', size: '9.12 MB', url: `https://server11.mp3quran.net/shatri/${String(surahNumber).padStart(3, '0')}.mp3` },
                { id: '2', name: 'أحمد الحواشي', size: '9.10 MB', url: `https://server11.mp3quran.net/hawashi/${String(surahNumber).padStart(3, '0')}.mp3` },
                { id: '3', name: 'أحمد الطرابلسي', size: '11.47 MB', url: `https://server10.mp3quran.net/trablsi/${String(surahNumber).padStart(3, '0')}.mp3` },
                { id: '4', name: 'إدريس أبكر', size: '11.36 MB', url: `https://server6.mp3quran.net/abkr/${String(surahNumber).padStart(3, '0')}.mp3` },
                { id: '5', name: 'أحمد العجمي', size: '5.02 MB', url: `https://server10.mp3quran.net/ajm/64/${String(surahNumber).padStart(3, '0')}.mp3` },
                { id: '6', name: 'توفيق الصايغ', size: '9.84 MB', url: `https://server6.mp3quran.net/twfeeq/${String(surahNumber).padStart(3, '0')}.mp3` },
                { id: '7', name: 'حاتم فريد الواعر', size: '12.22 MB', url: `https://server11.mp3quran.net/hatem/${String(surahNumber).padStart(3, '0')}.mp3` },
                { id: '8', name: 'خليفة الطنيجي', size: '4.28 MB', url: `https://server12.mp3quran.net/tnjy/${String(surahNumber).padStart(3, '0')}.mp3` },
                { id: '9', name: 'سعد الغامدي', size: '4.34 MB', url: `https://server7.mp3quran.net/s_gmd/${String(surahNumber).padStart(3, '0')}.mp3` },
                { id: '10', name: 'سعود الشريم', size: '6.55 MB', url: `https://server7.mp3quran.net/shur/${String(surahNumber).padStart(3, '0')}.mp3` }
            ];
        }
        
        return reciters;
        
    } catch (error) {
        console.error(`❌ خطأ في جلب القراء:`, error.message);
        return [];
    }
}

// ========== الحصول على اسم السورة بالرابط ==========
function getSurahName(number) {
    const surahNames = {
        1: 'al-fatihah', 2: 'al-baqarah', 3: 'aal-imran', 4: 'an-nisa', 5: 'al-maidah',
        6: 'al-anam', 7: 'al-araf', 8: 'al-anfal', 9: 'at-tawbah', 10: 'yunus',
        11: 'hud', 12: 'yusuf', 13: 'ar-rad', 14: 'ibrahim', 15: 'al-hijr',
        16: 'an-nahl', 17: 'al-isra', 18: 'al-kahf', 19: 'maryam', 20: 'ta-ha',
        21: 'al-anbiya', 22: 'al-hajj', 23: 'al-muminun', 24: 'an-nur', 25: 'al-furqan',
        26: 'ash-shuara', 27: 'an-naml', 28: 'al-qasas', 29: 'al-ankabut', 30: 'ar-room',
        31: 'luqman', 32: 'as-sajdah', 33: 'al-ahzab', 34: 'saba', 35: 'fatir',
        36: 'ya-sin', 37: 'as-saffat', 38: 'sad', 39: 'az-zumar', 40: 'ghafir',
        41: 'fussilat', 42: 'ash-shura', 43: 'az-zukhruf', 44: 'ad-dukhan', 45: 'al-jathiyah',
        46: 'al-ahqaf', 47: 'muhammad', 48: 'al-fath', 49: 'al-hujurat', 50: 'qaf',
        51: 'adh-dhariyat', 52: 'at-tur', 53: 'an-najm', 54: 'al-qamar', 55: 'ar-rahman',
        56: 'al-waqiah', 57: 'al-hadid', 58: 'al-mujadilah', 59: 'al-hashr', 60: 'al-mumtahanah',
        61: 'as-saff', 62: 'al-jumuah', 63: 'al-munafiqun', 64: 'at-taghabun', 65: 'at-talaq',
        66: 'at-tahrim', 67: 'al-mulk', 68: 'al-qalam', 69: 'al-haqqah', 70: 'al-maarij',
        71: 'nuh', 72: 'al-jinn', 73: 'al-muzzammil', 74: 'al-muddaththir', 75: 'al-qiyamah',
        76: 'al-insan', 77: 'al-mursalat', 78: 'an-naba', 79: 'an-naziat', 80: 'abasa',
        81: 'at-takwir', 82: 'al-infitar', 83: 'al-mutaffifin', 84: 'al-inshiqaq', 85: 'al-buruj',
        86: 'at-tariq', 87: 'al-ala', 88: 'al-ghashiyah', 89: 'al-fajr', 90: 'al-balad',
        91: 'ash-shams', 92: 'al-layl', 93: 'ad-duha', 94: 'ash-sharh', 95: 'at-teen',
        96: 'al-alaq', 97: 'al-qadr', 98: 'al-bayyinah', 99: 'az-zalzalah', 100: 'al-adiyat',
        101: 'al-qariah', 102: 'at-takathur', 103: 'al-asr', 104: 'al-humazah', 105: 'al-fil',
        106: 'quraish', 107: 'al-maun', 108: 'al-kawthar', 109: 'al-kafirun', 110: 'an-nasr',
        111: 'al-masad', 112: 'al-ikhlas', 113: 'al-falaq', 114: 'an-nas'
    };
    return surahNames[number] || number.toString();
}

// ========== تحميل ملف MP3 وإرساله ==========
async function downloadAndSendMp3(conn, m, mp3Url, surahName, reciterName, fileSize) {
    await m.react('⏳');
    
    try {
        console.log(`📥 تحميل: ${mp3Url}`);
        
        const response = await axios({
            method: 'GET',
            url: mp3Url,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Referer': 'https://almstba.com/'
            },
            timeout: 120000
        });
        
        const tempFilePath = path.join('/tmp', `${Date.now()}.mp3`);
        const writer = fs.createWriteStream(tempFilePath);
        
        response.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
        
        const fileStats = fs.statSync(tempFilePath);
        const fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(2);
        
        if (fileStats.size > 16 * 1024 * 1024) {
            fs.unlinkSync(tempFilePath);
            await m.reply(`❌ الملف كبير جداً (${fileSizeMB} MB). الحد الأقصى 16 MB.\n\nيمكنك الاستماع مباشرة:\n${mp3Url}`);
            await m.react('⚠️');
            return false;
        }
        
        const caption = `📖 *سورة ${surahName}*\n🎙️ *القارئ:* ${reciterName}\n📊 *الحجم:* ${fileSizeMB} MB\n✨ استمع وتدبر`;
        
        await conn.sendMessage(m.chat, {
            audio: fs.readFileSync(tempFilePath),
            mimetype: 'audio/mpeg',
            fileName: `سورة_${surahName}_${reciterName}.mp3`,
            ptt: false,
            caption: caption
        }, { quoted: m });
        
        fs.unlinkSync(tempFilePath);
        await m.react('✅');
        return true;
        
    } catch (error) {
        console.error('❌ خطأ في التحميل:', error.message);
        await m.react('❌');
        await m.reply(`❌ فشل تحميل سورة ${surahName}\nقد يكون الرابط معطلاً.`);
        return false;
    }
}

// ========== إرسال قائمة السور ==========
async function sendSurahsList(conn, m, page = 1) {
    const surahs = await fetchSurahs();
    const itemsPerPage = 15;
    const startIdx = (page - 1) * itemsPerPage;
    const endIdx = Math.min(startIdx + itemsPerPage, surahs.length);
    const currentSurahs = surahs.slice(startIdx, endIdx);
    const totalPages = Math.ceil(surahs.length / itemsPerPage);
    
    const surahRows = currentSurahs.map((surah) => ({
        title: `${surah.number}. سورة ${surah.nameAr}`,
        description: `📖 اختر هذه السورة`,
        id: `.قران-اختيار-سورة ${surah.number}`
    }));
    
    const navRows = [];
    
    if (page < totalPages) {
        navRows.push({
            title: "📖 الصفحة التالية",
            description: `عرض السور ${endIdx + 1}-${Math.min(endIdx + itemsPerPage, surahs.length)}`,
            id: `.قران-سور-التالي`
        });
    }
    
    if (page > 1) {
        navRows.push({
            title: "📖 الصفحة السابقة",
            description: `عرض السور ${startIdx - itemsPerPage + 1}-${startIdx}`,
            id: `.قران-سور-السابق`
        });
    }
    
    const allRows = [...surahRows, ...navRows];
    
    const messageText = `🕋 *القرآن الكريم* 🕋\n📄 *الصفحة ${page} من ${totalPages}* (${startIdx + 1}-${endIdx})\n\n *اختر السورة التي تريد تحميلها:*`;
    
    if (!DEFAULT_IMAGE_URL) {
        await fetchSectionImage();
    }
    
    try {
        const media = await prepareWAMessageMedia(
            { image: { url: DEFAULT_IMAGE_URL } },
            { upload: conn.waUploadToServer }
        );
        
        const msg = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            header: { hasMediaAttachment: true, imageMessage: media.imageMessage },
                            body: { text: messageText },
                            footer: { text: `📿 القرآن الكريم 𝐕𝐢𝐭𝐨 𝐁𝐎𝐓 𝐕𝟐` },
                            nativeFlowMessage: {
                                buttons: [{
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "📖 سور القرآن",
                                        sections: [{ title: "اختر السورة", rows: allRows }]
                                    })
                                }]
                            }
                        }
                    }
                }
            },
            { userJid: conn.user.jid, quoted: m }
        );
        
        const userId = m.sender;
        if (!userSessions.has(userId)) {
            userSessions.set(userId, new Map());
        }
        userSessions.get(userId).set('surahPage', page);
        
        return conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
        
    } catch (error) {
        console.error('خطأ:', error);
        let textMsg = messageText + '\n';
        currentSurahs.forEach((surah) => {
            textMsg += `\n${surah.number}. سورة ${surah.nameAr}`;
        });
        textMsg += `\n\n📝 للاختيار: .قران-اختيار-سورة رقم_السورة`;
        return m.reply(textMsg);
    }
}

// ========== إرسال قائمة القراء لسورة محددة مع صورة غلاف السورة ==========
async function sendRecitersList(conn, m, surahNumber, surahName) {
    await m.react('⏳');
    
    // ✅ جلب صورة غلاف السورة المميزة
    const surahImage = await fetchSurahImage(surahNumber, surahName);
    
    const reciters = await fetchReciters(surahNumber);
    
    if (reciters.length === 0) {
        await m.react('❌');
        return m.reply(`❌ لا يوجد قراء متاحين لسورة ${surahName}`);
    }
    
    const userId = m.sender;
    if (!userSessions.has(userId)) {
        userSessions.set(userId, new Map());
    }
    userSessions.get(userId).set('selectedSurah', { number: surahNumber, name: surahName });
    
    // عرض جميع القراء
    const reciterRows = reciters.map((reciter, index) => ({
        title: `${index + 1}. ${reciter.name}`,
        description: `📥 ${reciter.size} - تحميل MP3`,
        id: `.قران-تحميل ${reciter.id}|${surahNumber}|${surahName}|${encodeURIComponent(reciter.url)}|${encodeURIComponent(reciter.name)}`
    }));
    
    const navRows = [
        {
            title: "🏠 العودة إلى قائمة السور",
            description: "اختيار سورة أخرى",
            id: `.قران`
        }
    ];
    
    const allRows = [...reciterRows, ...navRows];
    
    const messageText = `🎙️ *اختيار القارئ* 🎙️\n📖 *السورة:* ${surahName}\n📊 *عدد القراء:* ${reciters.length} قارئ\n\n *اختر القارئ الذي تريد الاستماع إليه:*`;
    
    try {
        // ✅ استخدام صورة غلاف السورة المميزة بدلاً من الصورة العامة
        const media = await prepareWAMessageMedia(
            { image: { url: surahImage } },
            { upload: conn.waUploadToServer }
        );
        
        const msg = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            header: { hasMediaAttachment: true, imageMessage: media.imageMessage },
                            body: { text: messageText },
                            footer: { text: `📿 سورة ${surahName}` },
                            nativeFlowMessage: {
                                buttons: [{
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "🎙️ قائمة القراء",
                                        sections: [{ title: "اختر القارئ", rows: allRows }]
                                    })
                                }]
                            }
                        }
                    }
                }
            },
            { userJid: conn.user.jid, quoted: m }
        );
        
        return conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
        
    } catch (error) {
        console.error('خطأ:', error);
        let textMsg = messageText + '\n';
        reciters.forEach((reciter, i) => {
            textMsg += `\n${i + 1}. ${reciter.name} - ${reciter.size}`;
        });
        textMsg += `\n\n📝 للتحميل: .قران-تحميل رقم_القارئ|${surahNumber}|${surahName}`;
        return m.reply(textMsg);
    }
}

// ========== تحميل MP3 مباشرة ==========
async function handleDirectDownload(conn, m, reciterId, surahNumber, surahName, fileUrl, reciterName) {
    await m.react('⏳');
    
    const decodedUrl = decodeURIComponent(fileUrl);
    const decodedReciterName = decodeURIComponent(reciterName);
    
    await downloadAndSendMp3(conn, m, decodedUrl, surahName, decodedReciterName, null);
}

// ========== الصفحة التالية من السور ==========
async function nextSurahsPage(conn, m) {
    const userId = m.sender;
    const currentPage = (userSessions.get(userId) && userSessions.get(userId).get('surahPage')) || 1;
    const nextPage = currentPage + 1;
    
    await sendSurahsList(conn, m, nextPage);
}

// ========== الصفحة السابقة من السور ==========
async function prevSurahsPage(conn, m) {
    const userId = m.sender;
    const currentPage = (userSessions.get(userId) && userSessions.get(userId).get('surahPage')) || 1;
    const prevPage = currentPage - 1;
    
    if (prevPage < 1) {
        await m.react('❌');
        return m.reply(`❌ هذه هي الصفحة الأولى`);
    }
    
    await sendSurahsList(conn, m, prevPage);
}

// ========== معالج الأوامر الرئيسي ==========
let handler = async (m, { conn, text, command }) => {
    
    if (!DEFAULT_IMAGE_URL) {
        await fetchSectionImage();
    }
    
    if ((command === "قران" || command === "quran") && !text) {
        await sendSurahsList(conn, m, 1);
        return;
    }
    
    if (command === "قران-اختيار-سورة") {
        const surahNumber = parseInt(text);
        if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
            await m.react('❌');
            return m.reply(`❌ رقم السورة غير صحيح (1-114)`);
        }
        
        const surahs = await fetchSurahs();
        const surah = surahs.find(s => s.number === surahNumber);
        const surahName = surah ? surah.nameAr : surahNumber.toString();
        
        await sendRecitersList(conn, m, surahNumber, surahName);
        return;
    }
    
    if (command === "قران-سور-التالي") {
        await nextSurahsPage(conn, m);
        return;
    }
    
    if (command === "قران-سور-السابق") {
        await prevSurahsPage(conn, m);
        return;
    }
    
    if (command === "قران-تحميل") {
        const parts = text.split('|');
        if (parts.length >= 5) {
            const reciterId = parts[0];
            const surahNumber = parseInt(parts[1]);
            const surahName = parts[2];
            const fileUrl = parts[3];
            const reciterName = parts[4];
            
            await handleDirectDownload(conn, m, reciterId, surahNumber, surahName, fileUrl, reciterName);
        } else {
            await m.react('❌');
            return m.reply(`❌ حدث خطأ في رابط التحميل`);
        }
        return;
    }
};

handler.help = ['قران', 'quran'];
handler.tags = ['القرآن', 'quran'];
handler.command = [
    'قران', 
    'quran',
    'قران-اختيار-سورة',
    'قران-سور-التالي',
    'قران-سور-السابق',
    'قران-تحميل'
];

export default handler;