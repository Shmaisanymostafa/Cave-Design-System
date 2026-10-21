// Runnable, product-neutral templates. All data and submissions stay in the demo.
const pair=(en,ar)=>({en,ar});
export const templates=[
 {name:'SettingsTemplate',slug:'settings',title:pair('Account settings','إعدادات الحساب'),lead:pair('One locale setting updates labels, direction and formatting.','إعداد لغة واحد يحدّث النصوص والاتجاه والتنسيق.'),example:settings},
 {name:'DashboardTemplate',slug:'dashboard',title:pair('Orders dashboard','لوحة الطلبات'),lead:pair('Responsive summaries, mixed-script records and a working search.','ملخصات متجاوبة وسجلات بنصوص مختلطة وبحث تفاعلي.'),example:dashboard},
 {name:'SignInTemplate',slug:'sign-in',title:pair('Sign-in form','نموذج تسجيل الدخول'),lead:pair('Accessible validation and password visibility with a demo-only submit.','تحقق واضح وإظهار كلمة المرور وإرسال تجريبي فقط.'),example:signIn},
];
const strings={
 en:{title:'Account settings',intro:'Choose how this demo looks and reads.',language:'Language',direction:'Reading direction',numerals:'Digits',theme:'Theme',auto:'Automatic',ltr:'Left to right',rtl:'Right to left',latn:'Latin · 0123',arab:'Arabic · ٠١٢٣',system:'System',light:'Light',dark:'Dark',black:'Black',contact:'Contact details',name:'Name',email:'Email',phone:'Phone',summary:'Formatting preview',amount:'Amount (USD)',date:'Date',notice:'Changes apply immediately in this demo. Your application owns its translations and saved preferences.'},
 ar:{title:'إعدادات الحساب',intro:'اختر مظهر هذا المثال ولغته.',language:'اللغة',direction:'اتجاه القراءة',numerals:'الأرقام',theme:'المظهر',auto:'تلقائي',ltr:'من اليسار إلى اليمين',rtl:'من اليمين إلى اليسار',latn:'لاتينية · 0123',arab:'عربية · ٠١٢٣',system:'النظام',light:'فاتح',dark:'داكن',black:'أسود',contact:'بيانات التواصل',name:'الاسم',email:'البريد الإلكتروني',phone:'الهاتف',summary:'معاينة التنسيق',amount:'المبلغ (USD)',date:'التاريخ',notice:'تُطبّق التغييرات فورًا في هذا المثال. يتولى تطبيقك ترجمة محتواه وحفظ تفضيلاته.'}
};
function settings(lang){const t=strings[lang];const field=(id,options)=>`<label class="cave-field"><span data-msg="${id}">${t[id]}</span><select class="cave-input" id="setting-${id}">${options.map(([value,key])=>`<option value="${value}"${id==='language'&&value===lang?' selected':''}${t[key]?` data-msg="${key}"`:''}>${t[key]||key}</option>`).join('')}</select></label>`;
 return {html:`<main class="cave-template"><header><h1 data-msg="title">${t.title}</h1><p data-msg="intro">${t.intro}</p></header>
<section class="cave-card cave-template-grid" data-label-msg="title" aria-label="${t.title}">
${field('language',[['en','English'],['ar','العربية']])}${field('direction',[['auto','auto'],['ltr','ltr'],['rtl','rtl']])}${field('numerals',[['auto','auto'],['latn','latn'],['arab','arab']])}${field('theme',[['system','system'],['light','light'],['dark','dark'],['black','black']])}</section>
<section class="cave-card"><h2 data-msg="contact">${t.contact}</h2><div class="cave-template-grid"><label class="cave-field"><span data-msg="name">${t.name}</span><input class="cave-input" autocomplete="name" dir="auto" value="ليلى Haddad"></label><label class="cave-field"><span data-msg="email">${t.email}</span><input class="cave-input cave-ltr" dir="ltr" type="email" autocomplete="email" value="layla@example.com"></label><label class="cave-field"><span data-msg="phone">${t.phone}</span><input class="cave-input cave-ltr" dir="ltr" type="tel" autocomplete="tel" value="+961 1 234 567"></label></div></section>
<section class="cave-card" aria-live="polite"><h2 data-msg="summary">${t.summary}</h2><p><span data-msg="amount">${t.amount}</span>: <bdi id="formatted-number"></bdi></p><p><span data-msg="date">${t.date}</span>: <bdi id="formatted-date"></bdi></p></section><p class="cave-help" data-msg="notice">${t.notice}</p></main>`,
 js:`import {createCave} from '@cave-ui/core';
const translations=${JSON.stringify(strings,null,2)};
const params=new URLSearchParams(location.search);
const ui=createCave({locale:'${lang}',theme:['light','dark','black'].includes(params.get('theme'))?params.get('theme'):'system',direction:['ltr','rtl'].includes(params.get('direction'))?params.get('direction'):'auto',numberingSystem:['latn','arab'].includes(params.get('numerals'))?params.get('numerals'):'auto'});
function render(){
 const language=ui.state.locale.startsWith('ar')?'ar':'en';
 document.querySelectorAll('[data-msg]').forEach(node=>{node.textContent=translations[language][node.dataset.msg];});
 document.querySelectorAll('[data-label-msg]').forEach(node=>node.setAttribute('aria-label',translations[language][node.dataset.labelMsg]));
 document.querySelector('#setting-language').value=language;
 document.querySelector('#setting-direction').value=ui.state.direction;
 document.querySelector('#setting-numerals').value=ui.state.numberingSystem;
 document.querySelector('#setting-theme').value=ui.state.theme;
 document.querySelector('#formatted-number').textContent=ui.number(12345.67,{style:'currency',currency:'USD'});
 document.querySelector('#formatted-date').textContent=ui.date(new Date(2026,9,19),{dateStyle:'long'});
}
document.documentElement.addEventListener('cave:change',render);
document.querySelector('#setting-language').addEventListener('change',event=>ui.setLocale(event.target.value));
document.querySelector('#setting-direction').addEventListener('change',event=>ui.setDirection(event.target.value));
document.querySelector('#setting-numerals').addEventListener('change',event=>ui.setNumberingSystem(event.target.value));
document.querySelector('#setting-theme').addEventListener('change',event=>ui.setTheme(event.target.value));
render();`,
 dart:`Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
 Text(ar ? 'إعدادات الحساب' : 'Account settings', style: Theme.of(context).textTheme.headlineSmall),
 const SizedBox(height: 16),
 DropdownButtonFormField<String>(isExpanded:true,isDense:false,itemHeight:null,initialValue: controller.locale.languageCode, decoration: InputDecoration(labelText: ar ? 'اللغة' : 'Language'), items: const [DropdownMenuItem(value:'en',child:Text('English')),DropdownMenuItem(value:'ar',child:Text('العربية'))], onChanged:(value)=>controller.setLocale(Locale(value!))),
 const SizedBox(height: 16),
 DropdownButtonFormField<TextDirection?>(isExpanded:true,isDense:false,itemHeight:null,initialValue: direction, decoration: InputDecoration(labelText:ar?'اتجاه القراءة':'Reading direction'), items:[DropdownMenuItem<TextDirection?>(value:null,child:Text(ar?'تلقائي':'Automatic')),const DropdownMenuItem(value:TextDirection.ltr,child:Text('LTR')),const DropdownMenuItem(value:TextDirection.rtl,child:Text('RTL'))],onChanged:(value){setState(()=>direction=value);controller.setDirection(value);}),
 const SizedBox(height: 16),
 DropdownButtonFormField<CaveNumberingSystem>(isExpanded:true,isDense:false,itemHeight:null,initialValue:controller.numberingSystem,decoration:InputDecoration(labelText:ar?'الأرقام':'Digits'),items:[DropdownMenuItem(value:CaveNumberingSystem.auto,child:Text(ar?'تلقائي':'Automatic')),const DropdownMenuItem(value:CaveNumberingSystem.latn,child:Text('0123456789')),const DropdownMenuItem(value:CaveNumberingSystem.arab,child:Text('٠١٢٣٤٥٦٧٨٩'))],onChanged:(value)=>controller.setNumberingSystem(value!)),
 const SizedBox(height: 16),
 DropdownButtonFormField<CaveThemeMode>(isExpanded:true,isDense:false,itemHeight:null,initialValue:controller.themeMode,decoration:InputDecoration(labelText:ar?'المظهر':'Theme'),items:[for(final mode in CaveThemeMode.values) DropdownMenuItem(value:mode,child:Text(ar?['النظام','فاتح','داكن','أسود'][mode.index]:['System','Light','Dark','Black'][mode.index]))],onChanged:(value)=>controller.setTheme(value!)),
 const SizedBox(height: 24),
 CaveTextField(label:ar?'البريد الإلكتروني':'Email',keyboardType:TextInputType.emailAddress,textDirection:TextDirection.ltr,helperText:'layla@example.com'),
 const SizedBox(height: 16),CaveTextField(label:ar?'الهاتف':'Phone',keyboardType:TextInputType.phone,textDirection:TextDirection.ltr,helperText:'+961 1 234 567'),
 const SizedBox(height: 24),CaveCard(child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[Text(ar?'معاينة التنسيق':'Formatting preview'),Text('\u2068USD \${controller.number(12345.67,fractionDigits:2)}\u2069'),Text(controller.date(context,DateTime(2026,10,19)))])),
 const SizedBox(height:16),Text(ar?'هذا مثال محلي. يتولى تطبيقك حفظ التفضيلات وترجمة محتواه.':'This is a local demo. Your application owns preference storage and content translations.')
])`,state:'TextDirection? direction;'};
}
function dashboard(lang){const ar=lang==='ar';return {html:`<main class="cave-template"><header><h1>${ar?'الطلبات':'Orders'}</h1><p>${ar?'بيانات تجريبية للتصفية والمراجعة.':'Sample data for filtering and review.'}</p></header><section class="cave-template-grid"><article class="cave-card"><h2>\${ar?'الإيرادات':'Revenue'}</h2><bdi id="dashboard-revenue"></bdi></article><article class="cave-card"><h2>${ar?'الطلبات النشطة':'Active orders'}</h2><bdi id="dashboard-count"></bdi></article></section><label class="cave-field"><span>${ar?'البحث بالاسم أو رقم الطلب':'Search by name or order ID'}</span><input id="order-search" class="cave-input" type="search" dir="auto"></label><div class="cave-table-card"><div class="cave-table-scroll" tabindex="0" role="region" aria-label="${ar?'جدول الطلبات':'Orders table'}"><table class="cave-table"><caption>${ar?'الطلبات الأخيرة':'Recent orders'}</caption><thead><tr><th scope="col">${ar?'الطلب':'Order'}</th><th scope="col">${ar?'العميل':'Customer'}</th><th scope="col">${ar?'الحالة':'Status'}</th></tr></thead><tbody>${[['1042','ليلى Haddad'],['1043','Omar حسن'],['1044','Maya Ali']].map(([id,name])=>`<tr data-order><th scope="row"><bdi dir="ltr">#${id}</bdi></th><td><bdi>${name}</bdi></td><td>${ar?'جاهز':'Ready'}</td></tr>`).join('')}</tbody></table></div></div><p id="search-status" role="status"></p></main>`,js:`document.querySelector('#dashboard-revenue').textContent=ui.number(12345.67,{style:'currency',currency:'USD'});
document.querySelector('#dashboard-count').textContent=ui.number(3);
const rows=[...document.querySelectorAll('[data-order]')];
document.querySelector('#order-search').addEventListener('input',event=>{
 const query=event.target.value.trim().toLocaleLowerCase('${lang}');
 rows.forEach(row=>{row.hidden=!row.textContent.toLocaleLowerCase('${lang}').includes(query);});
 const count=rows.filter(row=>!row.hidden).length;
 document.querySelector('#search-status').textContent=count ? '${ar?'نتائج البحث: ':'Matching orders: '}'+ui.number(count) : '${ar?'لا توجد نتائج. جرّب اسمًا آخر.':'No matching orders. Try another name.'}';
});`,state:"String query = '';",dart:`Column(crossAxisAlignment:CrossAxisAlignment.stretch,children:[Text(ar?'الطلبات':'Orders',style:Theme.of(context).textTheme.headlineSmall),const SizedBox(height:16),CaveCard(child:Text('\${ar?'الإيرادات':'Revenue'}: \u2068USD \${controller.number(12345.67,fractionDigits:2)}\u2069')),const SizedBox(height:16),CaveTextField(label:ar?'البحث بالاسم أو رقم الطلب':'Search by name or order ID',onChanged:(value)=>setState(()=>query=value.toLowerCase())),const SizedBox(height:16),for(final record in ['#1042 · ليلى Haddad','#1043 · Omar حسن','#1044 · Maya Ali'].where((row)=>row.toLowerCase().contains(query))) Padding(padding:const EdgeInsetsDirectional.only(bottom:12),child:CaveCard(child:Text(record))),if(!['#1042 · ليلى Haddad','#1043 · Omar حسن','#1044 · Maya Ali'].any((row)=>row.toLowerCase().contains(query))) Text(ar?'لا توجد نتائج. جرّب اسمًا آخر.':'No matching orders. Try another name.')])`};}
function signIn(lang){const ar=lang==='ar';return {html:`<main class="cave-template cave-template--auth"><h1>${ar?'تسجيل الدخول':'Sign in'}</h1><p>${ar?'مثال للواجهة فقط. لا تُرسل بياناتك إلى أي خادم.':'Interface demo. Your details are never sent to a server.'}</p><form id="sign-in" class="cave-card" novalidate><div class="cave-field"><label for="signin-email">${ar?'البريد الإلكتروني':'Email'}</label><input id="signin-email" class="cave-input cave-ltr" dir="ltr" type="email" autocomplete="username" required aria-describedby="email-error"><span id="email-error" class="cave-error"></span></div><div class="cave-field"><label for="signin-password">${ar?'كلمة المرور':'Password'}</label><input id="signin-password" class="cave-input" type="password" autocomplete="current-password" required aria-describedby="password-error"><span id="password-error" class="cave-error"></span></div><button type="button" class="cave-btn cave-btn--secondary" id="show-password" aria-pressed="false">${ar?'إظهار كلمة المرور':'Show password'}</button><button class="cave-btn cave-btn--primary" type="submit">${ar?'تجربة تسجيل الدخول':'Try sign-in'}</button><p id="signin-status" role="status"></p></form></main>`,js:`const form=document.querySelector('#sign-in'),email=document.querySelector('#signin-email'),password=document.querySelector('#signin-password');
document.querySelector('#show-password').addEventListener('click',event=>{const show=password.type==='password';password.type=show?'text':'password';event.currentTarget.setAttribute('aria-pressed',String(show));});
form.addEventListener('submit',event=>{
 event.preventDefault();let first;
 for(const [input,id,message] of [[email,'email-error','${ar?'أدخل بريدًا إلكترونيًا صحيحًا.':'Enter a valid email address.'}'],[password,'password-error','${ar?'أدخل كلمة المرور.':'Enter your password.'}']]){
  const valid=input.validity.valid;input.setAttribute('aria-invalid',String(!valid));document.getElementById(id).textContent=valid?'':message;if(!valid&&!first)first=input;
 }
 document.querySelector('#signin-status').textContent=first?'${ar?'راجع الحقول المحددة.':'Review the highlighted fields.'}':'${ar?'اكتمل المثال. لم يتم تسجيل الدخول أو إرسال أي بيانات.':'Demo complete. No authentication or data transmission occurred.'}';
 first?.focus();
});`,state:'final form = GlobalKey<FormState>();\n  bool visible = false;\n  bool submitted = false;',dart:`Form(key:form,child:Column(crossAxisAlignment:CrossAxisAlignment.stretch,children:[Text(ar?'تسجيل الدخول':'Sign in',style:Theme.of(context).textTheme.headlineSmall),const SizedBox(height:16),Text(ar?'مثال للواجهة فقط. لا تُرسل بياناتك إلى أي خادم.':'Interface demo. Your details are never sent to a server.'),const SizedBox(height:16),CaveTextField(label:ar?'البريد الإلكتروني':'Email',keyboardType:TextInputType.emailAddress,textDirection:TextDirection.ltr,validator:(value)=>RegExp(r'^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$').hasMatch(value??'')?null:(ar?'أدخل بريدًا إلكترونيًا صحيحًا.':'Enter a valid email address.')),const SizedBox(height:16),CaveTextField(label:ar?'كلمة المرور':'Password',obscureText:!visible,validator:(value)=>(value??'').isNotEmpty?null:(ar?'أدخل كلمة المرور.':'Enter your password.')),CaveSwitch(label:ar?'إظهار كلمة المرور':'Show password',value:visible,onChanged:(value)=>setState(()=>visible=value)),CaveButton(label:ar?'تجربة تسجيل الدخول':'Try sign-in',onPressed:(){if(form.currentState!.validate())setState(()=>submitted=true);}),if(submitted) Semantics(liveRegion:true,child:Text(ar?'اكتمل المثال. لم يتم تسجيل الدخول أو إرسال أي بيانات.':'Demo complete. No authentication or data transmission occurred.'))]))`};}
export function flutterTemplate(template,lang){const sample=template.example(lang);return `import 'package:flutter/material.dart';
import 'package:cave_ui/cave_ui.dart';
void main(){final controller=CaveController(locale:const Locale('${lang}'));runApp(CaveApp(controller:controller,home:Scaffold(body:SafeArea(child:SingleChildScrollView(padding:const EdgeInsetsDirectional.all(24),child:${template.name}(controller:controller))))));}
class ${template.name} extends StatefulWidget{
 final CaveController controller;
 const ${template.name}({super.key,required this.controller});
 @override State<${template.name}> createState()=>_${template.name}State();
}
class _${template.name}State extends State<${template.name}>{
 ${sample.state||''}
 CaveController get controller=>widget.controller;
 @override Widget build(BuildContext context)=>ListenableBuilder(listenable:controller,builder:(context,child){final ar=controller.locale.languageCode=='ar';return ${sample.dart};});
}
`.replaceAll(String.fromCharCode(8296),String.fromCharCode(92)+'u2068').replaceAll(String.fromCharCode(8297),String.fromCharCode(92)+'u2069');}
