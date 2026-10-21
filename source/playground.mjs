// Shared by documentation, runnable web previews and code generation.
import {flutterExample} from './catalog.mjs';
export function playgroundState(input={}) {
 const read=key=>input instanceof URLSearchParams?input.get(key):input[key];
 const choice=(key,values,fallback)=>values.includes(read(key))?read(key):fallback;
 return {locale:choice('locale',['en','ar'],'en'),theme:choice('theme',['light','dark','black'],'light'),direction:choice('direction',['auto','ltr','rtl'],'auto'),numerals:choice('numerals',['auto','latn','arab'],'auto'),variant:choice('variant',['primary','secondary','tertiary','danger'],'primary'),size:choice('size',['sm','md','lg'],'md'),state:choice('state',['default','disabled','loading','error'],'default'),label:choice('label',['normal','long'],'normal')};
}
export function configuredSample(component,language,input={}) {
 const config=playgroundState({...input,locale:language}),sample={...component.example(language)},ar=language==='ar';
 if(component.name==='Button'){
  const label=config.label==='long'?(ar?'حفظ جميع التغييرات ومتابعة إعداد الحساب':'Save all changes and continue setting up your account'):(ar?'حفظ التغييرات':'Save changes');
  const loading=config.state==='loading',disabled=loading||config.state==='disabled';
  sample.html=`<button class="cave-btn cave-btn--${config.variant} cave-btn--${config.size}" id="save"${disabled?' disabled':''}${loading?' aria-busy="true"':''}>${loading?'<span class="cave-spinner" aria-hidden="true"></span>':''}${label}</button>\n<p id="result" role="status"></p>`;
  sample.dart=`CaveButton(label: '${label}', variant: CaveButtonVariant.${config.variant}, size: CaveButtonSize.${{sm:'small',md:'medium',lg:'large'}[config.size]}, loading: ${loading}, onPressed: ${disabled?'null':`() {ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('${ar?'تم حفظ التغييرات':'Changes saved'}')));}`})`;
 }
 if(component.name==='TextField'){
  if(config.state==='disabled'){sample.html=sample.html.replace('<input ','<input disabled ');sample.dart=sample.dart.replace('CaveTextField(', 'CaveTextField(enabled: false, ');}
  if(config.state==='error') {const error=ar?'أدخل بريدًا إلكترونيًا صحيحًا.':'Enter a valid email address.';sample.html=sample.html.replace('<input ','<input aria-invalid="true" ').replace('aria-describedby="email-help"','aria-describedby="email-help email-error"').replace('</div>',`  <span class="cave-error" id="email-error">${error}</span>\n</div>`);sample.dart=sample.dart.replace('CaveTextField(',`CaveTextField(errorText: '${error}', `);}
 }
 return sample;
}
export function configuredCode(component,language,input={}) {
 const config=playgroundState({...input,locale:language}),sample=configuredSample(component,language,config);
 const bootstrap=`import { createCave } from '@cave-ui/core';\nconst ui = createCave({ locale: '${language}', theme: '${config.theme}', direction: '${config.direction}', numberingSystem: '${config.numerals}' });`;
 const js=component.name==='SettingsTemplate'?sample.js:bootstrap+'\n\n'+(sample.js||'');
 const dart=flutterExample({...component,example:()=>sample},language).replace(`locale: const Locale('${language}')`,`locale: const Locale('${language}'), themeMode: CaveThemeMode.${config.theme}, numberingSystem: CaveNumberingSystem.${config.numerals}${config.direction==='auto'?'':`, direction: TextDirection.${config.direction}`}`);
 return {...sample,js,dart};
}
