#!/usr/bin/env node
/**
 * sanitize-icons.mjs
 * Cleans raw Figma SVG exports in packages/react/src/icons/svg/.
 *
 * Raw exports contain parent-frame contamination:
 *   - a background <rect> (fill #BABABA / #E8E8E8)
 *   - a giant translated frame rect
 *   - the component-set dashed outline path that precedes the variant group
 * The actual icon lives in the innermost <g id="Property 1=..."> subtree.
 *
 * This script extracts that subtree, re-wraps it in the original <svg>
 * (keeping width/height/viewBox/fill/xmlns), maps the monochrome icon color
 * #364765 to currentColor, and overwrites the file minified-ish.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SVG_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'packages/react/src/icons/svg');

/** Extract a balanced <g ...>...</g> subtree starting at `start` (index of '<g'). */
function extractBalancedGroup(svg, start) {
  let depth = 0;
  let i = start;
  while (i < svg.length) {
    const open = svg.indexOf('<g', i);
    const close = svg.indexOf('</g>', i);
    if (close === -1) return null;
    // Make sure '<g' is a real group tag (followed by space or '>')
    const isOpen = open !== -1 && open < close && /^<g[\s>]/.test(svg.slice(open, open + 3));
    if (isOpen) {
      depth += 1;
      i = open + 2;
    } else {
      depth -= 1;
      i = close + 4;
      if (depth === 0) return svg.slice(start, i);
    }
  }
  return null;
}

/** Find the innermost "Property 1=" group (last occurrence wins for nesting). */
function extractPropertyGroup(svg) {
  const marker = '<g id="Property 1=';
  let idx = svg.lastIndexOf(marker);
  if (idx === -1) return null;
  return extractBalancedGroup(svg, idx);
}

function getAttr(tag, name) {
  const m = tag.match(new RegExp(`${name}="([^"]*)"`));
  return m ? m[1] : null;
}

/** Fallback for plain-group frames: drop frame rects & out-of-viewBox paths. */
function fallbackSanitize(inner, vbW) {
  // Drop rects whose width/height equal viewBox size or are huge (>1000)
  inner = inner.replace(/<rect\b[^>]*\/?>(?:<\/rect>)?/g, (rect) => {
    const w = parseFloat(getAttr(rect, 'width') ?? 'NaN');
    const h = parseFloat(getAttr(rect, 'height') ?? 'NaN');
    if (w > 1000 || h > 1000) return '';
    if (w === vbW.w && h === vbW.h && !getAttr(rect, 'rx') && !getAttr(rect, 'x')) return '';
    return rect;
  });
  // Drop paths whose d starts with a coordinate clearly outside the viewBox
  inner = inner.replace(/<path\b[^>]*\/?>(?:<\/path>)?/g, (path) => {
    const d = getAttr(path, 'd');
    if (!d) return path;
    const m = d.match(/[ML]\s*(-?\d+(?:\.\d+)?)/i);
    if (m && Math.abs(parseFloat(m[1])) > 2 * vbW.w) return '';
    return path;
  });
  return inner;
}

const files = readdirSync(SVG_DIR).filter((f) => f.endsWith('.svg'));
let withProperty = 0;
let fallback = 0;
const issues = [];

for (const file of files) {
  const fullPath = join(SVG_DIR, file);
  const raw = readFileSync(fullPath, 'utf8');

  const rootTag = raw.match(/<svg\b[^>]*>/);
  if (!rootTag) {
    issues.push(`${file}: no <svg> root found, skipped`);
    continue;
  }
  const width = getAttr(rootTag[0], 'width');
  const height = getAttr(rootTag[0], 'height');
  const viewBox = getAttr(rootTag[0], 'viewBox');
  const fill = getAttr(rootTag[0], 'fill');
  const xmlns = getAttr(rootTag[0], 'xmlns') ?? 'http://www.w3.org/2000/svg';
  if (!viewBox) {
    issues.push(`${file}: no viewBox, skipped`);
    continue;
  }
  const [, , vw, vh] = viewBox.split(/\s+/).map(Number);

  let inner = extractPropertyGroup(raw);
  if (inner) {
    withProperty += 1;
  } else {
    fallback += 1;
    const open = raw.indexOf(rootTag[0]) + rootTag[0].length;
    const close = raw.lastIndexOf('</svg>');
    inner = fallbackSanitize(raw.slice(open, close), { w: vw, h: vh });
  }

  // Monochrome icon color -> currentColor (leave all other colors untouched)
  inner = inner
    .replace(/stroke="#364765"/gi, 'stroke="currentColor"')
    .replace(/fill="#364765"/gi, 'fill="currentColor"');

  // The set draws some mono icons in navy #0A1959 (= --blue-800, the light
  // theme's --color-icon-default). Map it to currentColor too, but ONLY when
  // the icon has no other color — multicolor brand icons keep their navy.
  const otherColors = new Set(
    [...inner.matchAll(/(?:stroke|fill)="(#[0-9a-fA-F]{3,8})"/g)].map((m) => m[1].toLowerCase())
  );
  otherColors.delete('#0a1959');
  if (otherColors.size === 0) {
    inner = inner
      .replace(/stroke="#0A1959"/gi, 'stroke="currentColor"')
      .replace(/fill="#0A1959"/gi, 'fill="currentColor"');
  }

  // Drop dangling clip-path references (the clipPath defs live outside the
  // Property group and are just the component frame bounds, i.e. equivalent
  // to the default svg viewport clip).
  inner = inner.replace(/\s*clip-path="url\(#([^)]+)\)"/g, (full, id) =>
    inner.includes(`id="${id}"`) ? full : ''
  );

  // Minify-ish: collapse whitespace runs
  inner = inner.replace(/\s+/g, ' ').replace(/> </g, '><').trim();

  const attrs = [
    width ? `width="${width}"` : '',
    height ? `height="${height}"` : '',
    `viewBox="${viewBox}"`,
    fill ? `fill="${fill}"` : '',
    `xmlns="${xmlns}"`,
  ]
    .filter(Boolean)
    .join(' ');

  writeFileSync(fullPath, `<svg ${attrs}>${inner}</svg>\n`);
}

console.log(`Sanitized ${files.length} svgs: ${withProperty} via Property-group extraction, ${fallback} via fallback.`);
if (issues.length) {
  console.log('Issues:');
  for (const issue of issues) console.log(`  - ${issue}`);
}
