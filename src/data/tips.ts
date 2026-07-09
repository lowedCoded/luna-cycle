import type { Tip } from '@/types';

const t = (en: string, ru: string) => ({ en, ru });

export const tips: Tip[] = [
  {
    id: 'tip-1',
    title: t('Managing Menstrual Cramps Naturally', 'Как облегчить менструальные спазмы'),
    description: t(
      'Apply a heating pad, take warm baths, and exercise lightly. Anti-inflammatory foods like ginger, turmeric, and dark leafy greens can help reduce prostaglandins that cause pain.',
      'Прикладывайте грелку, принимайте теплые ванны и легко двигайтесь. Противовоспалительные продукты — имбирь, куркума, листовая зелень — снижают уровень простагландинов, вызывающих боль.'
    ),
    category: 'health',
    image: 'health',
    source: 'Mayo Clinic – Menstrual Cramps',
    verified: true,
  },
  {
    id: 'tip-2',
    title: t('Iron-Rich Foods for Your Period', 'Продукты, богатые железом, для периода'),
    description: t(
      'During menstruation, iron levels drop. Eat spinach, lentils, red meat, pumpkin seeds, and fortified cereals. Pair with vitamin C (citrus, bell peppers) to boost absorption.',
      'Во время менструации уровень железа падает. Ешьте шпинат, чечевицу, красное мясо, тыквенные семечки и обогащенные злаки. Добавьте витамин C (цитрусы, болгарский перец) для лучшего усвоения.'
    ),
    category: 'nutrition',
    image: 'nutrition',
    source: 'WHO – Micronutrient Recommendations',
    verified: true,
  },
  {
    id: 'tip-3',
    title: t('Exercise During Your Cycle', 'Упражнения в разные фазы цикла'),
    description: t(
      'In follicular phase: high-intensity training. In luteal phase: yoga, Pilates, and moderate cardio. Listen to your body — rest when you need it.',
      'В фолликулярную фазу: высокоинтенсивные тренировки. В лютеиновую: йога, пилатес, умеренное кардио. Слушайте своё тело — отдыхайте, когда нужно.'
    ),
    category: 'sport',
    image: 'sport',
    source: 'ACSM – Exercise and Menstrual Cycle',
    verified: true,
  },
  {
    id: 'tip-4',
    title: t('Tracking Mood Swings', 'Отслеживание перепадов настроения'),
    description: t(
      'Hormonal fluctuations affect serotonin. Journal your emotions daily, practice mindfulness, and talk to friends. If PMS severely affects your life, consult a gynecologist.',
      'Гормональные колебания влияют на серотонин. Записывайте эмоции ежедневно, практикуйте осознанность, общайтесь с близкими. Если ПМС сильно мешает жизни — обратитесь к гинекологу.'
    ),
    category: 'psychology',
    image: 'psychology',
    source: 'APA – PMS and Mental Health',
    verified: true,
  },
  {
    id: 'tip-5',
    title: t('Hydration & Menstrual Health', 'Водный баланс и здоровье цикла'),
    description: t(
      'Drink 8–10 glasses of water daily. Herbal teas like chamomile, peppermint, and raspberry leaf can soothe cramps and reduce bloating.',
      'Пейте 8–10 стаканов воды в день. Травяные чаи — ромашка, мята, лист малины — успокаивают спазмы и уменьшают вздутие.'
    ),
    category: 'nutrition',
    image: 'nutrition',
    source: 'Harvard Health – Hydration Benefits',
    verified: true,
  },
  {
    id: 'tip-6',
    title: t('Sleep Quality During Luteal Phase', 'Качество сна в лютеиновую фазу'),
    description: t(
      'Progesterone rise can disrupt sleep. Keep your bedroom cool, avoid screens before bed, and try magnesium glycinate to promote relaxation and deeper sleep.',
      'Повышение прогестерона может нарушить сон. Проветривайте спальню, избегайте экранов перед сном, попробуйте магний глицинат для расслабления.'
    ),
    category: 'health',
    image: 'health',
    source: 'Sleep Foundation – Women and Sleep',
    verified: true,
  },
  {
    id: 'tip-7',
    title: t('When to See a Gynecologist', 'Когда обратиться к гинекологу'),
    description: t(
      'See a doctor if: cycles shorter than 21 or longer than 35 days, bleeding for more than 7 days, severe pain, or missed periods without pregnancy.',
      'Обратитесь к врачу если: цикл короче 21 или длиннее 35 дней, кровотечение дольше 7 дней, сильная боль или пропущенные циклы без беременности.'
    ),
    category: 'general',
    image: 'general',
    source: 'ACOG – Guidelines for Women\'s Health',
    verified: true,
  },
  {
    id: 'tip-8',
    title: t('Yoga Poses for Period Pain Relief', 'Йога для облегчения боли при месячных'),
    description: t(
      'Child\'s pose, cat-cow, and reclining bound angle pose help relax pelvic muscles and reduce cramping. Practice for 10-15 minutes daily during your period.',
      'Поза ребёнка, кошка-корова и поза бабочки лёжа расслабляют мышцы таза и уменьшают спазмы. Практикуйте 10-15 минут ежедневно во время месячных.'
    ),
    category: 'sport',
    image: 'sport',
    source: 'Yoga Journal – Menstrual Health',
    verified: true,
  },
  {
    id: 'tip-9',
    title: t('Understanding Your Fertile Window', 'Как определить фертильное окно'),
    description: t(
      'Ovulation occurs about 14 days before your next period. Track cervical mucus, basal body temperature, and use ovulation predictor kits to identify your most fertile days.',
      'Овуляция происходит примерно за 14 дней до следующей менструации. Отслеживайте цервикальную слизь, базальную температуру и используйте тесты на овуляцию.'
    ),
    category: 'health',
    image: 'health',
    source: 'ACOG – Fertility Awareness',
    verified: true,
  },
  {
    id: 'tip-10',
    title: t('Foods That Help Balance Hormones', 'Продукты для баланса гормонов'),
    description: t(
      'Healthy fats (avocado, olive oil), cruciferous vegetables (broccoli, kale), and foods rich in zinc (pumpkin seeds, chickpeas) support hormonal balance and regular cycles.',
      'Полезные жиры (авокадо, оливковое масло), крестоцветные (брокколи, капуста) и продукты с цинком (тыквенные семечки, нут) поддерживают гормональный баланс.'
    ),
    category: 'nutrition',
    image: 'nutrition',
    source: 'Harvard Nutrition – Hormone Health',
    verified: true,
  },
  {
    id: 'tip-11',
    title: t('Managing PMS with Mindfulness', 'Управление ПМС через осознанность'),
    description: t(
      'Mindfulness meditation reduces PMS symptoms by lowering cortisol. Practice 5-10 minutes daily, especially during the luteal phase. Apps like Calm or Headspace can help.',
      'Медитация осознанности снижает симптомы ПМС за счёт уменьшения кортизола. Практикуйте 5-10 минут ежедневно, особенно в лютеиновую фазу.'
    ),
    category: 'psychology',
    image: 'psychology',
    source: 'JAMA – Mindfulness for PMS',
    verified: true,
  },
  {
    id: 'tip-12',
    title: t('Endometriosis: What You Should Know', 'Эндометриоз: что нужно знать'),
    description: t(
      'Endometriosis affects 1 in 10 women. Symptoms include severe pelvic pain, heavy periods, and fatigue. Early diagnosis improves quality of life. Consult a specialist if you suspect it.',
      'Эндометриоз затрагивает 1 из 10 женщин. Симптомы: сильная тазовая боль, обильные месячные, усталость. Ранняя диагностика улучшает качество жизни.'
    ),
    category: 'general',
    image: 'general',
    source: 'WHO – Endometriosis Fact Sheet',
    verified: true,
  },
  {
    id: 'tip-13',
    title: t('Cycle-Syncing Your Workouts', 'Тренировки по фазам цикла'),
    description: t(
      'Menstrual phase: gentle yoga, walking. Follicular: HIIT, strength training. Ovulation: cardio, dance. Luteal: Pilates, moderate weights. Sync intensity with your energy levels.',
      'Менструальная фаза: мягкая йога, ходьба. Фолликулярная: HIIT, силовые. Овуляция: кардио, танцы. Лютеиновая: пилатес, умеренные веса.'
    ),
    category: 'sport',
    image: 'sport',
    source: 'ACSM – Cycle-Synced Training',
    verified: true,
  },
  {
    id: 'tip-14',
    title: t('The Role of Magnesium in Menstrual Health', 'Роль магния в здоровье цикла'),
    description: t(
      'Magnesium helps reduce cramps, improve sleep, and stabilize mood. Good sources: dark chocolate, almonds, spinach, and bananas. Consider supplementation after consulting a doctor.',
      'Магний уменьшает спазмы, улучшает сон и стабилизирует настроение. Источники: тёмный шоколад, миндаль, шпинат, бананы.'
    ),
    category: 'nutrition',
    image: 'nutrition',
    source: 'NIH – Magnesium Fact Sheet',
    verified: true,
  },
  {
    id: 'tip-15',
    title: t('Talking About Periods with Your Partner', 'Как говорить о месячных с партнёром'),
    description: t(
      'Open communication reduces stigma and strengthens relationships. Share your cycle app data, explain your needs during each phase, and ask for support when needed.',
      'Открытое общение снижает стигму и укрепляет отношения. Делитесь данными из приложения, объясняйте свои потребности в каждой фазе, просите о поддержке.'
    ),
    category: 'psychology',
    image: 'psychology',
    source: 'APA – Relationship Health',
    verified: false,
  },
  {
    id: 'tip-16',
    title: t('PCOS: Early Signs and Management', 'СПКЯ: ранние признаки и лечение'),
    description: t(
      'Polycystic Ovary Syndrome affects hormone balance. Signs include irregular periods, excess hair growth, and acne. Early diagnosis and lifestyle changes help manage symptoms effectively.',
      'Синдром поликистозных яичников влияет на гормональный баланс. Признаки: нерегулярные циклы, избыточный рост волос, акне. Ранняя диагностика и изменение образа жизни помогают контролировать симптомы.'
    ),
    category: 'health',
    image: 'health',
    source: 'NIH – PCOS Overview',
    verified: true,
  },
  {
    id: 'tip-17',
    title: t('Thyroid Health and Your Cycle', 'Щитовидная железа и ваш цикл'),
    description: t(
      'Thyroid disorders can cause irregular periods, heavy bleeding, or missed cycles. Symptoms include fatigue, weight changes, and temperature sensitivity. A simple blood test can check thyroid function.',
      'Заболевания щитовидной железы могут вызывать нерегулярные месячные, обильное кровотечение или пропуски циклов. Симптомы: усталость, изменения веса, чувствительность к температуре.'
    ),
    category: 'health',
    image: 'health',
    source: 'ACOG – Thyroid and Menstruation',
    verified: true,
  },
  {
    id: 'tip-18',
    title: t('Vaginal Health: What\'s Normal', 'Вагинальное здоровье: что нормально'),
    description: t(
      'Normal discharge varies throughout your cycle — clear and stretchy during ovulation, thicker before period. Slight odor is normal. See a doctor if you notice unusual color, strong smell, or itching.',
      'Нормальные выделения меняются в течение цикла — прозрачные и тягучие при овуляции, гуще перед месячными. Лёгкий запах нормален. Обратитесь к врачу при необычном цвете, сильном запахе или зуде.'
    ),
    category: 'health',
    image: 'health',
    source: 'ACOG – Vaginal Health',
    verified: true,
  },
  {
    id: 'tip-19',
    title: t('Birth Control and Cycle Changes', 'Контрацепция и изменения цикла'),
    description: t(
      'Hormonal birth control can change your cycle — lighter periods, fewer cramps, or irregular bleeding. It may take 3-6 months to adjust. Non-hormonal options like copper IUD don\'t affect natural cycles.',
      'Гормональная контрацепция может изменить цикл — более лёгкие месячные, меньше спазмов или нерегулярные кровотечения. Адаптация занимает 3-6 месяцев.'
    ),
    category: 'health',
    image: 'health',
    source: 'Planned Parenthood – Birth Control Guide',
    verified: true,
  },
  {
    id: 'tip-20',
    title: t('Anemia Prevention During Period', 'Профилактика анемии во время месячных'),
    description: t(
      'Heavy periods can lead to iron-deficiency anemia. Symptoms include fatigue, pale skin, and dizziness. Eat iron-rich foods with vitamin C and consider supplements if recommended by your doctor.',
      'Обильные месячные могут привести к железодефицитной анемии. Симптомы: усталость, бледность, головокружение. Ешьте продукты с железом и витамином C.'
    ),
    category: 'health',
    image: 'health',
    source: 'NIH – Iron Deficiency Anemia',
    verified: true,
  },
  {
    id: 'tip-21',
    title: t('Anti-Inflammatory Diet for PMS', 'Противовоспалительная диета при ПМС'),
    description: t(
      'Reduce PMS symptoms by eating anti-inflammatory foods: berries, fatty fish, turmeric, ginger, and green tea. Avoid processed foods, sugar, and trans fats during the luteal phase.',
      'Уменьшите симптомы ПМС противовоспалительными продуктами: ягоды, жирная рыба, куркума, имбирь, зелёный чай. Избегайте обработанной пищи, сахара и трансжиров в лютеиновую фазу.'
    ),
    category: 'nutrition',
    image: 'nutrition',
    source: 'Harvard Nutrition – Anti-Inflammatory Diet',
    verified: true,
  },
  {
    id: 'tip-22',
    title: t('Calcium for Cramp Prevention', 'Кальций для профилактики спазмов'),
    description: t(
      'Calcium-rich foods reduce menstrual cramp severity. Good sources: dairy, fortified plant milk, sardines, kale, and almonds. Aim for 1000-1200 mg daily, especially before and during your period.',
      'Продукты с кальцием уменьшают силу менструальных спазмов. Источники: молочные продукты, обогащённое растительное молоко, сардины, капуста, миндаль.'
    ),
    category: 'nutrition',
    image: 'nutrition',
    source: 'NIH – Calcium Fact Sheet',
    verified: true,
  },
  {
    id: 'tip-23',
    title: t('Vitamin D and Cycle Regularity', 'Витамин D и регулярность цикла'),
    description: t(
      'Vitamin D deficiency is linked to irregular cycles and PMS. Get 15-20 minutes of sunlight daily, eat fatty fish or fortified foods. Supplement 600-800 IU daily after consulting your doctor.',
      'Дефицит витамина D связан с нерегулярными циклами и ПМС. Принимайте солнечные ванны 15-20 минут ежедневно, ешьте жирную рыбу. Добавки 600-800 МЕ в день после консультации с врачом.'
    ),
    category: 'nutrition',
    image: 'nutrition',
    source: 'NIH – Vitamin D and Women\'s Health',
    verified: true,
  },
  {
    id: 'tip-24',
    title: t('Herbal Teas for Each Phase', 'Травяные чаи для каждой фазы'),
    description: t(
      'Menstrual: chamomile and ginger tea for cramps. Follicular: green tea for energy. Ovulation: raspberry leaf for uterine health. Luteal: peppermint for bloating and mood.',
      'Менструальная: ромашка и имбирь от спазмов. Фолликулярная: зелёный чай для энергии. Овуляция: лист малины для здоровья матки. Лютеиновая: мята от вздутия и для настроения.'
    ),
    category: 'nutrition',
    image: 'nutrition',
    source: 'Herbal Medicine – Women\'s Health',
    verified: false,
  },
  {
    id: 'tip-25',
    title: t('Gut Health and Hormones', 'Здоровье кишечника и гормоны'),
    description: t(
      'The gut microbiome influences estrogen metabolism. Eat probiotic foods (yogurt, kimchi, sauerkraut) and prebiotic fiber (garlic, onions, bananas) to support both digestion and hormonal balance.',
      'Микробиом кишечника влияет на метаболизм эстрогена. Ешьте пробиотики (йогурт, кимчи, квашеная капуста) и пребиотики (чеснок, лук, бананы) для здоровья пищеварения и гормонов.'
    ),
    category: 'nutrition',
    image: 'nutrition',
    source: 'Frontiers in Microbiology – Gut-Hormone Axis',
    verified: true,
  },
  {
    id: 'tip-26',
    title: t('Caffeine and PMS', 'Кофеин и ПМС'),
    description: t(
      'Caffeine can worsen PMS symptoms — anxiety, breast tenderness, and sleep issues. Try reducing to one cup daily or switching to herbal tea during the luteal phase.',
      'Кофеин может усиливать симптомы ПМС — тревожность, чувствительность груди, проблемы со сном. Попробуйте сократить до одной чашки в день или перейти на травяной чай в лютеиновую фазу.'
    ),
    category: 'nutrition',
    image: 'nutrition',
    source: 'JAMA – Caffeine and PMS',
    verified: true,
  },
  {
    id: 'tip-27',
    title: t('Pelvic Floor Exercises', 'Упражнения для мышц тазового дна'),
    description: t(
      'Kegel exercises strengthen pelvic floor muscles, reduce period pain, and improve bladder control. Practice 3 sets of 10 contractions daily. Hold each for 5-10 seconds.',
      'Упражнения Кегеля укрепляют мышцы тазового дна, уменьшают менструальную боль и улучшают контроль мочевого пузыря. Делайте 3 подхода по 10 сокращений ежедневно.'
    ),
    category: 'sport',
    image: 'sport',
    source: 'ACOG – Pelvic Floor Health',
    verified: true,
  },
  {
    id: 'tip-28',
    title: t('Walking for Menstrual Health', 'Ходьба для здоровья цикла'),
    description: t(
      'Brisk walking for 30 minutes daily improves blood circulation, reduces cramps, and boosts mood. It\'s the safest exercise during heavy period days.',
      'Быстрая ходьба по 30 минут ежедневно улучшает кровообращение, уменьшает спазмы и поднимает настроение. Это самое безопасное упражнение в дни с обильными выделениями.'
    ),
    category: 'sport',
    image: 'sport',
    source: 'ACSM – Walking Benefits',
    verified: true,
  },
  {
    id: 'tip-29',
    title: t('Swimming During Your Period', 'Плавание во время месячных'),
    description: t(
      'Swimming is excellent during your period — water pressure reduces cramping and the exercise boosts endorphins. Use a tampon or menstrual cup. Chlorine is perfectly safe.',
      'Плавание отлично подходит во время месячных — давление воды уменьшает спазмы, а упражнения повышают эндорфины. Используйте тампон или менструальную чашу. Хлорка совершенно безопасна.'
    ),
    category: 'sport',
    image: 'sport',
    source: 'ACSM – Aquatic Exercise',
    verified: true,
  },
  {
    id: 'tip-30',
    title: t('Stretching for Back Pain', 'Растяжка от боли в спине'),
    description: t(
      'Lower back pain is common during periods. Try cat-cow stretch, child\'s pose, and knee-to-chest stretch. Hold each for 30 seconds. Repeat 3 times daily.',
      'Боль в пояснице часто бывает во время месячных. Попробуйте позу кошки-коровы, позу ребёнка и подтягивание коленей к груди. Задерживайтесь на 30 секунд.'
    ),
    category: 'sport',
    image: 'sport',
    source: 'Yoga Journal – Back Pain Relief',
    verified: true,
  },
  {
    id: 'tip-31',
    title: t('Breathing Exercises for Pain', 'Дыхательные упражнения от боли'),
    description: t(
      'Deep breathing triggers relaxation response and reduces pain perception. Inhale for 4 counts, hold for 4, exhale for 6. Practice for 5 minutes during cramps.',
      'Глубокое дыхание запускает реакцию расслабления и снижает восприятие боли. Вдох на 4 счёта, задержка на 4, выдох на 6. Практикуйте 5 минут при спазмах.'
    ),
    category: 'sport',
    image: 'sport',
    source: 'Harvard Health – Breathing Techniques',
    verified: true,
  },
  {
    id: 'tip-32',
    title: t('Posture and Pelvic Health', 'Осанка и здоровье таза'),
    description: t(
      'Poor posture strains pelvic muscles and can worsen period pain. Sit with your hips slightly higher than knees, keep shoulders back. Take breaks from sitting every 30 minutes.',
      'Плохая осанка напрягает мышцы таза и может усиливать менструальную боль. Сидите с бёдрами чуть выше колен, плечи назад. Делайте перерывы каждые 30 минут.'
    ),
    category: 'sport',
    image: 'sport',
    source: 'ACOG – Posture and Pelvic Health',
    verified: false,
  },
  {
    id: 'tip-33',
    title: t('Dance for Mood Boost', 'Танцы для поднятия настроения'),
    description: t(
      'Dancing releases endorphins, reduces stress, and improves body image. Any style works — from salsa to hip-hop. Even 10 minutes of free movement can lift your spirits.',
      'Танцы высвобождают эндорфины, снижают стресс и улучшают восприятие тела. Подходит любой стиль — от сальсы до хип-хопа. Даже 10 минут свободного движения поднимают настроение.'
    ),
    category: 'sport',
    image: 'sport',
    source: 'Psychology Today – Dance Therapy',
    verified: false,
  },
  {
    id: 'tip-34',
    title: t('Cycle and Anxiety', 'Цикл и тревожность'),
    description: t(
      'Anxiety often spikes during the luteal phase due to progesterone decline. Practice grounding techniques, limit caffeine, and prioritize sleep. Track your anxiety alongside your cycle to identify patterns.',
      'Тревожность часто усиливается в лютеиновую фазу из-за снижения прогестерона. Практикуйте заземление, ограничьте кофеин, высыпайтесь. Отслеживайте тревожность вместе с циклом.'
    ),
    category: 'psychology',
    image: 'psychology',
    source: 'APA – Hormones and Anxiety',
    verified: true,
  },
  {
    id: 'tip-35',
    title: t('Body Image During Your Cycle', 'Образ тела во время цикла'),
    description: t(
      'Body image fluctuates with hormones — bloating and water retention are normal before your period. Wear comfortable clothes, practice self-compassion, and avoid the scale during the luteal phase.',
      'Восприятие тела меняется с гормонами — вздутие и задержка воды нормальны перед месячными. Носите удобную одежду, будьте добрее к себе, не вставайте на весы в лютеиновую фазу.'
    ),
    category: 'psychology',
    image: 'psychology',
    source: 'BPS – Body Image and Menstrual Cycle',
    verified: false,
  },
  {
    id: 'tip-36',
    title: t('Stress and Cycle Irregularity', 'Стресс и нерегулярность цикла'),
    description: t(
      'Chronic stress raises cortisol, which can delay or suppress ovulation. Practice stress management: meditation, yoga, adequate sleep, and setting boundaries. Your cycle may return to normal within 1-2 months of stress reduction.',
      'Хронический стресс повышает кортизол, что может задерживать или подавлять овуляцию. Практикуйте управление стрессом: медитация, йога, полноценный сон и личные границы.'
    ),
    category: 'psychology',
    image: 'psychology',
    source: 'ACOG – Stress and Menstruation',
    verified: true,
  },
  {
    id: 'tip-37',
    title: t('Journaling for Emotional Health', 'Ведение дневника для эмоционального здоровья'),
    description: t(
      'Daily journaling helps identify emotional patterns across your cycle. Write for 5 minutes: how you feel, what you need, what went well. Review monthly to understand your emotional rhythm.',
      'Ежедневное ведение дневника помогает выявить эмоциональные паттерны цикла. Пишите 5 минут: как вы чувствуете, что вам нужно, что прошло хорошо. Пересматривайте ежемесячно.'
    ),
    category: 'psychology',
    image: 'psychology',
    source: 'APA – Journaling Benefits',
    verified: true,
  },
  {
    id: 'tip-38',
    title: t('Meditation for Each Phase', 'Медитация для каждой фазы'),
    description: t(
      'Menstrual: restorative body scan. Follicular: energizing breathwork. Ovulation: heart-centered loving-kindness. Luteal: grounding visualization. 10 minutes daily is enough.',
      'Менструальная: восстановительное сканирование тела. Фолликулярная: энергетическое дыхание. Овуляция: сердечная медитация любви-доброты. Лютеиновая: заземляющая визуализация.'
    ),
    category: 'psychology',
    image: 'psychology',
    source: 'Mindful – Meditation Guide',
    verified: false,
  },
  {
    id: 'tip-39',
    title: t('Self-Compassion on Hard Days', 'Самосострадание в трудные дни'),
    description: t(
      'On low-energy days, practice self-compassion: acknowledge your feelings without judgment, speak to yourself as you would a friend, and allow yourself to rest without guilt.',
      'В дни низкой энергии практикуйте самосострадание: признавайте чувства без осуждения, говорите с собой как с подругой, позволяйте себе отдыхать без чувства вины.'
    ),
    category: 'psychology',
    image: 'psychology',
    source: 'Self-Compassion – Dr. Kristin Neff',
    verified: true,
  },
  {
    id: 'tip-40',
    title: t('Setting Boundaries by Phase', 'Личные границы по фазам цикла'),
    description: t(
      'Your capacity for social interaction varies. During luteal phase, it\'s OK to decline invitations. During follicular phase, schedule important meetings. Honor your energy levels without explanation.',
      'Ваша способность к социальному взаимодействию меняется. В лютеиновую фазу можно отказываться от приглашений. В фолликулярную — планируйте важные встречи. Уважайте свой уровень энергии без объяснений.'
    ),
    category: 'psychology',
    image: 'psychology',
    source: 'Psychology Today – Boundary Setting',
    verified: false,
  },
  {
    id: 'tip-41',
    title: t('Menstrual Product Guide', 'Гид по менструальным продуктам'),
    description: t(
      'Choose what works for you: pads (maxi, pantyliner), tampons (with applicator or without), menstrual cups, period underwear, or discs. Each has pros and cons for comfort, capacity, and eco-friendliness.',
      'Выбирайте то, что подходит вам: прокладки, тампоны, менструальные чаши, трусы для месячных или диски. У каждого свои плюсы и минусы для комфорта, вместимости и экологии.'
    ),
    category: 'general',
    image: 'general',
    source: 'FDA – Menstrual Products',
    verified: true,
  },
  {
    id: 'tip-42',
    title: t('Tracking Methods Comparison', 'Сравнение методов отслеживания'),
    description: t(
      'Calendar method tracks cycle length. Symptothermal method adds BBT and cervical mucus. LH test strips predict ovulation. Apps like Luna combine all methods. More data = better predictions.',
      'Календарный метод отслеживает длину цикла. Симптотермальный добавляет БТТ и цервикальную слизь. Тесты ЛГ предсказывают овуляцию. Приложения как Luna объединяют все методы.'
    ),
    category: 'general',
    image: 'general',
    source: 'ACOG – Fertility Awareness Methods',
    verified: true,
  },
  {
    id: 'tip-43',
    title: t('Traveling on Your Period', 'Путешествия во время месячных'),
    description: t(
      'Pack extras: pads/tampons/cup, pain relief, wet wipes, dark underwear. Choose aisle seats for bathroom access. Stay hydrated and move during long flights. Stress can shift your cycle — don\'t panic if it\'s late.',
      'Берите запас: прокладки/тампоны/чашу, обезболивающие, влажные салфетки, тёмное бельё. Выбирайте место у прохода. Пейте воду и двигайтесь в долгих перелётах.'
    ),
    category: 'general',
    image: 'general',
    source: 'Travel Health – Women\'s Tips',
    verified: false,
  },
  {
    id: 'tip-44',
    title: t('Cycle and Work Productivity', 'Цикл и продуктивность на работе'),
    description: t(
      'Plan your work around your cycle: follicular phase for deep focus and new projects, ovulation for meetings and negotiations, luteal for wrapping up tasks, menstrual for rest and reflection.',
      'Планируйте работу по циклу: фолликулярная фаза для глубокой работы и новых проектов, овуляция для встреч, лютеиновая для завершения задач, менструальная для отдыха.'
    ),
    category: 'general',
    image: 'general',
    source: 'HBR – Cycle and Productivity',
    verified: false,
  },
  {
    id: 'tip-45',
    title: t('Discussing Periods at Work or School', 'Как говорить о месячных на работе/учёбе'),
    description: t(
      'You can request reasonable accommodations: flexible hours, rest breaks, or work-from-home during painful days. Know your rights — period discrimination is illegal in many countries.',
      'Вы можете запросить разумные приспособления: гибкий график, перерывы для отдыха, работу из дома в болезненные дни. Знайте свои права.'
    ),
    category: 'general',
    image: 'general',
    source: 'ILO – Menstrual Health at Work',
    verified: true,
  },
  {
    id: 'tip-46',
    title: t('Creating a Period Kit', 'Собираем набор для месячных'),
    description: t(
      'Keep a discreet kit in your bag: 2 pads/tampons, pain reliever (ibuprofen), wet wipes, dark chocolate for emergencies, a heat patch, and change of underwear. Restock monthly.',
      'Держите незаметный набор в сумке: 2 прокладки/тампона, обезболивающее (ибупрофен), влажные салфетки, тёмный шоколад, греющий пластырь, смена белья. Пополняйте ежемесячно.'
    ),
    category: 'general',
    image: 'general',
    source: 'Community – Period Preparedness',
    verified: false,
  },
  {
    id: 'tip-47',
    title: t('Teen Guide to First Period', 'Гид для подростков: первая менструация'),
    description: t(
      'Your first period may come between ages 9-16. It\'s normal to be irregular for the first 1-2 years. Talk to a trusted adult, keep a period kit ready, and remember — millions go through this every day.',
      'Первая менструация может прийти в 9-16 лет. Нерегулярность в первые 1-2 года нормальна. Поговорите со взрослым, которому доверяете, держите набор готовым.'
    ),
    category: 'general',
    image: 'general',
    source: 'ACOG – First Period Guide',
    verified: true,
  },
  {
    id: 'tip-48',
    title: t('Menopause: What to Expect', 'Менопауза: чего ожидать'),
    description: t(
      'Menopause typically occurs between 45-55. Symptoms include hot flashes, sleep problems, and mood changes. Perimenopause (transition phase) can last 4-8 years. Lifestyle adjustments and medical help are available.',
      'Менопауза обычно наступает в 45-55 лет. Симптомы: приливы жара, проблемы со сном, перепады настроения. Перименопауза может длиться 4-8 лет.'
    ),
    category: 'general',
    image: 'general',
    source: 'NIA – Menopause Overview',
    verified: true,
  },
  {
    id: 'tip-49',
    title: t('Partner Support Guide', 'Руководство для партнёра'),
    description: t(
      'Support your partner: learn about their cycle phases, ask what they need each day, offer heat packs without being asked, and never minimize their pain. Periods are a shared reality in relationships.',
      'Поддерживайте партнёршу: узнайте о фазах цикла, спрашивайте что ей нужно каждый день, предлагайте грелку без напоминаний, никогда не приуменьшайте её боль.'
    ),
    category: 'general',
    image: 'general',
    source: 'Relationship Psychology – Partner Support',
    verified: false,
  },
  {
    id: 'tip-50',
    title: t('Building a Cycle-Conscious Life', 'Жизнь в ритме цикла'),
    description: t(
      'Embrace cycle consciousness: plan your month around your phases, communicate your needs, adjust your diet and exercise, and celebrate your body\'s natural rhythm. Tracking with Luna is the first step.',
      'Примите осознанность цикла: планируйте месяц по фазам, сообщайте о своих потребностях, корректируйте питание и тренировки, празднуйте естественный ритм тела.'
    ),
    category: 'general',
    image: 'general',
    source: 'Luna – Cycle Wisdom',
    verified: false,
  },
];
