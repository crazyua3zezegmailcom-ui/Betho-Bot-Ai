// الأمر: .لمطور <رقم> أو بالرد على رسالة الشخص
// يضيف الرقم إلى قائمة المالكين (global.owner) في ملف settings.js (الموجود في الجذر الرئيسي للبوت)

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// المسار الصحيح لملف settings.js الموجود في الجذر الرئيسي للبوت
const settingsPath = path.join(process.cwd(), 'settings.js')

const handler = async (m, { conn, text, usedPrefix, command, isOwner }) => {
    // التحقق من أن المستخدم هو مالك حالي
    if (!isOwner) {
        return m.reply(`❌ *أمر خاص بالمطورين فقط*`)
    }

    // استخراج الرقم المستهدف
    let targetNumber = ''
    if (m.quoted) {
        // إذا كان هناك رد على رسالة، نأخذ رقم المرسل الأصلي لتلك الرسالة
        targetNumber = m.quoted.sender.split('@')[0]
    } else if (text) {
        // استخراج الرقم من النص (إزالة كل ما ليس رقمًا)
        let cleaned = text.replace(/[^0-9]/g, '')
        if (cleaned.length >= 10) {
            targetNumber = cleaned
        }
    }

    if (!targetNumber) {
        return m.reply(`🍃 *طريقة الاستخدام:*\n\n${usedPrefix + command} 201214057674\nأو رد على رسالة الشخص وأرسل ${usedPrefix + command}\nأو منشن الشخص`)
    }

    // التأكد من أن الرقم ليس موجودًا بالفعل
    const currentOwners = global.owner || []
    if (currentOwners.includes(targetNumber)) {
        return m.reply(`✅ *الرقم ${targetNumber} موجود بالفعل في قائمة المطورين.*`)
    }

    try {
        // قراءة محتوى ملف settings.js
        let settingsContent = fs.readFileSync(settingsPath, 'utf8')
        
        // البحث عن سطر global.owner = [...]
        const ownerRegex = /(global\.owner\s*=\s*\[)([^\]]*)(\])/s
        const match = settingsContent.match(ownerRegex)
        
        if (!match) {
            return m.reply('❌ لم يتم العثور على قائمة المطورين في ملف settings.js')
        }
        
        let before = match[1]
        let arrayContent = match[2].trim()
        let after = match[3]
        
        // بناء المصفوفة الجديدة
        let newArrayContent
        if (arrayContent === '') {
            newArrayContent = `"${targetNumber}"`
        } else {
            // إضافة الرقم الجديد مع فاصلة
            newArrayContent = `${arrayContent}, "${targetNumber}"`
        }
        
        const newLine = `${before}${newArrayContent}${after}`
        const updatedContent = settingsContent.replace(ownerRegex, newLine)
        
        // كتابة الملف
        fs.writeFileSync(settingsPath, updatedContent, 'utf8')
        
        // تحديث global.owner في الذاكرة الحالية
        global.owner.push(targetNumber)
        
        // رد بنجاح
        await m.reply(`✅ *تمت إضافة الرقم بنجاح إلى قائمة المطورين*\n📌 *الرقم:* ${targetNumber}\n🔄 *أعد تشغيل البوت إذا لزم الأمر*`)
        
        // إرسال إشعار للمطورين الحاليين
        for (let owner of global.owner) {
            if (owner !== targetNumber) {
                await conn.sendMessage(owner + '@s.whatsapp.net', { text: `➕ *تمت إضافة مطور جديد*\n👤 *الرقم:* ${targetNumber}\n📝 *بواسطة:* ${m.sender.split('@')[0]}` }).catch(() => {})
            }
        }
        
    } catch (err) {
        console.error(err)
        m.reply(`❌ *حدث خطأ أثناء تعديل الملف:*\n${err.message}`)
    }
}

handler.help = ['لمطور']
handler.tags = ['owner']
handler.command = /^(لمطور|addowner)$/i
handler.rowner = true  // يمنع استخدامه إلا من قبل المطورين الحاليين

export default handler