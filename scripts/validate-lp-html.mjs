#!/usr/bin/env node
/**
 * validate-lp-html.mjs — mechanical review gates for Lepidus HTML
 *
 *   node scripts/validate-lp-html.mjs <file.html> [more.html …]   (exit 1 on failure)
 *
 * Applies the checks a reviewer (or an AI self-check) can run without
 * judgment, against the generated sources of truth:
 *   - every lp-* class exists in public/component-manifest.json
 *   - every data-lp-* hook exists in packages/css/lepidus.js
 *   - no raw hex colors outside var(--token, #fallback)
 *   - page shell: data-theme on <html>, lepidus.css linked, lepidus.js included
 *     when any hook / Lepidus.* API is used
 *   - structural anatomy for the components that break silently when it is
 *     wrong: Modal, Dropdown, Tabs, Table, Toggle, Input errors
 *   - no native <select> or lookalike substitutes for Dropdown
 * Zero dependencies — regex over the markup, same as llms.txt's audience.
 */
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(root, 'public/component-manifest.json'), 'utf8'));
const lepidusJs = readFileSync(join(root, 'packages/css/lepidus.js'), 'utf8');
const legalClasses = new Set(manifest.components.flatMap((c) => c.plainCss?.classes ?? []));
const legalHooks = new Set([...lepidusJs.matchAll(/data-lp-[a-z-]+/g)].map((m) => m[0]));
const tokensCss = readFileSync(join(root, 'packages/tokens/build/css/tokens.css'), 'utf8');
const legalTokens = new Set([...tokensCss.matchAll(/(--[A-Za-z0-9-]+)\s*:/g)].map((m) => m[1]));
// runtime custom properties components read from inline style (documented per component)
const runtimeVars = new Set(['--track-length', '--thumb-size', '--thumb-offset', '--component-input-label-width']);
// parts whose behavior lepidus.js already owns — a second controller breaks them
const ownedByLepidusJs = [
  '.lp-dropdown__trigger', '.lp-dropdown__option', '.lp-dropdown__panel', '[data-lp-dropdown]',
  '.lp-accordion__trigger', '[data-lp-accordion]', '.lp-stepper__control', '[data-lp-stepper]',
  '.lp-tabs__tab', '[data-lp-tabs]', '[data-lp-modal-open]', '[data-lp-modal-close]', '.lp-modal',
];

export function validate(html, name = 'input') {
  const fails = [];
  const warns = [];
  const fail = (m) => fails.push(m);
  const warn = (m) => warns.push(m);
  const has = (re) => re.test(html);

  // Gallery-style pages embed examples as <iframe srcdoc="…"> (entity-escaped
  // documents). Validate each one as its own document, then drop the attribute
  // so the escaped text is not scanned as live markup.
  const decode = (s) => s.replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  let srcdocIndex = 0;
  html = html.replace(/\bsrcdoc="([^"]*)"/g, (_, body) => {
    const sub = validate(decode(body), `${name} › srcdoc[${srcdocIndex++}]`);
    for (const m of sub.fails) fails.push(`${sub.name}: ${m}`);
    for (const m of sub.warns) warns.push(`${sub.name}: ${m}`);
    return 'srcdoc=""';
  });

  // Display text is not markup: escaped examples in <pre>/<code> and HTML
  // comments must not be scanned for classes or colors.
  html = html.replace(/<pre\b[\s\S]*?<\/pre>/gi, '').replace(/<code\b[\s\S]*?<\/code>/gi, '').replace(/<!--[\s\S]*?-->/g, '');

  // --- classes ----------------------------------------------------------
  // only what is actually in a class attribute — prose mentioning a class is not a use
  const used = new Set(
    [...html.matchAll(/\bclass="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/)).filter((c) => /^lp-/.test(c))
  );
  for (const cls of used) if (!legalClasses.has(cls)) fail(`invented class: ${cls}`);

  // --- hooks --------------------------------------------------------------
  const hooks = new Set([...html.matchAll(/data-lp-[a-z-]+/g)].map((m) => m[0]));
  for (const hk of hooks) if (!legalHooks.has(hk)) fail(`unknown lepidus.js hook: ${hk}`);
  const usesApi = /Lepidus\.(toast|openModal|closeModal|init)\b/.test(html);

  // --- colors -------------------------------------------------------------
  const stripped = html.replace(/var\(--[a-z0-9-]+,\s*#[0-9a-fA-F]{3,8}\)/g, 'var()');
  for (const m of stripped.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
    // allow hex inside an <svg> with role="img"/aria-label (brand logos are fixed-color by design)
    const tagStart = stripped.lastIndexOf('<', m.index);
    const tagEnd = stripped.indexOf('>', m.index);
    const tag = tagStart >= 0 && tagEnd >= 0 ? stripped.slice(tagStart, tagEnd + 1) : '';
    const inLogo = /^<svg[ \t\n>]/.test(tag) && /(role="img"|aria-label=)/.test(tag);
    if (!inLogo) fail(`raw color ${m[0]} outside a var() fallback`);
  }

  // --- page shell (only when it is a full document) ----------------------
  if (/<body\b/i.test(html)) {
    if (!/<html[^>]*data-theme="(light|dark|hc)"/i.test(html)) fail('<html> missing data-theme="light|dark|hc"');
    if (!/lepidus\.css/.test(html)) fail('lepidus.css not linked');
    if ((hooks.size || usesApi) && !/lepidus\.js/.test(html)) fail('lepidus.js hooks/API used but lepidus.js not included');
  }

  // --- page CSS: no restyling of component internals, no invented tokens ---
  for (const st of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    const css = st[1].replace(/\/\*[\s\S]*?\*\//g, '');
    for (const rule of css.matchAll(/([^{}]+)\{[^{}]*\}/g)) {
      const sel = rule[1].trim();
      if (/(^|[\s,>+~(])\.lp-[a-zA-Z0-9_-]+/.test(sel)) fail(`page CSS restyles a component internal: "${sel.replace(/\s+/g, ' ')}" — Lepidus owns lp-* geometry; use a layout wrapper or a documented modifier`);
    }
  }
  const declaredHere = new Set([...html.matchAll(/(--[A-Za-z0-9-]+)\s*:/g)].map((m) => m[1]));
  for (const m of html.matchAll(/var\(\s*(--[A-Za-z0-9-]+)/g)) {
    const t = m[1];
    if (!legalTokens.has(t) && !runtimeVars.has(t) && !declaredHere.has(t)) fail(`unknown token ${t} — not in tokens.css, so its fallback (or nothing) is what renders; use a real --color-*/--space-*/--radius-* token`);
  }

  // --- inline scripts: no second controller on lepidus.js-owned parts -------
  for (const sc of html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)) {
    const js = sc[1];
    for (const part of ownedByLepidusJs) {
      const re = new RegExp(`querySelector(?:All)?\\(\\s*['"\`][^'"\`]*${part.replace(/[.[\]]/g, '\\$&')}[^'"\`]*['"\`]\\s*\\)[\\s\\S]{0,400}?addEventListener\\(\\s*['"](click|keydown|keyup|change)['"]`);
      if (re.test(js)) fail(`inline script attaches a ${part.includes('modal') ? 'modal' : part.includes('dropdown') ? 'dropdown' : part.includes('accordion') ? 'accordion' : part.includes('stepper') ? 'stepper' : 'tabs'} handler on "${part}" — lepidus.js already owns this behavior; a second controller toggles it twice (observed: the dropdown never opens)`);
    }
  }

  // --- lookalike substitutes ---------------------------------------------
  if (/<select\b/i.test(html)) fail('native <select> — use the documented lp-dropdown anatomy (page controls such as a theme switcher included)');
  if (/class="[^"]*\b(btn|button)\b[^"]*"/.test(html) && !/lp-button/.test(html)) warn('a non-lp button class is used — Button must be lp-button');

  // --- structural anatomy --------------------------------------------------
  // Modal
  for (const m of html.matchAll(/<div[^>]*class="[^"]*\blp-modal\b[^"]*"[^>]*>/g)) {
    const tag = m[0];
    // observed in an AI run: the docs' "static open" demo copied without `hidden` → full-page overlay on load
    const shell = html.slice(m.index, m.index + 400);
    if (!/\bhidden\b/.test(tag) && !/lp-modal__shell--inline/.test(shell)) {
      const msg = 'Modal: lp-modal without `hidden` is a fixed overlay covering the page on load — closed modals keep `hidden`; the docs\' "static open" demo is for the preview iframe only';
      // a bare fragment may legitimately be a preview; a full document never is
      if (/<body\b/i.test(html)) fail(msg); else warn(msg);
    }
  }
  if (/\blp-modal\b/.test(html)) {
    if (!/lp-modal__shell[^>]*role="dialog"/.test(html) && !/role="dialog"[^>]*lp-modal__shell/.test(html)) fail('Modal: lp-modal__shell must carry role="dialog"');
    if (!/aria-modal="true"/.test(html)) fail('Modal: aria-modal="true" missing');
    if (!/aria-labelledby=/.test(html)) fail('Modal: aria-labelledby missing (point at lp-modal__title)');
    if (!/data-lp-modal-open=|Lepidus\.openModal/.test(html)) warn('Modal: nothing opens it (data-lp-modal-open="<id>" or Lepidus.openModal)');
  }
  // Dropdown
  for (const m of html.matchAll(/<div[^>]*class="[^"]*\blp-dropdown\b[^"]*"[^>]*>/g)) {
    const tag = m[0];
    const block = html.slice(m.index, m.index + 6000);
    if (!/data-lp-dropdown="(single|multi)"/.test(tag)) fail('Dropdown: data-lp-dropdown="single|multi" missing on lp-dropdown');
    if (!/<button[^>]*lp-dropdown__trigger/.test(block)) fail('Dropdown: trigger must be a native <button class="lp-dropdown__trigger">');
    if (!/aria-haspopup="listbox"/.test(block)) fail('Dropdown: trigger missing aria-haspopup="listbox"');
    if (!/aria-expanded=/.test(block)) fail('Dropdown: trigger missing aria-expanded');
    if (!/lp-dropdown__panel/.test(block)) fail('Dropdown: lp-dropdown__panel missing');
    if (!/lp-dropdown__trigger--disabled/.test(block) && !/lp-dropdown__header/.test(block)) fail('Dropdown: open-panel lp-dropdown__header is part of the component — do not omit it');
    // load-bearing for lepidus.js (it copies the option label into the trigger) — all three observed missing in an AI run
    if (/lp-dropdown__options\b/.test(block)) fail('Dropdown: the list is lp-dropdown__list, not lp-dropdown__options');
    if (/lp-dropdown__option\b/.test(block) && !/lp-dropdown__option-label/.test(block)) fail('Dropdown: options need <span class="lp-dropdown__option-label"> — lepidus.js copies it into the trigger on selection');
    if (/lp-dropdown__header\b/.test(block) && !/lp-dropdown__header-label/.test(block)) fail('Dropdown: lp-dropdown__header must contain lp-dropdown__header-label (+ the --open chevron)');
    if (!/lp-dropdown__list[^>]*role="listbox"|role="listbox"[^>]*lp-dropdown__list/.test(block)) fail('Dropdown: lp-dropdown__list must have role="listbox"');
    if (!/<button[^>]*lp-dropdown__option[^>]*role="option"|<button[^>]*role="option"[^>]*lp-dropdown__option/.test(block)) fail('Dropdown: options must be <button class="lp-dropdown__option" role="option">');
    if (/data-lp-dropdown="multi"/.test(tag)) {
      if (!/aria-multiselectable="true"/.test(block)) fail('Dropdown (multi): aria-multiselectable="true" missing');
      if (!/aria-checked=/.test(block)) fail('Dropdown (multi): options need aria-checked');
      if (!/lp-dropdown__checkbox/.test(block)) fail('Dropdown (multi): built-in lp-dropdown__checkbox anatomy missing');
    }
    if (/lp-dropdown__trigger--disabled/.test(block) && !/<button[^>]*lp-dropdown__trigger--disabled[^>]*\bdisabled\b/.test(block)) fail('Dropdown: disabled modifier without native disabled attribute');
  }
  // Tabs
  if (/data-lp-tabs/.test(html)) {
    if (!/role="tablist"/.test(html)) fail('Tabs: role="tablist" missing');
    if (!/role="tab"/.test(html)) fail('Tabs: role="tab" buttons missing');
    if (!/aria-controls=/.test(html)) warn('Tabs: tabs normally carry aria-controls → tabpanel ids');
    if (!/role="tabpanel"/.test(html)) warn('Tabs: role="tabpanel" panels not in this fragment');
  }
  // Table
  if (/\blp-table\b/.test(html)) {
    if (!/<table[^>]*lp-table__table/.test(html)) fail('Table: <table class="lp-table__table"> missing (no div grids)');
    if (!/<th[^>]*scope="col"/.test(html)) warn('Table: header cells should carry scope="col"');
  }
  // Toggle
  for (const m of html.matchAll(/<[a-z]+[^>]*class="[^"]*\blp-toggle\b[^"]*"[^>]*>/g)) {
    if (!/role="switch"/.test(m[0])) fail('Toggle: role="switch" missing');
    if (!/aria-checked=/.test(m[0])) fail('Toggle: aria-checked missing');
    if (!/^<button/.test(m[0])) fail('Toggle: must be a native <button>');
  }
  // Input error
  if (/lp-input__field--error/.test(html)) {
    if (!/aria-invalid="true"/.test(html)) fail('Input error: aria-invalid="true" missing on the input');
    if (!/lp-input__message--error/.test(html)) fail('Input error: visible lp-input__message--error missing');
    if (!/aria-describedby=/.test(html)) fail('Input error: aria-describedby must point at the message');
  }
  // Input: the label is part of the component (lp-input__row + lp-input__label) or an aria-label on the input
  for (const m of html.matchAll(/<div[^>]*class="[^"]*\blp-input\b[^"]*"[^>]*>/g)) {
    const block = html.slice(m.index, m.index + 1200);
    // inside lp-modal__fields the documented label is lp-modal__field-label (precedes the lp-input)
    const inModalFields = /lp-modal__field-label[^>]*>[^<]*<\/label>\s*$/.test(html.slice(Math.max(0, m.index - 200), m.index));
    if (!inModalFields && !/lp-input__label/.test(block) && !/<input[^>]*aria-label/.test(block)) warn('Input: no lp-input__label row and no aria-label on the input — use lp-input__row--label-left|top + lp-input__label, not an external <label>');
    // observed in an AI run: an external <label for> *and* the built-in lp-input__label → two labels for one field
    const id = block.match(/<input[^>]*\bid="([^"]+)"/)?.[1];
    if (id && /lp-input__label/.test(block)) {
      const labels = [...html.matchAll(new RegExp(`<label[^>]*\\bfor="${id}"`, 'g'))].length;
      if (labels > 1) fail(`Input #${id}: ${labels} <label for> elements — the lp-input__label inside the component is the label; remove the external one`);
    }
  }
  // Breadcrumb
  if (/\blp-breadcrumb\b/.test(html) && !/aria-current="page"/.test(html)) fail('Breadcrumb: aria-current="page" missing on the current item');
  // Avatar
  if (/\blp-avatar\b/.test(html) && !/role="img"/.test(html)) warn('Avatar: role="img" + aria-label expected');
  // Dropdown header text vs trigger
  return { name, fails: [...new Set(fails)], warns: [...new Set(warns)], classes: used.size, hooks: [...hooks] };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const files = process.argv.slice(2);
  if (!files.length) {
    console.error('usage: node scripts/validate-lp-html.mjs <file.html> [more.html …]');
    process.exit(2);
  }
  let bad = 0;
  for (const f of files) {
    const r = validate(readFileSync(f, 'utf8'), f);
    const status = r.fails.length ? '✖' : '✓';
    console.log(`${status} ${f} — ${r.classes} lp- classes, hooks: ${r.hooks.join(', ') || 'none'}`);
    for (const m of r.fails) console.log(`   FAIL  ${m}`);
    for (const m of r.warns) console.log(`   warn  ${m}`);
    if (r.fails.length) bad++;
  }
  process.exit(bad ? 1 : 0);
}
