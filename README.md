# design.cave.technology

The public website of the Cave design system. A static site generated from the design system's own files, so the site cannot drift from the system: it shows what is in `source/`, nothing else.

English at `/`, Arabic (right to left) at `/ar/`. Light, Dark, Black and System themes.

## Scope: code and docs only

This site is the open-source design system. Brand assets (logo, symbol, icons, patterns, the Hero font) are not open source and live on the separate brand site, https://brand.cave.technology (`../brand.cave.technology`). Only the symbol appears here, as a "built by Cave" credit. The build leaves the brand-only components (Logo, Section tag) out, offers only the open fonts (Poppins, Almarai, SIL OFL) for download, and a test fails if a logo, icon, pattern or non-open font reaches `dist/`. Hero is served only so this site can set its own headings.

**Fonts in this repository.** Poppins and Almarai (SIL OFL) are committed. Hero and Blue Ocean are not: the font files say "All rights reserved" and carry no licence. They are git-ignored; copy `Hero.otf` and `Hero-Light.otf` into `source/fonts/` locally to get Hero headings, otherwise the site falls back to Poppins and the build still passes.

Follow-up before the packages are published: the Cave-specific patterns (Auth card, Add-on card, Footer, Powered by Cave) and the Cave product rules in the guidelines page should be separated from the core components.

## How it works

- `source/` is a snapshot of the Cave design system artifact (claude.ai/artifact/SSNhnZjFs1D45nxEVbvTNE): `tokens.json`, `README.md`, `Platform-mapping.md`, `components/` (bundle.css, each component's README and preview), `fonts/`, `logos/`, `icons/`, and `meta.json` (version and last change).
- `build.mjs` reads it and writes `dist/`: `tokens.css` (Light, Dark, Black), `fonts.css`, `components.css`, `cave_tokens.dart`, a page per foundation, brand, guidelines, platforms and downloads, and a page per component with its live preview in an iframe.
- The colour page measures contrast from the tokens at build time. `npm test` checks it against the figures in the README (5.6:1 white on lagoon, 4.55:1 navy on teal, 5.1:1 charcoal on teal), that every text pair passes, that every page exists in both languages, and that every internal link resolves.
- The interface (menus, titles, table headings) is translated in `src/i18n.mjs`. The detailed guidance (README sections, component READMEs) is the design system's English text, shown as is and marked in Arabic pages: translating it here would let it drift from the source.
- `Platform-mapping` is built but marked `noindex` and left out of the sitemap.

## Commands

```
npm install
npm run build      # source/ -> dist/
npm run dev        # build, then serve dist/ on http://localhost:4173
npm test
```

## Updating from the design system

The design system lives in a claude.ai artifact, so the snapshot is refreshed by reading its files again: copy `project/tokens.json`, `README.md`, `Platform-mapping.md`, `components/**`, `fonts/*`, the logo and icon SVGs into `source/` (logos and icons come from the artifact's asset store; their names are in its `design-system.json`), set `meta.json` from `lastChange`, then `npm run build && npm test`. Ask Claude to "sync the design site" and it does these steps.

## Deploying (Firebase Hosting)

The Firebase project is `cave-design-system` (Hosting site `cave-design-system`, default URL https://cave-design-system.web.app); `.firebaserc` points at it. It belongs to the shmaisanimostafa@gmail.com Google account, so pass that account (the CLI's default may be another one):

1. `npm run build`
2. `firebase deploy --only hosting --account shmaisanimostafa@gmail.com`
3. In the Hosting console add the custom domain `design.cave.technology` and the DNS records it shows.

`firebase.json` serves `dist/` with clean URLs, no-cache HTML, short asset caching, `noindex` on `/previews/`, and the same security headers as the other Cave sites.
