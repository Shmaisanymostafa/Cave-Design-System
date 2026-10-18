A short message that confirms the result of an action and goes away on its own.

Provide a sentence and, optionally, one action ("Undo", "Retry"). The icon carries the state with a shape (check, cross, info), not only a colour.

- Toasts float with `shadow-menu` at the bottom of the screen (bottom-end on desktop), above everything (`z-toast`), and stack at most three.
- Success and info dismiss after 4 seconds; errors stay until dismissed or until retry. Toasts with an action stay at least 8 seconds.
- Announce with `role="status"` (`role="alert"` for errors). Never put the only copy of important information in a toast.
- One shared helper per codebase (web, mobile, POS) should build these, so the 60–158 inline snackbars become one call with a tone and a message.
