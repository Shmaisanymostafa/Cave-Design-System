# cave_ui

Native Flutter UI with English/Arabic localization and Light, Dark, Black and
System themes. MIT licensed. Version 0.1.0-alpha.1. Requires Flutter 3.35+.

The alpha is distributed as a downloadable archive; it is not published on pub.dev.
Extract `cave_ui-0.1.0-alpha.1.tar.gz` into your project's `vendor/` directory:

```yaml
dependencies:
  cave_ui:
    path: vendor/cave_ui
```

```dart
import 'package:cave_ui/cave_ui.dart';
import 'package:flutter/material.dart';

final controller = CaveController(locale: const Locale('ar'));

void main() => runApp(CaveApp(
  controller: controller,
  home: Scaffold(body: Center(child: CaveButton(
    label: 'حفظ', onPressed: () {},
  ))),
));
```

`controller.setLocale(const Locale('en'))` updates locale and direction.
`controller.setTheme(CaveThemeMode.black)` updates appearance.
`setDirection(null)` restores locale-derived direction. Hosts own controller
lifecycle and persistence. Dispose it when its owner is removed.

Existing apps can use `CaveTheme.light()`, `.dark()`, `.black()` and the generated
`CaveColors` ThemeExtension without replacing their MaterialApp. Native Material
widgets inherit the theme. CaveButton, CaveTextField, CaveCheckbox, CaveRadioGroup,
CaveSwitch, CaveCard, CaveNavigation and showCaveDialog provide the initial wrappers.

Only Flutter and Flutter's localization SDK are direct runtime dependencies.
The SDK localization package has transitive dependencies, including intl; this
is not a claim of zero total dependencies. No third-party state management,
network font loading or icon packages are required. The host may bundle Poppins
and Almarai and pass `fontFamily` and `arabicFontFamily` to CaveApp.

All 15 documented component examples exist in English and Arabic under
`example/lib/`. From that folder run `flutter pub get`, then use a generated app
shell or your project's platform runner with the desired Dart entrypoint.
The source examples are also compiled and exercised by the package widget tests.

Docs: https://design.cave.technology/ar/platforms?platform=flutter

## Unreleased additions

`CaveNumberingSystem` controls digit preferences independently of locale.
`controller.number(value, fractionDigits: 2)` handles grouped finite decimal
values below 1e21 with 0–6 decimal places. It is not a currency conversion engine.
`controller.date(context, value)` uses Flutter SDK date labels and digit shaping.

`CaveButtonSize` and `CaveTheme.fromColors(controlRadius:, spacingScale:)` allow
customization. Templates live in example/lib; main.dart is the local docs gallery.
Publication remains disabled with `publish_to: none`.
