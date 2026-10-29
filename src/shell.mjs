// The page frame: header, sidebar, footer, head tags.
import { esc } from './markdown.mjs';
import { STR } from './i18n.mjs';

export const ORIGIN = 'https://design.cave.technology';

export function langPrefix(lang) {
  return lang === 'ar' ? '/ar' : '';
}

export function href(lang, route) {
  // Hosting uses clean URLs without a trailing slash, so /ar/ would be a redirect: the Arabic home is /ar.
  const p = langPrefix(lang) + route;
  return p === '' ? '/' : p.replace(/\/$/, '') || '/';
}

const THEME_BOOT = `(function(){var c='system';try{c=localStorage.getItem('cave-design-theme')||'system'}catch(e){}var t=['light','dark','black'].includes(c)?c:(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);var p=new URLSearchParams(location.search).get('platform');if(!['web','flutter'].includes(p)){try{p=localStorage.getItem('cave-design-platform')}catch(e){}}document.documentElement.setAttribute('data-platform',p==='flutter'?'flutter':'web')})()`;

const FOOTER_LINKS = {
  en: [['Cave', 'https://www.cave.technology'], ['Cave Shops', 'https://shops.cave.technology'], ['Cave POS', 'https://pos.cave.technology']],
  ar: [['كهف', 'https://www.cave.technology'], ['متاجر كهف', 'https://shops.cave.technology'], ['نقطة مبيع كهف', 'https://pos.cave.technology']],
};

export function renderNav(lang, ctx) {
  const t = STR[lang];
  const item = (route, label, extra = '') => {
    const current = ctx.route === route ? ' aria-current="page"' : '';
    return `<a class="cv-nav-item" href="${href(lang, route)}"${current}>${esc(label)}</a>${extra}`;
  };
  const componentLinks = ctx.components
    .map((c) => {
      const route = `/components/${c.slug}`;
      const current = ctx.route === route ? ' aria-current="page"' : '';
      return `<a class="cv-nav-item" href="${href(lang, route)}"${current}>${esc(c.title)}</a>`;
    })
    .join('');
  const inComponents = ctx.route === '/components' || ctx.route.startsWith('/components/');
  return `<nav class="cv-sidebar-nav" aria-label="${esc(t.siteName)}">
${item('/', t.navOverview)}
<div class="cv-nav-section">${esc(t.navFoundations)}</div>
${item('/foundations/colour', t.navColour)}
${item('/foundations/typography', t.navTypography)}
${item('/foundations/layout', t.navLayout)}
<div class="cv-nav-section">${esc(t.navComponents)}</div>
${item('/components', t.components.all)}
${inComponents ? `<div class="sub">${componentLinks}</div>` : ''}
<div class="cv-nav-section">${esc(t.navBrand)}</div>
<a class="cv-nav-item" href="${t.brandSiteUrl}">${esc(t.navBrandSite)} ↗</a>
${item('/templates', lang==='ar'?'القوالب':'Templates')}
${item('/customization',lang==='ar'?'التخصيص':'Customization')}
${item('/guidelines', t.navGuidelines)}
${item('/platforms', t.navPlatforms)}
${item('/downloads', t.navDownloads)}
</nav>`;
}

function renderFooter(lang, meta) {
  const t = STR[lang];
  const year = new Date().getFullYear();
  const links = FOOTER_LINKS[lang].map(([label, url]) => `<li><a href="${url}">${esc(label)}</a></li>`).join('');
  const alt = lang === 'ar' ? 'كهف' : 'Cave';
  const brandLink = `<li><a href="${t.brandSiteUrl}">${esc(t.navBrandSite)}</a></li>`;
  return `<footer class="cv-footer site-footer"><div class="cv-footer__stack">
<img class="cv-footer__logo logo-light" src="/assets/logos/cave-symbol-color.svg" alt="${alt}" height="40" style="height:40px;width:40px">
<img class="cv-footer__logo logo-dark" src="/assets/logos/cave-symbol-white.svg" alt="" height="40" style="height:40px;width:40px">
<p class="cv-footer__copy">${esc(t.footer.copy(year))}</p>
<p class="cv-footer__copy" style="margin-top:4px;font-size:13px">${t.footer.version(esc(meta.version), esc(meta.date))}</p>
<ul class="cv-footer__links">${links}${brandLink}</ul>
</div></footer>`;
}

// page = { lang, route, title, description, body, noindex, wideBody }
export function renderPage(page, ctx) {
  const { lang, route } = page;
  const t = STR[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const other = lang === 'ar' ? 'en' : 'ar';
  const fullTitle = route === '/' ? t.siteName : `${page.title} | ${t.siteName}`;
  const canonical = ORIGIN + href(lang, route);
  const alternates = route === '/404' ? '' : ['en', 'ar']
    .map((l) => `<link rel="alternate" hreflang="${l}" href="${ORIGIN + href(l, route)}">`)
    .join('\n');
  const robots = page.noindex ? '<meta name="robots" content="noindex, nofollow">\n' : '';
  const themeOption = (value, label) => `<option value="${value}">${esc(label)}</option>`;
  return `<!doctype html>
<html lang="${lang}" dir="${dir}" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(page.description || t.siteTag)}">
${robots}<link rel="canonical" href="${canonical}">
${alternates}
${route === '/404' ? '' : `<link rel="alternate" hreflang="x-default" href="${ORIGIN + href('en', route)}">`}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(t.siteName)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(page.description || t.siteTag)}">
<meta property="og:url" content="${canonical}">
<meta name="theme-color" content="#182643">
<link rel="icon" type="image/svg+xml" href="/assets/logos/cave-symbol-color.svg">
<script>${THEME_BOOT}</script>
<link rel="stylesheet" href="/assets/fonts-cave.css">
<link rel="stylesheet" href="/assets/tokens.css">
<link rel="stylesheet" href="/assets/components.css">
<link rel="stylesheet" href="/assets/site.css">
</head>
<body>
<a class="skip" href="#main">${esc(t.skip)}</a>
<header class="top"><div class="top__in">
<a class="brand" href="${href(lang, '/')}"><img class="logo-light" src="/assets/logos/cave-symbol-color.svg" alt=""><img class="logo-dark" src="/assets/logos/cave-symbol-white.svg" alt=""><span>${esc(t.siteName)}</span></a>
<span class="top__space"></span>
<div class="top__ctl">
<label class="sr-only" for="platform-select">${lang === 'ar' ? 'المنصة' : 'Platform'}</label>
<select id="platform-select" disabled class="cv-input" aria-label="${lang === 'ar' ? 'المنصة' : 'Platform'}"><option value="web">${lang === 'ar' ? 'الويب' : 'Web'}</option><option value="flutter">Flutter</option></select>
<label class="sr-only" for="theme-select">${esc(t.theme)}</label>
<select id="theme-select" disabled class="cv-input" aria-label="${esc(t.theme)}">${themeOption('system', t.themeSystem)}${themeOption('light', t.themeLight)}${themeOption('dark', t.themeDark)}${themeOption('black', t.themeBlack)}</select>
<a class="lang" href="${href(other, route === '/404' ? '/' : route)}" hreflang="${other}" lang="${other}">${esc(t.otherLang)}</a>
<button class="cv-btn cv-btn--secondary cv-btn--sm menu-btn" id="menu-btn" disabled aria-expanded="false" aria-controls="side">${esc(t.menu)}</button>
</div></div></header>
<div class="frame">
<aside class="side" id="side">${renderNav(lang, ctx.withRoute(route))}</aside>
<main class="main" id="main"><div class="page">
${page.body.replaceAll('<pre ','<pre tabindex="0" ')}
</div></main>
</div>
${renderFooter(lang, ctx.meta)}
<script src="/assets/site.js" defer></script>
</body>
</html>
`;
}
