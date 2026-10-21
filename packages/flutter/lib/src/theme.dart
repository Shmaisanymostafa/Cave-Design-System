import 'package:flutter/material.dart';
import 'colors.dart';
import 'dimensions.dart';

abstract final class CaveTheme {
  static ThemeData light({String? fontFamily, List<String>? fontFamilyFallback}) => fromColors(CaveColors.light, Brightness.light, fontFamily:fontFamily,fontFamilyFallback:fontFamilyFallback);
  static ThemeData dark({String? fontFamily, List<String>? fontFamilyFallback}) => fromColors(CaveColors.dark, Brightness.dark, fontFamily:fontFamily,fontFamilyFallback:fontFamilyFallback);
  static ThemeData black({String? fontFamily, List<String>? fontFamilyFallback}) => fromColors(CaveColors.black, Brightness.dark, fontFamily:fontFamily,fontFamilyFallback:fontFamilyFallback);
  static ThemeData fromColors(CaveColors colors, Brightness brightness, {String? fontFamily, List<String>? fontFamilyFallback, double controlRadius = CaveRadius.radiusControl, double spacingScale = 1}) {
    if(!controlRadius.isFinite || controlRadius < 0 || !spacingScale.isFinite || spacingScale <= 0) throw ArgumentError('Use a nonnegative radius and positive finite spacing scale.');
    final scheme = ColorScheme.fromSeed(seedColor:colors.accentStrong, brightness:brightness).copyWith(
      primary:colors.accentStrong, onPrimary:colors.onAccentStrong,
      primaryContainer:Color.alphaBlend(colors.accentSoft,colors.surface), onPrimaryContainer:colors.accentText,
      secondary:colors.accent, onSecondary:colors.onAccent,
      surface:colors.surface, onSurface:colors.ink, onSurfaceVariant:colors.inkMuted,
      surfaceContainer:Color.alphaBlend(colors.surfaceRaised,colors.surface),
      error:colors.danger, onError:colors.onDanger,
      outline:colors.borderStrong, outlineVariant:colors.border,
      scrim:colors.scrim,
    );
    final shape = RoundedRectangleBorder(borderRadius:BorderRadius.circular(controlRadius));
    return ThemeData(
      useMaterial3:true, brightness:brightness, colorScheme:scheme, fontFamily:fontFamily, fontFamilyFallback:fontFamilyFallback,
      scaffoldBackgroundColor:colors.surface, focusColor:colors.focusRing,
      disabledColor:colors.disabledFg, dividerColor:colors.border,
      extensions:[colors],
      filledButtonTheme:FilledButtonThemeData(style:FilledButton.styleFrom(
        shape:shape, minimumSize:const Size(48,48), backgroundColor:colors.accentStrong, foregroundColor:colors.onAccentStrong,
        disabledBackgroundColor:colors.disabledBg, disabledForegroundColor:colors.disabledFg,
        padding:EdgeInsetsDirectional.symmetric(horizontal:CaveSpacing.space4*spacingScale,vertical:CaveSpacing.space2*spacingScale))),
      outlinedButtonTheme:OutlinedButtonThemeData(style:OutlinedButton.styleFrom(shape:shape,minimumSize:const Size(48,48),padding:EdgeInsetsDirectional.symmetric(horizontal:CaveSpacing.space4*spacingScale,vertical:CaveSpacing.space2*spacingScale),foregroundColor:colors.ink,side:BorderSide(color:colors.borderStrong))),
      textButtonTheme:TextButtonThemeData(style:TextButton.styleFrom(shape:shape,minimumSize:const Size(48,48),padding:EdgeInsetsDirectional.symmetric(horizontal:CaveSpacing.space4*spacingScale,vertical:CaveSpacing.space2*spacingScale),foregroundColor:colors.accentText)),
      inputDecorationTheme:InputDecorationTheme(
        filled:true,fillColor:scheme.surfaceContainer,contentPadding:EdgeInsetsDirectional.all(CaveSpacing.space3*spacingScale),
        border:OutlineInputBorder(borderRadius:BorderRadius.circular(controlRadius)),
        enabledBorder:OutlineInputBorder(borderRadius:BorderRadius.circular(controlRadius),borderSide:BorderSide(color:colors.borderStrong)),
        focusedBorder:OutlineInputBorder(borderRadius:BorderRadius.circular(controlRadius),borderSide:BorderSide(color:colors.focusRing,width:2)),
        errorBorder:OutlineInputBorder(borderRadius:BorderRadius.circular(controlRadius),borderSide:BorderSide(color:colors.errorFg))),
      cardTheme:CardThemeData(elevation:0,margin:EdgeInsets.zero,color:scheme.surfaceContainer,
        shape:RoundedRectangleBorder(borderRadius:BorderRadius.circular(CaveRadius.radiusMd),side:BorderSide(color:colors.border))),
      dialogTheme:DialogThemeData(backgroundColor:colors.surface,shape:RoundedRectangleBorder(borderRadius:BorderRadius.circular(CaveRadius.radiusLg),side:BorderSide(color:colors.border))),
      navigationBarTheme:NavigationBarThemeData(backgroundColor:colors.surface,indicatorColor:colors.accentSoft),
      snackBarTheme:SnackBarThemeData(backgroundColor:colors.ink,contentTextStyle:TextStyle(color:colors.surface)),
    );
  }
}
