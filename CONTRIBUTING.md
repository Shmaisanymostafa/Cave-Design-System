# Contributing

Edit canonical files in `source/` and package implementations in `packages/`.
Do not sync over this repository from an AI artifact or edit generated outputs.

1. Update both English and Arabic guidance and examples in `source/catalog.mjs`.
2. Change shared design values in `source/tokens.json`.
3. Run `npm ci`, `npm test`, and `npm run build`.
4. In `packages/flutter`, run `flutter pub get`, `flutter analyze`, and `flutter test`.
5. Check browser interactions in both languages, at narrow widths, across themes,
   and using keyboard, pointer and full-label clicks.
6. Describe behavioural changes and compatibility implications in the changelog.

Keep package runtime dependencies minimal. Core web must remain dependency-free.
Do not include Cave logos, proprietary fonts or product-specific rules in packages.
Code contributions are under the package MIT licence. Font files retain their own
licences. Brand assets are not covered by the code licence.

During alpha, pin exact versions. Document breaking changes even before 1.0.
Registry publishing requires verified namespace ownership, reviewing archive
contents, and an explicit release step. CI builds and tests; it does not publish.
