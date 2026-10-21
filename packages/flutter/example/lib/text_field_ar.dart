import 'package:flutter/material.dart';
import 'package:cave_ui/cave_ui.dart';

void main() => runApp(CaveApp(
  controller: CaveController(locale: const Locale('ar')),
  home: const Scaffold(body: SafeArea(child: SingleChildScrollView(child: Padding(
    padding: EdgeInsetsDirectional.all(24), child: TextFieldExample())))),
));

class TextFieldExample extends StatefulWidget {
  const TextFieldExample({super.key});
  @override
  State<TextFieldExample> createState() => _TextFieldExampleState();
}

class _TextFieldExampleState extends State<TextFieldExample> {
  
  @override
  Widget build(BuildContext context) => CaveTextField(label: 'البريد الإلكتروني', helperText: 'سنرسل التأكيد إلى هذا العنوان.',
  keyboardType: TextInputType.emailAddress, textDirection: TextDirection.ltr);
}
