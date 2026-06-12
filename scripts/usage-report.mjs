#!/usr/bin/env node
/**
 * usage-report.mjs — adoption telemetry for consuming codebases.
 *
 * Point it at one or more app source trees and it reports which Lepidus
 * components and tokens they use, so the systems team knows where to invest.
 *
 *   node scripts/usage-report.mjs ../some-app/src ../other-app/src
 *   node scripts/usage-report.mjs            # no args: scans this repo's patterns/
 *
 * Component detection: JSX usage `<Name` for every exported component name.
 * Token detection: var(--token-name) occurrences mapped back to tokens.css.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const targets = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [join(root, 'packages/react/src/patterns')];

const componentNames = readdirSync(join(root, 'packages/react/src/components')).filter(
  (d) => !d.includes('.')
);
const tokenNames = [
  ...new Set(
    [...readFileSync(join(root, 'packages/tokens/build/css/tokens.css'), 'utf8').matchAll(/^\s+(--[A-Za-z0-9-]+):/gm)].map((m) => m[1])
  ),
];

const walk = (dir, out = []) => {
  for (const f of readdirSync(dir)) {
    if (f === 'node_modules' || f.startsWith('.')) continue;
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?|css|scss)$/.test(f)) out.push(p);
  }
  return out;
};

const componentHits = new Map(componentNames.map((c) => [c, 0]));
const tokenHits = new Map();
let files = 0;

for (const target of targets) {
  let list;
  try {
    list = walk(target);
  } catch {
    console.error(`✗ cannot read ${target}`);
    continue;
  }
  for (const file of list) {
    files++;
    const src = readFileSync(file, 'utf8');
    for (const c of componentNames) {
      const n = (src.match(new RegExp(`<${c}[\\s/>]`, 'g')) ?? []).length;
      if (n) componentHits.set(c, componentHits.get(c) + n);
    }
    for (const m of src.matchAll(/var\((--[A-Za-z0-9-]+)/g)) {
      if (tokenNames.includes(m[1])) tokenHits.set(m[1], (tokenHits.get(m[1]) ?? 0) + 1);
    }
  }
}

const used = [...componentHits].filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
const unused = [...componentHits].filter(([, n]) => n === 0).map(([c]) => c);

console.log(`Scanned ${files} files in: ${targets.join(', ')}\n`);
console.log('Component usage (JSX occurrences):');
for (const [c, n] of used) console.log(`  ${String(n).padStart(4)}  ${c}`);
console.log(`\nUnused components (${unused.length}): ${unused.join(', ') || '—'}`);
const topTokens = [...tokenHits].sort((a, b) => b[1] - a[1]).slice(0, 20);
console.log('\nTop 20 tokens:');
for (const [t, n] of topTokens) console.log(`  ${String(n).padStart(4)}  ${t}`);
console.log(`\nDistinct tokens used: ${tokenHits.size} of ${tokenNames.length}`);
