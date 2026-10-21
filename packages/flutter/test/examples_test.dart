import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:cave_ui/cave_ui.dart';
import '../example/lib/button_en.dart' as example_en_0;
import '../example/lib/text_field_en.dart' as example_en_1;
import '../example/lib/checkbox_en.dart' as example_en_2;
import '../example/lib/radio_en.dart' as example_en_3;
import '../example/lib/switch_en.dart' as example_en_4;
import '../example/lib/card_en.dart' as example_en_5;
import '../example/lib/data_table_en.dart' as example_en_6;
import '../example/lib/status_badge_en.dart' as example_en_7;
import '../example/lib/banner_en.dart' as example_en_8;
import '../example/lib/empty_state_en.dart' as example_en_9;
import '../example/lib/toast_en.dart' as example_en_10;
import '../example/lib/dialog_en.dart' as example_en_11;
import '../example/lib/tabs_en.dart' as example_en_12;
import '../example/lib/navigation_en.dart' as example_en_13;
import '../example/lib/page_header_en.dart' as example_en_14;
import '../example/lib/button_ar.dart' as example_ar_0;
import '../example/lib/text_field_ar.dart' as example_ar_1;
import '../example/lib/checkbox_ar.dart' as example_ar_2;
import '../example/lib/radio_ar.dart' as example_ar_3;
import '../example/lib/switch_ar.dart' as example_ar_4;
import '../example/lib/card_ar.dart' as example_ar_5;
import '../example/lib/data_table_ar.dart' as example_ar_6;
import '../example/lib/status_badge_ar.dart' as example_ar_7;
import '../example/lib/banner_ar.dart' as example_ar_8;
import '../example/lib/empty_state_ar.dart' as example_ar_9;
import '../example/lib/toast_ar.dart' as example_ar_10;
import '../example/lib/dialog_ar.dart' as example_ar_11;
import '../example/lib/tabs_ar.dart' as example_ar_12;
import '../example/lib/navigation_ar.dart' as example_ar_13;
import '../example/lib/page_header_ar.dart' as example_ar_14;
void main() {
 final examples = <String,Widget Function()>{
    'Button en': () => const example_en_0.ButtonExample(),
    'TextField en': () => const example_en_1.TextFieldExample(),
    'Checkbox en': () => const example_en_2.CheckboxExample(),
    'Radio en': () => const example_en_3.RadioExample(),
    'Switch en': () => const example_en_4.SwitchExample(),
    'Card en': () => const example_en_5.CardExample(),
    'DataTable en': () => const example_en_6.DataTableExample(),
    'StatusBadge en': () => const example_en_7.StatusBadgeExample(),
    'Banner en': () => const example_en_8.BannerExample(),
    'EmptyState en': () => const example_en_9.EmptyStateExample(),
    'Toast en': () => const example_en_10.ToastExample(),
    'Dialog en': () => const example_en_11.DialogExample(),
    'Tabs en': () => const example_en_12.TabsExample(),
    'Navigation en': () => const example_en_13.NavigationExample(),
    'PageHeader en': () => const example_en_14.PageHeaderExample(),
    'Button ar': () => const example_ar_0.ButtonExample(),
    'TextField ar': () => const example_ar_1.TextFieldExample(),
    'Checkbox ar': () => const example_ar_2.CheckboxExample(),
    'Radio ar': () => const example_ar_3.RadioExample(),
    'Switch ar': () => const example_ar_4.SwitchExample(),
    'Card ar': () => const example_ar_5.CardExample(),
    'DataTable ar': () => const example_ar_6.DataTableExample(),
    'StatusBadge ar': () => const example_ar_7.StatusBadgeExample(),
    'Banner ar': () => const example_ar_8.BannerExample(),
    'EmptyState ar': () => const example_ar_9.EmptyStateExample(),
    'Toast ar': () => const example_ar_10.ToastExample(),
    'Dialog ar': () => const example_ar_11.DialogExample(),
    'Tabs ar': () => const example_ar_12.TabsExample(),
    'Navigation ar': () => const example_ar_13.NavigationExample(),
    'PageHeader ar': () => const example_ar_14.PageHeaderExample(),
 };
 for(final entry in examples.entries) {
  for(final mode in [CaveThemeMode.light,CaveThemeMode.dark,CaveThemeMode.black]) {
   testWidgets('${entry.key} in $mode renders at mobile width', (tester) async {
    tester.view.physicalSize=const Size(320,900);tester.view.devicePixelRatio=1;
    addTearDown(tester.view.resetPhysicalSize);addTearDown(tester.view.resetDevicePixelRatio);
    final controller=CaveController(locale:Locale(entry.key.endsWith('ar')?'ar':'en'),themeMode:mode);
    await tester.pumpWidget(CaveApp(controller:controller,home:Scaffold(body:SingleChildScrollView(child:Padding(padding:const EdgeInsetsDirectional.all(16),child:entry.value())))));
    await tester.pumpAndSettle();expect(tester.takeException(),isNull);
    await tester.pumpWidget(const SizedBox());controller.dispose();
   });
  }
 }
}
