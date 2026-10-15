#!/usr/bin/env node
/**
 * audit-design-md.mjs — proves design.md and llms-full.txt against the system.
 *
 * Every class name, token, hook, component, example, anchor, story id and
 * doc path the two generated files mention is checked against the source of
 * truth (manifest, tokens.css, lepidus.js, snippets, stories index, content
 * dirs) and every HTML example is run through the validator. Exit 1 on any
 * finding, so the files can only ship when nothing in them is wrong.
 *
 *   node apps/site/scripts/audit-design-md.mjs
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validate } from '../../../scripts/validate-lp-html.mjs';
import { DRIFT } from './ai-drift.mjs';

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(siteRoot, '../..');
const read = (p) => readFileSync(p, 'utf8');

const md = read(join(siteRoot, 'public/design.md'));
const full = read(join(siteRoot, 'public/llms-full.txt'));
const manifest = JSON.parse(read(join(repoRoot, 'public/component-manifest.json')));
const stories = JSON.parse(read(join(siteRoot, 'src/data/stories-index.json')));
const tokensCss = read(join(repoRoot, 'packages/tokens/build/css/tokens.css'));
const lepidusJs = read(join(repoRoot, 'packages/css/lepidus.js'));
const contentDir = join(siteRoot, 'src/content/components');
const snippetsDir = join(siteRoot, 'src/snippets');

const kebab = (n) => n.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2').toLowerCase();
const components = manifest.components.filter((c) => stories[c.name]).map((c) => ({ ...c, slug: kebab(c.name) }));
const legalClasses = new Set(components.flatMap((c) => c.plainCss?.classes ?? []));
const legalTokens = new Set([...tokensCss.matchAll(/(--[A-Za-z0-9-]+)\s*:/g)].map((m) => m[1]));
// runtime custom properties a component reads from inline style / a React prop (documented per component)
const runtimeVars = new Set(['--track-length', '--thumb-size', '--thumb-offset', '--component-input-label-width']);
const legalHooks = new Set([...lepidusJs.matchAll(/data-lp-[a-z-]+/g)].map((m) => m[0]));
const legalApi = new Set([...lepidusJs.matchAll(/^\s{4}(\w+): \w+,?$/gm)].map((m) => m[1]));
const storyIds = new Set(Object.values(stories).flatMap((s) => s.stories.map((x) => x.id)));
const patternSlugs = [...read(join(siteRoot, 'src/lib/patterns.ts')).matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);

const findings = [];
const F = (area, msg) => findings.push(`[${area}] ${msg}`);

// ------------------------------------------------------------ 1. structure
const fenceCount = (md.match(/^```/gm) || []).length;
if (fenceCount % 2) F('structure', `design.md: unbalanced code fences (${fenceCount})`);
for (const tag of ['Example', 'StoryEmbed', 'DoDont', 'Callout', 'RelatedCards']) {
  if (new RegExp(`<${tag}\\b`).test(md)) F('structure', `design.md: unconverted MDX tag <${tag}>`);
}
const h3s = [...md.matchAll(/^### ([A-Z][A-Za-z]+)$/gm)].map((m) => m[1]);
for (const c of components) {
  if (!h3s.includes(c.name)) F('coverage', `design.md: no section for ${c.name}`);
  if (!md.includes(`<a id="${c.slug}"></a>`)) F('anchors', `design.md: missing anchor for ${c.slug}`);
  if (!md.includes(`#### Hard-fail checks — ${c.name}`)) F('coverage', `design.md: ${c.name} has no hard-fail block`);
  if (c.plainCss && !md.includes(`#### Legal class set`)) F('coverage', `design.md: ${c.name} has no legal class set`);
}
const dup = h3s.filter((n, i) => h3s.indexOf(n) !== i);
if (dup.length) F('structure', `design.md: duplicate component sections: ${[...new Set(dup)].join(', ')}`);
// empty sections: a heading whose next non-blank line is a heading of the same or higher level
{
  const lines = md.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].match(/^(#{2,5}) (.+)$/);
    if (!h) continue;
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === '') j++;
    const n = lines[j]?.match(/^(#{1,6}) /);
    if (n && n[1].length <= h[1].length) F('structure', `design.md: empty section "${h[2]}"`);
  }
}

// ------------------------------------------------- 2. classes mentioned exist
const mentioned = (text) =>
  [...text.matchAll(/(?<![\w-])lp-[a-z0-9]+(?:[_-]+[a-z0-9]+)*/g)].map((m) => m[0]).filter((c) => !/[{*|]/.test(c));
const classSkip = new Set(['lp-tooltip-', 'lp-modal-', 'lp-autofocus']); // prose fragments like "lp-modal-open" hooks are covered by hooks check
for (const [label, text] of [['design.md', md], ['llms-full.txt', full]]) {
  const bad = new Set();
  for (const c of mentioned(text)) {
    if (legalClasses.has(c)) continue;
    if (legalHooks.has('data-' + c)) continue; // "lp-modal-open" quoted without data- prefix
    if (/^lp-(modal|dropdown|accordion|stepper|tabs|tooltip)-/.test(c)) continue; // hook fragments / keyframe prefixes
    if (c === 'lp-' || classSkip.has(c)) continue;
    if (DRIFT.some((d) => d.check.includes(c) || d.why.includes(c))) continue;
    bad.add(c);
  }
  // prose mentions of generic family names used in the rules text
  for (const c of bad) F('classes', `${label}: mentions "${c}" which is not a legal class`);
}

// -------------------------------------------------- 3. tokens mentioned exist
for (const [label, text] of [['design.md', md], ['llms-full.txt', full]]) {
  const bad = new Set();
  // only real token references: var(--x) uses, and backticked `--x` names of a token family
  for (const m of text.matchAll(/(var\(\s*|`)(--[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)/g)) {
    const t = m[2];
    const isVar = m[1].startsWith('var(');
    if (!isVar && !/^--(component|color|space|radius|typography|shadow|z|breakpoint|duration|easing|font|layout|chart|blur|opacity|border|surface)-/.test(t)) continue;
    const after = text.slice(m.index + m[0].length, m.index + m[0].length + 2);
    if (after.startsWith('-{') || after.startsWith('{') || after.startsWith('-*') || after.startsWith('*') || after.startsWith('-…')) continue; // pattern forms
    if (/^--(component|color|space|radius|typography|shadow|z|breakpoint|duration|easing|font|layout|chart|blur|opacity|border|surface|gray|blue|red|orange|green|yellow|lightblue|cyan|white|black)$/.test(t)) continue; // family names
    if (legalTokens.has(t) || runtimeVars.has(t)) continue;
    // a family name the docs refer to (`--shadow-low` → --shadow-low-offset-x …)
    if ([...legalTokens].some((l) => l.startsWith(t + '-'))) continue;
    // a wrong name quoted as the mistake in a drift rule
    if (DRIFT.some((d) => d.check.includes(t) || d.why.includes(t))) continue;
    // table rows of the token appendix are by construction legal; prose/examples are what we check
    bad.add(t);
  }
  for (const t of bad) F('tokens', `${label}: mentions token "${t}" which is not in tokens.css`);
}

// ------------------------------------------------------- 4. hooks and API
for (const h of md.matchAll(/data-lp-[a-z-]+/g)) if (!legalHooks.has(h[0])) F('hooks', `design.md: unknown hook ${h[0]}`);
for (const a of md.matchAll(/Lepidus\.([a-zA-Z]+)/g)) if (!legalApi.has(a[1])) F('hooks', `design.md: unknown API Lepidus.${a[1]}`);
for (const h of legalHooks) if (!md.includes(h)) F('hooks', `design.md never mentions the real hook ${h}`);

// ------------------------------------------- 5. every HTML example validates
const validateBlocks = (label, text) => {
  let n = 0;
  for (const m of text.matchAll(/```html\n([\s\S]*?)\n```/g)) {
    n++;
    const r = validate(m[1], `${label} block ${n}`);
    for (const f of r.fails) F('examples', `${label} html block ${n}: ${f}`);
  }
  return n;
};
const mdBlocks = validateBlocks('design.md', md);
const fullBlocks = validateBlocks('llms-full.txt', full);

// ------------------------------------- 6. every snippet embedded verbatim
let snippetCount = 0;
for (const d of readdirSync(snippetsDir)) {
  if (!existsSync(join(contentDir, d))) continue;
  for (const f of readdirSync(join(snippetsDir, d))) {
    snippetCount++;
    const body = read(join(snippetsDir, d, f)).trim();
    if (!md.includes(body)) F('snippets', `design.md: ${d}/${f} not embedded verbatim`);
    if (f.endsWith('.html') && !full.includes(body)) F('snippets', `llms-full.txt: ${d}/${f} not embedded verbatim`);
  }
}
for (const f of readdirSync(join(siteRoot, 'examples'))) {
  if (!md.includes(read(join(siteRoot, 'examples', f)).trim())) F('snippets', `design.md: worked example ${f} not embedded`);
}

// ---------------------------------------------------- 7. anchors + links
for (const m of md.matchAll(/\]\(#([a-z0-9-]+)\)/g)) {
  const id = m[1];
  const ok = md.includes(`<a id="${id}"></a>`) || new RegExp(`^#{1,6} .*${id.replace(/-/g, '[ -]')}`, 'im').test(md) || /^\d+-/.test(id);
  if (!ok) F('anchors', `design.md: link to #${id} has no target`);
}
for (const m of md.matchAll(/\/components\/([a-z0-9-]+)\//g)) if (!existsSync(join(contentDir, m[1]))) F('links', `design.md: /components/${m[1]}/ does not exist`);
for (const m of md.matchAll(/\/patterns\/([a-z0-9-]+)\//g)) if (!patternSlugs.includes(m[1])) F('links', `design.md: /patterns/${m[1]}/ does not exist`);
for (const m of md.matchAll(/path=\/story\/([a-z0-9-]+)/g)) if (!storyIds.has(m[1])) F('links', `design.md: story ${m[1]} not in stories index`);

// --------------------------------------------- 8. claims match the system
const reactOnly = components.filter((c) => !c.plainCss).map((c) => c.name).sort();
const claimed = md.match(/react_only_components: \[([^\]]*)\]/)?.[1].split(',').map((s) => s.trim()).sort() ?? [];
if (claimed.join() !== reactOnly.join()) F('claims', `design.md react-only list ≠ manifest (${claimed.join(', ')} vs ${reactOnly.join(', ')})`);
if (!md.includes(`components: ${components.length}`)) F('claims', `design.md component count ≠ ${components.length}`);
if (!md.includes(`plain_css_components: ${components.filter((c) => c.plainCss).length}`)) F('claims', 'design.md plain-css count mismatch');
for (const d of DRIFT) {
  for (const slug of d.components) {
    if (!existsSync(join(contentDir, slug))) F('drift', `ai-drift.mjs references unknown component slug "${slug}"`);
    const c = components.find((x) => x.slug === slug || kebab(x.name) === slug);
    if (c && !md.includes(d.check)) F('drift', `design.md: drift rule for ${slug} missing`);
  }
  if (!full.includes(d.check)) F('drift', `llms-full.txt: drift rule missing: ${d.check.slice(0, 50)}…`);
}

// --------------------------------------- 9. React examples: imports + props
const reactSrc = join(repoRoot, 'packages/react/src');
const reactExports = new Set();
for (const d of readdirSync(join(reactSrc, 'components'))) {
  const idx = join(reactSrc, 'components', d, 'index.ts');
  if (!existsSync(idx)) continue;
  for (const m of read(idx).matchAll(/export\s*(?:type\s*)?\{([^}]*)\}/g))
    for (const n of m[1].split(',')) { const name = n.trim().split(/\s+as\s+/).pop().replace(/^type\s+/, ''); if (name) reactExports.add(name); }
  for (const m of read(idx).matchAll(/export\s+\*\s+from\s+'\.\/([\w./-]+)'/g)) {
    const f = [join(reactSrc, 'components', d, m[1] + '.ts'), join(reactSrc, 'components', d, m[1] + '.tsx')].find(existsSync);
    if (f) for (const e of read(f).matchAll(/export\s+(?:const|function|class)\s+(\w+)/g)) reactExports.add(e[1]);
  }
}
for (const e of read(join(reactSrc, 'icons/index.tsx')).matchAll(/export\s+(?:const|function)\s+(\w+)/g)) reactExports.add(e[1]);
for (const e of read(join(reactSrc, 'components/ActionItem/actionIcons.tsx')).matchAll(/export\s+const\s+(\w+)/g)) reactExports.add(e[1]);
const domAttrs = new Set(['className', 'style', 'children', 'key', 'ref', 'id', 'name', 'type', 'value', 'defaultValue', 'defaultChecked', 'checked', 'placeholder', 'disabled', 'required', 'readOnly', 'rows', 'cols', 'min', 'max', 'step', 'href', 'target', 'rel', 'src', 'alt', 'width', 'height', 'title', 'role', 'tabIndex', 'autoFocus', 'htmlFor', 'size', 'hidden']);
const propsByName = new Map(manifest.components.map((c) => [c.name, new Set(c.props.map((p) => p.name))]));
let jsxBlocks = 0;
for (const m of md.matchAll(/```jsx\n([\s\S]*?)\n```/g)) {
  const code = m[1];
  jsxBlocks++;
  for (const im of code.matchAll(/import\s*\{([^}]*)\}\s*from\s*'@ramsarjal-404\/react'/g))
    for (const n of im[1].split(',').map((s) => s.trim()).filter(Boolean))
      if (!reactExports.has(n)) F('react', `design.md jsx block ${jsxBlocks}: "${n}" is not exported by @ramsarjal-404/react`);
  // brace-aware: attributes of <Name …> are the names at brace depth 0 before the
  // tag's own closing ">" — nested JSX inside {…} belongs to other components
  for (const open of code.matchAll(/<([A-Z]\w*)(?=[\s/>])/g)) {
    const name = open[1];
    if (!propsByName.has(name)) continue;
    const allowed = propsByName.get(name);
    let i = open.index + open[0].length, depth = 0, quote = null, attrText = '';
    for (; i < code.length; i++) {
      const ch = code[i];
      if (quote) { if (ch === quote) quote = null; attrText += depth === 0 ? ch : ' '; continue; }
      if (ch === '"' || ch === "'") { quote = ch; attrText += depth === 0 ? ch : ' '; continue; }
      if (ch === '{') { depth++; attrText += ' '; continue; }
      if (ch === '}') { depth--; attrText += ' '; continue; }
      if (ch === '>' && depth === 0) break;
      attrText += depth === 0 ? ch : ' ';
    }
    for (const a of attrText.matchAll(/(?:^|\s)([a-zA-Z][\w-]*)\s*=/g)) {
      const prop = a[1];
      if (allowed.has(prop) || domAttrs.has(prop) || /^(aria-|data-|on[A-Z])/.test(prop)) continue;
      F('react', `design.md jsx block ${jsxBlocks}: <${name} ${prop}=…> — "${prop}" is not a documented prop of ${name}`);
    }
  }
}

// ---------------------------------------------- 10. markdown tables well-formed
{
  const lines = md.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (!/^\|.*\|$/.test(lines[i]) || !/^\|[\s:-]+\|/.test(lines[i + 1] ?? '')) continue;
    const cells = (l) => l.split(/(?<!\\)\|/).length - 2;
    const n = cells(lines[i]);
    let j = i + 2;
    while (j < lines.length && /^\|.*\|$/.test(lines[j])) {
      if (cells(lines[j]) !== n) F('tables', `design.md line ${j + 1}: row has ${cells(lines[j])} cells, header has ${n}`);
      j++;
    }
    i = j;
  }
}

// ------------------------------- 10b. tables and fences actually render (GFM)
{
  const lines = md.split('\n');
  for (let i = 0; i < lines.length - 2; i++) {
    // a separator row followed by a blank line and then a pipe row = the rows fell out of the table
    if (/^\|[\s:|-]+\|$/.test(lines[i]) && lines[i + 1].trim() === '' && /^\|.*\|$/.test(lines[i + 2])) F('tables', `design.md line ${i + 3}: table rows separated from their header by a blank line (GFM ends the table)`);
  }
  // a ``` line with a language tag while already inside a ``` block = nested fence (breaks the outer one)
  let inside = null;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(```|~~~)([a-z]*)/);
    if (!m) continue;
    if (!inside) inside = m[1];
    else if (m[1] === inside) {
      if (m[2]) F('structure', `design.md line ${i + 1}: nested ${m[1]}${m[2]} fence inside an open ${inside} block`);
      inside = null;
    }
  }
  if (inside) F('structure', 'design.md: unterminated code fence');
}

// ------------------------- 10c. no raw HTML element tags in prose (outside code)
// Markdown passes raw HTML through; a bare <textarea>/<script>/<input> in prose is
// parsed by the browser as a real element and can swallow the rest of the document.
for (const [label, text] of [['design.md', md], ['llms-full.txt', full]]) {
  let inFence = false;
  text.split('\n').forEach((l, i) => {
    if (/^(```|~~~)/.test(l)) { inFence = !inFence; return; }
    if (inFence || /^ {4}/.test(l)) return; // fenced or indented code block
    const prose = l.replace(/`[^`]*`/g, '');
    for (const m of prose.matchAll(/<\/?(textarea|script|style|title|iframe|select|form|input|button|table|div|span|svg|label|ul|ol|li|p|pre|code)\b/gi)) {
      if (/^<a id="[a-z0-9-]+"><\/a>$/.test(l)) continue;
      F('html-in-prose', `${label} line ${i + 1}: raw <${m[1]}> tag outside code — wrap it in backticks`);
    }
  });
}

// ------------------------------- 11. class sets and token appendix are exact
for (const c of components.filter((x) => x.plainCss)) {
  const sec = md.slice(md.indexOf(`<a id="${c.slug}"></a>`));
  const line = sec.slice(sec.indexOf('#### Legal class set')).split('\n').find((l) => l.startsWith('`lp-'));
  const listed = new Set((line ?? '').match(/`([^`]+)`/g)?.map((s) => s.slice(1, -1)) ?? []);
  const expected = new Set(c.plainCss.classes);
  if (listed.size !== expected.size || [...expected].some((k) => !listed.has(k))) F('classes', `design.md: ${c.name} legal class set ≠ manifest (${listed.size} vs ${expected.size})`);
}
const rootBody = tokensCss.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
const rootVals = new Map([...rootBody.matchAll(/^\s*(--[A-Za-z0-9-]+)\s*:\s*([^;]+);/gm)].map((m) => [m[1], m[2].trim()]));
const themeVals = (t) => new Map([...(tokensCss.match(new RegExp(`\\[data-theme="${t}"\\]\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1] ?? '').matchAll(/^\s*(--[A-Za-z0-9-]+)\s*:\s*([^;]+);/gm)].map((m) => [m[1], m[2].trim()]));
const dark = themeVals('dark'), hc = themeVals('hc');
const appendix = md.slice(md.indexOf('## 11. Token reference'));
const esc = (s) => s.replace(/\|/g, '\\|');
for (const [t, v] of rootVals) {
  const row = appendix.split('\n').find((l) => l.startsWith(`| \`${t}\` |`));
  if (!row) { F('tokens', `design.md appendix: ${t} missing`); continue; }
  if (!row.includes(`| \`${esc(v)}\` |`)) F('tokens', `design.md appendix: ${t} light value ≠ tokens.css`);
  if (dark.has(t) && !row.includes(`\`${esc(dark.get(t))}\``)) F('tokens', `design.md appendix: ${t} dark value ≠ tokens.css`);
  if (hc.has(t) && !row.includes(`\`${esc(hc.get(t))}\``)) F('tokens', `design.md appendix: ${t} hc value ≠ tokens.css`);
}
const compTokSection = md.slice(md.indexOf('### Component tokens by component'), md.indexOf('## 4. Component inventory'));
for (const t of rootVals.keys()) if (t.startsWith('--component-') && !compTokSection.includes('`' + t + '`')) F('tokens', `design.md §3: component token ${t} not listed`);

// ----------------------------------------------- 12. placeholders / staleness
for (const [label, text] of [['design.md', md], ['llms-full.txt', full]]) {
  for (const bad of ['[object Object]', '__TOKENS__', '~0k tokens', 'Math.round(0)']) if (text.includes(bad)) F('placeholders', `${label} contains "${bad}"`);
  if (/\r/.test(text)) F('placeholders', `${label} has CR line endings`);
}
if (!/~\d+k tokens/.test(md)) F('placeholders', 'design.md: token-size claim not computed');

// ------------------------------------------------------------------ report
console.log(`audit: design.md ${(md.length / 1024).toFixed(0)} KB (${mdBlocks} html blocks) · llms-full.txt ${(full.length / 1024).toFixed(0)} KB (${fullBlocks} html blocks) · ${components.length} components · ${snippetCount} snippets · ${DRIFT.length} drift rules`);
if (findings.length) {
  console.log(`✖ ${findings.length} finding(s):`);
  const byArea = {}; for (const f of findings) (byArea[f.slice(1, f.indexOf(']'))] ??= []).push(f);
  for (const [a, list] of Object.entries(byArea)) { console.log(`-- ${a} (${list.length})`); for (const f of list.slice(0, 12)) console.log('   ' + f); if (list.length > 12) console.log(`   … +${list.length - 12} more`); }
  process.exit(1);
}
console.log('✓ design.md and llms-full.txt verified against manifest, tokens.css, lepidus.js, snippets, stories and content');
