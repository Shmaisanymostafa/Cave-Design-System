import 'package:flutter/material.dart';
import 'colors.dart';
import 'dimensions.dart';

enum CaveButtonSize { small, medium, large }
enum CaveButtonVariant { primary, secondary, tertiary, danger }
class CaveButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool loading;
  final CaveButtonSize size;
  final Widget? icon;
  final CaveButtonVariant variant;
  const CaveButton({super.key,required this.label,this.onPressed,this.loading=false,this.size=CaveButtonSize.medium,this.icon,this.variant=CaveButtonVariant.primary});
  @override
  Widget build(BuildContext context) {
    final colors=Theme.of(context).extension<CaveColors>() ?? CaveColors.light;
    final foreground = variant==CaveButtonVariant.primary ? colors.onAccentStrong : variant==CaveButtonVariant.danger ? colors.onDanger : colors.ink;
    final content=Row(mainAxisSize:MainAxisSize.min,children:[
      if(loading) ...[SizedBox(width:16,height:16,child:CircularProgressIndicator(strokeWidth:2,color:foreground)),const SizedBox(width:8)]
      else if(icon!=null) ...[icon!,const SizedBox(width:8)],
      Flexible(child:Text(label)),
    ]);
    final callback=loading?null:onPressed;
    final height=switch(size){CaveButtonSize.small=>44.0,CaveButtonSize.medium=>48.0,CaveButtonSize.large=>56.0};
    final style=ButtonStyle(minimumSize:WidgetStatePropertyAll(Size(48,height)));

    return Semantics(liveRegion:loading,child:switch(variant) {
      CaveButtonVariant.secondary => OutlinedButton(onPressed:callback,style:style,child:content),
      CaveButtonVariant.tertiary => TextButton(onPressed:callback,style:style,child:content),
      CaveButtonVariant.danger => FilledButton(onPressed:callback,style:style.merge(FilledButton.styleFrom(backgroundColor:colors.danger,foregroundColor:colors.onDanger)),child:content),
      _ => FilledButton(onPressed:callback,style:style,child:content),
    });
  }
}
class CaveTextField extends StatelessWidget {
  final String label;
  final String? helperText,errorText;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final bool enabled,obscureText;
  final TextInputType? keyboardType;
  final TextDirection? textDirection;
  final String? Function(String?)? validator;
  const CaveTextField({super.key,required this.label,this.helperText,this.errorText,this.controller,this.onChanged,this.enabled=true,this.obscureText=false,this.keyboardType,this.textDirection,this.validator});
  @override
  Widget build(BuildContext context)=>TextFormField(controller:controller,onChanged:onChanged,enabled:enabled,obscureText:obscureText,keyboardType:keyboardType,textDirection:textDirection,validator:validator,decoration:InputDecoration(labelText:label,helperText:helperText,errorText:errorText,helperMaxLines:4,errorMaxLines:4));
}
class CaveCheckbox extends StatelessWidget {
  final String label;final bool value;final ValueChanged<bool?>? onChanged;
  const CaveCheckbox({super.key,required this.label,required this.value,this.onChanged});
  @override
  Widget build(BuildContext context)=>CheckboxListTile(title:Text(label),value:value,onChanged:onChanged,controlAffinity:ListTileControlAffinity.leading,contentPadding:EdgeInsets.zero);
}
class CaveSwitch extends StatelessWidget {
  final String label;final bool value;final ValueChanged<bool>? onChanged;
  const CaveSwitch({super.key,required this.label,required this.value,this.onChanged});
  @override
  Widget build(BuildContext context)=>SwitchListTile(title:Text(label),value:value,onChanged:onChanged,contentPadding:EdgeInsets.zero);
}
class CaveRadioGroup<T> extends StatelessWidget {
  final T? value; final Map<T,String> options; final ValueChanged<T?>? onChanged;
  const CaveRadioGroup({super.key,required this.value,required this.options,this.onChanged});
  @override
  Widget build(BuildContext context)=>RadioGroup<T>(groupValue:value,onChanged:(value)=>onChanged?.call(value),child:Column(mainAxisSize:MainAxisSize.min,children:[for(final entry in options.entries) RadioListTile<T>(value:entry.key,title:Text(entry.value),enabled:onChanged!=null,contentPadding:EdgeInsets.zero)]));
}
class CaveCard extends StatelessWidget {
  final Widget child;
  const CaveCard({super.key,required this.child});
  @override
  Widget build(BuildContext context)=>Card(child:Padding(padding:const EdgeInsetsDirectional.all(CaveSpacing.space4),child:child));
}
Future<T?> showCaveDialog<T>({required BuildContext context,required String title,required Widget content,List<Widget>? actions})=>showDialog<T>(context:context,builder:(context)=>AlertDialog(title:Text(title),content:content,actions:actions));
class CaveNavigation extends StatelessWidget {
  final int selectedIndex;final ValueChanged<int> onSelected;final List<NavigationDestination> destinations;
  const CaveNavigation({super.key,required this.selectedIndex,required this.onSelected,required this.destinations});
  @override
  Widget build(BuildContext context)=>NavigationBar(selectedIndex:selectedIndex,onDestinationSelected:onSelected,destinations:destinations);
}
