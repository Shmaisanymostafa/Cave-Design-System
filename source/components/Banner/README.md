A persistent notice at the top of a page or section about the state of the account or the connection.

Provide an icon, one or two sentences, and at most one action link. Tones: `info` (default), `success`, `warning`, `error`.

- Use for plan limits and renewals, admin impersonation, offline mode and sync problems. Use a toast for one-off results and a dialog for decisions.
- Text and icon use the tone's `*-fg` on its `*-bg` with a `*-border` hairline (4.5:1 or more in both themes). No side stripes, no gradients.
- It stays until the condition clears or the user dismisses it; dismissals persist per account.
- One banner at a time at the top of the page; stack them only in this order: error, warning, info.
