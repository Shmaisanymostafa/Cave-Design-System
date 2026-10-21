import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:cave_ui/cave_ui.dart';

void main() {
 test('locale derives direction and built-in messages with an optional direction override',(){
  final controller=CaveController();var changes=0;controller.addListener(()=>changes++);
  controller.setLocale(const Locale('ar','LB'));
  expect(controller.direction,TextDirection.rtl);expect(controller.text('cancel'),'إلغاء');expect(changes,1);
  controller.setDirection(TextDirection.ltr);expect(controller.direction,TextDirection.ltr);
  controller.setDirection(null);expect(controller.direction,TextDirection.rtl);
  expect(()=>controller.setLocale(const Locale('fr')),throwsArgumentError);
  controller.dispose();
 });
 testWidgets('locale and explicit theme update the whole app', (tester) async {
  final controller=CaveController();
  await tester.pumpWidget(CaveApp(controller:controller,home:const Scaffold(body:Text('content'))));
  controller.setLocale(const Locale('ar'));controller.setTheme(CaveThemeMode.black);await tester.pumpAndSettle();
  final context=tester.element(find.text('content'));
  expect(Directionality.of(context),TextDirection.rtl);expect(Localizations.localeOf(context).languageCode,'ar');
  expect(Theme.of(context).colorScheme.surface,CaveBlackColors.surface);
  await tester.pumpWidget(const SizedBox());controller.dispose();
 });
 testWidgets('checkbox, switch and radio labels update host state', (tester) async {
  bool checked=false,enabled=false;String? choice='one';
  await tester.pumpWidget(MaterialApp(theme:CaveTheme.light(),home:Scaffold(body:StatefulBuilder(builder:(context,setState)=>Column(children:[
   CaveCheckbox(label:'Receive a copy',value:checked,onChanged:(value)=>setState(()=>checked=value!)),
   CaveSwitch(label:'Notifications',value:enabled,onChanged:(value)=>setState(()=>enabled=value)),
   CaveRadioGroup<String>(value:choice,options:const {'one':'First','two':'Second'},onChanged:(value)=>setState(()=>choice=value)),
  ])))));
  await tester.tap(find.text('Receive a copy'));await tester.pumpAndSettle();expect(checked,true);
  await tester.tap(find.text('Notifications'));await tester.pumpAndSettle();expect(enabled,true);
  await tester.tap(find.text('Second'));await tester.pumpAndSettle();expect(choice,'two');
 });
 testWidgets('loading and disabled buttons cannot invoke actions', (tester) async {
  var calls=0;await tester.pumpWidget(MaterialApp(theme:CaveTheme.light(),home:Scaffold(body:Column(children:[
   CaveButton(label:'Busy',loading:true,onPressed:()=>calls++),const CaveButton(label:'Disabled')]))));
  await tester.tap(find.text('Busy'));await tester.tap(find.text('Disabled'));expect(calls,0);
 });
}
