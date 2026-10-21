import 'package:flutter/material.dart';
import 'package:cave_ui/cave_ui.dart';

void main() => runApp(CaveApp(
  controller: CaveController(locale: const Locale('ar')),
  home: const Scaffold(body: SafeArea(child: SingleChildScrollView(child: Padding(
    padding: EdgeInsetsDirectional.all(24), child: CardExample())))),
));

class CardExample extends StatefulWidget {
  const CardExample({super.key});
  @override
  State<CardExample> createState() => _CardExampleState();
}

class _CardExampleState extends State<CardExample> {
  
  @override
  Widget build(BuildContext context) => CaveCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start,
  children: const [Text('ملخص الطلب'), SizedBox(height: 8), Text('٣ عناصر جاهزة للمراجعة.')]));
}
