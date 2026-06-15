# BETHO BOT (HULK-BOT-MD)

A feature-rich WhatsApp Multi-Device bot built with Node.js and Baileys. Supports AI chat, media downloading, group management, games, sticker creation, and more.

## Tech Stack
- **Runtime**: Node.js >= 20
- **WhatsApp**: `@whiskeysockets/baileys` (multi-device)
- **Database**: `lowdb` (local JSON file: `database.json`)
- **Media**: `fluent-ffmpeg`, `canvas`, `jimp`
- **AI**: Pollinations.ai / OpenAI

## Running the Bot
The bot starts via `npm start` (runs `node index.js`).

On first run (no session), it will output a pairing code in the console — enter it on your WhatsApp under **Linked Devices**. On subsequent runs it reconnects automatically using the saved session in `Sessions/Principal/`.

## Key Files
- `index.js` — entry point, WebSocket setup, session management
- `handler.js` — message routing and command handling
- `settings.js` — bot configuration (number, owner, APIs)
- `plugins/` — all commands as individual JS modules
- `lib/` — utility libraries (database, media conversion, etc.)
- `Sessions/` — WhatsApp auth session storage

## User Preferences
- Preserve all existing plugin structure and commands
- Do not replace the Baileys-based WhatsApp auth with any web login system
