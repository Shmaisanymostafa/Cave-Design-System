import 'package:flutter/material.dart';
import 'package:cave_ui/cave_ui.dart';

void main() => runApp(CaveApp(
  controller: CaveController(locale: const Locale('ar')),
  home: const Scaffold(body: SafeArea(child: SingleChildScrollView(child: Padding(
    padding: EdgeInsetsDirectional.all(24), child: DataTableExample())))),
));

class DataTableExample extends StatefulWidget {
  const DataTableExample({super.key});
  @override
  State<DataTableExample> createState() => _DataTableExampleState();
}

class _DataTableExampleState extends State<DataTableExample> {
  
  @override
  Widget build(BuildContext context) => SingleChildScrollView(scrollDirection: Axis.horizontal, child: DataTable(
  columns: const [DataColumn(label: Text('الطلب')), DataColumn(label: Text('الحالة'))],
  rows: const [DataRow(cells: [DataCell(Text('#1042', textDirection: TextDirection.ltr)), DataCell(Text('جاهز'))])]));
}
