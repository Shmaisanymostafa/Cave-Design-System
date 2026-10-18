// Page bodies. Each takes the language and the loaded design system data and returns HTML.
import { esc, md, inline, sections, leadAndRest } from './markdown.mjs';
import { STR } from './i18n.mjs';
import { href } from './shell.mjs';
import { THEMES, splitColours, CONTRAST_PAIRS } from './tokens.mjs';

const head = (lang, eyebrow, title, lead) => `<header>
<p class="eyebrow">${esc(eyebrow)}</p>
<h1 class="title">${esc(title)}</h1>
${lead ? `<p class="lead">${esc(lead)}</p>` : ''}
</header>`;

// Detailed guidance stays in the design system's English. Mark it so it reads left to right inside an Arabic page.
function docBlock(lang, html, wide = false) {
  const cls = `doc${wide ? ' doc--wide' : ''}${lang === 'ar' ? ' doc--en' : ''}`;
  const attrs = lang === 'ar' ? ' lang="en" dir="ltr"' : '';
  return `<div class="${cls}"${attrs}>${html}</div>`;
}

function englishNote(lang) {
  if (lang !== 'ar') return '';
  return `<div class="cv-banner note"><svg class="cv-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.01"/></svg><div class="cv-banner__text">${esc(STR.ar.bodyEnglishNote)}</div></div>`;
}

const themeLabel = (lang, th) => STR[lang][`theme${th[0].toUpperCase()}${th.slice(1)}`];

export function homePage(lang, d) {
  const t = STR[lang].home;
  const facts = [
    [THEMES.length, t.factThemes],
    [d.counts.colours, t.factColours],
    [d.counts.styles, t.factStyles],
    [d.counts.components, t.factComponents],
  ].map(([n, label]) => `<li><b>${n}</b><span>${esc(label)}</span></li>`).join('');
  const sectionKeys = [
    ['colour', '/foundations/colour', STR[lang].navColour],
    ['typography', '/foundations/typography', STR[lang].navTypography],
    ['layout', '/foundations/layout', STR[lang].navLayout],
    ['components', '/components', STR[lang].navComponents],
    ['brand', null, STR[lang].navBrand],
    ['guidelines', '/guidelines', STR[lang].navGuidelines],
    ['platforms', '/platforms', STR[lang].navPlatforms],
    ['downloads', '/downloads', STR[lang].navDownloads],
  ];
  const cards = sectionKeys
    .map(([k, route, label]) => `<li><a class="card" href="${route ? href(lang, route) : STR[lang].brandSiteUrl}"><b>${esc(label)}</b><span>${esc(t.sections[k])}</span></a></li>`)
    .join('');
  const principles = t.principles.map(([b, s]) => `<li><b>${esc(b)}</b><span>${esc(s)}</span></li>`).join('');
  return `<section class="hero">
<h1>${esc(t.title)}</h1>
<p class="lead">${esc(t.lead)}</p>
<div class="hero__actions"><a class="cv-btn cv-btn--primary cv-btn--lg" href="${href(lang, '/components')}">${esc(t.cta)}</a><a class="cv-btn cv-btn--secondary cv-btn--lg" href="${href(lang, '/downloads')}">${esc(t.cta2)}</a></div>
<ul class="facts">${facts}</ul>
</section>
<section><h2>${esc(t.principlesTitle)}</h2><ul class="principles">${principles}</ul></section>
<section><h2>${esc(t.sectionsTitle)}</h2><ul class="cards">${cards}</ul></section>`;
}

export function colourPage(lang, d) {
  const t = STR[lang].colour;
  const { raw, semantic } = splitColours(d.tokens);
  const r = d.resolver;
  const swatches = raw
    .map((c) => `<li class="sw"><div class="sw__chip" style="background:${esc(c.value)}"></div><div class="sw__txt"><b>${esc(c.name)}</b><code>${esc(c.value)}</code><small>${inline(c.usage || '')}</small></div></li>`)
    .join('');
  const th = THEMES.map((x) => `<th>${esc(themeLabel(lang, x))}</th>`).join('');
  const semRows = semantic
    .map((c) => {
      const cells = THEMES.map((x) => {
        const hex = r.hex(x, c.name);
        return `<td><span class="dot" style="background:${hex}" title="${esc(c.value[x])}"></span> <code>${hex}</code></td>`;
      }).join('');
      return `<tr><td><code>${esc(c.name)}</code></td>${cells}<td class="use">${inline(c.usage || '')}</td></tr>`;
    })
    .join('');
  const pairRows = CONTRAST_PAIRS.map((p) => {
    const cells = THEMES.map((x) => {
      const ratio = r.ratio(x, p.fg, p.bg);
      const ok = ratio >= p.min;
      return `<td class="num">${ratio.toFixed(2)}:1 <span class="pill ${ok ? 'pill--ok' : 'pill--no'}">${esc(ok ? t.pass : t.fail)}</span></td>`;
    }).join('');
    return `<tr><td><code>${esc(p.fg)}</code> / <code>${esc(p.bg)}</code></td>${cells}</tr>`;
  }).join('');
  return `${head(lang, STR[lang].navFoundations, t.title, t.lead)}
<section id="palette"><h2>${esc(t.paletteTitle)}</h2><p class="sec-lead">${esc(t.paletteLead)}</p><ul class="swatches">${swatches}</ul></section>
<section id="semantic"><h2>${esc(t.semanticTitle)}</h2><p class="sec-lead">${esc(t.semanticLead)}</p>
<div class="tcard"><div class="tscroll"><table class="tbl"><thead><tr><th>${esc(t.token)}</th>${th}<th>${esc(t.usage)}</th></tr></thead><tbody>${semRows}</tbody></table></div></div></section>
<section id="contrast"><h2>${esc(t.contrastTitle)}</h2><p class="sec-lead">${esc(t.contrastLead)}</p>
<div class="tcard"><div class="tscroll"><table class="tbl"><thead><tr><th>${esc(t.pair)}</th>${th}</tr></thead><tbody>${pairRows}</tbody></table></div></div></section>
<section id="guidance"><h2>${esc(t.guidanceTitle)}</h2>${englishNote(lang)}${docBlock(lang, md(d.readme.map.get('Colour')))}</section>`;
}

const ALPHABET = {
  display: 'Aa Bb Cc Dd Ee Ff Gg 0123456789',
  sans: 'Aa Bb Cc Dd Ee Ff Gg 0123456789',
  'ar-display': 'أ ب ت ث ج ح خ د ذ ر ز ٠١٢٣٤٥٦٧٨٩',
  'ar-text': 'أ ب ت ث ج ح خ د ذ ر ز ٠١٢٣٤٥٦٧٨٩',
};
const FAMILY_NAME = { display: 'Hero', sans: 'Poppins', 'ar-display': 'Almarai Light', 'ar-text': 'Almarai' };

export function typographyPage(lang, d) {
  const t = STR[lang].type;
  const fam = Object.keys(d.tokens.type.families)
    .map((k) => {
      const rtl = k.startsWith('ar');
      return `<div class="cv-card"><b>--font-${esc(k)}</b><p class="big" style="font-family:var(--font-${k});${k === 'ar-display' ? 'font-weight:300;' : ''}"${rtl ? ' dir="rtl" lang="ar"' : ''}>${esc(FAMILY_NAME[k])}</p><p class="alpha" style="font-family:var(--font-${k})"${rtl ? ' dir="rtl" lang="ar"' : ''}>${esc(ALPHABET[k])}</p></div>`;
    })
    .join('');
  const groups = d.tokens.type.groups
    .map((g) => {
      const rtl = g.family.startsWith('ar');
      const rows = g.styles
        .map((s) => {
          const style = `font-family:var(--font-${g.family});font-size:${s.fontSize};line-height:${s.lineHeight};font-weight:${s.fontWeight};${s.letterSpacing ? `letter-spacing:${s.letterSpacing};` : ''}`;
          return `<div class="spec"><div class="spec__meta"><b>${esc(s.name)}</b><span>${esc(t.size)} ${esc(s.fontSize)}</span><span>${esc(t.line)} ${esc(s.lineHeight)}</span><span>${esc(t.weight)} ${esc(s.fontWeight)}</span></div><p class="spec__sample" style="${style}"${rtl ? ' dir="rtl" lang="ar"' : ''}>${esc(s.sample)}</p><p class="spec__use">${inline(s.usage || '')}</p></div>`;
        })
        .join('');
      return `<h3>${esc(g.name)}</h3><div class="tcard" style="padding:0 var(--space-3)">${rows}</div>`;
    })
    .join('');
  return `${head(lang, STR[lang].navFoundations, t.title, t.lead)}
<section id="families"><h2>${esc(t.familiesTitle)}</h2><div class="fam">${fam}</div></section>
<section id="scale"><h2>${esc(t.scaleTitle)}</h2><p class="sec-lead">${esc(t.scaleLead)}</p>${groups}</section>
<section id="guidance"><h2>${esc(t.guidanceTitle)}</h2>${englishNote(lang)}${docBlock(lang, md(d.readme.map.get('Typography')))}</section>`;
}

export function layoutPage(lang, d) {
  const t = STR[lang].layout;
  const tk = d.tokens;
  const table = (cols, rows) => `<div class="tcard"><div class="tscroll"><table class="tbl"><thead><tr>${cols.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div></div>`;
  const spacing = table(
    [t.token, t.value, '', t.usage],
    tk.spacing.tokens.map((s) => `<tr><td><code>${esc(s.name)}</code></td><td class="num">${esc(s.value)}</td><td style="width:50%"><span class="bar" style="width:${esc(s.value)}"></span></td><td class="use">${inline(s.usage || '')}</td></tr>`).join(''),
  );
  const radius = table(
    [t.token, t.value, '', t.usage],
    tk.radius.tokens.map((s) => `<tr><td><code>${esc(s.name)}</code></td><td class="num">${esc(s.value)}</td><td><div class="rbox" style="border-radius:${esc(s.value)}"></div></td><td class="use">${inline(s.usage || '')}</td></tr>`).join(''),
  );
  const shadow = table(
    [t.token, '', t.usage],
    tk.shadow.tokens.map((s) => `<tr><td><code>${esc(s.name)}</code></td><td><div class="sbox" style="box-shadow:var(--${esc(s.name)})"></div></td><td class="use">${inline(s.usage || '')}</td></tr>`).join(''),
  );
  const motion = table(
    [t.token, t.value, t.usage],
    [...tk.duration.tokens, ...tk.easing.tokens, ...tk.zIndex.tokens]
      .map((s) => `<tr><td><code>${esc(s.name)}</code></td><td class="num"><code>${esc(s.value)}</code></td><td class="use">${inline(s.usage || '')}</td></tr>`)
      .join(''),
  );
  const notes = [tk.spacing.note, tk.radius.note, tk.shadow.note, tk.duration.note].filter(Boolean).map((n) => `- ${n}`).join('\n');
  return `${head(lang, STR[lang].navFoundations, t.title, t.lead)}
<section id="spacing"><h2>${esc(t.spacingTitle)}</h2>${spacing}</section>
<section id="radius"><h2>${esc(t.radiusTitle)}</h2>${radius}</section>
<section id="shadow"><h2>${esc(t.shadowTitle)}</h2>${shadow}</section>
<section id="motion"><h2>${esc(t.motionTitle)}</h2>${motion}</section>
<section id="guidance"><h2>${esc(t.guidanceTitle)}</h2>${englishNote(lang)}${docBlock(lang, md(d.readme.map.get('Shape, layers and pattern') + '\n\n' + notes))}</section>`;
}

export function componentsIndexPage(lang, d) {
  const t = STR[lang].components;
  const byGroup = new Map();
  for (const c of d.components) {
    if (!byGroup.has(c.group)) byGroup.set(c.group, []);
    byGroup.get(c.group).push(c);
  }
  const body = [...byGroup.entries()]
    .map(([group, list]) => `<h2 class="group-title">${esc(STR[lang].groups[group] || group)}</h2><ul class="cards">${list
      .map((c) => `<li><a class="card" href="${href(lang, `/components/${c.slug}`)}"><b>${esc(c.title)}</b><span>${inline(c.lead)}</span></a></li>`)
      .join('')}</ul>`)
    .join('');
  return `${head(lang, STR[lang].navComponents, t.title, t.lead)}${englishNote(lang)}${body}`;
}

export function componentPage(lang, d, c, i) {
  const t = STR[lang].components;
  const prev = d.components[i - 1];
  const next = d.components[i + 1];
  const prevLink = prev ? `<a href="${href(lang, `/components/${prev.slug}`)}">${lang === 'ar' ? '→' : '←'} ${esc(prev.title)}</a>` : '<span></span>';
  const nextLink = next ? `<a href="${href(lang, `/components/${next.slug}`)}">${esc(next.title)} ${lang === 'ar' ? '←' : '→'}</a>` : '<span></span>';
  const english = lang === 'ar' ? ' lang="en" dir="ltr"' : '';
  return `<p class="crumbs"><a href="${href(lang, '/components')}">${esc(t.title)}</a></p>
${head(lang, STR[lang].groups[c.group] || c.group, c.title, '')}
<div class="doc${lang === 'ar' ? ' doc--en' : ''}"${english}><p class="lead" style="margin-top:var(--space-2)">${inline(c.lead)}</p></div>
<section id="preview"><h2>${esc(t.preview)}</h2>
<iframe class="preview" src="/previews/${esc(c.name)}.html" title="${esc(c.title)}" height="${c.height}" loading="lazy"></iframe>
<p style="margin-top:var(--space-2)"><a href="/previews/${esc(c.name)}.html" target="_blank" rel="noopener">${esc(t.open)}</a></p></section>
${c.rest ? `<section id="guidance"><h2>${esc(t.guidance)}</h2>${englishNote(lang)}${docBlock(lang, md(c.rest))}</section>` : ''}
<nav class="pager" aria-label="${esc(t.title)}">${prevLink}${nextLink}</nav>`;
}

export function guidelinesPage(lang, d) {
  const t = STR[lang].guidelines;
  return `${head(lang, STR[lang].navBrand, t.title, t.lead)}${englishNote(lang)}${docBlock(lang, md(d.readme.map.get('Product interface')), true)}`;
}

export function platformsPage(lang, d) {
  const t = STR[lang].platforms;
  const body = d.platformMapping.replace(/^# .*\n+/, '').replace(/^[^\n#][^\n]*\n+/, ''); // drop the H1 and the intro line: the page header says it
  return `${head(lang, STR[lang].navBrand, t.title, t.lead)}${englishNote(lang)}${docBlock(lang, md(body), true)}`;
}

export function downloadsPage(lang, d) {
  const t = STR[lang].downloads;
  const kb = (n) => `${(n / 1024).toFixed(n < 10240 ? 1 : 0)} KB`;
  const row = (file, name, text, size) => `<tr><td><a href="${file}" download><code>${esc(name)}</code></a></td><td class="use">${esc(text)}</td><td class="num">${kb(size)}</td></tr>`;
  const sizes = d.downloadSizes;
  const code = [
    row('/assets/tokens.json', t.tokensJson, t.tokensJsonText, sizes.tokensJson),
    row('/assets/tokens.css', t.tokensCss, t.tokensCssText, sizes.tokensCss),
    row('/assets/components.css', t.componentsCss, t.componentsCssText, sizes.componentsCss),
    row('/assets/fonts.css', t.fontsCss, t.fontsCssText, sizes.fontsCss),
    row('/assets/cave_tokens.dart', t.tokensDart, t.tokensDartText, sizes.tokensDart),
  ].join('');
  const fonts = d.fonts.map((f) => `<tr><td><a href="/assets/fonts/${esc(f.file)}" download><code>${esc(f.file)}</code></a></td><td class="use">${esc(f.family)} ${esc(f.weight)}${f.style ? ` ${esc(f.style)}` : ''}</td><td class="num">${kb(f.size)}</td></tr>`).join('');
  const table = (rows) => `<div class="tcard"><div class="tscroll"><table class="tbl"><thead><tr><th>${esc(t.file)}</th><th></th><th>${esc(t.size)}</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
  return `${head(lang, STR[lang].navBrand, t.title, t.lead)}
<section id="code"><h2>${esc(t.codeTitle)}</h2>${table(code)}</section>
<section id="fonts"><h2>${esc(t.fontsTitle)}</h2><p class="sec-lead">${esc(t.fontsNote)}</p>${table(fonts)}</section>
<section id="brand"><h2>${esc(t.logosTitle)}</h2><p class="sec-lead">${esc(t.logosNote)}</p><a class="cv-btn cv-btn--secondary" href="${STR[lang].brandSiteUrl}">${esc(t.logosLink)}</a></section>`;
}

export function notFoundPage(lang) {
  const t = STR[lang].notFound;
  return `<section class="hero"><h1>404</h1><p class="lead">${esc(t.text)}</p><div class="hero__actions"><a class="cv-btn cv-btn--primary cv-btn--lg" href="${href(lang, '/')}">${esc(t.back)}</a></div></section>`;
}


