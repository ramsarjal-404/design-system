#!/usr/bin/env node
/**
 * Axe accessibility audit of the plain-HTML/CSS demo page
 * (packages/css/demo/index.html) in all three themes.
 *
 * The React stories are already axe-gated by test-storybook; this gate gives
 * the @lepidus/css markup patterns the same guarantee — if the documented
 * plain-HTML markup has WCAG violations, CI fails.
 *
 * Also audits the open states that only exist after interaction (modal open,
 * dropdown open), since hidden content is skipped by axe.
 */
import { readFileSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AXE_SOURCE = readFileSync(path.join(ROOT, 'node_modules/axe-core/axe.min.js'), 'utf8');
const THEMES = ['light', 'dark', 'hc'];

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };
const server = http.createServer((req, res) => {
  const file = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  try {
    const body = readFileSync(file);
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, r));
const url = `http://127.0.0.1:${server.address().port}/packages/css/demo/index.html`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
let failures = 0;

async function audit(label) {
  const result = await page.evaluate(async () => {
    // Avatar initials are aria-hidden decoration (name comes from the
    // wrapper's aria-label); their contrast on the chart-series fills is a
    // documented known limitation, exempted exactly like the React Avatar
    // stories (Avatar.stories.tsx disables the color-contrast rule).
    const r = await window.axe.run(
      { exclude: [['.lp-avatar__fallback']] },
      { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } }
    );
    return r.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.slice(0, 3).map((n) => n.target.join(' ')),
    }));
  });
  if (result.length === 0) {
    console.log(`  PASS  ${label}`);
  } else {
    failures += result.length;
    for (const v of result) {
      console.error(`  FAIL  ${label} — ${v.id} (${v.impact}): ${v.help}`);
      for (const n of v.nodes) console.error(`          ${n}`);
    }
  }
}

for (const theme of THEMES) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.addScriptTag({ content: AXE_SOURCE });
  // Components transition background-color on theme change (160-180ms);
  // axe must measure settled colors, not mid-transition blends.
  await page.addStyleTag({
    content: '*, *::before, *::after { transition: none !important; animation: none !important; }',
  });
  await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
  console.log(`Theme: ${theme}`);
  await audit(`${theme}/page`);

  // open states — axe skips display:none content
  await page.click('[data-lp-modal-open]');
  await audit(`${theme}/modal-open`);
  await page.keyboard.press('Escape');
  await page.click('.lp-dropdown__trigger');
  await audit(`${theme}/dropdown-open`);
  await page.keyboard.press('Escape');
}

await browser.close();
server.close();

if (failures) {
  console.error(`\n✖ ${failures} accessibility violation(s) in the plain-HTML demo.`);
  process.exit(1);
}
console.log('\n✓ plain-HTML demo passes axe (WCAG 2.1 AA) in all themes, incl. open modal/dropdown');
