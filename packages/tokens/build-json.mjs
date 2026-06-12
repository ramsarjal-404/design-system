/**
 * Lepidus token import — Figma DTCG export → clean, tier-split DTCG source files.
 *
 * Reads the raw Figma export (src/figma/*, resolved values + alias metadata) and
 * emits W3C DTCG source files that Style Dictionary consumes:
 *
 *   src/primitive.tokens.json        literal values (color / dimension / fontWeight / number)
 *   src/semantic.light.tokens.json   default theme — references {primitive.*}
 *   src/semantic.dark.tokens.json    [data-theme="dark"] overrides
 *   src/semantic.hc.tokens.json      [data-theme="hc"] overrides
 *   src/component.tokens.json        references {semantic.*}
 *
 * Taxonomy:
 *   - aliased tokens use DTCG references, e.g. {semantic.color.input.border}
 *   - $type is normalised to color | dimension | fontWeight | number (from Figma scopes)
 *   - each token keeps $extensions.com.figma.codeSyntax.WEB so the build can emit
 *     the exact Figma Dev-Mode variable name, and the file round-trips to Figma.
 *
 * Run: node packages/tokens/build-json.mjs   (npm run tokens:import)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIGMA = join(__dirname, 'src', 'figma');
const SRC = join(__dirname, 'src');
const read = (p) => JSON.parse(readFileSync(join(FIGMA, p), 'utf8'));

const SET_PREFIX = { Primitives: 'primitive', Semantic: 'semantic', Component: 'component' };
const DIMENSION_SCOPES = new Set([
  'CORNER_RADIUS', 'FONT_SIZE', 'LINE_HEIGHT', 'LETTER_SPACING',
  'GAP', 'WIDTH_HEIGHT', 'STROKE_FLOAT',
]);

const isLeaf = (n) => n && typeof n === 'object' && '$value' in n && '$type' in n;

function dtcgType(leaf) {
  if (leaf.$type === 'color') return 'color';
  const scopes = leaf.$extensions?.['com.figma.scopes'] ?? [];
  if (scopes.includes('FONT_STYLE')) return 'fontWeight';
  if (scopes.includes('OPACITY')) return 'number';
  if (scopes.some((s) => DIMENSION_SCOPES.has(s))) return 'dimension';
  // Effect primitives (blur / shadow) carry no scopes — classify by name:
  // length parts are dimensions, opacity stays a unitless number.
  const name = leaf.$extensions?.['com.figma.codeSyntax']?.WEB ?? '';
  if (/opacity/.test(name)) return 'number';
  if (/blur|offset-x|offset-y|spread/.test(name)) return 'dimension';
  return 'number';
}

function colorLiteral(value) {
  if (typeof value === 'string') return value;
  const { hex, alpha, components } = value;
  if (alpha == null || alpha === 1) return (hex || '').toUpperCase();
  const [r, g, b] = components.map((c) => Math.round(c * 255));
  return `rgba(${r}, ${g}, ${b}, ${Number(alpha.toFixed(3))})`;
}

function aliasRef(leaf) {
  const a = leaf?.$extensions?.['com.figma.aliasData'];
  if (!a) return null;
  const prefix = SET_PREFIX[a.targetVariableSetName];
  return prefix ? `{${prefix}.${a.targetVariableName.split('/').join('.')}}` : null;
}

/** Rebuild a token tree into clean DTCG (typed, referenced, slim $extensions). */
function transform(node, out = {}) {
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    if (isLeaf(child)) {
      const type = dtcgType(child);
      const ref = aliasRef(child);
      let value;
      if (ref) value = ref;
      else if (type === 'color') value = colorLiteral(child.$value);
      else if (type === 'dimension') value = `${child.$value}px`;
      else value = child.$value; // fontWeight | number
      const ext = {};
      const web = child.$extensions?.['com.figma.codeSyntax']?.WEB;
      if (web) ext['com.figma.codeSyntax'] = { WEB: web };
      out[key] = { $type: type, $value: value, ...(Object.keys(ext).length ? { $extensions: ext } : {}) };
    } else if (child && typeof child === 'object') {
      out[key] = transform(child, {});
    }
  }
  return out;
}

/**
 * src/figma-gaps.tokens.json — hand-maintained tokens the Figma export does
 * not (yet) carry: chart series colors, progress/nav semantics added after the
 * last Dark/HC export, focus ring, flyout/drawer shadows, and component
 * rebinds pending a Figma-side fix (toggle.off-bg). Merged over the Figma
 * export so `tokens:import` never wipes them. When a token lands in Figma,
 * delete it here.
 */
const deepMerge = (base, extra) => {
  for (const [k, v] of Object.entries(extra)) {
    base[k] =
      v && typeof v === 'object' && !('$value' in v) && base[k] && typeof base[k] === 'object'
        ? deepMerge(base[k], v)
        : v;
  }
  return base;
};
const gaps = JSON.parse(readFileSync(join(SRC, 'figma-gaps.tokens.json'), 'utf8'));

const primitive = deepMerge(transform(read('Primitives.tokens.json')), gaps.primitive ?? {});
const semLight = deepMerge(transform(read('Semantic/Light.tokens.json')), gaps.semantic?.light ?? {});
const semDark = deepMerge(transform(read('Semantic/Dark.tokens.json')), gaps.semantic?.dark ?? {});
const semHc = deepMerge(transform(read('Semantic/HighContrast.tokens.json')), gaps.semantic?.hc ?? {});
const component = deepMerge(transform(read('Component.tokens.json').component), gaps.component ?? {});

const write = (name, obj) => writeFileSync(join(SRC, name), JSON.stringify(obj, null, 2) + '\n');

// Note: no root $description — Style Dictionary would parse any "{...}" in the
// text as a token reference. Documentation lives in packages/tokens/README.md.
write('primitive.tokens.json', { primitive });
write('semantic.light.tokens.json', { semantic: semLight });
write('semantic.dark.tokens.json', { semantic: semDark });
write('semantic.hc.tokens.json', { semantic: semHc });
write('component.tokens.json', { component });

// Also emit a single bundled tokens.json (Tokens Studio / portability)
write('../tokens.json', { primitive, semantic: semLight, component });

// --- Validate references ---
const paths = new Set();
const index = (node, prefix) => {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    const p = prefix ? `${prefix}.${k}` : k;
    isLeaf(v) ? paths.add(p) : index(v, p);
  }
};
index({ primitive, semantic: semLight, component }, '');

let refs = 0, dangling = 0;
const check = (node) => {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    if (isLeaf(v)) {
      const m = typeof v.$value === 'string' && /^\{(.+)\}$/.exec(v.$value);
      if (m) { refs++; if (!paths.has(m[1])) { dangling++; console.warn(`  ✗ dangling {${m[1]}}`); } }
    } else check(v);
  }
};
[{ primitive, semantic: semLight, component }, semDark, semHc].forEach(check);

console.log(`✓ DTCG sources written — ${paths.size} tokens, ${refs} references, ${dangling} dangling`);
if (dangling) process.exitCode = 1;
