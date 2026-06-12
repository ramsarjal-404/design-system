#!/usr/bin/env node
/**
 * WCAG 2.1 contrast audit for the built Lepidus tokens.
 *
 * Reads packages/tokens/build/css/tokens.css, resolves var() chains per theme
 * (:root = light, [data-theme="dark"], [data-theme="hc"] — theme blocks
 * overlay :root), and checks a curated list of foreground/background token
 * pairs against the 4.5:1 normal-text threshold.
 *
 * Exit code 1 if any non-allowlisted pair fails.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKENS_CSS = path.join(
  __dirname,
  '..',
  'packages/tokens/build/css/tokens.css',
);

const THRESHOLD = 4.5; // WCAG 2.1 AA, normal text

/**
 * ALLOWLIST — pairs that fail 4.5:1 but are verified NOT to be used as
 * body/interactive text in any component CSS. Format: 'theme|fg|bg'.
 * Every entry must carry a justification comment.
 */
const ALLOWLIST = new Set([
  // (intentionally empty as of 2026-06-12)
  //
  // The currently failing pairs were each checked against component CSS and
  // are REAL text, so they must NOT be allowlisted — they need token fixes:
  //  - --component-button-danger-text on -fill: danger Button label
  //    (Button.module.css .danger).
  //  - --color-status-{success,warning,error}-text on -bg: Badge and Tag
  //    label text (Badge.module.css / Tag.module.css .success/.warning/.error).
  //  - --color-progress-text on surface (dark): Progress percentage label and
  //    description (Progress.module.css via --component-progress-text).
]);

// ---------------------------------------------------------------------------
// CSS parsing
// ---------------------------------------------------------------------------

function parseBlocks(css) {
  const blocks = {};
  const re = /(:root|\[data-theme="(?:dark|hc)"\])\s*\{([\s\S]*?)\}/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    const selector = m[1];
    const body = m[2];
    const map = {};
    const declRe = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let d;
    while ((d = declRe.exec(body)) !== null) {
      map[d[1]] = d[2].trim();
    }
    blocks[selector] = { ...(blocks[selector] || {}), ...map };
  }
  return blocks;
}

// ---------------------------------------------------------------------------
// Color parsing / math
// ---------------------------------------------------------------------------

function parseColor(value) {
  const v = value.trim().toLowerCase();

  let m = v.match(/^#([0-9a-f]{3})$/);
  if (m) {
    const [r, g, b] = m[1].split('').map((c) => parseInt(c + c, 16));
    return { r, g, b, a: 1 };
  }
  m = v.match(/^#([0-9a-f]{6})$/);
  if (m) {
    return {
      r: parseInt(m[1].slice(0, 2), 16),
      g: parseInt(m[1].slice(2, 4), 16),
      b: parseInt(m[1].slice(4, 6), 16),
      a: 1,
    };
  }
  m = v.match(/^#([0-9a-f]{8})$/);
  if (m) {
    return {
      r: parseInt(m[1].slice(0, 2), 16),
      g: parseInt(m[1].slice(2, 4), 16),
      b: parseInt(m[1].slice(4, 6), 16),
      a: parseInt(m[1].slice(6, 8), 16) / 255,
    };
  }
  m = v.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/,
  );
  if (m) {
    return {
      r: Number(m[1]),
      g: Number(m[2]),
      b: Number(m[3]),
      a: m[4] === undefined ? 1 : Number(m[4]),
    };
  }
  if (v === 'white') return { r: 255, g: 255, b: 255, a: 1 };
  if (v === 'black') return { r: 0, g: 0, b: 0, a: 1 };
  return null;
}

/** Resolve a token to a concrete color, following var() chains. */
function resolveColor(name, map, seen = new Set()) {
  if (seen.has(name)) {
    throw new Error(`Circular var() reference at ${name}`);
  }
  seen.add(name);
  const raw = map[name];
  if (raw === undefined) {
    throw new Error(`Token not found: ${name}`);
  }
  const varMatch = raw.match(/^var\(\s*(--[\w-]+)\s*(?:,[^)]*)?\)$/);
  if (varMatch) {
    return resolveColor(varMatch[1], map, seen);
  }
  const color = parseColor(raw);
  if (!color) {
    throw new Error(`Cannot parse color for ${name}: "${raw}"`);
  }
  return color;
}

/** Composite a (possibly translucent) color over an opaque backdrop. */
function composite(fg, backdrop) {
  if (fg.a >= 1) return fg;
  const a = fg.a;
  return {
    r: fg.r * a + backdrop.r * (1 - a),
    g: fg.g * a + backdrop.g * (1 - a),
    b: fg.b * a + backdrop.b * (1 - a),
    a: 1,
  };
}

function relativeLuminance({ r, g, b }) {
  const lin = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(c1, c2) {
  const l1 = relativeLuminance(c1);
  const l2 = relativeLuminance(c2);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

// ---------------------------------------------------------------------------
// Curated pairs (fg token, bg token)
// ---------------------------------------------------------------------------

const PAIRS = [
  ['--color-text-primary', '--color-background-surface'],
  ['--color-text-primary', '--color-background-page'],
  ['--color-text-secondary', '--color-background-surface'],
  ['--color-text-brand', '--color-background-surface'],
  ['--color-text-inverse', '--color-brand-primary'],
  // Buttons (real component tokens, see tokens.css ~L377-391)
  ['--component-button-primary-text', '--component-button-primary-fill'],
  ['--component-button-secondary-text', '--component-button-secondary-fill'],
  ['--component-button-danger-text', '--component-button-danger-fill'],
  // Status (no info variant exists in --color-status-*; "info" lives on the
  // Alert component as --component-alert-info-*)
  ['--color-status-success-text', '--color-status-success-bg'],
  ['--color-status-warning-text', '--color-status-warning-bg'],
  ['--color-status-error-text', '--color-status-error-bg'],
  ['--component-alert-info-text', '--component-alert-info-bg'],
  // Inputs
  ['--component-input-text', '--component-input-bg'],
  // Table header
  ['--component-table-header-text', '--component-table-header-bg'],
  // Progress label sits on the surface
  ['--color-progress-text', '--color-background-surface'],
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const css = readFileSync(TOKENS_CSS, 'utf8');
const blocks = parseBlocks(css);

const root = blocks[':root'];
if (!root) {
  console.error('Could not find :root block in tokens.css');
  process.exit(2);
}

const THEMES = {
  light: root,
  dark: { ...root, ...(blocks['[data-theme="dark"]'] || {}) },
  hc: { ...root, ...(blocks['[data-theme="hc"]'] || {}) },
};

let failures = 0;
let skipped = 0;

for (const [theme, map] of Object.entries(THEMES)) {
  console.log(`\n=== Theme: ${theme} ===`);
  console.log(
    `${'foreground'.padEnd(38)} ${'background'.padEnd(38)} ${'ratio'.padStart(7)}  result`,
  );
  console.log('-'.repeat(96));

  // Surface backdrop for alpha compositing within this theme.
  const surface = resolveColor('--color-background-surface', map);

  for (const [fgName, bgName] of PAIRS) {
    let line;
    try {
      let bg = resolveColor(bgName, map);
      bg = composite(bg, surface);
      let fg = resolveColor(fgName, map);
      fg = composite(fg, bg);

      const ratio = contrastRatio(fg, bg);
      const key = `${theme}|${fgName}|${bgName}`;
      let result;
      if (ratio >= THRESHOLD) {
        result = 'PASS';
      } else if (ALLOWLIST.has(key)) {
        result = 'SKIP (allowlisted)';
        skipped++;
      } else {
        result = 'FAIL';
        failures++;
      }
      line = `${fgName.padEnd(38)} ${bgName.padEnd(38)} ${ratio
        .toFixed(2)
        .padStart(6)}:1  ${result}`;
    } catch (err) {
      failures++;
      line = `${fgName.padEnd(38)} ${bgName.padEnd(38)} ${'ERR'.padStart(7)}  FAIL (${err.message})`;
    }
    console.log(line);
  }
}

console.log(
  `\n${failures} failure(s), ${skipped} allowlisted skip(s), threshold ${THRESHOLD}:1 (WCAG 2.1 AA normal text)`,
);
process.exit(failures > 0 ? 1 : 0);
