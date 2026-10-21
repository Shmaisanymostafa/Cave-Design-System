# Compatibility — unreleased working tree

| Area | Contract |
| --- | --- |
| Web package runtime | Browser-native ES modules, Intl.Locale, CSS logical properties, native dialog, inert and ResizeObserver. No runtime package dependencies. |
| JavaScript package tooling | Node 20+; CI uses Node 22. SSR-safe imports; create controllers only after a DOM root exists. |
| Flutter package | Declares Flutter >=3.35 and Dart >=3.9. Current validation uses Flutter 3.47.6; the minimum SDK is not yet certified by a separate CI job. |
| Browsers | Local Playwright Chromium, Firefox and WebKit checks. WebKit is a useful engine check, not certification of every shipping Safari version. |
| Locale | English/Arabic, regional locale tags on Web, native Flutter Locale. Explicit direction override independent of language. |
| Digits | auto defaults to Latin for English and Arabic-Indic for Arabic. latn/arab override survives locale changes. IDs, phone numbers and emails retain their own direction. |
| Number formatting | Web delegates to Intl, including currency/calendar options. Flutter's dependency-free decimal formatter handles finite values below 1e21 and 0–6 fixed decimal places. It does not implement arbitrary international currency rules. |
| Date formatting | Web Intl; Flutter SDK MaterialLocalizations plus digit shaping. Calendar conversion is application-owned. |
| Fonts | Optional local Poppins/Almarai with OFL notices. No mandatory font download by package code. |
| Accessibility | Automated semantics/contrast/interaction tests plus Flutter text-scaling tests. Human assistive-technology review remains separate. |

Documentation currently describes the working tree; it is not a versioned stable
API promise. When publication is authorized, snapshot docs by package version and
retain this table and migration notes for each supported version. No version or
release tag was created for this work.
