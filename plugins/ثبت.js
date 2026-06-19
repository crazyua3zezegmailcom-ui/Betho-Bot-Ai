import { exec } from 'child_process'
import util from 'util'

const execute = util.promisify(exec)

const packages = [
    'syntax-error'
]

const progressBar = (current, total) => {
    const size = 10
    const done = Math.floor((current / total) * size)
    const left = size - done
    return '█'.repeat(done) + '░'.repeat(left)
}

const handler = async (m) => {
    let msg = await m.reply(
`🔧 *بدأ تثبيت المكتبات المطلوبة...*

${progressBar(0, packages.length)} 0%

⏳ *الرجاء الانتظار...*`
    )

    let installed = 0
    let failed = []

    for (const pkg of packages) {
        try {
            await execute(`npm install ${pkg}`)

            installed++

            const percent = Math.floor(
                (installed / packages.length) * 100
            )

            await m.reply(
`📦 *جاري التثبيت...*

📥 *تم تثبيت:* ${pkg}

${progressBar(installed, packages.length)} ${percent}%`
            )

        } catch (err) {
            failed.push(pkg)
        }
    }

    if (failed.length) {
        return m.reply(
`⚠️ *انتهى التثبيت مع أخطاء*

✅ *تم تثبيت:* ${installed}/${packages.length}

❌ *فشل:*
${failed.join('\n')}`
        )
    }

    await m.reply(
`✅ *تم تثبيت جميع المكتبات بنجاح*

${progressBar(packages.length, packages.length)} 100%

📦 *المكتبات المثبتة:*
${packages.join('\n')}

🔄 *يفضل إعادة تشغيل البوت*`
    )
}

handler.help = ['ثبت']
handler.tags = ['owner']
handler.command = /^ثبت$/i
handler.rowner = true

export default handler