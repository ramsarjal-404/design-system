#!/usr/bin/env node
/**
 * @lepidus/css — build script
 *
 * Transforms the React package's CSS modules into plain, prefixed CSS classes
 * (SLDS/Bootstrap style) so HTML/CSS/JS consumers can use the design system
 * without React or a build tool.
 *
 * One source of truth: each output file is generated from the corresponding
 * `*.module.css` in packages/react — never edit dist/ by hand. Class naming
 * is BEM with an `lp-` prefix:
 *
 *   block     .button     → .lp-button
 *   element   .iconLeft   → .lp-button__icon-left
 *   modifier  .primary    → .lp-button--primary
 *
 * Outputs (packages/css/dist/):
 *   lepidus.css             tokens + all components in one file (easiest path)
 *   lepidus.components.css  components only (link @lepidus/tokens css yourself)
 *   components/<name>.css   one file per component
 *
 * The script fails the build if a selector class escapes the mapping or if a
 * generated var() reference does not exist in tokens.css.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const componentsDir = join(here, '../react/src/components');
const tokensCssPath = join(here, '../tokens/build/css/tokens.css');
const distDir = join(here, 'dist');

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/**
 * Per-component mapping. `block` is the root class in the source module.
 * `elements` become `lp-<name>__<part>`; `map` holds explicit overrides
 * (e.g. modifiers that belong to an element, not the block); every other
 * class in the module becomes a block modifier `lp-<name>--<mod>`.
 */
const COMPONENTS = [
  {
    name: 'button',
    source: 'Button/Button.module.css',
    block: 'button',
    elements: ['iconLeft', 'iconRight'],
  },
  {
    name: 'badge',
    source: 'Badge/Badge.module.css',
    block: 'badge',
    elements: ['dot', 'icon'],
  },
  {
    name: 'tag',
    source: 'Tag/Tag.module.css',
    block: 'tag',
    elements: ['label', 'remove'],
  },
  {
    name: 'card',
    source: 'Card/Card.module.css',
    block: 'card',
    elements: ['header', 'title', 'actions', 'body', 'footer'],
  },
  {
    name: 'input',
    source: 'Input/Input.module.css',
    block: 'wrapper',
    elements: ['row', 'label', 'field', 'input', 'iconLeft', 'iconRight', 'message'],
    map: {
      rowLeft: 'lp-input__row--label-left',
      rowTop: 'lp-input__row--label-top',
      error: 'lp-input__field--error',
      disabled: 'lp-input__field--disabled',
      messageIndent: 'lp-input__message--indent',
      errorMessage: 'lp-input__message--error',
    },
  },
  {
    name: 'alert-panel',
    source: 'AlertPanel/AlertPanel.module.css',
    block: 'panel',
    elements: ['icon', 'headline', 'title', 'summary', 'details', 'action', 'footnote'],
  },
  {
    name: 'toggle',
    source: 'Toggle/Toggle.module.css',
    block: 'toggle',
    elements: ['thumb'],
  },
  {
    name: 'checkbox',
    source: 'Checkbox/Checkbox.module.css',
    block: 'root',
    elements: ['control', 'input', 'box', 'check', 'dash', 'label'],
    map: {
      error: 'lp-checkbox__box--error',
      disabled: 'lp-checkbox--disabled',
    },
  },
  {
    name: 'breadcrumb',
    source: 'Breadcrumb/Breadcrumb.module.css',
    block: 'breadcrumb',
    elements: ['list', 'item', 'link', 'separator', 'current'],
  },
  {
    name: 'table',
    source: 'Table/Table.module.css',
    block: 'wrapper',
    elements: [
      'table', 'th', 'headerInner', 'headerLabel', 'sortButton', 'sortArrow',
      'filterCell', 'filterField', 'filterInput', 'searchIcon',
      'td', 'cellInner', 'cellText', 'emptyCell', 'checkbox',
    ],
    map: {
      sortArrowActive: 'lp-table__sort-arrow--active',
      sortArrowDesc: 'lp-table__sort-arrow--desc',
      selectedRow: 'lp-table__row--selected',
    },
  },
  {
    name: 'link',
    source: 'Link/Link.module.css',
    block: 'link',
    elements: ['icon', 'externalIcon', 'visuallyHidden'],
  },
  {
    name: 'avatar',
    source: 'Avatar/Avatar.module.css',
    block: 'avatar',
    elements: ['image', 'fallback', 'status'],
    map: {
      'status-online': 'lp-avatar__status--online',
      'status-away': 'lp-avatar__status--away',
      'status-offline': 'lp-avatar__status--offline',
      group: 'lp-avatar-group',
      groupItem: 'lp-avatar-group__item',
      overflow: 'lp-avatar--overflow',
    },
  },
  {
    name: 'skeleton',
    source: 'Skeleton/Skeleton.module.css',
    block: 'skeleton',
    elements: [],
    map: {
      paragraph: 'lp-skeleton-paragraph',
      lastLine: 'lp-skeleton-paragraph__last-line',
    },
  },
  {
    name: 'spinner',
    source: 'Spinner/Spinner.module.css',
    block: 'root',
    elements: ['svg', 'track', 'arc', 'visuallyHidden'],
  },
  {
    name: 'message',
    source: 'Message/Message.module.css',
    block: 'message',
    elements: ['icon', 'content', 'text', 'title', 'body', 'actions', 'close'],
  },
  {
    name: 'empty-state',
    source: 'EmptyState/EmptyState.module.css',
    block: 'emptyState',
    elements: ['illustration', 'message', 'action'],
  },
  {
    name: 'tabs',
    source: 'Tabs/Tabs.module.css',
    block: 'tabs',
    elements: ['tab'],
    map: {
      active: 'lp-tabs__tab--active',
    },
  },
  {
    name: 'modal',
    source: 'Modal/Modal.module.css',
    block: 'overlay',
    elements: ['shell', 'header', 'title', 'body', 'fields', 'fieldLabel', 'custom', 'footer'],
    map: {
      inline: 'lp-modal__shell--inline',
      sm: 'lp-modal__shell--sm',
      md: 'lp-modal__shell--md',
      lg: 'lp-modal__shell--lg',
      headerCenter: 'lp-modal__header--center',
      headerLeft: 'lp-modal__header--left',
      fieldLabelEmpty: 'lp-modal__field-label--empty',
    },
    // React unmounts the closed modal; plain HTML keeps it in the DOM with
    // [hidden], which the block's display:flex would otherwise override.
    extra: '.lp-modal[hidden] { display: none !important; }',
  },
  {
    name: 'accordion',
    source: 'Accordion/Accordion.module.css',
    block: 'accordion',
    elements: ['item', 'heading', 'trigger', 'title', 'chevron', 'panel', 'panelInner', 'panelContent'],
    map: {
      open: 'lp-accordion__panel--open',
    },
  },
  {
    name: 'pagination',
    source: 'Pagination/Pagination.module.css',
    block: 'pagination',
    elements: [
      'label', 'button', 'pageInput', 'pageSize', 'pageSizeTrigger',
      'pageSizeChevron', 'pageSizePanel', 'pageSizeOption',
    ],
    map: {
      pageSizeOptionSelected: 'lp-pagination__page-size-option--selected',
    },
  },
  {
    name: 'progress',
    source: 'Progress/Progress.module.css',
    block: 'progress',
    elements: ['label', 'row', 'track', 'fill', 'value', 'clock'],
  },
  {
    name: 'radio',
    source: 'Radio/Radio.module.css',
    block: 'root',
    elements: ['control', 'input', 'circle', 'dot', 'label'],
    map: {
      error: 'lp-radio__circle--error',
      disabled: 'lp-radio--disabled',
      group: 'lp-radio-group',
      groupLabel: 'lp-radio-group__label',
      options: 'lp-radio-group__options',
      horizontal: 'lp-radio-group__options--horizontal',
    },
  },
  {
    name: 'stepper',
    source: 'Stepper/Stepper.module.css',
    block: 'stepper',
    elements: ['input', 'controls', 'control'],
    map: {
      disabled: 'lp-stepper--disabled',
    },
  },
  {
    name: 'steps',
    source: 'Steps/Steps.module.css',
    block: 'steps',
    elements: ['item', 'stepButton', 'circle', 'dot', 'connector', 'label'],
    map: {
      done: 'lp-steps__circle--done',
      current: 'lp-steps__circle--current',
      upcoming: 'lp-steps__circle--upcoming',
      connectorDone: 'lp-steps__connector--done',
    },
  },
  {
    name: 'dropdown',
    source: 'Dropdown/Dropdown.module.css',
    block: 'wrapper',
    elements: [
      'trigger', 'triggerLabel', 'chevron', 'panel', 'header', 'headerLabel',
      'list', 'option', 'optionLabel', 'checkbox', 'footer',
    ],
    map: {
      chevronOpen: 'lp-dropdown__chevron--open',
      triggerHidden: 'lp-dropdown__trigger--hidden',
      disabled: 'lp-dropdown__trigger--disabled',
    },
    // Same [hidden]-vs-display:flex conflict as the modal overlay.
    extra: '.lp-dropdown__panel[hidden] { display: none !important; }',
  },
  {
    name: 'toast',
    source: 'Toast/Toast.module.css',
    block: 'toast',
    elements: ['badge', 'content', 'title', 'body', 'close'],
  },
  {
    name: 'tooltip',
    source: 'Tooltip/Tooltip.module.css',
    block: 'tooltip',
    elements: [],
  },
];

const CLASS_RE = /\.([A-Za-z_][A-Za-z0-9_-]*)/g;

function buildClassMap(cfg, sourceCss) {
  const map = new Map();
  map.set(cfg.block, `lp-${cfg.name}`);
  for (const el of cfg.elements ?? []) {
    map.set(el, `lp-${cfg.name}__${kebab(el)}`);
  }
  for (const [from, to] of Object.entries(cfg.map ?? {})) {
    map.set(from, to);
  }
  for (const match of sourceCss.matchAll(CLASS_RE)) {
    const cls = match[1];
    if (!map.has(cls)) map.set(cls, `lp-${cfg.name}--${kebab(cls)}`);
  }
  return map;
}

function transform(cfg) {
  const sourcePath = join(componentsDir, cfg.source);
  const sourceCss = readFileSync(sourcePath, 'utf8');
  const map = buildClassMap(cfg, sourceCss);
  // CSS modules scope @keyframes names per file; in the global bundle they
  // would collide (two components both declaring "rotate"), so prefix them.
  // The (?!\s*\() guard keeps function calls like transform: rotate(0deg).
  const keyframeNames = [
    ...sourceCss.matchAll(/@keyframes\s+([A-Za-z_][A-Za-z0-9_-]*)/g),
  ].map((m) => m[1]);
  // Rewrite class tokens outside comments only — comment prose like
  // "Button.module.css" must survive verbatim.
  const body = sourceCss
    .split(/(\/\*[\s\S]*?\*\/)/)
    .map((part) => {
      if (part.startsWith('/*')) return part;
      let out = part.replace(CLASS_RE, (_, cls) => `.${map.get(cls)}`);
      for (const name of keyframeNames) {
        out = out.replace(
          new RegExp(`\\b${name}\\b(?!\\s*\\()`, 'g'),
          `lp-${cfg.name}-${name}`
        );
      }
      return out;
    })
    .join('');
  const banner =
    `/* GENERATED by packages/css/build-css.mjs — do not edit.\n` +
    `   Source: packages/react/src/components/${cfg.source} */\n\n`;
  const extra = cfg.extra ? `\n/* plain-HTML compat (see build config) */\n${cfg.extra}\n` : '';
  return banner + body + extra;
}

function classesUsed(css) {
  // Strip comments and declaration blocks so only selector text is scanned —
  // dotted names inside values/comments (e.g. "build-css.mjs") are not classes.
  const selectorsOnly = css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\{[^{}]*\}/g, '{}');
  return [...selectorsOnly.matchAll(CLASS_RE)].map((m) => m[1]);
}

function fail(msg) {
  console.error(`✖ ${msg}`);
  process.exitCode = 1;
}

// --- build ------------------------------------------------------------------
const tokensCss = readFileSync(tokensCssPath, 'utf8');
const definedVars = new Set(
  [...tokensCss.matchAll(/(--[A-Za-z0-9-]+)\s*:/g)].map((m) => m[1])
);

mkdirSync(join(distDir, 'components'), { recursive: true });

const pieces = [];
for (const cfg of COMPONENTS) {
  const css = transform(cfg);

  for (const cls of classesUsed(css)) {
    if (!cls.startsWith('lp-')) {
      fail(`${cfg.name}: class ".${cls}" escaped the lp- mapping`);
    }
  }
  // A var() with a fallback (e.g. runtime vars set from JS) always resolves —
  // only bare references must exist in tokens.css.
  for (const m of css.matchAll(/var\(\s*(--[A-Za-z0-9-]+)\s*([,)])/g)) {
    if (m[2] === ')' && !definedVars.has(m[1])) {
      fail(`${cfg.name}: var(${m[1]}) not found in tokens.css`);
    }
  }

  writeFileSync(join(distDir, 'components', `${cfg.name}.css`), css);
  pieces.push(css);
  console.log(`✓ ${cfg.name}`);
}

if (process.exitCode) {
  console.error('Build failed — dist may be incomplete.');
  process.exit(1);
}

const header =
  `/* Lepidus Design System — plain CSS distribution (@lepidus/css)\n` +
  `   GENERATED — do not edit. Theming: set data-theme="dark" | "hc" on <html>. */\n\n`;

const componentsBundle = header + pieces.join('\n');
writeFileSync(join(distDir, 'lepidus.components.css'), componentsBundle);
writeFileSync(
  join(distDir, 'lepidus.css'),
  header + `/* === Design tokens === */\n` + tokensCss + '\n' + componentsBundle
);

copyFileSync(join(here, 'lepidus.js'), join(distDir, 'lepidus.js'));

console.log(
  `✓ wrote dist/lepidus.css, dist/lepidus.components.css, dist/lepidus.js, ${COMPONENTS.length} component files`
);
