import 'package:flutter/material.dart';
import 'package:cave_ui/cave_ui.dart';

void main() => runApp(CaveApp(
  controller: CaveController(locale: const Locale('en')),
  home: const Scaffold(body: SafeArea(child: SingleChildScrollView(child: Padding(
    padding: EdgeInsetsDirectional.all(24), child: ButtonExample())))),
));

class ButtonExample extends StatefulWidget {
  const ButtonExample({super.key});
  @override
  State<ButtonExample> createState() => _ButtonExampleState();
}

class _ButtonExampleState extends State<ButtonExample> {
  
  @override
  Widget build(BuildContext context) => CaveButton(label: 'Save changes', onPressed: () {
  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Changes saved')));
});
}
