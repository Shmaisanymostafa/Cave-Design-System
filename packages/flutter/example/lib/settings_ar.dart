import 'package:flutter/material.dart';
import 'package:cave_ui/cave_ui.dart';
void main(){final controller=CaveController(locale:const Locale('ar'));runApp(CaveApp(controller:controller,home:Scaffold(body:SafeArea(child:SingleChildScrollView(padding:const EdgeInsetsDirectional.all(24),child:SettingsTemplate(controller:controller))))));}
class SettingsTemplate extends StatefulWidget{
 final CaveController controller;
 const SettingsTemplate({super.key,required this.controller});
 @override State<SettingsTemplate> createState()=>_SettingsTemplateState();
}
class _SettingsTemplateState extends State<SettingsTemplate>{
 TextDirection? direction;
 CaveController get controller=>widget.controller;
 @override Widget build(BuildContext context)=>ListenableBuilder(listenable:controller,builder:(context,child){final ar=controller.locale.languageCode=='ar';return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
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
 const SizedBox(height: 24),CaveCard(child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[Text(ar?'معاينة التنسيق':'Formatting preview'),Text('\u2068USD ${controller.number(12345.67,fractionDigits:2)}\u2069'),Text(controller.date(context,DateTime(2026,10,19)))])),
 const SizedBox(height:16),Text(ar?'هذا مثال محلي. يتولى تطبيقك حفظ التفضيلات وترجمة محتواه.':'This is a local demo. Your application owns preference storage and content translations.')
]);});
}
