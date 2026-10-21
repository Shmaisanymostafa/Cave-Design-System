import 'package:flutter/material.dart';
import 'package:cave_ui/cave_ui.dart';

void main() => runApp(CaveApp(
  controller: CaveController(locale: const Locale('en')),
  home: const Scaffold(body: SafeArea(child: SingleChildScrollView(child: Padding(
    padding: EdgeInsetsDirectional.all(24), child: BannerExample())))),
));

class BannerExample extends StatefulWidget {
  const BannerExample({super.key});
  @override
  State<BannerExample> createState() => _BannerExampleState();
}

class _BannerExampleState extends State<BannerExample> {
  
  @override
  Widget build(BuildContext context) => Builder(builder: (context) {
  final colors = Theme.of(context).extension<CaveColors>()!;
  return Semantics(liveRegion: true, child: Container(
    padding: const EdgeInsetsDirectional.all(16),
    decoration: BoxDecoration(color: colors.successBg, border: Border.all(color: colors.successBorder), borderRadius: BorderRadius.circular(10)),
    child: Text('Your changes have been saved.', style: TextStyle(color: colors.successFg))));
});
}
