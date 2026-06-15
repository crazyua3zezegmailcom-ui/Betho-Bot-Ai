import { WAMessageStubType } from '@whiskeysockets/baileys'
import chalk from 'chalk'
import { watchFile } from 'fs'
import os from 'os'
import { execSync } from 'child_process'

const terminalImage = global.opts['img'] ? require('terminal-image') : ''
const urlRegex = (await import('url-regex-safe')).default({ strict: false })

// دالة لجلب معلومات النظام
function getSystemInfo() {
  // معلومات الذاكرة (RAM)
  const totalMem = os.totalmem() / (1024 ** 3)
  const freeMem = os.freemem() / (1024 ** 3)
  const usedMem = totalMem - freeMem

  // معلومات المعالج (CPU)
  const cpus = os.cpus()
  const cpuModel = cpus[0]?.model || 'Unknown'
  const cpuCores = cpus.length

  // معلومات التخزين (القرص الرئيسي)
  let diskTotal = 0, diskUsed = 0
  try {
    const df = execSync('df -BG / | tail -1 | awk \'{print $2, $3}\'').toString().trim()
    const [total, used] = df.split(' ').map(v => parseFloat(v.replace('G', '')))
    diskTotal = total || 0
    diskUsed = used || 0
  } catch (e) {
    // إذا فشل الأمر، نستخدم قيمة افتراضية
    diskTotal = 0
    diskUsed = 0
  }

  return {
    ramUsed: usedMem.toFixed(2),
    ramTotal: totalMem.toFixed(2),
    cpu: `${cpuModel} (${cpuCores} cores)`,
    diskUsed: diskUsed.toFixed(2),
    diskTotal: diskTotal.toFixed(2)
  }
}

export default async function (m, conn = { user: {} }) {
  // تجاهل رسائل البروتوكول الداخلية (تشفير، مزامنة، إلخ)
  if (m.mtype === 'protocolMessage' || m.mtype === 'senderKeyDistributionMessage' || m.mtype === 'protocolMessage' || !m.mtype) return

  let _name = await conn.getName(m.sender)
  let sender = '+' + m.sender.replace('@s.whatsapp.net', '') + (_name ? ' ~ ' + _name : '')
  let chat = await conn.getName(m.chat)
  let img
  try {
    if (global.opts['img'])
      img = /sticker|image/gi.test(m.mtype) ? await terminalImage.buffer(await m.download()) : false
  } catch (e) {
    console.error(e)
  }

  let filesize = (m.msg ?
    m.msg.vcard ? m.msg.vcard.length :
    m.msg.fileLength ? m.msg.fileLength.low || m.msg.fileLength :
    m.msg.axolotlSenderKeyDistributionMessage ? m.msg.axolotlSenderKeyDistributionMessage.length :
    m.text ? m.text.length : 0
    : m.text ? m.text.length : 0) || 0

  let user = global.db.data.users[m.sender]
  let chatName = chat ? (m.isGroup ? 'Group ~ ' + chat : 'Private ~ ' + chat) : ''
  let me = '+' + (conn.user?.jid || '').replace('@s.whatsapp.net', '')
  const userName = conn.user.name || conn.user.verifiedName || "Unknown"
  const sys = getSystemInfo()

  // تجميع سطور المربع مع إضافة سطر المطور
  const lines = [
    chalk.yellow('∘₊✧──────🌹──────✧₊∘'),
    chalk.yellow('┊') + ' ' + chalk.green.bold('Devloper') + ' : ' + chalk.red.bold('by 𝐶𝑟𝑎𝑧𝑦'),
    chalk.yellow('∘₊✧──────🌹──────✧₊∘'),
    chalk.yellow('┊') + ' ' + chalk.green.bold(`Bot: BETHO BOT (${me})`),
    chalk.yellow('┊') + ' ' + chalk.green.bold(`RAM: ${sys.ramUsed}GB / ${sys.ramTotal}GB`),
    chalk.yellow('┊') + ' ' + chalk.green.bold(`CPU: ${sys.cpu}`),
    chalk.yellow('┊') + ' ' + chalk.green.bold(`Storage: ${sys.diskUsed}GB / ${sys.diskTotal}GB`),
    chalk.yellow('┊') + ' ' + chalk.white.bold(`Date: ${new Date(m.messageTimestamp ? 1000 * (m.messageTimestamp.low || m.messageTimestamp) : Date.now()).toLocaleDateString("en-US", { timeZone: "America/Mexico_City", day: 'numeric', month: 'long', year: 'numeric' })}`),
    chalk.yellow('┊') + ' ' + chalk.white.bold(`Event type: ${m.messageStubType ? WAMessageStubType[m.messageStubType] : 'None'}`),
    chalk.yellow('┊') + ' ' + chalk.white.bold(`Message size: ${filesize} B [${(filesize / 1000 ** Math.floor(Math.log(filesize) / Math.log(1000))).toFixed(1)} ${['B', 'KB', 'MB', 'GB', 'TB'][Math.floor(Math.log(filesize) / Math.log(1000))] || ''}]`),
    chalk.yellow('┊') + ' ' + chalk.red.bold(`Sender: ${sender}`),
    chalk.yellow('┊') + ' ' + chalk.white.bold(`Chat ${m.isGroup ? 'Group' : 'Private'}: ${chat}`),
    chalk.yellow('┊') + ' ' + chalk.white.bold(`Message type: ${m.mtype ? m.mtype.replace(/message$/i, '').replace('audio', m.msg?.ptt ? 'PTT' : 'audio').replace(/^./, v => v.toUpperCase()) : 'Unknown'}`),
    chalk.yellow('∘₊✧──────🌹──────✧₊∘')
  ]

  // طباعة المربع
  console.log(lines.join('\n'))

  if (img) console.log(img.trimEnd())

  if (typeof m.text === 'string' && m.text) {
    let log = m.text.replace(/\u200e+/g, '')
    let mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~`])(?!`)(.+?)\1|```((?:.|[\n\r])+?)```|`([^`]+?)`)(?=\S?(?:[\s\n]|$))/g
    let mdFormat = (depth = 4) => (_, type, text, monospace) => {
      let types = {
        '_': 'italic',
        '*': 'bold',
        '~': 'strikethrough',
        '`': 'bgGray'
      }
      text = text || monospace
      let formatted = !types[type] || depth < 1 ? text : chalk[types[type]](text.replace(/`/g, '').replace(mdRegex, mdFormat(depth - 1)))
      return formatted
    }
    log = log.replace(mdRegex, mdFormat(4))
    log = log.split('\n').map(line => {
      if (line.trim().startsWith('>')) {
        return chalk.bgGray.dim(line.replace(/^>/, '┃'))
      } else if (/^([1-9]|[1-9][0-9])\./.test(line.trim())) {
        return line.replace(/^(\d+)\./, (match, number) => {
          const padding = number.length === 1 ? '  ' : ' '
          return padding + number + '.'
        })
      } else if (/^[-*]\s/.test(line.trim())) {
        return line.replace(/^[*-]/, '  •')
      }
      return line
    }).join('\n')
    if (log.length < 1024)
      log = log.replace(urlRegex, (url, i, text) => {
        let end = url.length + i
        return i === 0 || end === text.length || (/^\s$/.test(text[end]) && /^\s$/.test(text[i - 1])) ? chalk.blueBright(url) : url
      })
    log = log.replace(mdRegex, mdFormat(4))
    const testi = await m.mentionedJid
    if (testi) {
      for (let user of testi)
        log = log.replace('@' + user.split`@`[0], chalk.blueBright('@' + await conn.getName(user)))
    }
    console.log(m.error != null ? chalk.red(log) : m.isCommand ? chalk.yellow(log) : log)
  }

  if (m.messageStubParameters) {
    console.log(m.messageStubParameters.map(jid => {
      jid = conn.decodeJid(jid)
      let name = conn.getName(jid)
      return chalk.gray('+' + jid.replace('@s.whatsapp.net', '') + (name ? ' ~' + name : ''))
    }).join(', '))
  }

  if (/document/i.test(m.mtype)) console.log(`🝮 ${m.msg.fileName || m.msg.displayName || 'Document'}`)
  else if (/ContactsArray/i.test(m.mtype)) console.log(`᯼ ${' ' || ''}`)
  else if (/contact/i.test(m.mtype)) console.log(`✎ ${m.msg.displayName || ''}`)
  else if (/audio/i.test(m.mtype)) {
    const duration = m.msg.seconds
    console.log(`${m.msg.ptt ? '☄ (PTT ' : '𝄞 ('}AUDIO) ${Math.floor(duration / 60).toString().padStart(2, 0)}:${(duration % 60).toString().padStart(2, 0)}`)
  }
  console.log()
}

let file = global.__filename(import.meta.url)
watchFile(file, () => {
  console.log(chalk.redBright("Update 'lib/print.js'"))
})