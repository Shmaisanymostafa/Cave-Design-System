import 'package:flutter/material.dart';
import 'package:cave_ui/cave_ui.dart';

void main() => runApp(CaveApp(
  controller: CaveController(locale: const Locale('en')),
  home: const Scaffold(body: SafeArea(child: SingleChildScrollView(child: Padding(
    padding: EdgeInsetsDirectional.all(24), child: ToastExample())))),
));

class ToastExample extends StatefulWidget {
  const ToastExample({super.key});
  @override
  State<ToastExample> createState() => _ToastExampleState();
}

class _ToastExampleState extends State<ToastExample> {
  
  @override
  Widget build(BuildContext context) => CaveButton(label: 'Show confirmation', onPressed: () {
  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Copied')));
});
}
