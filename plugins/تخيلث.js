// تخيل3.js - حل مشكلة Cloudflare باستخدام puppeteer-extra
import fs from 'fs';
import fetch from 'node-fetch';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const COOKIE_FILE = './aifree_cookies.json';
const API_URL = 'https://aifreeforever.com/api/generate-image';

// دالة للحصول على كوكيز صالحة (تشغل متصفح مرة واحدة وتخزن)
async function getValidCookies() {
    // إذا كان ملف الكوكيز موجودًا وحديثًا (أقل من ساعة)، استخدمه
    if (fs.existsSync(COOKIE_FILE)) {
        const stats = fs.statSync(COOKIE_FILE);
        const now = Date.now();
        const age = now - stats.mtimeMs;
        if (age < 3600000) { // أقل من ساعة
            const cookies = JSON.parse(fs.readFileSync(COOKIE_FILE, 'utf8'));
            console.log('✅ استخدام كوكيز مخزنة من جلسة سابقة');
            return cookies;
        }
    }
    
    console.log('🌐 جاري تشغيل المتصفح لحل تحدي Cloudflare...');
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        await page.goto('https://aifreeforever.com/image-generators', { 
            waitUntil: 'networkidle2',
            timeout: 60000 
        });
        
        // انتظر حتى يختفي تحدي Cloudflare (أو حتى يظهر المحتوى)
        await page.waitForFunction(
            () => !document.body.innerHTML.includes('Just a moment...'),
            { timeout: 60000 }
        );
        
        // الحصول على جميع الكوكيز
        const cookies = await page.cookies();
        await browser.close();
        
        // تخزين الكوكيز للاستخدام المستقبلي
        fs.writeFileSync(COOKIE_FILE, JSON.stringify(cookies, null, 2));
        console.log('✅ تم حفظ كوكيز جديدة');
        return cookies;
        
    } catch (err) {
        await browser.close();
        throw new Error(`فشل تجاوز Cloudflare: ${err.message}`);
    }
}

// دالة لتحويل الكوكيز من صيغة puppeteer إلى صيغة fetch
function formatCookiesForFetch(cookies) {
    return cookies.map(c => `${c.name}=${c.value}`).join('; ');
}

// دالة إنشاء الصورة باستخدام الكوكيز المخزنة
async function generateImage(prompt) {
    const cookies = await getValidCookies();
    const cookieString = formatCookiesForFetch(cookies);
    
    // أولاً: جلب nonce
    const nonceRes = await fetch('https://aifreeforever.com/api/chat-nonce', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36',
            'Cookie': cookieString,
            'Accept': 'application/json',
            'Origin': 'https://aifreeforever.com',
            'Referer': 'https://aifreeforever.com/image-generators'
        }
    });
    const { nonce } = await nonceRes.json();
    if (!nonce) throw new Error('فشل جلب nonce');
    
    // تحضير payload (محاكاة أداة البايثون)
    const current_time = Date.now();
    const start_time = current_time - 15000;
    const totalTypingTime = 8000;
    
    const payload = {
        prompt: prompt,
        resolution: '1:1',
        style: 'default',
        interactionProof: {
            nonce: nonce,
            keystrokeCount: prompt.length,
            pasteEvents: 0,
            totalTypingTime: totalTypingTime,
            startTime: start_time,
            submitTime: current_time,
            captchaVerifiedAt: current_time - 2000
        }
    };
    
    // إرسال طلب التوليد
    const genRes = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36',
            'Cookie': cookieString,
            'Content-Type': 'application/json',
            'Origin': 'https://aifreeforever.com',
            'Referer': 'https://aifreeforever.com/image-generators'
        },
        body: JSON.stringify(payload)
    });
    
    const data = await genRes.json();
    const imageUrl = data.imageUrl || data.images?.[0];
    if (!imageUrl) throw new Error('لا يوجد رابط صورة في الرد');
    return imageUrl;
}

// ============= الأمر الرئيسي =============
const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`🎨 *أمر إنشاء الصور - حل Cloudflare*

الاستخدام:
${usedPrefix + command} وصف الصورة

مثال:
${usedPrefix + command} نهر انمي صافي

📌 ملاحظة: المرة الأولى قد تستغرق 30-60 ثانية لتجاوز التحدي.`);
    }
    
    await m.reply('🔄 جاري تجاوز حماية Cloudflare وإنشاء الصورة... قد تستغرق المرة الأولى دقيقة.');
    
    try {
        let prompt = text;
        if (prompt.toLowerCase().includes('anime') && !prompt.includes('#minimax')) {
            prompt += ' #minimax';
        }
        
        const imageUrl = await generateImage(prompt);
        
        await conn.sendMessage(m.chat, {
            image: { url: imageUrl },
            caption: `✅ *تم إنشاء الصورة بنجاح!*\n📝 *الوصف:* ${text}\n🔗 [رابط مباشر](${imageUrl})`
        }, { quoted: m });
        
        await m.react('✅');
        
    } catch (err) {
        console.error(err);
        await m.reply(`❌ *فشل إنشاء الصورة*\n${err.message}\n\nإذا استمر الخطأ، احذف ملف ${COOKIE_FILE} وأعد المحاولة.`);
        await m.react('❌');
    }
};

handler.command = /^(تخيل3)$/i;
handler.help = ['تخيل3'];
handler.tags = ['ai'];

export default handler;