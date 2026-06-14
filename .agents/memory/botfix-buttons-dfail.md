---
name: Buttons and dfail fixes
description: Critical runtime bugs fixed in handler.js and system/buttons.js — affects all members receiving messages
---

## dfail Arrow Function Bug
`global.dfail` in handler.js was defined as arrow function `(type, m, conn) => {}` but used `this.getName`, `this.sendMessage`, `this.sendUrlImageButton` → all failed with TypeError because `this` is undefined in arrow functions.
**Fix**: Replace all `this.` with `conn.` in dfail body.

## WhatsApp Buttons Silent Failure
Old Baileys button format (`buttonId`, `buttonText`, `type: 1`) is deprecated — messages with buttons don't show to group members, only to the bot's own session.
**Fix**: `system/buttons.js` — `channelButton()` and `downloadButtons()` now return `undefined`. Baileys check is `if ('buttons' in message && !!message.buttons)` → `!!undefined = false` → plain text message sent → reaches ALL members.

## Plugin Handler Missing `conn`
Arrow function handlers that destructure the second param must explicitly include `conn`:
`let handler = async (m, { conn, text }) => {}` — not just `(m, { text }) => {}`.
If conn is missing from params, `conn.sendMessage` etc. crash with ReferenceError.
**Files fixed**: register.js, verify.js, bart2.js, cleartmp.js, gitclone.js, tiktok2.js, top_gc_user.js.

## Exported before/after Handlers
`export async function before(m)` handlers are called with `.call(conn, m)` so `this` = conn.
Use `this.user.jid` NOT `conn.user.jid` in exported handlers.
