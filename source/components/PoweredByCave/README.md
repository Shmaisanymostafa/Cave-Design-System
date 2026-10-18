The line "Powered by [Cave mark] Cave" that every Cave product carries. It says the product comes from Cave and takes the person to www.cave.technology.

Provide nothing but the language. The caption is "Powered by" and the name is "Cave" in English; in Arabic they are "مدعوم من" and "كهف" (never "Cave" on an Arabic screen). The mark is the Cave master mark (the symbol, not the product logo), 16 by 16, with an empty `alt`, because the name beside it says the same thing. The mark and the name are one link, opening in a new tab; the caption is plain text.

- One design everywhere: web, mobile, Cave POS and the Cave POS website. `body-sm` size (12), `ink-muted` for the caption, the same colour at weight 600 for the name; 6px between the three parts. Underline on hover only. The mark is never recoloured or tinted, in any theme.
- Place it once per screen, small and quiet: in a page footer (see Footer), under the sign-in card, at the foot of a sidebar. Never in a header, never beside a shop's own page or receipt, and never larger than the product's own logo.
- It sits under the product logo with 10px between them; it is not a button and has no box, border or fill.
- Right-to-left: the same markup, and the row mirrors by itself (caption on the right, name on the left). In Flutter use `PoweredByCave` (`powered_by_cave.dart`; web `PoweredByCave.jsx`), which already mirrors.
