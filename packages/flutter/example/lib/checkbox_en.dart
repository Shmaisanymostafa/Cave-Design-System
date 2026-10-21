import 'package:flutter/material.dart';
import 'package:cave_ui/cave_ui.dart';

void main() => runApp(CaveApp(
  controller: CaveController(locale: const Locale('en')),
  home: const Scaffold(body: SafeArea(child: SingleChildScrollView(child: Padding(
    padding: EdgeInsetsDirectional.all(24), child: CheckboxExample())))),
));

class CheckboxExample extends StatefulWidget {
  const CheckboxExample({super.key});
  @override
  State<CheckboxExample> createState() => _CheckboxExampleState();
}

class _CheckboxExampleState extends State<CheckboxExample> {
  bool checked = false;
  @override
  Widget build(BuildContext context) => CaveCheckbox(label: 'Email me a copy', value: checked,
  onChanged: (value) => setState(() => checked = value ?? false));
}
