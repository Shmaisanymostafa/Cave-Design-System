# @cave-ui/core

A dependency-free web UI foundation for Arabic and English. Version 0.1.0-alpha.1.
MIT licensed. No framework, state manager, icon library, bundled fonts or runtime
network requests. Registry publication is pending; download the alpha archive
from https://design.cave.technology/downloads and install it locally:

```sh
npm install ./cave-ui-core-0.1.0-alpha.1.tgz
```

```js
import '@cave-ui/core/tokens.css';
import '@cave-ui/core/styles.css';
import { createCave } from '@cave-ui/core';

const ui = createCave({ locale: 'ar-LB', theme: 'system' });
ui.setLocale('en');
ui.setTheme('black');
```

```html
<button class="cave-btn cave-btn--primary">Save changes</button>
```

`locale` updates `lang` and derives `dir`; `direction` can be `auto`, `ltr` or
`rtl`. Typography follows the language, not a forced direction. Add
`storageKey: 'my-app-appearance'` to opt into local persistence. Explicit options
override stored values. A missing or blocked store does not prevent switching.
System changes follow the device while an explicit choice remains stable.

For server rendering, emit matching `lang`, `dir` and `data-theme` attributes in
the initial HTML. Importing the JS is safe without a browser; call `createCave`
only in the browser. Apply a persisted preference before first paint when needed.

`ui.state` reports the preference and resolved theme/direction. The root emits
`cave:change` with that state. `ui.t('save')` reads built-in English/Arabic labels;
custom `messages: { en: {...}, ar: {...} }` can override them. It does not translate
application content automatically. `ui.number()` and `ui.date()` use native Intl.
Call `ui.destroy()` when removing its application root.

Use `openDialog(nativeDialog)` and `closeDialog(nativeDialog)` for native modal
behaviour. `mountTabs(tablist)` supplies RTL-aware arrows, Home/End, roving focus
and panel visibility; call its returned cleanup function when unmounting.
Native checkboxes, radios and switches retain browser form semantics.

Use CSS logical properties and semantic variables. Optional open fonts are
available separately with licence notices. Scope custom variables to your app
root. `legacy.css` offers the equivalent `cv-` selectors for incremental migration;
new code should use `cave-`. Load only the stylesheet your markup needs.

Examples and Arabic documentation: https://design.cave.technology

## Unreleased additions

`numberingSystem` and `setNumberingSystem()` accept `auto`, `latn`, `arab`. Auto
uses Arabic-Indic digits for Arabic and Latin digits for English. An explicit
choice survives locale changes. `number()` and `date()` accept Intl overrides.
The controller changes library messages and formatting; applications re-render
their own translated content on `cave:change`. See the settings template.

Publication is paused; this working copy has `private: true`.
