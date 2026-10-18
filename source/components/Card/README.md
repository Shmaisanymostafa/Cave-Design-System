A bordered container for one group of content, and the stat tile that sits inside it for a single number.

Provide a title (`cv-card__title`, `section-title`) and optional subtitle, then the content. A stat tile (`cv-stat`) is label, value, then a meta line with a badge or comparison.

- Cards are flat: `surface-raised`, a 1px `border` hairline and `radius-md` (14px). No shadow. Shadows are only for floating layers (menus, dialogs, toasts).
- Padding is `space-4` (24px); `space-3` (16px) on mobile. Gap between cards is `space-3` to `space-32`.
- Do not nest cards inside cards; use a divider or `surface-sunken` well instead. Do not add a coloured side stripe.
- Numbers use tabular figures and `cv-ltr`, with the currency symbol inside the same isolate.
- A clickable card is a real link or button with a visible focus ring, and the whole card is the target.
