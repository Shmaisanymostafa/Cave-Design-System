import 'package:flutter/material.dart';
import 'package:cave_ui/cave_ui.dart';

void main() => runApp(CaveApp(
  controller: CaveController(locale: const Locale('en')),
  home: const Scaffold(body: SafeArea(child: SingleChildScrollView(child: Padding(
    padding: EdgeInsetsDirectional.all(24), child: TabsExample())))),
));

class TabsExample extends StatefulWidget {
  const TabsExample({super.key});
  @override
  State<TabsExample> createState() => _TabsExampleState();
}

class _TabsExampleState extends State<TabsExample> {
  
  @override
  Widget build(BuildContext context) => DefaultTabController(length: 2, child: SizedBox(height: 220, child: Column(children: [
  const TabBar(tabs: [Tab(text: 'Overview'), Tab(text: 'Details')]),
  const Expanded(child: TabBarView(children: [Center(child: Text('Account summary')), Center(child: Text('Account details'))]))
])));
}
