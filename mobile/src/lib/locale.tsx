import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

export type Locale = 'ar' | 'en';

/** UI strings only. Provider names, model ids, prompts, project names and user data stay untouched. */
const AR: Readonly<Record<string, string>> = {
  'Project library': 'مكتبة المشاريع', 'Choose a project type': 'اختر نوع المشروع',
  'New projects keep this type. Send generated media to a separate editing project when ready. All projects remain visible; opening one uses its saved workspace type.': 'تحتفظ المشاريع الجديدة بهذا النوع. انقل الوسائط المُنشأة إلى مشروع مونتاج مستقل عند جاهزيتها. تظل كل المشاريع ظاهرة، ويفتح كل مشروع بنوع مساحة العمل المحفوظ.',
  'Stored inside the app. Imported clips are copied in, so a project keeps working after the original is deleted from your library.': 'تُحفظ المشاريع داخل التطبيق. تُنسخ المقاطع المستوردة إلى المشروع لتظل متاحة حتى بعد حذف الأصل من مكتبتك.',
  'No projects yet. Create one to get started.': 'لا توجد مشاريع بعد. أنشئ مشروعًا للبدء.',
  'No project yet. Create one to get started.': 'لا يوجد مشروع بعد. أنشئ واحدًا للبدء.',
  'New project name': 'اسم المشروع الجديد', 'Project name': 'اسم المشروع', 'Rename project': 'إعادة تسمية المشروع',
  'Rename': 'إعادة التسمية', 'Create': 'إنشاء', 'Cancel': 'إلغاء', 'Delete': 'حذف', 'Delete project': 'حذف المشروع',
  'Settings': 'الإعدادات', 'Done': 'تم', 'Save': 'حفظ', 'Open': 'فتح', 'Close': 'إغلاق', 'More': 'المزيد',
  'Edit': 'مونتاج', 'Writer': 'الكاتب', 'Image': 'صورة', 'Images': 'الصور', 'Video': 'فيديو', 'Voice': 'الصوت',
  'AI': 'الذكاء الاصطناعي', 'Library': 'المكتبة', 'Studio': 'الاستوديو', 'Projects': 'المشاريع',
  'Project': 'المشروع',
  'Export video': 'تصدير الفيديو', 'Export': 'تصدير', 'Back to projects': 'العودة إلى المشاريع',
  'your photo library': 'مكتبة الصور', 'the app you chose': 'التطبيق الذي اخترته',
  'No clip under the playhead': 'لا يوجد مقطع عند مؤشر التشغيل',
  'Open a project from the Projects tab to start editing.': 'افتح مشروعًا من تبويب المشاريع لبدء المونتاج.',
  'That asset could not be placed on a track.': 'تعذّر وضع هذا الملف على مسار.',
  'Move the playhead inside the selected clip to split it.': 'حرّك مؤشر التشغيل إلى داخل المقطع المحدد لتقسيمه.',
  'Select a clip first.': 'حدد مقطعًا أولًا.',
  'That trim would make the clip shorter than a frame.': 'سيجعل هذا القص المقطع أقصر من إطار واحد.',
  'That move would overlap another clip.': 'سينتج عن هذا التحريك تداخل مع مقطع آخر.',
  'A slower clip needs more room — move the next clip along first.': 'يحتاج المقطع الأبطأ إلى مساحة أكبر؛ حرّك المقطع التالي أولًا.',
  'That value is outside what the effect accepts.': 'هذه القيمة خارج النطاق الذي يقبله التأثير.',
  'Only audio tracks carry a mix.': 'يمكن ضبط المزج لمسارات الصوت فقط.',
  'That track could not be added.': 'تعذّرت إضافة هذا المسار.',
  'A timeline keeps at least one video and one audio track.': 'يجب أن يحتوي التايملاين على مسار فيديو واحد ومسار صوت واحد على الأقل.',
  'A transition has to fit inside both of the clips it joins.': 'يجب أن يتسع الانتقال داخل المقطعين اللذين يربط بينهما.',
  'That transition could not be removed.': 'تعذّرت إزالة هذا الانتقال.',
  'That title could not be added.': 'تعذّرت إضافة هذا العنوان.',
  'That change would leave the title with nothing to draw.': 'سيؤدي هذا التغيير إلى عنوان بلا محتوى للعرض.',
  'There are no automatic captions to style.': 'لا توجد ترجمات تلقائية لتنسيقها.',
  'That title could not be removed.': 'تعذّرت إزالة هذا العنوان.',
  'Open a project to see what it holds.': 'افتح مشروعًا لعرض محتوياته.',
  'Import a clip, or generate one under Video. Drag a clip to move it; drag its ends—or long-press and drag—to change its length.': 'استورد مقطعًا أو أنشئ واحدًا من تبويب الفيديو. اسحب المقطع لنقله، أو اسحب طرفيه لتغيير مدته.',
  'Undo': 'تراجع', 'Redo': 'إعادة', 'Media bin': 'مكتبة الوسائط', 'Add a video track': 'إضافة مسار فيديو',
  'Add an audio track': 'إضافة مسار صوت', 'Remove this track': 'إزالة هذا المسار', 'Remove title': 'إزالة العنوان',
  'Remove transition': 'إزالة الانتقال', 'Selected clip': 'المقطع المحدد', 'Title': 'العنوان',
  'No transition here yet. Pick one and it lands on this cut.': 'لا يوجد انتقال هنا. اختر انتقالًا لإضافته عند موضع القص.',
  'Close the transition panel': 'إغلاق لوحة الانتقالات', 'Transition at': 'الانتقال عند',
  'Style preset': 'نمط العنوان', 'Title-safe anchor': 'موضع العنوان الآمن',
  'Safe anchors adapt to landscape, portrait and square exports. X/Y remain fine-tuning offsets.': 'تتكيف مواضع الأمان مع الإخراج الأفقي والعمودي والمربع. يتيح X/Y ضبط الإزاحة بدقة.',
  'Automatic captions:': 'الترجمة التلقائية:', 'burn into video': 'تضمينها في الفيديو', 'do not burn': 'عدم تضمينها',
  'SRT, VTT and ASS sidecar files are currently desktop-only.': 'تصدير ملفات SRT وVTT وASS متاح حاليًا على الحاسوب فقط.',
  'Metadata privacy and provenance: desktop-only': 'خصوصية البيانات الوصفية ومصدرها: للحاسوب فقط',
  'Unmute this track': 'إلغاء كتم المسار', 'Mute this track': 'كتم المسار',
  'Colour applies to the export. The preview does not show it yet.': 'يُطبّق اللون عند التصدير؛ لا تعرضه المعاينة حاليًا.',
  'Title text': 'نص العنوان', 'Apply appearance to': 'تطبيق المظهر على', 'automatic captions': 'ترجمة تلقائية',
  'Describe what changes in the next scene…': 'صف ما سيتغير في المشهد التالي…', 'Next scene brief': 'موجز المشهد التالي',
  'Character name, dialogue or scene…': 'اسم الشخصية أو الحوار أو المشهد…', 'Search project memory': 'البحث في ذاكرة المشروع',
  'Production brief': 'موجز الإنتاج', 'Custom film length in seconds': 'مدة الفيلم المخصصة بالثواني',
  'Alibaba Singapore Workspace ID': 'معرّف مساحة عمل Alibaba في سنغافورة',
  'Ask the assistant…': 'اسأل المساعد…', 'Message': 'الرسالة',
  'What to change — slower, no text on screen…': 'ما الذي تريد تغييره — إبطاء الحركة أو إزالة النص من الشاشة…',
  'Monthly spending limit in dollars': 'حد الإنفاق الشهري بالدولار',
  'Bold:': 'عريض:', 'on': 'مفعّل', 'off': 'متوقف',
  'Providers': 'المزوّدون', 'Everything the app generates runs against your own accounts. Keys are held in the device keystore — Keychain on iOS, Keystore on Android — never in the app bundle or in plain storage, and never read back for display.': 'تُنفّذ عمليات الإنشاء باستخدام حساباتك. تُحفظ المفاتيح في مخزن الجهاز الآمن، ولا توضع داخل التطبيق أو في تخزين مكشوف، ولا تُعرض مجددًا.',
  'Assistant': 'المساعد الذكي', 'Models the AI tab can talk to and call tools with.': 'النماذج التي يستخدمها تبويب الذكاء الاصطناعي والأدوات.',
  'Engines that render shots.': 'محركات إنشاء اللقطات.',
  'Stills, and reference frames for video.': 'الصور الثابتة والإطارات المرجعية للفيديو.',
  'Narration. Synthesis is not ported to mobile yet.': 'التعليق الصوتي. التوليد الصوتي غير متاح على الهاتف بعد.',
  'Browser sessions': 'جلسات المتصفح',
  'Spending permissions': 'أذونات الإنفاق', 'asks each time': 'السؤال في كل مرة',
  'Monthly limit': 'الحد الشهري', 'No limit': 'بلا حد', 'Enter a number of dollars greater than zero, or leave it empty for no limit.': 'أدخل مبلغًا بالدولار أكبر من صفر، أو اترك الحقل فارغًا بلا حد.',
  'Usage reporting': 'إحصاءات الاستخدام', 'Send anonymous usage counts': 'إرسال إحصاءات استخدام مجهولة',
  'Reset': 'إعادة ضبط', 'About': 'حول التطبيق', 'Developer': 'المطوّر', 'Site': 'الموقع', 'Contact': 'التواصل', 'or': 'أو',
  'Privacy policy': 'سياسة الخصوصية', 'Terms of service': 'شروط الخدمة', 'Version': 'الإصدار',
  'Test suite': 'مجموعة الاختبار', 'Opened': 'فُتحت', 'Opening…': 'جارٍ الفتح…',
  'Needs a development build': 'يتطلب نسخة تطوير', 'Could not initialise': 'تعذّر التهيئة',
  'Ad mediation (development only)': 'وساطة الإعلانات (للتطوير فقط)',
  'Language': 'اللغة', 'العربية': 'العربية', 'English': 'English',
  'Delete “': 'حذف «', '” and its imported media? This cannot be undone.': '» والوسائط المستوردة؟ لا يمكن التراجع عن هذا الإجراء.',
  'OPEN ·': 'مفتوح ·', 'edited': 'آخر تعديل', 'NO IMAGE COVER': 'لا توجد صورة غلاف',
  'Project type': 'نوع المشروع', 'Selected': 'محدد', 'Open project': 'فتح المشروع',
  'Writer Studio': 'استوديو الكتابة', 'Production studio': 'استوديو الإنتاج', 'Project memory · local search': 'ذاكرة المشروع · بحث محلي',
  'EL KING AI · PRODUCTION': 'EL KING AI · استوديو الإنتاج', 'SEQUENCE / PLAN': 'التسلسل / الخطة',
  'SHOT BOARD': 'لوحة اللقطات', 'SOURCE MONITOR': 'شاشة المصدر',
  'Start by writing a story brief. This step does not generate video.': 'ابدأ بكتابة موجز القصة. هذه الخطوة لا تنشئ فيديو.',
  'Connect the selected writing provider in Settings to create a plan.': 'اربط مزوّد الكتابة المطلوب من الإعدادات لإنشاء خطة.',
  'Generate sends the brief, existing rewrite script, approved preceding documents and revision notes to the selected provider. Text-generation charges may apply. No video is generated.': 'يرسل الإنشاء الموجز والنص الحالي والمستندات السابقة المعتمدة وملاحظات المراجعة إلى المزوّد المحدد. قد تُفرض رسوم على إنشاء النص؛ لا يُنشأ فيديو.',
  'Brief changed. Generate a revised plan before approval.': 'تغيّر الموجز. أنشئ خطة محدثة قبل اعتمادها.',
  'Brief changed. Return to step 1 and generate a revised concept; dependent approvals will reset, with text retained.': 'تغيّر الموجز. عُد إلى الخطوة الأولى وأنشئ تصورًا محدثًا. ستُعاد الموافقات التابعة مع الاحتفاظ بالنص.',
  'Plan just the next scene. Approve its five-second shots before video generation. Existing character identities and visual style stay locked. You can also assemble now.': 'خطط للمشهد التالي فقط. اعتمد لقطاته ذات الخمس ثوانٍ قبل إنشاء الفيديو. ستبقى الشخصيات والأسلوب البصري كما هما. يمكنك التجميع الآن أيضًا.',
  'Build the rest of your film': 'أكمل بقية الفيلم', 'Quick clip': 'مقطع سريع',
  'Idea → screenplay → segments/scenes → video prompts. Edit and approve each step; nothing advances automatically.': 'فكرة ← سيناريو ← مشاهد ← أوامر فيديو. راجع كل خطوة واعتمدها؛ لا ينتقل شيء تلقائيًا.',
  'No matches. Approve the script before searching production shots.': 'لا توجد نتائج. اعتمد السيناريو قبل البحث عن لقطات الإنتاج.',
  'Review the next take below, then approve it.': 'راجع اللقطة التالية أدناه ثم اعتمدها.', 'Generate this shot again': 'إنشاء هذه اللقطة مجددًا',
  'Prepare regeneration': 'التحضير لإعادة الإنشاء', 'Run': 'تشغيل', 'Decline': 'رفض', 'Allow once': 'السماح مرة واحدة',
  'Reject candidate': 'رفض النتيجة', 'Stop after current shot': 'التوقف بعد اللقطة الحالية', 'Show older videos': 'عرض الفيديوهات الأقدم',
  'No style decisions recorded yet.': 'لم تُسجّل قرارات للأسلوب بعد.',
  '＋ Add a custom provider': '＋ إضافة مزوّد مخصص', '+ Add': '+ إضافة', 'Add': 'إضافة', 'Custom provider': 'مزوّد مخصص',
  'Name': 'الاسم', 'Base URL': 'عنوان URL الأساسي', 'Models': 'النماذج', 'API key': 'مفتاح API',
  'Add reference to prompt': 'إضافة مرجع إلى الوصف', 'Save Workspace ID': 'حفظ معرّف مساحة العمل',
  'Save or share': 'حفظ أو مشاركة', 'Add & open editor': 'إضافة وفتح المحرر', 'New': 'جديد',
  'No media matches the current filters.': 'لا توجد وسائط تطابق عوامل التصفية الحالية.',
  'No media yet. Import a clip, or generate one under Video.': 'لا توجد وسائط بعد. استورد مقطعًا أو أنشئ واحدًا من تبويب الفيديو.',
  'Media removed. Prompt retained.': 'أُزيلت الوسائط مع الاحتفاظ بالوصف.',
  'Open a project first — generated shots are saved into it.': 'افتح مشروعًا أولًا لحفظ اللقطات المُنشأة فيه.',
  'Motion Control remains visible here but runs only in the desktop app, where EL KING AI can safely read project video files and reach your user-managed ComfyUI worker.': 'يظل Motion Control ظاهرًا هنا، لكنه يعمل على الحاسوب فقط؛ حيث يمكن للتطبيق قراءة ملفات المشروع بأمان والاتصال بخادم ComfyUI الذي تديره.',
  'Signed-in Google Flow video automation is desktop-only. Grok Imagine browser automation is desktop-only too. Login, CAPTCHA, verification, and account-limit states must be resolved on desktop; mobile continues to use supported official API-key routes.': 'أتمتة الفيديو عبر Google Flow وGrok Imagine متاحة على الحاسوب فقط. يجب إكمال تسجيل الدخول والتحقق وحدود الحساب على الحاسوب؛ ويستخدم الهاتف مسارات مفاتيح API الرسمية المدعومة.',
  'Local whisper.cpp transcription runs on desktop because mobile cannot launch EL KING AI\'s managed executable or FFmpeg worker. Generate there; this screen can review, approve, and apply the same saved transcript.': 'يعمل التفريغ عبر whisper.cpp على الحاسوب لأن الهاتف لا يستطيع تشغيل الأدوات المحلية. أنشئ التفريغ هناك، ثم راجعه واعتمده وطبّقه من هذه الشاشة.',
  'Mobile can edit, approve, and apply the same narration plan. Speech synthesis stays disabled until its binary result transport is implemented; Qwen TTS needs the desktop-local wrapper and VieNeu-TTS needs its desktop-local server. This screen cannot charge any provider.': 'يمكن للهاتف تعديل خطة التعليق الصوتي واعتمادها وتطبيقها. يظل توليد الصوت معطلًا حتى يتوفر نقل ملفاته؛ إذ يحتاج Qwen TTS إلى أداة الحاسوب المحلية وVieNeu-TTS إلى خادمه المحلي. هذه الشاشة لا تفرض رسومًا.',
  'Mobile can prepare and apply captions. Speech synthesis is unavailable until audio result transport is implemented; use desktop to synthesize. Opening a tool does not charge a provider.': 'يمكن للهاتف إعداد الترجمات وتطبيقها. توليد الصوت غير متاح حتى يكتمل نقل نتائجه؛ استخدم الحاسوب للتوليد. فتح الأداة لا يفرض رسومًا.',
  'The transcript source asset is no longer in this project.': 'لم يعد ملف مصدر التفريغ موجودًا في هذا المشروع.',
  'Writer dialogue changed. Reload it, or rebuild from your edited script.': 'تغيّر الحوار. أعد تحميله أو أعد البناء من السيناريو المعدّل.',
  'Performance cues stay out of captions. Add each cue immediately before the words it should affect.': 'لا تظهر توجيهات الأداء في الترجمة. أضف كل توجيه قبل الكلمات التي يخصها مباشرة.',
  'Narration & Subtitles': 'التعليق الصوتي والترجمة', 'Narration script': 'نص التعليق الصوتي', 'Automatic subtitles from audio or video': 'ترجمة تلقائية من الصوت أو الفيديو',
  'Prepare voice text and timed captions together. Review and approve before either is used.': 'جهّز نص التعليق والترجمات الموقّتة معًا، ثم راجعهما واعتمدهما قبل الاستخدام.',
  'Input mode': 'وضع الإدخال', 'Dialogue language': 'لغة الحوار', 'Emotional goal': 'الهدف العاطفي',
  'Continuity': 'الاستمرارية', 'Continuity review': 'مراجعة الاستمرارية', 'Decisions': 'القرارات',
  'Creative brief source': 'مصدر الموجز الإبداعي', 'Revision notes for this stage': 'ملاحظات المراجعة لهذه المرحلة',
  'Scenario · carried by every shot': 'السيناريو · يرافق كل لقطة', 'Script version': 'نسخة السيناريو',
  'Scenes in story order': 'المشاهد حسب ترتيب القصة', 'Scene length': 'مدة المشهد', 'Length': 'المدة',
  'Aspect ratio': 'نسبة الأبعاد', 'Frame ratio': 'نسبة الإطار', 'Film shot model': 'نموذج لقطات الفيلم',
  'Video style': 'أسلوب الفيديو', 'Voice model': 'نموذج الصوت', 'Model': 'النموذج',
  'First frame': 'الإطار الأول', 'Last frame': 'الإطار الأخير', 'Repeat in every shot prompt': 'التكرار في وصف كل لقطة',
  'Start each shot from the last frame of the one before': 'بدء كل لقطة من الإطار الأخير للسابقة',
  'Place the transcript source asset on the timeline first. Trim, offset and speed will be mapped automatically.': 'ضع ملف مصدر التفريغ على التايملاين أولًا. ستُضبط القصّة والإزاحة والسرعة تلقائيًا.',
  'Activity': 'النشاط', 'Other': 'أخرى', 'Promise': 'الوعد', 'Properties': 'الخصائص', 'Prompt': 'الوصف',
  'Planned video prompt': 'وصف الفيديو المخطط', 'Edit selected prompt': 'تعديل الوصف المحدد',
  'No image cover': 'لا توجد صورة غلاف', 'frame': 'إطار',
  'Language preference is saved on this device.': 'يُحفظ اختيار اللغة على هذا الجهاز.',
  'Limit reached: first 256 excerpts, up to 12,000 characters per source.': 'تم بلوغ الحد: أول 256 مقتطفًا، بحد أقصى 12,000 حرف لكل مصدر.',
  'Dismiss': 'إخفاء', 'Remove this provider': 'إزالة هذا المزوّد', '−1s': '−١ ث', '+1s': '+١ ث',
  'EL KING AI': 'EL KING AI', 'EL KING AI /': 'EL KING AI /', 'EDIT': 'مونتاج', 'CREATE': 'إنشاء',
  'Video Editing': 'تحرير الفيديو', 'AI Creation': 'الإنشاء بالذكاء الاصطناعي',
  'Shape existing footage into a finished cut.': 'حرّر مقاطعك لصناعة فيديو نهائي.',
  'Build new videos from a story, prompts and reference frames.': 'أنشئ فيديوهات من قصة وأوصاف وإطارات مرجعية.',
  'Timeline · Trim · Arrange · Export': 'تايملاين · قص · ترتيب · تصدير', 'Script · Images · Video · Voice': 'سيناريو · صور · فيديو · صوت',
  'Open in editor →': 'فتح في المحرر ←', 'Create editing project →': 'إنشاء مشروع مونتاج ←',
  'Exporting…': 'جارٍ التصدير…', 'Saved to ': 'تم الحفظ في ',
  'Saved to your photo library.': 'تم الحفظ في مكتبة الصور.', 'Saved to the app you chose.': 'تم الحفظ في التطبيق الذي اخترته.',
  'Saved to your photo library, but it does not match the cut. ': 'تم الحفظ في مكتبة الصور، لكن الملف لا يطابق المونتاج. ',
  'Saved to the app you chose, but it does not match the cut. ': 'تم الحفظ في التطبيق الذي اخترته، لكن الملف لا يطابق المونتاج. ',
  'Copy failed': 'تعذّر النسخ', 'Create editing project?': 'إنشاء مشروع مونتاج؟',
  'Copy all saved media into a new editing project with an empty timeline. Original videos and prompts stay here.': 'انسخ كل الوسائط المحفوظة إلى مشروع مونتاج جديد بتايملاين فارغ. ستبقى الفيديوهات والأوصاف الأصلية هنا.',
  'Plan next scene?': 'تخطيط المشهد التالي؟', 'Text-model charges may apply. Video generation starts only after separate approval.': 'قد تُفرض رسوم على نموذج النص. لن يبدأ إنشاء الفيديو إلا بعد موافقة منفصلة.',
  'Plan scene': 'تخطيط المشهد', 'Add this scene?': 'إضافة هذا المشهد؟', 'Earlier approved takes will stay attached to their shots.': 'ستبقى اللقطات المعتمدة سابقًا مرتبطة بمشاهدها.',
  'Add scene': 'إضافة المشهد', 'Discard next-scene proposal?': 'تجاهل اقتراح المشهد التالي؟', 'Existing scenes and takes stay saved.': 'ستظل المشاهد واللقطات الحالية محفوظة.',
  'Discard': 'تجاهل', 'Generate production plan?': 'إنشاء خطة الإنتاج؟', 'Text-model charges may apply. This replaces the planning draft, not existing media. No video generation starts.': 'قد تُفرض رسوم على نموذج النص. سيُستبدل مسودّة التخطيط فقط دون المساس بالوسائط. لن يبدأ إنشاء فيديو.',
  'Propose plan': 'اقتراح خطة', 'Replace planning draft?': 'استبدال مسودة الخطة؟', 'Save the retained proposal over the current draft?': 'هل تريد حفظ الاقتراح المحتفظ به بدل المسودة الحالية؟',
  'Approve first scene?': 'اعتماد المشهد الأول؟', 'Save this scene and its five-second shots. Video generation asks for cost approval separately.': 'احفظ هذا المشهد ولقطاته ذات الخمس ثوانٍ. يتطلب إنشاء الفيديو موافقة منفصلة على التكلفة.',
  'Approve scene': 'اعتماد المشهد', 'Approve checkpoint': 'اعتماد المرحلة', 'Approve candidate': 'اعتماد النتيجة',
  'Approve generation cost': 'الموافقة على تكلفة الإنشاء', 'Generate shots': 'إنشاء اللقطات', 'Generate shot': 'إنشاء اللقطة',
  'Load prompt': 'تحميل الوصف', 'Replace prompt?': 'استبدال الوصف؟',
  'Your saved media stays unchanged.': 'ستبقى الوسائط المحفوظة دون تغيير.',
  'Plan navigator, not a synchronized final cut. Loading a prompt does not generate. Original media is kept.': 'مستعرض الخطة لا يمثّل المونتاج النهائي المتزامن. تحميل وصف لا يبدأ إنشاءً، وتبقى الوسائط الأصلية محفوظة.',
  'Single-source preview ·': 'معاينة مصدر واحد ·', 'Audio preview is available in the Voice tool; inline playback is not supported here yet.': 'معاينة الصوت متاحة في أداة الصوت؛ التشغيل هنا غير مدعوم بعد.',
  'Select a saved take below. Shots without media stay visible as planned.': 'اختر لقطة محفوظة أدناه. ستظل اللقطات التي بلا وسائط ظاهرة ضمن الخطة.',
  'shots approved ·': 'لقطات معتمدة ·', 'missing media ·': 'وسائط مفقودة ·', 'need review': 'بحاجة إلى مراجعة',
  'Unplaced': 'غير موضوع', 'No video yet.': 'لا يوجد فيديو بعد.', 'No voice yet.': 'لا يوجد صوت بعد.', 'No subtitles yet.': 'لا توجد ترجمة بعد.',
  'Caption at inspected time:': 'الترجمة عند الوقت المحدد:', 'None': 'لا يوجد',
  'Append voice and save': 'إضافة الصوت والحفظ',
  'Scene approvals and generation results will appear here.': 'ستظهر هنا موافقات المشاهد ونتائج الإنشاء.',
  'Select the current scene, finish its five-second shots, then continue. Assembly joins approved scenes on the timeline.': 'حدّد المشهد الحالي وأكمل لقطاته ذات الخمس ثوانٍ، ثم تابع. يجمع التجميع المشاهد المعتمدة على التايملاين.',
  'Not now': 'ليس الآن',
  'Fix the JSON below to enable the shot editor. Incomplete JSON can still be saved as a draft.': 'أصلح JSON أدناه لتفعيل محرر اللقطات. يمكن حفظ JSON غير المكتمل كمسودة.',
  'Audio cues (one per line)': 'توجيهات الصوت (توجيه واحد في كل سطر)',
  'Ask for a plan, a script check, an image, or a shot. Every tool call is shown for approval first, and anything that charges your provider says the price before it runs.': 'اطلب خطة أو مراجعة نص أو صورة أو لقطة. يظهر كل استدعاء أداة للموافقة أولًا، وتُعرض تكلفة أي عملية مدفوعة قبل تشغيلها.',
  'The image is not kept with the transcript. Generate it again to see it.': 'لا تُحفظ الصورة مع سجل المحادثة. أنشئها مجددًا لعرضها.',
  'Detach audio is currently desktop-only. Mobile keeps the video\'s embedded sound during preview and export.': 'فصل الصوت متاح حاليًا على الحاسوب فقط. يحتفظ الهاتف بالصوت المضمّن في الفيديو أثناء المعاينة والتصدير.',
  'Generate an image': 'إنشاء صورة', 'Runs against your own provider account, through the shared adapters.': 'يتم الإنشاء عبر حسابك لدى المزوّد باستخدام الوصلات المشتركة.',
  'Signed-in Google Flow automation is desktop-only. Manual login or verification must be resolved on desktop; mobile continues to use the official Gemini API key.': 'أتمتة Google Flow عبر جلسة تسجيل الدخول متاحة على الحاسوب فقط. أكمل تسجيل الدخول أو التحقق هناك؛ ويواصل الهاتف استخدام مفتاح Gemini API الرسمي.',
  'Signed-in Grok Imagine automation is desktop-only. Manual login or verification must be resolved on desktop; mobile uses supported official API-key routes only.': 'أتمتة Grok Imagine عبر جلسة تسجيل الدخول متاحة على الحاسوب فقط. أكمل تسجيل الدخول أو التحقق هناك؛ ويستخدم الهاتف مسارات مفاتيح API الرسمية المدعومة فقط.',
  'This model and framing are used for scene and shot generation below. Each run still asks for cost approval.': 'يُستخدم هذا النموذج والتأطير لإنشاء المشاهد واللقطات أدناه. تتطلب كل عملية موافقة على التكلفة.',
  'For a one-off video. The screenplay and scene board above are the film production flow.': 'لفيديو مستقل. السيناريو ولوحة المشاهد أعلاه مخصصان لمسار إنتاج الفيلم.',
  'Shot lengths and prices come from the same modules the desktop app uses.': 'تأتي مدد اللقطات وأسعارها من الوحدات نفسها التي يستخدمها تطبيق الحاسوب.',
  'Choose 8s for this manual advanced-input render. It runs as one reviewed shot.': 'اختر 8 ثوانٍ لهذا الإخراج اليدوي ذي المدخلات المتقدمة. يُنفّذ كلقطة واحدة للمراجعة.',
  'Prepare regeneration loads the saved prompt only, without spending. Reselect model, duration, operation and reference media before generating a new candidate. Original videos are kept.': 'يحمّل التحضير لإعادة الإنشاء الوصف المحفوظ فقط دون تكلفة. أعد اختيار النموذج والمدة والعملية والوسائط المرجعية قبل إنشاء نتيجة جديدة. تبقى الفيديوهات الأصلية محفوظة.',
  'Finished candidates are saved in the project library. Review each one above; only an approved take changes the timeline.': 'تُحفظ النتائج المكتملة في مكتبة المشروع. راجعها أعلاه؛ ولا يغيّر التايملاين إلا اعتماد لقطة.',
  'If the phone closes during a provider request, it is never submitted again automatically. Only a returned result saved into the project is treated as completed.': 'إذا أُغلق الهاتف أثناء طلب للمزوّد، فلن يُرسل الطلب مجددًا تلقائيًا. تُعد العملية مكتملة فقط عند حفظ النتيجة المستلمة في المشروع.',
  'Gemini and Grok browser-session sign-in is desktop-only because it needs an isolated Electron profile and OS safeStorage. Mobile keeps this path disabled; use provider API keys stored in Keychain or Keystore here.': 'تسجيل الدخول إلى Gemini وGrok عبر جلسة المتصفح متاح على الحاسوب فقط، لحاجته إلى ملف Electron معزول وتخزين النظام الآمن. هذا المسار معطّل على الهاتف؛ استخدم مفاتيح API المحفوظة في Keychain أو Keystore.',
  'Generation charges your own provider account, so each kind asks before the first one. “Always” is remembered per kind — allowing every image is a different decision from allowing every video, and they do not cost the same.': 'تُخصم تكلفة الإنشاء من حسابك لدى المزوّد، لذا يطلب التطبيق الموافقة قبل أول عملية من كل نوع. يُحفظ خيار «دائمًا» لكل نوع على حدة؛ فالسماح لكل الصور قرار منفصل عن السماح لكل الفيديوهات، وتختلف تكلفتهما.',
  'Anonymous counts — how often an export runs or finishes, and which screens get used — sent to the developer’s own server rather than to a third party. Never your prompts, projects, media, file names, or keys, and there is no account to attach any of it to.': 'تُرسل إحصاءات مجهولة إلى خادم المطوّر عن مرات بدء التصدير أو اكتماله والشاشات المستخدمة. لا تُرسل الأوصاف أو المشاريع أو الوسائط أو أسماء الملفات أو المفاتيح، ولا يوجد حساب لربط هذه البيانات به.',
  'LevelPlay’s Test Suite. Shows which of the five networks — ironSource, Unity Ads, AppLovin, Meta, Pangle — actually made it into this binary, and loads a test ad for each placement. Development builds request no live ad, so this is the only place an ad appears before a store build.': 'تعرض مجموعة اختبار LevelPlay شبكات الإعلانات الخمس المضمّنة فعليًا في هذا التطبيق (ironSource وUnity Ads وAppLovin وMeta وPangle)، وتحمل إعلانًا تجريبيًا لكل موضع. لا تطلب نسخ التطوير إعلانات حقيقية، لذا يظهر الإعلان فيها هنا فقط قبل نسخة المتجر.',
  'EL KING AI is free. Ads pay for it — a banner here, and a full-screen ad after an export finishes, mediated by Unity LevelPlay. There is no paid tier, nothing is unlocked by watching one, and the desktop app has no ads at all.': 'تطبيق EL KING AI مجاني، وتموّله الإعلانات: إعلان شريطي هنا وإعلان ملء الشاشة بعد اكتمال التصدير عبر Unity LevelPlay. لا توجد باقة مدفوعة أو مزايا تُفتح بمشاهدة إعلان، ولا إعلانات في تطبيق الحاسوب.',
  'Timing follows Writer shots or is distributed across the script. It is not word-level audio alignment; listen and fine-tune after creating voice on desktop.': 'يتبع التوقيت لقطات الكاتب أو يوزّعها على النص. لا يطابق الصوت كلمةً بكلمة؛ استمع واضبطه بعد إنشاء الصوت على الحاسوب.',
  'The approved screenplay is preserved on save. Change story text in step 2.': 'يُحفظ السيناريو المعتمد كما هو. غيّر نص القصة في الخطوة الثانية.',
  'Export needs a development build — Expo Go carries only the modules baked into it, and the renderer is this project\'s own. Everything else on this screen works.': 'يتطلب التصدير نسخة تطوير؛ إذ لا يحتوي Expo Go إلا على الوحدات المضمّنة، ومحرك العرض في هذا المشروع مخصص له. بقية وظائف هذه الشاشة متاحة.',
  'Any endpoint that speaks the OpenAI chat-completions API — Alibaba, a gateway, or your own server. Chat only: image and video providers each need their own adapter, so a URL alone cannot drive them.': 'يقبل أي عنوان يدعم واجهة OpenAI chat-completions، مثل Alibaba أو بوابة وسيطة أو خادمك. للمحادثة فقط؛ إذ يحتاج مزوّدو الصور والفيديو إلى موائم خاص، ولا يكفي عنوان URL وحده لتشغيلهم.',
  'The base URL is the part before /chat/completions. The key is held in the device keystore, like every other provider.': 'عنوان الأساس هو الجزء السابق لـ /chat/completions. يُحفظ المفتاح في مخزن الجهاز الآمن مثل مفاتيح المزوّدين الآخرين.',
  'Deleting removes the file from the project and every clip that used it. It cannot be undone.': 'يحذف هذا الملف من المشروع ومن كل المقاطع التي تستخدمه. لا يمكن التراجع عن الحذف.',
  'Connecting a provider makes its models selectable. Keys are held in the device keystore and never read back for display.': 'يتيح ربط المزوّد اختيار نماذجه. تُحفظ المفاتيح في مخزن الجهاز الآمن ولا تُقرأ مجددًا لعرضها.',
  'Search stays on this device. Added references are sent to the selected provider when you generate. Review copied text again if its source changes.': 'يبقى البحث على هذا الجهاز. تُرسل المراجع المضافة إلى المزوّد المحدد عند الإنشاء. راجع النص المنسوخ مجددًا إذا تغيّر مصدره.',
  'Opens your browser, so the password is typed there and never in this app. Serves only the models that backend runs; a key reaches everything else.': 'يفتح المتصفح لإدخال كلمة المرور هناك، ولا تُكتب داخل التطبيق. يوفّر النماذج التي يشغّلها الخادم فقط؛ أما بقية النماذج فتحتاج إلى مفتاح.',
  'Held in the device keystore — Keychain on iOS, Keystore on Android. Never read back for display.': 'يُحفظ في مخزن الجهاز الآمن — Keychain على iOS وKeystore على Android — ولا يُقرأ مجددًا لعرضه.',
  'Performance script (voice only)': 'نص الأداء (للصوت فقط)',
  'not on the timeline': 'غير موجود على التايملاين',
  'First scene length': 'مدة المشهد الأول', 'Film length': 'مدة الفيلم', 'Scene by scene': 'مشهدًا تلو الآخر', 'Whole film': 'الفيلم كاملًا',
  'language and writing model': 'اللغة ونموذج الكتابة', 'Hide': 'إخفاء', 'Show': 'عرض',
  'local': 'محلي', 'connected': 'متصل', 'no key': 'لا يوجد مفتاح', 'needs Workspace ID': 'يتطلب معرّف مساحة العمل', 'not connected': 'غير متصل',
  'Remove stored key': 'إزالة المفتاح المحفوظ', 'Singapore Workspace ID': 'معرّف مساحة عمل سنغافورة',
  'saved': 'محفوظ', 'required for video': 'مطلوب للفيديو', 'Sign out of ChatGPT': 'تسجيل الخروج من ChatGPT', 'Sign in with ChatGPT': 'تسجيل الدخول عبر ChatGPT',
  'Delete from the project': 'حذف من المشروع',
  'Shot prompts': 'أوصاف اللقطات', 'Approved takes': 'اللقطات المعتمدة', 'Final cut': 'المونتاج النهائي', 'Current cut': 'المونتاج الحالي',
  'Hide full screenplay': 'إخفاء السيناريو كاملًا', 'Read full screenplay': 'قراءة السيناريو كاملًا', 'Hide final-cut details': 'إخفاء تفاصيل المونتاج النهائي',
  'Hide screenplay and plan controls': 'إخفاء أدوات السيناريو والخطة', 'Screenplay and plan controls': 'أدوات السيناريو والخطة',
  'Quick clip · separate from this film': 'مقطع سريع · مستقل عن هذا الفيلم', 'Hide quick clip tools': 'إخفاء أدوات المقطع السريع',
  'Generate this stage': 'إنشاء هذه المرحلة', 'Regenerate this stage': 'إعادة إنشاء هذه المرحلة', 'Advanced scene / shot JSON (editable)': 'JSON متقدم للمشاهد واللقطات (قابل للتحرير)', 'Full document (editable)': 'المستند كاملًا (قابل للتحرير)',
  'Approved': 'معتمد', 'Unsaved draft': 'مسودة غير محفوظة', 'Review': 'مراجعة', 'Review takes': 'مراجعة اللقطات',
  'Redo with a note': 'إعادة الإنشاء مع ملاحظة', 'Redoing…': 'جارٍ إعادة الإنشاء…', 'Approved on timeline': 'معتمد على التايملاين', 'Approve to timeline': 'اعتماد وإضافة إلى التايملاين',
  'Choose image': 'اختيار صورة', 'Remove': 'إزالة',
  'Unused only': 'غير مستخدم فقط', 'Delete +': 'حذف +', 'Add a provider': 'إضافة مزوّد', 'Choose a model': 'اختيار نموذج',
  'Error': 'خطأ', 'Working…': 'جارٍ العمل…', 'Generate': 'إنشاء', 'Generating…': 'جارٍ الإنشاء…'
};

export function translate(value: string, locale: Locale): string {
  if (locale === 'en') return value;
  const deleteCount = value.match(/^Delete \+ (\d+)$/);
  if (deleteCount) return `حذف + ${deleteCount[1]}`;
  const clipCount = value.match(/^(\d+) clips?$/);
  if (clipCount) return `${clipCount[1]} ${clipCount[1] === '1' ? 'مقطع' : 'مقاطع'}`;
  const saved = value.match(/^Saved to (.+)\.$/);
  if (saved) return `تم الحفظ في ${saved[1]}.`;
  const edited = value.match(/^(OPEN · )?edited (\d{4}-\d{2}-\d{2} \d{2}:\d{2})$/);
  if (edited) return `${edited[1] === undefined ? '' : 'مفتوح · '}${edited[2]}`;
  const deleteProject = value.match(/^Delete “(.*)” and its imported media\? This cannot be undone\.$/);
  if (deleteProject) return `هل تريد حذف «${deleteProject[1]}» والوسائط المستوردة؟ لا يمكن التراجع عن ذلك.`;
  const appearanceCount = value.match(/^Apply appearance to (\d+) automatic captions?$/);
  if (appearanceCount) {
    const count = Number(appearanceCount[1]);
    return count === 1
      ? `تطبيق المظهر على ترجمة تلقائية واحدة`
      : `تطبيق المظهر على ${count} ترجمات تلقائية`;
  }
  const normalized = value.replace(/\s+/g, ' ').trim();
  const translated = AR[normalized];
  if (translated === undefined) return value;
  const leading = value.match(/^\s*/)?.[0] ?? '';
  const trailing = value.match(/\s*$/)?.[0] ?? '';
  return `${leading}${translated}${trailing}`;
}

type LocaleContextValue = { readonly locale: Locale; readonly setLocale: (locale: Locale) => void };
const LocaleContext = createContext<LocaleContextValue>({ locale: 'ar', setLocale: () => undefined });
const LOCALE_KEY = 'openvideo.locale';
let currentLocale: Locale = 'ar';
let localeSaveQueue: Promise<void> = Promise.resolve();

export function getCurrentLocale(): Locale {
  return currentLocale;
}

export function LocaleProvider({ children }: { readonly children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ar');
  const changedByUser = useRef(false);
  useEffect(() => {
    let mounted = true;
    void SecureStore.getItemAsync(LOCALE_KEY).then((saved) => {
      if (mounted && !changedByUser.current && (saved === 'ar' || saved === 'en')) {
        currentLocale = saved;
        setLocaleState(saved);
      }
    }).catch(() => undefined);
    return () => { mounted = false; };
  }, []);
  const setLocale = useCallback((next: Locale) => {
    changedByUser.current = true;
    currentLocale = next;
    setLocaleState(next);
    localeSaveQueue = localeSaveQueue.then(() => SecureStore.setItemAsync(LOCALE_KEY, next)).catch((): void => undefined);
  }, []);
  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}
