import fs from 'fs'
import path from 'path'

const backupDir = path.join(process.cwd(), 'database')
const backupFile = path.join(backupDir, 'group_backups.json')

if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
}

if (!fs.existsSync(backupFile)) {
    fs.writeFileSync(backupFile, JSON.stringify({}), 'utf8')
}

const handler = async (m, { conn, text }) => {
    if (!m.isGroup) {
        return m.reply('❌ *هذا الأمر للمجموعات فقط*')
    }

    const args = text.trim().split(/\s+/)
    const action = args[0]?.toLowerCase()
    const name = args.slice(1).join(' ').trim()

    let backups = JSON.parse(
        fs.readFileSync(backupFile, 'utf8')
    )

    // =====================
    // عرض النسخ
    // =====================
    if (action === 'عرض') {
        const keys = Object.keys(backups)

        if (!keys.length) {
            return m.reply('📂 *لا توجد نسخ محفوظة*')
        }

        return m.reply(
`📦 *النسخ المحفوظة:*

${keys.map((v, i) => `${i + 1}. ${v}`).join('\n')}`
        )
    }

    // =====================
    // نسخ المجموعة
    // =====================
    if (action === 'نسخ') {
        if (!name) {
            return m.reply('❌ *اكتب اسم النسخة*\nمثال:\n.نسخة نسخ قروب1')
        }

        const metadata = await conn.groupMetadata(m.chat)

        // تحميل صورة المجموعة
        let profilePic = null
        try {
            profilePic = await conn.profilePictureUrl(m.chat, 'image')
        } catch {}

        backups[name] = {
            subject: metadata.subject,
            desc: metadata.desc || '',
            photo: profilePic
        }

        fs.writeFileSync(
            backupFile,
            JSON.stringify(backups, null, 2)
        )

        return m.reply(
`✅ *تم حفظ النسخة بنجاح*

📌 *الاسم:* ${name}
📝 *اسم المجموعة:* ${metadata.subject}`
        )
    }

    // =====================
    // لصق النسخة
    // =====================
    if (action === 'لصق') {
        if (!name) {
            return m.reply('❌ *حدد اسم النسخة*\nمثال:\n.نسخة لصق قروب1')
        }

        const data = backups[name]

        if (!data) {
            return m.reply('❌ *هذه النسخة غير موجودة*')
        }

        try {
            // تغيير الاسم
            if (data.subject) {
                await conn.groupUpdateSubject(
                    m.chat,
                    data.subject
                )
            }

            // تغيير الوصف
            if (data.desc) {
                await conn.groupUpdateDescription(
                    m.chat,
                    data.desc
                )
            }

            // تغيير الصورة
            if (data.photo) {
                const response = await fetch(data.photo)
                const buffer = Buffer.from(
                    await response.arrayBuffer()
                )

                await conn.updateProfilePicture(
                    m.chat,
                    buffer
                )
            }

            return m.reply(
`✅ *تم تطبيق النسخة بنجاح*

📌 *النسخة:* ${name}`
            )

        } catch (err) {
            console.error(err)

            return m.reply(
`❌ *فشل تطبيق النسخة*

${err.message}`
            )
        }
    }

    return m.reply(
`📌 *استخدام الأمر:*

◉ *.نسخة نسخ اسم*
لحفظ نسخة المجموعة

◉ *.نسخة لصق اسم*
لتطبيق نسخة محفوظة

◉ *.نسخة عرض*
لعرض النسخ`
    )
}

handler.help = ['نسخة']
handler.tags = ['group']
handler.command = /^نسخة$/i
handler.group = true
handler.admin = true

export default handler