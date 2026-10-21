// Generated local documentation gallery. Not a separate product.
import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';
import 'package:cave_ui/cave_ui.dart';
import 'button_en.dart' as en_0;
import 'text_field_en.dart' as en_1;
import 'checkbox_en.dart' as en_2;
import 'radio_en.dart' as en_3;
import 'switch_en.dart' as en_4;
import 'card_en.dart' as en_5;
import 'data_table_en.dart' as en_6;
import 'status_badge_en.dart' as en_7;
import 'banner_en.dart' as en_8;
import 'empty_state_en.dart' as en_9;
import 'toast_en.dart' as en_10;
import 'dialog_en.dart' as en_11;
import 'tabs_en.dart' as en_12;
import 'navigation_en.dart' as en_13;
import 'page_header_en.dart' as en_14;
import 'button_ar.dart' as ar_0;
import 'text_field_ar.dart' as ar_1;
import 'checkbox_ar.dart' as ar_2;
import 'radio_ar.dart' as ar_3;
import 'switch_ar.dart' as ar_4;
import 'card_ar.dart' as ar_5;
import 'data_table_ar.dart' as ar_6;
import 'status_badge_ar.dart' as ar_7;
import 'banner_ar.dart' as ar_8;
import 'empty_state_ar.dart' as ar_9;
import 'toast_ar.dart' as ar_10;
import 'dialog_ar.dart' as ar_11;
import 'tabs_ar.dart' as ar_12;
import 'navigation_ar.dart' as ar_13;
import 'page_header_ar.dart' as ar_14;
import 'settings_en.dart' as template_0;
import 'dashboard_en.dart' as template_1;
import 'sign_in_en.dart' as template_2;
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
 return switch('${component}_${controller.locale.languageCode}'){
 'Button_en' => const en_0.ButtonExample(),
'TextField_en' => const en_1.TextFieldExample(),
'Checkbox_en' => const en_2.CheckboxExample(),
'Radio_en' => const en_3.RadioExample(),
'Switch_en' => const en_4.SwitchExample(),
'Card_en' => const en_5.CardExample(),
'DataTable_en' => const en_6.DataTableExample(),
'StatusBadge_en' => const en_7.StatusBadgeExample(),
'Banner_en' => const en_8.BannerExample(),
'EmptyState_en' => const en_9.EmptyStateExample(),
'Toast_en' => const en_10.ToastExample(),
'Dialog_en' => const en_11.DialogExample(),
'Tabs_en' => const en_12.TabsExample(),
'Navigation_en' => const en_13.NavigationExample(),
'PageHeader_en' => const en_14.PageHeaderExample(),
'Button_ar' => const ar_0.ButtonExample(),
'TextField_ar' => const ar_1.TextFieldExample(),
'Checkbox_ar' => const ar_2.CheckboxExample(),
'Radio_ar' => const ar_3.RadioExample(),
'Switch_ar' => const ar_4.SwitchExample(),
'Card_ar' => const ar_5.CardExample(),
'DataTable_ar' => const ar_6.DataTableExample(),
'StatusBadge_ar' => const ar_7.StatusBadgeExample(),
'Banner_ar' => const ar_8.BannerExample(),
'EmptyState_ar' => const ar_9.EmptyStateExample(),
'Toast_ar' => const ar_10.ToastExample(),
'Dialog_ar' => const ar_11.DialogExample(),
'Tabs_ar' => const ar_12.TabsExample(),
'Navigation_ar' => const ar_13.NavigationExample(),
'PageHeader_ar' => const ar_14.PageHeaderExample(),
'SettingsTemplate_en' || 'SettingsTemplate_ar' => template_0.SettingsTemplate(controller:controller),
'DashboardTemplate_en' || 'DashboardTemplate_ar' => template_1.DashboardTemplate(controller:controller),
'SignInTemplate_en' || 'SignInTemplate_ar' => template_2.SignInTemplate(controller:controller),
 _=>Text(ar?'المثال غير موجود':'Example not found'),
 };
})))));
}
