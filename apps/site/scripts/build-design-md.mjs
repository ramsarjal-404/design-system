#!/usr/bin/env node
/**
 * build-design-md.mjs — design.md: the Lepidus AI Design Contract, generated.
 *
 * One Markdown file that lets an AI assistant (or a developer) produce UI that
 * is the documented Lepidus implementation — not a lookalike. Everything
 * component-specific is derived from the same sources the site renders, so
 * the contract cannot drift from the docs:
 *
 *   public/component-manifest.json   props + the legal lp- class inventory
 *   src/content/components/<slug>/    usage / code / accessibility MDX
 *   src/snippets/<slug>/*.{html,jsx}  canonical anatomy, verbatim
 *   packages/tokens/build/css/tokens.css  every token, per theme
 *   src/lib/patterns.ts               page patterns
 *
 * The rules, precedence, workflow, review gates and copy guidance are the
 * hand-written contract (kept in this file so they version with the code).
 * Runs at the end of prepare.mjs; served at /design.md; never edit the output.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DRIFT, driftFor, driftMarkdown } from './ai-drift.mjs';

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(siteRoot, '../..');
import { DEFAULT_SITE_URL, SITE_URL as SITE } from './site-url.mjs';

const manifest = JSON.parse(readFileSync(join(repoRoot, 'public/component-manifest.json'), 'utf8'));
const stories = JSON.parse(readFileSync(join(siteRoot, 'src/data/stories-index.json'), 'utf8'));
const tokensCss = readFileSync(join(repoRoot, 'packages/tokens/build/css/tokens.css'), 'utf8');
const lepidusJs = readFileSync(join(repoRoot, 'packages/css/lepidus.js'), 'utf8');
const patternsSrc = readFileSync(join(siteRoot, 'src/lib/patterns.ts'), 'utf8');
const contentDir = join(siteRoot, 'src/content/components');
const snippetsDir = join(siteRoot, 'src/snippets');

// ---------------------------------------------------------------- helpers
const kebab = (name) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
const CATEGORY_ORDER = ['Actions', 'Forms', 'Data Display', 'Feedback', 'Navigation', 'Overlays', 'Charts'];
const storyUrl = (id) => `${SITE}/storybook/?path=/story/${id}`;
const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : '');
// token estimate of a sibling generated file (llms-full.txt is built first in prepare.mjs)
const sizeK = (rel) => Math.max(1, Math.round(read(join(siteRoot, rel)).length / 4 / 1000));
// table cell: escape pipes, flatten newlines, and backtick any literal tag mention
// (<input>, <textarea> …) — a raw <textarea> in prose swallows the rest of the page when rendered
const cell = (s) =>
  String(s ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\n/g, ' ')
    .replace(/(^|[^`])(<\/?[a-zA-Z][\w-]*(?:\s[^<>`]*)?>)(?!`)/g, (_, pre, tag) => `${pre}\`${tag}\``);
const abs = (href) => (href.startsWith('/') ? SITE + href : href);
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\b${name}=(?:"([^"]*)"|\\{([^}]*)\\})`));
  return m ? (m[1] ?? m[2]) : undefined;
};
const unescapeHtml = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const htmlProseToMd = (s) =>
  s
    .replace(/<code>([\s\S]*?)<\/code>/g, (_, c) => '`' + unescapeHtml(c) + '`')
    .replace(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (_, href, text) => `[${text.trim()}](${abs(href)})`)
    .replace(/<strong>([\s\S]*?)<\/strong>/g, '**$1**')
    .replace(/<em>([\s\S]*?)<\/em>/g, '*$1*')
    .replace(/<\/?p>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
// content pages start at h2; in this file a component is h3 and its sections h4
const demote = (s) => s.replace(/^## (.+)$/gm, '##### $1').replace(/^### (.+)$/gm, '**$1**');

// ------------------------------------------------------------- components
const components = manifest.components
  .filter((c) => stories[c.name])
  .map((c) => {
    const slug = kebab(c.name);
    const dir = join(contentDir, slug);
    const metaPath = join(dir, 'meta.json');
    const snippetDir = join(snippetsDir, slug);
    const files = existsSync(snippetDir) ? readdirSync(snippetDir) : [];
    const code = read(join(dir, 'code.mdx'));
    // example titles from code.mdx, keyed by snippet name
    const titles = {};
    for (const m of code.matchAll(/<Example\b((?:"[^"]*"|[^>])*?)\/>/g)) {
      const sn = attr(m[1], 'snippet');
      if (sn) titles[sn.split('/')[1]] = attr(m[1], 'title');
    }
    const html = files.filter((f) => f.endsWith('.html')).sort().map((f) => ({ name: f.replace(/\.html$/, ''), src: readFileSync(join(snippetDir, f), 'utf8').trim() }));
    const jsx = files.filter((f) => f.endsWith('.jsx')).sort().map((f) => ({ name: f.replace(/\.jsx$/, ''), src: readFileSync(join(snippetDir, f), 'utf8').trim() }));
    return {
      ...c,
      slug,
      story: stories[c.name],
      category: stories[c.name].category ?? 'Components',
      meta: existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, 'utf8')) : {},
      usage: read(join(dir, 'usage.mdx')),
      code,
      a11y: read(join(dir, 'accessibility.mdx')),
      titles,
      html,
      jsx,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const categories = [...new Set(components.map((c) => c.category))].sort((a, b) => {
  const ia = CATEGORY_ORDER.indexOf(a), ib = CATEGORY_ORDER.indexOf(b);
  return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
});
const plain = components.filter((c) => c.plainCss);
const reactOnly = components.filter((c) => !c.plainCss);

// Semantics each component's canonical markup relies on — derived, so the
// contract lists exactly what the documented examples use.
function semantics(c) {
  const all = c.html.map((h) => h.src).join('\n');
  const pick = (re) => [...new Set([...all.matchAll(re)].map((m) => m[0]))].sort();
  return {
    hooks: pick(/data-lp-[a-z-]+(?:="[^"]*")?/g),
    roles: pick(/role="[^"]+"/g),
    aria: [...new Set([...all.matchAll(/aria-[a-z-]+=/g)].map((m) => m[0].slice(0, -1)))].sort(),
    natives: [...new Set([...all.matchAll(/<(button|input|textarea|select|a|table|nav|label|ul|ol)\b/g)].map((m) => m[1]))].sort(),
    jsApi: pick(/Lepidus\.[a-zA-Z]+/g),
  };
}

// --------------------------------------------------------------- mdx → md
function snippetBlock(c, name, lang) {
  const s = (lang === 'html' ? c.html : c.jsx).find((x) => x.name === name);
  return s ? ['```' + lang, s.src, '```'].join('\n') : '';
}
function mdxToMd(c, src) {
  return src
    .replace(/<Example\b((?:"[^"]*"|[^>])*?)\/>/g, (_, a) => {
      const name = (attr(a, 'snippet') ?? '').split('/')[1];
      const title = attr(a, 'title') ?? name;
      const parts = [`**Example — ${title}**`, ''];
      const h = snippetBlock(c, name, 'html');
      // the docs render a modal "static open" demo inside a preview iframe; on a real page it must keep `hidden`
      if (h && /class="lp-modal"(?![^>]*\bhidden\b)/.test(h) && !/lp-modal__shell--inline/.test(h)) {
        parts.push('> ⚠ **Preview-only state.** This example omits `hidden` so the docs iframe shows the dialog. On a real page `lp-modal` is a fixed overlay — keep `hidden` and open it with `data-lp-modal-open` / `Lepidus.openModal`, or it covers the screen on load.', '');
      }
      const j = snippetBlock(c, name, 'jsx');
      if (h) parts.push('Plain HTML (canonical):', '', h, '');
      if (j) parts.push('React:', '', j, '');
      if (!h && j) parts.push('_React-only example — no plain-CSS rendition exists for this component yet._', '');
      return parts.join('\n');
    })
    .replace(/<StoryEmbed\b((?:"[^"]*"|[^>])*?)\/>/g, (_, a) => `▶ Live: [${attr(a, 'caption') ?? 'story'}](${storyUrl(attr(a, 'id'))})`)
    .replace(/<DoDont\b((?:"[^"]*"|[^>])*?)\/>/g, (_, a) => `- ✓ **Do** — ${attr(a, 'do') ?? ''}\n- ✕ **Don't** — ${attr(a, 'dont') ?? ''}`)
    .replace(/<RelatedCards\b[^>]*\/>/g, '')
    .replace(/^## Related components\s*$/gm, '')
    .replace(/<Callout\b([^>]*)>([\s\S]*?)<\/Callout>/g, (_, a, body) => `> ${attr(a, 'title') ? `**${attr(a, 'title')}** — ` : ''}${htmlProseToMd(body)}`)
    .replace(/\]\((\/[^)]+)\)/g, (_, href) => `](${abs(href)})`)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ------------------------------------------------------------------ tokens
const parseBlock = (sel) => {
  const body = tokensCss.match(new RegExp(`${sel}\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1] ?? '';
  return [...body.matchAll(/^\s*(--[A-Za-z0-9-]+)\s*:\s*([^;]+);/gm)].map((m) => [m[1], m[2].trim()]);
};
const rootVars = parseBlock(':root');
const darkVars = new Map(parseBlock('\\[data-theme="dark"\\]'));
const hcVars = new Map(parseBlock('\\[data-theme="hc"\\]'));
const tokenGroups = {};
for (const [n, v] of rootVars) (tokenGroups[n.slice(2).split('-')[0]] ??= []).push([n, v]);
// component tokens grouped by the component they belong to
const componentTokens = {};
for (const [n] of tokenGroups.component ?? []) {
  const comp = n.split('-')[3];
  (componentTokens[comp] ??= []).push(n);
}
const lepidusHooks = [...new Set([...lepidusJs.matchAll(/data-lp-[a-z-]+/g)].map((m) => m[0]))].sort();
const lepidusApi = [...new Set([...lepidusJs.matchAll(/^\s{4}(\w+): \w+,?$/gm)].map((m) => m[1]))];

// ---------------------------------------------------------------- patterns
const patterns = [...patternsSrc.matchAll(/\{\s*slug:\s*'([^']+)',\s*title:\s*'([^']+)',[\s\S]*?blurb:\s*'((?:[^'\\]|\\.)*)',\s*purpose:\s*'((?:[^'\\]|\\.)*)',\s*components:\s*\[([^\]]*)\]/g)].map((m) => ({
  slug: m[1], title: m[2], blurb: m[3].replace(/\\'/g, "'"), purpose: m[4].replace(/\\'/g, "'"),
  components: [...m[5].matchAll(/'([^']+)'/g)].map((x) => x[1]),
}));

// ================================================================ document
const md = [];
const h = (level, text) => md.push(`${'#'.repeat(level)} ${text}`, '');
const p = (...lines) => md.push(...lines, '');
const code = (lang, ...lines) => md.push('```' + lang, ...lines, '```', '');
const today = new Date().toISOString().slice(0, 10);

h(1, 'Lepidus Design System — AI Design Contract');
p(
  `_design.md · generated ${today} from the sources that build ${SITE} (component manifest, docs content, snippets, tokens.css). Regenerated on every site build — never edit by hand. ${components.length} components · ${plain.length} with plain CSS · ${rootVars.length} tokens · ${components.reduce((n, c) => n + c.html.length, 0)} canonical HTML examples._`,
  '',
  '**Purpose.** This file teaches an AI assistant — or a developer — to produce Lepide product UI that *is* the documented Lepidus implementation, not a lookalike: the exact `lp-` classes, the exact DOM anatomy, the `data-lp-*` hooks, the ARIA, the tokens. Every component-level fact below is generated from the design system itself; the rules around them are the contract Lepide applies in review.',
  '',
  '**How to use it.**',
  '',
  '- **Knowledge base (best):** upload to a Claude Project, a custom GPT, NotebookLM, or your editor\'s indexed context (Cursor `@design.md`, Claude Code `CLAUDE.md` reference). Every conversation can then look up the exact anatomy.',
  `- **Single chat:** this file is large (~${Math.round(0)}k tokens — see the end). For one conversation paste ${SITE}/llms-full.txt instead (rules + every HTML example, ~${sizeK('public/llms-full.txt')}k tokens) or ${SITE}/llms.txt (rules + class inventory, ~${sizeK('../../public/llms.txt')}k tokens).`,
  '- **Humans:** search one file instead of forty pages; Section 5 is the complete per-component contract.',
  '',
  '**Contents**',
  '',
  '0. [Final instruction block — paste at the top of any prompt](#0-final-instruction-block)',
  '1. [Non-negotiable contract](#1-non-negotiable-contract)',
  '2. [Page shell, theming, `lepidus.js`](#2-page-shell-theming-lepidusjs)',
  '3. [Token model](#3-token-model)',
  '4. [Component inventory](#4-component-inventory)',
  '5. [Component contracts](#5-component-contracts) — purpose, classes, hooks, canonical anatomy, React, accessibility, hard-fail checks',
  '6. [Page archetypes and patterns](#6-page-archetypes-and-patterns)',
  '7. [Layout rules for custom composition](#7-layout-rules-for-custom-composition)',
  '8. [AI generation workflow and output format](#8-ai-generation-workflow-and-output-format)',
  '9. [Review gates and automated validation](#9-review-gates-and-automated-validation)',
  '10. [QA model and enterprise copy](#10-qa-model-and-enterprise-copy)',
  '11. [Token reference (all themes)](#11-token-reference)',
  '12. [Machine-readable sources](#12-machine-readable-sources)'
);

// ---------------------------------------------------------------- 0
h(2, '0. Final instruction block');
p('Paste this at the top of a prompt when this file (or llms-full.txt) is attached:');
code(
  'markdown',
  'You are generating UI with the Lepidus Design System. Follow design.md exactly.',
  'Default to plain HTML using documented lp- classes only; React only if I ask for React.',
  'For every component, start from its canonical HTML anatomy in design.md §5 and change',
  'only content, data, ids and labels — never class names, nesting, modifiers, ARIA or',
  'data-lp-* hooks. Never hardcode colors, spacing, radii or font sizes: use',
  'var(--component-*) first, then semantic var(--color-*|--space-*|--radius-*) tokens.',
  `Link ${SITE}/v1/lepidus.css in <head> and ${SITE}/v1/lepidus.js (defer) before </body>.`,
  'Set data-theme="light" | "dark" | "hc" on <html>. Use lepidus.js hooks for interaction.',
  'Before answering, run the §8 self-check and the §5 hard-fail list for each component used.',
  'If a needed pattern has no Lepidus component, write a system gap note (§8) instead of',
  'inventing one.'
);

// ---------------------------------------------------------------- 1
h(2, '1. Non-negotiable contract');
code(
  'yaml',
  'lepidus_ai_contract:',
  '  design_system: Lepidus',
  '  owner_context: Lepide enterprise products',
  '  preferred_output: plain HTML + documented lp- classes',
  '  secondary_output: React only if the target project already uses React',
  "  css_distribution: '@ramsarjal-404/css'",
  "  react_distribution: '@ramsarjal-404/react'",
  '  token_source: Figma DTCG -> Style Dictionary -> CSS variables',
  '  class_prefix: lp-',
  '  theme_attribute: data-theme',
  '  allowed_themes: [light, dark, hc]',
  '  default_theme: light',
  '  font_family: var(--font-family-primary)   # Open Sans',
  '  accessibility_target: WCAG 2.1 AA',
  `  components: ${components.length}`,
  `  plain_css_components: ${plain.length}`,
  `  react_only_components: [${reactOnly.map((c) => c.name).join(', ')}]`,
  `  lepidus_js_hooks: [${lepidusHooks.join(', ')}]`,
  `  lepidus_js_api: [${lepidusApi.map((a) => 'Lepidus.' + a).join(', ')}]`,
  '  required_quality_gates:',
  '    - no raw hex colors in product UI (a hex *fallback* inside var(--…, #hex) is allowed)',
  '    - no hardcoded spacing, radius, font-size or component color values',
  '    - component tokens first, semantic tokens second, primitives last',
  '    - only documented lp- classes (the inventories in §5 are the complete legal sets)',
  '    - documented DOM anatomy, native elements, ARIA and data-lp-* hooks preserved',
  '    - light, dark and high-contrast all checked',
  '    - keyboard path checked; focus-visible never removed'
);
h(3, 'Source precedence');
p(
  'When anything is ambiguous, this order wins:',
  '',
  '1. **Canonical HTML anatomy** (§5, "Plain HTML (canonical)") — the markup the Code pages render live.',
  '2. **Class inventory and props** (§5) — generated from the component manifest; the complete legal set.',
  '3. **Accessibility contract** (§5) — required semantics, focus and keyboard behavior.',
  '4. **Storybook live story** — visual and state verification.',
  '5. **Token reference** (§11) — exact names and per-theme values.',
  '6. **The prose in this file** — orchestration rules and guardrails.',
  '',
  `If this file ever conflicts with a current component page on ${SITE}, the live page wins — and this file is stale, so regenerate it.`
);
h(3, 'Component fidelity rule');
p(
  'When a Lepidus component exists, **instantiate the documented component**; never recreate its appearance.',
  '',
  'Allowed changes to canonical anatomy: labels, option values, row data, ids, business copy, layout wrappers *around* the component.',
  '',
  'Not allowed without a design-system update: `lp-*` class names, documented element hierarchy, modifiers, ARIA roles/states, `data-lp-*` hooks, internal spacing, radii, colors, hover/focus behavior, open/close behavior.',
  '',
  '**"Looks similar" substitutions are implementation failures:** a `div` styled like a button · a native `<select>` styled like Dropdown · Headless UI / Radix / MUI replacing a Lepidus component · a custom modal instead of `lp-modal` · a custom grid instead of `lp-table` · custom tabs instead of `lp-tabs` · local CSS imitating component geometry · hand-rolled open/close logic on top of `lepidus.js`.'
);
h(3, 'Absolute rules');
p(
  '1. Default to plain HTML with `lp-` classes. React only when the project is React.',
  '2. Never invent classes. Every `lp-*` class must appear in the §5 inventory of its component.',
  '3. Never hardcode visual values. Tokens only; `data-theme` for themes; never per-theme custom CSS.',
  '4. Do not rebuild existing components. Button → `lp-button`, Modal → `lp-modal`, Table → `lp-table`, …',
  `5. Interaction comes from \`lepidus.js\` (${lepidusHooks.join(', ')}; \`${lepidusApi.map((a) => 'Lepidus.' + a).join('`, `')}\`). Do not hand-roll tabs, modal focus trapping, accordions, dropdowns, tooltips, steppers or toasts.`,
  '6. Accessibility is not optional: copy the semantics, ARIA, focus and keyboard behavior from the canonical anatomy.',
  '7. Cover states: default, hover, focus, disabled, loading, empty, error, success; light, dark, hc; LTR/RTL where layout direction matters.',
  '8. Missing pattern → **system gap note** (§8). Use the closest existing components; never invent a new system.',
  '9. Enterprise copy: direct, calm, specific; verb-first button labels; status never by color alone.'
);

// ---------------------------------------------------------------- 2
h(2, '2. Page shell, theming, lepidus.js');
h(3, 'Required page shell (plain HTML)');
code(
  'html',
  '<!doctype html>',
  '<html lang="en" data-theme="light">',
  '<head>',
  '  <meta charset="utf-8" />',
  '  <meta name="viewport" content="width=device-width, initial-scale=1" />',
  '  <title>Lepidus UI</title>',
  `  <link rel="stylesheet" href="${SITE}/v1/lepidus.css" />`,
  '</head>',
  '<body>',
  '  <!-- product screen: documented lp- components + token-only layout wrappers -->',
  `  <script src="${SITE}/v1/lepidus.js" defer></script>`,
  '</body>',
  '</html>'
);
p(
  'The `/v1/` URLs are versioned and stable. To vendor instead: build from the repo (`npm run tokens:css && npm run css`) and copy `packages/css/dist/lepidus.css` + `lepidus.js`; `lepidus.components.css` (components only) and `components/<name>.css` (one component) are also produced — link `tokens.css` first if you use those.'
);
h(3, 'Theming');
p(
  '```html',
  '<html data-theme="light">   <!-- "light" (default) | "dark" | "hc" -->',
  '```',
  '',
  `One attribute; every component follows. Themes override only the semantic layer (${darkVars.size} variables for dark, ${hcVars.size} for high contrast) and component tokens re-resolve through live \`var()\` chains. Never write \`[data-theme="dark"] .thing { … }\` — if a custom layout wrapper needs a color, use a semantic token and it themes itself.`
);
h(3, '`lepidus.js` — behavior for the interactive components');
p(
  'Bootstrap-style: write the documented markup with its data attribute, include the script once; components initialize on `DOMContentLoaded`. `Lepidus.init(container)` for markup injected later.',
  '',
  '| Component | Markup hook | Behavior / JS API |',
  '|---|---|---|',
  '| Tabs | `lp-tabs` + `data-lp-tabs`; `role="tab"` buttons with `aria-controls` → `role="tabpanel"` | arrow keys / Home / End, roving tabindex, RTL-aware |',
  '| Modal | `lp-modal` with `hidden`; `data-lp-modal-open="<id>"`, `data-lp-modal-close`, `data-lp-autofocus` | `Lepidus.openModal(id)`, `Lepidus.closeModal()` — focus trap, inert background, Escape / backdrop close, focus restore |',
  '| Accordion | `data-lp-accordion`; triggers with `aria-expanded` + `aria-controls` | toggles `lp-accordion__panel--open` |',
  '| Dropdown | `data-lp-dropdown="single"` or `"multi"` | open/close, outside-click + Escape dismissal, `aria-checked` sync, fires `lp-dropdown-change` on the wrapper |',
  '| Stepper | `data-lp-stepper` | up/down controls respect `min` / `max` / `step`, fires `change` |',
  '| Toast | — | `Lepidus.toast({ title, message, variant: info\\|success\\|warning\\|error, duration })` → returns dismiss fn |',
  '| Tooltip | `data-lp-tooltip="text"` on any focusable element | hover + focus, flips below when no room, `aria-describedby` wired, Escape hides |'
);

// ---------------------------------------------------------------- 3
h(2, '3. Token model');
p(
  '```text',
  'primitive (--blue-600)  →  semantic (--color-brand-primary, themed)  →  component (--component-button-primary-fill)  →  UI',
  '```',
  '',
  '**Priority for generated UI:** `var(--component-*)` for anything component-specific → `var(--color-*)`, `var(--space-*)`, `var(--radius-*)`, `var(--typography-*)`, `var(--shadow-*)` for layout and composition → primitives only when no semantic token exists.',
  '',
  `**Groups (${rootVars.length} variables on \`:root\`):** ${Object.entries(tokenGroups).sort((a, b) => b[1].length - a[1].length).map(([g, v]) => `\`--${g}-*\` (${v.length})`).join(' · ')}. Full per-theme table in §11.`
);
h(3, 'Semantic tokens to reach for first');
code(
  'css',
  '/* brand */        var(--color-brand-primary)  var(--color-brand-primary-hover)  var(--color-brand-secondary)  var(--color-brand-accent)',
  '/* surfaces */     var(--color-background-page)  var(--color-background-surface)  var(--color-background-raised)  var(--color-background-subtle)  var(--color-background-cards)',
  '/* text */         var(--color-text-primary)  var(--color-text-secondary)  var(--color-text-disabled)  var(--color-text-brand)  var(--color-text-danger)  var(--color-text-inverse)',
  '/* borders */      var(--color-border-default)  var(--color-border-strong)  var(--color-border-brand)  var(--color-border-danger)',
  '/* status pairs */ var(--color-status-{success|warning|error|na}-bg)  var(--color-status-{success|warning|error|na}-text)',
  '/* focus */        var(--color-focus-ring)',
  '/* type */         var(--font-family-primary)  var(--typography-{body-sm|body-md|body-lg|label-md|heading-*}-{fontSize|lineHeight|letterSpacing})',
  '/* layout */       var(--space-1 … --space-18)  var(--radius-*)  var(--shadow-*)  var(--z-*)  var(--breakpoint-*)  var(--duration-*)  var(--easing-*)'
);
h(3, 'Component tokens by component');
p('What each component consumes internally — reference these, never their raw values. Classes already apply them; application code should not restyle component internals.');
for (const [comp, names] of Object.entries(componentTokens).sort()) {
  md.push(`- **${comp}** (${names.length}): ${names.map((n) => '`' + n + '`').join(', ')}`);
}
md.push('');

// ---------------------------------------------------------------- 4
h(2, '4. Component inventory');
md.push('| Component | Category | Plain CSS block | Hooks / API | React | Docs |', '|---|---|---|---|---|---|');
for (const cat of categories) {
  for (const c of components.filter((x) => x.category === cat)) {
    const s = semantics(c);
    const hooks = [...s.hooks.map((x) => x.split('=')[0]), ...s.jsApi].filter((v, i, a) => a.indexOf(v) === i);
    md.push(
      `| [${c.name}](#${c.slug}) | ${cat} | ${c.plainCss ? '`' + c.plainCss.block + '`' : '— React-only'} | ${hooks.length ? hooks.map((x) => '`' + x + '`').join(' ') : '—'} | \`${c.reactImport.match(/\{ (\w+) \}/)?.[1] ?? c.name}\` | [${c.slug}](${SITE}/components/${c.slug}/) |`
    );
  }
}
md.push('');
p(
  `**React-only today (${reactOnly.length}):** ${reactOnly.map((c) => c.name).join(', ')}. In plain HTML: use the closest documented plain-CSS component if safe, never invent \`lp-*\` classes for them, add a system gap note (§8), and suggest React if the project supports it.`
);

// ---------------------------------------------------------------- 5
h(2, '5. Component contracts');
p('Each contract is complete on its own: purpose and usage rules, the legal class set, the hooks and semantics the canonical markup relies on, every documented example (plain HTML first, React second), the React API, the accessibility contract, and the hard-fail checks a reviewer applies.');
for (const cat of categories) {
  h(3, `${cat}`);
  for (const c of components.filter((x) => x.category === cat)) {
    const s = semantics(c);
    md.push(`<a id="${c.slug}"></a>`, '');
    h(3, c.name);
    p(c.meta.description ?? c.description ?? '');
    p(
      `- **Availability:** ${c.plainCss ? `plain CSS (block \`${c.plainCss.block}\`) + React` : '**React-only** — no `@ramsarjal-404/css` distribution yet'}`,
      `- **React:** \`${c.reactImport}\``,
      `- **Docs:** ${SITE}/components/${c.slug}/ · **Storybook:** ${c.story.stories.map((st) => `[${st.name}](${storyUrl(st.id)})`).join(', ')}`,
      c.meta.related?.length ? `- **Related:** ${c.meta.related.map((r) => `[${r}](#${r})`).join(', ')}` : ''
    );

    if (c.plainCss) {
      h(4, 'Legal class set (complete — do not invent others)');
      p(c.plainCss.classes.map((k) => '`' + k + '`').join(' · '));
    }
    if (c.html.length) {
      h(4, 'Hooks and semantics the canonical markup relies on');
      const lines = [];
      if (s.hooks.length) lines.push(`- **lepidus.js hooks:** ${s.hooks.map((x) => '`' + x + '`').join(', ')}`);
      if (s.jsApi.length) lines.push(`- **JS API:** ${s.jsApi.map((x) => '`' + x + '`').join(', ')}`);
      if (s.natives.length) lines.push(`- **Native elements (keep them native):** ${s.natives.map((x) => '`<' + x + '>`').join(', ')}`);
      if (s.roles.length) lines.push(`- **Roles:** ${s.roles.map((x) => '`' + x + '`').join(', ')}`);
      if (s.aria.length) lines.push(`- **ARIA attributes:** ${s.aria.map((x) => '`' + x + '`').join(', ')}`);
      p(...lines);
    }

    if (c.usage) {
      h(4, 'Purpose and usage rules');
      p(demote(mdxToMd(c, c.usage)));
    }
    h(4, 'Canonical anatomy and examples');
    if (c.code) p(demote(mdxToMd(c, c.code)));
    // examples that code.mdx did not reference (safety net — nothing is left out)
    const referenced = new Set([...c.code.matchAll(/snippet="[^/]+\/([^"]+)"/g)].map((m) => m[1]));
    for (const ex of c.html.filter((x) => !referenced.has(x.name))) {
      p(`**Example — ${ex.name}**`, '', 'Plain HTML (canonical):', '', '```html', ex.src, '```');
      const j = c.jsx.find((x) => x.name === ex.name);
      if (j) p('React:', '', '```jsx', j.src, '```');
    }
    for (const ex of c.jsx.filter((x) => !referenced.has(x.name) && !c.html.some((hh) => hh.name === x.name))) {
      p(`**Example — ${ex.name}** (React)`, '', '```jsx', ex.src, '```');
    }

    if (c.props?.length) {
      h(4, 'React API');
      md.push('| Prop | Type | Default | Description |', '|---|---|---|---|');
      for (const pr of c.props) md.push(`| \`${pr.name}\`${pr.required ? ' *' : ''} | \`${cell(pr.type)}\` | ${pr.defaultValue != null ? '`' + cell(pr.defaultValue) + '`' : '—'} | ${cell(pr.description ?? '')} |`);
      md.push('', '_\\* required_', '');
    }
    if (c.a11y) {
      h(4, 'Accessibility contract');
      p(demote(mdxToMd(c, c.a11y)));
    }

    h(4, `Hard-fail checks — ${c.name}`);
    const checks = [];
    // component-specific rules learned from real assistant runs come first — chat tools
    // retrieve this block when they build the component, not the global list in §8
    for (const d of driftFor(c.slug)) checks.push(`- [ ] **${d.check}** _(observed drift: ${d.why})_`);
    if (c.plainCss) {
      checks.push(`- [ ] Every \`${c.plainCss.block}*\` class used appears in the legal class set above.`);
      checks.push('- [ ] DOM anatomy, modifiers and element order match a canonical example; only content/ids/labels changed.');
      if (s.natives.length) checks.push(`- [ ] Native elements preserved: ${s.natives.map((x) => '`<' + x + '>`').join(', ')} — no \`div\` stand-ins.`);
      if (s.hooks.length) checks.push(`- [ ] Hooks present: ${[...new Set(s.hooks.map((x) => x.split('=')[0]))].map((x) => '`' + x + '`').join(', ')} — and \`lepidus.js\` is included on the page.`);
      if (s.jsApi.length) checks.push(`- [ ] Uses ${s.jsApi.map((x) => '`' + x + '`').join(', ')} instead of a custom implementation.`);
      if (s.roles.length) checks.push(`- [ ] Roles present where the anatomy has them: ${s.roles.map((x) => '`' + x + '`').join(', ')}.`);
      if (s.aria.length) checks.push(`- [ ] ARIA state kept and updated: ${s.aria.map((x) => '`' + x + '`').join(', ')}.`);
      checks.push('- [ ] No local CSS on component internals; no raw hex; no per-theme overrides.');
      checks.push('- [ ] Not replaced by a native/third-party/custom lookalike.');
    } else {
      checks.push('- [ ] Plain-HTML output does **not** invent `lp-*` classes for this component; it uses `@ramsarjal-404/react` or carries a system gap note (§8).');
      checks.push('- [ ] React usage matches the API table; icons use `currentColor`.');
    }
    checks.push('- [ ] Checked in light, dark and hc; keyboard path verified.');
    p(...checks);
    md.push('---', '');
  }
}

// ---------------------------------------------------------------- 6
h(2, '6. Page archetypes and patterns');
p('Classify the screen first, then compose from the mapped components. Each repo pattern below has a live Storybook story.');
h(3, 'Repo patterns (live)');
for (const pt of patterns) {
  p(`**${pt.title}** — ${pt.blurb}`, '', pt.purpose, '', `Built from: ${pt.components.map((n) => `[${n}](#${kebab(n)})`).join(', ')} · ${SITE}/patterns/${pt.slug}/`);
}
h(3, 'Archetypes');
const arche = [
  ['A. Report library / data table', 'Auditor reports, audit logs, scan results', 'Sidebar · Breadcrumb · page title · toolbar (TextField/Input search, secondary Import/Export, one primary Add) · Table · Pagination · Modal for create/edit · Toast on success · Message for blocking errors · EmptyState when no data', 'One primary button on the right of the toolbar. Badge for status columns. Table empty cell for filtered-out results, EmptyState for no data at all.'],
  ['B. Credentials / setup form', 'adding credentials, connector, server or tenant setup', 'Card or Modal · Input rows (label-left on desktop, label-top when narrow) · Dropdown for a known source type · Checkbox for optional scope · footer Cancel + primary Save · Message for a validation summary', 'Helper text on risky inputs; field-level error text; primary label is specific ("Save credentials", "Connect server").'],
  ['C. Alert detail / incident review', 'security events, risk alerts, unusual activity', 'Breadcrumb · AlertPanel · Card with evidence · Table of affected objects · Badge/Tag for severity and source · primary recommended action · secondary export/share', 'AlertPanel carries urgency; evidence stays structured; danger Button only for destructive irreversible actions.'],
  ['D. Dashboard / analytics', 'overview, health monitoring, activity analytics', 'Sidebar · title + time filter · Cards with Donut/Gauge/Line/Bar/Column charts (React) · Table for detail · Badge for health · Skeleton while loading', 'Charts are React-only — provide a text summary for key metrics; never rely on chart color alone.'],
  ['E. Empty / first-run', 'no reports, scans, exports or connected servers', 'EmptyState illustration · one-line what-is-empty · what happens next · one primary action · optional docs Link', 'State what is empty, explain what happens next, one clear action, never blame the user.'],
  ['F. Settings', 'preferences, notifications, scan options', 'SettingsPanel (React) or Sidebar · Cards per setting group · Input / Dropdown / Toggle / Checkbox / Radio · footer actions · Toast after save', 'Group by task, not backend. Toggle only for immediate on/off; Radio when exactly one; Dropdown for short fixed lists.'],
];
md.push('| Archetype | Use for | Composition | Rules |', '|---|---|---|---|');
for (const [a, b, c2, d] of arche) md.push(`| **${a}** | ${b} | ${c2} | ${d} |`);
md.push('');
h(3, 'Need → component');
code(
  'text',
  'main action            → Button primary          support action         → Button secondary',
  'destructive action     → Button danger + Modal   navigation             → Link (never Button)',
  'read-only status       → Badge (Tag = category)  data rows              → Table (+ Pagination)',
  'no data                → EmptyState              loading, known layout  → Skeleton',
  'loading, short/unknown → Spinner                 inline error           → Message / Input error',
  'passive success        → Toast                   blocking error         → Message or Modal',
  'short fixed options    → Dropdown                long/searchable        → Filter (React)',
  'on/off setting         → Toggle                  independent choices    → Checkbox',
  'exactly one choice     → Radio                   hierarchy              → FolderTree (React) / Breadcrumb',
  'same-context views     → Tabs                    multi-step progress    → Steps',
  'numeric +/-            → Stepper                 label-less quick entry → TextField',
  'multi-line text        → Textarea                icon action row        → ActionItem',
  'scheduling             → Calendar / TimePicker (React)   app navigation → Sidebar'
);

// ---------------------------------------------------------------- 7
h(2, '7. Layout rules for custom composition');
p('Components come from the system; a product screen still needs layout CSS. Layout CSS is allowed **only** for wrappers around components and **only** with tokens.');
code(
  'css',
  '/* allowed — layout only, tokens only */',
  '.product-shell { min-height: 100vh; background: var(--color-background-page); color: var(--color-text-primary); font-family: var(--font-family-primary); }',
  '.page-header   { display: flex; align-items: center; justify-content: space-between; gap: var(--space-8); padding: var(--space-9); }',
  '.content-grid  { display: grid; grid-template-columns: 280px minmax(0, 1fr); gap: var(--space-9); }',
  '',
  '/* forbidden — recreates lp-button and will drift from tokens, themes, hover, focus, disabled */',
  '.my-blue-button { background: #1c4599; border-radius: 50px; color: white; padding: 12px 20px; }'
);
p('Use token spacing, surfaces and text colors; responsive grids, not fixed-width hacks; CSS logical properties for RTL safety; never style component internals unless the design-system owner approved a new variant.');

// ---------------------------------------------------------------- 8
h(2, '8. AI generation workflow and output format');
p(
  '**Step 1 — classify the screen:** report/data table · form/setup · alert/incident · settings · analytics/dashboard · empty state · navigation shell · modal/dialog (§6).',
  '',
  '**Step 2 — map every need to a component** with the §6 table. If a need maps to a React-only component and the project is plain HTML, write a system gap note.',
  '',
  '**Step 3 — generate markup** starting from each component\'s canonical anatomy (§5). Change only content, data, ids, labels. Add the page shell (§2).',
  '',
  '**Step 4 — interaction only through system hooks:** ' + lepidusHooks.map((x) => '`' + x + '`').join(', ') + ', ' + lepidusApi.map((a) => '`Lepidus.' + a + '(…)`').join(', ') + '.',
  '',
  '**Step 5 — self-check before answering:**'
);
h(3, 'Observed AI drift — check these first');
p(
  `These are the exact mistakes real assistants made when building a form from this contract while copying the gallery examples correctly. They happen in markup the assistant *composes* rather than copies; each is also repeated inside the affected component's hard-fail list in §5, and the validator (§9) fails every one:`,
  '',
  driftMarkdown(),
  '',
  'Rule of thumb: if you are typing a class name from memory rather than copying it from §5, stop and copy.'
);
code(
  'text',
  '1. Every component-level need uses an existing Lepidus component (no lookalikes)?',
  '2. No raw hex, no hardcoded spacing/radius/font-size/color?',
  '3. data-theme set; only token variables used in layout CSS?',
  '4. Every lp-* class is in its component\'s legal set (§5)?',
  '5. Anatomy, native elements, ARIA and data-lp-* hooks match the canonical example?',
  '6. lepidus.css and lepidus.js included; interactions use hooks, not custom JS?',
  '7. Empty / loading / error / disabled states provided where relevant?',
  '8. Light, dark, hc and keyboard path considered?',
  '9. Copy is concise, verb-first, enterprise-calm?',
  '10. Any missing pattern documented as a system gap note, not invented?'
);
h(3, 'Output format');
// tilde fence: the template itself contains ``` fences
md.push('~~~markdown');
md.push(
  '## Design-system interpretation',
  '- Screen type: …   - Components used: …   - States covered: …',
  '- Accessibility notes: …   - Theme notes: …',
  '',
  '## HTML',
  '```html … ```',
  '',
  '## Optional layout CSS   (token-only wrappers; nothing on component internals)',
  '```css … ```',
  '',
  '## Interaction notes',
  '- Uses lepidus.js for: …',
  '',
  '## QA checklist',
  '- [ ] Light · [ ] Dark · [ ] High contrast · [ ] Keyboard path',
  '- [ ] No raw hex · [ ] No invented lp-* classes · [ ] States: empty / loading / error / disabled',
  '~~~',
  ''
);
h(3, 'Worked examples (complete screens, validated)');
p('Full pages assembled only from canonical anatomy plus token-only layout wrappers. Both pass `scripts/validate-lp-html.mjs` and were exercised in a browser (modal focus trap / Escape / restore, toast, multi-select dropdown, dark theme). Use them as the shape of a correct answer.');
const examplesDir = join(siteRoot, 'examples');
for (const f of (existsSync(examplesDir) ? readdirSync(examplesDir) : []).filter((x) => x.endsWith('.html')).sort()) {
  p(`**${f.replace(/\.html$/, '').replace(/-/g, ' ')}**`, '', '```html', readFileSync(join(examplesDir, f), 'utf8').split(DEFAULT_SITE_URL).join(SITE).trim(), '```');
}
h(3, 'System gap note (when a pattern has no Lepidus component)');
code(
  'markdown',
  '### System gap note',
  'Required pattern: Searchable async combobox',
  'Closest available Lepidus component: Dropdown / Filter',
  'Risk if we invent locally: keyboard behavior, async state, ARIA and theme tokens drift from Lepidus.',
  'Recommended action: add the component/variant to Storybook and the manifest before production use.',
  'Temporary safe approach: Filter (React) or Input + Table filtering with documented components.'
);

// ---------------------------------------------------------------- 9
h(2, '9. Review gates and automated validation');
p(
  '**Hard fail** — raw hex in component UI · custom CSS recreating a component · invented `lp-*` class · missing `data-theme` support · broken focus visibility · Modal without focus trap/restore · Input error without visible message · status by color only · Table without semantic `<table>` · Dropdown without listbox semantics or `data-lp-dropdown`, or replaced by `<select>`/third-party · disabled states without the native `disabled` attribute · local CSS on component internals.',
  '',
  '**Automated check** — the repo ships a validator that applies the mechanical gates to any HTML file (classes against the manifest, hooks against `lepidus.js`, raw hex outside `var()` fallbacks, Modal / Dropdown / Tabs / Table structure, shell includes):'
);
code('bash', 'node scripts/validate-lp-html.mjs path/to/screen.html      # exit 1 on any failure');
code(
  'bash',
  '# raw hex outside a var() fallback',
  "grep -rnE '#[0-9a-fA-F]{3,8}\\b' src/ --include='*.html' --include='*.css' --include='*.tsx' | grep -vE 'var\\(--[a-z0-9-]+,\\s*#'",
  '# every lp-* class in use — compare with §5',
  "grep -rhoE 'lp-[a-zA-Z0-9_-]+' src/ | sort -u"
);

// ---------------------------------------------------------------- 10
h(2, '10. QA model and enterprise copy');
p(
  '**Storybook is the visual contract.** QA compares component style, spacing, states (default/hover/focus/disabled/loading/error), themes, keyboard and ARIA against it. QA still owns product verification: data correctness, permissions, API errors, workflow, browser/device, regression, security, performance.',
  '',
  '```text',
  'Storybook correct, product differs  → implementation bug',
  'Storybook lacks the needed state    → design-system gap',
  'Storybook state is wrong            → system bug',
  'Data / permission / API wrong       → product bug',
  '```',
  '',
  '**Copy.** Voice: direct, calm, specific, non-marketing. Buttons are verbs (Save changes · Add credentials · Run scan · Export report · Apply filters · Acknowledge alert · View details). Empty states: *what is empty* → *what happens next* → *action* ("No reports found. Create a report or adjust your filters to see results."). Errors: *what failed. how to fix it* ("Connection failed. Check the credentials and try again."). Success: short past tense ("Credentials saved." "Scan started.").'
);

// ---------------------------------------------------------------- 11
h(2, '11. Token reference');
p(`All ${rootVars.length} variables on \`:root\` with light values; dark and high-contrast columns show overrides where the theme redefines the token (— means inherited).`);
for (const [group, vars] of Object.entries(tokenGroups).sort((a, b) => b[1].length - a[1].length)) {
  h(3, `\`--${group}-*\` (${vars.length})`);
  const themed = vars.some(([n]) => darkVars.has(n) || hcVars.has(n));
  md.push(themed ? '| Variable | Light | Dark | High contrast |' : '| Variable | Value |', themed ? '|---|---|---|---|' : '|---|---|');
  for (const [n, v] of vars) {
    md.push(themed ? `| \`${n}\` | \`${cell(v)}\` | ${darkVars.has(n) ? '`' + cell(darkVars.get(n)) + '`' : '—'} | ${hcVars.has(n) ? '`' + cell(hcVars.get(n)) + '`' : '—'} |` : `| \`${n}\` | \`${cell(v)}\` |`);
  }
  md.push('');
}

// ---------------------------------------------------------------- 12
h(2, '12. Machine-readable sources');
p(
  `- **This file:** ${SITE}/design.md — regenerated on every build.`,
  `- **llms-full.txt:** ${SITE}/llms-full.txt — rules + every HTML example, one paste (~${sizeK('public/llms-full.txt')}k tokens).`,
  `- **llms.txt:** ${SITE}/llms.txt — rules + class inventory (~${sizeK('../../public/llms.txt')}k tokens).`,
  `- **Component manifest (JSON):** ${SITE}/component-manifest.json — props and classes; the Specifications tabs visualized.`,
  '- **MCP server** (repo checkout): `packages/mcp/server.mjs` via `.mcp.json` — `list_components`, `get_component`, `search_tokens`, `get_usage_rules`.',
  `- **Live previews:** ${SITE}/storybook/`
);

let out = md.join('\n');
out = out.replace('~0k tokens — see the end', `~${Math.round(out.length / 4 / 1000)}k tokens`);
const outPath = join(siteRoot, 'public/design.md');
writeFileSync(outPath, out);
console.log(`✓ public/design.md — ${components.length} components (${plain.length} plain CSS), ${components.reduce((n, c) => n + c.html.length, 0)} HTML + ${components.reduce((n, c) => n + c.jsx.length, 0)} React examples, ${rootVars.length} tokens, ${(out.length / 1024).toFixed(0)} KB ≈ ${Math.round(out.length / 4 / 1000)}k tokens`);
