The rectangular action control of every Cave product.

Provide a text label (and optionally one leading icon), and put `cv-btn` plus a variant on a real `<button>`. Use one `primary` per view; `secondary` for the other actions on the same level; `tertiary` for low-emphasis links and in-table actions; `danger` only for destructive confirmations, never for "Cancel".

- Corners are `radius-control` (10px). Buttons are never pills: pills mean badges, chips and tabs.
- Heights are 32 (`sm`, dense tables and toolbars), 40 (default) and 48 (`lg`, touch surfaces and full-width form actions). Touch targets are at least 44px, so use `lg` on mobile.
- `primary` is `accent-strong` with `on-accent-strong` text: white on `lagoon` in light (5.6:1), deep ink on pale aqua in dark (9.6:1). Brand `teal` is not a button fill.
- Loading: set `aria-busy="true"`, show `cv-spinner` before the label, and keep the label so the width does not jump. Disabled: the `disabled` attribute; explain why in nearby text.
- Focus is a solid 2px `focus-ring` outline with a 2px offset; do not remove it.
- Label with a verb ("Save changes", "Add product"), sentence case, no full stops. Capitals and tracking are for `label` text only.
- Icon-only buttons (`cv-icon-btn`) need an `aria-label` and a tooltip.
