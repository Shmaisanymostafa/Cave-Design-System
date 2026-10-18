// Turns source/tokens.json into everything the site and the downloads need: CSS, Dart, resolved colours.
import { parseColor, over, contrast, toHex } from './color.mjs';

export const THEMES = ['light', 'dark', 'black'];

const REF = /^\{([a-z0-9-]+)\}$/;

export function isRaw(token) {
  return typeof token.value === 'string';
}

// Raw palette first (value is a string), then semantic tokens (value is per theme).
export function splitColours(tokens) {
  const raw = tokens.color.tokens.filter(isRaw);
  const semantic = tokens.color.tokens.filter((t) => !isRaw(t));
  return { raw, semantic };
}

function cssValue(v) {
  const m = REF.exec(v);
  return m ? `var(--${m[1]})` : v;
}

function declarations(list, valueOf) {
  return list.map((t) => `--${t.name}:${valueOf(t)};`).join('');
}

export function buildTokensCss(tokens) {
  const { raw, semantic } = splitColours(tokens);
  const fam = tokens.type.families;
  const fonts = Object.entries(fam).map(([k, v]) => `--font-${k}:${v};`).join('');
  const scalar = (group) => group.tokens.map((t) => `--${t.name}:${t.value};`).join('');

  const out = [];
  out.push('/* Cave design tokens. Generated from tokens.json. Do not edit by hand. */');
  out.push(`:root{${declarations(raw, (t) => t.value)}${fonts}${scalar(tokens.spacing)}${scalar(tokens.radius)}${scalar(tokens.duration)}${scalar(tokens.easing)}${scalar(tokens.zIndex)}}`);
  for (const theme of THEMES) {
    const sel = theme === 'light' ? ':root,[data-theme="light"]' : `[data-theme="${theme}"]`;
    const colours = declarations(semantic, (t) => cssValue(t.value[theme]));
    const shadows = tokens.shadow.tokens.map((t) => `--${t.name}:${t.value[theme]};`).join('');
    out.push(`${sel}{color-scheme:${theme === 'light' ? 'light' : 'dark'};${colours}${shadows}}`);
  }
  return out.join('\n') + '\n';
}

export function buildFontsCss(tokens, base = '/assets/fonts/') {
  return tokens.type.fonts
    .map((f) => {
      const file = f.file.replace(/^fonts\//, '');
      const fmt = file.endsWith('.otf') ? 'opentype' : 'truetype';
      return `@font-face{font-family:"${f.family}";src:url("${base}${file}") format("${fmt}");font-weight:${f.weight};font-style:${f.style || 'normal'};font-display:swap}`;
    })
    .join('\n') + '\n';
}

// The theme's colour as an opaque { r, g, b } and as hex, for tables. Translucent colours are laid over `ground`.
export function makeResolver(tokens) {
  const { raw, semantic } = splitColours(tokens);
  const rawMap = new Map(raw.map((t) => [t.name, parseColor(t.value)]));
  const semMap = new Map(semantic.map((t) => [t.name, t]));

  function parse(theme, value) {
    const m = REF.exec(value);
    if (m) {
      const name = m[1];
      if (rawMap.has(name)) return rawMap.get(name);
      if (semMap.has(name)) return parse(theme, semMap.get(name).value[theme]);
      throw new Error(`Unknown token reference ${value}`);
    }
    return parseColor(value);
  }

  function colour(theme, name) {
    if (rawMap.has(name)) return rawMap.get(name);
    const t = semMap.get(name);
    if (!t) throw new Error(`Unknown colour token ${name}`);
    return parse(theme, t.value[theme]);
  }

  function opaque(theme, name, groundName = 'surface') {
    const ground = over(colour(theme, groundName), { r: 255, g: 255, b: 255, a: 1 });
    return over(colour(theme, name), ground);
  }

  function ratio(theme, fgName, bgName) {
    const surface = over(colour(theme, 'surface'), { r: 255, g: 255, b: 255, a: 1 });
    const bg = over(colour(theme, bgName), surface);
    return contrast(colour(theme, fgName), bg);
  }

  return { colour, opaque, ratio, hex: (theme, name) => toHex(opaque(theme, name)) };
}

// Pairs the README promises. `min` is the WCAG threshold: 4.5 text, 3 graphics.
export const CONTRAST_PAIRS = [
  { fg: 'ink', bg: 'surface', min: 4.5 },
  { fg: 'ink-muted', bg: 'surface', min: 4.5 },
  { fg: 'ink-muted', bg: 'surface-raised', min: 4.5 },
  { fg: 'accent-text', bg: 'surface', min: 4.5 },
  { fg: 'on-accent-strong', bg: 'accent-strong', min: 4.5 },
  { fg: 'on-accent', bg: 'accent', min: 4.5 },
  { fg: 'on-danger', bg: 'danger', min: 4.5 },
  { fg: 'success-fg', bg: 'success-bg', min: 4.5 },
  { fg: 'warning-fg', bg: 'warning-bg', min: 4.5 },
  { fg: 'error-fg', bg: 'error-bg', min: 4.5 },
  { fg: 'info-fg', bg: 'info-bg', min: 4.5 },
  { fg: 'focus-ring', bg: 'surface', min: 3 },
];

// Dart: one class per theme with every semantic colour, one for the palette.
export function buildDart(tokens) {
  const { raw, semantic } = splitColours(tokens);
  const r = makeResolver(tokens);
  const camel = (n) => n.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
  const argb = (c, alpha) => {
    const a = Math.round((alpha ?? 1) * 255);
    const h = (v) => Math.round(v).toString(16).padStart(2, '0');
    return `0x${h(a)}${h(c.r)}${h(c.g)}${h(c.b)}`.toUpperCase().replace('0X', '0x');
  };
  const lines = [];
  lines.push('// Cave design tokens. Generated from tokens.json by design.cave.technology. Do not edit by hand.');
  lines.push("import 'dart:ui' show Color;");
  lines.push('');
  lines.push('abstract final class CavePalette {');
  for (const t of raw) {
    const c = parseColor(t.value);
    lines.push(`  static const Color ${camel(t.name)} = Color(${argb(c)});`);
  }
  lines.push('}');
  for (const theme of ['light', 'dark', 'black']) {
    const cls = `Cave${theme[0].toUpperCase()}${theme.slice(1)}Colors`;
    lines.push('');
    lines.push(`abstract final class ${cls} {`);
    for (const t of semantic) {
      const c = r.colour(theme, t.name);
      lines.push(`  static const Color ${camel(t.name)} = Color(${argb(c, c.a)});`);
    }
    lines.push('}');
  }
  lines.push('');
  return lines.join('\n');
}
