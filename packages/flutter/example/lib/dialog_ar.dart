import 'package:flutter/material.dart';
import 'package:cave_ui/cave_ui.dart';

void main() => runApp(CaveApp(
  controller: CaveController(locale: const Locale('ar')),
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
  Widget build(BuildContext context) => CaveButton(label: 'مراجعة التغييرات', onPressed: () {
  showCaveDialog<void>(context: context, title: 'حفظ التغييرات؟',
    content: const Text('راجع التفاصيل قبل المتابعة.'),
    actions: [CaveButton(label: 'إلغاء', variant: CaveButtonVariant.secondary,
      onPressed: () => Navigator.of(context).pop())]);
});
}
