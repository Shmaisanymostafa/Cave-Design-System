A modal that interrupts the page for one decision or one short form.

Provide a title that names the action, one or two sentences of consequence, and the actions: cancel on the left, the committing action last (on the right; mirrored in RTL).

- The dialog is `surface` with a 1px `border`, `radius-lg` (18px), `shadow-overlay`, over a `scrim`. Maximum width 440px for confirmations, 560px for forms. On mobile use a bottom sheet with the same content and an 18px top radius.
- Name the action on the button ("Delete product"), not "OK". Destructive confirmations use `danger`; everything else `primary`.
- Move focus into the dialog, trap it, close on Escape and return focus to the trigger. Give it `role="dialog"`, `aria-modal` and `aria-labelledby`.
- Prefer undo through a toast for reversible actions; use a dialog only when the action cannot be undone.
