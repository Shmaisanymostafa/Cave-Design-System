# Cave UI and design.cave.technology

A UI foundation prepared for open-source use for Arabic and English on Web and Flutter. This
repository owns the source, packages and bilingual documentation. The brand site
is maintained separately at https://brand.cave.technology.

## Workspace

- `source/tokens.json`: canonical palette, themes, typography and layout tokens.
- `source/catalog.mjs`: 15 components with bilingual guidance and executable HTML/JS/Dart examples.
- `source/guidance.mjs`, `source/messages.json`: bilingual guidance and built-in UI labels.
- `source/components/core.css`: reusable web styles using logical properties.
- `packages/tokens`: `@cave-ui/tokens`; CSS, typed JavaScript/JSON and DTCG subset exports.
- `packages/core`: `@cave-ui/core`; zero external runtime dependencies.
- `packages/flutter`: `cave_ui`; native SDK widgets, themes and localization integration.
- `src/`, `site/`: static documentation generation and browser controls.
- `source/legacy/` and the older component preview folders: historical references, not package inputs.

Git is the authoritative source. Do not overwrite this repository from an AI
artifact. Generated package outputs are reproducible; edit the sources and rebuild.
No changes to Cave Shops, POS, the mobile app or the company website are required.

## Build and validate

Requires Node 20+ and Flutter 3.35+ (validated with Flutter 3.47.6).

```sh
npm ci
npm test
npm run test:types
npm run build
npx playwright install chromium
npm run test:browser
cd packages/flutter
flutter pub get
flutter analyze
flutter test
```

`npm run build` generates packages, bilingual examples, downloadable archives and
`dist/`. `npm run build:packages` updates packages only. `npm run pack:packages`
packages already-built output. `npm run serve` serves the generated site.

The browser checks run against local servers. If the sibling brand checkout is
present, they also verify clicking whole theme labels in English and Arabic.
Set `CAVE_BROWSER_PATH` only when using a non-default Chromium executable.

## Documentation behaviour

The navbar separates documentation language, Web/Flutter and appearance. The
platform is shareable through `?platform=flutter` and preserved across navigation.
The preview language is independent of the documentation language. Theme changes
update previews. Flutter panels supply compiled/tested Dart source; the on-demand preview runs actual Flutter Web widgets.

## Releases and installation

Version `0.1.0-alpha.1` is distributed as downloadable archives at `/downloads`.
It is not published to npm or pub.dev. Registry names must be reserved and account
ownership confirmed before registry publication. The Flutter package deliberately
uses `publish_to: none` until that release step. See each package README for local
archive installation and `CHANGELOG.md` for compatibility notes.

CI builds and tests both platforms; it does not publish packages, upload release artifacts or deploy hosting. See `CONTRIBUTING.md`.

## Licensing and brand separation

Package code and generated design tokens are MIT licensed; each archive includes
its licence. Poppins and Almarai are optional downloads under their included SIL
OFL notices. No fonts are loaded from a network by the UI packages. Cave logos,
icons, patterns and proprietary fonts are excluded from packages. The site uses
Cave's symbol for its own identity; that asset retains separate brand terms.
Hero and Blue Ocean are not served by this design site. The brand site maintains
its own typography and assets.

## Deployment (paused by owner)

Current work is local and unreleased. Do not deploy without a new explicit instruction.

## Hosting reference

Firebase project and hosting site: `cave-design-system`. Build and pass checks, then:

```sh
firebase deploy --only hosting --project cave-design-system --account shmaisanimostafa@gmail.com
```

The existing custom domain is https://design.cave.technology. Only `dist/` is hosted.

## Unreleased playground and templates

See [status](docs/STATUS.md), [compatibility](docs/COMPATIBILITY.md),
[migration notes](docs/MIGRATION.md) and [accessibility coverage](docs/ACCESSIBILITY.md).
The `/templates` pages include settings, dashboard and sign-in examples with Web
ZIPs and complete Flutter source. Templates have no backend connections.

`npm run build:flutter` compiles the actual Flutter gallery locally, including
bundled open fonts and rendering resources. `npm run test:browser:all` checks the
three browser engines and writes local visual review pages. Run
`node tests/flutter-browser.mjs` after building the gallery.

New npm publication is blocked with `private: true`; Flutter remains
`publish_to: none`. No package versions or release tags are changed by this work.
