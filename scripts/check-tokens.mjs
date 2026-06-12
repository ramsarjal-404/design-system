#!/usr/bin/env node
/**
 * check-tokens.mjs — Lepidus design-system token audit (CI gate)
 *
 * 1. Every var(--token) referenced in component .module.css files must
 *    exist in the built tokens.css (runtime vars set from JS are allowlisted).
 * 2. No hardcoded hex colors outside var() fallbacks or comments.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tokensCss = readFileSync(
  join(root, 'packages/tokens/build/css/tokens.css'),
  'utf8'
);

// CSS custom properties set at runtime from component JS — not in the build
const RUNTIME_VARS = new Set([
  '--chart-label-width',
  '--component-input-label-width',
  '--thumb-offset',
  '--thumb-size',
  '--track-length',
]);

const componentsDir = join(root, 'packages/react/src/components');
let failures = 0;

for (const comp of readdirSync(componentsDir)) {
  let files;
  try {
    files = readdirSync(join(componentsDir, comp)).filter((f) =>
      f.endsWith('.module.css')
    );
  } catch {
    continue;
  }

  for (const file of files) {
    const path = join(componentsDir, comp, file);
    const css = readFileSync(path, 'utf8');

    // strip comments so documented hexes don't trip the check
    const code = css.replace(/\/\*[\s\S]*?\*\//g, '');

    for (const m of code.matchAll(/var\((--[A-Za-z0-9-]+)/g)) {
      const token = m[1];
      if (RUNTIME_VARS.has(token)) continue;
      if (!tokensCss.includes(`${token}:`)) {
        console.error(`✗ ${comp}/${file}: unresolved token ${token}`);
        failures++;
      }
    }

    // hex colors are only allowed as var() fallbacks: var(--x, #fff)
    const noVarFallbacks = code.replace(/var\(--[A-Za-z0-9-]+\s*,\s*[^)]*\)/g, '');
    for (const m of noVarFallbacks.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
      console.error(`✗ ${comp}/${file}: hardcoded color ${m[0]} outside a var() fallback`);
      failures++;
    }
  }
}

if (failures) {
  console.error(`\n${failures} token violation(s).`);
  process.exit(1);
}
console.log('✓ all component token references resolve; no hardcoded colors');
