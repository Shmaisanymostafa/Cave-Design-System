# Local validation — 2026-10-19

Unreleased working tree. No publication, push, release tag or production deployment.

- Node/build/package tests: 20 passed.
- TypeScript consumer checks: passed.
- Flutter analyzer: no issues; 133 widget/controller/example tests passed.
- Chromium, Firefox and WebKit: documentation controls, shared URLs, RTL navigation,
  dialogs, template interactions, narrow layouts, reduced motion, 200% CSS zoom,
  automated axe WCAG checks and brand theme/PNG tools passed.
- Actual Flutter Web gallery: on-demand loading, Arabic/English controls, native
  actions and local-only rendering/font resources passed in all three engines.
- Six extracted Web template ZIPs: English/Arabic settings, dashboard and sign-in
  run under their own subpaths without missing assets or external requests.
- Local screenshot review: .artifacts/visual-{chromium,firefox,webkit}.html.
- Whitespace/diff checks: passed in both authorized checkouts.

Native Flutter examples compile as part of the gallery. Brand PNG export preserves
SVG aspect ratio; automated download checks verify PNG output width of 1600px.
Template sign-in validates locally and sends no credentials or requests.

Human VoiceOver/NVDA/TalkBack sessions remain a pre-publication review task. WebKit
engine checks do not imply certification on every Safari version. The declared
minimum Flutter SDK still needs a dedicated compatibility job; current checks use
Flutter 3.47.6.

Local review servers started on 127.0.0.1:4173 (design) and 127.0.0.1:4174 (brand).
If they have stopped, use npm run serve in design and python3 -m http.server 4174
--bind 127.0.0.1 in brand.
