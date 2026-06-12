# Lepidus Design System — agent guide

Enterprise design system for Lepide. Three packages, consumed via source:

- `packages/tokens` — DTCG sources → Style Dictionary → `build/css/tokens.css`
  (CSS variables, themed via `[data-theme="dark"|"hc"]` on `:root`)
- `packages/react` — 38 components (`src/components/<Name>/` = `.tsx` +
  `.types.ts` + `.module.css` + `.stories.tsx` + `index.ts`), shared overlay
  primitives in `src/primitives`
- `packages/css` — plain `lp-*` BEM classes generated from the React CSS
  modules by `build-css.mjs`; **never edit `packages/css/dist/`**

Lepide product developers ship plain HTML/CSS/JS — `@lepidus/css` is the
primary consumer surface; React is the workshop and the future option.

## Token rules (break these and CI fails)

- Components consume **only generated variables**: `var(--component-*)` first,
  semantic `var(--color-*|--space-*|--radius-*)` otherwise. No hardcoded
  colors outside `var()` fallbacks.
- Hand-maintained tokens go **only** in
  `packages/tokens/src/figma-gaps.tokens.json` — `npm run tokens:import`
  regenerates and **wipes** the other `src/*.tokens.json` files.
- After token edits: `npm run tokens:import && npm run tokens`, review with
  `npm run tokens:diff` (expect only your intended change).

## Definition of done

1. `npm run typecheck`
2. `npm run check:tokens` and `npm run check:contrast` (0 failures)
3. `npm run test-storybook` — **serial only** (`--maxWorkers 1`); parallel flakes
4. `npm run build-storybook` then `npm run vrt` (VRT serves `storybook-static/`
   — stale builds give false diffs). Intended visual changes: verify the diff
   images in `.vrt/actual/`, then `npm run vrt:update`. `vrt:update` re-stamps
   anti-aliasing noise in unrelated baselines — `git restore` baselines that
   weren't real failures before committing.
5. JS-timed stories opt out of VRT via `tags: ['no-vrt']`.

## @lepidus/css specifics

- Add a component by appending to `COMPONENTS` in `packages/css/build-css.mjs`:
  `block` (root class in the module), `elements` (→ `lp-x__part`), explicit
  `map` overrides; every other class auto-becomes a modifier (`lp-x--mod`).
- `npm run css` rebuilds; the build fails on unmapped classes or bare `var()`s
  missing from tokens.css. It runs automatically before Storybook builds.
- When adding a component also update: `packages/css/demo/index.html`,
  the docs page `packages/react/src/docs/HtmlCss.mdx`, and `public/llms.txt`.

## Site

Published Storybook: https://lepidus-design-system-button.vercel.app
Deploy with `npx vercel deploy --prod --yes` (config in `vercel.json`; do not
add `cleanUrls` — it breaks `iframe.html`). `public/` is served at the site
root (`llms.txt` lives there).
