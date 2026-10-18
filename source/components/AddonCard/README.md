One add-on a shop can buy on top of its plan: what it gives, what it costs for the chosen cycle, and either a way to add it or the reason it cannot be added.

Provide the add-on's name and a one-line description, a badge for its kind (`Feature` or `Extra room`), the list of what it gives, the price now with the unit and cycle, and an action row. A feature add-on has one button, "Add to order". An extra-room add-on has a quantity stepper (`cv-stepper`) within its minimum and maximum, then the button. Once in the order the card is `is-selected` and the button becomes "Remove". The order bar (`cv-orderbar`) sits at the foot of the page with the total and the one primary action, "Continue to payment".

- A card that cannot be bought shows a plain sentence instead of a button (`cv-addon__note`): "Already active", "Included in your plan", "You have the most of this add-on", "Needs <feature> on your plan", or "Not available for your plan". Never hide the card, and never disable a button without saying why.
- Prices are per unit and per cycle, in a `cv-ltr` isolate with the currency inside it. A regular price is struck through in `ink-muted` beside the price now, with one percent-off badge, and is shown only when it is above the price now. The yearly price is the add-on's own, or ten months of the monthly one. The total is always the one the server calculates; the page may show it before the order, never instead of it.
- The kind badge is `brand` for a feature and `info` for extra room. Status of a purchase (active, ends soon) uses the status badges with a word.
- Selected is the `accent-strong` border, not a fill, a shadow or a side stripe. Cards are flat like every card here.
- One primary action per view: "Continue to payment" in the order bar. Cards use `secondary` or `tertiary` buttons.
- Arabic: the name, description, unit and every sentence come from the add-on's Arabic fields. Never show an English name on an Arabic screen when an Arabic one exists.
