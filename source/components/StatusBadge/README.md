A pill that states the status of a record in one or two words.

Provide the status word as the child, and a tone class: neutral (default), `brand`, `success`, `warning`, `error` or `info`. Map record states to tones once, in a shared function, so "Paid" is the same tone in every table.

- The word is the status; the dot and colour only support it. Success and error differ little in lightness, so never rely on colour alone and never ship a badge with no text.
- Text uses the `*-fg` token on the `*-bg` token with the `*-border` hairline: 4.5:1 or more in both themes.
- Pills are correct here (badges, chips, tags) and wrong for buttons.
- Sentence case, at most two words. Keep numbers in `cv-ltr` when the badge is in an Arabic table.
