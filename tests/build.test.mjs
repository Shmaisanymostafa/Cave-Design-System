import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {catalog} from '../source/catalog.mjs';
import { build } from '../build.mjs';
import { makeResolver, buildTokensCss, CONTRAST_PAIRS, THEMES } from '../src/tokens.mjs';
import { parseColor, contrast } from '../src/color.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const tokens = JSON.parse(await readFile(path.join(ROOT, 'source', 'tokens.json'), 'utf8'));

before(async () => { await build(); });

const walk = async (dir) => {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
};

test('contrast maths matches the figures the README states', () => {
  const r = makeResolver(tokens);
  assert.equal(r.ratio('light', 'on-accent-strong', 'accent-strong').toFixed(1), '5.6'); // white on lagoon
  assert.equal(r.ratio('dark', 'on-accent-strong', 'accent-strong').toFixed(2), '4.55'); // navy on teal
  assert.equal(r.ratio('black', 'on-accent-strong', 'accent-strong').toFixed(1), '5.1'); // charcoal on teal
  assert.equal(contrast(parseColor('#000'), parseColor('#fff')).toFixed(1), '21.0');
});

test('every text pair in every theme passes its threshold', () => {
  const r = makeResolver(tokens);
  for (const theme of THEMES) {
    for (const p of CONTRAST_PAIRS) {
      assert.ok(r.ratio(theme, p.fg, p.bg) >= p.min, `${theme}: ${p.fg} on ${p.bg}`);
    }
  }
});

test('palette guidance figures are true: raw teal is not text, input borders pass 3:1', () => {
  const r = makeResolver(tokens);
  const white = r.colour('light', 'white'), paper = r.colour('light', 'paper');
  const teal = r.colour('light', 'teal');
  assert.equal(contrast(teal, paper).toFixed(1), '3.1');
  assert.equal(contrast(teal, white).toFixed(1), '3.3');
  assert.ok(contrast(r.colour('light', 'slate'), paper) < 3, 'slate on paper is decorative only');
  assert.ok(contrast(r.colour('light', 'mint'), white) < 3, 'mint on white is decorative only');
  for (const theme of THEMES) {
    assert.ok(contrast(r.opaque(theme, 'border-strong'), r.opaque(theme, 'surface')) >= 3, `${theme}: border-strong on surface`);
  }
});

test('tokens.css defines every semantic token for all three themes and leaves no unresolved reference', () => {
  const css = buildTokensCss(tokens);
  assert.ok(!css.includes('{') || !/var\(--[^)]*\{/.test(css));
  assert.ok(!/\{[a-z-]+\}[;,]/.test(css), 'unresolved {token} reference');
  for (const theme of THEMES) {
    const sel = theme === 'light' ? ':root,[data-theme="light"]' : `[data-theme="${theme}"]`;
    assert.ok(css.includes(sel), `missing ${theme} block`);
  }
  const semantic = tokens.color.tokens.filter((t) => typeof t.value !== 'string');
  for (const t of semantic) assert.ok(css.includes(`--${t.name}:`), `missing --${t.name}`);
});

test('every page exists in English and Arabic, with the right direction', async () => {
  const files = (await walk(DIST)).map((f) => path.relative(DIST, f));
  const en = files.filter((f) => f.endsWith('index.html') && !f.startsWith('ar/') && !f.startsWith('previews/') && !f.startsWith('flutter-preview/'));
  const ar = files.filter((f) => f.startsWith('ar/') && f.endsWith('index.html'));
  assert.equal(en.length, ar.length);
  assert.ok(en.length >= 20);
  for (const f of ar) assert.match(await readFile(path.join(DIST, f), 'utf8'), /<html lang="ar" dir="rtl"/);
  for (const f of en) assert.match(await readFile(path.join(DIST, f), 'utf8'), /<html lang="en" dir="ltr"/);
});

test('every internal link and asset resolves to a built file', async () => {
  const files = new Set((await walk(DIST)).map((f) => '/' + path.relative(DIST, f)));
  const exists = (u) => {
    const clean = u.split('#')[0].split('?')[0];
    if (clean === '' || clean === '/') return true;
    return files.has(clean) || files.has(clean + '.html') || files.has(path.posix.join(clean, 'index.html'));
  };
  const broken = [];
  for (const f of [...files].filter((x) => x.endsWith('.html'))) {
    const html = await readFile(path.join(DIST, f), 'utf8');
    for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) if (!exists(m[1])) broken.push(`${f} -> ${m[1]}`);
  }
  assert.deepEqual(broken, []);
});

test('raw HTML in markdown is shown as text, not run', async () => {
  const { md } = await import('../src/markdown.mjs');
  const html = md('hello <script>alert(1)</script>');
  assert.ok(!html.includes('<script>'));
});

test('the canonical catalog has complete bilingual previews, code and guidance', async () => {
  assert.equal(catalog.length,15);
  for (const c of catalog) for (const lang of ['en','ar']) {
    await stat(path.join(DIST,'previews',lang,`${c.name}.html`));
    await stat(path.join(DIST,'examples/flutter',`${c.slug}_${lang}.dart`));
    const page=await readFile(path.join(DIST,lang==='ar'?'ar':'','components',c.slug,'index.html'),'utf8');
    assert.ok(page.includes(c.title[lang]));assert.ok(page.includes('data-platform="flutter"'));assert.ok(page.includes('data-platform="web"'));
    assert.ok(!page.includes('doc--en'));
  }
});

test('the public integration page is indexable and package downloads exist', async () => {
  const html=await readFile(path.join(DIST,'platforms/index.html'),'utf8');assert.ok(!html.includes('noindex'));
  for (const name of ['cave-ui-core-0.1.0-alpha.1.tgz','cave-ui-tokens-0.1.0-alpha.1.tgz','cave_ui-0.1.0-alpha.1.tar.gz']) await stat(path.join(DIST,'downloads',name));
});

test('brand-licensed assets are not published: no logos, icons, patterns or non-open fonts offered', async () => {
  const files = (await walk(DIST)).map((f) => path.relative(DIST, f));
  assert.ok(!files.some((f) => /cave-logo|cave-icon|cave-pattern/.test(f)), 'logo, icon or pattern file in dist');
  assert.ok(!files.some((f) => /BlueOcean/i.test(f)), 'Blue Ocean in dist');
  const fontsCss = await readFile(path.join(DIST, 'assets', 'fonts.css'), 'utf8');
  assert.ok(!/Hero|Blue Ocean/.test(fontsCss), 'downloadable fonts.css must list only open fonts');
  const downloads = await readFile(path.join(DIST, 'downloads', 'index.html'), 'utf8');
  assert.ok(!/Hero\.otf|BlueOcean/.test(downloads), 'downloads page must not offer Hero or Blue Ocean');
  assert.ok(!files.some((f) => f === 'brand/index.html'), 'the brand page lives on the brand site now');
});

test('every font file a stylesheet points at was written to dist', async () => {
  for (const css of ['fonts.css', 'fonts-cave.css']) {
    const text = await readFile(path.join(DIST, 'assets', css), 'utf8');
    for (const m of text.matchAll(/url\("([^"]+)"\)/g)) await stat(path.join(DIST, m[1]));
  }
});
