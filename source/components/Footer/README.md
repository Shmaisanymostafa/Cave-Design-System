The footer of a product's own page: the Cave POS website and the Cave pages of Cave Shops use it. It is the Cave POS website footer, which is the reference.

One centred stack, top to bottom: the product's logo (40px high, its own file), **Powered by Cave** (see PoweredByCave), the copyright line, and a row of links. A hairline `border` above, `surface-raised` ground, no shadow.

- The logo is the product's, not Cave's (Cave POS or Cave Shops); in Arabic use the Arabic product name in `alt`. Only the master mark inside Powered by Cave is Cave's.
- Copyright: "© {year} Cave. All rights reserved." / "© {year} كهف. جميع الحقوق محفوظة." in `body` and `ink-muted`. The year is the current year, set by the page.
- Links: at most five, `body-sm` at weight 500 in `ink-muted`, 24px apart, wrapping to a second centred line on a phone. Order: the sister product, Download, Support, Privacy, Terms. Hover turns the link `accent-text` and underlines it. Each link is at least 26px tall to tap (3px above and below the text).
- No tagline ("Building the future of e-commerce" and similar is retired), no social icons and no newsletter form here; the stationery footer is a different thing.
- The footer sits at the bottom of the window even when the page is short: make the page a column and let the content grow.
- Dark and Black use the same markup; the ground, the hairline and the text come from the theme's tokens. The product logo file has to read on all three grounds.
- Right-to-left: same markup with `dir="rtl"`; nothing is positioned left or right, so it mirrors.
