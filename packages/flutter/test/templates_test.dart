import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:cave_ui/cave_ui.dart';
import '../example/lib/settings_en.dart';
import '../example/lib/dashboard_en.dart';
import '../example/lib/sign_in_en.dart';
void main(){
 test('digits, grouping and explicit preference survive a locale change',(){
  final controller=CaveController(locale:const Locale('ar'));
  expect(controller.number(12345.67,fractionDigits:2),'١٢٬٣٤٥٫٦٧');
  controller.setNumberingSystem(CaveNumberingSystem.latn);expect(controller.number(-1234.5,fractionDigits:2),'−1,234.50');
  controller.setLocale(const Locale('en'));expect(controller.numberingSystem,CaveNumberingSystem.latn);
  controller.setNumberingSystem(CaveNumberingSystem.arab);expect(controller.digits('19/10/2026'),'١٩/١٠/٢٠٢٦');
  expect(()=>controller.number(double.infinity),throwsArgumentError);controller.dispose();
 });
 for(final lang in ['en','ar'])for(final scale in [1.0,2.0])for(final mode in [CaveThemeMode.light,CaveThemeMode.dark,CaveThemeMode.black]){
  for(final template in ['settings','dashboard','sign-in']){
   testWidgets('$template $lang $mode at 320px and text scale $scale',(tester)async{
    tester.view.physicalSize=const Size(320,900);tester.view.devicePixelRatio=1;
    tester.platformDispatcher.textScaleFactorTestValue=scale;
    addTearDown(tester.view.resetPhysicalSize);addTearDown(tester.view.resetDevicePixelRatio);addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);
    final controller=CaveController(locale:Locale(lang),themeMode:mode);
    final child=switch(template){'settings'=>SettingsTemplate(controller:controller),'dashboard'=>DashboardTemplate(controller:controller),_=>SignInTemplate(controller:controller)};
    await tester.pumpWidget(CaveApp(controller:controller,home:Scaffold(body:SingleChildScrollView(padding:const EdgeInsetsDirectional.all(16),child:child))));await tester.pumpAndSettle();expect(tester.takeException(),isNull);
    await tester.pumpWidget(const SizedBox());controller.dispose();
   });
  }
 }
 testWidgets('settings updates application labels and semantics with one locale change',(tester)async{
  final controller=CaveController();final semantics=tester.ensureSemantics();
  await tester.pumpWidget(CaveApp(controller:controller,home:Scaffold(body:SingleChildScrollView(child:SettingsTemplate(controller:controller)))));
  await tester.pumpAndSettle();expect(find.text('Account settings'),findsOneWidget);
  controller.setLocale(const Locale('ar'));await tester.pumpAndSettle();expect(find.text('إعدادات الحساب'),findsOneWidget);
  expect(Directionality.of(tester.element(find.text('إعدادات الحساب'))),TextDirection.rtl);
  expect(find.bySemanticsLabel('إعدادات الحساب'),findsOneWidget);
  await tester.pumpWidget(const SizedBox());semantics.dispose();controller.dispose();
 });
 testWidgets('buttons meet native target and accessible label guidelines',(tester)async{
  final handle=tester.ensureSemantics();final controller=CaveController();
  await tester.pumpWidget(CaveApp(controller:controller,home:Scaffold(body:CaveButton(label:'Save',size:CaveButtonSize.small,onPressed:(){}))));await tester.pumpAndSettle();
  await expectLater(tester,meetsGuideline(androidTapTargetGuideline));await expectLater(tester,meetsGuideline(labeledTapTargetGuideline));
  await tester.pumpWidget(const SizedBox());handle.dispose();controller.dispose();
 });
}
