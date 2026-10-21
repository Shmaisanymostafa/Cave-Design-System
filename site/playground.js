import {catalog} from './catalog.mjs';
import {templates,flutterTemplate} from './templates.mjs';
import {configuredCode,playgroundState} from './playground.mjs';
const area=document.querySelector('[data-playground]'),ar=document.documentElement.lang==='ar';
const component=[...catalog,...templates].find(item=>item.name===area.dataset.playground);
const keys=['locale','theme','direction','numerals','variant','size','state','label'];
const controls=Object.fromEntries(keys.map(key=>[key,document.querySelector('#preview-'+(key==='locale'?'language':key))]));
let flutterLoaded=false;
function fromUrl(){const params=new URLSearchParams(location.search);if(!params.has('locale'))params.set('locale',document.documentElement.lang);if(!params.has('theme'))params.set('theme',document.documentElement.dataset.theme);return playgroundState(params);}
let config=fromUrl();
function update(writeUrl=false){
 for(const [key,control] of Object.entries(controls))if(control)control.value=config[key];
 const query=new URLSearchParams(config);
 const url=`/previews/${config.locale}/${component.name}.html?${query}`;
 const frame=area.querySelector('iframe.preview');if(frame.getAttribute('src')!==url)frame.src=url;
 area.querySelector('.preview-open').href=url;
 const sample=configuredCode(component,config.locale,config);
 document.querySelector('[data-code="html"]').textContent=`<!-- Import @cave-ui/core/tokens.css and @cave-ui/core/styles.css in your app. -->\n${sample.html}`;
 document.querySelector('[data-code="javascript"]').textContent=sample.js;
 document.querySelector('[data-code="dart"]').textContent=area.dataset.template?flutterTemplate(component,config.locale).replace(`locale:const Locale('${config.locale}')`,`locale:const Locale('${config.locale}'),themeMode:CaveThemeMode.${config.theme},numberingSystem:CaveNumberingSystem.${config.numerals}${config.direction==='auto'?'':`,direction:TextDirection.${config.direction}`}`):sample.dart;
 if(writeUrl){const url=new URL(location.href);for(const [key,value] of Object.entries(config))url.searchParams.set(key,value);history.replaceState(null,'',url);}
 const languageLink=document.querySelector('a.lang');languageLink.search=location.search;languageLink.hash=location.hash;
 if(flutterLoaded){const native=area.querySelector('iframe.flutter-preview');const next=`/flutter-preview/?component=${component.name}&${query}`;if(native.getAttribute('src')!==next)native.src=next;}
}
for(const [key,control] of Object.entries(controls))if(control){control.disabled=false;control.addEventListener('change',()=>{config=playgroundState({...config,[key]:control.value});update(true);});}
document.querySelector('#load-flutter').addEventListener('click',async event=>{
 const button=event.currentTarget,status=document.querySelector('#flutter-status');button.disabled=true;status.textContent=ar?'جارٍ تحميل Flutter…':'Loading Flutter…';
 try{const response=await fetch('/flutter-preview/index.html',{method:'HEAD'});if(!response.ok)throw Error('Missing build');
 const frame=document.createElement('iframe');frame.className='flutter-preview';frame.title=ar?'معاينة Flutter الفعلية':'Actual Flutter preview';frame.height=area.dataset.template?'900':'500';document.querySelector('#flutter-preview').replaceChildren(frame);flutterLoaded=true;update();
 const ready=event=>{if(event.origin===location.origin&&event.source===frame.contentWindow&&event.data?.type==='cave:flutter-ready'){status.textContent=ar?'يمكنك التفاعل مع مثال Flutter أدناه.':'Interact with the Flutter example below.';}};window.addEventListener('message',ready);
 button.hidden=true;
 }catch{button.disabled=false;status.textContent=ar?'معاينة Flutter غير متاحة في هذا البناء. الشيفرة متاحة أدناه.':'Flutter preview is unavailable in this build. Source is available below.';}
});
document.querySelector('#reset-playground').addEventListener('click',()=>{config=playgroundState({locale:document.documentElement.lang,theme:document.documentElement.dataset.theme});update(true);});
document.querySelector('#share-playground').addEventListener('click',async()=>{update(true);const status=document.querySelector('#playground-status');try{await navigator.clipboard.writeText(location.href);status.textContent=ar?'تم نسخ الرابط':'Link copied';}catch{status.textContent=ar?'انسخ الرابط من شريط العنوان.':'Copy the link from your address bar.';}});
window.addEventListener('popstate',()=>{config=fromUrl();update();});
document.addEventListener('cave:docs-theme',()=>{config={...config,theme:document.documentElement.dataset.theme};update(true);});
document.addEventListener('cave:docs-platform',()=>update());
for(const id of ['load-flutter','reset-playground','share-playground'])document.getElementById(id).disabled=false;
update();area.dataset.ready='true';
