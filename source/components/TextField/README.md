Single-line and multi-line text entry with a label, helper text and an error line.

Provide a visible `<label>` (never placeholder-only), the control with class `cv-input`, and optionally `cv-help` text or a `cv-error` line. Group them in `cv-field`.

- Border is `border-strong` (4.1:1 or more); focus swaps it for a solid `focus-ring` outline. Invalid sets `aria-invalid="true"` and a border in `error-fg`, and the message always carries an icon and words, never colour alone.
- Height 40 (48 on touch). Radius `radius-control`.
- Phone numbers, emails, codes, barcodes, prices and URLs get `cv-ltr` so they stay left-to-right inside Arabic forms; the text still aligns to the start edge.
- Validate on blur or submit, not on every keystroke. Say how to fix it ("Enter a valid phone number"), not just what failed.
- Selects, date and search fields reuse the same `cv-input` box; a search field adds a leading `search` icon.
