/**
 * Site data layer — joins the generated artifacts:
 *  - component-manifest.json (docgen props + lp-* class inventory)
 *  - stories-index.json      (Storybook titles/ids parsed from CSF sources)
 *  - content collections     (per-component MDX + meta.json)
 */
import manifest from '../../public/component-manifest.json';
import storiesIndex from '../data/stories-index.json';

export interface PropDoc {
  name: string;
  type: string;
  required: boolean;
  defaultValue: string | number | boolean | null;
  description?: string;
}
export interface PlainCss {
  block: string;
  classes: string[];
}
export interface StoryDoc {
  export: string;
  name: string;
  id: string;
}
export interface StoryFile {
  title: string;
  category: string;
  titleId: string;
  stories: StoryDoc[];
}
export interface ComponentMeta {
  description?: string;
  status?: string;
  heroStory?: string;
  heroHeight?: number;
  /** index-card thumbnail story when it should differ from the hero (e.g. variant grids) */
  thumbStory?: string;
  /** hero shows width presets (mobile / full) — layout-sensitive components */
  viewports?: boolean;
  related?: string[];
  a11yNotes?: string[];
}
export interface ComponentDoc {
  name: string;
  slug: string;
  description: string;
  reactImport: string;
  props: PropDoc[];
  plainCss: PlainCss | null;
  storyFile: StoryFile | null;
  category: string;
  meta: ComponentMeta;
}

export const kebab = (name: string) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

const metaModules = import.meta.glob<{ default: ComponentMeta }>(
  '/src/content/components/*/meta.json',
  { eager: true }
);
const metaFor = (slug: string): ComponentMeta =>
  metaModules[`/src/content/components/${slug}/meta.json`]?.default ?? {};

const stories = storiesIndex as Record<string, StoryFile>;

export const components: ComponentDoc[] = (manifest.components as any[])
  // public components only — internal helpers (contexts, hooks, illustration
  // partials) have no story file of their own and don't get doc pages
  .filter((c) => stories[c.name])
  .map((c) => {
    const slug = kebab(c.name);
    const storyFile = stories[c.name] ?? null;
    return {
      name: c.name,
      slug,
      description: c.description ?? '',
      reactImport: c.reactImport,
      props: c.props as PropDoc[],
      plainCss: c.plainCss ?? null,
      storyFile,
      category: storyFile?.category ?? 'Components',
      meta: metaFor(slug),
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

export const bySlug = new Map(components.map((c) => [c.slug, c]));

export const CATEGORY_ORDER = [
  'Actions',
  'Forms',
  'Data Display',
  'Feedback',
  'Navigation',
  'Overlays',
  'Charts',
  'Components',
];

export const categories: { name: string; components: ComponentDoc[] }[] = CATEGORY_ORDER.map(
  (name) => ({
    name,
    components: components.filter((c) => c.category === name),
  })
).filter((g) => g.components.length > 0);

/** Storybook base URL — same-origin /storybook in production builds. */
export const STORYBOOK_BASE = import.meta.env.PUBLIC_STORYBOOK_BASE ?? '/storybook';

export const storyUrl = (id: string, theme = 'light') =>
  `${STORYBOOK_BASE}/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`;
export const storyDocsUrl = (id: string) => `${STORYBOOK_BASE}/?path=/story/${id}`;
