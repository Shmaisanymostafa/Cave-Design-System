import 'package:flutter/material.dart';
import 'package:cave_ui/cave_ui.dart';

void main() => runApp(CaveApp(
  controller: CaveController(locale: const Locale('en')),
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
  children: const [Text('Order summary'), SizedBox(height: 8), Text('3 items ready for review.')]));
}
