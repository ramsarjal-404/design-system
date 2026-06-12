/**
 * Parses the generated tokens.css (Style Dictionary output) into structured
 * data for the token reference pages: every CSS variable with its light value
 * and per-theme overrides.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import curated from '../data/token-descriptions.json';

export interface Token {
  name: string;
  /** value in :root (light theme) */
  light: string;
  dark?: string;
  hc?: string;
  group: string;
  description: string;
}

/**
 * Human description for a token: the curated $description from the DTCG
 * sources when present, otherwise derived from the naming grammar.
 */
const COMPONENT_PARTS: Record<string, string> = {
  fill: 'background fill',
  bg: 'background',
  text: 'text color',
  stroke: 'border color',
  border: 'border color',
  radius: 'corner radius',
  gap: 'inner gap',
  paddingx: 'horizontal padding',
  paddingy: 'vertical padding',
  fontsize: 'font size',
  lineheight: 'line height',
};

export function describe(name: string): string {
  const known = (curated as Record<string, string>)[name];
  if (known) return known;
  const n = name.replace(/^--/, '');

  let m = n.match(/^component-([a-z]+)-(.+)$/);
  if (m) {
    const comp = m[1].charAt(0).toUpperCase() + m[1].slice(1);
    const rest = m[2].split('-');
    const last = rest[rest.length - 1].toLowerCase();
    const part = COMPONENT_PARTS[last] ?? rest[rest.length - 1];
    const variant = rest.slice(0, -1).join(' ');
    return variant ? `${comp} — ${part} of the ${variant} state/variant.` : `${comp} — ${part}.`;
  }
  m = n.match(/^color-background-(.+)$/);
  if (m) return `Surface background — ${m[1].replace(/-/g, ' ')}.`;
  m = n.match(/^color-text-(.+)$/);
  if (m) return `Text color — ${m[1].replace(/-/g, ' ')}.`;
  m = n.match(/^color-border-(.+)$/);
  if (m) return `Border color — ${m[1].replace(/-/g, ' ')}.`;
  m = n.match(/^color-status-([a-z]+)-(bg|text)$/);
  if (m) return `Status ${m[1]} — ${m[2] === 'bg' ? 'background' : 'text'} of badges, tags, and messages.`;
  if (n.startsWith('color-chart-')) return 'Categorical chart series color — also used for avatar fallbacks.';
  if (n.startsWith('color-')) return `Semantic color — ${n.replace(/^color-/, '').replace(/-/g, ' ')}.`;
  m = n.match(/^space-(\d+)$/);
  if (m) return `Spacing step ${m[1]} of the scale — gaps, padding, margins.`;
  if (n.startsWith('radius-')) return `Corner radius — ${n.replace(/^radius-/, '').replace(/-/g, ' ')}.`;
  if (n.startsWith('font-size-')) return `Type scale size.`;
  if (n.startsWith('font-weight-')) return `Font weight — ${n.replace(/^font-weight-/, '')}.`;
  if (n.startsWith('font-family')) return 'Product type family (Open Sans).';
  if (n.startsWith('typography-')) return `Composite type style — ${n.replace(/^typography-/, '').replace(/-/g, ' ')}.`;
  if (n.startsWith('shadow-')) return `Elevation shadow part — ${n.replace(/^shadow-/, '').replace(/-/g, ' ')}.`;
  if (n.startsWith('duration-')) return `Motion duration — ${n.replace(/^duration-/, '')} transitions.`;
  if (n.startsWith('easing-')) return `Motion easing curve — ${n.replace(/^easing-/, '')}.`;
  if (n.startsWith('z-')) return `Stacking layer — ${n.replace(/^z-/, '').replace(/-/g, ' ')}.`;
  if (n.startsWith('breakpoint-')) return `Responsive breakpoint — ${n.replace(/^breakpoint-/, '')}.`;
  if (n.startsWith('opacity-')) return `Opacity — ${n.replace(/^opacity-/, '').replace(/-/g, ' ')}.`;
  if (/^(gray|blue|red|green|yellow|orange|cyan|lightblue|navy|white|black|chart)/.test(n))
    return 'Primitive — reference through semantic tokens, not directly.';
  return '';
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
    description: describe(name),
  }));
}

export const isColor = (value: string) =>
  /^#|^rgb|^hsl|^oklch/.test(value) || /var\(--(?:color|gray|blue|red|green|yellow|orange|white|black)/.test(value);
