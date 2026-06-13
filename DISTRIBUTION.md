# Distributing Lepidus internally

Lepidus is **private to Lepide** — the packages are `UNLICENSED` and published
with `publishConfig.access = "restricted"`, so they never go to the public npm
registry. There are three ways product teams consume it; pick per team.

## 1. Hosted CDN — the default for HTML/CSS/JS teams

The docs site serves the built assets at stable, versioned URLs. Link them —
nothing to install, copy, or build:

```html
<link rel="stylesheet" href="https://<your-host>/v1/lepidus.css" />
<script src="https://<your-host>/v1/lepidus.js" defer></script>
```

- `/v1/lepidus.css` — tokens + every component (the one-file path)
- `/v1/lepidus.components.css` — components only (link `/v1/tokens.css` yourself)
- `/v1/lepidus.js` — behavior for interactive components

The `v1/` folder is regenerated on every site build by
`apps/site/scripts/prepare.mjs`. On a **breaking** token/class change, copy the
assets to a new `v2/` folder and keep `v1/` serving — existing pages never break.

> For an internal-only audience, host these behind your own domain or an
> authenticated internal server rather than the public Vercel deploy.

## 2. npm packages — for React and tooling teams

`@ramsarjal-404/react`, `@ramsarjal-404/tokens`, and `@ramsarjal-404/css` are scoped + restricted.
To make `npm install @ramsarjal-404/*` work you need a **private registry**. Two
common internal options:

- **GitHub Packages** — once this repo lives in your GitHub org, add to each
  package's `publishConfig`:
  ```json
  "publishConfig": { "registry": "https://npm.pkg.github.com", "access": "restricted" }
  ```
  Consumers add `@ramsarjal-404:registry=https://npm.pkg.github.com` to their
  `.npmrc` with a read token.
- **Self-hosted (Verdaccio)** or a private npm org — set the `registry` in
  `publishConfig` to that URL.

Release flow (changesets is already configured):

```bash
npm run changeset          # describe the change, pick the bump
npm run version-packages   # apply versions + changelogs
npm run build:react        # build the libraries
npm publish --workspaces   # to the private registry above
```

## 3. Tarballs — no registry needed

For an air-gapped team or before a registry exists, ship versioned tarballs:

```bash
npm pack --workspace @ramsarjal-404/css      # → lepidus-css-1.0.0.tgz
npm pack --workspace @ramsarjal-404/tokens
npm pack --workspace @ramsarjal-404/react
```

Consumers install from the file or an internal URL:

```bash
npm install ./lepidus-css-1.0.0.tgz
```

## What's already in place

- All three packages: `private: false`, `license: UNLICENSED`,
  `publishConfig.access: restricted`, correct `exports`/`files`.
- `@ramsarjal-404/css` exposes `style` + `sideEffects` for bundler tree-shaking.
- Changesets (`.changeset/`) for versioning + changelogs.

## What's still needed to turn on `npm install`

1. A **private registry URL** (GitHub Packages once on GitHub, or Verdaccio/npm
   private) added to each `publishConfig.registry`.
2. A **CI publish step** (a changesets release action) wired once the repo has a
   remote — until then, publish manually with the release flow above.
