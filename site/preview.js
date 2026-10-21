import {catalog} from './catalog.mjs';
import {templates} from './templates.mjs';
import {configuredCode,playgroundState} from './playground.mjs';
const component=[...catalog,...templates].find(item=>item.name===document.body.dataset.component);
const config=playgroundState(new URLSearchParams(location.search));
const lang=document.documentElement.lang;
const sample=configuredCode(component,lang,config);
const root=document.querySelector('#sample');
root.innerHTML=sample.html;
const script=sample.js.replaceAll("'@cave-ui/core'",JSON.stringify(new URL('./core/index.js',import.meta.url).href));
const url=URL.createObjectURL(new Blob([script],{type:'text/javascript'}));
try {
 await import(url);
 document.body.inert=false;document.body.dataset.ready='true';document.body.removeAttribute('aria-busy');
 const report=()=>parent.postMessage({type:'cave:preview-size',height:Math.ceil(document.body.getBoundingClientRect().height)},location.origin);
 new ResizeObserver(report).observe(document.body);report();
} catch {
 document.body.inert=false;document.body.removeAttribute('aria-busy');
 root.textContent=lang==='ar'?'تعذر تحميل المثال. أعد تحميل الصفحة.':'The example could not load. Reload the page.';
} finally {URL.revokeObjectURL(url);}
