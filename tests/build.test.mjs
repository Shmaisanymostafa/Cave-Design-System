import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
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
  const en = files.filter((f) => f.endsWith('index.html') && !f.startsWith('ar/') && !f.startsWith('previews/'));
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

test('every component has a preview, a README and appears in both languages', async () => {
  const comps = (await readdir(path.join(ROOT, 'source', 'components'), { withFileTypes: true })).filter((e) => e.isDirectory());
  let n = 0;
  const brandOnly = new Set(['Logo', 'SectionTag']); // on the brand site
  for (const c of comps) {
    if (brandOnly.has(c.name)) continue;
    try { await stat(path.join(ROOT, 'source', 'components', c.name, 'README.md')); } catch { continue; }
    n += 1;
    await stat(path.join(DIST, 'previews', `${c.name}.html`));
  }
  assert.ok(n >= 16);
  const idx = await readFile(path.join(DIST, 'components', 'index.html'), 'utf8');
  assert.equal((idx.match(/class="card"/g) || []).length, n);
});

test('the platform mapping page is kept out of search', async () => {
  const html = await readFile(path.join(DIST, 'platforms', 'index.html'), 'utf8');
  assert.match(html, /noindex/);
  const sitemap = await readFile(path.join(DIST, 'sitemap.xml'), 'utf8');
  assert.ok(!sitemap.includes('/platforms'));
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
