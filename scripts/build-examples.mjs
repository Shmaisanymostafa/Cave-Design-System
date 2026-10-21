import {mkdir,writeFile,cp} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {catalog,flutterExample} from '../source/catalog.mjs';
import {templates,flutterTemplate} from '../source/templates.mjs';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export async function buildExamples(){
 const dir=path.join(ROOT,'packages/flutter/example/lib');await mkdir(dir,{recursive:true});
 const imports=[],cases=[];
 for(const lang of ['en','ar'])for(const [index,c] of catalog.entries()){
  const name=`${c.slug.replaceAll('-','_')}_${lang}`;await writeFile(path.join(dir,name+'.dart'),flutterExample(c,lang));
  imports.push(`import '${name}.dart' as ${lang}_${index};`);cases.push(`'${c.name}_${lang}' => const ${lang}_${index}.${c.name}Example(),`);
 }
 for(const t of templates)for(const lang of ['en','ar'])await writeFile(path.join(dir,`${t.slug.replaceAll('-','_')}_${lang}.dart`),flutterTemplate(t,lang));
 for(const [index,t] of templates.entries()) {imports.push(`import '${t.slug.replaceAll('-','_')}_en.dart' as template_${index};`);cases.push(`'${t.name}_en' || '${t.name}_ar' => template_${index}.${t.name}(controller:controller),`);}
 await writeFile(path.join(dir,'main.dart'),`// Generated local documentation gallery. Not a separate product.
import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';
import 'package:cave_ui/cave_ui.dart';
${imports.join('\n')}
void main(){WidgetsFlutterBinding.ensureInitialized();SemanticsBinding.instance.ensureSemantics();runApp(const Gallery());}
class Gallery extends StatefulWidget {const Gallery({super.key});@override State<Gallery> createState()=>_GalleryState();}
class _GalleryState extends State<Gallery>{
 late final Map<String,String> params=Uri.base.queryParameters;
 late final CaveController controller=CaveController(locale:Locale(params['locale']=='ar'?'ar':'en'),themeMode:CaveThemeMode.values.firstWhere((m)=>m.name==params['theme'],orElse:()=>CaveThemeMode.light),direction:switch(params['direction']){'ltr'=>TextDirection.ltr,'rtl'=>TextDirection.rtl,_=>null},numberingSystem:CaveNumberingSystem.values.firstWhere((m)=>m.name==params['numerals'],orElse:()=>CaveNumberingSystem.auto));
 @override void dispose(){controller.dispose();super.dispose();}
 @override Widget build(BuildContext context)=>CaveApp(controller:controller,fontFamily:'Poppins',arabicFontFamily:'Almarai',home:Scaffold(body:SafeArea(child:SingleChildScrollView(padding:const EdgeInsetsDirectional.all(24),child:Builder(builder:(context){
 final ar=controller.locale.languageCode=='ar';final component=params['component']??'Button';
 if(component=='Button')return Align(alignment:AlignmentDirectional.centerStart,child:CaveButton(label:params['label']=='long'?(ar?'حفظ جميع التغييرات ومتابعة إعداد الحساب':'Save all changes and continue setting up your account'):(ar?'حفظ التغييرات':'Save changes'),variant:CaveButtonVariant.values.firstWhere((v)=>v.name==params['variant'],orElse:()=>CaveButtonVariant.primary),size:switch(params['size']){'sm'=>CaveButtonSize.small,'lg'=>CaveButtonSize.large,_=>CaveButtonSize.medium},loading:params['state']=='loading',onPressed:params['state']=='disabled'?null:(){ScaffoldMessenger.of(context).showSnackBar(SnackBar(content:Text(ar?'تم حفظ التغييرات':'Changes saved')));}));
 if(component=='TextField')return CaveTextField(label:ar?'البريد الإلكتروني':'Email',helperText:ar?'سنرسل التأكيد إلى هذا العنوان.':'We will send confirmation to this address.',keyboardType:TextInputType.emailAddress,textDirection:TextDirection.ltr,enabled:params['state']!='disabled',errorText:params['state']=='error'?(ar?'أدخل بريدًا إلكترونيًا صحيحًا.':'Enter a valid email address.'):null);
 return switch('\${component}_\${controller.locale.languageCode}'){
 ${cases.join('\n')}
 _=>Text(ar?'المثال غير موجود':'Example not found'),
 };
})))));
}
`);
 const fonts=path.join(ROOT,'packages/flutter/example/fonts');await mkdir(fonts,{recursive:true});
 for(const f of ['Poppins-Regular.ttf','Almarai-Regular.ttf','Almarai-Bold.ttf','poppins-OFL.txt','almarai-OFL.txt'])await cp(path.join(ROOT,'source/fonts',f),path.join(fonts,f));
 await writeFile(path.join(ROOT,'packages/flutter/example/pubspec.yaml'),`name: cave_ui_example\npublish_to: none\nenvironment:\n  sdk: '>=3.9.0 <4.0.0'\ndependencies:\n  flutter:\n    sdk: flutter\n  cave_ui:\n    path: ../\nflutter:\n  uses-material-design: true\n  fonts:\n    - family: Poppins\n      fonts:\n        - asset: fonts/Poppins-Regular.ttf\n    - family: Almarai\n      fonts:\n        - asset: fonts/Almarai-Regular.ttf\n        - asset: fonts/Almarai-Bold.ttf\n          weight: 700\n`);
 const web=path.join(ROOT,'packages/flutter/example/web');await mkdir(web,{recursive:true});
 await cp(path.join(ROOT,'source/fonts/flutter-fallback'),path.join(web,'font-fallback'),{recursive:true});
 await writeFile(path.join(web,'flutter_bootstrap.js'),`{{flutter_js}}\n{{flutter_build_config}}\n_flutter.loader.load({onEntrypointLoaded:async(engineInitializer)=>{const appRunner=await engineInitializer.initializeEngine({fontFallbackBaseUrl:new URL('font-fallback/',document.baseURI).href});await appRunner.runApp();parent.postMessage({type:'cave:flutter-ready'},location.origin);}});`);
 await writeFile(path.join(web,'index.html'),`<!doctype html><html><head><base href="$FLUTTER_BASE_HREF"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Cave UI · Flutter preview</title><script>const p=new URLSearchParams(location.search);document.documentElement.lang=p.get('locale')==='ar'?'ar':'en';document.documentElement.dir='ltr';/* Flutter owns layout direction; the engine host stays LTR for semantics coordinates. */</script></head><body><script src="flutter_bootstrap.js" async></script></body></html>`);
}
if(process.argv[1]===fileURLToPath(import.meta.url))await buildExamples();
