#!/usr/bin/env node
/**
 * prepare.mjs — site data layer
 *
 * 1. Copies the generated Lepidus artifacts the site serves/consumes:
 *      packages/tokens/build/css/tokens.css → public/lepidus/tokens.css
 *      packages/css/dist/lepidus.css|js     → public/lepidus/
 *      public/llms.txt + component-manifest.json → public/ (site root URLs
 *      stay identical to the old Storybook-root deployment)
 * 2. Generates src/data/stories-index.json by parsing the CSF story files —
 *    component → Storybook title, story ids (same sanitize algorithm
 *    Storybook uses), so embeds never hand-maintain ids.
 *
 * Artifacts must exist first (npm run tokens:css && npm run css &&
 * npm run manifest) — the root `site`/`build:site` scripts guarantee that;
 * this script fails loudly otherwise.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(siteRoot, '../..');

// ---------------------------------------------------------------- artifacts
const artifacts = [
  ['packages/tokens/build/css/tokens.css', 'public/lepidus/tokens.css'],
  ['packages/css/dist/lepidus.css', 'public/lepidus/lepidus.css'],
  ['packages/css/dist/lepidus.js', 'public/lepidus/lepidus.js'],
  ['public/llms.txt', 'public/llms.txt'],
  ['public/component-manifest.json', 'public/component-manifest.json'],
];
for (const [from, to] of artifacts) {
  const src = join(repoRoot, from);
  if (!existsSync(src)) {
    console.error(`✗ missing ${from} — run: npm run tokens:css && npm run css && npm run manifest`);
    process.exit(1);
  }
  const dest = join(siteRoot, to);
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest);
}

// ------------------------------------------------------------ story index
// Storybook's id sanitizer (storybook/csf `sanitize`) — for our ASCII
// titles this reduces to: non-alphanumeric runs become single dashes.
const sanitize = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
// export name → story name (storybook/csf `storyNameFromExport` = startCase)
const storyName = (exp) =>
  exp
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim();

const componentsDir = join(repoRoot, 'packages/react/src/components');
const index = {};
for (const dir of readdirSync(componentsDir).sort()) {
  const dirPath = join(componentsDir, dir);
  let stories;
  try {
    stories = readdirSync(dirPath).filter((f) => f.endsWith('.stories.tsx'));
  } catch {
    continue;
  }
  for (const file of stories) {
    const src = readFileSync(join(dirPath, file), 'utf8');
    // meta title only — always "Category/Name"; item/arg titles never have a slash
    const title = src.match(/title:\s*['"]([^'"]+\/[^'"]+)['"]/)?.[1];
    if (!title) continue;
    const exports = [...src.matchAll(/^export const (\w+)(?::|\s*=)/gm)]
      .map((m) => m[1])
      .filter((n) => n !== 'default' && /^[A-Z]/.test(n));
    const componentName = file.replace('.stories.tsx', '');
    index[componentName] = {
      title,
      category: title.split('/')[0],
      titleId: sanitize(title),
      stories: exports.map((exp) => ({
        export: exp,
        name: storyName(exp),
        id: `${sanitize(title)}--${sanitize(storyName(exp))}`,
      })),
    };
  }
}

const outPath = join(siteRoot, 'src/data/stories-index.json');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(index, null, 2) + '\n');

// ------------------------------------------------------------- thumbnails
// Card previews on the component index reuse the committed VRT baseline
// screenshot of each component's heroStory (light theme) — real renders,
// zero extra tooling, and they can never drift from the shipped UI.
const contentDir = join(siteRoot, 'src/content/components');
const thumbsDir = join(siteRoot, 'public/thumbs');
mkdirSync(thumbsDir, { recursive: true });
let thumbs = 0;
for (const slug of readdirSync(contentDir)) {
  const metaPath = join(contentDir, slug, 'meta.json');
  if (!existsSync(metaPath)) continue;
  const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
  const thumbStory = meta.thumbStory ?? meta.heroStory;
  if (!thumbStory) continue;
  const shot = join(repoRoot, '.vrt/baseline/light', `${thumbStory}.png`);
  if (existsSync(shot)) {
    cpSync(shot, join(thumbsDir, `${slug}.png`));
    thumbs++;
  }
}

console.log(
  `✓ site data ready — ${Object.keys(index).length} story files indexed, ${thumbs} thumbnails, artifacts copied to apps/site/public`
);
