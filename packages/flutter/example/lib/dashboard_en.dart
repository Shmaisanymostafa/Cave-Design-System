import 'package:flutter/material.dart';
import 'package:cave_ui/cave_ui.dart';
void main(){final controller=CaveController(locale:const Locale('en'));runApp(CaveApp(controller:controller,home:Scaffold(body:SafeArea(child:SingleChildScrollView(padding:const EdgeInsetsDirectional.all(24),child:DashboardTemplate(controller:controller))))));}
class DashboardTemplate extends StatefulWidget{
 final CaveController controller;
 const DashboardTemplate({super.key,required this.controller});
 @override State<DashboardTemplate> createState()=>_DashboardTemplateState();
}
class _DashboardTemplateState extends State<DashboardTemplate>{
 String query = '';
 CaveController get controller=>widget.controller;
 @override Widget build(BuildContext context)=>ListenableBuilder(listenable:controller,builder:(context,child){final ar=controller.locale.languageCode=='ar';return Column(crossAxisAlignment:CrossAxisAlignment.stretch,children:[Text(ar?'الطلبات':'Orders',style:Theme.of(context).textTheme.headlineSmall),const SizedBox(height:16),CaveCard(child:Text('${ar?'الإيرادات':'Revenue'}: \u2068USD ${controller.number(12345.67,fractionDigits:2)}\u2069')),const SizedBox(height:16),CaveTextField(label:ar?'البحث بالاسم أو رقم الطلب':'Search by name or order ID',onChanged:(value)=>setState(()=>query=value.toLowerCase())),const SizedBox(height:16),for(final record in ['#1042 · ليلى Haddad','#1043 · Omar حسن','#1044 · Maya Ali'].where((row)=>row.toLowerCase().contains(query))) Padding(padding:const EdgeInsetsDirectional.only(bottom:12),child:CaveCard(child:Text(record))),if(!['#1042 · ليلى Haddad','#1043 · Omar حسن','#1044 · Maya Ali'].any((row)=>row.toLowerCase().contains(query))) Text(ar?'لا توجد نتائج. جرّب اسمًا آخر.':'No matching orders. Try another name.')]);});
}
