#!/usr/bin/env node
/**
 * Lepidus visual regression testing (VRT).
 *
 * Serves the static Storybook build, screenshots every story in each theme
 * (light / dark / hc via the `theme` global -> data-theme attribute set in
 * .storybook/preview.tsx), and compares against committed baselines with
 * pixelmatch.
 *
 * Usage:
 *   npm run vrt                 # compare against baselines, exit 1 on diffs
 *   npm run vrt:update          # (re)write baselines
 *   node scripts/vrt.mjs --grep button          # only story ids matching /button/
 *   node scripts/vrt.mjs --threshold 0.1        # pixelmatch per-pixel threshold
 *   node scripts/vrt.mjs --max-diff-ratio 0.001 # fail if >0.1% of pixels differ
 *
 * Output layout:
 *   .vrt/baseline/<theme>/<storyId>.png  (commit these)
 *   .vrt/actual/<theme>/<storyId>.png    (gitignored)
 *   .vrt/diff/<theme>/<storyId>.png      (gitignored)
 */

import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const STATIC_DIR = path.join(ROOT, 'storybook-static');
const VRT_DIR = path.join(ROOT, '.vrt');

const THEMES = ['light', 'dark', 'hc'];
const VIEWPORT = { width: 1024, height: 768 };
const CONCURRENCY = 4;
const SETTLE_MS = 250;

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { update: false, grep: null, threshold: 0.1, maxDiffRatio: 0.001 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--update' || a === '-u') args.update = true;
    else if (a === '--grep') args.grep = argv[++i];
    else if (a === '--threshold') args.threshold = Number(argv[++i]);
    else if (a === '--max-diff-ratio') args.maxDiffRatio = Number(argv[++i]);
    else if (a === '--help' || a === '-h') {
      console.log(
        'Usage: node scripts/vrt.mjs [--update] [--grep <pattern>] [--threshold <0..1>] [--max-diff-ratio <0..1>]',
      );
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${a}`);
      process.exit(2);
    }
  }
  if (Number.isNaN(args.threshold) || args.threshold < 0 || args.threshold > 1) {
    console.error('--threshold must be a number between 0 and 1');
    process.exit(2);
  }
  if (Number.isNaN(args.maxDiffRatio) || args.maxDiffRatio < 0 || args.maxDiffRatio > 1) {
    console.error('--max-diff-ratio must be a number between 0 and 1');
    process.exit(2);
  }
  return args;
}

// ---------------------------------------------------------------------------
// Tiny static file server (no extra deps)
// ---------------------------------------------------------------------------

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm',
};

function startStaticServer(rootDir) {
  const server = http.createServer((req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      let pathname = decodeURIComponent(url.pathname);
      if (pathname.endsWith('/')) pathname += 'index.html';
      const filePath = path.join(rootDir, path.normalize(pathname));
      // Path traversal guard.
      if (!filePath.startsWith(rootDir + path.sep) && filePath !== rootDir) {
        res.writeHead(403).end('Forbidden');
        return;
      }
      fs.stat(filePath, (err, stat) => {
        if (err || !stat.isFile()) {
          res.writeHead(404).end('Not found');
          return;
        }
        res.writeHead(200, {
          'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
          'Content-Length': stat.size,
          'Cache-Control': 'no-store',
        });
        fs.createReadStream(filePath).pipe(res);
      });
    } catch {
      res.writeHead(500).end('Internal error');
    }
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, baseUrl: `http://127.0.0.1:${server.address().port}` });
    });
  });
}

// ---------------------------------------------------------------------------
// Screenshot + compare
// ---------------------------------------------------------------------------

const DISABLE_MOTION_CSS = `
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    caret-color: transparent !important;
  }
`;

async function captureStory(page, baseUrl, storyId, theme) {
  const url = `${baseUrl}/iframe.html?id=${encodeURIComponent(storyId)}&globals=theme:${theme}&viewMode=story`;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
  await page.addStyleTag({ content: DISABLE_MOTION_CSS });
  // Surface Storybook render errors instead of screenshotting an error page.
  const errored = await page
    .locator('#error-message, .sb-show-errordisplay #error-message')
    .first()
    .isVisible()
    .catch(() => false);
  if (errored) {
    const msg = await page.locator('#error-message').first().textContent().catch(() => '');
    throw new Error(`story failed to render: ${(msg || 'unknown error').trim().slice(0, 200)}`);
  }
  await page.waitForTimeout(SETTLE_MS);

  let clip = null;
  const root = page.locator('#storybook-root');
  if ((await root.count()) > 0) {
    const box = await root.boundingBox().catch(() => null);
    if (box && box.width >= 1 && box.height >= 1) {
      // Clamp to the viewport-aligned full page bounds; round outward so we
      // never lose sub-pixel edges.
      const x = Math.max(0, Math.floor(box.x));
      const y = Math.max(0, Math.floor(box.y));
      clip = {
        x,
        y,
        width: Math.max(1, Math.ceil(box.x + box.width) - x),
        height: Math.max(1, Math.ceil(box.y + box.height) - y),
      };
    }
  }
  return page.screenshot({
    fullPage: true,
    animations: 'disabled',
    ...(clip ? { clip } : {}),
  });
}

function padToSize(png, width, height) {
  if (png.width === width && png.height === height) return png;
  const out = new PNG({ width, height, fill: true });
  // White background so size mismatches show up as diffs, not noise.
  out.data.fill(255);
  PNG.bitblt(png, out, 0, 0, Math.min(png.width, width), Math.min(png.height, height), 0, 0);
  return out;
}

function comparePngs(baselineBuf, actualBuf, threshold) {
  const base = PNG.sync.read(baselineBuf);
  const act = PNG.sync.read(actualBuf);
  const width = Math.max(base.width, act.width);
  const height = Math.max(base.height, act.height);
  const a = padToSize(base, width, height);
  const b = padToSize(act, width, height);
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(a.data, b.data, diff.data, width, height, { threshold });
  return {
    diffPixels,
    totalPixels: width * height,
    diffRatio: diffPixels / (width * height),
    sizeMismatch: base.width !== act.width || base.height !== act.height,
    diffPng: diff,
  };
}

// ---------------------------------------------------------------------------
// Worker pool
// ---------------------------------------------------------------------------

async function runPool(tasks, workerCount, makeWorker) {
  const queue = [...tasks];
  const workers = [];
  for (let i = 0; i < Math.min(workerCount, queue.length); i++) {
    workers.push(
      (async () => {
        const ctx = await makeWorker();
        try {
          for (;;) {
            const task = queue.shift();
            if (!task) break;
            await task(ctx);
          }
        } finally {
          await ctx.dispose();
        }
      })(),
    );
  }
  await Promise.all(workers);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const indexPath = path.join(STATIC_DIR, 'index.json');
  if (!fs.existsSync(indexPath)) {
    console.error(
      'ERROR: storybook-static/index.json not found.\n' +
        'Build the static Storybook first:\n\n    npm run build-storybook\n',
    );
    process.exit(1);
  }

  const index = JSON.parse(await fsp.readFile(indexPath, 'utf8'));
  let storyIds = Object.values(index.entries ?? {})
    .filter((e) => e.type === 'story')
    .map((e) => e.id);

  if (args.grep) {
    const re = new RegExp(args.grep, 'i');
    storyIds = storyIds.filter((id) => re.test(id));
  }
  if (storyIds.length === 0) {
    console.error(args.grep ? `No stories match --grep "${args.grep}".` : 'No stories found in index.json.');
    process.exit(1);
  }

  console.log(
    `VRT: ${storyIds.length} stories x ${THEMES.length} themes = ${storyIds.length * THEMES.length} snapshots ` +
      `(mode: ${args.update ? 'update baselines' : 'compare'}, threshold: ${args.threshold}, max-diff-ratio: ${args.maxDiffRatio})`,
  );

  for (const theme of THEMES) {
    await fsp.mkdir(path.join(VRT_DIR, 'baseline', theme), { recursive: true });
    if (!args.update) {
      await fsp.mkdir(path.join(VRT_DIR, 'actual', theme), { recursive: true });
      await fsp.mkdir(path.join(VRT_DIR, 'diff', theme), { recursive: true });
    }
  }

  const { server, baseUrl } = await startStaticServer(STATIC_DIR);
  const browser = await chromium.launch();

  const stats = {};
  for (const theme of THEMES) stats[theme] = { PASS: 0, FAIL: 0, NEW: 0, UPDATED: 0, ERROR: 0 };
  const failures = [];

  const tasks = [];
  for (const theme of THEMES) {
    for (const storyId of storyIds) {
      tasks.push(async ({ page }) => {
        const label = `${theme}/${storyId}`;
        try {
          const actualBuf = await captureStory(page, baseUrl, storyId, theme);
          const baselinePath = path.join(VRT_DIR, 'baseline', theme, `${storyId}.png`);

          if (args.update) {
            await fsp.writeFile(baselinePath, actualBuf);
            stats[theme].UPDATED++;
            console.log(`  UPDATED  ${label}`);
            return;
          }

          await fsp.writeFile(path.join(VRT_DIR, 'actual', theme, `${storyId}.png`), actualBuf);

          if (!fs.existsSync(baselinePath)) {
            await fsp.writeFile(baselinePath, actualBuf);
            stats[theme].NEW++;
            console.log(`  NEW      ${label} (baseline written)`);
            return;
          }

          const baselineBuf = await fsp.readFile(baselinePath);
          const result = comparePngs(baselineBuf, actualBuf, args.threshold);
          if (result.diffRatio > args.maxDiffRatio) {
            const diffPath = path.join(VRT_DIR, 'diff', theme, `${storyId}.png`);
            await fsp.writeFile(diffPath, PNG.sync.write(result.diffPng));
            stats[theme].FAIL++;
            const pct = (result.diffRatio * 100).toFixed(3);
            const size = result.sizeMismatch ? ', size changed' : '';
            failures.push(`${label} (${pct}% pixels differ${size}) -> ${path.relative(ROOT, diffPath)}`);
            console.log(`  FAIL     ${label} (${pct}% > ${(args.maxDiffRatio * 100).toFixed(3)}%${size})`);
          } else {
            stats[theme].PASS++;
            console.log(`  PASS     ${label}`);
          }
        } catch (err) {
          stats[theme].ERROR++;
          failures.push(`${label} (error: ${err.message})`);
          console.log(`  ERROR    ${label} (${err.message})`);
        }
      });
    }
  }

  try {
    await runPool(tasks, CONCURRENCY, async () => {
      const context = await browser.newContext({
        viewport: VIEWPORT,
        deviceScaleFactor: 1,
        reducedMotion: 'reduce',
      });
      const page = await context.newPage();
      return { page, dispose: () => context.close() };
    });
  } finally {
    await browser.close();
    server.close();
  }

  console.log('\nSummary:');
  for (const theme of THEMES) {
    const s = stats[theme];
    const parts = args.update
      ? [`UPDATED ${s.UPDATED}`]
      : [`PASS ${s.PASS}`, `FAIL ${s.FAIL}`, `NEW ${s.NEW}`];
    if (s.ERROR) parts.push(`ERROR ${s.ERROR}`);
    console.log(`  ${theme.padEnd(5)} ${parts.join('  ')}`);
  }

  if (failures.length > 0) {
    console.log('\nFailures:');
    for (const f of failures) console.log(`  - ${f}`);
    if (!args.update) {
      console.log('\nIf these changes are intentional, refresh baselines with: npm run vrt:update');
    }
    process.exit(1);
  }
  console.log(args.update ? '\nBaselines updated.' : '\nAll visual snapshots passed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
