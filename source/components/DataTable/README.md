A table of records inside a card, with a pager.

Provide column headers, rows, and the pager state. Wrap `cv-table` in `cv-table-scroll` inside `cv-table-card` so wide tables scroll sideways inside the card, not the page.

- Headers use `table-head` in `ink-muted` on `surface-sunken`; cells use `body-sm`. Row hover is `surface-hover`.
- Numbers right-aligned (`cv-num`, which aligns to the end edge in RTL) with tabular figures; IDs, phones and money in `cv-ltr`.
- Status is a `StatusBadge`, never bare coloured text. Row actions are tertiary buttons or an icon-button menu in the last column.
- Loading shows `Skeleton` rows in place; empty shows `EmptyState` inside the card. Page size 10, 25 or 50, and show the range ("1–3 of 128").
- On mobile, turn rows into stacked cards (title row plus key facts) rather than scrolling a six-column table.
