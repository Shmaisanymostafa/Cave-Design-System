import 'package:flutter/material.dart';
import 'package:cave_ui/cave_ui.dart';

void main() => runApp(CaveApp(
  controller: CaveController(locale: const Locale('en')),
  home: const Scaffold(body: SafeArea(child: SingleChildScrollView(child: Padding(
    padding: EdgeInsetsDirectional.all(24), child: SwitchExample())))),
));

class SwitchExample extends StatefulWidget {
  const SwitchExample({super.key});
  @override
  State<SwitchExample> createState() => _SwitchExampleState();
}

class _SwitchExampleState extends State<SwitchExample> {
  bool enabled = false;
  @override
  Widget build(BuildContext context) => CaveSwitch(label: 'Enable notifications', value: enabled,
  onChanged: (value) => setState(() => enabled = value));
}
