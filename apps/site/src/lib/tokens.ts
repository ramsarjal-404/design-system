/**
 * Parses the generated tokens.css (Style Dictionary output) into structured
 * data for the token reference pages: every CSS variable with its light value
 * and per-theme overrides.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export interface Token {
  name: string;
  /** value in :root (light theme) */
  light: string;
  dark?: string;
  hc?: string;
  group: string;
}

const cssPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../public/lepidus/tokens.css'
);

function parseBlock(css: string, selectorRe: RegExp): Map<string, string> {
  const out = new Map<string, string>();
  const m = css.match(selectorRe);
  if (!m) return out;
  for (const decl of m[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    out.set(decl[1], decl[2].trim());
  }
  return out;
}

export function groupOf(name: string): string {
  if (name.startsWith('--component-')) return 'Component';
  if (name.startsWith('--color-')) return 'Color (semantic)';
  if (name.startsWith('--space-')) return 'Spacing';
  if (name.startsWith('--radius-')) return 'Radius';
  if (name.startsWith('--font-') || name.startsWith('--line-height')) return 'Typography';
  if (name.startsWith('--shadow-')) return 'Shadow';
  if (name.startsWith('--duration-') || name.startsWith('--easing-')) return 'Motion';
  if (name.startsWith('--z-')) return 'Z-index';
  if (name.startsWith('--breakpoint-')) return 'Breakpoints';
  return 'Primitives';
}

export function loadTokens(): Token[] {
  const css = readFileSync(cssPath, 'utf8');
  const root = parseBlock(css, /:root\s*\{([\s\S]*?)\n\}/);
  const dark = parseBlock(css, /\[data-theme=['"]dark['"]\]\s*\{([\s\S]*?)\n\}/);
  const hc = parseBlock(css, /\[data-theme=['"]hc['"]\]\s*\{([\s\S]*?)\n\}/);

  return [...root.entries()].map(([name, light]) => ({
    name,
    light,
    dark: dark.get(name),
    hc: hc.get(name),
    group: groupOf(name),
  }));
}

export const isColor = (value: string) =>
  /^#|^rgb|^hsl|^oklch/.test(value) || /var\(--(?:color|gray|blue|red|green|yellow|orange|white|black)/.test(value);
