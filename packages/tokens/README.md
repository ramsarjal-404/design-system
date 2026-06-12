# Lepidus Tokens

Enterprise design-token pipeline, **DTCG** taxonomy + **Style Dictionary v4**.
Mirrors the Figma variable architecture (Primitive → Semantic → Component) with
real, bound references — so Figma and code stay in sync and nothing is wired by
hand.

## Architecture

```
src/figma/*                      raw Figma DTCG export (import seed)        ⛔ from Figma
src/figma-gaps.tokens.json       hand-maintained overlay (see below)        ✅ source
        │  build-json.mjs  (npm run tokens:import) — export + gaps deep-merged
        ▼
src/primitive.tokens.json        literal values (color/dimension/fontWeight/number)   ✅ source
src/semantic.light.tokens.json   default theme  → references {primitive.*}            ✅ source
src/semantic.dark.tokens.json    [data-theme="dark"] overrides                        ✅ source
src/semantic.hc.tokens.json      [data-theme="hc"]  overrides                         ✅ source
src/component.tokens.json        component layer → references {semantic.*}             ✅ source
        │  build-sd.mjs  (npm run tokens:css)  — Style Dictionary v4
        ▼
build/css/tokens.css             themed CSS custom properties                         ⛔ generated
tokens.json                      bundled DTCG (Tokens Studio / portability)           ⛔ generated
```

## DTCG taxonomy

- W3C DTCG format: every token has `$type` (`color` · `dimension` · `fontWeight`
  · `number`) and `$value`.
- Three tiers, properly bound with DTCG references:

  ```
  component.input.border  →  {semantic.color.input.border}
  semantic.color.input.border  →  {primitive.color.gray.200}
  primitive.color.gray.200  →  #C7C7C7
  ```

  Change `primitive.color.gray.200` once and it cascades through semantic and
  component — exactly like editing the variable in Figma. Style Dictionary keeps
  these as `var()` chains in the CSS (`outputReferences`), so the cascade is live
  at runtime and theming works.
- CSS variable names come from each token's Figma Dev-Mode code syntax
  (`$extensions.com.figma.codeSyntax.WEB`, e.g. `--component-input-border`), via a
  custom Style Dictionary name transform — so the emitted names match Figma 1:1.

## Theming

`build/css/tokens.css` is emitted in three layers:

| Selector | Contents |
|---|---|
| `:root` | primitives + semantic (Light) + component |
| `[data-theme="dark"]` | semantic overrides |
| `[data-theme="hc"]` | semantic overrides (high contrast) |

Components reference component/semantic vars, so flipping `data-theme` re-resolves
the whole chain. Storybook's theme toolbar already toggles `data-theme`.

## Workflow

```bash
npm run tokens:import   # Figma export → regenerate DTCG sources (run after a new export)
npm run tokens:css      # Style Dictionary: sources → tokens.css (auto-runs before storybook)
npm run tokens          # alias for tokens:css
```

`tokens:css` validates that every `{reference}` resolves, then writes
`build/css/tokens.css`. `prestorybook` runs it automatically.

## Figma gaps overlay

`src/figma-gaps.tokens.json` holds tokens the Figma export does not (yet)
carry — chart series colors, progress/nav semantics added after the last
Dark/HC export, the focus ring, flyout/drawer shadows, hand-added primitives
(`gray-150/450`, `cyan-500/600`, `blue-650`), whole component groups the
export lacks (textfield, textarea, stepper, toast, dropdown, progress), and
rebinds pending a Figma-side fix (`component/toggle/off-bg`), and the WCAG AA
contrast rebinds (status text shades, danger button pair, dark progress text,
new `orange-900` primitive) that `npm run check:contrast` enforces. `tokens:import`
deep-merges it **over** the export, so re-importing never wipes hand work.
When a token lands in the Figma variables, delete it from the gaps file —
the goal is for this file to shrink to nothing.

## Round-trip with Figma

`tokens.json` (and the `src/*.tokens.json` files) are DTCG-compliant with
`{references}`, so they import cleanly into Figma via the **Tokens Studio** plugin
or the Variables REST API — keeping the same variable names and bindings the
Figma file already uses.
