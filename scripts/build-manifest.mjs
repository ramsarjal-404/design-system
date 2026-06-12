#!/usr/bin/env node
/**
 * build-manifest.mjs — machine-readable component manifest
 *
 * Combines react-docgen-typescript prop extraction (from the component .tsx
 * files) with the plain-CSS class inventory (from packages/css/build-css.mjs)
 * into public/component-manifest.json, which Storybook serves at the site
 * root. This is the data source for AI tooling (llms.txt's structured twin)
 * and the Lepidus MCP server.
 */
import { readdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import docgen from 'react-docgen-typescript';
import { getClassInventory } from '../packages/css/build-css.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const componentsDir = join(root, 'packages/react/src/components');
const outPath = join(root, 'public/component-manifest.json');

const parser = docgen.withCustomConfig(join(root, 'tsconfig.json'), {
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop) =>
    // own props + a11y/handler basics; drop the hundreds of inherited DOM props
    !prop.parent || !prop.parent.fileName.includes('node_modules'),
});

const cssByReactName = new Map(
  getClassInventory().map((c) => [c.name.replace(/-/g, ''), c])
);

const components = [];
const seen = new Set();
for (const dir of readdirSync(componentsDir).sort()) {
  const dirPath = join(componentsDir, dir);
  if (!existsSync(join(dirPath, 'index.ts'))) continue;
  // every PascalCase .tsx in the folder (Charts/ holds several chart
  // components), excluding stories and icon helpers
  const files = readdirSync(dirPath)
    .filter((f) => /^[A-Z][A-Za-z]*\.tsx$/.test(f) && !f.includes('.stories.'))
    .map((f) => join(dirPath, f));
  const parsed = files.flatMap((f) => parser.parse(f));
  for (const doc of parsed) {
    if (seen.has(doc.displayName)) continue;
    seen.add(doc.displayName);
    const props = Object.entries(doc.props ?? {})
      .map(([name, p]) => ({
        name,
        type: p.type?.name ?? 'unknown',
        required: !!p.required,
        defaultValue: p.defaultValue?.value ?? null,
        description: p.description || undefined,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    const css = cssByReactName.get(doc.displayName.toLowerCase()) ?? null;
    components.push({
      name: doc.displayName,
      description: (doc.description || '').split('\n\n')[0],
      reactImport: `import { ${doc.displayName} } from '@lepidus/react'`,
      props,
      plainCss: css && { block: css.block, classes: css.classes },
    });
  }
}

const manifest = {
  $schema: 'https://lepidus-design-system-button.vercel.app/component-manifest.json',
  generatedFrom: 'scripts/build-manifest.mjs — do not edit by hand',
  designSystem: 'Lepidus',
  docs: 'https://lepidus-design-system-button.vercel.app',
  rules: 'https://lepidus-design-system-button.vercel.app/llms.txt',
  theming: 'set data-theme="light" | "dark" | "hc" on <html>',
  components,
};

writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`✓ public/component-manifest.json — ${components.length} components documented`);
