---
name: Betho Bot Branding
description: Durable decisions from the full Nezuko→Betho rebrand of this WhatsApp bot project.
---

# Betho Bot Branding

## Rules
- Bot name: `𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢` (display), `BETHO BOT` (ASCII), `𝑩𝒆𝒕𝒉𝒐` (short)
- Developer: `𝐶𝑟𝑎𝑧𝑦`
- Owner numbers: `15877004085`, `201214057674`, `201201756710`
- Install/pairing code: `BETHO123` — passed as second arg to `conn.requestPairingCode(phone, 'BETHO123')`
- Newsletter JID: `120363428186936884@newsletter`
- Channel link: `https://whatsapp.com/channel/0029Vb82IJr3gvWS72JEDB1e`
- Support group: `https://chat.whatsapp.com/JNUcrtcQjPGJpKoW78dkEc`
- Botho images: i.postimg.cc/2jFJGwzS (main), fbnj1GK0 (welcome), wMvKKyVk (remove), P52T7Hh2 (install), 02tkNSHj (commands)
- Voice URL for المطور: `https://media1.vocaroo.com/mp3/1m9sSiyVOX0B`
- PTT audio must use `mimetype: 'audio/ogg; codecs=opus'` with ffmpeg conversion via `convertToOggOpus()`

## Why
User requested full rebrand from Nezuko/Gogo/Monte/Ziad to Betho/Crazy branding.

## How to apply
- Any new plugin: use `𝑩𝜩𝑻𝑯𝑶̤͝𝜣͓ۧٛ͢` not Nezuko/Gogo; developer is `𝐶𝑟𝑎𝑧𝑦`; `handler.bot = false` on all public commands
- The Baileys library banner (`node_modules/@whiskeysockets/baileys/lib/index.js` lines 8-25) was patched to say BETHO BOT — this will reset if node_modules is reinstalled

## Key files changed
- `settings.js`, `index.js`, `lib/print.js`, `lib/simple.js`
- `node_modules/@whiskeysockets/baileys/lib/index.js` (banner patch — ephemeral)
- All `plugins/` files via bulk sed + Python replacements
- New plugins: `المطور.js`, `ارفعني.js`, `اذاعه.js`, `بكاسه.js`, `عباقره.js`
- New helper: `system/perf.js` (convertToOggOpus, fetchWithTimeout)

## Packages installed
- `puppeteer-extra`, `puppeteer-extra-plugin-stealth` (for plugins/تخيلث.js)
- `util-linux` system dep (for canvas/libuuid.so.1)
- serbot limit raised to 200, isCodeMode forced true
