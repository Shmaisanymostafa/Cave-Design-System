import {esc} from './markdown.mjs';
import {flutterExample} from '../source/catalog.mjs';
export function previewPage(component,lang) {
  const sample=component.example(lang);
  return `<!doctype html><html lang="${lang}" dir="${lang==='ar'?'rtl':'ltr'}" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(component.title[lang])}</title>
<script>var theme=new URLSearchParams(location.search).get('theme');if(['light','dark','black'].includes(theme))document.documentElement.dataset.theme=theme;</script>
<link rel="stylesheet" href="/assets/tokens.css"><link rel="stylesheet" href="/assets/core/styles.css"><link rel="stylesheet" href="/assets/fonts.css">
<style>*{box-sizing:border-box}body{margin:0;padding:24px;background:var(--surface);color:var(--ink);font:400 16px/1.75 var(--ui-font);overflow-wrap:anywhere}fieldset{border:1px solid var(--border);border-radius:var(--radius-control)}.cave-toast{margin-block-start:16px}h1,h2,p{margin-block:0 12px}button,input{max-width:100%}</style>
</head><body data-component="${component.name}" data-ready="false" inert aria-busy="true"><div id="sample">${sample.html}</div><script type="module" src="/assets/preview.js"></script></body></html>`;
}
export function codeExamples(component,lang) {
  const ar=lang==='ar',sample=component.example(lang);
  const block=(code,language)=>`<div class="code-example"><button class="cv-btn cv-btn--secondary cv-btn--sm copy-code" type="button" disabled data-copy-label="${ar?'نسخ الشيفرة':'Copy code'}" data-copied-label="${ar?'تم النسخ':'Copied'}">${ar?'نسخ الشيفرة':'Copy code'}</button><pre dir="ltr"><code class="language-${language}">${esc(code)}</code></pre><span class="copy-status sr-only" role="status"></span></div>`;
  return `<section id="code"><h2>${ar?'الشيفرة':'Code'}</h2>
<div data-platform="web"><p>${ar?'استخدم CSS وHTML الأصليين، وأضف JavaScript عند الحاجة إلى تفاعل.':'Use native HTML and CSS; add JavaScript where interaction is needed.'}</p>${block("import '@cave-ui/core/tokens.css';\nimport '@cave-ui/core/styles.css';",'javascript')}${block(sample.html,'html')}${sample.js?block(sample.js,'javascript'):''}</div>
<div data-platform="flutter" hidden><p>${ar?'مثال كامل قابل للتشغيل داخل مشروع Flutter مع حزمة cave_ui.':'A complete example for a Flutter project with the cave_ui package installed.'}</p>${block(flutterExample(component,lang),'dart')}<a href="/examples/flutter/${component.slug}_${lang}.dart" download>${ar?'تنزيل ملف Dart':'Download Dart file'}</a></div>
</section>`;
}
export function installContent(lang,version) {
 const ar=lang==='ar';
 return `<div class="cv-banner note">${ar?'نسخة عمل غير منشورة. الأرشيفات أدناه للتقييم المحلي والنشر متوقف حاليًا.':'Unreleased working copy. Archives below are for local evaluation; publication is paused.'}</div>
 <div data-platform="web"><h2>${ar?'تثبيت حزمة الويب':'Install the web package'}</h2>
 <p><a href="/downloads/cave-ui-core-${version}.tgz" download>@cave-ui/core ${version}</a> · <a href="/downloads/cave-ui-tokens-${version}.tgz" download>@cave-ui/tokens ${version}</a></p>
 <pre dir="ltr"><code>npm install ./cave-ui-core-${version}.tgz</code></pre>
 <pre dir="ltr"><code>${esc("import '@cave-ui/core/tokens.css';\nimport '@cave-ui/core/styles.css';\nimport { createCave } from '@cave-ui/core';\n\nconst ui = createCave({\n  locale: '"+lang+"',\n  theme: 'system',\n  storageKey: 'my-app-appearance'\n});\nui.setLocale('ar');\nui.setTheme('dark');\n\n// Your application updates its own translated content.\ndocument.documentElement.addEventListener('cave:change', event => {\n  console.log(event.detail);\n});")}</code></pre>
 <p>${ar?'الحزمة الأساسية بلا تبعيات تشغيل خارجية. الاستيراد آمن في الخادم، لكن أنشئ المتحكم في المتصفح. تضم الحزمة ملف legacy.css لدعم أسماء cv- أثناء الانتقال إلى cave-.':'The web core has no external runtime dependencies. Imports are server-safe; create the controller in the browser. The optional legacy.css supports cv- names during migration to cave-.'}</p>
 </div><div data-platform="flutter" hidden><h2>${ar?'تثبيت حزمة Flutter':'Install the Flutter package'}</h2>
 <p><a href="/downloads/cave_ui-${version}.tar.gz" download>cave_ui ${version}</a></p>
 <p>${ar?'فك الأرشيف داخل مجلد vendor في مشروعك، ثم أضف المسار إلى pubspec.yaml وشغّل flutter pub get.':'Extract the archive into your project’s vendor directory, add the path to pubspec.yaml, then run flutter pub get.'}</p>
 <pre dir="ltr"><code>dependencies:\n  cave_ui:\n    path: vendor/cave_ui</code></pre>
 <pre dir="ltr"><code>${esc("final controller = CaveController(locale: const Locale('"+lang+"'));\n\nCaveApp(controller: controller, home: const MyHomePage());\n\ncontroller.setLocale(const Locale('ar'));\ncontroller.setTheme(CaveThemeMode.black);")}</code></pre>
 <p>${ar?'تحتاج Flutter 3.35 أو أحدث. التبعيات المباشرة هي Flutter وحزمة الترجمة التابعة له، التي تجلب تبعيات انتقالية مثل intl. لا تتطلب المكتبة مدير حالة أو مكتبة أيقونات خارجية.':'Requires Flutter 3.35 or newer. Direct dependencies are Flutter and its localization SDK, which brings transitive dependencies such as intl. No external state manager or icon library is required.'}</p></div>`;
}
