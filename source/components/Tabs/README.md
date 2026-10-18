Switches between views of the same data on one page.

Provide 2 to 6 labels in `role="tablist"`; mark the current one with `aria-selected="true"`.

- The selected tab has a 2px `accent-strong` underline and `ink` text; others are `ink-muted`.
- Tabs filter or change the view; they never navigate to a different page (use the sidebar) and are not the brand's `SectionTag`, which is a layout furniture piece, not a control.
- Labels are one or two words, sentence case. Show counts as a trailing number only when they help.
- Arrow keys move between tabs; the list scrolls sideways on narrow screens.
