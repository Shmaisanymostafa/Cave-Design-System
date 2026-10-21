import 'package:flutter/material.dart';
import 'package:cave_ui/cave_ui.dart';

void main() => runApp(CaveApp(
  controller: CaveController(locale: const Locale('en')),
  home: const Scaffold(body: SafeArea(child: SingleChildScrollView(child: Padding(
    padding: EdgeInsetsDirectional.all(24), child: EmptyStateExample())))),
));

class EmptyStateExample extends StatefulWidget {
  const EmptyStateExample({super.key});
  @override
  State<EmptyStateExample> createState() => _EmptyStateExampleState();
}

class _EmptyStateExampleState extends State<EmptyStateExample> {
  
  @override
  Widget build(BuildContext context) => Padding(padding: const EdgeInsetsDirectional.all(24), child: Column(
  children: const [Text('No items yet'), SizedBox(height: 8), Text('Add an item to see it here.')]));
}
