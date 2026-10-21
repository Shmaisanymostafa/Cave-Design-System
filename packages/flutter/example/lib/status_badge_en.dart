import 'package:flutter/material.dart';
import 'package:cave_ui/cave_ui.dart';

void main() => runApp(CaveApp(
  controller: CaveController(locale: const Locale('en')),
  home: const Scaffold(body: SafeArea(child: SingleChildScrollView(child: Padding(
    padding: EdgeInsetsDirectional.all(24), child: StatusBadgeExample())))),
));

class StatusBadgeExample extends StatefulWidget {
  const StatusBadgeExample({super.key});
  @override
  State<StatusBadgeExample> createState() => _StatusBadgeExampleState();
}

class _StatusBadgeExampleState extends State<StatusBadgeExample> {
  
  @override
  Widget build(BuildContext context) => Builder(builder: (context) {
  final colors = Theme.of(context).extension<CaveColors>()!;
  return Chip(label: Text('Complete', style: TextStyle(color: colors.successFg)),
    backgroundColor: colors.successBg, side: BorderSide(color: colors.successBorder));
});
}
