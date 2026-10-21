import {serve} from './server.mjs';
import AxeBuilder from '@axe-core/playwright';
import {chromium,firefox,webkit} from 'playwright';
import assert from 'node:assert/strict';
import {readFile,stat,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {catalog} from '../source/catalog.mjs';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const site=await serve(path.join(ROOT,'dist'));
let browser;
for(const engine of (process.env.CAVE_BROWSERS||'chromium').split(',')){
console.log('Browser:',engine);
try {
 browser=await ({chromium,firefox,webkit}[engine]).launch({headless:true,...(process.env.CAVE_BROWSER_PATH?{executablePath:process.env.CAVE_BROWSER_PATH}:{})});
 const context=await browser.newContext({colorScheme:'light'}),page=await context.newPage();page.setDefaultTimeout(10000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 // Hold JavaScript responses to verify that visible controls wait for their handlers.
 const slowPage=await context.newPage();
 let releaseSite;const siteGate=new Promise(resolve=>{releaseSite=resolve;});
 await slowPage.route('**/assets/site.js',async route=>{await siteGate;await route.continue();});
 await slowPage.goto(`${site.base}/components/dialog?platform=flutter`,{waitUntil:'commit'});
 await slowPage.locator('#platform-select:disabled').waitFor();
 assert.equal(await slowPage.locator('#theme-select').isDisabled(),true);
 releaseSite();await slowPage.locator('#platform-select:enabled').waitFor();
 assert.equal(await slowPage.locator('#platform-select').inputValue(),'flutter');
 let coreRequested;const coreRequest=new Promise(resolve=>{coreRequested=resolve;});
 let releaseCore;const coreGate=new Promise(resolve=>{releaseCore=resolve;});
 await slowPage.route('**/assets/core/index.js',async route=>{coreRequested();await coreGate;await route.continue();});
 await slowPage.goto(`${site.base}/previews/en/Dialog.html`,{waitUntil:'commit'});
 await slowPage.locator('body[inert][data-ready="false"]').waitFor({state:'attached'});
 await coreRequest;await slowPage.locator('#open-dialog').waitFor({state:'visible'});
 const trigger=await slowPage.locator('#open-dialog').boundingBox();
 await slowPage.mouse.click(trigger.x+trigger.width/2,trigger.y+trigger.height/2);
 assert.equal(await slowPage.locator('dialog').evaluate(el=>el.open),false);
 releaseCore();await slowPage.locator('body[data-ready="true"]:not([inert])').waitFor({state:'attached'});
 await slowPage.locator('#open-dialog').click();assert.equal(await slowPage.locator('dialog').evaluate(el=>el.open),true);
 await slowPage.close();

 for(const lang of ['en','ar'])for(const width of [320,390,1440]) {
  console.log(`Documentation: ${lang}, ${width}px`);
  await page.setViewportSize({width,height:1000});
  await page.goto(`${site.base}/${lang==='ar'?'ar/':''}components/button?platform=web`);
  assert.equal(await page.locator('html').getAttribute('dir'),lang==='ar'?'rtl':'ltr');
  await page.locator('#platform-select').selectOption('flutter');
  assert.equal(new URL(page.url()).searchParams.get('platform'),'flutter');
  assert.equal(await page.locator('#code [data-platform="flutter"]').isVisible(),true);
  assert.equal(await page.locator('#code [data-platform="web"]').isVisible(),false);
  await page.reload();assert.equal(await page.locator('#platform-select').inputValue(),'flutter');
  await page.locator('a.lang').click();await page.locator('#platform-select:enabled').waitFor();assert.equal(await page.locator('#platform-select').inputValue(),'flutter');
  await page.locator('#platform-select').selectOption('web');
  await page.locator('#theme-select').selectOption('black');
  const frame=page.frameLocator('iframe.preview');await frame.locator('html[data-theme="black"]').waitFor({state:'attached'}).catch(async error => {console.log(await page.evaluate(()=>({url:location.href,theme:document.documentElement.dataset.theme,frame:document.querySelector('iframe').src,html:document.querySelector('iframe').contentDocument?.documentElement.outerHTML.slice(0,600)})));throw error;});
  await page.locator('#preview-language').selectOption('ar');await frame.locator('html[lang="ar"]').waitFor();
  await frame.locator('#save').click();await frame.locator('#result').filter({hasText:'تم حفظ التغييرات'}).waitFor();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no page overflow');
 }
 for(const component of catalog)for(const lang of ['en','ar']) {
  await page.goto(`${site.base}/previews/${lang}/${component.name}.html?theme=dark`);
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${component.name} ${lang} overflow`);
 }
 await page.goto(`${site.base}/previews/ar/Tabs.html`);
 await page.locator('#overview-tab').focus();await page.keyboard.press('ArrowLeft');
 assert.equal(await page.locator('#details-tab').getAttribute('aria-selected'),'true');assert.equal(await page.locator('#details-panel').isVisible(),true);
 await page.keyboard.press('Home');assert.equal(await page.locator('#overview-tab').getAttribute('aria-selected'),'true');
 await page.goto(`${site.base}/previews/en/Dialog.html`);await page.locator('#open-dialog').click();assert.equal(await page.locator('dialog').evaluate(el=>el.open),true);await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').evaluate(el=>el.open),false);await page.waitForFunction(()=>document.activeElement===document.getElementById('open-dialog'));
 for(const name of ['Checkbox','Switch']) {await page.goto(`${site.base}/previews/en/${name}.html`);await page.locator('label').click({position:{x:130,y:20}});assert.equal(await page.locator('input').isChecked(),true);}
 await page.goto(`${site.base}/platforms?platform=flutter`);
 const controllerChecks=await page.evaluate(async()=>{
  const {createCave}=await import('/assets/core/index.js');const element=document.createElement('div');document.body.append(element);const ui=createCave({root:element,locale:'en',theme:'light'});ui.setLocale('ar-LB');ui.setTheme('black');const state={lang:element.lang,dir:element.dir,theme:element.dataset.theme,cancel:ui.t('cancel')};ui.destroy();element.remove();return state;
 });assert.deepEqual(controllerChecks,{lang:'ar-LB',dir:'rtl',theme:'black',cancel:'إلغاء'});
 await page.setViewportSize({width:1440,height:1000});await page.goto(`${site.base}/ar/components/dialog?platform=flutter`);await mkdir(path.join(ROOT,'.artifacts'),{recursive:true});await page.screenshot({path:path.join(ROOT,'.artifacts/design-ar.png'),fullPage:false});

 // Shared URL state, generated code and actual input behavior.
 await page.goto(`${site.base}/components/button?platform=web&locale=ar&theme=black&direction=ltr&numerals=latn&variant=danger&size=lg&state=loading&label=long`);
 await page.locator('[data-playground][data-ready="true"]').waitFor();
 let preview=page.frameLocator('iframe.preview');
 await preview.locator('body[data-ready="true"]').waitFor({state:'attached'});
 assert.equal(await preview.locator('#save').isDisabled(),true);
 assert.equal(await preview.locator('html').getAttribute('dir'),'ltr');assert.equal(await preview.locator('html').getAttribute('data-theme'),'black');
 assert.match(await page.locator('[data-code="dart"]').textContent(),/CaveButtonVariant.danger/);
 await page.reload();await page.locator('[data-playground][data-ready="true"]').waitFor();assert.equal(await page.locator('#preview-size').inputValue(),'lg');
 await page.locator('#preview-state').selectOption('default');await preview.locator('#save:enabled').click();await preview.locator('#result').filter({hasText:'تم حفظ التغييرات'}).waitFor();
 // Settings owns the translations; one locale change drives every derived value.
 await page.goto(`${site.base}/templates/settings?platform=web`);preview=page.frameLocator('iframe.preview');
 await preview.locator('#setting-language').selectOption('ar');await preview.locator('h1').filter({hasText:'إعدادات الحساب'}).waitFor();
 assert.equal(await preview.locator('html').getAttribute('dir'),'rtl');await preview.locator('#setting-numerals').selectOption('latn');assert.match(await preview.locator('#formatted-number').textContent(),/12,345.67/);
 assert.equal(await preview.locator('input[type="email"]').getAttribute('dir'),'ltr');
 await page.goto(`${site.base}/templates/dashboard?platform=web`);preview=page.frameLocator('iframe.preview');await preview.locator('#order-search').fill('1043');assert.equal(await preview.locator('[data-order]:visible').count(),1);await preview.locator('#order-search').fill('no-match');await preview.locator('#search-status').filter({hasText:'No matching'}).waitFor();
 await page.goto(`${site.base}/templates/sign-in?platform=web`);preview=page.frameLocator('iframe.preview');await preview.locator('[type="submit"]').click();assert.equal(await preview.locator('#signin-email').getAttribute('aria-invalid'),'true');assert.equal(await preview.locator('#signin-email').evaluate(el=>el===document.activeElement),true);
 await preview.locator('#signin-email').fill('demo@example.com');await preview.locator('#signin-password').fill('example-only');await preview.locator('#show-password').click();assert.equal(await preview.locator('#signin-password').getAttribute('type'),'text');await preview.locator('[type="submit"]').click();await preview.locator('#signin-status').filter({hasText:'Demo complete'}).waitFor();
 // Axe examines semantic names, roles, contrast and focus-related structure.
 for(const lang of ['en','ar'])for(const route of ['templates/settings','templates/dashboard','templates/sign-in','components/dialog','components/button','customization']){
  await page.goto(`${site.base}/${lang==='ar'?'ar/':''}${route}?platform=web`);
  if(route!=='customization')await page.frameLocator('iframe.preview').locator('body[data-ready="true"]').waitFor({state:'attached'});
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  assert.deepEqual(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],`${engine} ${lang} ${route} accessibility`);
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(`${site.base}/previews/ar/Button.html?state=loading`);await page.locator('body[data-ready="true"]').waitFor({state:'attached'});assert.equal(await page.locator('.cave-spinner').evaluate(el=>getComputedStyle(el).animationName),'none');
 await page.emulateMedia({reducedMotion:'no-preference'});
 // Templates must reflow at narrow width and under magnification.
 for(const lang of ['en','ar'])for(const template of ['SettingsTemplate','DashboardTemplate','SignInTemplate']){
  await page.setViewportSize({width:320,height:900});await page.goto(`${site.base}/previews/${lang}/${template}.html`);await page.locator('body[data-ready="true"]').waitFor({state:'attached'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${template} ${lang} 320px`);
  await page.setViewportSize({width:1280,height:900});await page.evaluate(()=>document.documentElement.style.zoom='2');assert.ok(await page.evaluate(()=>document.documentElement.getBoundingClientRect().width<=innerWidth+1),`${template} ${lang} 200% CSS zoom`);
 }
 // Six visual states per template, kept as a local review gallery.
 const shots=[];await page.setViewportSize({width:390,height:900});
 for(const lang of ['en','ar'])for(const theme of ['light','dark','black']){
  await page.goto(`${site.base}/previews/${lang}/SettingsTemplate.html?theme=${theme}`);await page.locator('body[data-ready="true"]').waitFor({state:'attached'});await page.evaluate(()=>document.fonts.ready);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const file=`settings-${engine}-${lang}-${theme}.png`;await page.screenshot({path:path.join(ROOT,'.artifacts',file),fullPage:true});shots.push(file);
 }
 await import('node:fs/promises').then(fs=>fs.writeFile(path.join(ROOT,`.artifacts/visual-${engine}.html`),`<!doctype html><html lang="en"><meta charset="utf-8"><title>Local template visual review</title><style>body{font:16px system-ui;background:#eee}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}img{width:100%}figure{margin:0}</style><h1>Settings · languages and themes · ${engine}</h1><div class="grid">${shots.map(file=>`<figure><figcaption>${file}</figcaption><img src="${file}"></figure>`).join('')}</div></html>`));
 assert.deepEqual(errors,[]);
 // Optional sibling brand regression, enabled only when that checkout is present.
 const brandDir=path.resolve(ROOT,'../brand.cave.technology');
 if(await stat(path.join(brandDir,'assets/js/theme.js')).catch(()=>null)){
  const brand=await serve(brandDir);
  try{for(const lang of ['','ar/'])for(const width of [320,1440]){
   await page.setViewportSize({width,height:900});await page.goto(`${brand.base}/${lang}`);await page.locator('#theme-button').click();
   for(const mode of ['black','dark','light','system']){await page.locator('label').filter({has:page.locator(`input[value="${mode}"]`)}).click({position:{x:80,y:20}});assert.equal(await page.locator('html').getAttribute('data-theme'),mode==='system'?'light':mode);}
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'brand no horizontal overflow');
   await page.keyboard.press('Escape');assert.equal(await page.locator('#theme-options').isVisible(),false);
  }
  await page.goto(`${brand.base}/`);await page.locator('#asset-background-0').selectOption('paper');assert.equal(await page.locator('.ground').first().evaluate(el=>el.classList.contains('g-paper')),true);
  const downloadPromise=page.waitForEvent('download');await page.locator('.ground .asset-button').first().click();const download=await downloadPromise;assert.match(download.suggestedFilename(),/-1600.png$/);const png=await readFile(await download.path());assert.equal(png.readUInt32BE(16),1600);
  for(const lang of ['','ar/']){await page.goto(`${brand.base}/${lang}`);const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.deepEqual(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],`brand ${lang} accessibility`);}
  }finally{brand.server.close();}
 }
 console.log('PASS: bilingual navigation, URL state, platform code, mobile layouts, theme/locale previews, 30 component previews, native controls, RTL tabs, modal focus, package controller and brand label regression.');
} finally {if(browser)await browser.close();}
}
site.server.close();
