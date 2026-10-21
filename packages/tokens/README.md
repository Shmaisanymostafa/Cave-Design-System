# @cave-ui/tokens

Shared Light, Dark and Black design tokens for Arabic and English interfaces.
No dependencies. MIT licensed. Version 0.1.0-alpha.1; registry publication pending.

Download the archive from https://design.cave.technology/downloads:

```sh
npm install ./cave-ui-tokens-0.1.0-alpha.1.tgz
```

```js
import '@cave-ui/tokens/styles.css';
import { themes, foundations } from '@cave-ui/tokens';
console.log(themes.dark['accent-strong']);
```

`tokens.json` contains resolved theme values and scalar foundations. `dtcg/light.json`,
`dtcg/dark.json` and `dtcg/black.json` export colours, spacing, radii and durations
using the DTCG 2025.10 value formats. They are a subset export, not a general token
resolver. The source of truth is `source/tokens.json` in the design repository.
Fonts are family stacks only; no font binaries or brand assets are included.
