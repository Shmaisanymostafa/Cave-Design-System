export const guidance = {
 en: {
  colour: `Use semantic roles such as \`surface\`, \`ink\`, \`accent-strong\` and \`on-accent-strong\` in components. Raw colours are available for custom themes, but a colour change must preserve readable foreground/background pairs.

Light uses a paper surface, Dark uses a deep teal-ink surface with a pale aqua accent (the same Dark as Cave Forms), and Black uses charcoal. Black is a near-black theme. System follows the device and resolves to Light or Dark.

Primary button text has 5.6:1 contrast in Light, 9.6:1 in Dark and 5.1:1 in Black. Status messages include words; colour alone cannot explain a result.

On the raw palette, plain teal is 3.1:1 on paper and 3.3:1 on white, so use it for fills, icons and large graphics and use \`accent-text\` for text. Slate is about 2:1 and mint 1.7:1 on light surfaces, so keep them decorative. \`border\` is a divider; the edge of an input uses \`border-strong\`, which passes 3:1 in every theme.

Change tokens in \`source/tokens.json\` and regenerate all platforms. A custom brand theme can override CSS variables on its root or supply a \`CaveColors\` extension in Flutter. Check contrast again after customization.`,
  typography: `Poppins is the optional English font and Almarai is the optional Arabic font. Packages include system-font fallbacks and make no font-network requests. Download and bundle the open fonts when you want the same typography as this documentation.

Use the locale to choose typography, and the direction to arrange the interface. Arabic text needs appropriate line height and must not receive letter spacing that breaks joined letters. Allow labels and headings to wrap and support larger system text sizes.

Keep code, emails, phone numbers and identifiers left to right inside Arabic pages. Use \`bdi\` for isolated mixed text and an explicit direction for fields when appropriate.`,
  layout: `Use logical start/end spacing in CSS and \`EdgeInsetsDirectional\` in Flutter. The same component should work in either reading direction without a separate RTL stylesheet.

Spacing, corner radii, motion and layers are generated from the same token source. Keep cards flat and reserve shadows for floating surfaces. Respect reduced-motion preferences and preserve visible keyboard focus.

Touch controls should have at least a 44px target on web. Flutter controls use the platform's native interaction targets. Content should remain usable at narrow widths and with larger text.`,
  guidelines: `## Language and direction

English and Arabic are supported throughout the component catalog. A locale switch updates direction and library labels; application text still comes from your own translation resources. Region-specific locales such as \`ar-LB\` and \`en-GB\` can be used for formatting. Numbering systems and calendars are product decisions; do not assume every Arabic user prefers the same digits.

On web, create one \`createCave\` controller per application root. Use \`setLocale\`, \`setTheme\` and \`setDirection\` to update it. Listen for \`cave:change\` to update application-owned text. In Flutter, \`CaveController\` notifies listeners and \`CaveApp\` updates locale, direction and themes. Existing applications can use \`CaveTheme\` without adopting the optional app shell.

## Interaction and accessibility

Use semantic buttons, labels, inputs, links and dialogs. Every interactive control needs a visible or accessible name and a visible focus indicator. Dialogs contain focus and return it to their trigger. Tabs support arrows, Home and End. Do not mirror logos or all icons automatically; mirror directional arrows according to their meaning.

Errors explain how to recover and remain visible until resolved. Status messages use words as well as colour. Test mouse, touch and keyboard input, including clicking the full label around a control.

## Customization

Use semantic tokens rather than hard-coded colours. Scope custom CSS variables to the application root. Configure fonts explicitly when bundling them. Generic components carry no Cave logo or required attribution inside the interface.

## Evaluation status

This working tree is unreleased. Archives are local evaluation files; package publication and deployment are paused. Pin the version and review the changelog before upgrading. Theme and locale switches act at runtime; package updates remain explicit versioned releases.

Code in the packages is MIT licensed. Open fonts retain their own SIL Open Font License notices. Cave brand assets have separate terms and are not included in these packages.`,
 },
 ar: {
  colour: `استخدم الأدوار الدلالية مثل \`surface\` و\`ink\` و\`accent-strong\` و\`on-accent-strong\` داخل المكوّنات. تتاح الألوان الأساسية لإنشاء مظاهر مخصصة، لكن أي تغيير يجب أن يحافظ على وضوح النص فوق الخلفية.

يستخدم المظهر الفاتح خلفية ورقية والداكن خلفية داكنة بلون أزرق مخضرّ مع لون تمييز فيروزي فاتح (المظهر الداكن نفسه في «استمارات كهف») والأسود خلفية فحمية قريبة من الأسود. يتبع خيار النظام إعداد الجهاز ويختار الفاتح أو الداكن.

تباين نص الزر الأساسي هو 5.6:1 في الفاتح و9.6:1 في الداكن و5.1:1 في الأسود. تتضمن رسائل الحالة كلمات واضحة؛ اللون وحده لا يشرح النتيجة.

في اللوحة الأساسية، تباين الفيروزي العادي 3.1:1 على الورقي و3.3:1 على الأبيض، لذا استخدمه للتعبئة والأيقونات والرسوم الكبيرة واستخدم \`accent-text\` للنص. تباين الرمادي المزرق نحو 2:1 والنعناعي 1.7:1 على الأسطح الفاتحة، فأبقِهما للزينة فقط. \`border\` للفواصل؛ أما حدّ حقل الإدخال فيستخدم \`border-strong\` الذي يحقق 3:1 في كل المظاهر.

عدّل الرموز في \`source/tokens.json\` ثم أعد توليد ملفات جميع المنصات. يمكن تخصيص متغيرات CSS على جذر التطبيق أو تمرير امتداد \`CaveColors\` في Flutter. افحص التباين بعد التخصيص.`,
  typography: `Poppins هو الخط الإنجليزي الاختياري وAlmarai هو الخط العربي الاختياري. تتضمن الحزم بدائل من خطوط النظام ولا تطلب الخطوط من الشبكة. نزّل الخطوط المفتوحة وضمّنها للحصول على خطوط هذا التوثيق.

اختر الخط بحسب اللغة ورتّب الواجهة بحسب اتجاه القراءة. يحتاج النص العربي إلى ارتفاع سطر مناسب ويجب ألا تطبّق عليه تباعد أحرف يقطع اتصالها. اسمح بالتفاف العناوين والنصوص وادعم تكبير الخط في النظام.

أبقِ الشيفرة والبريد والهاتف والمعرّفات من اليسار إلى اليمين داخل الصفحات العربية. استخدم \`bdi\` لعزل النص المختلط وحدد اتجاه الحقول صراحةً عندما يلزم.`,
  layout: `استخدم خصائص البداية والنهاية المنطقية في CSS و\`EdgeInsetsDirectional\` في Flutter. يجب أن يعمل المكوّن نفسه في الاتجاهين دون ملف أنماط منفصل للعربية.

تُولَّد المسافات والاستدارات والحركة والطبقات من مصدر رموز واحد. اجعل البطاقات مسطحة وخصص الظلال للأسطح العائمة. احترم تفضيل تقليل الحركة وحافظ على مؤشر تركيز واضح للوحة المفاتيح.

اجعل مساحة اللمس على الويب 44 بكسل على الأقل. تستخدم مكوّنات Flutter مساحات التفاعل الأصلية للمنصة. يجب أن يبقى المحتوى قابلًا للاستخدام على الشاشات الضيقة وعند تكبير النص.`,
  guidelines: `## اللغة واتجاه القراءة

تدعم جميع صفحات المكوّنات العربية والإنجليزية. يغيّر تبديل اللغة اتجاه القراءة وعناوين المكتبة، بينما تأتي نصوص التطبيق من موارد ترجمته الخاصة. يمكن استخدام إعدادات إقليمية مثل \`ar-LB\` و\`en-GB\` للتنسيق. اختيار الأرقام والتقويم قرار خاص بالمنتج؛ لا تفترض أن جميع المستخدمين العرب يفضلون الأرقام نفسها.

على الويب، أنشئ متحكم \`createCave\` لكل جذر تطبيق. استخدم \`setLocale\` و\`setTheme\` و\`setDirection\` لتحديثه، واستمع إلى حدث \`cave:change\` لتحديث نصوص التطبيق. في Flutter يبلّغ \`CaveController\` المستمعين ويحدّث \`CaveApp\` اللغة والاتجاه والمظهر. ويمكن استخدام \`CaveTheme\` مباشرةً داخل التطبيقات القائمة.

## التفاعل وإمكانية الوصول

استخدم الأزرار والعناوين والحقول والروابط والحوارات الدلالية. يحتاج كل عنصر تفاعلي إلى اسم واضح ومؤشر تركيز ظاهر. تحصر الحوارات التركيز داخلها وتعيده إلى زر الفتح عند الإغلاق. تدعم علامات التبويب الأسهم وHome وEnd. لا تعكس الشعارات أو كل الأيقونات تلقائيًا؛ اعكس الأسهم الاتجاهية وفق معناها.

تشرح الأخطاء طريقة التصحيح وتبقى ظاهرة حتى تُحل. تستخدم رسائل الحالة النص واللون معًا. اختبر الفأرة واللمس ولوحة المفاتيح، بما في ذلك النقر على كامل عنوان عنصر التحكم.

## التخصيص

استخدم الرموز الدلالية بدل الألوان الثابتة. احصر متغيرات CSS المخصصة في جذر التطبيق وحدد الخطوط صراحةً عند تضمينها. لا تحتوي المكوّنات العامة على شعار كهف أو نسبة إلزامية داخل الواجهة.

## حالة التقييم

هذه نسخة عمل غير منشورة. الأرشيفات للتقييم المحلي فقط؛ نشر الحزم والمواقع متوقف حاليًا. ثبّت رقم الإصدار وراجع سجل التغييرات قبل الترقية. تعمل مفاتيح المظهر واللغة أثناء التشغيل، بينما تبقى تحديثات الحزمة إصدارات صريحة.

شيفرة الحزم مرخّصة بترخيص MIT. تحتفظ الخطوط المفتوحة بإشعارات ترخيص SIL الخاص بها. لأصول هوية كهف شروط منفصلة وهي غير مضمنة في هذه الحزم.`,
 }
};
