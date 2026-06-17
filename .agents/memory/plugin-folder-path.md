---
name: Plugin folder path trap
description: global.__dirname() behaves like path.dirname() — it strips the last component. Original code used plugins/index as a trick to arrive at plugins/.
---

# Plugin folder path in index.js

## The rule
Use `join(__dirname, './plugins')` directly to set `pluginFolder`. Never wrap it in `global.__dirname()`.

**Why:** `global.__dirname(x)` is equivalent to `path.dirname(x)`. The original codebase used `global.__dirname(join(__dirname, './plugins/index'))` as a deliberate trick: stripping `index` left `plugins/`. If you change the argument to `./plugins`, it strips that too and you get the project root — all JS files in the root get loaded as plugins instead of the actual plugin files, breaking all commands silently.

**How to apply:** Any time the plugin folder path is changed in `index.js`, verify that `pluginFolder` resolves to the `plugins/` directory, not to the project root.

## Related fix — تحميلات_تيك.js syntax error
If a plugin has mismatched braces (more `{` than `}`), the closing `export default` ends up inside the function body → `SyntaxError: Unexpected token 'export'`. Fix by adding the missing `}` to close the inner block before the handler closing brace.
