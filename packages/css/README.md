# @lepidus/css

Lepidus Design System as **plain CSS classes** — for HTML/CSS/JS projects with
no framework and no build tool. Same tokens, same look as `@lepidus/react`;
both are generated from the same source, so they cannot drift apart.

## Use

Link one stylesheet, write HTML:

```html
<link rel="stylesheet" href="lepidus.css" />

<button class="lp-button lp-button--primary lp-button--md">Save</button>
```

Theming — set the attribute on `<html>` and every component follows:

```html
<html data-theme="dark">   <!-- "light" (default) | "dark" | "hc" -->
```

## Files (`dist/`)

| File | Contents |
|---|---|
| `lepidus.css` | Tokens + all components in one file — the easiest path |
| `lepidus.js` | Vanilla behavior for interactive components (Tabs, Modal) — data-attribute init, `window.Lepidus` API |
| `lepidus.components.css` | Components only (load `@lepidus/tokens` CSS yourself) |
| `components/<name>.css` | One component at a time |

## Class naming

BEM with an `lp-` prefix:

- Block: `lp-button`, `lp-card`, `lp-input` …
- Modifier: `lp-button--primary`, `lp-button--sm`, `lp-card--elevated`
- Element: `lp-button__icon-left`, `lp-card__title`, `lp-input__field`

Copy-paste markup for every component lives in Storybook →
**Foundations → HTML & CSS**, and `demo/index.html` shows everything on one page.

## How it's built

`build-css.mjs` transforms the React package's CSS modules
(`packages/react/src/components/*/*.module.css`) into prefixed plain CSS.
**Never edit `dist/` by hand** — change the source module and rebuild:

```bash
npm run css        # from the repo root (tokens must be built first)
```

The build fails if a class escapes the `lp-` mapping or a `var()` reference
doesn't exist in `tokens.css`. To add a component, append an entry to
`COMPONENTS` in `build-css.mjs` (block class, element classes, any explicit
overrides) — everything else becomes a block modifier automatically.
