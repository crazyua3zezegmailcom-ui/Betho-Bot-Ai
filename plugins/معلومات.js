// ❁ الْكُودُ مُوَافِقٌ لِلْمَجَمَّعَاتِ وَالْقَنَوَاتِ فِي وَاتْسَاب ❁

import { getUrlFromDirectPath } from "@whiskeysockets/baileys";
import _ from "lodash";
import axios from 'axios';

let handler = async (m, { conn, command, usedPrefix, args, text, groupMetadata, isOwner, isROwner }) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
const channelUrl = text?.match(/(?:https:\/\/)?(?:www\.)?(?:chat\.|wa\.)?whatsapp\.com\/(?:channel\/|joinchat\/)?([0-9A-Za-z]{22,24})/i)?.[1];
let txtBotAdminCh = '\n\n> ✘ *تَأَكَّدْ أَنَّ الْبُوتَ مُشْرِفٌ فِي الْقَنَاةِ، وَإِلَّا لَنْ يَعْمَلَ الْأَمْرُ*';
let thumb = m.pp
let pp, ch, q, mime, buffer, media, inviteUrlch, imageBuffer;

let inviteCode
if (!text) return await m.reply(`⚠️ *يُرْجَى إِدْخَالُ رَابِطٍ لِمَجْمَعٍ أَوْ قَنَاةٍ فِي وَاتْسَاب لِجَلْبِ الْمَعْلُومَاتِ.*`)
const MetadataGroupInfo = async (res, isInviteInfo = false) => {
let nameCommunity = "لَيْسَ مِنْضَمًّا إِلَى أَيِّ مَجْمَعٍ"
let groupPicture = "لَمْ يَتَمَكَّنْ مِنَ الْحُصُولِ عَلَيْهَا"

if (res.linkedParent) {
let linkedGroupMeta = await conn.groupMetadata(res.linkedParent).catch(e => { return null })
nameCommunity = linkedGroupMeta ? "\n" + ("`الاسم:` " + linkedGroupMeta.subject || "") : nameCommunity
}
pp = await conn.profilePictureUrl(res.id, 'image').catch(e => { return null })
inviteCode = await conn.groupInviteCode(m.chat).catch(e => { return null })
const formatParticipants = (participants) =>
participants && participants.length > 0
? participants.map((user, i) => `${i + 1}. @${user.id?.split("@")[0]}${user.admin === "superadmin" ? " (مُشْرِفٌ عَالٍ)" : user.admin === "admin" ? " (مُشْرِفٌ)" : ""}`).join("\n")
: "لَمْ يُعْثَرْ عَلَيْهِ"
let caption = `🆔 *مُعَرِّفُ الْمَجْمُوعَةِ:*\n${res.id || "لَمْ يُعْثَرْ عَلَيْهِ"}\n\n` +
`👑 *مُنْشِئُ الْجَمَاعَةِ:*\n${res.owner ? `@${res.owner?.split("@")[0]}` : "لَمْ يُعْثَرْ عَلَيْهِ"} ${res.creation ? `فِي ${formatDate(res.creation)}` : "(لَمْ يُعْثَرْ عَلَى التَّارِيخِ)"}\n\n` +
`🏷️ *الِاسْمُ:*\n${res.subject || "لَمْ يُعْثَرْ عَلَيْهِ"}\n\n` +
`✏️ *تَغْيِيرُ الِاسْمِ بِوَاسِطَةِ:*\n${res.subjectOwner ? `@${res.subjectOwner?.split("@")[0]}` : "لَمْ يُعْثَرْ عَلَيْهِ"} ${res.subjectTime ? `فِي ${formatDate(res.subjectTime)}` : "(لَمْ يُعْثَرْ عَلَى التَّارِيخِ)"}\n\n` +
`📄 *الْوَصْفُ:*\n${res.desc || "لَمْ يُعْثَرْ عَلَيْهِ"}\n\n` +
`📝 *تَغْيِيرُ الْوَصْفِ بِوَاسِطَةِ:*\n${res.descOwner ? `@${res.descOwner?.split("@")[0]}` : "لَمْ يُعْثَرْ عَلَيْهِ"}\n\n` +
`🗃️ *مُعَرِّفُ الْوَصْفِ:*\n${res.descId || "لَمْ يُعْثَرْ عَلَيْهِ"}\n\n` +
`🖼️ *صُورَةُ الْمَجْمُوعَةِ:*\n${pp ? pp : groupPicture}\n\n` +
`💫 *الْمُؤَلِّفُ:*\n${res.author || "لَمْ يُعْثَرْ عَلَيْهِ"}\n\n` +
`🎫 *رَمْزُ الدَّعْوَةِ:*\n${res.inviteCode || inviteCode || "غَيْرُ مُتَاحٍ"}\n\n` +
`⌛ *الْمُدَّةُ:*\n${res.ephemeralDuration !== undefined ? `${res.ephemeralDuration} ثَانِيَةٍ` : "مَجْهُولٌ"}\n\n` +
`🛃 *الْمُشْرِفُونَ:*\n` + (res.participants && res.participants.length > 0 ? res.participants.filter(user => user.admin === "admin" || user.admin === "superadmin").map((user, i) => `${i + 1}. @${user.id?.split("@")[0]}${user.admin === "superadmin" ? " (مُشْرِفٌ عَالٍ)" : " (مُشْرِفٌ)"}`).join("\n") : "لَمْ يُعْثَرْ عَلَيْهِ") + `\n\n` +
`🔰 *الْمُسْتَخْدِمُونَ بِالْإِجْمَالِ:*\n${res.size || "لَمْ يُعْثَرْ عَلَى الْعَدَدِ"}\n\n` +
`✨ *مَعْلُومَاتٌ مُتَقَدِّمَةٌ* ✨\n\n🔎 *الْمَجْمَعُ الْمُرْتَبِطُ بِالْمَجْمُوعَةِ:*\n${res.isCommunity ? "هَذِهِ الْمَجْمُوعَةُ مُحَادَثَةُ إِعْلَانَاتٍ" : `${res.linkedParent ? "`المُعَرِّف:` " + res.linkedParent : "هَذِهِ الْمَجْمُوعَةُ"} ${nameCommunity}`}\n\n` +
`⚠️ *الْقُيُودُ:* ${res.restrict ? "✅" : "❌"}\n` +
`📢 *الْإِعْلَانَاتُ:* ${res.announce ? "✅" : "❌"}\n` +
`🏘️ *هَلْ هُوَ مَجْمَعٌ؟:* ${res.isCommunity ? "✅" : "❌"}\n` +
`📯 *هَلْ هُوَ إِعْلَانُ مَجْمَعٍ؟:* ${res.isCommunityAnnounce ? "✅" : "❌"}\n` +
`🤝 *يَتِمُّ مُوَافَقَةُ الْأَعْضَاءِ:* ${res.joinApprovalMode ? "✅" : "❌"}\n` +
`🆕 *يُمْكِنُ إِضَافَةُ أَعْضَاءٍ جُدُدٍ:* ${res.memberAddMode ? "✅" : "❌"}\n\n` 
return caption.trim()
}
        
const inviteGroupInfo = async (groupData) => {
const { id, subject, subjectOwner, subjectTime, size, creation, owner, desc, descId, linkedParent, restrict, announce, isCommunity, isCommunityAnnounce, joinApprovalMode, memberAddMode, ephemeralDuration } = groupData
let nameCommunity = "لَيْسَ مِنْضَمًّا إِلَى أَيِّ مَجْمَعٍ"
let groupPicture = "لَمْ يَتَمَكَّنْ مِنَ الْحُصُولِ عَلَيْهَا"
if (linkedParent) {
let linkedGroupMeta = await conn.groupMetadata(linkedParent).catch(e => { return null })
nameCommunity = linkedGroupMeta ? "\n" + ("`الاسم:` " + linkedGroupMeta.subject || "") : nameCommunity
}
pp = await conn.profilePictureUrl(id, 'image').catch(e => { return null })
const formatParticipants = (participants) =>
participants && participants.length > 0
? participants.map((user, i) => `${i + 1}. @${user.id?.split("@")[0]}${user.admin === "superadmin" ? " (مُشْرِفٌ عَالٍ)" : user.admin === "admin" ? " (مُشْرِفٌ)" : ""}`).join("\n")
: "لَمْ يُعْثَرْ عَلَيْهِ"

let caption = `🆔 *مُعَرِّفُ الْمَجْمُوعَةِ:*\n${id || "لَمْ يُعْثَرْ عَلَيْهِ"}\n\n` +
`👑 *مُنْشِئُ الْجَمَاعَةِ:*\n${owner ? `@${owner?.split("@")[0]}` : "لَمْ يُعْثَرْ عَلَيْهِ"} ${creation ? `فِي ${formatDate(creation)}` : "(لَمْ يُعْثَرْ عَلَى التَّارِيخِ)"}\n\n` +
`🏷️ *الِاسْمُ:*\n${subject || "لَمْ يُعْثَرْ عَلَيْهِ"}\n\n` +
`✏️ *تَغْيِيرُ الِاسْمِ بِوَاسِطَةِ:*\n${subjectOwner ? `@${subjectOwner?.split("@")[0]}` : "لَمْ يُعْثَرْ عَلَيْهِ"} ${subjectTime ? `فِي ${formatDate(subjectTime)}` : "(لَمْ يُعْثَرْ عَلَى التَّارِيخِ)"}\n\n` +
`📄 *الْوَصْفُ:*\n${desc || "لَمْ يُعْثَرْ عَلَيْهِ"}\n\n` +
`💠 *مُعَرِّفُ الْوَصْفِ:*\n${descId || "لَمْ يُعْثَرْ عَلَيْهِ"}\n\n` +
`🖼️ *صُورَةُ الْمَجْمُوعَةِ:*\n${pp ? pp : groupPicture}\n\n` +
`🏆 *الْأَعْضَاءُ الْمُبَارَزُونَ:*\n${formatParticipants(groupData.participants)}\n\n` +
`👥 *الْمُبَارَزُونَ بِالْإِجْمَالِ:*\n${size || "لَمْ يُعْثَرْ عَلَى الْعَدَدِ"}\n\n` +
`✨ *مَعْلُومَاتٌ مُتَقَدِّمَةٌ* ✨\n\n🔎 *الْمَجْمَعُ الْمُرْتَبِطُ بِالْمَجْمُوعَةِ:*\n${isCommunity ? "هَذِهِ الْمَجْمُوعَةُ مُحَادَثَةُ إِعْلَانَاتٍ" : `${linkedParent ? "`المُعَرِّف:` " + linkedParent : "هَذِهِ الْمَجْمُوعَةُ"} ${nameCommunity}`}\n\n` +
`📢 *الْإِعْلَانَاتُ:* ${announce ? "✅ نَعَمْ" : "❌ لَا"}\n` +
`🏘️ *هَلْ هُوَ مَجْمَعٌ؟:* ${isCommunity ? "✅ نَعَمْ" : "❌ لَا"}\n` +
`📯 *هَلْ هُوَ إِعْلَانُ مَجْمَعٍ؟:* ${isCommunityAnnounce ? "✅" : "❌"}\n` +
`🤝 *يَتِمُّ مُوَافَقَةُ الْأَعْضَاءِ:* ${joinApprovalMode ? "✅" : "❌"}\n`
return caption.trim()
}

let info
try {
let res = text ? null : await conn.groupMetadata(m.chat)
info = await MetadataGroupInfo(res) // إذا كان البوت في المجموعة
console.log('طريقة البيانات الوصفية')
} catch {
const inviteUrl = text?.match(/(?:https:\/\/)?(?:www\.)?(?:chat\.|wa\.)?whatsapp\.com\/(?:invite\/|joinchat\/)?([0-9A-Za-z]{22,24})/i)?.[1]
let inviteInfo
if (inviteUrl) {
try {
inviteInfo = await conn.groupGetInviteInfo(inviteUrl)
info = await inviteGroupInfo(inviteInfo) // لأي رابط مجموعة/مجمع
console.log(info)
console.log('طريقة الرابط')    
} catch (e) {
m.reply('لَمْ يُعْثَرْ عَلَى الْمَجْمُوعَةِ')
return
}}}
if (info) {
await conn.sendMessage(m.chat, { text: info, contextInfo: {
mentionedJid: null,
externalAdReply: {
title: "🔰 مُفَتِّشُ الْمَجَامِيعِ",
body: m.pushName,
thumbnailUrl: m.pp,
sourceUrl: args[0] ? args[0] : inviteCode ? `https://chat.whatsapp.com/${inviteCode}` : md,
mediaType: 1,
showAdAttribution: false,
renderLargerThumbnail: true
}}}, { quoted: fkontak })
} else {
// معالجة روابط القنوات
let newsletterInfo
if (!channelUrl) return await conn.reply(m.chat, "✘ *تَأَكَّدْ أَنَّهُ رَابِطُ قَنَاةٍ فِي وَاتْسَاب.*", m)
if (channelUrl) {
try {
newsletterInfo = await conn.newsletterMetadata("invite", channelUrl).catch(e => { return null })
if (!newsletterInfo) return await conn.reply(m.chat, "✘ *لَمْ يُعْثَرْ عَلَى مَعْلُومَاتِ الْقَنَاةِ.* تَأَكَّدْ مِنْ صِحَّةِ الرَّابِطِ.", m)       
let caption = "*ًོ✪ مُفَتِّشُ رَوَابِطِ الْقَنَوَاتِ ✪ًོ*\n\n" + processObject(newsletterInfo, "", newsletterInfo?.preview)
if (newsletterInfo?.preview) {
pp = getUrlFromDirectPath(newsletterInfo.preview)
} else {
pp = thumb
}
if (channelUrl && newsletterInfo) {
await conn.sendMessage(m.chat, { text: caption, contextInfo: {
mentionedJid: null,
externalAdReply: {
title: "📢 مُفَتِّشُ الْقَنَوَاتِ",
body: m.pushName,
thumbnailUrl: m.pp,
sourceUrl: args[0],
mediaType: 1,
showAdAttribution: false,
renderLargerThumbnail: true
}}}, { quoted: fkontak })}
newsletterInfo.id ? conn.sendMessage(m.chat, { text: newsletterInfo.id }, { quoted: null }) : ''
} catch (e) {
console.log(e)
}}}}
handler.help = ["superinspect", "inspect"]
handler.tags = ['tools'];
handler.command = /^(superinspect|inspect|تفتيش|معلومات)$/i;
handler.register = true; //

export default handler;

function formatDate(n, locale = "ar", includeTime = true) {
if (n > 1e12) {
n = Math.floor(n / 1000)  // التحويل من ميلي ثانية إلى ثوان
} else if (n < 1e10) {
n = Math.floor(n * 1000)  // التحويل من ثوان إلى ميلي ثانية
}
const date = new Date(n)
if (isNaN(date)) return "تَارِيخٌ غَيْرُ صَالِحٍ"
// تنسيق التاريخ: يوم/شهر/سنة
const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' }
const formattedDate = date.toLocaleDateString(locale, optionsDate)
if (!includeTime) return formattedDate
// الساعات، الدقائق، والثواني
const hours = String(date.getHours()).padStart(2, '0')
const minutes = String(date.getMinutes()).padStart(2, '0')
const seconds = String(date.getSeconds()).padStart(2, '0')
const period = hours < 12 ? 'ص' : 'م'
const formattedTime = `${hours}:${minutes}:${seconds} ${period}`
return `${formattedDate}, ${formattedTime}`
}

function formatValue(key, value, preview) {
switch (key) {
case "subscribers":
return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "لَا يُوجَدُ مُشْتَرِكُونَ"
case "creation_time":
case "nameTime":
case "descriptionTime":
return formatDate(value)
case "description": 
case "name":
return value || "لَا تُوجَدُ مَعْلُومَاتٌ مُتَاحَةٌ"
case "state":
switch (value) {
case "ACTIVE": return "نَشِطٌ"
case "GEOSUSPENDED": return "مُعَلَّقٌ حَسَبَ الْمِنْطَقَةِ"
case "SUSPENDED": return "مُعَلَّقٌ"
default: return "مَجْهُولٌ"
}
case "reaction_codes":
switch (value) {
case "ALL": return "جَمِيعُ التَّفَاعُلَاتِ مَسْمُوحٌ بِهَا"
case "BASIC": return "التَّفَاعُلَاتُ الْأَسَاسِيَّةُ مَسْمُوحٌ بِهَا"
case "NONE": return "لَا يُسْمَحُ بِالتَّفَاعُلَاتِ"
default: return "مَجْهُولٌ"
}
case "verification":
switch (value) {
case "VERIFIED": return "مُوثَّقٌ"
case "UNVERIFIED": return "غَيْرُ مُوثَّقٍ"
default: return "مَجْهُولٌ"
}
case "mute":
switch (value) {
case "ON": return "مُكْتَومٌ"
case "OFF": return "غَيْرُ مَكْتُومٍ"
case "UNDEFINED": return "غَيْرُ مُحَدَّدٍ"
default: return "مَجْهُولٌ"
}
case "view_role":
switch (value) {
case "ADMIN": return "مُشْرِفٌ"
case "OWNER": return "مَالِكٌ"
case "SUBSCRIBER": return "مُشْتَرِكٌ"
case "GUEST": return "ضَيْفٌ"
default: return "مَجْهُولٌ"
}
case "picture":
if (preview) {
return getUrlFromDirectPath(preview)
} else {
return "لَا تُوجَدُ صُورَةٌ مُتَاحَةٌ"
}
default:
return value !== null && value !== undefined ? value.toString() : "لَا تُوجَدُ مَعْلُومَاتٌ مُتَاحَةٌ"
}}

function newsletterKey(key) {
return _.startCase(key.replace(/_/g, " "))
.replace("Id", "🆔 مُعَرِّفٌ")
.replace("State", "📌 الْحَالَةُ")
.replace("Creation Time", "📅 تَارِيخُ الْإِنْشَاءِ")
.replace("Name Time", "✏️ تَارِيخُ تَعْدِيلِ الِاسْمِ")
.replace("Name", "🏷️ الِاسْمُ")
.replace("Description Time", "📝 تَارِيخُ تَعْدِيلِ الْوَصْفِ")
.replace("Description", "📜 الْوَصْفُ")
.replace("Invite", "📩 دَعْوَةٌ")
.replace("Handle", "👤 لَقَبٌ")
.replace("Picture", "🖼️ صُورَةٌ")
.replace("Preview", "👀 عَرْضٌ مُسَبَّقٌ")
.replace("Reaction Codes", "😃 تَفَاعُلَاتٌ")
.replace("Subscribers", "👥 مُشْتَرِكُونَ")
.replace("Verification", "✅ تَوْثِيقٌ")
.replace("Viewer Metadata", "🔍 بَيَانَاتٌ مُتَقَدِّمَةٌ")
}

function processObject(obj, prefix = "", preview) {
let caption = ""
Object.keys(obj).forEach(key => {
const value = obj[key]
if (typeof value === "object" && value !== null) {
if (Object.keys(value).length > 0) {
const sectionName = newsletterKey(prefix + key)
caption += `\n*꫞꫞꫞ ${sectionName} ꫞꫞꫞*\n`
caption += processObject(value, `${prefix}${key}_`)
}} else {
const shortKey = prefix ? prefix.split("_").pop() + "_" + key : key
const displayValue = formatValue(shortKey, value, preview)
const translatedKey = newsletterKey(shortKey)
caption += `- *${translatedKey}:*\n${displayValue}\n\n`
}})
return caption.trim()
}