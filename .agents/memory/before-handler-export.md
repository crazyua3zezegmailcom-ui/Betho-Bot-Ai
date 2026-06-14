---
name: Before handler export pattern
description: How to correctly export a before handler plugin in this bot framework
---

# Before Handler Export Pattern

## The Rule
A plugin's `before` function must be a **property** on the exported handler object, not the default export itself.

## Why
handler.js checks `plugin.before` (line ~1098):
```js
if (typeof plugin.before === 'function') {
    if (await plugin.before.call(this, m, {...})) continue
}
```
If you do `export default async function before(...)`, then `plugin = [AsyncFunction]` and `plugin.before` is `undefined` — the before handler never runs.

## Correct Pattern
```js
const handler = async (m, { conn }) => {};

handler.before = async function (m, { conn }) {
  // your logic here
  return false; // return true to stop further plugin processing
};

export default handler;
```

## Wrong Pattern (does NOT work)
```js
export default async function before(m, { conn }) {
  // this never gets called as a before handler
}
```
