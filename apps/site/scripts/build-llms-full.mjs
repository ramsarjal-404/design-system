#!/usr/bin/env node
/**
 * build-llms-full.mjs — llms-full.txt: the rules plus every copy-paste HTML
 * snippet, nothing else.
 *
 * llms.txt (≈2k tokens) is the contract and class inventory — enough to keep
 * an assistant on-system, not enough to show it the exact markup nesting.
 * design.md (≈160k tokens) has everything but only fits a knowledge base.
 * This file is the middle: ≈25k tokens, fits any current model's context in
 * one paste, and every example is real (the same files the Code tabs render).
 * Generated from the snippets at the end of prepare.mjs; never edit by hand.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { driftFor, driftMarkdown } from './ai-drift.mjs';

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(siteRoot, '../..');
import { DEFAULT_SITE_URL, SITE_URL as SITE } from './site-url.mjs';
const snippetsDir = join(siteRoot, 'src/snippets');
const contentDir = join(siteRoot, 'src/content/components');

// llms.txt is hand-written with the default domain; point it at this deployment.
const rules = readFileSync(join(repoRoot, 'public/llms.txt'), 'utf8').split(DEFAULT_SITE_URL).join(SITE);
const out = [];
out.push(
  '# Lepidus Design System — full context for AI assistants (llms-full.txt)',
  '',
  `> The rules from ${SITE}/llms.txt followed by every documented HTML example,`,
  '> verbatim. Paste this whole file (≈__TOKENS__k tokens) at the start of a chat, or',
  '> keep it in your repo for editor assistants. Every example below renders',
  '> correctly with lepidus.css + lepidus.js — reuse the nesting and attributes',
  '> exactly; the class inventory in the rules is the complete legal set.',
  '',
  '## Page shell (start here)',
  '',
  '```html',
  '<!doctype html>',
  '<html lang="en" data-theme="light">',
  '<head>',
  '  <meta charset="utf-8">',
  `  <link rel="stylesheet" href="${SITE}/v1/lepidus.css">`,
  '</head>',
  '<body>',
  '  <!-- components go here -->',
  `  <script src="${SITE}/v1/lepidus.js" defer></script>`,
  '</body>',
  '</html>',
  '```',
  '',
  '---',
  '',
  rules.trim(),
  '',
  '---',
  '',
  '## Observed AI drift — do not repeat these',
  '',
  'Mistakes real assistants made while composing markup (the copied examples were correct). Each is repeated under the affected component below:',
  '',
  driftMarkdown(),
  '',
  '---',
  '',
  '# Examples (plain HTML + lp- classes)',
  '',
  'Copy the nesting, classes and attributes exactly; change only content, ids and labels.',
  ''
);

const slugs = readdirSync(snippetsDir).filter((d) => existsSync(join(contentDir, d)));
let count = 0;
for (const slug of slugs.sort()) {
  const files = readdirSync(join(snippetsDir, slug)).filter((f) => f.endsWith('.html')).sort();
  if (!files.length) continue;
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  out.push(`## ${title}`, '', `Docs: ${SITE}/components/${slug}/`, '');
  const drift = driftFor(slug);
  if (drift.length) out.push('Hard rules for this component (observed drift):', '', ...drift.map((d) => `- ${d.check}`), '');
  for (const f of files) {
    const name = f.replace(/\.html$/, '').replace(/-/g, ' ');
    out.push(`### ${title} — ${name}`, '', '```html', readFileSync(join(snippetsDir, slug, f), 'utf8').trim(), '```', '');
    count++;
  }
}
out.push(
  '---',
  '',
  'More: full reference with usage guidance, React props and all tokens —',
  `${SITE}/design.md · machine-readable manifest — ${SITE}/component-manifest.json`,
  ''
);
let text = out.join('\n');
text = text.replace('__TOKENS__', String(Math.round(text.length / 4 / 1000)));
writeFileSync(join(siteRoot, 'public/llms-full.txt'), text);
console.log(`✓ public/llms-full.txt — ${count} examples across ${slugs.length} components, ${(text.length / 1024).toFixed(0)} KB ≈ ${Math.round(text.length / 4 / 1000)}k tokens`);
