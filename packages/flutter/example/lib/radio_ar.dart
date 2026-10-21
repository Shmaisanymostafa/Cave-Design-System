import 'package:flutter/material.dart';
import 'package:cave_ui/cave_ui.dart';

void main() => runApp(CaveApp(
  controller: CaveController(locale: const Locale('ar')),
  home: const Scaffold(body: SafeArea(child: SingleChildScrollView(child: Padding(
    padding: EdgeInsetsDirectional.all(24), child: RadioExample())))),
));

class RadioExample extends StatefulWidget {
  const RadioExample({super.key});
  @override
  State<RadioExample> createState() => _RadioExampleState();
}

class _RadioExampleState extends State<RadioExample> {
  String? delivery = 'pickup';
  @override
  Widget build(BuildContext context) => CaveRadioGroup<String>(value: delivery,
  options: const {'pickup': 'استلام', 'delivery': 'توصيل'},
  onChanged: (value) => setState(() => delivery = value));
}
