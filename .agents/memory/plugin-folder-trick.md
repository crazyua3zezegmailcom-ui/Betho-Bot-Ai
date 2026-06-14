---
name: Plugin folder dirname trick
description: How pluginFolder path resolution works in this bot via global.__dirname
---

# Plugin Folder Path Trick

## The Rule
`pluginFolder` in main.js MUST be `global.__dirname(join(__dirname, './plugins/index'))` — NOT `./plugins`.

## Why
`global.__dirname(pathURL)` calls `path.dirname(filename)` which returns the PARENT of the given path:
- `global.__dirname('./plugins/index')` → resolves to `./plugins/` ✅
- `global.__dirname('./plugins')` → resolves to `./` (root!) ❌

If changed to `./plugins`, filesInit reads ALL .js files in the workspace root (including fix_menu.js, handler.js, config.js, etc.) causing crashes.

## How to Apply
- All plugin .js files go in `plugins/` directory directly
- The `plugins/index/` subdirectory is a dummy path — it exists only to make the dirname trick resolve to `plugins/`
- Never change pluginFolder to `'./plugins'` — always keep the `/index` suffix
