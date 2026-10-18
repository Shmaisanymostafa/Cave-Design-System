# Platform mapping

How the tokens become code in each product, so there is one source and three thin adapters. Names on the left are in `tokens.json`; the right columns are where each product sets the value. Change a value here first, then in the adapter.

## Colour

| Token | MUI (web) | Flutter (Shops mobile, POS) |
| --- | --- | --- |
| `accent-strong` | `palette.primary.main` | `ColorScheme.primary` |
| `on-accent-strong` | `palette.primary.contrastText` | `ColorScheme.onPrimary` |
| `accent-strong-hover` | `palette.primary.dark` | button `WidgetState.hovered` and `pressed` overlay |
| `accent-soft` | `palette.primary.light` (as a tint) | `ColorScheme.primaryContainer` |
| `accent-text` | `palette.primary.dark` for text and links | `ColorScheme.primary` on text styles, or an extension |
| `surface` | `palette.background.default` | `ColorScheme.surface` and `scaffoldBackgroundColor` |
| `surface-raised` | `palette.background.paper` | `CardTheme.color` |
| `surface-sunken` | `palette.action.hover` or table header override | `ThemeExtension<CaveColors>.sunken` |
| `ink` | `palette.text.primary` | `ColorScheme.onSurface` |
| `ink-muted` | `palette.text.secondary` | `ColorScheme.onSurfaceVariant` |
| `border` | `palette.divider` | `ColorScheme.outlineVariant` |
| `border-strong` | input `notchedOutline` | `ColorScheme.outline` |
| `danger`, `on-danger` | `palette.error.main`, `.contrastText` | `ColorScheme.error`, `onError` |
| `success-*`, `warning-*`, `error-*`, `info-*` | `tones` and `darkTones` in `tokens.js` | `CaveTone` (soft bg, text, border) and `CaveStatus` (icon and dot colours) in the theme file |
| `focus-ring` | `components.MuiButtonBase.focusVisible` outline | `ThemeData.focusColor` and `FocusTheme` |
| `scrim` | `MuiBackdrop` background | `DialogTheme.barrierColor` |

## Shape, space and type

| Token | MUI | Flutter |
| --- | --- | --- |
| `radius-control` (10) | `shape.borderRadius` = 10; buttons, inputs, list items | `RoundedRectangleBorder(BorderRadius.circular(10))` on buttons, inputs, tiles |
| `radius-md` (14) | `MuiCard` and `MuiPaper` override | `CardTheme.shape` |
| `radius-lg` (18) | `MuiDialog` paper | `DialogTheme.shape`, bottom sheet top corners |
| `radius-pill` | `MuiChip` | `ChipTheme.shape` = `StadiumBorder` |
| `space-*` | `theme.spacing(n)` = 4px steps | `AppSpacing` constants |
| `page-title`, `section-title`, `body`, `body-sm`, `table-head` | `typography.h1/h2/body1/body2/overline` | `TextTheme` (`headlineSmall`, `titleLarge`, `bodyLarge`, `bodyMedium`, `labelSmall`) |
| `--font-sans`, `--font-ar-text` | `typography.fontFamily`, switched with the language | `fontFamily` and `fontFamilyFallback`, bundled in `pubspec.yaml` |
| `--font-display`, `--font-ar-display` | `fonts.display` and `fonts.arabicDisplay`, landing hero only | not used in the apps yet |

## Themes

| Theme | MUI (web) | Flutter (mobile, POS) |
| --- | --- | --- |
| Light | `createAppTheme('light')`, `data-theme="light"` | `ThemeMode.light` |
| Dark | `createAppTheme('dark')`, `data-theme="dark"` | `ThemeMode.dark` with the navy scheme |
| Black | `createAppTheme('black')`; the MUI palette mode is `dark`. The page keeps `data-theme="dark"` (so existing dark CSS applies) and adds `data-variant="black"` for what differs | an explicit app choice (`ThemeChoice.black` in Shops mobile, `themeBlackProvider` in POS) that runs dark and supplies the black scheme as `darkTheme` |
| System | `auto`: Light on a light device, the platform default dark theme on a dark one | `ThemeMode.system`: Light on a light device, the platform default dark theme (via `darkIsBlack` in Shops mobile, `darkSlotIsBlackProvider` in POS) on a dark one |

## Platform default dark theme

One administrator setting, **Default dark theme** (Dark or Black), decides what System means on a dark device. It is the field `defaultDarkTheme` (`dark` or `black`) of the public Firestore document `appConfig/public`, next to the support contact; only super admins can write it (the existing rule), anyone can read it, and anything other than `black` means Dark.

| | Web | Mobile | POS |
| --- | --- | --- | --- |
| Edited in | Admin > Platform settings (`DefaultDarkThemeCard`) | Admin > Platform settings (`DefaultDarkThemeSection`) | not editable; read only |
| Read by | `fetchPlatformDefaultDarkTheme` | `PlatformConfigService` | `CloudSyncService.fetchPlatformDefaultDarkTheme` (public REST, no sign-in) |
| Cached as | `cave-default-dark-theme` | `platform_default_dark` | `platform_default_dark` |

Each app paints with the cached value first, then fetches and updates; offline it keeps the last known value. An explicit Light, Dark or Black choice ignores the setting.

In Black the surfaces are `charcoal` and `surface-raised` (white at 6%), and text on `teal` fills is `charcoal`. Adapters keep one palette per theme in a single token file; a widget asks the theme, not the mode name. The theme choice is stored per app: web `cave-shops-theme` (`light`, `dark`, `black`, `auto`), mobile `theme_mode` plus `theme_black`, POS `theme_mode` (`light`, `dark`, `black`, `system`).

## Rules for adapters

- Bundle the fonts from `fonts/` with each app; do not load them from a CDN at runtime (the POS works offline).
- Set `Directionality` or `dir` from the language, and use start/end (Flutter `EdgeInsetsDirectional`, CSS logical properties), never left/right.
- Do not add colours to an adapter that are not tokens. A new need goes in `tokens.json` first.
- Dark theme uses the `dark` values of the same tokens; do not derive it with lighten or darken.
- Each product keeps one shared widget per component here (button, field, badge, card, table, dialog, toast, banner, empty state), so a restyle is a one-file change.

## Where the shared components live

| Component | Web (MUI) | Flutter (mobile, POS) |
| --- | --- | --- |
| Toast | MUI `Snackbar` (2 uses) | `CaveToast.show(context, message, success:)` and `showOn(messenger, …)` in `cave_ui.dart` |
| StatusBadge | `StatusBadge` in `shared/ui/cave/index.jsx` | `CaveBadge(label, kind:)` |
| EmptyState | `EmptyState` in `shared/ui/cave/index.jsx` | `CaveEmptyState(icon:, title:)`; shrinks in small spaces |
| Card, stat tile | `SectionCard`, `StatCard` | `Card` (themed) and `CaveStatTile` |
| Dialog (confirm) | MUI `Dialog` | `showCaveConfirm(context, …)` |
| DataTable | `TableCard`, `TablePager`, `RowActions` | `DataTable` (themed) with `table_pager.dart` in POS |
| Plan artwork, "What's included" | `AddonImage` and `PlanAddonsList.jsx` (`features/plans/presentation/components`), used by `PricingSection`, `PlanCard` | `PlanArtwork` and `PlanAddonsList` in `plan_addons_list.dart` (Shops mobile); `_planTile` and `_includedAddons` in `subscription_page.dart` (POS) |
| AddonCard, order bar | `AddonCard.jsx` and the basket in `ShopAddonsPage.jsx` (`features/addons/presentation`) | `owner_addons_page.dart` and `addon_checkout_sheet.dart` in Shops mobile; `addons_section.dart` (`AddonsSection`, `AddonsDialog`) in POS |
| PoweredByCave | `PoweredByCave` in `shared/ui/PoweredByCave.jsx` (footer, landing hero) | `PoweredByCave` in `powered_by_cave.dart` (POS sidebar and sign-in; Shops mobile brand header) |
| Footer | `Footer` in `shared/ui/Footer.jsx` (Cave Shops pages) | not used in the apps; the Cave POS website has it in `website/assets/styles.css` (`.site-footer`, `.footer-stack`, `.powered-by`) |

`cave_ui.dart` is `lib/presentation/widgets/cave_ui.dart` in Shops mobile and `lib/features/shared/cave_ui.dart` in POS; the two files are kept identical apart from imports.

## Shop colours

One function per platform turns a shop colour into the roles in the README ("Shop colours"): fill, text on fill, colour as text, graphic, tint, outline. All three are the same algorithm and are checked against the same 80 test vectors, so a shop looks the same everywhere.

| | Function | File |
|---|---|---|
| Web | `deriveShopPalette(color, 'light' \| 'dark')` | `src/features/shops/domain/shopPalette.js` |
| Shops mobile | `ShopPalette.derive(color, dark:, grounds:)` | `lib/core/theme/shop_palette.dart` |
| POS | `ShopPalette.derive(color, dark:, grounds:)` | `lib/app/shop_palette.dart` |

- **Storefront (web).** `createShopTheme` (`shop-template1/shopTheme.js`) builds the page's theme from it. MUI `primary.main` is the text-safe colour; filled buttons, chips and badges use the fill and its label through component overrides; the roles are also exposed as `--shop-fill`, `--shop-on-fill`, `--shop-text`, `--shop-graphic`, `--shop-tint` and the ground variables for plain CSS (cart, product card, product page, QR poster). Nothing on those pages hardcodes a colour.
- **App accent (mobile, POS).** The shop's colour becomes `primary` (the fill), `onPrimary` (its label), `onPrimaryContainer` (the text-safe colour, used by text buttons, chips and the selected navigation item) and the graphic shade for progress, cursor and the focus line. Because the apps' surfaces are navy as well as charcoal, pass those surfaces as `grounds:` so the text and graphic shades read on them too. Cave's own colours already pass and are used as they are.
- **Tests.** A sweep over about 190 colours in Light, Dark and Black asserts 4.5:1 for button labels, coloured text and chip text on every surface of the theme, and 3:1 for graphics. Each repo carries the same vectors file in its tests.
- **Picker.** `BrandColorSection` (web) and `ShopColorPicker` (mobile) are the picker in the README. The web `StorefrontPreview` is the live preview frame.

## Add-ons

One model, three clients. The catalog is `addons/{id}`, purchases are `shopAddons/{paymentId_addonId}`, and the server writes `shopEntitlements/{shopId}`: the shop's plan with its add-ons applied. Every client reads that copy through one rule: use it only while it matches the subscription and the plan's revision and has not passed `validUntil`; otherwise the plain plan applies, so a stale copy can never grant more.

| | Web | Shops mobile | POS |
|---|---|---|---|
| Effective plan | `features/addons/domain/effectivePlan.js`, used by `EntitlementService` | `core/services/effective_plan.dart`, used by `EntitlementService` | `EntitlementsCopy.isCurrentFor` in `core/models/addon.dart`, used by `fetchShopSubscription` |
| Pricing, blockers, errors | `addonPricing.js`, `addonErrors.js` | `core/utils/addon_pricing.dart` | `core/models/addon.dart` |
| Buy | `createAddonOrder` (callable) | the same | the same, over the functions HTTP endpoint |
| Admin catalog | `AdminAddonsPage`, `AddonForm`; `PlanAddonsComposer` on the plan form lists the add-ons a plan is made of | `admin_addons_page.dart`, `admin_addon_editor_page.dart` | not editable |
