import 'package:flutter/material.dart';
import 'package:cave_ui/cave_ui.dart';
void main(){final controller=CaveController(locale:const Locale('ar'));runApp(CaveApp(controller:controller,home:Scaffold(body:SafeArea(child:SingleChildScrollView(padding:const EdgeInsetsDirectional.all(24),child:SignInTemplate(controller:controller))))));}
class SignInTemplate extends StatefulWidget{
 final CaveController controller;
 const SignInTemplate({super.key,required this.controller});
 @override State<SignInTemplate> createState()=>_SignInTemplateState();
}
class _SignInTemplateState extends State<SignInTemplate>{
 final form = GlobalKey<FormState>();
  bool visible = false;
  bool submitted = false;
 CaveController get controller=>widget.controller;
 @override Widget build(BuildContext context)=>ListenableBuilder(listenable:controller,builder:(context,child){final ar=controller.locale.languageCode=='ar';return Form(key:form,child:Column(crossAxisAlignment:CrossAxisAlignment.stretch,children:[Text(ar?'تسجيل الدخول':'Sign in',style:Theme.of(context).textTheme.headlineSmall),const SizedBox(height:16),Text(ar?'مثال للواجهة فقط. لا تُرسل بياناتك إلى أي خادم.':'Interface demo. Your details are never sent to a server.'),const SizedBox(height:16),CaveTextField(label:ar?'البريد الإلكتروني':'Email',keyboardType:TextInputType.emailAddress,textDirection:TextDirection.ltr,validator:(value)=>RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(value??'')?null:(ar?'أدخل بريدًا إلكترونيًا صحيحًا.':'Enter a valid email address.')),const SizedBox(height:16),CaveTextField(label:ar?'كلمة المرور':'Password',obscureText:!visible,validator:(value)=>(value??'').isNotEmpty?null:(ar?'أدخل كلمة المرور.':'Enter your password.')),CaveSwitch(label:ar?'إظهار كلمة المرور':'Show password',value:visible,onChanged:(value)=>setState(()=>visible=value)),CaveButton(label:ar?'تجربة تسجيل الدخول':'Try sign-in',onPressed:(){if(form.currentState!.validate())setState(()=>submitted=true);}),if(submitted) Semantics(liveRegion:true,child:Text(ar?'اكتمل المثال. لم يتم تسجيل الدخول أو إرسال أي بيانات.':'Demo complete. No authentication or data transmission occurred.'))]));});
}
