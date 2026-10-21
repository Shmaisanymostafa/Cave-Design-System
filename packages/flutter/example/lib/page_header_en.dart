import 'package:flutter/material.dart';
import 'package:cave_ui/cave_ui.dart';

void main() => runApp(CaveApp(
  controller: CaveController(locale: const Locale('en')),
  home: const Scaffold(body: SafeArea(child: SingleChildScrollView(child: Padding(
    padding: EdgeInsetsDirectional.all(24), child: PageHeaderExample())))),
));

class PageHeaderExample extends StatefulWidget {
  const PageHeaderExample({super.key});
  @override
  State<PageHeaderExample> createState() => _PageHeaderExampleState();
}

class _PageHeaderExampleState extends State<PageHeaderExample> {
  
  @override
  Widget build(BuildContext context) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
  Text('Settings', style: Theme.of(context).textTheme.headlineSmall),
  const SizedBox(height: 8), const Text('Manage your account preferences.')
]);
}
