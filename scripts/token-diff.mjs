#!/usr/bin/env node
/**
 * token-diff.mjs — report what a token import changed.
 *
 * Compares packages/tokens/src/*.tokens.json against the last git commit and
 * prints added / removed / changed tokens per file. Run after
 * `npm run tokens:import` and before committing, so every Figma sync lands
 * with a reviewable token changelog.
 *
 *   node scripts/token-diff.mjs            # diff vs HEAD
 *   node scripts/token-diff.mjs <ref>      # diff vs any git ref
 */
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ref = process.argv[2] ?? 'HEAD';
const SRC = 'packages/tokens/src';

const leaves = (node, prefix = '') => {
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && '$value' in v) out[p] = v.$value;
    else if (v && typeof v === 'object') Object.assign(out, leaves(v, p));
  }
  return out;
};

const fromGit = (file) => {
  try {
    return JSON.parse(execSync(`git show ${ref}:${SRC}/${file}`, { cwd: root, stdio: ['pipe', 'pipe', 'ignore'] }).toString());
  } catch {
    return null; // file didn't exist at ref
  }
};

let total = 0;
for (const file of readdirSync(join(root, SRC)).filter((f) => f.endsWith('.tokens.json')).sort()) {
  const now = leaves(JSON.parse(readFileSync(join(root, SRC, file), 'utf8')));
  const old = fromGit(file);
  if (old === null) {
    console.log(`\n${file}: NEW FILE (${Object.keys(now).length} tokens)`);
    total += Object.keys(now).length;
    continue;
  }
  const was = leaves(old);
  const added = Object.keys(now).filter((k) => !(k in was));
  const removed = Object.keys(was).filter((k) => !(k in now));
  const changed = Object.keys(now).filter((k) => k in was && JSON.stringify(now[k]) !== JSON.stringify(was[k]));
  if (!added.length && !removed.length && !changed.length) continue;
  console.log(`\n${file}:`);
  for (const k of added) console.log(`  + ${k} = ${JSON.stringify(now[k])}`);
  for (const k of removed) console.log(`  - ${k} (was ${JSON.stringify(was[k])})`);
  for (const k of changed) console.log(`  ~ ${k}: ${JSON.stringify(was[k])} → ${JSON.stringify(now[k])}`);
  total += added.length + removed.length + changed.length;
}
console.log(total ? `\n${total} token change(s) vs ${ref}.` : `No token changes vs ${ref}.`);
