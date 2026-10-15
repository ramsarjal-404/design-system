# Lepidus Design System — architecture & design document

The single detailed reference for how Lepidus is built, why it's built that
way, and how each audience consumes it. Shorter companions: [README.md](README.md)
(quick start), [CLAUDE.md](CLAUDE.md) (rules for AI agents working on this
repo), the published site (living docs), and [packages/mcp/README.md](packages/mcp/README.md)
(MCP server design).

**Live site:** https://lepidus-design-system-button.vercel.app

---

## 1. Goals and audiences

| Audience | What they get | Entry point |
|---|---|---|
| HTML/CSS/JS developers (Lepide's current stack) | One stylesheet + one small JS file, copy-paste markup | Site → Foundations → HTML & CSS |
| React developers (future) | 38 typed components | `@ramsarjal-404/react` |
| Designers | Figma library in lock-step with code, themed previews | Figma + the site |
| AI assistants | Rules, machine-readable facts, live MCP lookup | `llms.txt`, `component-manifest.json`, `packages/mcp` |

Design references: Porsche Design System v4 (token pipeline, rigor, docs
site) and Salesforce Lightning (CSS-first distribution for any stack).

## 2. The token pipeline (the architectural core)

Single source of truth: **Figma variables**, exported as DTCG JSON.

```
Figma variables (DTCG export)          packages/tokens/src/figma/
        │  npm run tokens:import  (build-json.mjs)
        ▼
DTCG sources, 3 tiers                  packages/tokens/src/*.tokens.json
  primitive  → literal values            (REGENERATED — never hand-edit;
  semantic   → refs {primitive.*},        hand additions live ONLY in
               per-theme light/dark/hc    figma-gaps.tokens.json, which is
  component  → refs {semantic.*}          deep-merged during import)
        │  npm run tokens  (build-sd.mjs, Style Dictionary v4)
        ▼
tokens.css                             packages/tokens/build/css/tokens.css
  :root                = primitives + semantic(light) + component
  [data-theme="dark"]  = semantic overrides only
  [data-theme="hc"]    = semantic overrides only
```

Key properties:

- **Live `var()` chains** (`outputReferences`): `--component-button-primary-fill`
  → `var(--color-button-primary-bg)` → `var(--blue-600)`. Because the chain
  stays live in CSS, a theme only has to override the semantic layer and
  every component re-resolves automatically.
- **Theming is one attribute**: `<html data-theme="dark|hc">`. No second
  stylesheet, no JS.
- **The gaps file** (`figma-gaps.tokens.json`) holds tokens Figma doesn't
  carry yet (chart palette, focus ring, WCAG rebinds, themed pairs like
  `color/tag/disabled-*`). Every entry has a `$description` explaining why it
  exists; the file is designed to shrink to zero as the Figma library matures.
- **Reviewability**: `npm run tokens:diff` prints the exact token-level
  changes vs git before you commit.

## 3. Packages

```
packages/
  tokens/   DTCG sources + generated tokens.css        (the foundation)
  react/    38 components + primitives + stories       (the workshop + future)
  css/      generated lp-* classes + lepidus.js        (today's product)
  mcp/      zero-dep MCP server                        (the AI surface)
```

### 3.1 `@ramsarjal-404/react` — the workshop

Each component: `Name.tsx` (typed, forwardRef) + `Name.types.ts` +
`Name.module.css` (every visual property a token `var()`) + `Name.stories.tsx`
+ `index.ts`. Shared overlay machinery (Portal, FocusTrap, Popover,
VisuallyHidden) lives in `src/primitives`. Even while Lepide ships plain
HTML, this package stays the **factory**: stories are the spec, tests run
here, and the CSS package is generated from these modules.

### 3.2 `@ramsarjal-404/css` — the product for today's stack

`build-css.mjs` transforms the React CSS modules into prefixed plain classes
(SLDS/Bootstrap model): block `lp-button`, modifier `lp-button--primary`,
element `lp-button__icon-left`. Per-component config declares the block class
and elements; everything else auto-becomes a modifier. The transform also:

- prefixes `@keyframes` per component (CSS modules scope them; a global
  bundle must too),
- appends compat rules where plain HTML differs from React (e.g.
  `.lp-modal[hidden]{display:none !important}` — React unmounts closed
  modals, plain HTML keeps them in the DOM, and author `display:flex`
  otherwise beats the `hidden` attribute),
- **fails the build** if any class escapes the `lp-` mapping or a bare
  `var()` doesn't exist in tokens.css.

Outputs: `dist/lepidus.css` (tokens + all components, the one-file path),
`dist/lepidus.components.css`, `dist/components/<name>.css`, `dist/lepidus.js`.

**27 of 38 components** are converted (everything except chart/calendar/shell
specialties). `lepidus.js` (~6 KB, zero deps) powers the interactive ones via
data attributes: Tabs (arrow-key roving tabindex, RTL-aware), Modal (focus
trap, **inert background**, Escape/backdrop, focus restore), Accordion,
Dropdown (multi/single, change events), Stepper, `Lepidus.toast()`, and
`data-lp-tooltip` tooltips. The markup contracts carry the React components'
ARIA patterns verbatim.

Demo: `packages/css/demo/index.html` — every component, no build tool,
theme switcher.

### 3.3 The AI surface

See section 5.

## 4. Quality gates (all in CI, all required)

| Gate | Command | What it catches |
|---|---|---|
| Types | `typecheck` | API drift |
| Token discipline | `check:tokens` | Hardcoded colors; `var()`s that don't resolve |
| Contrast | `check:contrast` | WCAG AA failures in token pairs, all 3 themes |
| Token sync | CI `tokens:import` + `git diff --exit-code` | Hand edits to regenerated files |
| Interaction + axe | `test-storybook --maxWorkers 1` | Behavior regressions; a11y violations per story |
| Visual regression | `vrt` | Pixel drift, 228 stories × 3 themes |
| Plain-HTML a11y | `check:demo-a11y` | WCAG violations in the documented markup, incl. open modal/dropdown states |
| Library build | `build:react` | Packaging breakage |

Practices learned the hard way (also in CLAUDE.md): rebuild `storybook-static`
before VRT; `vrt:update` re-stamps anti-aliasing noise — restore baselines
that weren't real failures; kill CSS transitions before measuring colors;
verify show/hide via computed `display`, not attributes.

## 5. The AI / vibe-coding surface

Three layers, one principle — *the assistant should never have to guess*:

1. **Rules** — `public/llms.txt` (served at the site root): plain-language
   instructions + full class inventory. `CLAUDE.md` covers agents working on
   this repo itself.
2. **Facts** — `public/component-manifest.json`: all 56 exported components
   (38 top-level + chart family + group/provider companions) with every prop's
   type/default/description plus the legal `lp-` classes. Generated by
   `npm run manifest` from the TypeScript types; rebuilt before every site
   build, so the deployed copy is always current.
3. **Live lookup** — the MCP server (`packages/mcp/server.mjs`, wired by
   `.mcp.json`): `list_components`, `get_component`, `search_tokens` (per-theme
   values, searches names *and* values), `get_usage_rules`. Zero dependencies;
   reads only build artifacts. Full design doc: `packages/mcp/README.md`.
4. **The whole system in one file** — `apps/site/public/design.md` (served at
   `/design.md`), generated by `apps/site/scripts/build-design-md.mjs` at the
   end of `prepare.mjs` from the manifest, the MDX content, the snippets and
   tokens.css: quick start, rules, every component (usage, HTML + React code,
   props, classes, accessibility), patterns, all tokens. For humans who want
   the system offline and for assistants that need more than `llms.txt`.

The site's **Lepidus → AI & Vibe Coding** page documents the end-to-end
workflow and the product-repo setup (rules file + MCP wiring + how to verify
generated code).

## 6. Releases & distribution

- Versioning via **changesets** (`npm run changeset`, `version-packages`).
- The site deploys to Vercel (`npx vercel deploy --prod --yes`; `vercel.json`
  holds the build config — note: no `cleanUrls`, it breaks Storybook's
  `iframe.html`).
- Not yet done (deliberately): GitHub remote + auto-deploy on push, and npm
  registry publishing. Both are wired-and-waiting — changesets and CI exist.

## 7. Roadmap / known gaps

- **GitHub + auto-deploy** — needs a repo created under Lepide's org.
- **Remaining 11 components** in plain CSS (charts, Calendar, FolderTree,
  Sidebar, SettingsPanel, TextField, Textarea, TimePicker, ActionItem,
  Filter, Scrollbar) — convert when a plain-HTML consumer needs them.
- **Figma Code Connect** — make Figma Dev Mode show real Lepidus code.
- **Lint preset for consumer repos** (no raw hex, no off-system classes) —
  the guardrail that lets AI-generated code self-correct.
- **Avatar series contrast** — white initials on the yellow/red series fail
  AA; currently exempted as aria-hidden decoration (documented); revisit when
  `component/avatar` tokens land in Figma.
- **Versioned docs** (Porsche-style v4/v5 switcher) — when the first breaking
  release approaches.
