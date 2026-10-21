import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'messages.dart';
import 'theme.dart';

enum CaveNumberingSystem { auto, latn, arab }

enum CaveThemeMode { system, light, dark, black }

/// App-owned, framework-native state. Persistence can be supplied by the host app.
class CaveController extends ChangeNotifier {
  CaveNumberingSystem _numberingSystem;
  Locale _locale;
  CaveThemeMode _themeMode;
  TextDirection? _direction;
  CaveController({CaveNumberingSystem numberingSystem = CaveNumberingSystem.auto, Locale locale = const Locale('en'), CaveThemeMode themeMode = CaveThemeMode.system, TextDirection? direction})
      : _numberingSystem = numberingSystem, _locale = locale, _themeMode = themeMode, _direction = direction { _checkLocale(locale); }
  static void _checkLocale(Locale locale) {
    if (!['en','ar'].contains(locale.languageCode)) throw ArgumentError.value(locale, 'locale', 'Supported languages: en, ar');
  }
  CaveNumberingSystem get numberingSystem => _numberingSystem;
  CaveNumberingSystem get resolvedNumberingSystem => _numberingSystem == CaveNumberingSystem.auto
      ? (_locale.languageCode == 'ar' ? CaveNumberingSystem.arab : CaveNumberingSystem.latn) : _numberingSystem;
  void setNumberingSystem(CaveNumberingSystem value) { if (_numberingSystem == value) return; _numberingSystem = value; notifyListeners(); }
  /// Shapes digits without changing identifiers such as phone numbers or emails.
  String digits(String value) {
    const arabic = '٠١٢٣٤٥٦٧٨٩';
    final latin = value.replaceAllMapped(RegExp('[٠-٩]'), (m) => arabic.indexOf(m[0]!).toString());
    return resolvedNumberingSystem == CaveNumberingSystem.latn ? latin
        : latin.replaceAllMapped(RegExp('[0-9]'), (m) => arabic[int.parse(m[0]!)]);
  }
  /// Decimal formatting for UI summaries. Currency conversion is application-owned.
  String number(num value, {int fractionDigits = 0}) {
    if (!value.isFinite || value.abs() >= 1e21) throw ArgumentError.value(value, 'value', 'Use finite decimal values below 1e21');
    if (fractionDigits < 0 || fractionDigits > 6) throw RangeError.range(fractionDigits, 0, 6);
    final parts = value.abs().toStringAsFixed(fractionDigits).split('.');
    final arabic = resolvedNumberingSystem == CaveNumberingSystem.arab;
    final grouped = parts[0].replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+$)'), (m) => '${m[1]}${arabic ? '٬' : ','}');
    return digits('${value < 0 ? '−' : ''}$grouped${parts.length > 1 ? '${arabic ? '٫' : '.'}${parts[1]}' : ''}');
  }
  /// Localized date labels come from Flutter's SDK localization delegates.
  String date(BuildContext context, DateTime value) => digits(MaterialLocalizations.of(context).formatMediumDate(value));
  Locale get locale => _locale;
  CaveThemeMode get themeMode => _themeMode;
  TextDirection get direction => _direction ?? (_locale.languageCode == 'ar' ? TextDirection.rtl : TextDirection.ltr);
  void setLocale(Locale value) { _checkLocale(value); if (_locale == value) return; _locale = value; notifyListeners(); }
  void setTheme(CaveThemeMode value) { if (_themeMode == value) return; _themeMode = value; notifyListeners(); }
  void setDirection(TextDirection? value) { if (_direction == value) return; _direction = value; notifyListeners(); }
  String text(String key) => caveMessages[_locale.languageCode]?[key] ?? (throw ArgumentError.value(key,'key','Unknown message'));
}

/// Optional application shell. Existing apps can use CaveTheme and CaveController directly.
class CaveApp extends StatelessWidget {
  final CaveController controller;
  final Widget home;
  final String title;
  final String? fontFamily;
  final String? arabicFontFamily;
  const CaveApp({super.key, required this.controller, required this.home, this.title = '', this.fontFamily, this.arabicFontFamily});
  @override
  Widget build(BuildContext context) => ListenableBuilder(
    listenable: controller,
    builder: (context, child) => MaterialApp(
      title: title, debugShowCheckedModeBanner: false,
      locale: controller.locale,
      supportedLocales: const [Locale('en'),Locale('ar')],
      localizationsDelegates: GlobalMaterialLocalizations.delegates,
      theme: CaveTheme.light(fontFamily: controller.locale.languageCode == 'ar' ? arabicFontFamily : fontFamily, fontFamilyFallback:[?fontFamily, ?arabicFontFamily]),
      darkTheme: controller.themeMode == CaveThemeMode.black
        ? CaveTheme.black(fontFamily: controller.locale.languageCode == 'ar' ? arabicFontFamily : fontFamily, fontFamilyFallback:[?fontFamily, ?arabicFontFamily])
        : CaveTheme.dark(fontFamily: controller.locale.languageCode == 'ar' ? arabicFontFamily : fontFamily, fontFamilyFallback:[?fontFamily, ?arabicFontFamily]),
      themeMode: switch(controller.themeMode) {
        CaveThemeMode.system => ThemeMode.system,
        CaveThemeMode.light => ThemeMode.light,
        _ => ThemeMode.dark,
      },
      builder: (context, child) => Directionality(textDirection:controller.direction, child:child!),
      home: home,
    ),
  );
}
