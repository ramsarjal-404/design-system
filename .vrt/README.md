# Visual regression testing (VRT)

Pixel-level snapshots of every Storybook story, captured in each theme
(`light`, `dark`, `hc`) at 1024x768 / deviceScaleFactor 1, clipped to
`#storybook-root`. Powered by Playwright (Chromium) + pixelmatch via
`scripts/vrt.mjs`.

## Layout

| Path | Purpose | Git |
| --- | --- | --- |
| `.vrt/baseline/<theme>/<storyId>.png` | Approved reference images | **committed** |
| `.vrt/actual/<theme>/<storyId>.png` | Screenshots from the latest run | ignored |
| `.vrt/diff/<theme>/<storyId>.png` | Visual diff for failing stories | ignored |

## Workflow

1. Build the static Storybook (the script screenshots the build, not the dev server):

       npm run build-storybook

2. Create or refresh baselines:

       npm run vrt:update

   Commit the resulting `.vrt/baseline/` images.

3. Verify (locally or in CI):

       npm run vrt

   Exits 1 if any story differs from its baseline by more than the allowed
   ratio. Stories without a baseline are captured as `NEW` (baseline written
   automatically) and do not fail the run — commit them if expected.

4. When a visual change is **intentional**, bump the affected baselines:

       npm run vrt:update

   then review and commit the updated PNGs. Inspect `.vrt/diff/` first to
   confirm the change is what you meant to ship.

## Useful flags

    node scripts/vrt.mjs --grep "actions-button"   # only matching story ids (regex)
    node scripts/vrt.mjs --threshold 0.1           # pixelmatch per-pixel sensitivity (0..1)
    node scripts/vrt.mjs --max-diff-ratio 0.001    # fail when >0.1% of pixels differ
    node scripts/vrt.mjs --update --grep "badge"   # re-baseline a subset

Flags combine with `npm run vrt -- --grep ...` as well.

## Notes

- Themes are driven through the `theme` Storybook global
  (`iframe.html?id=<story>&globals=theme:<theme>`), which the preview
  decorator maps to `data-theme` on `<html>`.
- CSS animations/transitions and the text caret are disabled before each
  screenshot to keep captures deterministic.
- A stale `storybook-static/` build means stale screenshots — always rebuild
  Storybook before re-baselining.
