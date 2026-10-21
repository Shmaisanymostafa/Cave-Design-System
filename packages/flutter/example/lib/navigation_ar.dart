import 'package:flutter/material.dart';
import 'package:cave_ui/cave_ui.dart';

void main() => runApp(CaveApp(
  controller: CaveController(locale: const Locale('ar')),
  home: const Scaffold(body: SafeArea(child: SingleChildScrollView(child: Padding(
    padding: EdgeInsetsDirectional.all(24), child: NavigationExample())))),
));

class NavigationExample extends StatefulWidget {
  const NavigationExample({super.key});
  @override
  State<NavigationExample> createState() => _NavigationExampleState();
}

class _NavigationExampleState extends State<NavigationExample> {
  int selected = 0;
  @override
  Widget build(BuildContext context) => CaveNavigation(selectedIndex: selected, onSelected: (index) => setState(() => selected = index),
  destinations: const [NavigationDestination(icon: Icon(Icons.home_outlined), label: 'الرئيسية'),
    NavigationDestination(icon: Icon(Icons.settings_outlined), label: 'الإعدادات')]);
}
