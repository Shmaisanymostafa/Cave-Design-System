export const customCss=`/* Load after Cave UI styles. Scope the theme to your application root. */
.product[data-theme="light"] {
  --accent-strong: #4338ca;
  --accent-strong-hover: #3730a3;
  --on-accent-strong: #ffffff;
  --accent-text: #4338ca;
  --accent-soft: #eef2ff;
  --focus-ring: #4338ca;
  --radius-control: 14px;
  --space-3: 20px;
  --font-sans: system-ui, sans-serif;
  --font-ar-text: system-ui, sans-serif;
}
/* Supply your own font-face declarations for bundled custom fonts. */`;
export const customDart=`final colors = CaveColors.light.copyWith(
  accentStrong: const Color(0xff4338ca),
  accentStrongHover: const Color(0xff3730a3),
  onAccentStrong: const Color(0xffffffff),
  accentText: const Color(0xff4338ca),
  accentSoft: const Color(0xffeef2ff),
  focusRing: const Color(0xff4338ca),
);
final theme = CaveTheme.fromColors(
  colors, Brightness.light,
  fontFamily: 'YourBundledFont',
  controlRadius: 14,
  spacingScale: 1.25,
);
// Use MaterialApp(theme: theme, ...) in your existing application.
// Configure a corresponding dark theme and test its contrast separately.`;
