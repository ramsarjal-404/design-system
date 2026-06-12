# Lepidus Design System — Changelog

Release notes are managed with [Changesets](https://github.com/changesets/changesets):
contributors add a changeset alongside their PR (`npm run changeset`), and
`npm run version-packages` rolls them into versioned package changelogs.

## 1.0.0 — 2026-06-12

First versioned baseline.

### Added
- 30 components (37 with the Forms/Feedback/Data Display wave: Tooltip, Checkbox,
  Radio, Skeleton, Spinner, Avatar, Link, Accordion), each with token-bound CSS,
  autodocs, Figma design links, and interaction tests.
- Three-tier DTCG token pipeline (Figma export → `tokens:import` → Style
  Dictionary → `tokens.css`) with light/dark/high-contrast theme layers and the
  hand-maintained `figma-gaps.tokens.json` overlay.
- Motion (`--duration-*`, `--easing-*`), z-index (`--z-*`) and breakpoint tokens.
- Shared overlay primitives (Portal, FocusTrap, Popover, VisuallyHidden) and
  ToastProvider with queueing and `aria-live` announcement.
- Quality gates: `check:tokens` (no hardcoded colors, all references resolve),
  `check:contrast` (WCAG pair audit per theme), axe checks in the Storybook
  test-runner, and `vrt` visual regression across all three themes.
- Packaging as `@lepidus/react` (ESM + types + extracted CSS) and
  `@lepidus/tokens` (tokens.json + tokens.css), with Changesets for versioning.
