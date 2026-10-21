import 'package:flutter/material.dart';
import 'package:cave_ui/cave_ui.dart';

void main() => runApp(CaveApp(
  controller: CaveController(locale: const Locale('en')),
  home: const Scaffold(body: SafeArea(child: SingleChildScrollView(child: Padding(
    padding: EdgeInsetsDirectional.all(24), child: DialogExample())))),
));

class DialogExample extends StatefulWidget {
  const DialogExample({super.key});
  @override
  State<DialogExample> createState() => _DialogExampleState();
}

class _DialogExampleState extends State<DialogExample> {
  
  @override
  Widget build(BuildContext context) => CaveButton(label: 'Review changes', onPressed: () {
  showCaveDialog<void>(context: context, title: 'Save changes?',
    content: const Text('Review the details before continuing.'),
    actions: [CaveButton(label: 'Cancel', variant: CaveButtonVariant.secondary,
      onPressed: () => Navigator.of(context).pop())]);
});
}
