# Lepidus Design System

Enterprise React design system for Lepide products: 37 token-bound components,
a three-tier DTCG token pipeline that stays in lock-step with Figma, three
themes (light / dark / high-contrast), and a Storybook with full interaction,
accessibility and visual-regression coverage.

## Quick start

```bash
npm install
npm run storybook        # docs + playground at http://localhost:6006
```

The Storybook **Foundations → Getting Started** page is the canonical
onboarding doc; **Foundations → Theming** covers the theme layers.

## Packages

| Package | Contents |
|---|---|
| `@lepidus/tokens` | DTCG token sources + generated `build/css/tokens.css` (themed CSS variables) |
| `@lepidus/react` | Components (`dist/index.js` + `dist/style.css` via `npm run build:react`) |
| `@lepidus/css` | Plain CSS classes (`lp-button` …) generated from the React CSS modules — for HTML/CSS/JS consumers, no framework needed (`npm run css`) |

React consumers load `@lepidus/tokens/css` first, then `@lepidus/react/style.css`,
then import components. Plain-HTML consumers link the single
`packages/css/dist/lepidus.css` (tokens included) and copy markup from the
Storybook **Foundations → HTML & CSS** page. The font is Open Sans.

## Scripts

| Script | What it does |
|---|---|
| `npm run storybook` / `build-storybook` | Dev server / static build (tokens rebuild automatically first) |
| `npm run tokens:import` | Figma DTCG export + `figma-gaps.tokens.json` overlay → DTCG sources |
| `npm run tokens` | Style Dictionary → `packages/tokens/build/css/tokens.css` |
| `npm run tokens:diff` | Reviewable changelog of token changes vs git |
| `npm run css` | Generate `@lepidus/css` (plain `lp-*` classes) from the React CSS modules |
| `npm run typecheck` | TypeScript, no emit |
| `npm run check:tokens` | CI gate: every `var()` resolves, no hardcoded colors |
| `npm run check:contrast` | WCAG contrast audit of token pairs, all three themes |
| `npm run test-storybook` | Interaction + axe tests (run serially in CI) |
| `npm run vrt` / `vrt:update` | Visual regression across light/dark/hc (baselines in `.vrt/baseline`) |
| `npm run build:react` | Library build (ESM + d.ts + extracted CSS) |
| `npm run usage-report` | Component/token adoption telemetry for consuming apps |
| `npm run changeset` | Add a release note for the current change |

## Architecture in one paragraph

Figma variables are exported as DTCG (`packages/tokens/src/figma/`),
`build-json.mjs` normalizes them and deep-merges the hand-maintained
`figma-gaps.tokens.json` overlay (tokens Figma doesn't carry yet), Style
Dictionary emits `tokens.css` with the Primitive → Semantic → Component chain
preserved as live `var()` references and themed via `[data-theme]`. Components
consume only generated variables (enforced by `check:tokens`); shared overlay
behavior (Portal / FocusTrap / Popover) lives in `packages/react/src/primitives`.
See `packages/tokens/README.md` and the Contributing page in Storybook.

## Contributing

Storybook **Lepidus → Contributing** is the source of truth (token chain rules,
component file structure, story template, definition of done). CI runs
typecheck, token gates, contrast audit, interaction + axe tests, VRT, and the
library build on every PR.
