import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { SITE_URL } from './scripts/site-url.mjs';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
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
