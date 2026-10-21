// Builds packages, examples and the static site from canonical repository sources.
import { readFile, writeFile, mkdir, rm, cp, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTokensCss, buildFontsCss, buildDart, makeResolver } from './src/tokens.mjs';
import { renderPage, href, ORIGIN } from './src/shell.mjs';
import { LANGS, STR } from './src/i18n.mjs';
import * as pages from './src/pages.mjs';
import {catalog, flutterExample} from './source/catalog.mjs';
import {previewPage} from './src/examples.mjs';
import {buildPackages} from './scripts/build-packages.mjs';
import {buildExamples} from './scripts/build-examples.mjs';
import {templates} from './source/templates.mjs';
import {buildTemplates} from './scripts/build-templates.mjs';
import {packPackages} from './scripts/pack-packages.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'source');
const OUT = path.join(ROOT, 'dist');

const OPEN_FONT_FAMILIES = ['Poppins', 'Almarai'];

const read = (...p) => readFile(path.join(SRC, ...p), 'utf8');
const exists = async (p) => stat(p).then(() => true, () => false);

async function loadComponents() {
  return catalog.map(c => ({...c, titles:c.title, leads:c.lead, title:c.title.en, lead:c.lead.en, rest:c.guidance.en, height:300}));
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
  const release = await buildPackages();
  await buildExamples();
  const artifacts = await packPackages();
  await rm(OUT, { recursive: true, force: true });
  const tokens = JSON.parse(await read('tokens.json'));
  const metaRaw = JSON.parse(await read('meta.json'));
  const components = await loadComponents();
  const resolver = makeResolver(tokens);

  const meta = {version: release.version, date:metaRaw.date};

  // Generated assets
  const tokensCss = buildTokensCss(tokens);
  const present = [];
  for (const f of tokens.type.fonts) if (await exists(path.join(SRC, f.file))) present.push(f);
  const presentTokens = { ...tokens, type: { ...tokens.type, fonts: present } };
  const fontsCss = buildFontsCss(presentTokens, { families: OPEN_FONT_FAMILIES });
  const dart = buildDart(tokens);
  const componentsCss = await readFile(path.join(ROOT,'packages/core/dist/legacy.css'),'utf8');
  await writeOut('assets/tokens.css', tokensCss);
  await writeOut('assets/fonts.css', fontsCss);
  await writeOut('assets/fonts-cave.css', fontsCss);
  await writeOut('assets/components.css', componentsCss);
  await writeOut('assets/cave_tokens.dart', dart);
  await writeOut('assets/tokens.json', JSON.stringify(tokens, null, 1));
  await cp(path.join(ROOT, 'site', 'site.css'), path.join(OUT, 'assets', 'site.css'));
  await cp(path.join(ROOT, 'site', 'site.js'), path.join(OUT, 'assets', 'site.js'));
  for(const file of ['catalog.mjs','templates.mjs','playground.mjs'])await cp(path.join(SRC,file),path.join(OUT,'assets',file));
  for(const file of ['preview.js','playground.js'])await cp(path.join(ROOT,'site',file),path.join(OUT,'assets',file));
  if(await exists(path.join(ROOT,'.artifacts/flutter-preview/index.html')))await cp(path.join(ROOT,'.artifacts/flutter-preview'),path.join(OUT,'flutter-preview'),{recursive:true});
  await cp(path.join(ROOT,'packages/core/dist'),path.join(OUT,'assets/core'),{recursive:true});
  await mkdir(path.join(OUT,'downloads'),{recursive:true});
  for (const artifact of artifacts) await cp(path.join(ROOT,'.artifacts',artifact.file),path.join(OUT,'downloads',artifact.file));
  await writeOut('downloads/LICENSE.txt',await readFile(path.join(ROOT,'packages/LICENSE'),'utf8'));
  for (const family of ['poppins','almarai']) await writeOut(`assets/fonts/${family}-OFL.txt`,await read('fonts',`${family}-OFL.txt`));
  // Only open fonts with their licence notices are served.
  const servedFonts = present.filter((f) => OPEN_FONT_FAMILIES.includes(f.family));
  for (const f of servedFonts) await cp(path.join(SRC, f.file), path.join(OUT, 'assets', f.file));
  for (const f of ['cave-symbol-color.svg', 'cave-symbol-white.svg']) await cp(path.join(SRC, 'logos', f), path.join(OUT, 'assets', 'logos', f));

  // Both preview languages and Flutter source come from the same executable examples.
  for (const c of catalog) {
    for (const lang of LANGS) {
      await writeOut(`previews/${lang}/${c.name}.html`,previewPage(c,lang));
      await writeOut(`examples/flutter/${c.slug}_${lang}.dart`,flutterExample(c,lang));
    }
    await writeOut(`previews/${c.name}.html`,previewPage(c,'en'));
  }

  await buildTemplates(ROOT,OUT);

  const sizeOf = async (rel) => (await stat(path.join(OUT, rel))).size;
  const fontFiles = [];
  for (const f of present.filter((x) => OPEN_FONT_FAMILIES.includes(x.family))) {
    const file = f.file.replace(/^fonts\//, '');
    fontFiles.push({ ...f, file, size: await sizeOf(`assets/fonts/${file}`) });
  }

  const data = {
    tokens,
    version: release.version,
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
    {route:'/templates',title:l=>l==='ar'?'القوالب':'Templates',body:pages.templatesPage},
    {route:'/customization',title:l=>l==='ar'?'التخصيص':'Customization',body:pages.customizationPage},
    { route: '/', title: (l) => STR[l].siteName, body: pages.homePage, desc: (l) => STR[l].home.lead },
    { route: '/foundations/colour', title: (l) => STR[l].colour.title, body: pages.colourPage, desc: (l) => STR[l].colour.lead },
    { route: '/foundations/typography', title: (l) => STR[l].type.title, body: pages.typographyPage, desc: (l) => STR[l].type.lead },
    { route: '/foundations/layout', title: (l) => STR[l].layout.title, body: pages.layoutPage, desc: (l) => STR[l].layout.lead },
    { route: '/components', title: (l) => STR[l].components.title, body: pages.componentsIndexPage, desc: (l) => STR[l].components.lead },
    { route: '/guidelines', title: (l) => STR[l].guidelines.title, body: pages.guidelinesPage, desc: (l) => STR[l].guidelines.lead },
    { route: '/platforms', title: (l) => STR[l].platforms.title, body: pages.platformsPage, desc: (l) => STR[l].platforms.lead },
    { route: '/downloads', title: (l) => STR[l].downloads.title, body: pages.downloadsPage, desc: (l) => STR[l].downloads.lead },
  ];

  const indexable = [];
  for (const lang of LANGS) {
    const localized = components.map(c=>({...c,title:c.titles[lang],lead:c.leads[lang],rest:c.guidance[lang]}));
    const localizedData = {...data,components:localized};
    const localizedCtx = {...ctx,components:localized};
    for (const r of routes) {
      const html = renderPage({ lang, route: r.route, title: r.title(lang), description: r.desc?.(lang), body: r.body(lang, localizedData), noindex: r.noindex }, localizedCtx);
      await writeOut(routeFile(lang, r.route), html);
      if (!r.noindex) indexable.push(href(lang, r.route));
    }
    for(const template of templates){
      const route='/templates/'+template.slug;
      await writeOut(routeFile(lang,route),renderPage({lang,route,title:template.title[lang],description:template.lead[lang],body:pages.templatePage(lang,template)},localizedCtx));
      indexable.push(href(lang,route));
    }
    for (let i = 0; i < components.length; i += 1) {
      const c = localized[i];
      const route = `/components/${c.slug}`;
      const html = renderPage({ lang, route, title: c.title, description: c.lead.replace(/[`*_]/g, ''), body: pages.componentPage(lang, localizedData, c, i) }, localizedCtx);
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
