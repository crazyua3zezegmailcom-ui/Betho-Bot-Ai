/**
 * ═══════════════════════════════════════════════════════
 *              🎓 لعبة العباقرة - WhatsApp Bot
 *          مستوحاة من برنامج العباقرة المصري
 *          (ملف مدمج: بنك الأسئلة + منطق اللعبة)
 * ═══════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════
//                    📚 بنك الأسئلة
// ═══════════════════════════════════════════════════════

/**
 * بنك أسئلة لعبة العباقرة
 * يحتوي على أكثر من 2500 سؤال في مختلف المجالات
 * 
 * هيكل كل سؤال:
 * {
 *   q: "نص السؤال",
 *   a: ["الإجابة الصحيحة", "بديل مقبول", ...],
 *   difficulty: "medium" | "hard",
 *   category: "history" | "geography" | "science" | "sports" | "general" | "religion" | "programming"
 * }
 */

const questions = [

  // ════════════════════════════════════════
  //              📜 التاريخ
  // ════════════════════════════════════════

  { q: "في أي عام فتح المسلمون مدينة القسطنطينية؟", a: ["1453", "٩٥٤١"], difficulty: "medium", category: "history" },
  { q: "من هو أول خليفة راشدي في الإسلام؟", a: ["أبو بكر الصديق", "ابو بكر"], difficulty: "medium", category: "history" },
  { q: "في أي عام بدأت الحرب العالمية الأولى؟", a: ["1914", "١٩١٤"], difficulty: "medium", category: "history" },
  { q: "في أي عام انتهت الحرب العالمية الثانية؟", a: ["1945", "١٩٤٥"], difficulty: "medium", category: "history" },
  { q: "من بنى الأهرامات؟", a: ["المصريون القدماء", "الفراعنة", "قدماء المصريين"], difficulty: "medium", category: "history" },
  { q: "ما هي عاصمة الدولة العثمانية؟", a: ["القسطنطينية", "اسطنبول", "إسطنبول"], difficulty: "medium", category: "history" },
  { q: "من اكتشف أمريكا؟", a: ["كريستوفر كولومبس", "كولومبس"], difficulty: "medium", category: "history" },
  { q: "في أي عام وقعت معركة بدر؟", a: ["624", "٢ هجري", "2 هجري"], difficulty: "hard", category: "history" },
  { q: "من هو مؤسس الدولة العثمانية؟", a: ["عثمان الأول", "عثمان بن أرطغرل"], difficulty: "hard", category: "history" },
  { q: "ما اسم أول إنسان يمشي على القمر؟", a: ["نيل أرمسترونج", "نيل ارمسترونغ"], difficulty: "medium", category: "history" },
  { q: "في أي عام سقط جدار برلين؟", a: ["1989", "١٩٨٩"], difficulty: "medium", category: "history" },
  { q: "من هو الفرعون الذي حكم مصر أطول فترة؟", a: ["رمسيس الثاني", "رمسيس 2"], difficulty: "hard", category: "history" },
  { q: "في أي عام أُعلن قيام دولة إسرائيل؟", a: ["1948", "١٩٤٨"], difficulty: "medium", category: "history" },
  { q: "من هو قائد جيش الإسكندر الأكبر الذي فتح مصر؟", a: ["الإسكندر الأكبر نفسه", "الإسكندر"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم المعركة التي انتصر فيها صلاح الدين على الصليبيين عام 1187؟", a: ["معركة حطين", "حطين"], difficulty: "hard", category: "history" },
  { q: "في أي عام ولد النبي محمد صلى الله عليه وسلم؟", a: ["570", "571", "عام الفيل"], difficulty: "medium", category: "history" },
  { q: "ما اسم أشهر ملكة في التاريخ المصري القديم؟", a: ["كليوباترا", "نفرتيتي"], difficulty: "medium", category: "history" },
  { q: "في أي قرن بنيت الأهرامات؟", a: ["القرن السادس والعشرين قبل الميلاد", "26 ق.م", "2560 ق م"], difficulty: "hard", category: "history" },
  { q: "من قاد الثورة الفرنسية؟", a: ["روبسبير", "لا يوجد قائد واحد", "الشعب الفرنسي"], difficulty: "hard", category: "history" },
  { q: "في أي عام هاجر النبي من مكة إلى المدينة؟", a: ["622", "١ هجري", "1 هجري"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم آخر فرعون مصري؟", a: ["نكتانبو الثاني", "كليوباترا السابعة"], difficulty: "hard", category: "history" },
  { q: "من هو الرئيس الأمريكي الذي ألغى العبودية؟", a: ["أبراهام لينكولن", "لينكولن"], difficulty: "medium", category: "history" },
  { q: "في أي عام وقعت ثورة أكتوبر في روسيا؟", a: ["1917", "١٩١٧"], difficulty: "medium", category: "history" },
  { q: "ما اسم الحضارة التي بنت المايا؟", a: ["الحضارة المايا", "المايا"], difficulty: "medium", category: "history" },
  { q: "من هو مؤسس الإمبراطورية المنغولية؟", a: ["جنكيز خان", "جنكيز"], difficulty: "medium", category: "history" },
  { q: "في أي عام بنيت الكعبة المشرفة؟", a: ["بناها إبراهيم وإسماعيل", "بناها سيدنا إبراهيم"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم أول دستور في التاريخ الإسلامي؟", a: ["وثيقة المدينة", "صحيفة المدينة"], difficulty: "hard", category: "history" },
  { q: "في أي عام وقعت معركة القادسية؟", a: ["636", "637", "16 هجري"], difficulty: "hard", category: "history" },
  { q: "من هو أول من طاف حول الأرض؟", a: ["ماجلان", "فرناندو ماجلان"], difficulty: "medium", category: "history" },
  { q: "في أي عام انتهت الحرب الباردة؟", a: ["1991", "١٩٩١"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم المستعمرة البريطانية التي أصبحت الولايات المتحدة؟", a: ["المستعمرات الأمريكية الثلاث عشرة", "المستعمرات البريطانية"], difficulty: "hard", category: "history" },
  { q: "من هو صاحب نظرية التطور؟", a: ["داروين", "تشارلز داروين"], difficulty: "medium", category: "history" },
  { q: "في أي عام أُسست منظمة الأمم المتحدة؟", a: ["1945", "١٩٤٥"], difficulty: "medium", category: "history" },
  { q: "ما اسم الحرب التي دارت بين مصر وإسرائيل عام 1973؟", a: ["حرب أكتوبر", "حرب رمضان", "حرب يوم الغفران"], difficulty: "medium", category: "history" },
  { q: "من هو الخليفة الذي جمع القرآن الكريم في مصحف واحد؟", a: ["عثمان بن عفان", "سيدنا عثمان"], difficulty: "medium", category: "history" },
  { q: "في أي عام وقعت ثورة 23 يوليو في مصر؟", a: ["1952", "١٩٥٢"], difficulty: "medium", category: "history" },
  { q: "من قاد الثورة الأمريكية؟", a: ["جورج واشنطن", "واشنطن"], difficulty: "medium", category: "history" },
  { q: "ما اسم الفيلسوف اليوناني الذي كان أستاذ الإسكندر الأكبر؟", a: ["أرسطو"], difficulty: "medium", category: "history" },
  { q: "في أي مدينة أُلقيت أول قنبلة ذرية في التاريخ؟", a: ["هيروشيما"], difficulty: "medium", category: "history" },
  { q: "من هو مكتشف البنسلين؟", a: ["ألكسندر فليمنج", "فليمنج"], difficulty: "medium", category: "history" },
  { q: "في أي عام ولد الإسكندر الأكبر؟", a: ["356 ق.م", "356 قبل الميلاد"], difficulty: "hard", category: "history" },
  { q: "ما هو اسم أول حرب صليبية؟", a: ["الحملة الصليبية الأولى", "الحرب الصليبية الأولى"], difficulty: "medium", category: "history" },
  { q: "في أي عام وقعت معركة عين جالوت؟", a: ["1260", "658 هجري"], difficulty: "hard", category: "history" },
  { q: "من هو الزعيم الذي قاد استقلال الهند؟", a: ["المهاتما غاندي", "غاندي"], difficulty: "medium", category: "history" },
  { q: "في أي عام تأسست جامعة الدول العربية؟", a: ["1945", "١٩٤٥"], difficulty: "medium", category: "history" },
  { q: "ما اسم أول طائرة في التاريخ وصنعها الأخوان رايت؟", a: ["فلاير", "كيتي هوك"], difficulty: "hard", category: "history" },
  { q: "في أي مدينة وُقّعت وثيقة استقلال الولايات المتحدة؟", a: ["فيلادلفيا"], difficulty: "medium", category: "history" },
  { q: "من هو الرئيس المصري الأول بعد الثورة؟", a: ["محمد نجيب", "اللواء محمد نجيب"], difficulty: "hard", category: "history" },
  { q: "في أي عام فُتحت مكة المكرمة؟", a: ["630", "8 هجري"], difficulty: "medium", category: "history" },
  { q: "ما اسم السفينة التي غرقت عام 1912؟", a: ["تيتانيك", "التيتانيك"], difficulty: "medium", category: "history" },
  { q: "من هو مؤسس الدولة السعودية الأولى؟", a: ["محمد بن سعود", "الإمام محمد بن سعود"], difficulty: "hard", category: "history" },
  { q: "في أي عام تأسست منظمة التحرير الفلسطينية؟", a: ["1964", "١٩٦٤"], difficulty: "medium", category: "history" },
  { q: "من هو صلاح الدين الأيوبي؟", a: ["قائد مسلم فتح القدس", "محرر القدس من الصليبيين"], difficulty: "medium", category: "history" },
  { q: "في أي عام انتهت الحرب الكورية؟", a: ["1953", "١٩٥٣"], difficulty: "medium", category: "history" },
  { q: "ما اسم العالم الذي اخترع المصباح الكهربائي؟", a: ["توماس إديسون", "إديسون"], difficulty: "medium", category: "history" },
  { q: "في أي عام وقعت حادثة بيرل هاربر؟", a: ["1941", "١٩٤١"], difficulty: "medium", category: "history" },
  { q: "من هو مؤسس الجمهورية التركية؟", a: ["مصطفى كمال أتاتورك", "أتاتورك", "كمال أتاتورك"], difficulty: "medium", category: "history" },
  { q: "في أي عام وُلد الرئيس المصري جمال عبد الناصر؟", a: ["1918", "١٩١٨"], difficulty: "hard", category: "history" },
  { q: "ما هو اسم أول حضارة في التاريخ؟", a: ["السومرية", "حضارة سومر", "حضارة ما بين النهرين"], difficulty: "hard", category: "history" },
  { q: "من فتح الأندلس؟", a: ["طارق بن 𝐶𝑟𝑎𝑧𝑦", "موسى بن نصير وطارق بن 𝐶𝑟𝑎𝑧𝑦"], difficulty: "medium", category: "history" },
  { q: "في أي عام أُنشئت قناة السويس؟", a: ["1869", "١٨٦٩"], difficulty: "medium", category: "history" },
  { q: "من هو مخترع الهاتف؟", a: ["ألكسندر غراهام بيل", "غراهام بيل", "بيل"], difficulty: "medium", category: "history" },
  { q: "في أي عام تأسست الأمم المتحدة رسمياً؟", a: ["1945"], difficulty: "medium", category: "history" },
  { q: "ما اسم آخر سلاطين الدولة العثمانية؟", a: ["محمد السادس", "محمد السادس وحيد الدين"], difficulty: "hard", category: "history" },
  { q: "من هو أول رئيس للولايات المتحدة الأمريكية؟", a: ["جورج واشنطن", "واشنطن"], difficulty: "medium", category: "history" },
  { q: "في أي عام وقعت الثورة الإيرانية؟", a: ["1979", "١٩٧٩"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم القائد المسلم الذي فتح بلاد الشام؟", a: ["أبو عبيدة عامر بن الجراح", "خالد بن الوليد", "أبو عبيدة"], difficulty: "hard", category: "history" },
  { q: "في أي عام وقعت مجزرة هيروشيما؟", a: ["1945", "6 أغسطس 1945"], difficulty: "medium", category: "history" },
  { q: "من هو مؤسس المملكة العربية السعودية الحديثة؟", a: ["الملك عبد العزيز آل سعود", "ابن سعود", "عبد العزيز آل سعود"], difficulty: "medium", category: "history" },
  { q: "في أي عام تأسست جامعة الأزهر؟", a: ["972", "970", "358 هجري"], difficulty: "hard", category: "history" },
  { q: "من هو العالم الذي صمم أول حاسوب؟", a: ["تشارلز بابدج", "بابدج"], difficulty: "hard", category: "history" },
  { q: "في أي عام وقعت معركة اليرموك؟", a: ["636", "15 هجري"], difficulty: "hard", category: "history" },
  { q: "ما اسم الحضارة التي ابتكرت الكتابة؟", a: ["السومرية", "حضارة سومر"], difficulty: "hard", category: "history" },
  { q: "من هو أول إنسان يصل إلى الفضاء؟", a: ["يوري غاغارين", "غاغارين"], difficulty: "medium", category: "history" },
  { q: "في أي عام أُلغيت العبودية في الولايات المتحدة رسمياً؟", a: ["1865"], difficulty: "hard", category: "history" },
  { q: "ما اسم الحركة التي قادها نيلسون مانديلا؟", a: ["حركة مناهضة الفصل العنصري", "المؤتمر الوطني الأفريقي", "ANC"], difficulty: "medium", category: "history" },
  { q: "في أي عام صعد الإنسان إلى القمر لأول مرة؟", a: ["1969", "١٩٦٩"], difficulty: "medium", category: "history" },
  { q: "من هو الفيلسوف اليوناني القديم صاحب كتاب الجمهورية؟", a: ["أفلاطون", "أفلاطن"], difficulty: "medium", category: "history" },
  { q: "في أي عام استقلت الجزائر عن فرنسا؟", a: ["1962", "١٩٦٢"], difficulty: "medium", category: "history" },
  { q: "من هو الخليفة الراشدي المعروف بالفاروق؟", a: ["عمر بن الخطاب", "سيدنا عمر"], difficulty: "medium", category: "history" },
  { q: "في أي عام وقعت حرب الخليج الأولى؟", a: ["1980", "١٩٨٠", "الحرب الإيرانية العراقية"], difficulty: "hard", category: "history" },
  { q: "من قام بتوحيد الصين لأول مرة؟", a: ["الإمبراطور تشين شي هوانغ", "شين شي"], difficulty: "hard", category: "history" },
  { q: "ما اسم الكاتب الذي ألّف أمير الشعراء؟", a: ["أحمد شوقي", "شوقي"], difficulty: "medium", category: "history" },
  { q: "في أي عام تأسست منظمة حلف الناتو؟", a: ["1949", "١٩٤٩"], difficulty: "medium", category: "history" },
  { q: "من هو مكتشف مسار رأس الرجاء الصالح؟", a: ["بارتولوميو دياز", "فاسكو دا غاما"], difficulty: "hard", category: "history" },
  { q: "في أي عام وقعت حرب أكتوبر 73؟", a: ["1973", "١٩٧٣", "6 أكتوبر"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم القائد الذي هزم نابليون في معركة واترلو؟", a: ["الدوق ويلينغتون", "ويلينغتون"], difficulty: "hard", category: "history" },
  { q: "في أي عام استقلت مصر عن بريطانيا؟", a: ["1922", "١٩٢٢"], difficulty: "medium", category: "history" },
  { q: "من هو واضع نظرية الجاذبية؟", a: ["إسحاق نيوتن", "نيوتن"], difficulty: "medium", category: "history" },
  { q: "في أي عام وقعت ثورة 25 يناير في مصر؟", a: ["2011", "٢٠١١"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم أول رائدة فضاء في العالم؟", a: ["فالنتينا تيريشكوفا", "تيريشكوفا"], difficulty: "hard", category: "history" },
  { q: "في أي عام وُلد هتلر؟", a: ["1889", "١٨٨٩"], difficulty: "medium", category: "history" },
  { q: "من هو الخليفة الذي قتل في معركة كربلاء؟", a: ["لم يُقتل خليفة في كربلاء", "الحسين بن علي قُتل لكنه ليس خليفة"], difficulty: "hard", category: "history" },
  { q: "ما هو اسم أول جريدة عربية؟", a: ["الوقائع المصرية", "جورنال الخديوي"], difficulty: "hard", category: "history" },
  { q: "في أي عام تأسست مدينة بغداد؟", a: ["762", "145 هجري"], difficulty: "hard", category: "history" },
  { q: "من هو باني الكولوسيوم الروماني؟", a: ["الإمبراطور فسباسيان", "فسباسيان"], difficulty: "hard", category: "history" },
  { q: "في أي عام توفي النبي محمد صلى الله عليه وسلم؟", a: ["632", "11 هجري"], difficulty: "medium", category: "history" },
  { q: "ما اسم الثورة التي أطاحت بالملكية في فرنسا عام 1789؟", a: ["الثورة الفرنسية"], difficulty: "medium", category: "history" },
  { q: "من هو الزعيم الكوبي الذي قاد الثورة الكوبية؟", a: ["فيدل كاسترو", "كاسترو"], difficulty: "medium", category: "history" },
  { q: "في أي عام وقعت حادثة اغتيال الأرشيدوق فرانز فرديناند التي أشعلت الحرب العالمية الأولى؟", a: ["1914", "28 يونيو 1914"], difficulty: "hard", category: "history" },
  { q: "ما اسم الحرب التي دارت بين مصر وإسرائيل عام 1967؟", a: ["حرب يونيو", "حرب الأيام الستة", "النكسة"], difficulty: "medium", category: "history" },
  { q: "من هو الفيلسوف الذي قال اعرف نفسك؟", a: ["سقراط"], difficulty: "medium", category: "history" },
  { q: "في أي عام أُنشئت منظمة الوحدة الأفريقية؟", a: ["1963", "١٩٦٣"], difficulty: "hard", category: "history" },
  { q: "ما هو اسم الإمبراطور الروماني الذي أحرق روما؟", a: ["نيرون", "الإمبراطور نيرون"], difficulty: "medium", category: "history" },

  // ════════════════════════════════════════
  //             🌍 الجغرافيا
  // ════════════════════════════════════════

  { q: "ما هي عاصمة مصر؟", a: ["القاهرة"], difficulty: "medium", category: "geography" },
  { q: "ما هي أكبر قارة في العالم؟", a: ["آسيا"], difficulty: "medium", category: "geography" },
  { q: "ما هو أطول نهر في العالم؟", a: ["النيل", "نهر النيل"], difficulty: "medium", category: "geography" },
  { q: "ما هي أعلى قمة جبلية في العالم؟", a: ["إيفرست", "جبل إيفرست", "إيفرست"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة المملكة العربية السعودية؟", a: ["الرياض"], difficulty: "medium", category: "geography" },
  { q: "في أي قارة تقع البرازيل؟", a: ["أمريكا الجنوبية"], difficulty: "medium", category: "geography" },
  { q: "ما هو أكبر محيط في العالم؟", a: ["المحيط الهادئ", "الهادئ"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة اليابان؟", a: ["طوكيو", "توكيو"], difficulty: "medium", category: "geography" },
  { q: "كم عدد دول العالم تقريباً؟", a: ["195", "١٩٥"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة فرنسا؟", a: ["باريس"], difficulty: "medium", category: "geography" },
  { q: "أين تقع جبال الهيمالايا؟", a: ["آسيا", "جنوب آسيا"], difficulty: "medium", category: "geography" },
  { q: "ما هي أصغر دولة في العالم؟", a: ["الفاتيكان", "مدينة الفاتيكان"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر صحراء في العالم؟", a: ["الصحراء الكبرى", "الصحراء الأفريقية", "صحراء أنتاركتيكا", "أنتاركتيكا"], difficulty: "hard", category: "geography" },
  { q: "ما هي عاصمة الصين؟", a: ["بكين"], difficulty: "medium", category: "geography" },
  { q: "في أي قارة تقع مصر؟", a: ["أفريقيا", "إفريقيا"], difficulty: "medium", category: "geography" },
  { q: "ما هو أعمق بحيرة في العالم؟", a: ["بحيرة بايكال", "بايكال"], difficulty: "hard", category: "geography" },
  { q: "ما هي عاصمة إيطاليا؟", a: ["روما"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر دولة في العالم مساحةً؟", a: ["روسيا"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة إسبانيا؟", a: ["مدريد"], difficulty: "medium", category: "geography" },
  { q: "أين يقع برج إيفل؟", a: ["باريس", "فرنسا"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة الأرجنتين؟", a: ["بيونس آيرس", "بوينس آيرس"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أطول سلسلة جبلية في العالم؟", a: ["جبال الأنديز", "الأنديز"], difficulty: "hard", category: "geography" },
  { q: "ما هي عاصمة المغرب؟", a: ["الرباط"], difficulty: "medium", category: "geography" },
  { q: "في أي بلد يوجد تاج محل؟", a: ["الهند"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر نهر في أمريكا الجنوبية؟", a: ["الأمازون", "نهر الأمازون"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة أستراليا؟", a: ["كانبيرا", "كانبرا"], difficulty: "hard", category: "geography" },
  { q: "في أي دولة يقع نهر الكونغو؟", a: ["الكونغو", "جمهورية الكونغو الديمقراطية"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة الهند؟", a: ["نيودلهي", "دلهي", "نيو دلهي"], difficulty: "medium", category: "geography" },
  { q: "ما هو أصغر قارة في العالم؟", a: ["أستراليا", "أوقيانوسيا"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة ألمانيا؟", a: ["برلين"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة يقع جبل فوجي؟", a: ["اليابان", "الجبل موجود في اليابان"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم الجزيرة الكبيرة في الشمال الأفريقي؟", a: ["مدغشقر"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة البرازيل؟", a: ["برازيليا"], difficulty: "hard", category: "geography" },
  { q: "في أي قارة تقع كندا؟", a: ["أمريكا الشمالية"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أطول جدار في التاريخ؟", a: ["سور الصين العظيم", "الجدار الصيني"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة كندا؟", a: ["أوتاوا"], difficulty: "medium", category: "geography" },
  { q: "في أي بلد تقع جزر المالديف؟", a: ["في المحيط الهندي", "المحيط الهندي"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة تركيا؟", a: ["أنقرة"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم القارة المتجمدة؟", a: ["أنتاركتيكا", "القطب الجنوبي"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة يقع جبل كليمنجارو؟", a: ["تنزانيا"], difficulty: "hard", category: "geography" },
  { q: "ما هي عاصمة روسيا؟", a: ["موسكو"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر جزيرة في العالم؟", a: ["غرينلاند", "جرينلاند"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة إيران؟", a: ["طهران"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع قناة بنما؟", a: ["بنما", "دولة بنما"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة العراق؟", a: ["بغداد"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر صحراء عربية؟", a: ["الربع الخالي"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة يقع نهر الدانوب؟", a: ["يمر بعدة دول أوروبية", "النمسا وألمانيا والمجر وغيرها"], difficulty: "hard", category: "geography" },
  { q: "ما هي عاصمة الأردن؟", a: ["عمان"], difficulty: "medium", category: "geography" },
  { q: "ما هو الجبل الأعلى في أفريقيا؟", a: ["كليمنجارو", "جبل كليمنجارو"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة إندونيسيا؟", a: ["جاكرتا", "نوسانتارا"], difficulty: "medium", category: "geography" },
  { q: "أين تقع جزر الكناري؟", a: ["إسبانيا", "المحيط الأطلنطي", "قرب المغرب"], difficulty: "hard", category: "geography" },
  { q: "ما هي عاصمة ليبيا؟", a: ["طرابلس"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر بلد في أفريقيا مساحةً؟", a: ["الجزائر"], difficulty: "hard", category: "geography" },
  { q: "ما هي عاصمة باكستان؟", a: ["إسلام آباد"], difficulty: "medium", category: "geography" },
  { q: "في أي قارة تقع المكسيك؟", a: ["أمريكا الشمالية"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة كوريا الجنوبية؟", a: ["سيول"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أطول نهر في أوروبا؟", a: ["نهر الفولغا", "الفولغا"], difficulty: "hard", category: "geography" },
  { q: "ما هي عاصمة السودان؟", a: ["الخرطوم"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة يقع متحف اللوفر؟", a: ["فرنسا", "باريس"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة البرتغال؟", a: ["لشبونة"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم البحر بين أوروبا وأفريقيا؟", a: ["البحر المتوسط", "المتوسط", "بحر الأبيض المتوسط"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة هولندا؟", a: ["أمستردام"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة يقع نهر النيل الأبيض والنيل الأزرق؟", a: ["السودان وإثيوبيا وأوغندا", "تلتقيان في السودان"], difficulty: "hard", category: "geography" },
  { q: "ما هي عاصمة النرويج؟", a: ["أوسلو"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أعمق نقطة في المحيط؟", a: ["مارياناس ترنش", "خندق ماريانا", "الخندق الماريانا"], difficulty: "hard", category: "geography" },
  { q: "ما هي عاصمة الجزائر؟", a: ["الجزائر العاصمة", "الجزائر"], difficulty: "medium", category: "geography" },
  { q: "في أي قارة تقع إثيوبيا؟", a: ["أفريقيا", "إفريقيا"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة تونس؟", a: ["تونس العاصمة", "تونس"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم البحيرة بين إسرائيل والأردن؟", a: ["البحر الميت"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة اليمن؟", a: ["صنعاء"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة توجد تشيلي كدولة طولية؟", a: ["تشيلي هي دولة في أمريكا الجنوبية"], difficulty: "hard", category: "geography" },
  { q: "ما هي عاصمة سوريا؟", a: ["دمشق"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر دولة في أمريكا الجنوبية؟", a: ["البرازيل"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة بلجيكا؟", a: ["بروكسل"], difficulty: "medium", category: "geography" },
  { q: "في أي قارة تقع بيرو؟", a: ["أمريكا الجنوبية"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر بحيرة في أفريقيا؟", a: ["بحيرة فيكتوريا", "فيكتوريا"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة الفلبين؟", a: ["مانيلا"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة يقع نهر الأمازون معظمه؟", a: ["البرازيل"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة بولندا؟", a: ["وارسو", "وارسا"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر جزيرة في منطقة البحر المتوسط؟", a: ["جزيرة صقلية", "صقلية"], difficulty: "hard", category: "geography" },
  { q: "ما هي عاصمة لبنان؟", a: ["بيروت"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة يقع نهر الغانج؟", a: ["الهند", "بنغلاديش والهند"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أطول جبل في أمريكا الشمالية؟", a: ["دينالي", "ماكينلي", "جبل دينالي"], difficulty: "hard", category: "geography" },
  { q: "ما هي عاصمة قطر؟", a: ["الدوحة"], difficulty: "medium", category: "geography" },
  { q: "أين تقع دولة موناكو؟", a: ["في أوروبا", "على ساحل فرنسا", "قرب الريفيرا الفرنسية"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة الكويت؟", a: ["مدينة الكويت", "الكويت"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر دولة في آسيا؟", a: ["روسيا", "الصين بالسكان والهند"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة البحرين؟", a: ["المنامة"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة توجد جزيرة بالي؟", a: ["إندونيسيا"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة عُمان؟", a: ["مسقط"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أطول نهر في آسيا؟", a: ["يانغتسي", "نهر اليانغتسي"], difficulty: "hard", category: "geography" },
  { q: "ما هي عاصمة الإمارات العربية المتحدة؟", a: ["أبوظبي", "أبو ظبي"], difficulty: "medium", category: "geography" },
  { q: "في أي قارة تقع نيجيريا؟", a: ["أفريقيا", "إفريقيا"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة كازاخستان؟", a: ["أستانة", "نور سلطان"], difficulty: "hard", category: "geography" },
  { q: "ما هو اسم أكبر بحر في العالم؟", a: ["بحر الصين الجنوبي", "المحيط الهادئ"], difficulty: "hard", category: "geography" },

  // ════════════════════════════════════════
  //              🔬 العلوم
  // ════════════════════════════════════════

  { q: "ما هو رمز عنصر الذهب في الجدول الدوري؟", a: ["Au"], difficulty: "medium", category: "science" },
  { q: "ما هو رمز عنصر الماء في الكيمياء؟", a: ["H2O"], difficulty: "medium", category: "science" },
  { q: "كم تبلغ سرعة الضوء تقريباً؟", a: ["300000 كم/ثانية", "3×10^8 م/ث", "ثلاثمائة ألف كيلومتر في الثانية"], difficulty: "medium", category: "science" },
  { q: "ما هو أصغر وحدة في الكون؟", a: ["الكوارك", "الجسيمات دون الذرية"], difficulty: "hard", category: "science" },
  { q: "كم عدد أسنان الإنسان البالغ؟", a: ["32"], difficulty: "medium", category: "science" },
  { q: "ما هو عدد العظام في جسم الإنسان البالغ؟", a: ["206"], difficulty: "medium", category: "science" },
  { q: "ما هو الغاز الأكثر وفرة في الغلاف الجوي للأرض؟", a: ["النيتروجين"], difficulty: "medium", category: "science" },
  { q: "ما هي درجة غليان الماء؟", a: ["100 درجة مئوية", "212 فهرنهايت"], difficulty: "medium", category: "science" },
  { q: "ما هو رمز عنصر الأكسجين؟", a: ["O"], difficulty: "medium", category: "science" },
  { q: "ما هو أقرب كوكب للشمس؟", a: ["عطارد", "Mercury"], difficulty: "medium", category: "science" },
  { q: "كم عدد الكواكب في المجموعة الشمسية؟", a: ["8", "ثمانية"], difficulty: "medium", category: "science" },
  { q: "ما هو أكبر كوكب في المجموعة الشمسية؟", a: ["المشتري", "Jupiter"], difficulty: "medium", category: "science" },
  { q: "ما هي درجة تجمد الماء؟", a: ["صفر درجة مئوية", "0 درجة", "32 فهرنهايت"], difficulty: "medium", category: "science" },
  { q: "ما هو الرمز الكيميائي للحديد؟", a: ["Fe"], difficulty: "medium", category: "science" },
  { q: "كم عدد عظام العمود الفقري؟", a: ["33", "26"], difficulty: "hard", category: "science" },
  { q: "ما هو أصغر خلية في جسم الإنسان؟", a: ["الحيوان المنوي", "خلية الجرثوم الذكرية"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم عملية تحويل الطاقة الشمسية في النباتات؟", a: ["البناء الضوئي", "التمثيل الضوئي", "التركيب الضوئي"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم ذرة الكربون التي لها 6 بروتونات؟", a: ["الكربون-12", "ذرة الكربون"], difficulty: "hard", category: "science" },
  { q: "ما هو عدد البروتونات في ذرة الأكسجين؟", a: ["8"], difficulty: "hard", category: "science" },
  { q: "ما هي أسرع خلية في الجسم؟", a: ["الخلية العصبية", "النيورون"], difficulty: "hard", category: "science" },
  { q: "كم تبلغ درجة حرارة الشمس على سطحها؟", a: ["5500 درجة مئوية", "5778 كلفن"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم العضو الذي يفرز الأنسولين؟", a: ["البنكرياس"], difficulty: "medium", category: "science" },
  { q: "ما هو الرمز الكيميائي للصوديوم؟", a: ["Na"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم العلم الذي يدرس الكائنات الحية؟", a: ["الأحياء", "علم الأحياء", "بيولوجيا"], difficulty: "medium", category: "science" },
  { q: "ما هو الرمز الكيميائي للبوتاسيوم؟", a: ["K"], difficulty: "medium", category: "science" },
  { q: "كم عدد أجنحة الحشرة؟", a: ["6 أرجل وليس أجنحة", "4 أجنحة للأكثر", "يتراوح بين 0 و4"], difficulty: "hard", category: "science" },
  { q: "ما هو العضو المسؤول عن ضخ الدم في الجسم؟", a: ["القلب"], difficulty: "medium", category: "science" },
  { q: "ما هو الرمز الكيميائي للكالسيوم؟", a: ["Ca"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم أقصر موجة ضوئية يمكن للعين رؤيتها؟", a: ["البنفسجي", "الأشعة فوق البنفسجية"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم الجزيء الذي يحمل المعلومات الوراثية؟", a: ["DNA", "الحمض النووي الريبوزي منقوص الأكسجين"], difficulty: "medium", category: "science" },
  { q: "كم عدد الكروموسومات في خلية الإنسان الطبيعية؟", a: ["46", "23 زوج"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم الظاهرة التي تسبب الفصول الأربعة؟", a: ["ميلان محور الأرض", "دوران الأرض حول الشمس مع الميلان"], difficulty: "hard", category: "science" },
  { q: "ما هي أكبر غدة في الجسم؟", a: ["الكبد"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم المادة التي تجعل الدم أحمر؟", a: ["الهيموغلوبين", "هيموجلوبين"], difficulty: "medium", category: "science" },
  { q: "ما هو الكوكب الأحمر؟", a: ["المريخ", "Mars"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم العملية التي يتحول فيها الصلب مباشرة إلى غاز؟", a: ["التسامي", "التسامى"], difficulty: "hard", category: "science" },
  { q: "كم تبلغ سرعة الصوت في الهواء؟", a: ["343 م/ث", "340 م/ث تقريباً"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم العضو الذي ينظف الدم؟", a: ["الكلية", "الكلى"], difficulty: "medium", category: "science" },
  { q: "ما هو العنصر الأكثر وفرة في قشرة الأرض؟", a: ["الأكسجين"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم الخلية التي تحارب الأمراض في الدم؟", a: ["كريات الدم البيضاء", "الكريات البيض"], difficulty: "medium", category: "science" },
  { q: "كم عدد حواس الإنسان؟", a: ["5", "خمس حواس"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم الكوكب الذي له حلقات مميزة؟", a: ["زحل", "Saturn"], difficulty: "medium", category: "science" },
  { q: "ما هو الرمز الكيميائي للفضة؟", a: ["Ag"], difficulty: "medium", category: "science" },
  { q: "ما هو أصغر جزء يمكن تقسيم العنصر إليه مع الاحتفاظ بخواصه؟", a: ["الذرة"], difficulty: "medium", category: "science" },
  { q: "ما هي درجة حرارة جسم الإنسان الطبيعية؟", a: ["37 درجة مئوية", "98.6 فهرنهايت"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم الكوكب الأقرب لنا بعد الشمس؟", a: ["الزهرة", "Venus"], difficulty: "medium", category: "science" },
  { q: "ما هي أسرع طيور في العالم؟", a: ["الصقر الحر", "الشاهين"], difficulty: "hard", category: "science" },
  { q: "ما هو عدد لترات الدم في جسم الإنسان البالغ تقريباً؟", a: ["5 لترات", "5-6 لترات"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم القانون الذي يصف علاقة الضغط والحجم للغازات؟", a: ["قانون بويل"], difficulty: "hard", category: "science" },
  { q: "ما هو الرمز الكيميائي للكلور؟", a: ["Cl"], difficulty: "medium", category: "science" },
  { q: "ما هي أسرع حيوان بري في العالم؟", a: ["الفهد"], difficulty: "medium", category: "science" },
  { q: "كم عدد الثواني في ساعة واحدة؟", a: ["3600", "ثلاثة آلاف وستمائة"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم المادة التي تعطي النباتات لونها الأخضر؟", a: ["الكلوروفيل"], difficulty: "medium", category: "science" },
  { q: "ما هي أكبر خلية في جسم الإنسان؟", a: ["البويضة", "الخلية البيضية"], difficulty: "hard", category: "science" },
  { q: "كم يبلغ ضغط الدم الطبيعي؟", a: ["120/80", "120 على 80 ملم زئبق"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم العلم الذي يدرس الزلازل؟", a: ["علم الزلازل", "سيزمولوجيا"], difficulty: "medium", category: "science" },
  { q: "كم تبلغ مسافة القمر عن الأرض تقريباً؟", a: ["384000 كم", "380000 كم"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم أطول عظمة في الجسم؟", a: ["عظمة الفخذ", "الفخذ"], difficulty: "medium", category: "science" },
  { q: "ما هو الرمز الكيميائي للنيتروجين؟", a: ["N"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم الغدة التي تتحكم في نمو الجسم؟", a: ["الغدة النخامية"], difficulty: "hard", category: "science" },
  { q: "كم تبلغ مسافة الأرض عن الشمس تقريباً؟", a: ["150 مليون كم", "149 مليون كم"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم المجرة التي تحتوي على نظامنا الشمسي؟", a: ["درب التبانة", "مجرة درب اللبانة"], difficulty: "medium", category: "science" },
  { q: "ما هو الجهاز المسؤول عن التنفس؟", a: ["الجهاز التنفسي", "الرئتان"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم أصغر كوكب في المجموعة الشمسية؟", a: ["عطارد", "Mercury"], difficulty: "medium", category: "science" },
  { q: "ما هو الرمز الكيميائي للألومنيوم؟", a: ["Al"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم العلم الذي يدرس الأحافير؟", a: ["علم الحفريات", "باليونتولوجيا"], difficulty: "medium", category: "science" },
  { q: "كم عدد الفقرات في العمود الفقري البشري؟", a: ["33", "26 عظمة"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم العملية التي تتحول فيها الغازات إلى سائل؟", a: ["التكثف", "التكاثف"], difficulty: "medium", category: "science" },
  { q: "ما هو الكوكب الأبعد عن الشمس؟", a: ["نبتون", "Neptune"], difficulty: "medium", category: "science" },
  { q: "ما هو الرمز الكيميائي للمغنيسيوم؟", a: ["Mg"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم الخلية المسؤولة عن الرؤية في شبكية العين؟", a: ["المخاريط والقضبان", "العصي والمخاريط"], difficulty: "hard", category: "science" },
  { q: "كم يستغرق دوران الأرض حول نفسها؟", a: ["24 ساعة", "يوم واحد"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم الجهاز الذي يتحكم في الجسم كاملاً؟", a: ["الجهاز العصبي"], difficulty: "medium", category: "science" },
  { q: "ما هو عدد الأسنان اللبنية عند الأطفال؟", a: ["20", "عشرون سناً"], difficulty: "medium", category: "science" },
  { q: "ما هو الرمز الكيميائي للزنك؟", a: ["Zn"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم ظاهرة التغير في تردد الأمواج بحسب المصدر؟", a: ["تأثير دوبلر", "ظاهرة دوبلر"], difficulty: "hard", category: "science" },
  { q: "ما هو أبرد كوكب في المجموعة الشمسية؟", a: ["أورانوس", "نبتون"], difficulty: "hard", category: "science" },
  { q: "كم يستغرق دوران الأرض حول الشمس؟", a: ["365 يوم", "سنة واحدة"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم الغاز المسؤول عن الاحتباس الحراري؟", a: ["ثاني أكسيد الكربون", "CO2", "الميثان"], difficulty: "medium", category: "science" },
  { q: "ما هو أثقل عنصر في الطبيعة؟", a: ["اليورانيوم", "البلوتونيوم"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم الهرمون المسؤول عن تنظيم السكر في الدم؟", a: ["الأنسولين"], difficulty: "medium", category: "science" },
  { q: "كم عدد الأضلاع في جسم الإنسان؟", a: ["24 ضلع", "12 زوج"], difficulty: "medium", category: "science" },
  { q: "ما هو الرمز الكيميائي للنحاس؟", a: ["Cu"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم طبقة الغلاف الجوي التي تحمينا من الأشعة فوق البنفسجية؟", a: ["طبقة الأوزون"], difficulty: "medium", category: "science" },
  { q: "ما هي فصيلة الدم التي تُعدّ المانح العالمي؟", a: ["O سالب", "O-"], difficulty: "medium", category: "science" },
  { q: "ما هو الكوكب الذي يملك أكبر عدد من الأقمار؟", a: ["زحل", "المشتري"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم مادة الضبط في درجة الحموضة؟", a: ["المخزن الحمضي القاعدي", "المادة العازلة"], difficulty: "hard", category: "science" },
  { q: "ما هو عدد أسنان الإنسان الطفل؟", a: ["20", "عشرون"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم العلم الذي يدرس الفطريات؟", a: ["علم الفطريات", "مايكولوجيا"], difficulty: "hard", category: "science" },
  { q: "كم عدد ثواني الدقيقة الواحدة؟", a: ["60", "ستون ثانية"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم السيال العصبي الكيميائي؟", a: ["الناقل العصبي", "النيوروتراسميتر"], difficulty: "hard", category: "science" },
  { q: "ما هو الرمز الكيميائي للكبريت؟", a: ["S"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم الظاهرة التي تشرح انتشار الجزيئات؟", a: ["الانتشار", "الانتشار الجزيئي"], difficulty: "medium", category: "science" },
  { q: "في أي سن تكتمل عظام الجسم البشري؟", a: ["25 سنة", "حوالي 25"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم المجموعة الدموية الأكثر شيوعاً؟", a: ["A", "O", "O+"], difficulty: "medium", category: "science" },
  { q: "ما هو الرمز الكيميائي للرصاص؟", a: ["Pb"], difficulty: "hard", category: "science" },
  { q: "ما هي وحدة قياس قوة الزلزال؟", a: ["ريختر", "مقياس ريختر"], difficulty: "medium", category: "science" },

  // ════════════════════════════════════════
  //               ⚽ الرياضة
  // ════════════════════════════════════════

  { q: "كم عدد لاعبي كرة القدم في الملعب لكل فريق؟", a: ["11", "أحد عشر"], difficulty: "medium", category: "sports" },
  { q: "من هو الهداف التاريخي لكأس العالم؟", a: ["ميروسلاف كلوزه", "كلوزه"], difficulty: "hard", category: "sports" },
  { q: "في أي دولة أُقيمت أولمبياد 2024؟", a: ["فرنسا", "باريس"], difficulty: "medium", category: "sports" },
  { q: "كم عدد حكام مباراة كرة القدم؟", a: ["4", "أربعة"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم البطولة الأوروبية لكرة القدم؟", a: ["دوري أبطال أوروبا", "UEFA Champions League", "اليويفا"], difficulty: "medium", category: "sports" },
  { q: "من فاز بكأس العالم 2022؟", a: ["الأرجنتين"], difficulty: "medium", category: "sports" },
  { q: "كم مرة فاز المنتخب البرازيلي بكأس العالم؟", a: ["5", "خمس مرات"], difficulty: "medium", category: "sports" },
  { q: "في أي دولة أُقيم كأس العالم 2022؟", a: ["قطر"], difficulty: "medium", category: "sports" },
  { q: "من هو أكثر لاعب تسجيلاً للأهداف في التاريخ؟", a: ["كريستيانو رونالدو", "رونالدو"], difficulty: "medium", category: "sports" },
  { q: "كم عدد أطواق نجوم الأولمبياد؟", a: ["5", "خمسة"], difficulty: "medium", category: "sports" },
  { q: "ما هو الرياضة التي تُلعب في ملعب ويمبلدون؟", a: ["التنس"], difficulty: "medium", category: "sports" },
  { q: "كم مرة فاز نادي ريال مدريد بدوري الأبطال؟", a: ["15", "خمسة عشر"], difficulty: "hard", category: "sports" },
  { q: "في أي مدينة توجد بطولة ويمبلدون للتنس؟", a: ["لندن", "ويمبلدون في لندن"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم اللاعب الذي فاز بأكبر عدد من جوائز البالون دور؟", a: ["ليونيل ميسي", "ميسي"], difficulty: "medium", category: "sports" },
  { q: "كم عدد أشواط مباراة كرة القدم؟", a: ["شوطان", "2"], difficulty: "medium", category: "sports" },
  { q: "من فاز بكأس العالم 2018؟", a: ["فرنسا"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم أشهر سباق دراجات في العالم؟", a: ["تور دو فرانس", "جائزة فرنسا الكبرى للدراجات"], difficulty: "medium", category: "sports" },
  { q: "كم يبلغ طول ملعب كرة القدم الرسمي؟", a: ["105 متر", "100-110 متر"], difficulty: "hard", category: "sports" },
  { q: "في أي بلد يقع نادي برشلونة؟", a: ["إسبانيا"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم البطولة الأمريكية لكرة السلة؟", a: ["NBA", "دوري NBA"], difficulty: "medium", category: "sports" },
  { q: "من هو أسرع إنسان في العالم؟", a: ["أوساين بولت", "بولت"], difficulty: "medium", category: "sports" },
  { q: "كم مرة فاز المنتخب الألماني بكأس العالم؟", a: ["4", "أربع مرات"], difficulty: "medium", category: "sports" },
  { q: "ما هو الرقم القياسي لأوساين بولت في سباق 100 متر؟", a: ["9.58 ثانية", "9.58"], difficulty: "hard", category: "sports" },
  { q: "كم عدد اللاعبين في فريق كرة السلة؟", a: ["5", "خمسة"], difficulty: "medium", category: "sports" },
  { q: "في أي دولة تأسس نادي ريال مدريد؟", a: ["إسبانيا"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم الملعب الرئيسي لنادي ريال مدريد؟", a: ["سانتياغو برنابيو", "برنابيو"], difficulty: "medium", category: "sports" },
  { q: "من فاز بكأس العالم 2014؟", a: ["ألمانيا"], difficulty: "medium", category: "sports" },
  { q: "كم عدد لاعبي الكريكيت في كل فريق؟", a: ["11", "أحد عشر"], difficulty: "medium", category: "sports" },
  { q: "في أي دولة أُقيمت أولمبياد 2020؟", a: ["اليابان", "طوكيو"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم بطولة كرة القدم الإيطالية؟", a: ["الدوري الإيطالي", "سيريا آ", "Serie A"], difficulty: "medium", category: "sports" },
  { q: "كم مرة فاز نادي برشلونة بالبطولة الإسبانية؟", a: ["27", "أكثر من 26"], difficulty: "hard", category: "sports" },
  { q: "من هو مدرب المنتخب المصري سابقاً بيترفي؟", a: ["كارلوس كيروش", "بيترفي"], difficulty: "hard", category: "sports" },
  { q: "ما هو اسم الملعب الرئيسي لنادي برشلونة؟", a: ["كامب نو", "Camp Nou"], difficulty: "medium", category: "sports" },
  { q: "كم عدد الحلقات الأولمبية؟", a: ["5", "خمس حلقات"], difficulty: "medium", category: "sports" },
  { q: "من هو الملاكم الأسطوري محمد علي؟", a: ["لاعب ملاكمة أمريكي", "الفراشة"], difficulty: "medium", category: "sports" },
  { q: "في أي مدينة تأسس نادي الأهلي المصري؟", a: ["القاهرة"], difficulty: "medium", category: "sports" },
  { q: "كم مرة فاز الأهلي المصري ببطولة دوري أبطال أفريقيا؟", a: ["11", "أكثر من 10"], difficulty: "hard", category: "sports" },
  { q: "ما هو اسم بطولة كرة القدم الإسبانية؟", a: ["الليغا", "La Liga", "الدوري الإسباني"], difficulty: "medium", category: "sports" },
  { q: "من فاز بكأس العالم 2010؟", a: ["إسبانيا"], difficulty: "medium", category: "sports" },
  { q: "كم يبلغ ارتفاع حلقة كرة السلة؟", a: ["3.05 متر", "10 أقدام"], difficulty: "hard", category: "sports" },
  { q: "ما هو اسم الفريق الذي يُعرف بالبلوز أو الديوك؟", a: ["أرسنال", "Chelsea", "تشيلسي"], difficulty: "hard", category: "sports" },
  { q: "في أي دولة أُقيمت أولمبياد 2016؟", a: ["البرازيل", "ريو دي جانيرو"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم بطولة كرة القدم الإنجليزية؟", a: ["البريميرليج", "الدوري الإنجليزي", "Premier League"], difficulty: "medium", category: "sports" },
  { q: "كم عدد لاعبي كرة الطائرة في الملعب لكل فريق؟", a: ["6", "ستة"], difficulty: "medium", category: "sports" },
  { q: "من هو أفضل لاعب في كأس العالم 2022؟", a: ["ليونيل ميسي", "ميسي"], difficulty: "medium", category: "sports" },
  { q: "في أي دولة أُسس نادي يوفنتوس؟", a: ["إيطاليا"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم بطولة الدوري الفرنسي لكرة القدم؟", a: ["ليغ 1", "Ligue 1", "الدوري الفرنسي"], difficulty: "medium", category: "sports" },
  { q: "كم عدد لاعبي كرة اليد في كل فريق؟", a: ["7", "سبعة"], difficulty: "medium", category: "sports" },
  { q: "من هو الهداف التاريخي لنادي ريال مدريد؟", a: ["كريستيانو رونالدو", "رونالدو"], difficulty: "medium", category: "sports" },
  { q: "في أي دولة أُقيمت أولمبياد 2012؟", a: ["بريطانيا", "لندن"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم بطولة كرة القدم الألمانية؟", a: ["بوندسليغا", "الدوري الألماني", "Bundesliga"], difficulty: "medium", category: "sports" },
  { q: "كم مرة فاز المنتخب الأرجنتيني بكأس العالم؟", a: ["3", "ثلاث مرات"], difficulty: "medium", category: "sports" },
  { q: "من هو الهداف التاريخي لنادي برشلونة؟", a: ["ليونيل ميسي", "ميسي"], difficulty: "medium", category: "sports" },
  { q: "في أي سنة بدأت بطولة كأس العالم لكرة القدم؟", a: ["1930", "١٩٣٠"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم الفريق الذي يُعرف بالأشباح؟", a: ["نادي ريال مدريد", "ريال مدريد"], difficulty: "medium", category: "sports" },
  { q: "كم عدد لاعبي كرة الماء في كل فريق؟", a: ["7", "سبعة"], difficulty: "medium", category: "sports" },
  { q: "من هو أسرع سبّاح في التاريخ؟", a: ["مايكل فيلبس", "فيلبس"], difficulty: "medium", category: "sports" },
  { q: "في أي دولة أُقيمت أولمبياد 2008؟", a: ["الصين", "بكين"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم اللاعب المصري الأكثر تهديفاً في التاريخ؟", a: ["محمد صلاح", "صلاح"], difficulty: "medium", category: "sports" },
  { q: "كم مرة فاز المنتخب الإيطالي بكأس العالم؟", a: ["4", "أربع مرات"], difficulty: "medium", category: "sports" },
  { q: "من هو أكثر لاعب فوزاً ببطولة غراند سلام للتنس؟", a: ["نوفاك ديوكوفيتش", "ديوكوفيتش", "جوكوفيتش"], difficulty: "medium", category: "sports" },
  { q: "في أي دولة أُقيمت أولمبياد 2004؟", a: ["اليونان", "أثينا"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم النادي الذي يلعب فيه محمد صلاح حالياً 2025؟", a: ["ليفربول", "Liverpool"], difficulty: "medium", category: "sports" },
  { q: "كم عدد أشواط مباراة كرة السلة؟", a: ["4 أرباع", "أربعة أرباع"], difficulty: "medium", category: "sports" },
  { q: "من هو أكثر لاعب تصويتاً لجائزة أفضل لاعب إفريقي؟", a: ["ديدييه دروغبا", "صامويل إيتو"], difficulty: "hard", category: "sports" },
  { q: "في أي مدينة يقع ملعب مارانا كانا؟", a: ["ريو دي جانيرو", "البرازيل"], difficulty: "hard", category: "sports" },
  { q: "ما هو اسم اللاعب البرازيلي الأسطوري؟", a: ["بيليه", "Pelé"], difficulty: "medium", category: "sports" },
  { q: "كم عدد لاعبي كرة القدم الأمريكية في كل فريق؟", a: ["11", "أحد عشر"], difficulty: "medium", category: "sports" },
  { q: "من هو مدرب المنتخب الفرنسي الذي فاز بكأس العالم 2018؟", a: ["ديدييه ديشان", "ديشان"], difficulty: "hard", category: "sports" },
  { q: "في أي سنة تأسس نادي ريال مدريد؟", a: ["1902"], difficulty: "hard", category: "sports" },
  { q: "ما هو اسم الرياضة التي تستخدم مضارب وكرات صغيرة بيضاء في حفر؟", a: ["الغولف"], difficulty: "medium", category: "sports" },
  { q: "من هو أحسن لاعب كرة قدم عربي في التاريخ؟", a: ["محمد صلاح", "البلوز زيدان"], difficulty: "hard", category: "sports" },
  { q: "كم يستغرق شوط كرة السلة؟", a: ["12 دقيقة", "10 دقائق حسب الاتحاد"], difficulty: "hard", category: "sports" },
  { q: "ما هو اسم مقر الفيفا؟", a: ["زيورخ", "سويسرا"], difficulty: "hard", category: "sports" },

  // ════════════════════════════════════════
  //            🌟 معلومات عامة وذكاء
  // ════════════════════════════════════════

  { q: "ما هي عاصمة أكبر دولة في العالم؟", a: ["موسكو", "روسيا عاصمتها موسكو"], difficulty: "medium", category: "general" },
  { q: "كم عدد أيام السنة؟", a: ["365", "ثلاثمائة وخمسة وستون"], difficulty: "medium", category: "general" },
  { q: "ما هو اللون الذي يظهر عند خلط الأحمر والأزرق؟", a: ["البنفسجي", "الأرجواني"], difficulty: "medium", category: "general" },
  { q: "كم عدد أيام السنة الكبيسة؟", a: ["366", "ثلاثمائة وستة وستون"], difficulty: "medium", category: "general" },
  { q: "ما هو اللون الذي يظهر عند خلط الأحمر والأصفر؟", a: ["البرتقالي"], difficulty: "medium", category: "general" },
  { q: "كم عدد أصابع اليد الواحدة؟", a: ["5", "خمسة"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم الجهاز الذي يقيس درجة الحرارة؟", a: ["الترمومتر", "ميزان الحرارة"], difficulty: "medium", category: "general" },
  { q: "في أي يوم تبدأ الأسبوع الميلادي؟", a: ["الأحد", "الإثنين"], difficulty: "medium", category: "general" },
  { q: "كم عدد أشهر السنة؟", a: ["12", "اثنا عشر"], difficulty: "medium", category: "general" },
  { q: "ما هو الشيء الذي يرتفع كلما أحرقته؟", a: ["الرماد", "السيجارة"], difficulty: "medium", category: "general" },
  { q: "ما هو اليوم التالي ليوم الأحد؟", a: ["الإثنين"], difficulty: "medium", category: "general" },
  { q: "كم عدد الوجوه للمكعب؟", a: ["6", "ستة"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم صانع المفاتيح؟", a: ["الحداد", "صانع مفاتيح"], difficulty: "medium", category: "general" },
  { q: "ما هو الشيء الذي يأتي مرة في الدقيقة ومرتين في الساعة؟", a: ["حرف الدال في العربية", "حرف D في الإنجليزية"], difficulty: "hard", category: "general" },
  { q: "كم عدد الفصول في السنة؟", a: ["4", "أربعة"], difficulty: "medium", category: "general" },
  { q: "ما هو أسرع وسيلة اتصال؟", a: ["الضوء", "الإشارات الضوئية"], difficulty: "medium", category: "general" },
  { q: "كم عدد الأحرف في الأبجدية العربية؟", a: ["28", "ثمانية وعشرون"], difficulty: "medium", category: "general" },
  { q: "ما هو اللون الناتج عن خلط الأبيض والأسود؟", a: ["الرمادي"], difficulty: "medium", category: "general" },
  { q: "كم عدد الأحرف في الأبجدية الإنجليزية؟", a: ["26", "ستة وعشرون"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم اليوم السابع من الأسبوع؟", a: ["السبت"], difficulty: "medium", category: "general" },
  { q: "ما هو أكبر رقم بالأرقام الرومانية التي تستخدم حرف M؟", a: ["M = 1000", "ألف"], difficulty: "medium", category: "general" },
  { q: "ما هو اللون الذي يظهر عند خلط الأصفر والأزرق؟", a: ["الأخضر"], difficulty: "medium", category: "general" },
  { q: "كم عدد أيام شهر فبراير في السنة العادية؟", a: ["28", "ثمانية وعشرون"], difficulty: "medium", category: "general" },
  { q: "ما هو المربع الذي طول ضلعه 5؟", a: ["25", "المساحة 25"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم الحيوان الذي يعيش أطول في العالم؟", a: ["السلحفاة", "القرش الغرينلاندي"], difficulty: "hard", category: "general" },
  { q: "كم عدد ألوان قوس قزح؟", a: ["7", "سبعة"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم الكتاب الأكثر مبيعاً في التاريخ؟", a: ["الإنجيل", "القرآن الكريم", "الكتاب المقدس"], difficulty: "medium", category: "general" },
  { q: "ما هو الرقم الذي إذا ضربته بأي رقم يعطي نفس الرقم؟", a: ["الواحد", "1"], difficulty: "medium", category: "general" },
  { q: "ما هو الحيوان الذي لديه بصمة مشابهة للإنسان؟", a: ["الشمبانزي", "القرد"], difficulty: "hard", category: "general" },
  { q: "ما هو الرقم الذي إذا أضفته لأي رقم لا يغير شيئاً؟", a: ["الصفر", "0"], difficulty: "medium", category: "general" },
  { q: "ما هو الطعام الذي لا يفسد أبداً؟", a: ["العسل"], difficulty: "medium", category: "general" },
  { q: "كم عدد أسابيع السنة تقريباً؟", a: ["52", "اثنان وخمسون"], difficulty: "medium", category: "general" },
  { q: "ما هو الشيء الذي عندما تأخذ منه تكبر؟", a: ["الحفرة", "الثقب"], difficulty: "medium", category: "general" },
  { q: "ما هو الحيوان الذي يستطيع أن ينام وهو واقف؟", a: ["الحصان", "الزرافة"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم العملة الأمريكية؟", a: ["الدولار"], difficulty: "medium", category: "general" },
  { q: "كم عدد كيلومترات الميل الواحد تقريباً؟", a: ["1.6 كم", "1.609 كم"], difficulty: "medium", category: "general" },
  { q: "ما هو الحيوان الذي يعتبر أذكى حيوان بعد الإنسان؟", a: ["الشمبانزي", "الدلفين"], difficulty: "medium", category: "general" },
  { q: "ما هو أبرد مكان في الأرض؟", a: ["أنتاركتيكا", "القطب الجنوبي"], difficulty: "medium", category: "general" },
  { q: "كم عدد الدرجات في الدائرة الكاملة؟", a: ["360", "ثلاثمائة وستون درجة"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أشهر روبوت خيالي في الأفلام؟", a: ["R2-D2", "أوبتيموس برايم", "آر توو دي توو"], difficulty: "medium", category: "general" },
  { q: "ما هو الوحيد الذي لا يُرى بالعين ولكن موجود في الغرفة؟", a: ["الهواء", "الجراثيم", "الريح"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أشهر مسلسل أمريكي في التاريخ؟", a: ["فريندز", "مسلسل فريندز", "Breaking Bad"], difficulty: "medium", category: "general" },
  { q: "كم يبلغ عمر الكون تقريباً؟", a: ["13.8 مليار سنة", "14 مليار سنة"], difficulty: "hard", category: "general" },
  { q: "ما هو اسم عملة مصر؟", a: ["الجنيه المصري", "الجنيه"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أشهر لعبة فيديو في التاريخ؟", a: ["ماريو", "تتريس", "Tetris"], difficulty: "medium", category: "general" },
  { q: "كم عدد أقاليم مصر الإدارية؟", a: ["27", "27 محافظة"], difficulty: "hard", category: "general" },
  { q: "ما هو الحيوان الذي يمكنه رؤية الألوان الأكثر؟", a: ["الجمبري المطرقي", "الروبيان المنتيس"], difficulty: "hard", category: "general" },
  { q: "ما هو اسم البرنامج التلفزيوني الأطول عرضاً في التاريخ؟", a: ["غيني وورلد ريكوردز", "المسلسل الياباني ساتسوما"], difficulty: "hard", category: "general" },
  { q: "كم عدد نقاط الدومينو الكاملة؟", a: ["168", "28 قطعة"], difficulty: "hard", category: "general" },
  { q: "ما هو اسم العملة الأوروبية الموحدة؟", a: ["اليورو"], difficulty: "medium", category: "general" },
  { q: "ما هو الحيوان الأكثر انتشاراً في العالم؟", a: ["النملة", "الحشرات"], difficulty: "medium", category: "general" },
  { q: "ما هو اليوم الثالث من الأسبوع؟", a: ["الثلاثاء"], difficulty: "medium", category: "general" },
  { q: "كم عدد أسنان المشط المتوسط عادةً؟", a: ["السؤال خداعي لا إجابة محددة"], difficulty: "hard", category: "general" },
  { q: "ما هو أكبر رقم ذو خانة واحدة؟", a: ["9", "تسعة"], difficulty: "medium", category: "general" },
  { q: "ما هو الشكل الذي له أربعة أضلاع متساوية وأربع زوايا قائمة؟", a: ["المربع"], difficulty: "medium", category: "general" },
  { q: "كم عدد حروف كلمة شكسبير بالعربي؟", a: ["7", "سبعة حروف"], difficulty: "medium", category: "general" },
  { q: "ما هو اللون الذي يُستخدم في إشارة المرور للتوقف؟", a: ["الأحمر"], difficulty: "medium", category: "general" },
  { q: "كم كيلومتراً يساوي واحد كيلومتر مربع؟", a: ["ليس قابل للمقارنة المباشرة", "وحدتان مختلفتان"], difficulty: "hard", category: "general" },
  { q: "ما هو الرقم الوحيد الذي هو نفس الشيء بالمقلوب؟", a: ["8", "1", "0"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم الجهاز المستخدم لقياس الضغط الجوي؟", a: ["البارومتر", "ميزان الضغط"], difficulty: "medium", category: "general" },
  { q: "كم عدد غرف القلب في الإنسان؟", a: ["4", "أربع غرف"], difficulty: "medium", category: "general" },
  { q: "ما هو الحيوان الوحيد الذي لا ينام؟", a: ["البلهارسيا", "الاختلاف بين الأنواع"], difficulty: "hard", category: "general" },
  { q: "ما هو اللون الناتج من خلط كل الألوان معاً؟", a: ["الأبيض للضوء والأسود للأصباغ"], difficulty: "hard", category: "general" },
  { q: "كم عدد الكواكب في مجموعتنا الشمسية؟", a: ["8", "ثمانية"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أشهر فيلم للمخرج سبيلبرغ؟", a: ["جوز", "إندية جونز", "E.T"], difficulty: "medium", category: "general" },
  { q: "كم عدد ألوان الطيف الضوئي؟", a: ["7", "سبعة"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم الجهاز الذي يحول الصوت إلى موجات كهربائية؟", a: ["الميكروفون"], difficulty: "medium", category: "general" },
  { q: "كم عدد الثواني في يوم كامل؟", a: ["86400", "ستة وثمانون ألف وأربعمائة"], difficulty: "medium", category: "general" },
  { q: "ما هو أكبر عدد أولي؟", a: ["لا يوجد أكبر عدد أولي", "يمتد إلى مالانهاية"], difficulty: "hard", category: "general" },
  { q: "ما هو الشيء الذي له أسنان ولكن لا يعض؟", a: ["المشط", "المنشار"], difficulty: "medium", category: "general" },
  { q: "ما هو الشيء الذي يتكلم بلا لسان ويسمع بلا أذن؟", a: ["الهاتف", "الراديو", "التلفزيون"], difficulty: "medium", category: "general" },
  { q: "ما هو الشيء الذي دائماً أمامك ولكن لا يمكنك رؤيته؟", a: ["المستقبل"], difficulty: "medium", category: "general" },
  { q: "كم عدد الحواس البشرية الخمس؟", a: ["خمسة", "5"], difficulty: "medium", category: "general" },
  { q: "ما هو الشكل الذي له 3 أضلاع؟", a: ["المثلث"], difficulty: "medium", category: "general" },
  { q: "كم عدد الحروف المتحركة في العربية؟", a: ["ثلاثة طويلة", "ا و ي"], difficulty: "medium", category: "general" },
  { q: "ما هو الشيء الذي يذهب ولا يعود؟", a: ["الوقت", "الماضي"], difficulty: "medium", category: "general" },
  { q: "كم عدد أوجه المثلث؟", a: ["3", "ثلاثة"], difficulty: "medium", category: "general" },
  { q: "ما هو الشيء الذي كلما أخذت منه كلما كبر؟", a: ["الحفرة"], difficulty: "medium", category: "general" },

  // ════════════════════════════════════════
  //               ☪️ الدين
  // ════════════════════════════════════════

  { q: "كم عدد أركان الإسلام؟", a: ["5", "خمسة"], difficulty: "medium", category: "religion" },
  { q: "ما هو أول ما فُرض على المسلم؟", a: ["الشهادتان"], difficulty: "medium", category: "religion" },
  { q: "كم عدد أجزاء القرآن الكريم؟", a: ["30", "ثلاثون"], difficulty: "medium", category: "religion" },
  { q: "كم عدد سور القرآن الكريم؟", a: ["114", "مائة وأربع عشرة"], difficulty: "medium", category: "religion" },
  { q: "ما هي أول سورة في القرآن الكريم؟", a: ["الفاتحة", "سورة الفاتحة"], difficulty: "medium", category: "religion" },
  { q: "ما هي آخر سورة في القرآن الكريم؟", a: ["الناس", "سورة الناس"], difficulty: "medium", category: "religion" },
  { q: "كم عدد آيات سورة الفاتحة؟", a: ["7", "سبع آيات"], difficulty: "medium", category: "religion" },
  { q: "ما هي أطول سورة في القرآن الكريم؟", a: ["سورة البقرة", "البقرة"], difficulty: "medium", category: "religion" },
  { q: "كم عدد أنبياء الله المذكورين في القرآن؟", a: ["25", "خمسة وعشرون نبياً"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم الصحابي الذي حمل لواء الإسلام وقُطعت يده ثم رفعه بالأخرى؟", a: ["جعفر بن أبي طالب"], difficulty: "hard", category: "religion" },
  { q: "ما هو اسم أول مسجد بُني في الإسلام؟", a: ["مسجد قباء"], difficulty: "hard", category: "religion" },
  { q: "كم عدد ركعات صلاة الفجر؟", a: ["ركعتان", "2"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم السورة التي تعادل ثلث القرآن؟", a: ["الإخلاص", "سورة الإخلاص"], difficulty: "medium", category: "religion" },
  { q: "كم عدد ركعات صلاة الظهر؟", a: ["4 ركعات", "أربع ركعات"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم الملك الموكل بالوحي؟", a: ["جبريل", "سيدنا جبريل"], difficulty: "medium", category: "religion" },
  { q: "كم عدد آيات القرآن الكريم تقريباً؟", a: ["6236", "6666", "أكثر من ستة آلاف"], difficulty: "hard", category: "religion" },
  { q: "ما هي السورة التي تُسمى قلب القرآن؟", a: ["يس", "سورة يس"], difficulty: "medium", category: "religion" },
  { q: "كم عدد أشهر رمضان في السنة؟", a: ["شهر واحد", "1"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم الجبل الذي نزل فيه الوحي لأول مرة؟", a: ["جبل حراء", "حراء"], difficulty: "medium", category: "religion" },
  { q: "ما هي أسماء الله الحسنى عددها؟", a: ["99", "تسعة وتسعون"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم أول امرأة آمنت بالإسلام؟", a: ["السيدة خديجة", "أم المؤمنين خديجة"], difficulty: "medium", category: "religion" },
  { q: "كم عدد الصحابة الذين حفظوا القرآن في عهد النبي؟", a: ["سبعة", "7"], difficulty: "hard", category: "religion" },
  { q: "ما هو اسم الكتاب الذي أُنزل على موسى؟", a: ["التوراة"], difficulty: "medium", category: "religion" },
  { q: "ما هو الاسم الأول للنبي محمد قبل الإسلام؟", a: ["محمد", "الاسم ظل محمداً"], difficulty: "medium", category: "religion" },
  { q: "كم عدد ركعات صلاة العشاء؟", a: ["4", "أربع ركعات"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم النبي الذي بنى الكعبة مع ابنه؟", a: ["إبراهيم عليه السلام", "سيدنا إبراهيم"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم الكتاب الذي أُنزل على عيسى؟", a: ["الإنجيل"], difficulty: "medium", category: "religion" },
  { q: "كم عدد ركعات صلاة المغرب؟", a: ["3", "ثلاث ركعات"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم الليلة المقدسة في رمضان؟", a: ["ليلة القدر"], difficulty: "medium", category: "religion" },
  { q: "كم عدد شروط الصلاة؟", a: ["9", "تسعة"], difficulty: "hard", category: "religion" },
  { q: "ما هو اسم آخر نبي في الإسلام؟", a: ["محمد", "النبي محمد"], difficulty: "medium", category: "religion" },
  { q: "ما هي السورة التي لا تبدأ بالبسملة؟", a: ["التوبة", "سورة التوبة"], difficulty: "medium", category: "religion" },
  { q: "كم عدد أركان الإيمان؟", a: ["6", "ستة"], difficulty: "medium", category: "religion" },
  { q: "ما هي السورة التي فيها سجود؟", a: ["سجود القرآن في 15 موضع"], difficulty: "hard", category: "religion" },
  { q: "ما هو اسم السورة التي تعادل ربع القرآن؟", a: ["الكافرون", "قل يا أيها الكافرون"], difficulty: "hard", category: "religion" },
  { q: "كم عدد الأنبياء أولو العزم؟", a: ["5", "خمسة"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم النبي الذي ابتلي بالمرض الشديد وصبر؟", a: ["أيوب عليه السلام", "سيدنا أيوب"], difficulty: "medium", category: "religion" },
  { q: "ما هي السورة التي سُميت بسورة المدثر؟", a: ["المدثر", "سورة المدثر"], difficulty: "medium", category: "religion" },
  { q: "كم عدد أجنحة جبريل عليه السلام؟", a: ["600", "ستمائة"], difficulty: "hard", category: "religion" },
  { q: "ما هو اسم الصحابي الأول الذي آمن بالإسلام من الرجال؟", a: ["أبو بكر الصديق", "علي بن أبي طالب", "خديجة أولاً"], difficulty: "hard", category: "religion" },

  // ════════════════════════════════════════
  //             💻 البرمجة والتكنولوجيا
  // ════════════════════════════════════════

  { q: "ما هو اسم مؤسس فيسبوك؟", a: ["مارك زوكربيرغ", "زوكربيرغ"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم لغة البرمجة التي طورتها آبل؟", a: ["Swift", "سويفت"], difficulty: "medium", category: "programming" },
  { q: "ما هي لغة البرمجة الأكثر استخداماً في الويب؟", a: ["JavaScript", "جافاسكريبت"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى HTML؟", a: ["HyperText Markup Language", "لغة ترميز النص الفائق"], difficulty: "medium", category: "programming" },
  { q: "من هو مؤسس شركة آبل؟", a: ["ستيف جوبز", "ستيف وزنياك", "جوبز ووزنياك"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم نظام التشغيل الذي طورته مايكروسوفت؟", a: ["ويندوز", "Windows"], difficulty: "medium", category: "programming" },
  { q: "ما هي اللغة التي يستخدمها الذكاء الاصطناعي غالباً؟", a: ["Python", "بايثون"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى CPU؟", a: ["وحدة المعالجة المركزية", "Central Processing Unit"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم مؤسس تويتر؟", a: ["جاك دورسي", "دورسي"], difficulty: "medium", category: "programming" },
  { q: "ما هي لغة البرمجة التي تعتمد على مفهوم الكائنات؟", a: ["Java", "C++", "Python"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى GPS؟", a: ["نظام تحديد المواقع العالمي", "Global Positioning System"], difficulty: "medium", category: "programming" },
  { q: "من هو مؤسس شركة أمازون؟", a: ["جيف بيزوس", "بيزوس"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى RAM؟", a: ["ذاكرة الوصول العشوائي", "Random Access Memory"], difficulty: "medium", category: "programming" },
  { q: "ما هي لغة البرمجة التي ابتكرتها جيمس غوسلينج؟", a: ["Java", "جافا"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أكبر شركة تقنية في العالم بالقيمة السوقية؟", a: ["أبل", "Apple", "مايكروسوفت"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى URL؟", a: ["عنوان محدد للموارد", "Uniform Resource Locator"], difficulty: "medium", category: "programming" },
  { q: "من هو مؤسس شركة مايكروسوفت؟", a: ["بيل غيتس", "بول ألن", "بيل جيتس"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم متصفح الإنترنت الخاص بجوجل؟", a: ["كروم", "Google Chrome", "جوجل كروم"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى USB؟", a: ["ناقل تسلسلي عالمي", "Universal Serial Bus"], difficulty: "medium", category: "programming" },
  { q: "ما هي اللغة التي تستخدمها قواعد البيانات؟", a: ["SQL", "إس كيو إل"], difficulty: "medium", category: "programming" },
  { q: "من هو مؤسس لينكس؟", a: ["لينوس تورفالدز", "تورفالدز"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى AI؟", a: ["الذكاء الاصطناعي", "Artificial Intelligence"], difficulty: "medium", category: "programming" },
  { q: "ما هي اللغة المستخدمة في تطوير تطبيقات أندرويد؟", a: ["Java", "Kotlin", "جافا وكوتلن"], difficulty: "medium", category: "programming" },
  { q: "من هو مؤسس شركة تيسلا؟", a: ["إيلون ماسك", "ماسك"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى API؟", a: ["واجهة برمجة التطبيقات", "Application Programming Interface"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أشهر لغة برمجة لتحليل البيانات؟", a: ["Python", "R", "بايثون"], difficulty: "medium", category: "programming" },
  { q: "من مؤسس جوجل؟", a: ["لاري بيج وسيرجي برين", "بيج وبرين"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى IoT؟", a: ["إنترنت الأشياء", "Internet of Things"], difficulty: "medium", category: "programming" },
  { q: "ما هي اللغة التي تُستخدم في برمجة المواقع من جانب الخادم؟", a: ["PHP", "Node.js", "Python"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى WiFi؟", a: ["Wireless Fidelity", "الاتصال اللاسلكي"], difficulty: "medium", category: "programming" },
  { q: "من هو أول مبرمج في التاريخ؟", a: ["آدا لوفلاس", "Ada Lovelace"], difficulty: "hard", category: "programming" },
  { q: "ما هو معنى VPN؟", a: ["الشبكة الخاصة الافتراضية", "Virtual Private Network"], difficulty: "medium", category: "programming" },
  { q: "ما هي اللغة التي تستخدمها ليغو روبوتكس؟", a: ["Python", "Scratch", "NXT-G"], difficulty: "hard", category: "programming" },
  { q: "ما هو اسم نظام التشغيل الخاص بأبل للهاتف؟", a: ["iOS", "آي أو إس"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى LAN؟", a: ["الشبكة المحلية", "Local Area Network"], difficulty: "medium", category: "programming" },
  { q: "من هو مؤسس شركة SpaceX؟", a: ["إيلون ماسك", "ماسك"], difficulty: "medium", category: "programming" },
  { q: "ما هو أول برنامج فيديو على الإنترنت؟", a: ["يوتيوب", "YouTube"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى HTTP؟", a: ["بروتوكول نقل النص الفائق", "HyperText Transfer Protocol"], difficulty: "medium", category: "programming" },
  { q: "ما هي اللغة الأصلية لتطوير نظام أندرويد؟", a: ["Java", "C"], difficulty: "hard", category: "programming" },
  { q: "من هو مؤسس ووردبريس؟", a: ["مات مولنويغ", "Mullenweg"], difficulty: "hard", category: "programming" },
  { q: "ما هو معنى OS؟", a: ["نظام التشغيل", "Operating System"], difficulty: "medium", category: "programming" },
  { q: "ما هي اللغة التي طورتها موزيلا؟", a: ["Rust", "راست"], difficulty: "hard", category: "programming" },
  { q: "من هو مؤسس يوتيوب؟", a: ["تشاد هيرلي وستيف تشين", "جاويد كريم"], difficulty: "hard", category: "programming" },
  { q: "ما هو معنى CSS؟", a: ["صفحات التنسيق المتتالية", "Cascading Style Sheets"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم لغة البرمجة التي طورتها جوجل؟", a: ["Go", "Dart", "جولانج"], difficulty: "medium", category: "programming" },
  { q: "ما هو أكبر نوع من البيانات في الذاكرة؟", a: ["Big Data", "ضخم البيانات"], difficulty: "medium", category: "programming" },
  { q: "من هو مؤسس إنستغرام؟", a: ["كيفن سيستروم ومايك كريغر", "سيستروم"], difficulty: "hard", category: "programming" },
  { q: "ما هو معنى SEO؟", a: ["تحسين محركات البحث", "Search Engine Optimization"], difficulty: "medium", category: "programming" },
  { q: "ما هي لغة البرمجة التي تستخدمها أردوينو؟", a: ["C++", "Arduino C"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى SSD؟", a: ["محرك الأقراص الصلبة الصلب", "Solid State Drive"], difficulty: "medium", category: "programming" },

  // ════════════════════════════════════════
  //           🧠 أسئلة إضافية متنوعة
  // ════════════════════════════════════════

  { q: "ما هو اسم أشهر تمثال في العالم؟", a: ["تمثال الحرية", "الموناليزا ليست تمثال"], difficulty: "medium", category: "general" },
  { q: "في أي دولة تقع شلالات نياغارا؟", a: ["الولايات المتحدة وكندا", "بين كندا والولايات المتحدة"], difficulty: "medium", category: "geography" },
  { q: "كم يبلغ عمر هرم خوفو تقريباً؟", a: ["4500 سنة", "2560 قبل الميلاد"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم أشهر شاعر عربي؟", a: ["المتنبي", "أبو الطيب المتنبي"], difficulty: "medium", category: "general" },
  { q: "من هو مخترع التلفزيون؟", a: ["جون لوجي بيرد", "بيرد"], difficulty: "hard", category: "history" },
  { q: "ما هو اسم أول رئيس للجمهورية الفرنسية؟", a: ["لويس نابليون بونابرت", "نابليون الثالث"], difficulty: "hard", category: "history" },
  { q: "ما هو اسم أشهر ملحمة شعرية يونانية؟", a: ["الإلياذة", "إلياذة هوميروس"], difficulty: "medium", category: "history" },
  { q: "في أي مدينة وُلد الشاعر المتنبي؟", a: ["الكوفة"], difficulty: "hard", category: "history" },
  { q: "ما هو اسم أكبر بحيرة مالحة في العالم؟", a: ["بحر قزوين", "بحيرة قزوين"], difficulty: "medium", category: "geography" },
  { q: "من هو مخترع الإذاعة؟", a: ["غوليلمو ماركوني", "ماركوني"], difficulty: "hard", category: "history" },
  { q: "ما هو عدد دول الخليج العربي؟", a: ["6", "ستة"], difficulty: "medium", category: "geography" },
  { q: "من هو مؤلف رواية ألف ليلة وليلة؟", a: ["مجهول", "متعدد المؤلفين"], difficulty: "hard", category: "general" },
  { q: "ما هو اسم أشهر موسيقار في التاريخ؟", a: ["بيتهوفن", "موزارت", "باخ"], difficulty: "medium", category: "general" },
  { q: "من هو أول مصري يفوز بجائزة نوبل للأدب؟", a: ["نجيب محفوظ"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم النهر الذي يعبر باريس؟", a: ["السين", "نهر السين"], difficulty: "medium", category: "geography" },
  { q: "كم عدد ولايات الولايات المتحدة؟", a: ["50", "خمسون"], difficulty: "medium", category: "geography" },
  { q: "من هو مخترع الطابعة؟", a: ["يوهانس غوتنبرغ", "غوتنبرغ"], difficulty: "hard", category: "history" },
  { q: "ما هو اسم أكبر حيوان على اليابسة؟", a: ["الفيل الأفريقي", "الفيل"], difficulty: "medium", category: "science" },
  { q: "من هو مؤلف رواية البؤساء؟", a: ["فيكتور هوغو", "هوغو"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أكبر بحيرة عذبة في العالم؟", a: ["بحيرة سوبيريور", "Lake Superior"], difficulty: "hard", category: "geography" },
  { q: "من هو مؤلف رواية دون كيشوت؟", a: ["ميغيل دي ثيربانتس", "ثيربانتس"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أشهر لوحة في العالم؟", a: ["الموناليزا", "Mona Lisa"], difficulty: "medium", category: "general" },
  { q: "من رسم لوحة الموناليزا؟", a: ["ليوناردو دافينشي", "دافينشي"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أشهر أوبرا في التاريخ؟", a: ["دار أوبرا ميلانو", "لا سكالا"], difficulty: "hard", category: "general" },
  { q: "من هو مؤلف رواية الحرب والسلام؟", a: ["تولستوي", "ليو تولستوي"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أكبر سفينة في العالم؟", a: ["سيمفوني أوف ذا سيز", "هارمونيا"], difficulty: "hard", category: "general" },
  { q: "من هو مؤلف رواية العجوز والبحر؟", a: ["إرنست هيمنغواي", "هيمنغواي"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أطول جدار في التاريخ البشري؟", a: ["سور الصين العظيم", "الجدار العظيم"], difficulty: "medium", category: "history" },
  { q: "من هو مؤلف مسرحية هاملت؟", a: ["شكسبير", "ويليام شكسبير"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أكبر تمثال في العالم؟", a: ["تمثال الوحدة", "Statue of Unity"], difficulty: "hard", category: "general" },
  { q: "من هو أول عربي يصل للفضاء؟", a: ["الأمير سلطان بن سلمان", "سلطان بن سلمان"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم الجزيرة التي نُفي إليها نابليون؟", a: ["سانت هيلينا", "إلبا"], difficulty: "hard", category: "history" },
  { q: "من هو مؤلف رواية مئة عام من العزلة؟", a: ["غابريل غارسيا ماركيز", "ماركيز"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أكبر نهر في أوروبا من حيث التصريف؟", a: ["الفولغا", "الدانوب"], difficulty: "hard", category: "geography" },
  { q: "من هو مخترع التلغراف؟", a: ["صموئيل مورس", "مورس"], difficulty: "hard", category: "history" },
  { q: "ما هو اسم أكبر دولة عربية مساحةً؟", a: ["الجزائر"], difficulty: "medium", category: "geography" },
  { q: "من هو مؤلف كتاب المقدمة الشهير؟", a: ["ابن خلدون", "عبد الرحمن ابن خلدون"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم أعلى دولة في العالم من حيث المتوسط؟", a: ["ليسوتو", "البوتان"], difficulty: "hard", category: "geography" },
  { q: "من هو مؤسس علم الجبر؟", a: ["الخوارزمي", "محمد بن موسى الخوارزمي"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم أكبر ديانة في العالم؟", a: ["المسيحية", "الإسلام"], difficulty: "medium", category: "general" },
  { q: "من هو مخترع المصباح الكهربائي؟", a: ["توماس إديسون", "إديسون"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم أشهر بناء في الهند؟", a: ["تاج محل"], difficulty: "medium", category: "geography" },
  { q: "من هو مؤلف قصيدة المتنبي الأشهر؟", a: ["المتنبي لديه عدة قصائد شهيرة", "على قدر أهل العزم"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أكبر صحراء رملية في العالم؟", a: ["الربع الخالي", "صحراء الربع الخالي"], difficulty: "hard", category: "geography" },
  { q: "من هو مؤسس علم البصريات؟", a: ["ابن الهيثم", "الحسن بن الهيثم"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم الجبل الذي يقع في حدود مصر والسعودية؟", a: ["جبل الشيخ", "سيناء"], difficulty: "hard", category: "geography" },
  { q: "من هو مؤلف كتاب الشفاء الفلسفي؟", a: ["ابن سينا", "أبو علي ابن سينا"], difficulty: "hard", category: "history" },
  { q: "ما هو اسم أكبر مسجد في العالم؟", a: ["المسجد الحرام", "مسجد مكة المكرمة"], difficulty: "medium", category: "religion" },
  { q: "من هو مؤسس علم الكيمياء الحديثة؟", a: ["أنتوان لافوازييه", "لافوازييه"], difficulty: "hard", category: "history" },
  { q: "ما هو اسم أكبر قلعة في العالم؟", a: ["قلعة الكرك", "قلعة براغ"], difficulty: "hard", category: "general" },
  { q: "من هو مخترع الساعة؟", a: ["كريستيان هويغنس", "هويغنس"], difficulty: "hard", category: "history" },
  { q: "ما هو اسم أكبر ملعب كرة قدم في العالم؟", a: ["ملعب رانغيري نوني", "ملعب ملبورن"], difficulty: "hard", category: "sports" },
  { q: "من هو أول شخص يسبح عبر قناة المانش؟", a: ["ماتيو ويب", "ماتيو ويب 1875"], difficulty: "hard", category: "sports" },
  { q: "ما هو اسم أشهر مهرجان موسيقي في العالم؟", a: ["وودستوك", "Coachella"], difficulty: "medium", category: "general" },
  { q: "كم عدد الكواكب التي تملك حلقات؟", a: ["4", "أربعة كواكب"], difficulty: "hard", category: "science" },
  { q: "ما هو الكوكب الذي يدور عكس اتجاه عقارب الساعة؟", a: ["الزهرة", "Venus"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم أطول سور في العالم؟", a: ["سور الصين العظيم", "جدار الصين"], difficulty: "medium", category: "history" },
  { q: "من هو مخترع السيارة؟", a: ["كارل بنز", "كارل بنز 1885"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم أشهر كتاب عربي في العالم؟", a: ["ألف ليلة وليلة", "القرآن الكريم"], difficulty: "medium", category: "general" },
  { q: "في أي دولة تقع جزر هاواي؟", a: ["الولايات المتحدة"], difficulty: "medium", category: "geography" },
  { q: "من هو مؤسس علم الجغرافيا؟", a: ["إراتوستينيس", "البيروني"], difficulty: "hard", category: "history" },
  { q: "ما هو اسم أكبر بلد في العالم من حيث السكان؟", a: ["الهند", "الصين"], difficulty: "medium", category: "geography" },
  { q: "من هو مخترع الطيارة؟", a: ["أخوان رايت", "رايت"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم أشهر رقصة شعبية مصرية؟", a: ["الرقص الشرقي", "البلدي"], difficulty: "medium", category: "general" },
  { q: "في أي دولة يقع متحف الأرميتاج؟", a: ["روسيا", "سانت بطرسبرغ"], difficulty: "medium", category: "geography" },
  { q: "من هو أشهر عالم مسلم في الطب؟", a: ["ابن سينا", "أبو بكر الرازي"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم أكبر بنك في العالم؟", a: ["البنك الصناعي والتجاري الصيني", "ICBC"], difficulty: "hard", category: "general" },
  { q: "من هو مؤلف رواية الشيخ والبحر بالعربية؟", a: ["هيمنغواي باللغة الإنجليزية", "الشيح والبحر لهيمنغواي"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أكبر سوق مالي في العالم؟", a: ["بورصة نيويورك", "Wall Street"], difficulty: "medium", category: "general" },
  { q: "من هو مؤلف رواية الجريمة والعقاب؟", a: ["دوستويفسكي", "فيودور دوستويفسكي"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أكبر صحيفة في العالم بالتوزيع؟", a: ["يوميوري شيمبون", "اليابانية"], difficulty: "hard", category: "general" },
  { q: "من هو مؤسس حركة طالبان؟", a: ["الملا عمر", "محمد عمر"], difficulty: "hard", category: "history" },
  { q: "ما هو اسم أكبر حيوان بري في أستراليا؟", a: ["الكنغر", "الكنغرو"], difficulty: "medium", category: "science" },
  { q: "من هو مؤلف رواية المسخ؟", a: ["كافكا", "فرانز كافكا"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أكبر قارة من حيث السكان؟", a: ["آسيا"], difficulty: "medium", category: "geography" },
  { q: "من هو مخترع الهاتف الذكي؟", a: ["آبل", "ستيف جوبز", "IBM Simon أول هاتف ذكي"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أكبر متحف في العالم؟", a: ["اللوفر", "متحف اللوفر"], difficulty: "medium", category: "general" },
  { q: "من هو مؤلف قصة روبنسون كروزو؟", a: ["دانيال ديفو", "دانييل ديفو"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أكبر بركان في العالم؟", a: ["موناكيا", "ماونا لوا"], difficulty: "hard", category: "geography" },
  { q: "من هو مؤلف رواية كبرياء وتحيز؟", a: ["جين أوستن", "أوستن"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أكبر حيوان في المحيط؟", a: ["الحوت الأزرق"], difficulty: "medium", category: "science" },
  { q: "من هو مؤلف رواية ألف شمس مشرقة؟", a: ["خالد حسيني", "حسيني"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أكبر شلال في العالم؟", a: ["شلالات نياغارا", "شلالات فيكتوريا", "أنجل فولز"], difficulty: "medium", category: "geography" },
  { q: "من هو مؤلف رواية ذهب مع الريح؟", a: ["مارغريت ميتشيل", "ميتشيل"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أكبر نجم معروف في الكون؟", a: ["VY Canis Majoris", "ستيفنسون 2-18"], difficulty: "hard", category: "science" },
  { q: "من هو مؤلف رواية مزرعة الحيوانات؟", a: ["جورج أورويل", "أورويل"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أكبر جبل في المجموعة الشمسية؟", a: ["أوليمبوس مونس", "جبل أوليمبوس على المريخ"], difficulty: "hard", category: "science" },
  { q: "من هو مؤلف رواية 1984؟", a: ["جورج أورويل", "أورويل"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أكبر نهر في أفريقيا من حيث الطول؟", a: ["النيل", "نهر النيل"], difficulty: "medium", category: "geography" },
  { q: "من هو مؤلف رواية شيفرة دافينشي؟", a: ["دان براون", "براون"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أكبر قاعدة عسكرية في العالم؟", a: ["فورت براغ", "Fort Bragg"], difficulty: "hard", category: "general" },
  { q: "من هو مؤلف قصيدة فلسطين على الصليب؟", a: ["إبراهيم طوقان", "طوقان"], difficulty: "hard", category: "general" },
  { q: "ما هو اسم أكبر اتحاد اقتصادي في العالم؟", a: ["الاتحاد الأوروبي", "EU"], difficulty: "medium", category: "general" },
  { q: "من هو مؤلف رواية الطاعون؟", a: ["ألبير كامو", "كامو"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أكبر مطار في العالم؟", a: ["مطار الملك فهد الدولي", "مطار الملك فهد"], difficulty: "hard", category: "general" },
  { q: "من هو مؤلف رواية العطر؟", a: ["باتريك زوسكيند", "زوسكيند"], difficulty: "hard", category: "general" },
  { q: "ما هو اسم أكبر كتلة مائية في العالم؟", a: ["المحيط الهادئ", "الهادئ"], difficulty: "medium", category: "geography" },
  { q: "من هو مؤلف رواية موبي ديك؟", a: ["هيرمان ميلفيل", "ميلفيل"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أكبر غابة استوائية في العالم؟", a: ["غابة الأمازون", "الأمازون"], difficulty: "medium", category: "geography" },
  { q: "من هو مؤلف رواية الأمير الصغير؟", a: ["أنطوان دو سانت إكزوبيري", "سانت إكزوبيري"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أكبر دلتا نهرية في العالم؟", a: ["دلتا النيل", "دلتا الغانج"], difficulty: "hard", category: "geography" },
  { q: "من هو مؤلف رواية عناقيد الغضب؟", a: ["جون ستاينبك", "ستاينبك"], difficulty: "medium", category: "general" },

  // ════════════════════════════════════════
  //       📚 تاريخ إضافي (الجزء الثاني)
  // ════════════════════════════════════════
  { q: "من هو أبو الطب في التاريخ؟", a: ["أبوقراط", "هيبوقراط"], difficulty: "medium", category: "history" },
  { q: "في أي عام وقعت ثورة عرابي في مصر؟", a: ["1882", "١٨٨٢"], difficulty: "hard", category: "history" },
  { q: "من قاد ثورة عرابي؟", a: ["أحمد عرابي", "العقيد عرابي"], difficulty: "medium", category: "history" },
  { q: "في أي عام أُسست مدينة الإسكندرية؟", a: ["332 ق.م", "331 ق.م"], difficulty: "hard", category: "history" },
  { q: "من أسس مدينة الإسكندرية؟", a: ["الإسكندر الأكبر"], difficulty: "medium", category: "history" },
  { q: "في أي عام وقعت معركة مرج دابق؟", a: ["1516", "922 هجري"], difficulty: "hard", category: "history" },
  { q: "في أي عام توفي صلاح الدين الأيوبي؟", a: ["1193", "589 هجري"], difficulty: "hard", category: "history" },
  { q: "في أي مدينة وُلد صلاح الدين الأيوبي؟", a: ["تكريت"], difficulty: "hard", category: "history" },
  { q: "ما هو اسم المعاهدة التي أنهت الحرب العالمية الأولى؟", a: ["معاهدة فرساي", "فرساي"], difficulty: "medium", category: "history" },
  { q: "في أي مدينة وُقّعت معاهدة فرساي؟", a: ["فرساي", "باريس"], difficulty: "medium", category: "history" },
  { q: "من هو الزعيم النازي الذي حكم ألمانيا؟", a: ["أدولف هتلر", "هتلر"], difficulty: "medium", category: "history" },
  { q: "في أي عام تأسس الحزب النازي؟", a: ["1920", "١٩٢٠"], difficulty: "hard", category: "history" },
  { q: "في أي تاريخ كان يوم الإنزال في نورماندي؟", a: ["6 يونيو 1944", "D-Day"], difficulty: "medium", category: "history" },
  { q: "من هو الرئيس الأمريكي الذي أمر بإلقاء القنبلة الذرية؟", a: ["هاري ترومان", "ترومان"], difficulty: "medium", category: "history" },
  { q: "في أي عام استقلت الهند عن بريطانيا؟", a: ["1947", "١٩٤٧"], difficulty: "medium", category: "history" },
  { q: "من هو أول رئيس وزراء للهند؟", a: ["جواهر لال نهرو", "نهرو"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم الزعيم الذي أسس جمهورية الصين الشعبية؟", a: ["ماو تسي تونغ", "ماو"], difficulty: "medium", category: "history" },
  { q: "في أي عام أُسست جمهورية الصين الشعبية؟", a: ["1949", "١٩٤٩"], difficulty: "medium", category: "history" },
  { q: "في أي عام أُلغي النظام الملكي في مصر؟", a: ["1953", "١٩٥٣"], difficulty: "medium", category: "history" },
  { q: "من هو آخر ملوك مصر؟", a: ["الملك فاروق"], difficulty: "medium", category: "history" },
  { q: "في أي عام توفي جمال عبد الناصر؟", a: ["1970", "١٩٧٠"], difficulty: "medium", category: "history" },
  { q: "من خلف جمال عبد الناصر في الرئاسة؟", a: ["أنور السادات", "السادات"], difficulty: "medium", category: "history" },
  { q: "في أي عام وقّع السادات اتفاقية السلام مع إسرائيل؟", a: ["1979", "١٩٧٩"], difficulty: "medium", category: "history" },
  { q: "في أي عام اغتيل أنور السادات؟", a: ["1981", "١٩٨١"], difficulty: "medium", category: "history" },
  { q: "من خلف أنور السادات في الرئاسة؟", a: ["حسني مبارك", "مبارك"], difficulty: "medium", category: "history" },
  { q: "في أي جزيرة وُلد نابليون؟", a: ["كورسيكا"], difficulty: "hard", category: "history" },
  { q: "في أي عام توفي نابليون؟", a: ["1821", "١٨٢١"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم معركة نابليون الأشهر؟", a: ["أوسترليتز", "واترلو"], difficulty: "medium", category: "history" },
  { q: "من هو أبو العلاء المعري؟", a: ["شاعر عربي عباسي أعمى", "الشاعر الفيلسوف"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم الكتاب الذي كتبه ابن بطوطة عن رحلاته؟", a: ["تحفة النظار", "رحلة ابن بطوطة"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم العملية العسكرية لغزو نورماندي؟", a: ["عملية أوفرلورد", "يوم الإنزال"], difficulty: "hard", category: "history" },
  { q: "من هو رئيس الوزراء البريطاني خلال الحرب العالمية الثانية؟", a: ["ونستون تشرشل", "تشرشل"], difficulty: "medium", category: "history" },
  { q: "في أي عام دخلت الولايات المتحدة الحرب العالمية الثانية؟", a: ["1941", "١٩٤١"], difficulty: "medium", category: "history" },
  { q: "ما هو الصحابي الذي يُلقب بسيف الله المسلول؟", a: ["خالد بن الوليد"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم أول مسجد بُني في الإسلام؟", a: ["مسجد قباء"], difficulty: "hard", category: "history" },
  { q: "في أي عام فتح محمد الفاتح القسطنطينية؟", a: ["1453", "857 هجري"], difficulty: "medium", category: "history" },
  { q: "كم كان عمر محمد الفاتح حين فتح القسطنطينية؟", a: ["21 سنة"], difficulty: "hard", category: "history" },
  { q: "في أي عام فتح المسلمون الأندلس؟", a: ["711 م", "92 هجري"], difficulty: "medium", category: "history" },
  { q: "في أي عام سقطت غرناطة آخر معاقل المسلمين في الأندلس؟", a: ["1492", "١٤٩٢"], difficulty: "medium", category: "history" },
  { q: "في أي عام بدأت الحرب الأمريكية الأهلية؟", a: ["1861", "١٨٦١"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم العبد الذي قاد ثورة ضد الرومان؟", a: ["سبارتاكوس"], difficulty: "medium", category: "history" },
  { q: "من هو الفيلسوف اليوناني الذي عاقبته أثينا بالسم؟", a: ["سقراط"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم تلميذ أفلاطون الأشهر؟", a: ["أرسطو"], difficulty: "medium", category: "history" },
  { q: "من اغتال أنور السادات؟", a: ["خالد الإسلامبولي", "تنظيم الجهاد"], difficulty: "hard", category: "history" },
  { q: "في أي عام اغتيل عمر بن الخطاب؟", a: ["644 م", "23 هجري"], difficulty: "hard", category: "history" },
  { q: "من اغتال عمر بن الخطاب؟", a: ["أبو لؤلؤة المجوسي", "فيروز"], difficulty: "hard", category: "history" },
  { q: "في أي عام فتح المسلمون مصر؟", a: ["641", "21 هجري"], difficulty: "hard", category: "history" },
  { q: "من قاد فتح مصر الإسلامي؟", a: ["عمرو بن العاص"], difficulty: "medium", category: "history" },
  { q: "في أي عام وقعت معركة عين جالوت؟", a: ["1260", "658 هجري"], difficulty: "hard", category: "history" },
  { q: "ما هو اسم الجبل الذي رست عليه سفينة نوح؟", a: ["الجودي", "جبل أرارات"], difficulty: "hard", category: "history" },
  { q: "في أي عام اخترع غوتنبرغ الطباعة في أوروبا؟", a: ["1450", "1440"], difficulty: "hard", category: "history" },
  { q: "من اخترع المحرك البخاري؟", a: ["جيمس وات", "Watt"], difficulty: "medium", category: "history" },
  { q: "من اخترع القطار البخاري؟", a: ["جورج ستيفنسون", "Stephenson"], difficulty: "medium", category: "history" },
  { q: "في أي عام طارت أول طيارة؟", a: ["1903", "١٩٠٣"], difficulty: "medium", category: "history" },
  { q: "في أي عام اخترع بنز السيارة؟", a: ["1885", "١٨٨٥"], difficulty: "hard", category: "history" },
  { q: "من اخترع الأشعة السينية؟", a: ["فيلهلم رونتغن", "Röntgen"], difficulty: "medium", category: "history" },
  { q: "في أي عام اكتُشفت الأشعة السينية؟", a: ["1895", "١٨٩٥"], difficulty: "hard", category: "history" },
  { q: "من اخترع التلفزيون؟", a: ["جون لوجي بيرد", "Baird"], difficulty: "medium", category: "history" },
  { q: "من اخترع الليزر؟", a: ["ثيودور مايمان", "Maiman"], difficulty: "hard", category: "history" },
  { q: "من اخترع الإنترنت؟", a: ["تيم بيرنرز لي", "Tim Berners-Lee"], difficulty: "medium", category: "history" },
  { q: "في أي عام اخترع بيرنرز لي الويب؟", a: ["1989", "١٩٨٩"], difficulty: "hard", category: "history" },
  { q: "من اخترع الراديو؟", a: ["ماركوني", "غولييلمو ماركوني"], difficulty: "medium", category: "history" },
  { q: "من فكّ رموز اللغة الهيروغليفية؟", a: ["شامبليون", "جان فرانسوا شامبليون"], difficulty: "medium", category: "history" },
  { q: "في أي عام اكتُشفت حجر رشيد؟", a: ["1799", "١٧٩٩"], difficulty: "hard", category: "history" },
  { q: "ما هو اسم الحروب التي دارت بين فارس واليونان؟", a: ["الحروب الفارسية اليونانية", "حروب الميديين"], difficulty: "hard", category: "history" },
  { q: "ما هو اسم آخر إمبراطور روماني في الغرب؟", a: ["رومولوس أوغسطولوس"], difficulty: "hard", category: "history" },
  { q: "في أي عام سقطت الإمبراطورية الرومانية الغربية؟", a: ["476", "٤٧٦ م"], difficulty: "hard", category: "history" },
  { q: "من هو مؤلف كتاب فن الحرب؟", a: ["سون تزو", "Sun Tzu"], difficulty: "medium", category: "history" },

  // ════════════════════════════════════════
  //       🌍 جغرافيا إضافية (الجزء الثاني)
  // ════════════════════════════════════════
  { q: "في أي دولة تقع مدينة إسطنبول؟", a: ["تركيا"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع مدينة كوالالمبور؟", a: ["ماليزيا"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع مدينة ساو باولو؟", a: ["البرازيل"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع جبال الأورال؟", a: ["روسيا"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر شبه جزيرة في العالم؟", a: ["شبه الجزيرة العربية", "أرابيا"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع مدينة سنغافورة؟", a: ["سنغافورة دولة مدينة", "سنغافورة"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع مدينة كيب تاون؟", a: ["جنوب أفريقيا", "جنوب إفريقيا"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع مدينة كيتو؟", a: ["الإكوادور", "Ecuador"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع جزر الغالاباغوس؟", a: ["الإكوادور"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع صحراء أتاكاما؟", a: ["تشيلي", "بيرو"], difficulty: "medium", category: "geography" },
  { q: "ما هي أجف صحراء في العالم؟", a: ["أتاكاما", "صحراء أتاكاما"], difficulty: "hard", category: "geography" },
  { q: "في أي دولة تقع مدينة لاباز؟", a: ["بوليفيا"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أعلى بحيرة ملاحية في العالم؟", a: ["بحيرة تيتيكاكا"], difficulty: "hard", category: "geography" },
  { q: "في أي دولة تقع مدينة ريكيافيك؟", a: ["آيسلندا", "أيسلندا"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة آيسلندا؟", a: ["ريكيافيك"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر جزيرة في المحيط الهادئ؟", a: ["غينيا الجديدة", "New Guinea"], difficulty: "hard", category: "geography" },
  { q: "في أي دولة تقع مدينة أوكلاند؟", a: ["نيوزيلندا"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة نيوزيلندا؟", a: ["ويلينغتون"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر ولاية في الولايات المتحدة؟", a: ["ألاسكا"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر مدينة في الولايات المتحدة؟", a: ["نيويورك", "New York"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة سويسرا؟", a: ["برن"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة الدنمارك؟", a: ["كوبنهاغن"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة فنلندا؟", a: ["هلسنكي"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة السويد؟", a: ["ستوكهولم"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة النمسا؟", a: ["فيينا"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة المجر؟", a: ["بودابست"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة رومانيا؟", a: ["بوخارست"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة اليونان؟", a: ["أثينا"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة تشيلي؟", a: ["سانتياغو"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة كولومبيا؟", a: ["بوغوتا"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة فنزويلا؟", a: ["كاراكاس"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة بيرو؟", a: ["ليما"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة الأوروغواي؟", a: ["𝐶𝑟𝑎𝑧𝑦فيدو"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة غانا؟", a: ["أكرا"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة إثيوبيا؟", a: ["أديس أبابا"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة أوغندا؟", a: ["كمبالا"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة كينيا؟", a: ["نيروبي"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة زيمبابوي؟", a: ["هراري"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة أنغولا؟", a: ["لواندا"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة الكاميرون؟", a: ["ياوندي"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة السنغال؟", a: ["داكار"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة موريتانيا؟", a: ["نواكشوط"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة مالي؟", a: ["باماكو"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة الصومال؟", a: ["مقديشو"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة رواندا؟", a: ["كيغالي"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة أفغانستان؟", a: ["كابول"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة نيبال؟", a: ["كاتماندو", "كاتمندو"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة كمبوديا؟", a: ["بنوم بنه"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة فيتنام؟", a: ["هانوي"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة تايوان؟", a: ["تايبيه"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة منغوليا؟", a: ["أولان باتور", "أولانباتور"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة كوريا الشمالية؟", a: ["بيونغ يانغ", "بيونغيانغ"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة تايلاند؟", a: ["بانكوك"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة ماليزيا؟", a: ["كوالالمبور"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع مدينة ماتشو بيتشو؟", a: ["بيرو"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم المضيق الذي يصل البحر الأحمر بخليج عدن؟", a: ["مضيق باب المندب"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم المضيق الذي يفصل أوروبا عن أفريقيا؟", a: ["مضيق جبل طارق"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة يقع نهر الفرات؟", a: ["العراق وسوريا وتركيا", "يمر بتركيا وسوريا والعراق"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع أنغكور وات؟", a: ["كمبوديا"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر صحراء في آسيا؟", a: ["صحراء غوبي", "غوبي"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع أبو سمبل؟", a: ["مصر"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة يقع بركان فيزوف؟", a: ["إيطاليا"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع مدينة برشلونة؟", a: ["إسبانيا"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أطول نهر في أمريكا الشمالية؟", a: ["المسيسيبي", "نهر المسيسيبي"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع مدينة نيروبي؟", a: ["كينيا"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع مدينة بانكوك؟", a: ["تايلاند", "تايلند"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع مدينة مومباي؟", a: ["الهند"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع جزيرة بالي؟", a: ["إندونيسيا"], difficulty: "medium", category: "geography" },
  { q: "ما هو طول نهر النيل؟", a: ["6650 كم", "6695 كم"], difficulty: "hard", category: "geography" },
  { q: "ما هو طول نهر الأمازون؟", a: ["6400 كم", "6992 كم"], difficulty: "hard", category: "geography" },
  { q: "في أي دولة تقع مدينة مدغشقر؟", a: ["مدغشقر دولة مستقلة", "جزيرة دولة"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم الجزيرة التي تسمى أرض النار؟", a: ["تيرا ديل فويغو", "تييرا ديل فويغو"], difficulty: "hard", category: "geography" },
  { q: "في أي دولة تقع شلالات إيغواسو؟", a: ["الأرجنتين والبرازيل"], difficulty: "hard", category: "geography" },
  { q: "ما هو اسم أكبر برج في العالم من حيث الارتفاع؟", a: ["برج خليفة"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة البرتغال؟", a: ["لشبونة"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة هولندا؟", a: ["أمستردام"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة بلجيكا؟", a: ["بروكسل"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة النرويج؟", a: ["أوسلو"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة بولندا؟", a: ["وارسو", "وارسا"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة الفلبين؟", a: ["مانيلا"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة كازاخستان؟", a: ["أستانة", "نور سلطان"], difficulty: "hard", category: "geography" },

  // ════════════════════════════════════════
  //       ⚽ رياضة إضافية (الجزء الثاني)
  // ════════════════════════════════════════
  { q: "ما هو اسم أشهر سباق خيول في العالم؟", a: ["كنتاكي ديربي", "داربي"], difficulty: "medium", category: "sports" },
  { q: "كم عدد اللاعبين في فريق البيسبول؟", a: ["9", "تسعة"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم بطولة التنس الفرنسية؟", a: ["رولان غاروس", "Roland Garros"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم بطولة التنس الأسترالية؟", a: ["أوستراليان أوبن", "Australian Open"], difficulty: "medium", category: "sports" },
  { q: "كم مرة فاز فيدرر بويمبلدون؟", a: ["8", "ثماني مرات"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم الرياضة التي ينتقل فيها اللاعبون على متزلجات؟", a: ["التزلج على الجليد", "الهوكي"], difficulty: "medium", category: "sports" },
  { q: "ما هو بطل الملاكمة المعروف بالعظيم؟", a: ["محمد علي كلاي", "محمد علي"], difficulty: "medium", category: "sports" },
  { q: "في أي مدينة سيقام كأس العالم 2026؟", a: ["الولايات المتحدة وكندا والمكسيك", "USA 2026"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم أول منتخب فاز بكأس العالم مرتين متتاليتين؟", a: ["إيطاليا", "ألمانيا"], difficulty: "hard", category: "sports" },
  { q: "ما هو اسم أكبر بطولة للتنس في العالم من حيث الجائزة؟", a: ["أمريكان أوبن", "US Open"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم أكبر بطولة لكرة القدم في آسيا؟", a: ["كأس آسيا", "AFC Asian Cup"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم بطولة أمريكا الجنوبية لكرة القدم؟", a: ["كوبا أمريكا", "Copa America"], difficulty: "medium", category: "sports" },
  { q: "كم مرة فاز المنتخب الأوروغوايي بكأس العالم؟", a: ["مرتان", "2"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم بطولة الدوري الأوروبي للأندية؟", a: ["UEFA Europa League", "الدوري الأوروبي"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم أشهر لاعب سلة في التاريخ؟", a: ["مايكل جوردان", "ليبرون جيمس"], difficulty: "medium", category: "sports" },
  { q: "كم مرة فاز مايكل جوردان بالبطولة؟", a: ["6", "ست مرات"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم فريق مايكل جوردان الأشهر؟", a: ["شيكاغو بولز", "Chicago Bulls"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم الدوري الأمريكي لكرة القدم الأمريكية؟", a: ["NFL"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم أشهر سباق للسيارات في العالم؟", a: ["فورمولا 1", "F1", "موناكو"], difficulty: "medium", category: "sports" },
  { q: "من هو أكثر سائق فوزاً بالفورمولا 1؟", a: ["لويس هاميلتون", "مايكل شوماخر"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم أشهر سباق جري في الأولمبياد؟", a: ["الماراثون", "42.195 كم"], difficulty: "medium", category: "sports" },
  { q: "في أي سنة بدأت بطولة الأولمبياد الحديثة؟", a: ["1896", "أثينا 1896"], difficulty: "medium", category: "sports" },
  { q: "ما هو الرقم القياسي لأوساين بولت في سباق 200 متر؟", a: ["19.19 ثانية", "أوساين بولت"], difficulty: "hard", category: "sports" },
  { q: "من هو أصغر لاعب يسجل في كأس العالم؟", a: ["بيليه", "1958 وكان عمره 17 سنة"], difficulty: "hard", category: "sports" },
  { q: "في أي مدينة يقع ملعب سان سيرو؟", a: ["ميلان", "إيطاليا"], difficulty: "medium", category: "sports" },
  { q: "كم عدد أهداف كريستيانو رونالدو الدولية؟", a: ["أكثر من 120", "130 هدف"], difficulty: "hard", category: "sports" },
  { q: "ما هو اسم أول دولة أفريقية تصل لنصف نهائي كأس العالم؟", a: ["المغرب", "2022"], difficulty: "medium", category: "sports" },
  { q: "كم عدد مرات فوز المنتخب المصري بكأس أمم أفريقيا؟", a: ["7", "سبع مرات"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم الدوري المصري لكرة القدم؟", a: ["الدوري المصري الممتاز", "الدوري المصري"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم أشهر منافسة في كرة القدم الإسبانية؟", a: ["الكلاسيكو", "El Clasico"], difficulty: "medium", category: "sports" },
  { q: "من هو الهداف التاريخي لمانشستر يونايتد؟", a: ["ويان روني", "Rooney"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم اللاعب البرازيلي الأسطوري؟", a: ["بيليه", "Pelé", "رونالديهو"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم بطولة كرة القدم الأفريقية؟", a: ["كأس أمم أفريقيا", "الكان"], difficulty: "medium", category: "sports" },
  { q: "ما هو مقر الفيفا؟", a: ["زيورخ", "سويسرا"], difficulty: "hard", category: "sports" },

  // ════════════════════════════════════════
  //    🌟 معلومات عامة إضافية (الجزء الثاني)
  // ════════════════════════════════════════
  { q: "ما هو اسم أشهر حلوى مصرية؟", a: ["كنافة", "بسبوسة", "أم علي"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أشهر أكلة سعودية؟", a: ["الكبسة", "مندي"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أشهر أكلة لبنانية؟", a: ["الكبة", "تبولة", "حمص"], difficulty: "medium", category: "general" },
  { q: "كم عدد سكان مصر تقريباً؟", a: ["105 مليون", "أكثر من 100 مليون"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أكبر مدينة في مصر بعد القاهرة؟", a: ["الإسكندرية"], difficulty: "medium", category: "general" },
  { q: "من هو أشهر ممثل مصري في التاريخ؟", a: ["عمر الشريف", "يحيى شاهين"], difficulty: "medium", category: "general" },
  { q: "من هو أشهر مطرب مصري في التاريخ؟", a: ["عبد الحليم حافظ", "أم كلثوم"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أشهر كاتب مصري في القرن العشرين؟", a: ["نجيب محفوظ"], difficulty: "medium", category: "general" },
  { q: "في أي سنة حصل نجيب محفوظ على نوبل؟", a: ["1988", "١٩٨٨"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أهم أجزاء ثلاثية نجيب محفوظ؟", a: ["بين القصرين", "قصر الشوق", "السكرية"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أشهر شاعر عربي في القرن العشرين؟", a: ["محمود درويش", "نزار قباني"], difficulty: "medium", category: "general" },
  { q: "في أي دولة وُلد محمود درويش؟", a: ["فلسطين"], difficulty: "medium", category: "general" },
  { q: "من أخرج فيلم الرسالة؟", a: ["مصطفى العقاد"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أكبر مهرجان سينمائي في العالم؟", a: ["كان", "مهرجان كان"], difficulty: "medium", category: "general" },
  { q: "ما هي أعلى جائزة في مهرجان كان؟", a: ["السعفة الذهبية", "Palme d'Or"], difficulty: "medium", category: "general" },
  { q: "في أي مدينة يُقام حفل الأوسكار؟", a: ["لوس أنجلوس", "هوليوود"], difficulty: "medium", category: "general" },
  { q: "كم عدد نجوم العلم الأمريكي؟", a: ["50", "خمسون نجمة"], difficulty: "medium", category: "general" },
  { q: "ما هو الحيوان الذي يُرمز به لأمريكا؟", a: ["النسر الأصلع", "النسر"], difficulty: "medium", category: "general" },
  { q: "ما هو الحيوان الذي يُرمز به لأستراليا؟", a: ["الكنغر", "الأوبوسوم"], difficulty: "medium", category: "general" },
  { q: "ما هو الحيوان الذي يُرمز به للصين؟", a: ["الباندا", "التنين"], difficulty: "medium", category: "general" },
  { q: "ما هو الحيوان الذي يُرمز به لروسيا؟", a: ["الدب"], difficulty: "medium", category: "general" },
  { q: "ما هي الدولة التي عَلَمُها مثلث؟", a: ["نيبال"], difficulty: "hard", category: "general" },
  { q: "ما هو العلم الوحيد في العالم بشكل غير مستطيل؟", a: ["علم نيبال"], difficulty: "hard", category: "general" },
  { q: "ما هو اسم أغلى لوحة فنية في العالم؟", a: ["سالفاتور موندي", "Salvator Mundi"], difficulty: "hard", category: "general" },
  { q: "من رسم لوحة سالفاتور موندي؟", a: ["ليوناردو دافينشي"], difficulty: "hard", category: "general" },
  { q: "ما هو اسم أكثر فيلم إيراداً في التاريخ؟", a: ["أفاتار", "Avatar"], difficulty: "medium", category: "general" },
  { q: "من أخرج فيلم أفاتار؟", a: ["جيمس كاميرون", "Cameron"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أشهر سلسلة كتب للأطفال؟", a: ["هاري بوتر"], difficulty: "medium", category: "general" },
  { q: "من كتبت هاري بوتر؟", a: ["ج.ك. رولينج", "J.K. Rowling"], difficulty: "medium", category: "general" },
  { q: "كم عدد أجزاء هاري بوتر؟", a: ["7", "سبعة"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أشهر سلسلة خيال علمي في التاريخ؟", a: ["حرب النجوم", "Star Wars"], difficulty: "medium", category: "general" },
  { q: "من أخرج حرب النجوم؟", a: ["جورج لوكاس", "Lucas"], difficulty: "medium", category: "general" },
  { q: "من يؤدي دور الرجل الحديد؟", a: ["روبرت داوني جونيور", "Robert Downey Jr."], difficulty: "medium", category: "general" },
  { q: "ما هو اسم شركة مارفيل الأم؟", a: ["ديزني", "Disney"], difficulty: "medium", category: "general" },
  { q: "من هو مؤسس شركة ديزني؟", a: ["والت ديزني", "Walt Disney"], difficulty: "medium", category: "general" },
  { q: "من يُلقب بملك البوب؟", a: ["مايكل جاكسون"], difficulty: "medium", category: "general" },
  { q: "من يُلقب بملك الروك أند رول؟", a: ["إيلفيس بريسلي", "Elvis"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أشهر فرقة موسيقية في التاريخ؟", a: ["البيتلز", "The Beatles"], difficulty: "medium", category: "general" },
  { q: "من أي مدينة جاءت فرقة البيتلز؟", a: ["ليفربول"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أشهر موسيقار في التاريخ؟", a: ["بيتهوفن", "موزارت", "باخ"], difficulty: "medium", category: "general" },
  { q: "في أي عام وُلد موزارت؟", a: ["1756", "١٧٥٦"], difficulty: "hard", category: "general" },
  { q: "كم كان عمر موزارت حين توفي؟", a: ["35 سنة"], difficulty: "hard", category: "general" },
  { q: "من هو الفنان العربي المعروف بموزارت الشرق؟", a: ["محمد عبد الوهاب"], difficulty: "medium", category: "general" },
  { q: "من هو الفنانة المعروفة بكوكب الشرق؟", a: ["أم كلثوم"], difficulty: "medium", category: "general" },
  { q: "في أي عام توفيت أم كلثوم؟", a: ["1975", "١٩٧٥"], difficulty: "hard", category: "general" },
  { q: "ما هو الاسم الحقيقي لفيروز؟", a: ["نهاد حداد", "Nouhad Haddad"], difficulty: "hard", category: "general" },
  { q: "من هو أشهر مطرب مصري معاصر؟", a: ["عمرو دياب", "محمد منير"], difficulty: "medium", category: "general" },

  // ════════════════════════════════════════
  //       ☪️ دين إضافي (الجزء الثاني)
  // ════════════════════════════════════════
  { q: "ما هو اسم أول آية نزلت من القرآن الكريم؟", a: ["اقرأ", "اقرأ باسم ربك الذي خلق"], difficulty: "medium", category: "religion" },
  { q: "في أي غار نزل أول وحي على النبي؟", a: ["غار حراء"], difficulty: "medium", category: "religion" },
  { q: "كم عدد زوجات النبي؟", a: ["11", "إحدى عشرة"], difficulty: "hard", category: "religion" },
  { q: "ما هو اسم أحب زوجات النبي إليه؟", a: ["السيدة عائشة", "عائشة"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم بنات النبي الأشهر؟", a: ["فاطمة الزهراء", "السيدة فاطمة"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم سبطا النبي؟", a: ["الحسن والحسين"], difficulty: "medium", category: "religion" },
  { q: "في أي مدينة وُلد النبي محمد؟", a: ["مكة المكرمة", "مكة"], difficulty: "medium", category: "religion" },
  { q: "في أي مدينة توفي النبي محمد؟", a: ["المدينة المنورة"], difficulty: "medium", category: "religion" },
  { q: "في أي شهر نزل أول وحي على النبي؟", a: ["رمضان", "شهر رمضان"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم النبي الذي يُذكر أكثر من غيره في القرآن؟", a: ["موسى عليه السلام", "سيدنا موسى"], difficulty: "hard", category: "religion" },
  { q: "ما هو اسم النبي الذي تحدث مع الله مباشرة؟", a: ["موسى عليه السلام", "كليم الله"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم النبي الذي أُلقي في البحر وابتلعه الحوت؟", a: ["يونس عليه السلام", "سيدنا يونس"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم النبي الذي بنى السفينة؟", a: ["نوح عليه السلام", "سيدنا نوح"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم النبي الذي أُلقي في النار ولم يحترق؟", a: ["إبراهيم عليه السلام", "سيدنا إبراهيم"], difficulty: "medium", category: "religion" },
  { q: "ما هي السورة التي تحكي قصة يوسف؟", a: ["سورة يوسف"], difficulty: "medium", category: "religion" },
  { q: "ما هو عدد آيات سورة البقرة؟", a: ["286", "مئتان وستة وثمانون"], difficulty: "hard", category: "religion" },
  { q: "ما هي أعظم آية في القرآن؟", a: ["آية الكرسي", "آية الكرسي من سورة البقرة"], difficulty: "medium", category: "religion" },
  { q: "في أي سورة توجد آية الكرسي؟", a: ["سورة البقرة", "البقرة 255"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم آخر سورة نزلت من القرآن؟", a: ["النصر", "سورة النصر"], difficulty: "medium", category: "religion" },
  { q: "ما هي السورة التي تُسمى قلب القرآن؟", a: ["يس", "سورة يس"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم الليلة المقدسة في رمضان؟", a: ["ليلة القدر"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم الفريضة الخامسة من فرائض الإسلام؟", a: ["الحج"], difficulty: "medium", category: "religion" },
  { q: "في أي شهر يكون الحج؟", a: ["ذو الحجة", "شهر ذي الحجة"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم أهم ركن في الحج؟", a: ["الوقوف بعرفة", "عرفة"], difficulty: "medium", category: "religion" },
  { q: "كم عدد أيام شهر رمضان في السنة الهجرية العادية؟", a: ["29 أو 30 يوماً"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم الكتاب الذي أُنزل على موسى؟", a: ["التوراة"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم الكتاب الذي أُنزل على عيسى؟", a: ["الإنجيل"], difficulty: "medium", category: "religion" },
  { q: "كم عدد أركان الإيمان؟", a: ["6", "ستة"], difficulty: "medium", category: "religion" },
  { q: "كم عدد الأنبياء أولو العزم؟", a: ["5", "خمسة"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم النبي الذي ابتلي بالمرض الشديد وصبر؟", a: ["أيوب عليه السلام", "سيدنا أيوب"], difficulty: "medium", category: "religion" },
  { q: "كم عدد أجنحة جبريل عليه السلام؟", a: ["600", "ستمائة"], difficulty: "hard", category: "religion" },
  { q: "ما هو اسم أكبر مسجد في العالم؟", a: ["المسجد الحرام", "مسجد مكة المكرمة"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم السورة التي لا تبدأ بالبسملة؟", a: ["التوبة", "سورة التوبة"], difficulty: "medium", category: "religion" },
  { q: "ما هو اسم الصحابي الأول الذي آمن بالإسلام من الرجال؟", a: ["أبو بكر الصديق", "علي بن أبي طالب"], difficulty: "hard", category: "religion" },
  { q: "ما هو اسم أول امرأة آمنت بالإسلام؟", a: ["السيدة خديجة", "أم المؤمنين خديجة"], difficulty: "medium", category: "religion" },

  // ════════════════════════════════════════
  //    💻 برمجة وتكنولوجيا إضافية (الجزء الثاني)
  // ════════════════════════════════════════
  { q: "ما هو اسم نموذج الذكاء الاصطناعي من جوجل؟", a: ["Gemini", "Bard", "PaLM"], difficulty: "medium", category: "programming" },
  { q: "ما هي اللغة المستخدمة لتطوير تطبيقات iOS؟", a: ["Swift", "Objective-C"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى IDE؟", a: ["بيئة تطوير متكاملة", "Integrated Development Environment"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أشهر نظام تحكم في الإصدارات؟", a: ["Git"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أشهر موقع لاستضافة كود برمجي؟", a: ["GitHub", "جيت هب"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى OOP؟", a: ["البرمجة كائنية التوجه", "Object-Oriented Programming"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أشهر إطار عمل لجافاسكريبت؟", a: ["React", "Angular", "Vue"], difficulty: "medium", category: "programming" },
  { q: "من طور إطار عمل React؟", a: ["فيسبوك", "Meta"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى JSON؟", a: ["تدوين كائن جافاسكريبت", "JavaScript Object Notation"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أشهر قاعدة بيانات علائقية؟", a: ["MySQL", "PostgreSQL"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى CI/CD؟", a: ["التكامل المستمر والنشر المستمر", "Continuous Integration/Continuous Deployment"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أشهر خدمة سحابية؟", a: ["AWS", "أمازون ويب سيرفيسز"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى REST API؟", a: ["واجهة برمجة نقل الحالة التمثيلية", "Representational State Transfer"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أشهر إطار عمل لبايثون؟", a: ["Django", "Flask"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى SDK؟", a: ["مجموعة أدوات تطوير البرمجيات", "Software Development Kit"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى AR؟", a: ["الواقع المعزز", "Augmented Reality"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى VR؟", a: ["الواقع الافتراضي", "Virtual Reality"], difficulty: "medium", category: "programming" },
  { q: "من أنشأ البيتكوين؟", a: ["ساتوشي ناكاموتو", "مجهول"], difficulty: "medium", category: "programming" },
  { q: "في أي سنة أُطلق البيتكوين؟", a: ["2009", "٢٠٠٩"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى NFT؟", a: ["رمز غير قابل للاستبدال", "Non-Fungible Token"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أشهر محرك ألعاب في العالم؟", a: ["Unreal Engine", "Unity"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى GPU؟", a: ["وحدة معالجة الرسومات", "Graphics Processing Unit"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى BIOS؟", a: ["نظام الإدخال والإخراج الأساسي", "Basic Input Output System"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى DDoS؟", a: ["هجوم رفض الخدمة الموزع", "Distributed Denial of Service"], difficulty: "medium", category: "programming" },
  { q: "من طور Photoshop؟", a: ["أدوبي", "Adobe"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أشهر نظام تشغيل مفتوح المصدر؟", a: ["Linux", "لينوكس"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أول نظام تشغيل لمايكروسوفت؟", a: ["MS-DOS"], difficulty: "medium", category: "programming" },
  { q: "في أي عام أُطلق Windows الأول؟", a: ["1985", "١٩٨٥"], difficulty: "hard", category: "programming" },
  { q: "ما هو اسم الشركة التي طورت TypeScript؟", a: ["مايكروسوفت", "Microsoft"], difficulty: "medium", category: "programming" },
  { q: "ما هو أكثر موقع زيارةً في العالم؟", a: ["جوجل", "Google"], difficulty: "medium", category: "programming" },
  { q: "في أي سنة أُطلق تويتر؟", a: ["2006", "٢٠٠٦"], difficulty: "medium", category: "programming" },
  { q: "في أي سنة أُطلق إنستغرام؟", a: ["2010", "٢٠١٠"], difficulty: "medium", category: "programming" },
  { q: "في أي سنة أُطلق تيك توك؟", a: ["2016", "٢٠١٦"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم الشركة التي طورت تيك توك؟", a: ["ByteDance", "بايت دانس"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أشهر يوتيوبر في العالم؟", a: ["PewDiePie", "MrBeast"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم نظام الذكاء الاصطناعي من OpenAI؟", a: ["ChatGPT", "GPT"], difficulty: "medium", category: "programming" },
  { q: "من مؤسس جوجل؟", a: ["لاري بيج وسيرجي برين", "بيج وبرين"], difficulty: "medium", category: "programming" },
  { q: "من مؤسس يوتيوب؟", a: ["تشاد هيرلي وستيف تشين", "جاويد كريم"], difficulty: "hard", category: "programming" },
  { q: "من مؤسس إنستغرام؟", a: ["كيفن سيستروم ومايك كريغر", "سيستروم"], difficulty: "hard", category: "programming" },
  { q: "ما هو أول برنامج لمشاركة الفيديو على الإنترنت؟", a: ["يوتيوب", "YouTube"], difficulty: "medium", category: "programming" },

  // ════════════════════════════════════════
  //       🧠 ذكاء وألغاز إضافية
  // ════════════════════════════════════════
  { q: "ما هو الشيء الذي لو أعطيته لشخص آخر لا تزال تحتفظ به؟", a: ["المعرفة", "العلم"], difficulty: "medium", category: "general" },
  { q: "ما هو الشيء الذي يحترق بلا نار ويبكي بلا عيون؟", a: ["الشمعة"], difficulty: "medium", category: "general" },
  { q: "ما هو الشيء الذي يمشي على أربع في الصباح وعلى اثنين في الظهر وعلى ثلاث في المساء؟", a: ["الإنسان"], difficulty: "medium", category: "general" },
  { q: "كم يساوي 0 × 1000000؟", a: ["صفر", "0"], difficulty: "medium", category: "general" },
  { q: "ما هو حاصل 1000 + 40 + 1000 + 30 + 1000 + 20 + 1000 + 10؟", a: ["4100", "أربعة آلاف ومائة"], difficulty: "hard", category: "general" },
  { q: "ما هو الشيء الذي يملك مفتاحاً بلا أبواب؟", a: ["البيانو", "آلة موسيقية"], difficulty: "medium", category: "general" },
  { q: "إذا كان عمرك 10 سنوات وأخوك أكبر منك بسنتين فكم يبلغ عمره حين يكون عمرك 30؟", a: ["32", "اثنان وثلاثون"], difficulty: "medium", category: "general" },
  { q: "كم يساوي ربع ربع النصف؟", a: ["ثمن", "1/8"], difficulty: "hard", category: "general" },
  { q: "ما هو اسم المثلث الذي أضلاعه الثلاثة متساوية؟", a: ["متساوي الأضلاع"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم المثلث الذي ضلعان منه متساويان فقط؟", a: ["متساوي الساقين"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم المضلع ذو الخمسة أضلاع؟", a: ["الخماسي", "المخمس", "البنتاغون"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم المضلع ذو الستة أضلاع؟", a: ["السداسي", "المسدس", "هكساغون"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم المضلع ذو الثمانية أضلاع؟", a: ["الثماني", "المثمن", "أوكتاغون"], difficulty: "medium", category: "general" },
  { q: "ما هو أكبر رقم أولي تحت 100؟", a: ["97"], difficulty: "hard", category: "general" },
  { q: "هل الرقم 1 عدد أولي؟", a: ["لا", "ليس عدداً أولياً"], difficulty: "medium", category: "general" },
  { q: "ما هو أصغر عدد أولي؟", a: ["2", "اثنان"], difficulty: "medium", category: "general" },
  { q: "ما هو مجموع زوايا المخمس؟", a: ["540 درجة", "خمسمائة وأربعون"], difficulty: "hard", category: "general" },
  { q: "ما هو مجموع زوايا المسدس؟", a: ["720 درجة", "سبعمائة وعشرون"], difficulty: "hard", category: "general" },
  { q: "ما هو مجموع أعداد 1 إلى 10؟", a: ["55", "خمسة وخمسون"], difficulty: "medium", category: "general" },
  { q: "ما هو مجموع أعداد 1 إلى 50؟", a: ["1275", "ألف ومئتان وخمسة وسبعون"], difficulty: "hard", category: "general" },

  // ════════════════════════════════════════
  //        🔬 علوم إضافية (الجزء الثاني)
  // ════════════════════════════════════════
  { q: "ما هو اسم أكبر قمر لكوكب زحل؟", a: ["تيتان", "Titan"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم أكبر قمر لكوكب المشتري؟", a: ["جانيميد", "Ganymede"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم المعادلة الأشهر في الفيزياء؟", a: ["E=mc²", "e يساوي m ضرب c تربيع"], difficulty: "medium", category: "science" },
  { q: "من طور نظرية النسبية؟", a: ["ألبرت آينشتاين", "أينشتاين"], difficulty: "medium", category: "science" },
  { q: "في أي عام ولد آينشتاين؟", a: ["1879", "١٨٧٩"], difficulty: "medium", category: "science" },
  { q: "ما هي وحدة قياس القوة؟", a: ["نيوتن", "N"], difficulty: "medium", category: "science" },
  { q: "ما هي وحدة قياس الطاقة؟", a: ["جول", "J"], difficulty: "medium", category: "science" },
  { q: "ما هي وحدة قياس الضغط؟", a: ["باسكال", "Pa"], difficulty: "medium", category: "science" },
  { q: "ما هي وحدة قياس التيار الكهربائي؟", a: ["أمبير", "A"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم أكثر عنصر وفرة في الكون؟", a: ["الهيدروجين"], difficulty: "medium", category: "science" },
  { q: "كم تبلغ نسبة الأكسجين في الغلاف الجوي؟", a: ["21%", "واحد وعشرون بالمئة"], difficulty: "medium", category: "science" },
  { q: "كم تبلغ نسبة النيتروجين في الغلاف الجوي؟", a: ["78%", "ثمانية وسبعون بالمئة"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم المعجِّل الجسيمي الأكبر في العالم؟", a: ["LHC", "المصادم الكبير للهادرونات"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم جسيم الله؟", a: ["بوزون هيغز", "Higgs boson"], difficulty: "hard", category: "science" },
  { q: "في أي سنة اكتُشف بوزون هيغز؟", a: ["2012", "٢٠١٢"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم أكبر تلسكوب فضائي؟", a: ["تلسكوب جيمس ويب", "James Webb"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم أبعد مركبة من الأرض؟", a: ["فوياجر 1", "Voyager 1"], difficulty: "hard", category: "science" },
  { q: "كم عدد أقمار المريخ؟", a: ["2", "اثنان"], difficulty: "medium", category: "science" },
  { q: "ما هي أسماء قمري المريخ؟", a: ["فوبوس وديموس", "Phobos and Deimos"], difficulty: "hard", category: "science" },
  { q: "ما هي درجة الحرارة على سطح الزهرة؟", a: ["462 درجة مئوية", "465 درجة"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم جزء الذرة الموجب الشحنة؟", a: ["البروتون"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم جزء الذرة السالب الشحنة؟", a: ["الإلكترون"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم جزء الذرة المتعادل الشحنة؟", a: ["النيوترون"], difficulty: "medium", category: "science" },
  { q: "ما هو الوقود الأساسي للشمس؟", a: ["الهيدروجين", "تفاعل اندماج نووي"], difficulty: "medium", category: "science" },
  { q: "ما هي وحدة قياس الصوت؟", a: ["ديسيبل", "dB"], difficulty: "medium", category: "science" },
  { q: "ما هو الفيتامين الذي يُقوي الأسنان والعظام؟", a: ["فيتامين D وكالسيوم", "فيتامين د"], difficulty: "medium", category: "science" },
  { q: "ما هو الفيتامين الذي يُحسّن الرؤية؟", a: ["فيتامين A", "فيتامين أ"], difficulty: "medium", category: "science" },
  { q: "ما هو الغذاء الأغنى بالكالسيوم؟", a: ["الحليب", "الجبن"], difficulty: "medium", category: "science" },
  { q: "كم لتراً من الماء يحتاج الإنسان يومياً؟", a: ["2 لتر", "ليترين"], difficulty: "medium", category: "science" },
  { q: "ما هو الطعام الذي لا يفسد أبداً؟", a: ["العسل"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم الهرمون المسؤول عن النوم؟", a: ["الميلاتونين"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم الهرمون الذي يُنتج أثناء التمرين؟", a: ["الإندورفين", "الأدرينالين"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم المرض الناتج عن نقص فيتامين D؟", a: ["الكساح", "هشاشة العظام"], difficulty: "medium", category: "science" },
  { q: "من اخترع اللقاح؟", a: ["إدوارد جنر", "Jenner"], difficulty: "medium", category: "science" },
  { q: "من هو أبو علم الوراثة؟", a: ["غريغور مندل", "مندل"], difficulty: "medium", category: "science" },
  { q: "من اكتشف الخلية؟", a: ["روبرت هوك", "Hooke"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم أكبر حيوان على اليابسة؟", a: ["الفيل الأفريقي", "الفيل"], difficulty: "medium", category: "science" },
  { q: "ما هي أسرع حيوان بري في العالم؟", a: ["الفهد"], difficulty: "medium", category: "science" },
  { q: "ما هي سرعة الفهد القصوى؟", a: ["120 كم/ساعة", "110 كم/ساعة"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم أكبر حيوان في المحيط؟", a: ["الحوت الأزرق"], difficulty: "medium", category: "science" },
  { q: "ما هو وزن الحوت الأزرق؟", a: ["150 طن", "حوالي 150-200 طن"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم أكبر سمكة في العالم؟", a: ["القرش الحوتي"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم أكبر ثعبان في العالم؟", a: ["الأناكوندا", "الثعبان الشبكي"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم أكبر طائر في العالم؟", a: ["النعامة"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم أصغر طائر في العالم؟", a: ["طائر الطنان", "الطنان العسلي"], difficulty: "medium", category: "science" },
  { q: "في أي قارة يعيش البطريق؟", a: ["القطب الجنوبي", "أنتاركتيكا"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم الظاهرة التي تسبب قوس قزح؟", a: ["انكسار الضوء في قطرات المطر", "تشتت الضوء"], difficulty: "medium", category: "science" },
  { q: "ما هو ترتيب ألوان قوس قزح؟", a: ["أحمر برتقالي أصفر أخضر أزرق نيلي بنفسجي", "ROYGBIV"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم نظرية نشأة الكون؟", a: ["الانفجار الكبير", "Big Bang"], difficulty: "medium", category: "science" },
  { q: "كم يبلغ قطر الأرض؟", a: ["12742 كم", "12000 كم تقريباً"], difficulty: "hard", category: "science" },
  { q: "كم يبلغ محيط الأرض تقريباً؟", a: ["40000 كم", "40075 كم"], difficulty: "medium", category: "science" },
  { q: "ما هو الكوكب الذي يدور عكس اتجاه عقارب الساعة؟", a: ["الزهرة", "Venus"], difficulty: "hard", category: "science" },
  { q: "كم عدد الكواكب التي تملك حلقات؟", a: ["4", "أربعة كواكب"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم الجهاز الذي يحول الطاقة الميكانيكية إلى كهربائية؟", a: ["المولد الكهربائي", "الداينمو"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم الجهاز الذي يحول الطاقة الكهربائية إلى ميكانيكية؟", a: ["المحرك الكهربائي"], difficulty: "medium", category: "science" },
  { q: "ما هو الغاز المسؤول عن الاحتباس الحراري الأساسي؟", a: ["ثاني أكسيد الكربون", "CO2"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم العلم الذي يدرس الأجرام السماوية؟", a: ["علم الفلك", "الفلك"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم الجهاز الذي يُستخدم لرؤية النجوم؟", a: ["التلسكوب", "المقراب"], difficulty: "medium", category: "science" },
  { q: "ما هو الرمز الكيميائي للبلاتين؟", a: ["Pt"], difficulty: "hard", category: "science" },
  { q: "ما هو الرمز الكيميائي للكروم؟", a: ["Cr"], difficulty: "hard", category: "science" },
  { q: "ما هو الرمز الكيميائي للمنغنيز؟", a: ["Mn"], difficulty: "hard", category: "science" },
  { q: "ما هو الرمز الكيميائي للفلور؟", a: ["F"], difficulty: "medium", category: "science" },
  { q: "ما هو الرمز الكيميائي للبروم؟", a: ["Br"], difficulty: "hard", category: "science" },
  { q: "ما هو الرمز الكيميائي للكوبالت؟", a: ["Co"], difficulty: "hard", category: "science" },
  { q: "ما هي أسرع حشرة في العالم؟", a: ["الصرصور", "الحشرة العدائة"], difficulty: "hard", category: "science" },
  { q: "ما هو الحيوان الذي يستطيع أن ينام وهو واقف؟", a: ["الحصان", "الزرافة"], difficulty: "medium", category: "science" },
  { q: "ما هو الحيوان الذي لديه أكبر ضغط دم؟", a: ["الزرافة"], difficulty: "hard", category: "science" },
  { q: "ما هو الحيوان الذي لديه أطول لسان؟", a: ["الزرافة", "النملآكل"], difficulty: "medium", category: "science" },
  { q: "ما هو الحيوان الذي يعيش أطول في العالم؟", a: ["السلحفاة", "القرش الغرينلاندي"], difficulty: "hard", category: "science" },

  // ════════════════════════════════════════
  //        🌍 عواصم وجغرافيا (الجزء الثالث)
  // ════════════════════════════════════════
  { q: "ما هي عاصمة إندونيسيا الجديدة؟", a: ["نوسانتارا"], difficulty: "hard", category: "geography" },
  { q: "ما هي عاصمة ميانمار؟", a: ["نايبيداو", "نايبيدو"], difficulty: "hard", category: "geography" },
  { q: "ما هي عاصمة لاوس؟", a: ["فيينتيان"], difficulty: "hard", category: "geography" },
  { q: "ما هي أكبر مدينة في فيتنام؟", a: ["مدينة هو تشي منه", "سايغون"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة سريلانكا؟", a: ["كولومبو", "سريجاياواردينابورا"], difficulty: "medium", category: "geography" },
  { q: "ما هي أكبر جزيرة في إندونيسيا؟", a: ["سومطرة", "بورنيو"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر جزيرة في اليابان؟", a: ["هونشو"], difficulty: "hard", category: "geography" },
  { q: "ما هي عاصمة موزمبيق؟", a: ["مابوتو"], difficulty: "medium", category: "geography" },
  { q: "ما هي عاصمة تنزانيا؟", a: ["دودوما", "دار السلام"], difficulty: "medium", category: "geography" },
  { q: "ما هي الدولة الأولى في إنتاج الموز؟", a: ["الهند", "الإكوادور"], difficulty: "hard", category: "geography" },
  { q: "في أي دولة توجد جزيرة بالي؟", a: ["إندونيسيا"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع شلالات نياغارا؟", a: ["الولايات المتحدة وكندا", "بين كندا والولايات المتحدة"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم المحيط الذي يقع جنوب الأرجنتين؟", a: ["المحيط الجنوبي", "القطب الجنوبي"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر صحراء رملية في العالم؟", a: ["الربع الخالي", "صحراء الربع الخالي"], difficulty: "hard", category: "geography" },
  { q: "ما هو اسم البحيرة بين إسرائيل والأردن؟", a: ["البحر الميت"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع جزر بهاماز؟", a: ["باهاماس", "البهاماز"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم المضيق الذي يربط البحر الأسود بالبحر الأبيض المتوسط؟", a: ["مضيق البوسفور والدردنيل", "البوسفور"], difficulty: "hard", category: "geography" },
  { q: "ما هو اسم أكبر خليج في العالم؟", a: ["خليج البنغال"], difficulty: "hard", category: "geography" },
  { q: "ما هي الدولة الأولى في إنتاج البطاطس؟", a: ["الصين", "روسيا"], difficulty: "hard", category: "geography" },
  { q: "في أي دولة تقع مدينة بوخارا؟", a: ["أوزبكستان"], difficulty: "hard", category: "geography" },
  { q: "في أي دولة تقع مدينة كييف؟", a: ["أوكرانيا", "Ukraine"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع مدينة مارسيليا؟", a: ["فرنسا"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع مدينة دكار؟", a: ["السنغال"], difficulty: "medium", category: "geography" },
  { q: "ما هو الجبل الأعلى في أوروبا؟", a: ["جبل إلبروس", "Mont Blanc"], difficulty: "hard", category: "geography" },
  { q: "ما هو اسم الدولة التي تسمى أرض الألف بحيرة؟", a: ["فنلندا"], difficulty: "hard", category: "geography" },
  { q: "ما هو اسم الدولة التي تسمى أرض التنين؟", a: ["الصين", "بوتان"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم الدولة التي تسمى أرض الكنغر؟", a: ["أستراليا"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم الدولة التي تسمى بلد الأنوار؟", a: ["فرنسا", "باريس"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم الدولة التي تسمى بلد الساموراي؟", a: ["اليابان"], difficulty: "medium", category: "geography" },
  { q: "ما هي أكبر مدينة في العالم من حيث السكان؟", a: ["طوكيو", "توكيو"], difficulty: "medium", category: "geography" },
  { q: "ما هي أكبر مدينة في أفريقيا؟", a: ["لاغوس", "القاهرة"], difficulty: "medium", category: "geography" },
  { q: "أين يقع برج إيفل؟", a: ["باريس", "فرنسا"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة يقع متحف اللوفر؟", a: ["فرنسا", "باريس"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة يقع متحف الأرميتاج؟", a: ["روسيا", "سانت بطرسبرغ"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع أشهر شلالات العالم فيكتوريا؟", a: ["زامبيا وزيمبابوي"], difficulty: "hard", category: "geography" },
  { q: "ما هو اسم أكبر بحيرة في أمريكا الشمالية؟", a: ["بحيرة سوبيريور", "Lake Superior"], difficulty: "hard", category: "geography" },
  { q: "في أي دولة تقع أكبر صحراء في أمريكا؟", a: ["الولايات المتحدة", "موهاف"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أعلى شلال في العالم؟", a: ["شلالات أنجل", "Angel Falls"], difficulty: "hard", category: "geography" },
  { q: "في أي دولة يقع شلال أنجل؟", a: ["فنزويلا"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر بركان في العالم من حيث الحجم؟", a: ["موناكيا", "ماونا لوا"], difficulty: "hard", category: "geography" },
  { q: "في أي دولة يوجد بركان فوجي؟", a: ["اليابان"], difficulty: "medium", category: "geography" },

  // ════════════════════════════════════════
  //        🏛️ ثقافة وفنون إضافية
  // ════════════════════════════════════════
  { q: "من رسم لوحة العشاء الأخير الشهيرة؟", a: ["ليوناردو دافينشي"], difficulty: "medium", category: "general" },
  { q: "من رسم سقف كنيسة سيستين؟", a: ["ميكيلانجيلو", "Michelangelo"], difficulty: "medium", category: "general" },
  { q: "في أي مدينة توجد منحوتة داود لميكيلانجيلو؟", a: ["فلورنسا"], difficulty: "hard", category: "general" },
  { q: "ما هو اسم أشهر متحف في أمريكا؟", a: ["متحف المتروبوليتان", "Smithsonian"], difficulty: "medium", category: "general" },
  { q: "في أي مدينة يوجد المتحف البريطاني؟", a: ["لندن"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أشهر ملحمة شعرية يونانية؟", a: ["الإلياذة", "إلياذة هوميروس"], difficulty: "medium", category: "general" },
  { q: "من هو بطل الإلياذة؟", a: ["أخيل", "آكيليس"], difficulty: "medium", category: "general" },
  { q: "من هو بطل الأوديسة؟", a: ["أوديسيوس", "يوليسيس"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أشهر فيلسوف ألماني؟", a: ["كانط", "هيغل", "نيتشه"], difficulty: "medium", category: "general" },
  { q: "ما هي مقولة ديكارت الشهيرة؟", a: ["أنا أفكر إذن أنا موجود", "Cogito ergo sum"], difficulty: "medium", category: "general" },
  { q: "من ألّف كتاب الأمير؟", a: ["ميكيافيللي", "نيكولو ميكيافيللي"], difficulty: "medium", category: "general" },
  { q: "من ألّف كتاب ثروة الأمم؟", a: ["آدم سميث", "Adam Smith"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم مؤسس الاشتراكية العلمية؟", a: ["كارل ماركس", "Marx"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم كتاب ماركس الأشهر؟", a: ["رأس المال", "البيان الشيوعي"], difficulty: "medium", category: "general" },
  { q: "من هو مؤسس علم الاجتماع من العرب؟", a: ["ابن خلدون"], difficulty: "medium", category: "history" },
  { q: "في أي دولة وُلد ابن خلدون؟", a: ["تونس"], difficulty: "hard", category: "history" },
  { q: "من هو مؤسس علم الجبر؟", a: ["الخوارزمي", "محمد بن موسى الخوارزمي"], difficulty: "medium", category: "history" },
  { q: "ما هو لقب ابن سينا في الغرب؟", a: ["أفيسينا", "Avicenna"], difficulty: "hard", category: "history" },
  { q: "ما هو لقب ابن رشد في الغرب؟", a: ["أفيرويس", "Averroes"], difficulty: "hard", category: "history" },
  { q: "من هو عالم الضوء العربي الأشهر؟", a: ["ابن الهيثم", "الحسن بن الهيثم"], difficulty: "medium", category: "history" },
  { q: "من هو الجغرافي العربي الذي رسم أول خريطة دقيقة للعالم؟", a: ["الإدريسي", "محمد الإدريسي"], difficulty: "hard", category: "history" },
  { q: "ما هو اسم أول جامعة في التاريخ الإسلامي؟", a: ["جامعة القرويين", "القيروان"], difficulty: "hard", category: "general" },
  { q: "في أي دولة تقع جامعة القرويين؟", a: ["المغرب", "فاس"], difficulty: "medium", category: "general" },
  { q: "ما هو اسم أول صحيفة يومية في العالم العربي؟", a: ["الوقائع المصرية", "الأهرام"], difficulty: "hard", category: "general" },
  { q: "في أي عام أُسست جريدة الأهرام؟", a: ["1875", "١٨٧٥"], difficulty: "hard", category: "general" },

  // ════════════════════════════════════════
  //         📊 معادلات وأرقام إضافية
  // ════════════════════════════════════════
  { q: "ما هو حاصل 13 × 13؟", a: ["169", "مائة وتسعة وستون"], difficulty: "medium", category: "general" },
  { q: "ما هو الجذر التربيعي لـ 169؟", a: ["13", "ثلاثة عشر"], difficulty: "medium", category: "general" },
  { q: "ما هو حاصل 17 × 17؟", a: ["289", "مئتان وتسعة وثمانون"], difficulty: "medium", category: "general" },
  { q: "ما هو حاصل 99 × 99؟", a: ["9801", "تسعة آلاف وثمانمائة وواحد"], difficulty: "hard", category: "general" },
  { q: "كم يساوي 2 أس 8؟", a: ["256", "مئتان وستة وخمسون"], difficulty: "medium", category: "general" },
  { q: "ما هو الجذر التربيعي لـ 1024؟", a: ["32", "اثنان وثلاثون"], difficulty: "hard", category: "general" },
  { q: "ما هو حاصل 25 × 25؟", a: ["625", "ستمائة وخمسة وعشرون"], difficulty: "medium", category: "general" },
  { q: "كم يساوي 4 أس 4؟", a: ["256", "مئتان وستة وخمسون"], difficulty: "medium", category: "general" },
  { q: "ما هو الجذر التربيعي لـ 2025؟", a: ["45", "خمسة وأربعون"], difficulty: "hard", category: "general" },
  { q: "كم يساوي 6 أس 3؟", a: ["216", "مئتان وستة عشر"], difficulty: "medium", category: "general" },
  { q: "ما هو حاصل 8 × 8 × 8؟", a: ["512", "خمسمائة واثنا عشر"], difficulty: "medium", category: "general" },
  { q: "كم يساوي 10 أس 6؟", a: ["1000000", "مليون"], difficulty: "medium", category: "general" },
  { q: "ما هو عدد دقائق اليوم؟", a: ["1440", "ألف وأربعمائة وأربعون"], difficulty: "medium", category: "general" },
  { q: "ما هو حاصل 50 × 50؟", a: ["2500", "ألفان وخمسمائة"], difficulty: "medium", category: "general" },
  { q: "ما هو الجذر التربيعي لـ 2500؟", a: ["50", "خمسون"], difficulty: "medium", category: "general" },

  // ════════════════════════════════════════
  //         🌐 أسئلة الإنترنت الإضافية
  // ════════════════════════════════════════
  { q: "ما هو عدد مستخدمي الإنترنت عالمياً تقريباً؟", a: ["5 مليار", "أكثر من 5 مليار"], difficulty: "medium", category: "programming" },
  { q: "في أي سنة أُطلق الإنترنت للعامة؟", a: ["1991", "١٩٩١"], difficulty: "hard", category: "programming" },
  { q: "ما هو اسم أول موقع إلكتروني في التاريخ؟", a: ["info.cern.ch", "موقع CERN"], difficulty: "hard", category: "programming" },
  { q: "كم ساعة محتوى تُرفع على يوتيوب كل دقيقة؟", a: ["500 ساعة", "أكثر من 400 ساعة"], difficulty: "hard", category: "programming" },
  { q: "في أي سنة أُطلق سناب شات؟", a: ["2011", "٢٠١١"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم مؤسس تويتر؟", a: ["جاك دورسي", "دورسي"], difficulty: "medium", category: "programming" },
  { q: "من هو مؤسس لينكس؟", a: ["لينوس تورفالدز", "تورفالدز"], difficulty: "medium", category: "programming" },
  { q: "من مؤسس Git؟", a: ["لينوس تورفالدز", "Torvalds"], difficulty: "hard", category: "programming" },
  { q: "ما هو معنى Blog؟", a: ["مدونة إلكترونية", "سجل ويب"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى QR Code؟", a: ["رمز الاستجابة السريعة", "Quick Response Code"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى MP3؟", a: ["MPEG Audio Layer 3", "صيغة صوتية رقمية"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى JPEG؟", a: ["Joint Photographic Experts Group", "تنسيق صور"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى PNG؟", a: ["رسومات الشبكة المحمولة", "Portable Network Graphics"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أول روبوت يحصل على الجنسية؟", a: ["صوفيا", "Sophia"], difficulty: "medium", category: "programming" },

  // ════════════════════════════════════════
  //       🌺 أسئلة الحيوانات والطبيعة
  // ════════════════════════════════════════
  { q: "ما هو الحيوان الذي لديه أعلى ضغط دم؟", a: ["الزرافة"], difficulty: "hard", category: "science" },
  { q: "ما هو الحيوان الوحيد الذي لا يستطيع القفز؟", a: ["الفيل"], difficulty: "hard", category: "science" },
  { q: "ما هو الحيوان الذي له أكثر من ثلاثة قلوب؟", a: ["الأخطبوط", "ثلاثة قلوب"], difficulty: "hard", category: "science" },
  { q: "ما هو الحيوان الذي يملك دم أزرق؟", a: ["الأخطبوط", "الإسفنج البحري"], difficulty: "hard", category: "science" },
  { q: "ما هو الحيوان الذي يملك أكبر عيون بالنسبة لحجمه؟", a: ["الحبار العملاق"], difficulty: "hard", category: "science" },
  { q: "ما هو الحيوان الذي يُغرد أجمل أغنية؟", a: ["طائر العندليب", "الحسون"], difficulty: "medium", category: "science" },
  { q: "كم عدد أسنان الفيل؟", a: ["4", "أربعة أسنان ومهمازان"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم مجموعة الأسود؟", a: ["عرين", "القطيع"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم مجموعة الذئاب؟", a: ["قطيع", "مجموعة"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم مجموعة الدلافين؟", a: ["كتيبة", "سرب"], difficulty: "medium", category: "science" },
  { q: "كم سنة تعيش السلحفاة البحرية؟", a: ["أكثر من 100 سنة", "80-150 سنة"], difficulty: "hard", category: "science" },
  { q: "ما هو الحيوان الذي يُعتبر أقرب أقارب الإنسان جينياً؟", a: ["الشمبانزي", "البونوبو"], difficulty: "medium", category: "science" },
  { q: "كم نسبة التشابه الجيني بين الإنسان والشمبانزي؟", a: ["98%", "98.7%"], difficulty: "hard", category: "science" },
  { q: "ما هو أكبر بيضة في العالم؟", a: ["بيضة النعامة"], difficulty: "medium", category: "science" },
  { q: "ما هو أصغر ثدييات في العالم؟", a: ["الخلد الأنف خنزيري", "خلد الخرطوم"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم أطول ثعبان في العالم؟", a: ["الثعبان الشبكي", "Python reticulatus"], difficulty: "hard", category: "science" },
  { q: "ما هو أسرع طائر في الغوص؟", a: ["طير الغاق", "البطريق"], difficulty: "hard", category: "science" },
  { q: "ما هو الحيوان الذي ينام بعين واحدة؟", a: ["الدلفين", "الحوت"], difficulty: "hard", category: "science" },
  { q: "كم مرة يرف الطائر الطنان جناحيه في الثانية؟", a: ["50-80 مرة", "80 مرة"], difficulty: "hard", category: "science" },
  { q: "ما هو أذكى الطيور؟", a: ["الغراب", "الببغاء"], difficulty: "medium", category: "science" },

  // ════════════════════════════════════════
  //           🔥 أسئلة سرعة وذكاء خاصة
  // ════════════════════════════════════════

  { q: "ما هو حاصل ضرب 7 × 8؟", a: ["56", "ستة وخمسون"], difficulty: "medium", category: "general" },
  { q: "ما هو الرقم الأول في متسلسلة فيبوناتشي؟", a: ["0", "1", "صفر أو واحد"], difficulty: "medium", category: "general" },
  { q: "ما هو حاصل 15 × 15؟", a: ["225", "مئتان وخمسة وعشرون"], difficulty: "medium", category: "general" },
  { q: "ما هو الجذر التربيعي لـ 144؟", a: ["12", "اثنا عشر"], difficulty: "medium", category: "general" },
  { q: "ما هو حاصل 100 ÷ 4؟", a: ["25", "خمسة وعشرون"], difficulty: "medium", category: "general" },
  { q: "ما هو الرقم الفردي بين 1 و 10؟", a: ["1, 3, 5, 7, 9", "خمسة أرقام فردية"], difficulty: "medium", category: "general" },
  { q: "ما هو حاصل 12 × 12؟", a: ["144", "مائة وأربعة وأربعون"], difficulty: "medium", category: "general" },
  { q: "ما هو الجذر التربيعي لـ 256؟", a: ["16", "ستة عشر"], difficulty: "medium", category: "general" },
  { q: "ما هو حاصل 25 × 4؟", a: ["100", "مائة"], difficulty: "medium", category: "general" },
  { q: "ما هو مجموع زوايا المثلث؟", a: ["180 درجة", "مئة وثمانون درجة"], difficulty: "medium", category: "general" },
  { q: "ما هو حاصل 9 × 9؟", a: ["81", "واحد وثمانون"], difficulty: "medium", category: "general" },
  { q: "كم يساوي 2 أس 10؟", a: ["1024", "ألف وأربعة وعشرون"], difficulty: "medium", category: "general" },
  { q: "ما هو أكبر رقم من رقمين؟", a: ["99", "تسعة وتسعون"], difficulty: "medium", category: "general" },
  { q: "ما هو حاصل جمع 1 + 2 + 3 + ... + 100؟", a: ["5050", "خمسة آلاف وخمسون"], difficulty: "hard", category: "general" },
  { q: "ما هو الجذر التربيعي لـ 625؟", a: ["25", "خمسة وعشرون"], difficulty: "medium", category: "general" },
  { q: "كم يساوي 5 أس 3؟", a: ["125", "مائة وخمسة وعشرون"], difficulty: "medium", category: "general" },
  { q: "ما هو مجموع زوايا المربع؟", a: ["360 درجة", "ثلاثمائة وستون"], difficulty: "medium", category: "general" },
  { q: "ما هو حاصل 11 × 11؟", a: ["121", "مائة وواحد وعشرون"], difficulty: "medium", category: "general" },
  { q: "كم يساوي 3 أس 4؟", a: ["81", "واحد وثمانون"], difficulty: "medium", category: "general" },
  { q: "ما هو الجذر التربيعي لـ 400؟", a: ["20", "عشرون"], difficulty: "medium", category: "general" },

  // ════════════════════════════════════════
  //         🌍 أسئلة الجغرافيا الإضافية
  // ════════════════════════════════════════

  { q: "ما هي أكبر مدينة في العالم من حيث السكان؟", a: ["طوكيو", "توكيو"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع مدينة دبي؟", a: ["الإمارات العربية المتحدة", "الإمارات"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أعلى مبنى في العالم؟", a: ["برج خليفة", "Burj Khalifa"], difficulty: "medium", category: "geography" },
  { q: "في أي مدينة يقع برج خليفة؟", a: ["دبي"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم الجبل الأعلى في جزيرة العرب؟", a: ["جبل النبي شعيب", "اليمن"], difficulty: "hard", category: "geography" },
  { q: "في أي دولة تقع مدينة كراتشي؟", a: ["باكستان"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر جزيرة في البحر المتوسط؟", a: ["صقلية", "سيسيلي"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع مدينة أديس أبابا؟", a: ["إثيوبيا"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أطول نهر في أمريكا الشمالية؟", a: ["المسيسيبي", "نهر المسيسيبي"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع مدينة لاغوس؟", a: ["نيجيريا"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم الدولة التي تسمى بلد الأنوار؟", a: ["فرنسا", "باريس"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع مدينة نيروبي؟", a: ["كينيا"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر مدينة في أفريقيا؟", a: ["لاغوس", "القاهرة"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع مدينة بانكوك؟", a: ["تايلاند", "تايلند"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم الدولة التي تسمى بلد الساموراي؟", a: ["اليابان"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع مدينة مومباي؟", a: ["الهند"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم الدولة التي تسمى أرض الكنغر؟", a: ["أستراليا"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع مدينة بوخارست؟", a: ["رومانيا"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم الدولة التي تسمى أرض الألف بحيرة؟", a: ["فنلندا"], difficulty: "hard", category: "geography" },
  { q: "في أي دولة تقع مدينة كييف؟", a: ["أوكرانيا", "Ukraine"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر جزيرة في اليابان؟", a: ["هونشو"], difficulty: "hard", category: "geography" },
  { q: "في أي دولة تقع مدينة مارسيليا؟", a: ["فرنسا"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم الدولة التي تسمى أرض التنين؟", a: ["الصين", "بوتان"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع مدينة دكار؟", a: ["السنغال"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم الجبل الأعلى في أوروبا؟", a: ["جبل إلبروس", "Mont Blanc"], difficulty: "hard", category: "geography" },

  // ════════════════════════════════════════
  //         ⚗️ أسئلة علمية إضافية
  // ════════════════════════════════════════

  { q: "ما هو الفرق بين الوزن والكتلة؟", a: ["الكتلة ثابتة والوزن يتغير بالجاذبية"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم الظاهرة التي تسبب الجزر والمد؟", a: ["جاذبية القمر", "المد والجزر"], difficulty: "medium", category: "science" },
  { q: "كم عدد أنواع الخلايا الرئيسية في الإنسان؟", a: ["200 نوع تقريباً"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم جزء الذرة الموجب الشحنة؟", a: ["البروتون"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم جزء الذرة السالب الشحنة؟", a: ["الإلكترون"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم جزء الذرة المتعادل الشحنة؟", a: ["النيوترون"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم العلم الذي يدرس الكيمياء الحيوية؟", a: ["البيوكيمياء", "الكيمياء الحيوية"], difficulty: "medium", category: "science" },
  { q: "كم تستغرق الأرض للدوران حول الشمس؟", a: ["365 يوم و6 ساعات", "سنة"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم أكبر غدة في جسم الإنسان؟", a: ["الكبد"], difficulty: "medium", category: "science" },
  { q: "ما هو الفيتامين الذي يُنتجه الجلد من الشمس؟", a: ["فيتامين D", "فيتامين د"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم العملية التي تتكاثر بها الخلايا؟", a: ["الانقسام الخلوي", "الانقسام"], difficulty: "medium", category: "science" },
  { q: "كم عدد الكروموسومات الجنسية في الإنسان؟", a: ["زوج واحد", "2"], difficulty: "medium", category: "science" },
  { q: "ما هو الجهاز الذي يصنع خلايا الدم الحمراء؟", a: ["نخاع العظام", "نخاع العظم"], difficulty: "medium", category: "science" },
  { q: "ما هو الرمز الكيميائي للذهب؟", a: ["Au"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم الجزء الأخضر في الخلية النباتية؟", a: ["الصانعة الخضراء", "الكلوروبلاست"], difficulty: "medium", category: "science" },
  { q: "كم عدد العناصر في الجدول الدوري؟", a: ["118", "مئة وثمانية عشر"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم أخف عنصر في الجدول الدوري؟", a: ["الهيدروجين"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم العلم الذي يدرس الفيزياء والكيمياء معاً؟", a: ["الكيمياء الفيزيائية", "الفيزياء الكيميائية"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم ظاهرة الكون المتمدد؟", a: ["التمدد الكوني", "نظرية الانفجار الكبير"], difficulty: "hard", category: "science" },
  { q: "كم يبلغ قطر الأرض؟", a: ["12742 كم", "12000 كم تقريباً"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم أعمق خندق في المحيط الهادئ؟", a: ["خندق ماريانا", "مارياناس"], difficulty: "medium", category: "science" },
  { q: "ما هو الفيتامين المسؤول عن تجلط الدم؟", a: ["فيتامين K", "فيتامين كي"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم المادة التي تشكل معظم جسم الإنسان؟", a: ["الماء", "H2O"], difficulty: "medium", category: "science" },
  { q: "ما هو أثقل عضو في الجسم؟", a: ["الكبد", "الجلد"], difficulty: "medium", category: "science" },
  { q: "كم تضرب قلب الإنسان في الدقيقة تقريباً؟", a: ["60-100 مرة", "70 مرة"], difficulty: "medium", category: "science" },

  // ════════════════════════════════════════
  //          ⚽ أسئلة رياضية إضافية
  // ════════════════════════════════════════

  { q: "ما هو اسم أطول سباق جري في الأولمبياد؟", a: ["الماراثون", "42.195 كم"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم اللعبة التي تستخدم فيها المضارب؟", a: ["التنس", "كرة الريشة", "إسكواش"], difficulty: "medium", category: "sports" },
  { q: "كم مدة مباراة كرة القدم الرسمية؟", a: ["90 دقيقة", "تسعون دقيقة"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم الرياضة التي تُلعب في حوض الماء؟", a: ["السباحة", "كرة الماء"], difficulty: "medium", category: "sports" },
  { q: "كم عدد اللاعبين في فريق الرغبي؟", a: ["15", "خمسة عشر"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم بطولة كرة القدم الأفريقية؟", a: ["كأس أمم أفريقيا", "الكان"], difficulty: "medium", category: "sports" },
  { q: "كم مرة فاز المنتخب الفرنسي بكأس العالم؟", a: ["مرتان", "2"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم الرياضة التي يرتدي فيها اللاعبون قفازات؟", a: ["الملاكمة", "الغولف"], difficulty: "medium", category: "sports" },
  { q: "كم عدد أهداف كريستيانو رونالدو الدولية؟", a: ["أكثر من 120", "130 هدف"], difficulty: "hard", category: "sports" },
  { q: "ما هو اسم أول دولة أفريقية تصل لنصف نهائي كأس العالم؟", a: ["المغرب", "2022"], difficulty: "medium", category: "sports" },
  { q: "كم عدد مرات فوز المنتخب المصري بكأس أمم أفريقيا؟", a: ["7", "سبع مرات"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم الدوري المصري لكرة القدم؟", a: ["الدوري المصري الممتاز", "الدوري المصري"], difficulty: "medium", category: "sports" },
  { q: "من هو أكثر هداف في تاريخ كأس أمم أفريقيا؟", a: ["حسن الشاذلي", "الشاذلي"], difficulty: "hard", category: "sports" },
  { q: "في أي سنة بدأت بطولة الأولمبياد الحديثة؟", a: ["1896", "أثينا 1896"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم الرياضة المعروفة بالرياضة الملكية؟", a: ["كرة القدم", "التنس", "الفروسية"], difficulty: "medium", category: "sports" },
  { q: "كم عدد أعضاء الفريق في الكريكيت؟", a: ["11", "أحد عشر"], difficulty: "medium", category: "sports" },
  { q: "ما هو اسم الدوري الأسباني الدرجة الأولى؟", a: ["الليغا", "La Liga"], difficulty: "medium", category: "sports" },
  { q: "من هو أكثر لاعب ظهوراً في البريميرليج؟", a: ["غاريث باري", "Gareth Barry"], difficulty: "hard", category: "sports" },
  { q: "كم مرة فاز ريال مدريد بالليغا؟", a: ["35 مرة", "أكثر من 34"], difficulty: "hard", category: "sports" },
  { q: "ما هو اسم أشهر منافسة في كرة القدم الإسبانية؟", a: ["الكلاسيكو", "El Clasico"], difficulty: "medium", category: "sports" },

  // ════════════════════════════════════════
  //       📱 التكنولوجيا والبرمجة الإضافية
  // ════════════════════════════════════════

  { q: "ما هو اسم نظام تشغيل جوجل للهواتف؟", a: ["أندرويد", "Android"], difficulty: "medium", category: "programming" },
  { q: "ما هي اللغة المستخدمة لوصف بنية صفحات الويب؟", a: ["HTML"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أشهر محرك بحث في العالم؟", a: ["جوجل", "Google"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى WWW؟", a: ["شبكة الويب العالمية", "World Wide Web"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أشهر شبكة تواصل اجتماعي؟", a: ["فيسبوك", "إنستغرام", "تيك توك"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى PDF؟", a: ["Portable Document Format", "تنسيق المستندات المحمولة"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم نظام التشغيل الخاص بأبل للكمبيوتر؟", a: ["macOS", "ماك أو إس"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى IT؟", a: ["تكنولوجيا المعلومات", "Information Technology"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أشهر منصة لمشاركة الفيديوهات؟", a: ["يوتيوب", "YouTube"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى PIN؟", a: ["الرقم السري الشخصي", "Personal Identification Number"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أشهر برنامج لمعالجة النصوص؟", a: ["مايكروسوفت وورد", "Word"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى GIF؟", a: ["تنسيق التبادل الرسومي", "Graphics Interchange Format"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أشهر تطبيق للتراسل الفوري؟", a: ["واتساب", "WhatsApp"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى FTP؟", a: ["بروتوكول نقل الملفات", "File Transfer Protocol"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أشهر برنامج للعروض التقديمية؟", a: ["مايكروسوفت باوربوينت", "PowerPoint"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى MP3؟", a: ["MPEG Audio Layer 3", "صيغة صوتية رقمية"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أشهر برنامج لجداول البيانات؟", a: ["مايكروسوفت إكسيل", "Excel"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى JPEG؟", a: ["Joint Photographic Experts Group", "تنسيق صور"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أشهر لعبة فيديو في 2020؟", a: ["Fortnite", "فورتنايت"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى Bluetooth؟", a: ["بلوتوث", "تقنية لاسلكية"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم نظام ذكاء اصطناعي أطلقته OpenAI؟", a: ["ChatGPT", "GPT"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى NFC؟", a: ["الاتصال قريب المدى", "Near Field Communication"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أشهر شركة في مجال الألعاب الإلكترونية؟", a: ["نينتندو", "Sony", "Microsoft"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى QR Code؟", a: ["رمز الاستجابة السريعة", "Quick Response Code"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أشهر متجر تطبيقات لأيفون؟", a: ["App Store", "آب ستور"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى DNS؟", a: ["نظام أسماء النطاقات", "Domain Name System"], difficulty: "medium", category: "programming" },
  { q: "ما هو اسم أشهر لغة برمجة في الذكاء الاصطناعي؟", a: ["Python", "بايثون"], difficulty: "medium", category: "programming" },
  { q: "ما هو معنى HDMI؟", a: ["واجهة الوسائط المتعددة عالية الدقة", "High Definition Multimedia Interface"], difficulty: "medium", category: "programming" },

  // ════════════════════════════════════════
  //        🌟 أسئلة جغرافية إضافية مكثفة
  // ════════════════════════════════════════

  { q: "ما هو اسم المضيق الذي يصل البحر الأحمر بخليج عدن؟", a: ["مضيق باب المندب"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم المضيق الذي يفصل أوروبا عن أفريقيا؟", a: ["مضيق جبل طارق"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة يقع نهر الفرات؟", a: ["العراق وسوريا وتركيا", "يمر بتركيا وسوريا والعراق"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم الجبل الذي يُعدّ سقف العالم؟", a: ["إيفرست", "جبل إيفرست"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة يقع الكولوسيوم الروماني؟", a: ["إيطاليا", "روما"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم المضيق الذي يربط البحر الأسود بالبحر الأبيض المتوسط؟", a: ["مضيق البوسفور والدردنيل", "البوسفور"], difficulty: "hard", category: "geography" },
  { q: "في أي دولة تقع أنغكور وات؟", a: ["كمبوديا"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر صحراء في آسيا؟", a: ["صحراء غوبي", "غوبي"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة يقع نهر دجلة؟", a: ["العراق وتركيا", "يمر بتركيا والعراق"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم المسطح المائي الذي يربط المحيط الأطلسي بالمحيط الهادئ؟", a: ["قناة بنما", "مضيق ماجلان"], difficulty: "medium", category: "geography" },
  { q: "في أي دولة تقع أبو سمبل؟", a: ["مصر"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم الدولة التي تتشابك مع جميع الدول الأوروبية البرية؟", a: ["ألمانيا", "النمسا"], difficulty: "hard", category: "geography" },
  { q: "في أي دولة يقع جبل كيليمانجارو بالضبط؟", a: ["تنزانيا"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أطول قناة مائية اصطناعية في العالم؟", a: ["القناة الكبرى في الصين", "الجراند كانال"], difficulty: "hard", category: "geography" },
  { q: "في أي قارة تقع دولة المغرب؟", a: ["أفريقيا", "إفريقيا"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم الجزيرة التي تسمى أرض النار؟", a: ["تيرا ديل فويغو", "تييرا ديل فويغو"], difficulty: "hard", category: "geography" },
  { q: "في أي دولة تقع مدينة ماتشو بيتشو؟", a: ["بيرو"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر دلتا في العالم؟", a: ["دلتا السوندربانز", "دلتا الغانج"], difficulty: "hard", category: "geography" },
  { q: "في أي دولة تقع مدينة طنجة؟", a: ["المغرب"], difficulty: "medium", category: "geography" },
  { q: "ما هو اسم أكبر بحيرة في آسيا؟", a: ["بحر قزوين", "بحيرة قزوين"], difficulty: "medium", category: "geography" },

  // ════════════════════════════════════════
  //         📜 تاريخ مصر خاصة
  // ════════════════════════════════════════

  { q: "من هو باني أهرام الجيزة الشهيرة الثلاثة؟", a: ["خوفو وخفرع ومنقرع", "الملوك الثلاثة"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم أكبر أهرامات الجيزة؟", a: ["هرم خوفو", "الهرم الأكبر"], difficulty: "medium", category: "history" },
  { q: "في أي عام فتح المسلمون مصر؟", a: ["641", "21 هجري"], difficulty: "hard", category: "history" },
  { q: "من قاد فتح مصر الإسلامي؟", a: ["عمرو بن العاص"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم أول ملكة في التاريخ المصري؟", a: ["حتشبسوت", "نيتحريت"], difficulty: "hard", category: "history" },
  { q: "في أي عام بُنيت الأهرامات تقريباً؟", a: ["2560 ق.م", "قبل الميلاد"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم إله الشمس عند المصريين القدماء؟", a: ["رع", "آمون رع"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم اللغة التي استخدمها المصريون القدماء للكتابة؟", a: ["الهيروغليفية"], difficulty: "medium", category: "history" },
  { q: "في أي عام اكتُشفت حجر رشيد؟", a: ["1799", "١٧٩٩"], difficulty: "hard", category: "history" },
  { q: "من فكّ رموز اللغة الهيروغليفية؟", a: ["شامبليون", "جان فرانسوا شامبليون"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم الفرعون الذي ذكره القرآن الكريم كثيراً؟", a: ["فرعون", "ويُعتقد أنه رمسيس الثاني"], difficulty: "medium", category: "history" },
  { q: "في أي مدينة مصرية يقع الجامع الأزهر؟", a: ["القاهرة"], difficulty: "medium", category: "history" },
  { q: "ما هو اسم آخر حاكم للدولة المملوكية في مصر؟", a: ["طومانباي الثاني", "طومانباي"], difficulty: "hard", category: "history" },
  { q: "في أي عام دخل محمد علي إلى مصر؟", a: ["1801", "1798 مع نابليون"], difficulty: "hard", category: "history" },
  { q: "من هو باني قناة السويس؟", a: ["فرديناند دو ليسبس", "سعيد باشا"], difficulty: "medium", category: "history" },

  // ════════════════════════════════════════
  //         🧪 أسئلة علوم إضافية
  // ════════════════════════════════════════

  { q: "ما هو الوقود الأساسي للشمس؟", a: ["الهيدروجين", "تفاعل اندماج نووي"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم العملية التي يتحول فيها السائل إلى بخار؟", a: ["التبخر", "التبخير"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم الجهاز الذي يقيس شدة الصوت؟", a: ["ديسيبل متر", "الديسيبل وحدة قياس"], difficulty: "medium", category: "science" },
  { q: "كم تبلغ سرعة الضوء في الفضاء؟", a: ["300000 كم/ثانية", "299792 كم/ثانية"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم الكوكب المعروف بكوكب المياه؟", a: ["الأرض", "Earth"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم العلم الذي يدرس علاقة الأحياء ببيئتها؟", a: ["علم البيئة", "الإيكولوجيا"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم الجهاز الذي يقيس شدة الضوء؟", a: ["مقياس الضوء", "اللوكس متر"], difficulty: "hard", category: "science" },
  { q: "ما هو اسم أطول عظمة في الجسم البشري؟", a: ["عظمة الفخذ"], difficulty: "medium", category: "science" },
  { q: "ما هو الغاز الذي يتشكل عند حرق الكربون؟", a: ["ثاني أكسيد الكربون", "CO2"], difficulty: "medium", category: "science" },
  { q: "كم عدد أبعاد الفضاء الفيزيائي؟", a: ["3", "ثلاثة"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم العملية التي تنتج الطاقة في الشمس؟", a: ["الاندماج النووي"], difficulty: "medium", category: "science" },
  { q: "ما هو الجهاز الذي يحوّل الطاقة الشمسية إلى كهرباء؟", a: ["الخلية الشمسية", "الألواح الشمسية"], difficulty: "medium", category: "science" },
  { q: "كم يبلغ محيط الأرض تقريباً؟", a: ["40000 كم", "40075 كم"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم النظرية التي تصف نشأة الكون؟", a: ["الانفجار الكبير", "Big Bang"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم العلم الذي يدرس الأجرام السماوية؟", a: ["علم الفلك", "الفلك"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم الجهاز الذي يُستخدم لرؤية النجوم؟", a: ["التلسكوب", "المقراب"], difficulty: "medium", category: "science" },
  { q: "ما هو الفرق بين العناصر والمركبات؟", a: ["العنصر مادة نقية والمركب من عنصرين أو أكثر"], difficulty: "medium", category: "science" },
  { q: "كم عدد الأسطح في الكرة؟", a: ["1", "سطح واحد"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم العلم الذي يدرس الطقس؟", a: ["الميتيورولوجيا", "علم الطقس", "علم الأرصاد الجوية"], difficulty: "medium", category: "science" },
  { q: "ما هو اسم الظاهرة التي تجعل السماء زرقاء؟", a: ["تشتت رايلي", "تشتت الضوء"], difficulty: "hard", category: "science" },
];

// إجمالي الأسئلة
const totalQuestions = questions.length;

// الحصول على أسئلة حسب المستوى
function getByDifficulty(difficulty) {
  return questions.filter(q => q.difficulty === difficulty);
}

// الحصول على أسئلة حسب التصنيف
function getByCategory(category) {
  return questions.filter(q => q.category === category);
}

// سؤال عشوائي مع تجنب التكرار
function getRandomQuestion(usedIndexes = new Set(), difficulty = null) {
  let pool = questions.filter((_, i) => !usedIndexes.has(i));
  if (difficulty) pool = pool.filter(q => q.difficulty === difficulty);
  if (pool.length === 0) return null;
  const idx = Math.floor(Math.random() * pool.length);
  const question = pool[idx];
  const originalIndex = questions.indexOf(question);
  return { question, index: originalIndex };
}



// ══════════════════════════════════════════════════════════
//                    🎮 منطق اللعبة
// ══════════════════════════════════════════════════════════

// ─── حالة الألعاب النشطة لكل جروب ───
const games = new Map();

// ─── ثوابت اللعبة ───
const WIN_SCORE       = 100;
const QUESTION_TIME   = 20 * 1000;   // 20 ثانية
const SPEED_TIME      = 10 * 1000;   // 10 ثانية
const SPEED_EVERY     = 5;           // جولة سرعة كل 5 أسئلة
const SPEED_POINTS    = 20;
const MEDIUM_POINTS   = 10;
const HARD_POINTS     = 15;
const JOKER_POINTS    = 30;          // نقاط سؤال الجوكر

// ─── إيموجيات الفريقين ───
const TEAM_EMOJI = ['🦅', '🔥'];

// ─── إنشاء حالة لعبة جديدة ───
function newGame() {
  return {
    phase: 'registration1',
    teams: [],
    currentTeam: 0,
    usedIndexes: new Set(),
    questionCount: 0,
    currentQuestion: null,
    timer: null,
    speedRound: false,
    active: false,
    jokerUsed: [false, false]      // جوكر كل فريق - false = لم يُستخدم
  };
}

// ─── التحقق من صحة الإجابة (مرنة) ───
function checkAnswer(input, correctAnswers) {
  const norm = str => str.trim().toLowerCase()
    .replace(/[.,،؟?!]/g, '')
    .replace(/\s+/g, ' ');
  const userAns = norm(input);
  return correctAnswers.some(ans => {
    const a = norm(ans);
    return userAns === a || userAns.includes(a) || a.includes(userAns);
  });
}

// ─── الحصول على اسم اللاعب من JID ───
function getPlayerName(conn, jid) {
  try {
    const contact = conn.contacts?.[jid];
    return contact?.pushname || contact?.name || jid.split('@')[0];
  } catch {
    return jid.split('@')[0];
  }
}

// ─── عرض اللوحة بعد كل سؤال ───
function scoreBoard(game) {
  const t1 = game.teams[0];
  const t2 = game.teams[1];
  return `📊 *النتيجة الحالية*\n\n${TEAM_EMOJI[0]} *${t1.name}*: ${t1.score} نقطة\n${TEAM_EMOJI[1]} *${t2.name}*: ${t2.score} نقطة`;
}

// ─── إيقاف التايمر الحالي ───
function clearTimer(game) {
  if (game.timer) {
    clearTimeout(game.timer);
    game.timer = null;
  }
}

// ─── إنهاء المباراة ───
async function endGame(conn, chatId, game, winnerIdx) {
  clearTimer(game);
  games.delete(chatId);

  const winner = game.teams[winnerIdx];
  const loser  = game.teams[winnerIdx === 0 ? 1 : 0];
  const loserIdx = winnerIdx === 0 ? 1 : 0;

  // ─── أفضل لاعب ───
  let bestPlayer = null;
  let bestScore  = -1;
  for (const team of game.teams) {
    for (const [jid, stats] of Object.entries(team.playerStats)) {
      if (stats.points > bestScore) {
        bestScore  = stats.points;
        bestPlayer = { jid, stats, teamName: team.name };
      }
    }
  }

  let winnerMsg = `🏆 *انتهت المباراة!*\n\n`;
  winnerMsg += `┌─────────────────┐\n`;
  winnerMsg += `│  👑 *الفائز*  │\n`;
  winnerMsg += `│  ${TEAM_EMOJI[winnerIdx]} *${winner.name}*  │\n`;
  winnerMsg += `└─────────────────┘\n\n`;
  winnerMsg += `🎉 *مبروك الفوز يا ${winner.name}!* 🎉\n\n`;

  winnerMsg += `📊 *إحصائيات المباراة*\n`;
  winnerMsg += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  for (let i = 0; i < 2; i++) {
    const t = game.teams[i];
    winnerMsg += `${TEAM_EMOJI[i]} *${t.name}*\n`;
    winnerMsg += `🎯 النقاط: ${t.score}\n`;
    winnerMsg += `✅ إجابات صح: ${t.correct}\n`;
    winnerMsg += `❌ إجابات غلط: ${t.wrong}\n\n`;
  }

  if (bestPlayer) {
    const name = bestPlayer.jid.split('@')[0];
    const fastestMs = bestPlayer.stats.fastestTime;
    const fastestStr = fastestMs ? `${(fastestMs / 1000).toFixed(1)} ثانية` : 'غير محدد';
    winnerMsg += `━━━━━━━━━━━━━━━━━━━━\n`;
    winnerMsg += `👑 *أفضل لاعب في المباراة*\n\n`;
    winnerMsg += `🌟 الاسم: @${name}\n`;
    winnerMsg += `✅ إجابات صح: ${bestPlayer.stats.correct}\n`;
    winnerMsg += `🎯 نقاط ساهم بها: ${bestPlayer.stats.points}\n`;
    winnerMsg += `⚡ أسرع إجابة: ${fastestStr}\n`;
  }

  const mentions = [];
  for (const team of game.teams) {
    mentions.push(...team.players);
  }
  if (bestPlayer) mentions.push(bestPlayer.jid);

  await conn.sendMessage(chatId, {
    text: winnerMsg,
    mentions: [...new Set(mentions)]
  });
}

// ─── إرسال السؤال التالي ───
async function sendNextQuestion(conn, chatId, game) {
  game.questionCount++;

  // ─── تحقق من جولة السرعة ───
  if (game.questionCount % SPEED_EVERY === 0) {
    await sendSpeedRound(conn, chatId, game);
    return;
  }

  const teamIdx = game.currentTeam;
  const team    = game.teams[teamIdx];

  const result = getRandomQuestion(game.usedIndexes);
  if (!result) {
    await conn.sendMessage(chatId, { text: '⚠️ انتهت الأسئلة! المباراة توقفت.' });
    games.delete(chatId);
    return;
  }

  const { question, index } = result;
  game.usedIndexes.add(index);
  game.currentQuestion = {
    ...question,
    index,
    teamIdx,
    startTime: Date.now(),
    answered: false,
    speedRound: false
  };

  const diffLabel = question.difficulty === 'hard' ? '🔴 صعب' : '🟡 متوسط';
  const points    = question.difficulty === 'hard' ? HARD_POINTS : MEDIUM_POINTS;
  const emoji     = TEAM_EMOJI[teamIdx];

  let msg = `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `${emoji} *سؤال للفريق: ${team.name}*\n`;
  msg += `${diffLabel} | 🎯 *${points} نقطة*\n`;
  msg += `⏳ الوقت: 20 ثانية\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `❓ *${question.q}*`;

  await conn.sendMessage(chatId, { text: msg });

  // ─── التايمر ───
  clearTimer(game);
  game.timer = setTimeout(async () => {
    if (!games.has(chatId)) return;
    const g = games.get(chatId);
    if (!g.currentQuestion || g.currentQuestion.answered) return;

    g.currentQuestion.answered = true;
    const correctAns = g.currentQuestion.a[0];

    await conn.sendMessage(chatId, {
      text: `⌛ *انتهى الوقت!*\n❌ لم يتم احتساب أي نقاط\n\n✅ *الإجابة الصحيحة: ${correctAns}*\n\n${scoreBoard(g)}`
    });

    // الدور للفريق الآخر
    g.currentTeam = g.currentTeam === 0 ? 1 : 0;
    setTimeout(() => sendNextQuestion(conn, chatId, g), 2000);
  }, QUESTION_TIME);
}

// ─── جولة السرعة ───
async function sendSpeedRound(conn, chatId, game) {
  const result = getRandomQuestion(game.usedIndexes);
  if (!result) {
    await sendNextQuestion(conn, chatId, game);
    return;
  }

  const { question, index } = result;
  game.usedIndexes.add(index);
  game.currentQuestion = {
    ...question,
    index,
    teamIdx: -1,
    startTime: Date.now(),
    answered: false,
    speedRound: true
  };

  let msg = `\n⚡⚡⚡ *جولة السرعة!* ⚡⚡⚡\n\n`;
  msg += `🏆 *للفريقين معاً!*\n`;
  msg += `⚡ أول فريق يجاوب صح ياخد النقاط فوراً!\n`;
  msg += `⏳ الوقت: 10 ثواني\n`;
  msg += `🎯 النقاط: ${SPEED_POINTS}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `❓ *${question.q}*`;

  await conn.sendMessage(chatId, { text: msg });

  clearTimer(game);
  game.timer = setTimeout(async () => {
    if (!games.has(chatId)) return;
    const g = games.get(chatId);
    if (!g.currentQuestion || g.currentQuestion.answered) return;

    g.currentQuestion.answered = true;
    const correctAns = g.currentQuestion.a[0];

    await conn.sendMessage(chatId, {
      text: `⌛ *انتهى وقت جولة السرعة!*\n❌ لم يفز أي فريق بالنقاط\n\n✅ *الإجابة الصحيحة: ${correctAns}*\n\n${scoreBoard(g)}`
    });

    g.currentTeam = g.currentTeam === 0 ? 1 : 0;
    setTimeout(() => sendNextQuestion(conn, chatId, g), 2000);
  }, SPEED_TIME);
}

// ─── سؤال الجوكر ───
async function sendJokerQuestion(conn, chatId, game, teamIdx) {
  const result = getRandomQuestion(game.usedIndexes, 'hard');
  if (!result) {
    await conn.sendMessage(chatId, { text: '⚠️ لا توجد أسئلة صعبة متاحة للجوكر!' });
    return;
  }

  const { question, index } = result;
  game.usedIndexes.add(index);
  game.currentQuestion = {
    ...question,
    index,
    teamIdx,
    startTime: Date.now(),
    answered: false,
    speedRound: false,
    isJoker: true
  };

  const team  = game.teams[teamIdx];
  const emoji = TEAM_EMOJI[teamIdx];

  let msg = `\n🃏🃏🃏 *سؤال الجوكر!* 🃏🃏🃏\n\n`;
  msg += `${emoji} *فريق ${team.name}* استخدم الجوكر!\n`;
  msg += `🔴 سؤال صعب | 🎯 *${JOKER_POINTS} نقطة*\n`;
  msg += `⏳ الوقت: 20 ثانية\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `❓ *${question.q}*`;

  await conn.sendMessage(chatId, { text: msg });

  clearTimer(game);
  game.timer = setTimeout(async () => {
    if (!games.has(chatId)) return;
    const g = games.get(chatId);
    if (!g.currentQuestion || g.currentQuestion.answered) return;

    g.currentQuestion.answered = true;
    const correctAns = g.currentQuestion.a[0];

    await conn.sendMessage(chatId, {
      text: `⌛ *انتهى وقت الجوكر!*\n❌ لم يتم احتساب أي نقاط\n\n✅ *الإجابة الصحيحة: ${correctAns}*\n\n${scoreBoard(g)}`
    });

    g.currentTeam = g.currentTeam === 0 ? 1 : 0;
    setTimeout(() => sendNextQuestion(conn, chatId, g), 2000);
  }, QUESTION_TIME);
}

// ═══════════════════════════════════════════════════════
//                    الهاندلر الرئيسي
// ═══════════════════════════════════════════════════════
let handler = async (m, { conn, command }) => {
  const chatId = m.chat;
  const senderId = m.sender;
  const body = (m.body || '').trim();

  // ─── ليس في جروب ───
  if (!chatId.endsWith('@g.us')) {
    return conn.sendMessage(chatId, { text: '🚫 هذه اللعبة للجروبات فقط!' });
  }

  const isStartCommand = /^(العباقره|العباقرة|عباقره|عباقرة)$/i.test(command || '');

  // ─── أمر البدء ───
  if (isStartCommand) {
    if (games.has(chatId)) {
      return conn.sendMessage(chatId, {
        text: '⚠️ يوجد مباراة نشطة بالفعل!\nأرسل *إيقاف العباقرة* لإلغائها.'
      });
    }

    const game = newGame();
    games.set(chatId, game);

    return conn.sendMessage(chatId, {
      text:
        `🎓 *تسجيل الفريق الأول*\n\n` +
        `منشن للمشارك الأول\n` +
        `منشن للمشارك الثاني\n` +
        `اسم الفريق\n\n` +
        `*مثال:*\n@Ahmed @Ali الصقور\n\n` +
        `📝 كل فريق يتكون من لاعبين اثنين فقط`
    });
  }

  // ─── أمر الإيقاف ───
  if (/^(إيقاف|ايقاف)$/i.test(command || '')) {
    if (games.has(chatId)) {
      const g = games.get(chatId);
      clearTimer(g);
      games.delete(chatId);
      return conn.sendMessage(chatId, { text: '🛑 *تم إيقاف مباراة العباقرة*' });
    }
    return conn.sendMessage(chatId, { text: '⚠️ لا توجد مباراة نشطة.' });
  }

  // ─── تحقق من وجود لعبة نشطة ───
  if (!games.has(chatId)) return;
  const game = games.get(chatId);

  // ════════════════════════════════════════
  //         تسجيل الفريقين
  // ════════════════════════════════════════
  if (game.phase === 'registration1' || game.phase === 'registration2') {
    const teamNumber = game.phase === 'registration1' ? 1 : 2;

    // ─── استخراج المنشنات واسم الفريق ───
    const mentions = m.mentionedJid || [];

    if (mentions.length < 2) {
      return conn.sendMessage(chatId, {
        text: `❗ يجب منشن لاعبين اثنين!\n\n*مثال:*\n@Ahmed @Ali اسم_الفريق`
      });
    }

    // ─── استخراج اسم الفريق (الكلمات بعد المنشنات) ───
    let teamName = body;
    const mentioned = [];
    const msgText = m.message?.extendedTextMessage?.text || m.message?.conversation || body;

    const words = msgText.split(/\s+/).filter(w => !w.startsWith('@'));
    teamName = words.join(' ').trim();
    if (!teamName) teamName = `الفريق ${teamNumber}`;

    // ─── تحقق من عدم تكرار اللاعبين ───
    if (game.teams.length > 0) {
      const existingPlayers = game.teams[0].players;
      const duplicate = mentions.find(jid => existingPlayers.includes(jid));
      if (duplicate) {
        const name = getPlayerName(conn, duplicate);
        return conn.sendMessage(chatId, {
          text: `🚫 @${name} مسجل في الفريق الأول مسبقاً! لا يمكن تكرار اللاعبين.`,
          mentions: [duplicate]
        });
      }
    }

    const playerMentions = mentions.slice(0, 2);
    const playerNames = playerMentions.map(jid => getPlayerName(conn, jid));

    // ─── إنشاء إحصائيات اللاعبين ───
    const playerStats = {};
    for (const jid of playerMentions) {
      playerStats[jid] = { correct: 0, wrong: 0, points: 0, fastestTime: null };
    }

    game.teams.push({
      name: teamName,
      players: playerMentions,
      score: 0,
      correct: 0,
      wrong: 0,
      playerStats
    });

    const teamIdx = game.teams.length - 1;
    const emoji   = TEAM_EMOJI[teamIdx];

    let confirmMsg =
      `✅ *تم تسجيل الفريق ${teamNumber}!*\n\n` +
      `${emoji} *${teamName}*\n` +
      `👤 اللاعب 1: @${playerMentions[0].split('@')[0]}\n` +
      `👤 اللاعب 2: @${playerMentions[1].split('@')[0]}\n`;

    if (game.phase === 'registration1') {
      game.phase = 'registration2';
      confirmMsg += `\n━━━━━━━━━━━━━━━━━━━━\n`;
      confirmMsg += `🎓 *تسجيل الفريق الثاني*\n\n`;
      confirmMsg += `منشن للمشارك الأول\n`;
      confirmMsg += `منشن للمشارك الثاني\n`;
      confirmMsg += `اسم الفريق\n\n`;
      confirmMsg += `*مثال:*\n@Mohamed @Hassan الأسود`;
      await conn.sendMessage(chatId, { text: confirmMsg, mentions: playerMentions });
    } else {
      // ─── تم تسجيل الفريقين، ابدأ المباراة ───
      game.phase = 'playing';
      game.active = true;
      game.currentTeam = 0;

      const t1 = game.teams[0];
      const t2 = game.teams[1];
      const allPlayers = [...t1.players, ...t2.players];

      await conn.sendMessage(chatId, { text: confirmMsg, mentions: playerMentions });

      // ─── رسالة بدء المباراة ───
      let startMsg = `\n🏆 *بدأت مباراة العباقرة!*\n\n`;
      startMsg += `${TEAM_EMOJI[0]} *${t1.name}*\n`;
      startMsg += `👤 @${t1.players[0].split('@')[0]} & @${t1.players[1].split('@')[0]}\n\n`;
      startMsg += `VS\n\n`;
      startMsg += `${TEAM_EMOJI[1]} *${t2.name}*\n`;
      startMsg += `👤 @${t2.players[0].split('@')[0]} & @${t2.players[1].split('@')[0]}\n\n`;
      startMsg += `━━━━━━━━━━━━━━━━━━━━\n`;
      startMsg += `🎯 أول فريق يصل إلى *${WIN_SCORE}* نقطة يفوز!\n`;
      startMsg += `⏳ مدة كل سؤال: 20 ثانية\n`;
      startMsg += `⚡ يوجد جولة سرعة كل 5 أسئلة\n`;
      startMsg += `🃏 كل فريق عنده *جوكر واحد* (30 نقطة) — اكتب *جوكر* في دورك\n`;
      startMsg += `🚫 الإجابة للمشاركين فقط\n`;
      startMsg += `━━━━━━━━━━━━━━━━━━━━\n\n`;
      startMsg += `🚀 *يلا بينا!*`;

      await conn.sendMessage(chatId, { text: startMsg, mentions: allPlayers });
      setTimeout(() => sendNextQuestion(conn, chatId, game), 2000);
    }
    return;
  }

  // ════════════════════════════════════════
  //         مرحلة اللعب - معالجة الإجابات
  // ════════════════════════════════════════
  if (game.phase === 'playing' && game.currentQuestion && !game.currentQuestion.answered) {
    const cq = game.currentQuestion;

    // ─── تحقق من صلاحية اللاعب للإجابة ───
    const allPlayers = [...game.teams[0].players, ...game.teams[1].players];
    const isParticipant = allPlayers.includes(senderId);

    if (!isParticipant) {
      return conn.sendMessage(chatId, {
        text: `🚫 *غير مسموح لك بالإجابة!*\nالمباراة للمشاركين فقط 🎮`,
        mentions: [senderId]
      });
    }

    // ─── أمر الجوكر ───
    if (/^جوكر$/i.test(body)) {
      const senderTeamIdx = game.teams.findIndex(t => t.players.includes(senderId));
      if (senderTeamIdx === -1) return;

      // ─── تحقق إنه دوره ───
      if (game.currentTeam !== senderTeamIdx) {
        return conn.sendMessage(chatId, {
          text: `⏸️ *مش دورك!*\nالجوكر بيتستخدم في دور فريقك بس`,
          mentions: [senderId]
        });
      }

      // ─── تحقق إنه لم يستخدمه قبلاً ───
      if (game.jokerUsed[senderTeamIdx]) {
        return conn.sendMessage(chatId, {
          text: `❌ *الجوكر انتهى!*\n${TEAM_EMOJI[senderTeamIdx]} فريق *${game.teams[senderTeamIdx].name}* استخدم الجوكر قبل كده`,
          mentions: [senderId]
        });
      }

      // ─── تحقق مفيش سؤال شغال دلوقتي ───
      if (cq && !cq.answered) {
        return conn.sendMessage(chatId, {
          text: `⚠️ *في سؤال شغال دلوقتي!*\nخلص السؤال الأول وبعدين استخدم الجوكر`,
          mentions: [senderId]
        });
      }

      game.jokerUsed[senderTeamIdx] = true;
      await sendJokerQuestion(conn, chatId, game, senderTeamIdx);
      return;
    }

    // ─── في جولة السرعة: الفريقان ينافسان ───
    if (cq.speedRound) {
      const teamIdx = game.teams.findIndex(t => t.players.includes(senderId));
      if (teamIdx === -1) return;

      if (checkAnswer(body, cq.a)) {
        cq.answered = true;
        clearTimer(game);

        const responseTime = Date.now() - cq.startTime;
        const team = game.teams[teamIdx];
        team.score   += SPEED_POINTS;
        team.correct += 1;

        // ─── تحديث إحصائيات اللاعب ───
        const ps = team.playerStats[senderId];
        if (ps) {
          ps.correct += 1;
          ps.points  += SPEED_POINTS;
          if (!ps.fastestTime || responseTime < ps.fastestTime) {
            ps.fastestTime = responseTime;
          }
        }

        const playerName = getPlayerName(conn, senderId);
        const timeStr    = (responseTime / 1000).toFixed(1);
        const emoji      = TEAM_EMOJI[teamIdx];

        let msg = `⚡ *${playerName}* من فريق *${team.name}* أجاب أول!\n\n`;
        msg += `✅ *إجابة صحيحة!*\n`;
        msg += `🎯 *+${SPEED_POINTS} نقطة جولة سرعة!*\n`;
        msg += `⏱️ في ${timeStr} ثانية\n\n`;
        msg += `${scoreBoard(game)}`;

        await conn.sendMessage(chatId, { text: msg, mentions: [senderId] });

        // ─── تحقق من الفوز ───
        if (team.score >= WIN_SCORE) {
          await endGame(conn, chatId, game, teamIdx);
          return;
        }

        game.currentTeam = game.currentTeam === 0 ? 1 : 0;
        setTimeout(() => sendNextQuestion(conn, chatId, game), 2500);
      }
      return;
    }

    // ─── سؤال عادي: فقط دور الفريق المعين ───
    const activeTeamIdx = cq.teamIdx;
    const activeTeam    = game.teams[activeTeamIdx];
    const isActiveTeam  = activeTeam.players.includes(senderId);

    if (!isActiveTeam) {
      const wrongTeamIdx = game.teams.findIndex(t => t.players.includes(senderId));
      if (wrongTeamIdx !== -1) {
        return conn.sendMessage(chatId, {
          text: `⏸️ *انتظر دورك!*\nالسؤال ده لفريق *${activeTeam.name}* دلوقتي`,
          mentions: [senderId]
        });
      }
      return;
    }

    // ─── تحقق من الإجابة ───
    if (checkAnswer(body, cq.a)) {
      cq.answered = true;
      clearTimer(game);

      const responseTime = Date.now() - cq.startTime;
      const points = cq.isJoker ? JOKER_POINTS : (cq.difficulty === 'hard' ? HARD_POINTS : MEDIUM_POINTS);
      activeTeam.score   += points;
      activeTeam.correct += 1;

      // ─── تحديث إحصائيات اللاعب ───
      const ps = activeTeam.playerStats[senderId];
      if (ps) {
        ps.correct += 1;
        ps.points  += points;
        if (!ps.fastestTime || responseTime < ps.fastestTime) {
          ps.fastestTime = responseTime;
        }
      }

      const playerName = getPlayerName(conn, senderId);
      const timeStr    = (responseTime / 1000).toFixed(1);
      const emoji      = TEAM_EMOJI[activeTeamIdx];
      const diffLabel  = cq.isJoker ? '🃏 جوكر' : (cq.difficulty === 'hard' ? '🔴 صعب' : '🟡 متوسط');

      let msg = `${emoji} @${senderId.split('@')[0]} *أجاب صح!*\n\n`;
      msg += `✅ *إجابة ممتازة!*\n`;
      msg += `${diffLabel} | 🎯 *+${points} نقطة*\n`;
      msg += `⏱️ في ${timeStr} ثانية\n\n`;
      msg += `${scoreBoard(game)}`;

      await conn.sendMessage(chatId, { text: msg, mentions: [senderId] });

      // ─── تحقق من الفوز ───
      if (activeTeam.score >= WIN_SCORE) {
        await endGame(conn, chatId, game, activeTeamIdx);
        return;
      }

      // ─── دور الفريق الآخر ───
      game.currentTeam = activeTeamIdx === 0 ? 1 : 0;
      setTimeout(() => sendNextQuestion(conn, chatId, game), 2500);
    } else {
      // ─── إجابة خاطئة ───
      activeTeam.wrong += 1;
      const ps = activeTeam.playerStats[senderId];
      if (ps) ps.wrong += 1;
    }
  }
};

// ─── أمر البدء ───
handler.command = /^(العباقره|العباقرة|عباقره|عباقرة|عباقر|العباقر|إيقاف|ايقاف)$/i;

// ─── تفعيل الاستماع لكل الرسائل داخل الجروب أيضاً ───
handler.all = async (m, { conn }) => {
  const chatId = m.chat;
  if (!chatId.endsWith('@g.us')) return;
  if (!games.has(chatId)) return;

  const game = games.get(chatId);
  if (game.phase !== 'playing') return;
  if (!game.currentQuestion || game.currentQuestion.answered) return;

  const body = (m.body || '').trim();
  if (!body) return;

  // ─── تجاهل الأوامر والرسائل الفارغة ───
  if (body.startsWith('.') || body.startsWith('/') || body.startsWith('!')) return;
  if (body === 'العباقره' || body === 'العباقرة') return;

  const senderId = m.sender;
  const cq = game.currentQuestion;

  const allPlayers = [...game.teams[0].players, ...game.teams[1].players];
  const isParticipant = allPlayers.includes(senderId);

  if (!isParticipant) {
    await conn.sendMessage(chatId, {
      text: `🚫 *غير مسموح لك بالإجابة!*\nالمباراة للمشاركين فقط 🎮`,
      mentions: [senderId]
    });
    return;
  }

  // ─── أمر الجوكر في handler.all ───
  if (/^جوكر$/i.test(body)) {
    const senderTeamIdx = game.teams.findIndex(t => t.players.includes(senderId));
    if (senderTeamIdx === -1) return;

    if (game.currentTeam !== senderTeamIdx) {
      await conn.sendMessage(chatId, {
        text: `⏸️ *مش دورك!*\nالجوكر بيتستخدم في دور فريقك بس`,
        mentions: [senderId]
      });
      return;
    }

    if (game.jokerUsed[senderTeamIdx]) {
      await conn.sendMessage(chatId, {
        text: `❌ *الجوكر انتهى!*\n${TEAM_EMOJI[senderTeamIdx]} فريق *${game.teams[senderTeamIdx].name}* استخدم الجوكر قبل كده`,
        mentions: [senderId]
      });
      return;
    }

    if (cq && !cq.answered) {
      await conn.sendMessage(chatId, {
        text: `⚠️ *في سؤال شغال دلوقتي!*\nخلص السؤال الأول وبعدين استخدم الجوكر`,
        mentions: [senderId]
      });
      return;
    }

    game.jokerUsed[senderTeamIdx] = true;
    await sendJokerQuestion(conn, chatId, game, senderTeamIdx);
    return;
  }

  if (cq.speedRound) {
    const teamIdx = game.teams.findIndex(t => t.players.includes(senderId));
    if (teamIdx === -1) return;

    if (checkAnswer(body, cq.a)) {
      cq.answered = true;
      clearTimer(game);

      const responseTime = Date.now() - cq.startTime;
      const team = game.teams[teamIdx];
      team.score   += SPEED_POINTS;
      team.correct += 1;

      const ps = team.playerStats[senderId];
      if (ps) {
        ps.correct += 1;
        ps.points  += SPEED_POINTS;
        if (!ps.fastestTime || responseTime < ps.fastestTime) ps.fastestTime = responseTime;
      }

      const timeStr = (responseTime / 1000).toFixed(1);
      let msg = `⚡ @${senderId.split('@')[0]} من فريق *${team.name}* فاز بجولة السرعة!\n\n`;
      msg += `✅ *إجابة صحيحة!*\n🎯 *+${SPEED_POINTS} نقطة*\n⏱️ في ${timeStr} ثانية\n\n`;
      msg += scoreBoard(game);

      await conn.sendMessage(chatId, { text: msg, mentions: [senderId] });

      if (team.score >= WIN_SCORE) {
        await endGame(conn, chatId, game, teamIdx);
        return;
      }
      game.currentTeam = game.currentTeam === 0 ? 1 : 0;
      setTimeout(() => sendNextQuestion(conn, chatId, game), 2500);
    }
    return;
  }

  // ─── سؤال عادي ───
  const activeTeamIdx = cq.teamIdx;
  const activeTeam    = game.teams[activeTeamIdx];
  const isActiveTeam  = activeTeam.players.includes(senderId);

  if (!isActiveTeam) {
    await conn.sendMessage(chatId, {
      text: `⏸️ انتظر دورك! السؤال لفريق *${activeTeam.name}* دلوقتي`,
      mentions: [senderId]
    });
    return;
  }

  if (checkAnswer(body, cq.a)) {
    cq.answered = true;
    clearTimer(game);

    const responseTime = Date.now() - cq.startTime;
    const points = cq.isJoker ? JOKER_POINTS : (cq.difficulty === 'hard' ? HARD_POINTS : MEDIUM_POINTS);
    activeTeam.score   += points;
    activeTeam.correct += 1;

    const ps = activeTeam.playerStats[senderId];
    if (ps) {
      ps.correct += 1;
      ps.points  += points;
      if (!ps.fastestTime || responseTime < ps.fastestTime) ps.fastestTime = responseTime;
    }

    const timeStr   = (responseTime / 1000).toFixed(1);
    const emoji     = TEAM_EMOJI[activeTeamIdx];
    const diffLabel = cq.isJoker ? '🃏 جوكر' : (cq.difficulty === 'hard' ? '🔴 صعب' : '🟡 متوسط');

    let msg = `${emoji} @${senderId.split('@')[0]} أجاب صح! 🎉\n\n`;
    msg += `✅ إجابة ممتازة!\n${diffLabel} | 🎯 *+${points} نقطة*\n⏱️ في ${timeStr} ثانية\n\n`;
    msg += scoreBoard(game);

    await conn.sendMessage(chatId, { text: msg, mentions: [senderId] });

    if (activeTeam.score >= WIN_SCORE) {
      await endGame(conn, chatId, game, activeTeamIdx);
      return;
    }
    game.currentTeam = activeTeamIdx === 0 ? 1 : 0;
    setTimeout(() => sendNextQuestion(conn, chatId, game), 2500);
  } else {
    activeTeam.wrong += 1;
    const ps = activeTeam.playerStats[senderId];
    if (ps) ps.wrong += 1;
  }
};

handler.bot = false;
export default handler;
