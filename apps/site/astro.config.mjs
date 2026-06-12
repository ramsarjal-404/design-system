import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://lepidus-design-system-button.vercel.app',
  integrations: [mdx()],
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
  vite: {
    // tokens.css / lepidus.css are copied into public/lepidus by scripts/prepare.mjs
    server: { fs: { allow: ['..', '../..'] } },
  },
});
