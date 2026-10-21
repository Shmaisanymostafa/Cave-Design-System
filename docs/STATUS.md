# Unreleased local work

The owner has requested no releases. Do not publish packages, create release tags,
push source, upload release artifacts or deploy either site as part of this work.
The existing production sites are unchanged. Local build outputs and template ZIPs
are review artifacts, not new releases. Package versions remain unchanged.

The npm packages are marked private; Flutter uses `publish_to: none`. CI validates
source without publication or deployment. Publishing configuration and verified
publisher/account setup are deliberately deferred until explicitly authorized.

## Implementation scope

Only design.cave.technology and brand.cave.technology are modified. The Flutter
gallery is part of the existing design package's example directory. Templates
contain sample records and local interactions; no authentication or API service is
connected. Cave Shops, POS, the company website and other applications are untouched.

## Local review

1. `npm ci`
2. `npm run build`
3. `npm run build:flutter` (local compilation; does not publish)
4. `npm run serve`

The Flutter preview loads only after clicking its load button. A normal site build
includes the last local `.artifacts/flutter-preview` if present. Rebuild Flutter
after changing Dart examples. The CI order builds Flutter after the site to avoid
stale gallery output.

Documentation: `/templates`, `/customization`, `/components/button` in English;
add `/ar` for Arabic. Visual review pages are generated in `.artifacts/` by browser
checks. Serve the brand checkout separately to inspect its tools.
