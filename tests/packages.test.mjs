import {test,before} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {buildPackages} from '../scripts/build-packages.mjs';
let createCave;
before(async()=>{await buildPackages();({createCave}=await import('../packages/core/dist/index.js'));});
function environment({dark=false,blocked=false,saved=null}={}) {
 const events=new EventTarget(),data=new Map(saved?[['appearance',JSON.stringify(saved)]]:[]);
 const media={matches:dark,addEventListener:(...args)=>events.addEventListener(...args),removeEventListener:(...args)=>events.removeEventListener(...args)};
 const root=new EventTarget();root.setAttribute=(key,value)=>{root[key]=value;};root.ownerDocument={defaultView:{matchMedia:()=>media,CustomEvent,localStorage:{getItem:key=>{if(blocked)throw Error('Blocked');return data.get(key)||null;},setItem:(key,value)=>{if(blocked)throw Error('Blocked');data.set(key,value);}}}};
 return {root,data,setDark(value){media.matches=value;events.dispatchEvent(new Event('change'));}};
}
test('a single locale change updates regional language, direction, labels and formatting',()=>{
 const env=environment();const ui=createCave({root:env.root,locale:'en',storageKey:'appearance'});let event;
 env.root.addEventListener('cave:change',e=>event=e.detail);
 ui.setLocale('ar-LB');assert.equal(env.root.lang,'ar-LB');assert.equal(env.root.dir,'rtl');assert.equal(ui.t('cancel'),'إلغاء');assert.equal(event.locale,'ar-LB');
 assert.equal(ui.number(1234),new Intl.NumberFormat('ar-LB',{numberingSystem:'arab'}).format(1234));
 ui.setDirection('ltr');assert.equal(env.root.dir,'ltr');assert.equal(env.root.lang,'ar-LB');
 assert.equal(JSON.parse(env.data.get('appearance')).locale,'ar-LB');ui.destroy();
});
test('explicit choices survive system changes; System follows device; cleanup detaches listener',()=>{
 const env=environment({dark:true}),ui=createCave({root:env.root});assert.equal(env.root['data-theme'],'dark');ui.setTheme('black');env.setDark(false);assert.equal(env.root['data-theme'],'black');ui.setTheme('system');assert.equal(env.root['data-theme'],'light');env.setDark(true);assert.equal(env.root['data-theme'],'dark');ui.destroy();env.setDark(false);assert.equal(env.root['data-theme'],'dark');
});
test('storage is optional, invalid settings are rejected and blocked storage does not break switching',()=>{
 const env=environment({blocked:true,dark:true}),ui=createCave({root:env.root,storageKey:'appearance'});ui.setTheme('light');ui.setLocale('ar');assert.equal(env.root['data-theme'],'light');assert.equal(env.root.dir,'rtl');assert.throws(()=>ui.setLocale('fr'),RangeError);assert.throws(()=>ui.setTheme('invalid'),RangeError);assert.equal(ui.state.theme,'light');ui.destroy();
 const persisted=environment({saved:{theme:'black',locale:'ar',direction:'auto'}});const restored=createCave({root:persisted.root,storageKey:'appearance'});assert.equal(restored.state.resolvedTheme,'black');assert.equal(restored.state.resolvedDirection,'rtl');restored.destroy();
});
test('packages contain no runtime dependencies, proprietary fonts or product-specific components',async()=>{
 for(const name of ['tokens','core']){const pkg=JSON.parse(await readFile(new URL(`../packages/${name}/package.json`,import.meta.url)));assert.equal(pkg.license,'MIT');assert.deepEqual(pkg.dependencies??{},{});assert.deepEqual(pkg.peerDependencies??{},{});}
 const css=await readFile(new URL('../packages/core/dist/styles.css',import.meta.url),'utf8');assert.doesNotMatch(css,/cave-auth|cave-addon|cave-footer|cave-powered|url\(/);assert.match(css,/\.cave-switch/);assert.match(css,/inset-inline-start/);
 const data=await readFile(new URL('../packages/tokens/dist/tokens.json',import.meta.url),'utf8');assert.doesNotMatch(data,/Hero|BlueOcean|Blue Ocean/);
});
test('generated themes preserve semantic colour values and DTCG alpha precision',async()=>{
 const tokens=JSON.parse(await readFile(new URL('../packages/tokens/dist/tokens.json',import.meta.url)));assert.equal(tokens.themes.light['accent-strong'],'#047283');assert.equal(tokens.themes.black.surface,'#1d1d1b');
 const dtcg=JSON.parse(await readFile(new URL('../packages/tokens/dist/dtcg/dark.json',import.meta.url)));assert.equal(dtcg.color['surface-raised'].$value.alpha,.06);assert.equal(dtcg.dimension['space-3'].$value.value,16);
 const dart=await readFile(new URL('../packages/flutter/lib/src/tokens.dart',import.meta.url),'utf8');assert.match(dart,/surfaceRaised = Color\(0x0FFFFFFF\)/);
});
test('package generation is deterministic',async()=>{
 const paths=['packages/core/dist/styles.css','packages/tokens/dist/tokens.json','packages/flutter/lib/src/colors.dart'];const previous=await Promise.all(paths.map(p=>readFile(new URL('../'+p,import.meta.url),'utf8')));await buildPackages();assert.deepEqual(await Promise.all(paths.map(p=>readFile(new URL('../'+p,import.meta.url),'utf8'))),previous);
});

test('numeral preference persists independently of locale and direction',()=>{
 const env=environment(),ui=createCave({root:env.root,locale:'ar',numberingSystem:'latn',storageKey:'appearance'});
 assert.equal(ui.number(1234.5),new Intl.NumberFormat('ar',{numberingSystem:'latn'}).format(1234.5));
 ui.setDirection('ltr');ui.setNumberingSystem('arab');ui.setLocale('en');
 assert.equal(ui.state.resolvedDirection,'ltr');assert.equal(ui.state.resolvedNumberingSystem,'arab');assert.match(ui.number(1234.5),/[٠-٩]/);
 assert.throws(()=>ui.setNumberingSystem('invalid'),RangeError);
 ui.destroy();const restored=createCave({root:env.root,storageKey:'appearance'});assert.equal(restored.state.numberingSystem,'arab');restored.destroy();
});
