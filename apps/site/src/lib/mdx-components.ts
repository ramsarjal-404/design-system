/**
 * Components injected into every component-doc MDX file — usable directly
 * (<Example/>, <StoryEmbed/>, <DoDont/>, <Callout/>, <RelatedCards/>)
 * without imports.
 */
import Example from '../components/Example.astro';
import StoryEmbed from '../components/StoryEmbed.astro';
import DoDont from '../components/DoDont.astro';
import Callout from '../components/Callout.astro';
import RelatedCards from '../components/RelatedCards.astro';

export const mdxComponents = { Example, StoryEmbed, DoDont, Callout, RelatedCards };

type MdxModule = {
  Content: any;
  getHeadings: () => { depth: number; slug: string; text: string }[];
};

const usage = import.meta.glob<MdxModule>('/src/content/components/*/usage.mdx');
const code = import.meta.glob<MdxModule>('/src/content/components/*/code.mdx');
const a11y = import.meta.glob<MdxModule>('/src/content/components/*/accessibility.mdx');

export async function loadTab(slug: string, tab: 'usage' | 'code' | 'accessibility') {
  const globs = { usage, code, accessibility: a11y }[tab];
  const loader = globs[`/src/content/components/${slug}/${tab}.mdx`];
  return loader ? await loader() : null;
}
