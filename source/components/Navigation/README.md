The main navigation: a sidebar on desktop and web, a bottom bar on mobile.

Provide up to 7 destinations, each with a line icon and a label, and mark the current one with `aria-current="page"`. Group secondary items under a `cv-nav-section` label.

- Sidebar: 256px wide (76px collapsed, icon only with tooltips), on `surface-raised` with an end-edge hairline. Active item is `accent-soft` with `accent-text` and SemiBold; hover is `surface-hover`.
- Bottom bar: 4 to 5 destinations, 56px tall, icon over a 12px label. Active item uses `accent-text`.
- Item height 40px (touch 48px), `radius-control`. The sidebar mirrors to the right in RTL.
- Icons are one rounded line set at 1.75px stroke, 20px. The Material icons the apps use today are fine until a Cave set is drawn; keep size and stroke consistent.
- The logo sits at the top of the sidebar: the colour lockup on light, the white one on dark.
