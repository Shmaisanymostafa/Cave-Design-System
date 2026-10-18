// Builds dist/ from source/ (a snapshot of the Cave design system files). No network, no framework.
import { readFile, writeFile, mkdir, rm, cp, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sections, leadAndRest } from './src/markdown.mjs';
import { buildTokensCss, buildFontsCss, buildDart, makeResolver } from './src/tokens.mjs';
import { renderPage, href, ORIGIN } from './src/shell.mjs';
import { LANGS, STR } from './src/i18n.mjs';
import * as pages from './src/pages.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'source');
const OUT = path.join(ROOT, 'dist');

const TITLES = {
  AddonCard: 'Add-on card', AuthCard: 'Auth card', DataTable: 'Data table', EmptyState: 'Empty state', PageHeader: 'Page header',
  PoweredByCave: 'Powered by Cave', SectionTag: 'Section tag', StatusBadge: 'Status badge', TextField: 'Text field',
};
// Brand components live on the brand site; the Cover is a slide, not a component.
const BRAND_ONLY = new Set(['Logo', 'SectionTag']);
const OPEN_FONT_FAMILIES = ['Poppins', 'Almarai']; // SIL OFL, safe to offer
// Hero is not in this repository (its licence is not open: all rights reserved). If source/fonts/Hero*.otf is present locally
// it is served so this site can set its own headings; if not, the headings fall back to Poppins.
const OPTIONAL_FONT_FAMILIES = ['Hero'];
const GROUP_ORDER = ['Actions', 'Forms', 'Data', 'Feedback', 'Overlays', 'Navigation', 'Brand'];

const read = (...p) => readFile(path.join(SRC, ...p), 'utf8');
const exists = async (p) => stat(p).then(() => true, () => false);

function titleOf(name) {
  return TITLES[name] || name.replace(/([a-z])([A-Z])/g, '$1 $2');
}

// "<!-- @dsCard group="Data" height=1180 subtitle="..." -->" on the first line of each preview.
function cardInfo(html) {
  const m = /<!--\s*@dsCard([^>]*?)-->/.exec(html.split('\n', 1)[0]);
  const attrs = m ? m[1] : '';
  const group = /group="([^"]+)"/.exec(attrs)?.[1] || 'Brand';
  const height = Number(/height=(\d+)/.exec(attrs)?.[1] || 400);
  return { group, height };
}

async function loadComponents() {
  const dirs = (await readdir(path.join(SRC, 'components'), { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => e.name);
  const list = [];
  for (const name of dirs) {
    const readmePath = path.join(SRC, 'components', name, 'README.md');
    if (BRAND_ONLY.has(name) || !(await exists(readmePath))) continue; // not a product component (the Cover has no README)
    const previewHtml = await read('components', name, 'preview.html');
    const { lead, rest } = leadAndRest(await read('components', name, 'README.md'));
    const slugName = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    list.push({ name, slug: slugName, title: titleOf(name), lead, rest, previewHtml, ...cardInfo(previewHtml) });
  }
  const rank = (g) => (GROUP_ORDER.includes(g) ? GROUP_ORDER.indexOf(g) : GROUP_ORDER.length);
  list.sort((a, b) => rank(a.group) - rank(b.group) || a.title.localeCompare(b.title));
  return list;
}

async function writeOut(rel, data) {
  const file = path.join(OUT, rel);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, data);
}

function routeFile(lang, route) {
  const base = lang === 'ar' ? 'ar' : '';
  if (route === '/') return path.join(base, 'index.html');
  return path.join(base, route.slice(1), 'index.html');
}

export async function build() {
  await rm(OUT, { recursive: true, force: true });
  const tokens = JSON.parse(await read('tokens.json'));
  const readmeText = await read('README.md');
  const readme = sections(readmeText);
  const platformMapping = await read('Platform-mapping.md');
  const metaRaw = JSON.parse(await read('meta.json'));
  const components = await loadComponents();
  const resolver = makeResolver(tokens);

  const meta = {
    version: /v(\d+)/i.exec(metaRaw.lastChange?.note || '')?.[0]?.toLowerCase() || 'v1',
    date: (metaRaw.lastChange?.at || '').slice(0, 10),
  };

  // Generated assets
  const tokensCss = buildTokensCss(tokens);
  const present = [];
  for (const f of tokens.type.fonts) if (await exists(path.join(SRC, f.file))) present.push(f);
  const presentTokens = { ...tokens, type: { ...tokens.type, fonts: present } };
  const fontsCss = buildFontsCss(presentTokens, { families: OPEN_FONT_FAMILIES });
  const fontsCave = buildFontsCss(presentTokens, { families: [...OPEN_FONT_FAMILIES, ...OPTIONAL_FONT_FAMILIES] });
  const dart = buildDart(tokens);
  const componentsCss = await read('components', 'bundle.css');
  await writeOut('assets/tokens.css', tokensCss);
  await writeOut('assets/fonts.css', fontsCss);
  await writeOut('assets/fonts-cave.css', fontsCave);
  await writeOut('assets/components.css', componentsCss);
  await writeOut('assets/cave_tokens.dart', dart);
  await writeOut('assets/tokens.json', JSON.stringify(tokens, null, 1));
  await cp(path.join(ROOT, 'site', 'site.css'), path.join(OUT, 'assets', 'site.css'));
  await cp(path.join(ROOT, 'site', 'site.js'), path.join(OUT, 'assets', 'site.js'));
  // Fonts: the open ones are offered for download; Hero is served only so this site can set its own headings.
  const servedFonts = present.filter((f) => [...OPEN_FONT_FAMILIES, ...OPTIONAL_FONT_FAMILIES].includes(f.family));
  for (const f of servedFonts) await cp(path.join(SRC, f.file), path.join(OUT, 'assets', f.file));
  for (const f of ['cave-symbol-color.svg', 'cave-symbol-white.svg']) await cp(path.join(SRC, 'logos', f), path.join(OUT, 'assets', 'logos', f));

  // Component previews: the preview files as they are, with the tokens, fonts and components linked in.
  const links = '<link rel="stylesheet" href="/assets/fonts-cave.css"><link rel="stylesheet" href="/assets/tokens.css"><link rel="stylesheet" href="/assets/components.css">';
  for (const c of components) {
    const html = c.previewHtml.replace(/<head>/i, `<head>${links}`);
    await writeOut(`previews/${c.name}.html`, html);
  }

  const sizeOf = async (rel) => (await stat(path.join(OUT, rel))).size;
  const fontFiles = [];
  for (const f of present.filter((x) => OPEN_FONT_FAMILIES.includes(x.family))) {
    const file = f.file.replace(/^fonts\//, '');
    fontFiles.push({ ...f, file, size: await sizeOf(`assets/fonts/${file}`) });
  }

  const data = {
    tokens,
    readme,
    platformMapping,
    components,
    resolver,
    fonts: fontFiles,
    counts: {
      colours: tokens.color.tokens.length,
      styles: tokens.type.groups.reduce((n, g) => n + g.styles.length, 0),
      components: components.length,
    },
    downloadSizes: {
      tokensJson: await sizeOf('assets/tokens.json'),
      tokensCss: await sizeOf('assets/tokens.css'),
      componentsCss: await sizeOf('assets/components.css'),
      fontsCss: await sizeOf('assets/fonts.css'),
      tokensDart: await sizeOf('assets/cave_tokens.dart'),
    },
  };

  const ctx = { components, meta, withRoute(route) { return { ...this, route }; } };

  const routes = [
    { route: '/', title: (l) => STR[l].siteName, body: pages.homePage, desc: (l) => STR[l].home.lead },
    { route: '/foundations/colour', title: (l) => STR[l].colour.title, body: pages.colourPage, desc: (l) => STR[l].colour.lead },
    { route: '/foundations/typography', title: (l) => STR[l].type.title, body: pages.typographyPage, desc: (l) => STR[l].type.lead },
    { route: '/foundations/layout', title: (l) => STR[l].layout.title, body: pages.layoutPage, desc: (l) => STR[l].layout.lead },
    { route: '/components', title: (l) => STR[l].components.title, body: pages.componentsIndexPage, desc: (l) => STR[l].components.lead },
    { route: '/guidelines', title: (l) => STR[l].guidelines.title, body: pages.guidelinesPage, desc: (l) => STR[l].guidelines.lead },
    { route: '/platforms', title: (l) => STR[l].platforms.title, body: pages.platformsPage, desc: (l) => STR[l].platforms.lead, noindex: true },
    { route: '/downloads', title: (l) => STR[l].downloads.title, body: pages.downloadsPage, desc: (l) => STR[l].downloads.lead },
  ];

  const indexable = [];
  for (const lang of LANGS) {
    for (const r of routes) {
      const html = renderPage({ lang, route: r.route, title: r.title(lang), description: r.desc(lang), body: r.body(lang, data), noindex: r.noindex }, ctx);
      await writeOut(routeFile(lang, r.route), html);
      if (!r.noindex) indexable.push(href(lang, r.route));
    }
    for (let i = 0; i < components.length; i += 1) {
      const c = components[i];
      const route = `/components/${c.slug}`;
      const html = renderPage({ lang, route, title: c.title, description: c.lead.replace(/[`*_]/g, ''), body: pages.componentPage(lang, data, c, i) }, ctx);
      await writeOut(routeFile(lang, route), html);
      indexable.push(href(lang, route));
    }
  }

  // 404 (English; Firebase serves it for any missing path) and crawler files
  await writeOut('404.html', renderPage({ lang: 'en', route: '/404', title: STR.en.notFound.title, description: STR.en.notFound.text, body: pages.notFoundPage('en'), noindex: true }, ctx));
  const urls = indexable.map((u) => `<url><loc>${ORIGIN}${u === '/' ? '/' : u}</loc></url>`).join('\n');
  await writeOut('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  await writeOut('robots.txt', `User-agent: *\nAllow: /\nDisallow: /previews/\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);

  return { pages: indexable.length, components: components.length, meta };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const r = await build();
  console.log(`Built ${r.pages} indexable pages, ${r.components} components, design system ${r.meta.version} (${r.meta.date}) into dist/`);
}
