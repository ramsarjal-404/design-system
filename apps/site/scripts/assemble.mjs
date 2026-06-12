#!/usr/bin/env node
/**
 * assemble.mjs — final deploy layout
 *
 * Copies the Storybook build (repo-root storybook-static/) into the site's
 * dist as /storybook/, producing the single Vercel output directory:
 *
 *   apps/site/dist/
 *     index.html …            ← docs site
 *     llms.txt, component-manifest.json, lepidus/…  ← stable root URLs
 *     storybook/               ← full Storybook (iframe.html powers embeds)
 */
import { cpSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(siteRoot, '../..');
const sbStatic = join(repoRoot, 'storybook-static');
const dist = join(siteRoot, 'dist');

if (!existsSync(sbStatic)) {
  console.error('✗ storybook-static/ missing — run npm run build-storybook first');
  process.exit(1);
}
if (!existsSync(dist)) {
  console.error('✗ apps/site/dist missing — run the site build first');
  process.exit(1);
}
cpSync(sbStatic, join(dist, 'storybook'), { recursive: true });
console.log('✓ assembled apps/site/dist (site + /storybook/)');
