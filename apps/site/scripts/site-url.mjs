/**
 * site-url.mjs — the one place the docs site's public origin is decided.
 *
 * Every absolute URL the site prints (AI chat context, hotlink snippets,
 * design.md / llms-full.txt pointers, astro `site`) reads from here, so the
 * same build serves correctly from any Vercel project or custom domain.
 *
 * Resolution order:
 *   1. PUBLIC_SITE_URL           — explicit override (env var, no trailing slash)
 *   2. VERCEL_PROJECT_PRODUCTION_URL — set by Vercel on every build
 *   3. the original docs domain  — local builds and non-Vercel hosts
 */
const explicit = process.env.PUBLIC_SITE_URL;
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const DEFAULT_SITE_URL = 'https://lepidus-design-system-button.vercel.app';

export const SITE_URL = (
  explicit || (vercel ? `https://${vercel}` : DEFAULT_SITE_URL)
).replace(/\/+$/, '');
