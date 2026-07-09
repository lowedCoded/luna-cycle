'use client';

import { motion } from 'framer-motion';
import {
  HelpCircle, Moon, Sun, Sparkles, CloudMoon,
  Heart, Thermometer, Droplets, Brain, CalendarDays,
  Palette, Info, ChevronDown, Activity, Shield,
  Home, BookText, LayoutGrid, Timeline as TimelineIcon,
  Settings, Palette as PaletteIcon, BookOpen, Wind,
  Flame, Lightbulb, Apple, Dumbbell, Moon as MoonIcon,
  Droplets as DropletIcon, Thermometer as ThermometerIcon,
  Scale, Stethoscope, Pill, Smile, Plus,
} from 'lucide-react';
import { Card } from '@/ui/Card';
import { useT } from '@/components/providers/AppProvider';
import { useSettingsStore } from '@/lib/store/settingsStore';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 200 } },
} as const;

const phases = [
  { key: 'menstrual', icon: Moon, color: 'var(--phase-menstrual)', bg: 'from-rose-100/30 to-pink-100/30' },
  { key: 'follicular', icon: Sun, color: 'var(--phase-follicular)', bg: 'from-sky-100/30 to-blue-100/30' },
  { key: 'ovulation', icon: Sparkles, color: 'var(--phase-ovulation)', bg: 'from-amber-100/30 to-yellow-100/30' },
  { key: 'luteal', icon: CloudMoon, color: 'var(--phase-luteal)', bg: 'from-purple-100/30 to-indigo-100/30' },
];

const moodLevels = [
  { value: 1, emoji: '😢', label: 'Very Low', color: 'var(--mood-1)' },
  { value: 2, emoji: '😐', label: 'Low', color: 'var(--mood-2)' },
  { value: 3, emoji: '🙂', label: 'Neutral', color: 'var(--mood-3)' },
  { value: 4, emoji: '😊', label: 'Good', color: 'var(--mood-4)' },
  { value: 5, emoji: '🥰', label: 'Excellent', color: 'var(--mood-5)' },
];

const symptomsList = [
  { key: 'headache', icon: '🤕' },
  { key: 'bloating', icon: '🫃' },
  { key: 'cramps', icon: '⚡' },
  { key: 'fatigue', icon: '😴' },
  { key: 'nausea', icon: '🤢' },
  { key: 'backpain', icon: '🔴' },
  { key: 'breast_tenderness', icon: '💭' },
  { key: 'cravings', icon: '🍫' },
  { key: 'insomnia', icon: '🌙' },
  { key: 'acne', icon: '🔵' },
];

const flowLevels = [
  { value: 'none', icon: '○', label: 'None' },
  { value: 'light', icon: '●', label: 'Light' },
  { value: 'medium', icon: '●●', label: 'Medium' },
  { value: 'heavy', icon: '●●●', label: 'Heavy' },
];

const themes = [
  { key: 'romantic', colors: ['#fdf2f4', '#e8a0b4', '#4a1942'] },
  { key: 'natural', colors: ['#f5f0eb', '#6b8f71', '#2d3436'] },
  { key: 'modern', colors: ['#0f0f23', '#7c3aed', '#e8e8ff'] },
  { key: 'serene', colors: ['#f0eef8', '#8b7ec8', '#2d2b55'] },
  { key: 'cozy', colors: ['#fcf3ec', '#d4895a', '#3d2e24'] },
  { key: 'frost', colors: ['#f8fafc', '#5b8def', '#1e293b'] },
  { key: 'moon', colors: ['#0e0e16', '#7c8fa0', '#f0eff5'] },
  { key: 'coral', colors: ['#fff5f0', '#ff7f6e', '#2d1b1a'] },
  { key: 'jade', colors: ['#f4f9f4', '#3a9d6e', '#1a2e24'] },
  { key: 'terracotta', colors: ['#faf0ea', '#c47048', '#3d2a1e'] },
  { key: 'lavender', colors: ['#f8f5ff', '#9b7ec8', '#2a2040'] },
  { key: 'ocean', colors: ['#f0f8fc', '#2a7a9a', '#0a1a24'] },
  { key: 'sunset', colors: ['#1a0a18', '#e06050', '#f0e8ec'] },
  { key: 'rosegold', colors: ['#faf0f0', '#d4a0a8', '#3a1a22'] },
  { key: 'charcoal', colors: ['#121216', '#8a8a9a', '#e8e8ee'] },
  { key: 'forest', colors: ['#f2f6ef', '#2d6a3a', '#1a2a16'] },
  { key: 'blush', colors: ['#fdf8fb', '#e0a0b0', '#3a1a2a'] },
];

const phaseDetails: Record<string, { body: Record<string, string>; selfCare: Record<string, string>; tip: Record<string, string> }> = {
  menstrual: {
    body: { en: 'Uterus sheds its lining. Hormone levels are at their lowest. Energy may dip.', ru: 'Матка отторгает эндометрий. Уровень гормонов на минимуме. Возможен упадок сил.', uk: 'Матка відторгає ендометрій. Рівень гормонів на мінімумі. Можливий занепад сил.', de: 'Die Gebärmutter stößt ihre Schleimhaut ab. Der Hormonspiegel ist am niedrigsten.', fr: 'L\'utérus élimine sa muqueuse. Les niveaux d\'hormones sont au plus bas.', es: 'El útero se desprende de su revestimiento. Los niveles hormonales están en su punto más bajo.', it: 'L\'utero elimina il rivestimento. I livelli ormonali sono al minimo.', pt: 'O útero elimina seu revestimento. Os níveis hormonais estão no ponto mais baixo.', zh: '子宫脱落内膜。激素水平处于最低点。', ar: 'الرحم يتخلص من بطانته. مستويات الهرمونات في أدنى مستوياتها.' },
    selfCare: { en: 'Rest, heat therapy, gentle movement. Iron-rich foods and plenty of water.', ru: 'Отдых, тепло, лёгкая активность. Продукты с железом и много воды.', uk: 'Відпочинок, тепло, легка активність. Продукти з залізом і багато води.', de: 'Ruhe, Wärmetherapie, sanfte Bewegung. Eisenreiche Nahrung und viel Wasser.', fr: 'Repos, thermothérapie, mouvements doux. Aliments riches en fer et beaucoup d\'eau.', es: 'Descanso, terapia de calor, movimiento suave. Alimentos ricos en hierro y mucha agua.', it: 'Riposo, termoterapia, movimento dolce. Cibi ricchi di ferro e molta acqua.', pt: 'Descanso, terapia de calor, movimento suave. Alimentos ricos em ferro e muita água.', zh: '休息，热敷，温和运动。富含铁的食物和大量水。', ar: 'الراحة، العلاج بالحرارة، الحركة اللطيفة. الأطعمة الغنية بالحديد والكثير من الماء.' },
    tip: { en: 'Track your flow and symptoms. Day 1 is the start of a new cycle!', ru: 'Отслеживайте выделения и симптомы. День 1 — начало нового цикла!', uk: 'Відстежуйте виділення та симптоми. День 1 — початок нового циклу!', de: 'Verfolge deinen Fluss und Symptome. Tag 1 ist der Start eines neuen Zyklus!', fr: 'Suivez votre flux et vos symptômes. Le jour 1 est le début d\'un nouveau cycle!', es: '¡Rastrea tu flujo y síntomas. El día 1 es el inicio de un nuevo ciclo!', it: 'Traccia il flusso e i sintomi. Il giorno 1 è l\'inizio di un nuovo ciclo!', pt: 'Acompanhe seu fluxo e sintomas. O dia 1 é o início de um novo ciclo!', zh: '追踪您的流量和症状。第1天是新周期的开始！', ar: 'تتبعي تدفقك وأعراضك. اليوم الأول هو بداية دورة جديدة!' },
  },
  follicular: {
    body: { en: 'Estrogen rises. Energy returns. Skin clears. You may feel more social and creative.', ru: 'Эстроген растёт. Энергия возвращается. Кожа очищается. Вы можете чувствовать прилив общительности и креативности.', uk: 'Естроген зростає. Енергія повертається. Шкіра очищується. Ви можете відчувати приплив товариськості та креативності.', de: 'Östrogen steigt. Energie kehrt zurück. Die Haut klart auf. Du fühlst dich vielleicht geselliger und kreativer.', fr: 'L\'œstrogène augmente. L\'énergie revient. La peau s\'éclaircit. Vous pouvez vous sentir plus sociale et créative.', es: 'El estrógeno aumenta. La energía regresa. La piel se aclara. Puede sentirse más sociable y creativa.', it: 'L\'estrogeno aumenta. L\'energia torna. La pelle si schiarisce. Potresti sentirti più socievole e creativa.', pt: 'O estrogênio aumenta. A energia retorna. A pele clareia. Você pode se sentir mais sociável e criativa.', zh: '雌激素上升。能量恢复。皮肤变清透。你可能会感到更社交和有创造力。', ar: 'يرتفع الإستروجين. تعود الطاقة. يصفو الجلد. قد تشعرين بمزيد من التواصل الاجتماعي والإبداع.' },
    selfCare: { en: 'High-intensity workouts, social activities, start new projects. Nutrient-dense meals.', ru: 'Интенсивные тренировки, социальная активность, новые проекты. Питательная еда.', uk: 'Інтенсивні тренування, соціальна активність, нові проєкти. Поживна їжа.', de: 'Hochintensive Workouts, soziale Aktivitäten, neue Projekte. Nährstoffreiche Mahlzeiten.', fr: 'Entraînements de haute intensité, activités sociales, nouveaux projets. Repas riches en nutriments.', es: 'Entrenamientos de alta intensidad, actividades sociales, nuevos proyectos. Comidas nutritivas.', it: 'Allenamenti ad alta intensità, attività sociali, nuovi progetti. Pasti nutrienti.', pt: 'Treinos de alta intensidade, atividades sociais, novos projetos. Refeições nutritivas.', zh: '高强度锻炼，社交活动，新项目。营养丰富的餐食。', ar: 'تمارين عالية الكثافة، أنشطة اجتماعية، مشاريع جديدة. وجبات غنية بالعناصر الغذائية.' },
    tip: { en: 'This is your power phase. Schedule important meetings and intense workouts.', ru: 'Это ваша фаза силы. Планируйте важные встречи и интенсивные тренировки.', uk: 'Це ваша фаза сили. Плануйте важливі зустрічі та інтенсивні тренування.', de: 'Dies ist deine Kraftphase. Plane wichtige Meetings und intensive Workouts.', fr: 'C\'est votre phase de puissance. Planifiez des réunions importantes et des entraînements intenses.', es: 'Esta es tu fase de poder. Programa reuniones importantes y entrenamientos intensos.', it: 'Questa è la tua fase di potenza. Pianifica riunioni importanti e allenamenti intensi.', pt: 'Esta é sua fase de poder. Agende reuniões importantes e treinos intensos.', zh: '这是你的力量阶段。安排重要的会议和强度训练。', ar: 'هذه هي مرحلة قوتك. جدولي اجتماعات مهمة وتمارين مكثفة.' },
  },
  ovulation: {
    body: { en: 'LH surge triggers egg release. Testosterone peaks. Libido rises. You glow.', ru: 'Всплеск ЛГ запускает выход яйцеклетки. Тестостерон на пике. Либидо повышается. Вы сияете.', uk: 'Сплив ЛГ запускає вихід яйцеклітини. Тестостерон на піку. Лібідо підвищується. Ви сяєте.', de: 'LH-Anstieg löst den Eisprung aus. Testosteron erreicht seinen Höhepunkt. Libido steigt.', fr: 'Le pic de LH déclenche la libération de l\'ovule. La testostérone atteint son maximum.', es: 'El aumento de LH desencadena la liberación del óvulo. La testosterona alcanza su punto máximo.', it: 'Il picco di LH innesca il rilascio dell\'ovulo. Il testosterone raggiunge il picco.', pt: 'O pico de LH desencadeia a liberação do óvulo. A testosterona atinge o pico.', zh: 'LH激增触发卵子释放。睾酮达到峰值。', ar: 'ارتفاع LH يحفز إطلاق البويضة. يصل التستوستيرون إلى ذروته.' },
    selfCare: { en: 'Communicate, connect, collaborate. This is your most fertile window.', ru: 'Общайтесь, соединяйтесь, сотрудничайте. Это ваше фертильное окно.', uk: 'Спілкуйтесь, з\'єднуйтесь, співпрацюйте. Це ваше фертильне вікно.', de: 'Kommuniziere, verbinde dich, kooperiere. Dies ist dein fruchtbares Fenster.', fr: 'Communiquez, connectez-vous, collaborez. C\'est votre fenêtre fertile.', es: 'Comunícate, conéctate, colabora. Esta es tu ventana fértil.', it: 'Comunica, connettiti, collabora. Questa è la tua finestra fertile.', pt: 'Comunique-se, conecte-se, colabore. Esta é sua janela fértil.', zh: '沟通，连接，合作。这是你的受孕窗口。', ar: 'تواصلي، اتصلي، تعاوني. هذه هي نافذتك الخصبة.' },
    tip: { en: 'Cervical mucus becomes clear and stretchy like egg whites — a sign of peak fertility.', ru: 'Цервикальная слизь становится прозрачной и тягучей, как яичный белок — признак пика фертильности.', uk: 'Цервікальний слиз стає прозорим і тягучим, як яєчний білок — ознака піку фертильності.', de: 'Zervixschleim wird klar und dehnbar wie Eiweiß — ein Zeichen für maximale Fruchtbarkeit.', fr: 'La glaire cervicale devient claire et filante comme du blanc d\'œuf — signe de fertilité maximale.', es: 'El moco cervical se vuelve claro y elástico como clara de huevo — señal de máxima fertilidad.', it: 'Il muco cervicale diventa chiaro e elastico come l\'albume — segno di massima fertilità.', pt: 'O muco cervical fica claro e elástico como clara de ovo — sinal de pico de fertilidade.', zh: '宫颈粘液变得清澈有弹性，像蛋清一样 — 这是生育高峰的标志。', ar: 'يصبح مخاط عنق الرحم شفافًا ومطاطيًا مثل بياض البيض — علامة على ذروة الخصوبة.' },
  },
  luteal: {
    body: { en: 'Progesterone rises. Body temperature increases. PMS symptoms may appear. Energy slows.', ru: 'Прогестерон растёт. Температура тела повышается. Могут появиться симптомы ПМС. Энергия снижается.', uk: 'Прогестерон зростає. Температура тіла підвищується. Можуть з\'явитися симптоми ПМС. Енергія знижується.', de: 'Progesteron steigt. Die Körpertemperatur erhöht sich. PMS-Symptome können auftreten.', fr: 'La progestérone augmente. La température corporelle s\'élève. Les symptômes du SPM peuvent apparaître.', es: 'La progesterona aumenta. La temperatura corporal se eleva. Pueden aparecer síntomas del SPM.', it: 'Il progesterone aumenta. La temperatura corporea si alza. I sintomi della PMS possono comparire.', pt: 'A progesterona aumenta. A temperatura corporal sobe. Os sintomas da TPM podem aparecer.', zh: '孕酮上升。体温升高。经前综合症症状可能出现。', ar: 'يرتفع البروجسترون. ترتفع درجة حرارة الجسم. قد تظهر أعراض الدورة الشهرية.' },
    selfCare: { en: 'Gentle exercise, warm baths, magnesium, dark chocolate. Reduce caffeine and sugar.', ru: 'Лёгкие упражнения, тёплые ванны, магний, тёмный шоколад. Уменьшите кофеин и сахар.', uk: 'Легкі вправи, теплі ванни, магній, темний шоколад. Зменшіть кофеїн і цукор.', de: 'Sanfte Bewegung, warme Bäder, Magnesium, dunkle Schokolade. Reduziere Koffein und Zucker.', fr: 'Exercices doux, bains chauds, magnésium, chocolat noir. Réduisez la caféine et le sucre.', es: 'Ejercicio suave, baños calientes, magnesio, chocolate negro. Reduce la cafeína y el azúcar.', it: 'Esercizio dolce, bagni caldi, magnesio, cioccolato fondente. Riduci caffeina e zucchero.', pt: 'Exercícios leves, banhos quentes, magnésio, chocolate amargo. Reduza cafeína e açúcar.', zh: '温和运动，热水浴，镁，黑巧克力。减少咖啡因和糖。', ar: 'تمارين لطيفة، حمامات دافئة، مغنيسيوم، شوكولاتة داكنة. قللي الكافيين والسكر.' },
    tip: { en: 'Track your PMS symptoms — knowing patterns helps you prepare for each cycle.', ru: 'Отслеживайте симптомы ПМС — знание паттернов помогает подготовиться к каждому циклу.', uk: 'Відстежуйте симптоми ПМС — знання патернів допомагає підготуватися до кожного циклу.', de: 'Verfolge deine PMS-Symptome — das Erkennen von Mustern hilft dir, dich auf jeden Zyklus vorzubereiten.', fr: 'Suivez vos symptômes du SPM — connaître les schémas vous aide à vous préparer pour chaque cycle.', es: 'Rastrea tus síntomas del SPM — conocer los patrones te ayuda a prepararte para cada ciclo.', it: 'Traccia i sintomi della PMS — conoscere i modelli ti aiuta a prepararti per ogni ciclo.', pt: 'Acompanhe seus sintomas de TPM — conhecer os padrões ajuda a se preparar para cada ciclo.', zh: '追踪你的经前综合症症状 — 了解规律有助于你为每个周期做准备。', ar: 'تتبعي أعراض الدورة الشهرية — معرفة الأنماط تساعدك على الاستعداد لكل دورة.' },
  },
};

const symptomDetails: Record<string, Record<string, string>> = {
  headache: {
    en: 'Hormonal fluctuations, especially estrogen drop before your period, can trigger headaches. Stay hydrated, rest in a dark room, and try magnesium.',
    ru: 'Гормональные колебания, особенно падение эстрогена перед менструацией, могут вызывать головные боли. Пейте воду, отдыхайте в тёмной комнате, попробуйте магний.',
    uk: 'Гормональні коливання, особливо падіння естрогену перед менструацією, можуть викликати головний біль.',
    de: 'Hormonschwankungen, besonders der Östrogenabfall vor der Periode, können Kopfschmerzen auslösen.',
    fr: 'Les fluctuations hormonales, en particulier la baisse d\'œstrogène avant les règles, peuvent déclencher des maux de tête.',
    es: 'Las fluctuaciones hormonales, especialmente la caída de estrógeno antes del período, pueden desencadenar dolores de cabeza.',
    it: 'Le fluttuazioni ormonali, specialmente il calo di estrogeni prima del ciclo, possono scatenare mal di testa.',
    pt: 'As flutuações hormonais, especialmente a queda de estrogênio antes do período, podem desencadear dores de cabeça.',
    zh: '荷尔蒙波动，尤其是月经前雌激素下降，可能引发头痛。',
    ar: 'يمكن للتقلبات الهرمونية، خاصة انخفاض الإستروجين قبل الدورة الشهرية، أن تسبب الصداع.',
  },
  bloating: {
    en: 'Water retention is caused by progesterone rise in the luteal phase. Reduce salt, eat potassium-rich foods, drink herbal teas like peppermint.',
    ru: 'Задержка воды вызвана повышением прогестерона в лютеиновой фазе. Уменьшите соль, ешьте продукты с калием, пейте мятный чай.',
    uk: 'Затримка води викликана підвищенням прогестерону в лютеїновій фазі. Зменшіть сіль, їжте продукти з калієм.',
    de: 'Wassereinlagerungen werden durch den Progesteronanstieg in der Lutealphase verursacht.',
    fr: 'La rétention d\'eau est causée par l\'augmentation de la progestérone en phase lutéale.',
    es: 'La retención de agua es causada por el aumento de progesterona en la fase lútea.',
    it: 'La ritenzione idrica è causata dall\'aumento del progesterone nella fase luteale.',
    pt: 'A retenção de água é causada pelo aumento da progesterona na fase lútea.',
    zh: '水分潴留是由黄体期孕酮升高引起的。',
    ar: 'احتباس الماء ناتج عن ارتفاع البروجسترون في المرحلة الأصفرية.',
  },
  cramps: {
    en: 'Prostaglandins cause uterine contractions. Apply heat, take ibuprofen, try gentle yoga. Omega-3 fatty acids and magnesium can reduce cramp intensity.',
    ru: 'Простагландины вызывают сокращения матки. Прикладывайте тепло, принимайте ибупрофен, делайте лёгкую йогу. Омега-3 и магний снижают спазмы.',
    uk: 'Простагландини викликають скорочення матки. Прикладайте тепло, приймайте ібупрофен, робіть легку йогу.',
    de: 'Prostaglandine verursachen Gebärmutterkontraktionen. Wärme anwenden, Ibuprofen nehmen.',
    fr: 'Les prostaglandines provoquent des contractions utérines. Appliquez de la chaleur.',
    es: 'Las prostaglandinas causan contracciones uterinas. Aplica calor, toma ibuprofeno.',
    it: 'Le prostaglandine causano contrazioni uterine. Applica calore, prendi ibuprofene.',
    pt: 'As prostaglandinas causam contrações uterinas. Aplique calor, tome ibuprofeno.',
    zh: '前列腺素引起子宫收缩。热敷，服用布洛芬。',
    ar: 'تسبب البروستاجلاندين تقلصات الرحم. ضعي كمادات دافئة.',
  },
  fatigue: {
    en: 'Hormonal shifts, especially progesterone rise, can cause deep fatigue. Prioritize sleep, reduce commitments, eat protein-rich meals.',
    ru: 'Гормональные сдвиги, рост прогестерона, могут вызывать усталость. Приоритет сну, сократите обязательства, ешьте белковую пищу.',
    uk: 'Гормональні зрушення, зростання прогестерону, можуть викликати втому. Пріоритет — сон.',
    de: 'Hormonelle Veränderungen, besonders der Progesteronanstieg, können Müdigkeit verursachen.',
    fr: 'Les changements hormonaux, surtout l\'augmentation de la progestérone, peuvent provoquer de la fatigue.',
    es: 'Los cambios hormonales, especialmente el aumento de progesterona, pueden causar fatiga.',
    it: 'I cambiamenti ormonali, specialmente l\'aumento di progesterone, possono causare stanchezza.',
    pt: 'Mudanças hormonais, especialmente o aumento de progesterona, podem causar fadiga.',
    zh: '荷尔蒙变化，尤其是孕酮升高，可能导致疲劳。',
    ar: 'التغيرات الهرمونية، خاصة ارتفاع البروجسترون، يمكن أن تسبب إرهاقًا.',
  },
  nausea: {
    en: 'Hormonal fluctuations can affect the digestive system. Eat small, frequent meals, avoid spicy or fatty foods, try ginger tea.',
    ru: 'Гормональные колебания влияют на пищеварение. Ешьте маленькими порциями, избегайте острой и жирной пищи, пейте имбирный чай.',
    uk: 'Гормональні коливання впливають на травлення. Їжте маленькими порціями.',
    de: 'Hormonschwankungen können das Verdauungssystem beeinflussen.',
    fr: 'Les fluctuations hormonales peuvent affecter le système digestif.',
    es: 'Las fluctuaciones hormonales pueden afectar el sistema digestivo.',
    it: 'Le fluttuazioni ormonali possono influenzare il sistema digestivo.',
    pt: 'As flutuações hormonais podem afetar o sistema digestivo.',
    zh: '荷尔蒙波动会影响消化系统。',
    ar: 'يمكن للتقلبات الهرمونية أن تؤثر على الجهاز الهضمي.',
  },
  backpain: {
    en: 'Lower back pain during your period is caused by uterine contractions radiating to the lower back. Apply heat, try child\'s pose, warm baths.',
    ru: 'Боль в пояснице во время месячных вызвана сокращениями матки. Прикладывайте тепло, поза ребёнка, тёплые ванны.',
    uk: 'Біль у попереку під час місячних викликаний скороченнями матки.',
    de: 'Rückenschmerzen während der Periode werden durch Gebärmutterkontraktionen verursacht.',
    fr: 'Les douleurs lombaires pendant les règles sont causées par les contractions utérines.',
    es: 'El dolor lumbar durante el período es causado por contracciones uterinas.',
    it: 'Il mal di schiena durante il ciclo è causato da contrazioni uterine.',
    pt: 'A dor lombar durante o período é causada por contrações uterinas.',
    zh: '月经期间的下背痛是由子宫收缩引起的。',
    ar: 'آلام أسفل الظهر أثناء الدورة ناتجة عن تقلصات الرحم.',
  },
  breast_tenderness: {
    en: 'Breast tenderness is caused by progesterone and estrogen fluctuations. Wear a supportive bra, reduce caffeine, try evening primrose oil.',
    ru: 'Чувствительность груди вызвана колебаниями прогестерона и эстрогена. Носите поддерживающий бюстгальтер, уменьшите кофеин.',
    uk: 'Чутливість грудей викликана коливаннями прогестерону та естрогену.',
    de: 'Brustspannen wird durch Progesteron- und Östrogenschwankungen verursacht.',
    fr: 'La sensibilité des seins est causée par les fluctuations hormonales.',
    es: 'La sensibilidad mamaria es causada por fluctuaciones hormonales.',
    it: 'La sensibilità al seno è causata da fluttuazioni ormonali.',
    pt: 'A sensibilidade nos seios é causada por flutuações hormonais.',
    zh: '乳房胀痛是由荷尔蒙波动引起的。',
    ar: 'حساسية الثدي ناتجة عن التقلبات الهرمونية.',
  },
  cravings: {
    en: 'Serotonin dips before your period trigger carb and sugar cravings. Eat complex carbs, dark chocolate (70%+), and protein-rich snacks.',
    ru: 'Падение серотонина перед менструацией вызывает тягу к углеводам и сладкому. Ешьте сложные углеводы, тёмный шоколад (70%+), белковые снеки.',
    uk: 'Падіння серотоніну перед менструацією викликає потяг до вуглеводів.',
    de: 'Serotoninabfall vor der Periode löst Heißhunger aus.',
    fr: 'La baisse de sérotonine avant les règles déclenche des envies alimentaires.',
    es: 'La caída de serotonina antes del período desencadena antojos.',
    it: 'Il calo di serotonina prima del ciclo scatena voglie.',
    pt: 'A queda de serotonina antes do período causa desejos.',
    zh: '月经前血清素下降会引发对食物的渴望。',
    ar: 'انخفاض السيروتونين قبل الدورة يحفز الرغبة الشديدة.',
  },
  insomnia: {
    en: 'Progesterone rise can disrupt sleep patterns. Limit screen time before bed, keep your room cool, try magnesium glycinate.',
    ru: 'Повышение прогестерона может нарушать сон. Ограничьте экраны перед сном, проветривайте комнату, попробуйте магний глицинат.',
    uk: 'Підвищення прогестерону може порушувати сон. Обмежте екрани перед сном.',
    de: 'Progesteronanstieg kann den Schlaf stören. Reduziere Bildschirmzeit.',
    fr: 'L\'augmentation de la progestérone peut perturber le sommeil.',
    es: 'El aumento de progesterona puede alterar el sueño.',
    it: 'L\'aumento del progesterone può disturbare il sonno.',
    pt: 'O aumento da progesterona pode perturbar o sono.',
    zh: '孕酮升高可能会扰乱睡眠。',
    ar: 'ارتفاع البروجسترون يمكن أن يعطل النوم.',
  },
  acne: {
    en: 'Androgen fluctuations increase sebum production before your period. Cleanse gently, use non-comedogenic products. Zinc and spearmint tea may help.',
    ru: 'Колебания андрогенов усиливают выработку кожного сала перед менструацией. Мягко очищайте кожу, используйте некомедогенные средства.',
    uk: 'Коливання андрогенів посилюють вироблення шкірного сала.',
    de: 'Androgen-Schwankungen erhöhen die Talgproduktion.',
    fr: 'Les fluctuations androgènes augmentent la production de sébum.',
    es: 'Las fluctuaciones andrógenas aumentan la producción de sebo.',
    it: 'Le fluttuazioni androgeniche aumentano la produzione di sebo.',
    pt: 'Flutuações androgênicas aumentam a produção de sebo.',
    zh: '雄激素波动会增加皮脂分泌。',
    ar: 'تقلبات الأندروجين تزيد من إنتاج الزهم.',
  },
};

const pagesNav = [
  { key: 'dashboard', icon: Home, desc: 'Главная страница с обзором текущей фазы, прогнозом следующей менструации, быстрыми действиями и статистикой.' },
  { key: 'diary', icon: BookText, desc: 'Дневник симптомов: отмечайте настроение, боль, выделения, симптомы и пишите заметки по дням.' },
  { key: 'calendar', icon: CalendarDays, desc: 'Календарь цикла с цветовой маркировкой дней менструации и записей в дневнике.' },
  { key: 'heatmap', icon: ThermometerIcon, desc: 'Тепловая карта вашего цикла — визуализация настроения, боли и симптомов по дням.' },
  { key: 'timeline', icon: TimelineIcon, desc: 'Хронология всех циклов с детальной разбивкой по фазам и ключевым событиям.' },
  { key: 'settings', icon: Settings, desc: 'Настройки профиля, темы, языка, параметров цикла, уведомлений и управление данными.' },
  { key: 'moodboard', icon: Smile, desc: 'Визуальная доска настроения — отслеживайте эмоциональное состояние в течение цикла.' },
  { key: 'wiki', icon: BookOpen, desc: 'Энциклопедия менструального цикла: статьи о фазах, гормонах, питании и здоровье.' },
  { key: 'breathe', icon: Wind, desc: 'Дыхательные упражнения с визуальным таймером. Помогает снизить стресс и тревожность.' },
  { key: 'warmth', icon: Flame, desc: 'Термотерапия: приложение грелки для облегчения менструальных спазмов.' },
  { key: 'tips', icon: Lightbulb, desc: 'Полезные советы по здоровью, питанию, спорту и психологии для каждой фазы цикла.' },
];

const faqItems = [
  { q: 'Как начать отслеживание цикла?', a: 'Перейдите на главную страницу и нажмите «Начать отслеживание». Укажите дату начала последней менструации, и Luna автоматически рассчитает фазы вашего цикла на основе средней длины.' },
  { q: 'Где хранятся мои данные?', a: 'Все данные хранятся локально в вашем браузере с помощью localStorage. При регистрации аккаунта данные синхронизируются с облаком Supabase. Вы можете экспортировать или удалить данные в настройках.' },
  { q: 'Как добавить симптомы в дневник?', a: 'Откройте страницу Дневник, выберите дату и нажмите на нужные симптомы. Вы также можете добавить свои симптомы через кнопку «Добавить свой симптом» под списком.' },
  { q: 'Что такое ПМДР (PMDD)?', a: 'ПМДР (предменструальное дисфорическое расстройство) — это тяжёлая форма ПМС, которая затрагивает 3–8% женщин репродуктивного возраста. Симптомы включают сильную раздражительность, депрессию, тревожность и физический дискомфорт.' },
  { q: 'Как измерять базальную температуру (БТ)?', a: 'Измеряйте температуру сразу после пробуждения, не вставая с кровати, в одно и то же время. Нормальные значения: 36.1–36.4°C до овуляции, после овуляции 36.5–37.0°C. Используйте цифровой термометр.' },
  { q: 'Влияют ли лекарства на цикл?', a: 'Да, некоторые лекарства могут влиять на цикл: антидепрессанты, гормональные контрацептивы, антибиотики, препараты для щитовидной железы. Отмечайте приём лекарств в заметках дневника.' },
  { q: 'Как привычки влияют на цикл?', a: 'Стресс, недосып, резкое изменение веса, интенсивные тренировки и курение могут нарушать цикл. Регулярное отслеживание помогает выявить влияние образа жизни на ваш цикл.' },
  { q: 'Насколько защищены мои данные?', a: 'Данные хранятся локально на вашем устройстве. При использовании облачной синхронизации данные передаются по зашифрованному соединению. Мы не передаём данные третьим лицам. Соответствует требованиям GDPR.' },
  { q: 'Как экспортировать данные?', a: 'Перейдите в Настройки → Управление данными → Экспорт данных. Вы получите JSON-файл со всеми циклами, записями дневника и настройками.' },
  { q: 'Как сменить тему оформления?', a: 'Перейдите в Настройки → Тема оформления. Выберите одну из 17 доступных тем. Тема меняет цвета, акценты и фоновые элементы мгновенно.' },
  { q: 'Как включить уведомления?', a: 'Перейдите в Настройки → Уведомления. Вы можете настроить напоминания о приближающейся менструации, ежедневные напоминания о записи и оповещение об окне овуляции.' },
  { q: 'Поддерживается ли синхронизация между устройствами?', a: 'Да, после регистрации аккаунта данные автоматически синхронизируются с облачным сервером Supabase. Вы можете пользоваться Luna на нескольких устройствах.' },
  { q: 'Как использовать советы по циклу?', a: 'На странице Советы вы найдёте категоризированные статьи по здоровью, питанию, спорту и психологии. Фильтруйте по категориям и фазе цикла.' },
  { q: 'Что такое термотерапия и как она работает?', a: 'Термотерапия (грелка) использует тепло для расслабления мышц матки и уменьшения спазмов. В приложении есть анимированная грелка с регулировкой температуры и таймером.' },
  { q: 'Как работают дыхательные упражнения?', a: 'На странице Дыхание выберите один из паттернов дыхания (квадратное, 4-7-8, расслабляющее). Следуйте за визуальным таймером — вдох, задержка, выдох. Помогает снизить тревожность.' },
  { q: 'В чём разница между ПМС и ПМДР?', a: 'ПМС (предменструальный синдром) испытывают до 75% женщин, симптомы умеренные. ПМДР — более тяжёлая форма, которая серьёзно нарушает качество жизни, требует консультации врача и специфического лечения.' },
];

const pmddSymptoms = [
  { key: 'irritability', desc: 'Выраженная раздражительность — малейшие раздражители вызывают гнев. Вы можете чувствовать, что «взрываетесь» без причины.' },
  { key: 'anxiety', desc: 'Сильная тревожность, чувство внутреннего напряжения. Вы можете испытывать беспричинное беспокойство и панику.' },
  { key: 'depression', desc: 'Подавленное настроение, чувство пустоты и безнадёжности. Потеря интереса к любимым занятиям.' },
  { key: 'crying_spells', desc: 'Внезапные приступы плача без видимой причины. Эмоции становятся трудно контролируемыми.' },
  { key: 'overwhelm', desc: 'Чувство перегрузки и неспособности справляться с повседневными задачами. Всё кажется непосильным.' },
  { key: 'anger', desc: 'Вспышки гнева и ярости, которые сложно контролировать. Вы можете срываться на близких.' },
  { key: 'hopelessness', desc: 'Чувство безнадёжности и отчаяния. Кажется, что ничего не имеет значения и не улучшится.' },
];

const hormones = [
  { key: 'FSH', name: 'Фолликулостимулирующий гормон (ФСГ)', role: 'Стимулирует рост фолликулов в яичниках. Уровень повышается в начале фолликулярной фазы и стимулирует выработку эстрогена.' },
  { key: 'LH', name: 'Лютеинизирующий гормон (ЛГ)', role: 'Вызывает овуляцию — выход созревшей яйцеклетки из фолликула. Резкий пик ЛГ за 24–48 часов до овуляции — главный признак фертильного окна.' },
  { key: 'estrogen', name: 'Эстроген', role: 'Основной женский половой гормон. Растёт в фолликулярной фазе, улучшает настроение, состояние кожи и либидо. Падает перед менструацией.' },
  { key: 'progesterone', name: 'Прогестерон', role: 'Доминирует в лютеиновой фазе. Подготавливает организм к возможной беременности, повышает температуру тела, может вызывать ПМС-симптомы.' },
  { key: 'testosterone', name: 'Тестостерон', role: 'Пик приходится на овуляцию. Повышает либидо, энергию, уверенность и мотивацию. Важен для общего гормонального баланса.' },
];

const nutritionByPhase = [
  { phase: 'menstrual', foods: 'Красное мясо, печень, шпинат, чечевица, тёмный шоколад, тыквенные семечки, имбирь, куркума.', avoid: 'Кофеин, алкоголь, солёная пища, молочные продукты (могут усиливать спазмы).' },
  { phase: 'follicular', foods: 'Ферментированные продукты (кефир, квашеная капуста), листовые зелёные овощи, ягоды, орехи, рыба, тофу.', avoid: 'Избыток простых углеводов, консерванты, полуфабрикаты.' },
  { phase: 'ovulation', foods: 'Брокколи, цветная капуста, авокадо, оливковое масло, киноа, лосось, гранат, зелёный чай.', avoid: 'Сахар, острая пища, красное мясо (может усиливать воспаление).' },
  { phase: 'luteal', foods: 'Батат, овсянка, тёмный шоколад (70%+), бананы, миндаль, магний, ромашковый чай.', avoid: 'Кофеин, соль, алкоголь, рафинированный сахар, сладкие напитки.' },
];

const exerciseByPhase = [
  { phase: 'menstrual', activities: 'Йога, пилатес, растяжка, ходьба, лёгкое плавание, дыхательные практики.' },
  { phase: 'follicular', activities: 'Бег, силовые тренировки, HIIT, танцы, велосипед, функциональный тренинг.' },
  { phase: 'ovulation', activities: 'Кардио средней интенсивности, групповые занятия, плавание, теннис, боевые искусства.' },
  { phase: 'luteal', activities: 'Умеренные тренировки, пилатес, прогулки, стретчинг, йога, медитация.' },
];

export default function HelpPage() {
  const t = useT() as unknown as {
    help: Record<string, string> & { faq?: { q: string; a: string }[] };
    common: Record<string, string>;
    dashboard: Record<string, string>;
    diary: { symptoms_list: Record<string, string>; pmdd_list: Record<string, string> };
    nav: Record<string, string>;
    settings: Record<string, string>;
  };
  const lang = useSettingsStore((s) => s.lang);
  const isRtl = lang === 'ar';
  const help = t.help || {};
  const nav = t.nav || {};

  const gt = (rec: Record<string, string | undefined>) => rec[lang] || rec.en || '';

  return (
    <div className="relative min-h-[calc(100vh-6rem)]" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
          <div className="p-3 rounded-theme-lg bg-gradient-accent">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-theme-primary tracking-tight">{help.title || 'Помощь и руководство'}</h1>
            <p className="text-sm text-theme-muted mt-0.5">{help.subtitle || 'Всё, что нужно знать о Luna'}</p>
          </div>
        </div>
      </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

          {/* Quick Start / Navigation */}
          <motion.div variants={itemVariants}>
            <Card variant="glass">
              <div className="flex items-center gap-2 mb-5">
                <Home className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-theme-primary">Навигация по страницам</h2>
              </div>
              <p className="text-xs text-theme-muted mb-5">Краткое описание всех страниц приложения и когда их использовать</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pagesNav.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div key={p.key} className="flex gap-3 p-3 rounded-theme-md border border-theme bg-theme-card/40">
                      <div className="p-2 rounded-theme-sm bg-gradient-accent shrink-0 self-start">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-theme-primary">{nav[p.key] || p.key}</p>
                        <p className="text-xs text-theme-secondary mt-0.5">{p.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Cycle Phases */}
          <motion.div variants={itemVariants}>
            <Card variant="glass">
              <div className="flex items-center gap-2 mb-5">
                <Moon className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-theme-primary">{help.phasesTitle || 'Фазы цикла'}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {phases.map((p) => {
                  const Icon = p.icon;
                  const phaseKey = p.key as 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
                  const label = t.common[`phase${phaseKey.charAt(0).toUpperCase() + phaseKey.slice(1)}`] || p.key;
                  const desc = t.dashboard[`phaseDesc${phaseKey.charAt(0).toUpperCase() + phaseKey.slice(1)}`] || '';
                  return (
                    <div
                      key={p.key}
                      className="p-4 rounded-theme-lg bg-gradient-to-br border border-theme/50"
                      style={{ borderColor: p.color + '40', backgroundImage: `linear-gradient(to bottom right, ${p.color}08, transparent)` }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-5 h-5" style={{ color: p.color }} />
                        <span className="font-semibold text-sm text-theme-primary">{label as string}</span>
                      </div>
                      <p className="text-xs text-theme-secondary">{desc as string}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Phase Hub */}
          <motion.div variants={itemVariants}>
            <Card variant="glass">
              <div className="flex items-center gap-2 mb-5">
                <Activity className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-theme-primary">{help.phaseHubTitle || 'Гид по фазам'}</h2>
              </div>
              <p className="text-xs text-theme-muted mb-5">{help.phaseHubDesc || 'Персональный гид по фазам цикла — что происходит в вашем теле прямо сейчас'}</p>

              <div className="mb-5 p-4 rounded-theme-lg border-2 relative overflow-hidden"
                style={{
                  borderColor: `var(--phase-${'menstrual'})`,
                  background: `linear-gradient(135deg, var(--phase-${'menstrual'})15, transparent)`,
                }}
              >
                <div className="absolute top-2 right-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full"
                    style={{ background: `var(--phase-${'menstrual'})`, color: '#fff' }}
                  >
                    {t.common.phaseMenstrual || 'Менструация'}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-theme-muted font-medium">{t.common.current || 'Текущая фаза'}</span>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-theme-secondary leading-relaxed">{gt(phaseDetails.menstrual?.body || {})}</p>
                  <div className="flex items-start gap-2 text-xs text-theme-primary">
                    <Heart className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                    <span>{gt(phaseDetails.menstrual?.selfCare || {})}</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-theme-muted italic">
                    <span className="text-accent shrink-0">💡</span>
                    <span>{gt(phaseDetails.menstrual?.tip || {})}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {phases.map((p) => {
                  const Icon = p.icon;
                  const phaseKey = p.key as 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
                  const label = t.common[`phase${phaseKey.charAt(0).toUpperCase() + phaseKey.slice(1)}`] || p.key;
                  const isCurrent = false;
                  return (
                    <details key={p.key} className={`group rounded-theme-md border overflow-hidden ${isCurrent ? 'border-accent/50' : 'border-theme'}`}>
                      <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer text-sm font-medium text-theme-primary hover:bg-theme-card-hover/30 transition-colors">
                        <Icon className="w-4 h-4 shrink-0" style={{ color: p.color }} />
                        <span className="flex-1">{label as string}</span>
                        <span className="text-[10px] text-theme-muted">{isCurrent ? '●' : ''}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-theme-muted transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="px-4 pb-4 space-y-2 text-xs text-theme-secondary leading-relaxed">
                        <p className="text-theme-primary font-medium">{t.common.whatHappens || 'Что происходит:'}</p>
                        <p>{gt(phaseDetails[phaseKey]?.body || {})}</p>
                        <p className="text-theme-primary font-medium mt-2">{t.common.selfCare || 'Забота о себе:'}</p>
                        <p>{gt(phaseDetails[phaseKey]?.selfCare || {})}</p>
                        <p className="text-theme-primary font-medium mt-2">{t.common.tip || 'Совет:'}</p>
                        <p className="italic">{gt(phaseDetails[phaseKey]?.tip || {})}</p>
                      </div>
                    </details>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Mood Scale */}
          <motion.div variants={itemVariants}>
            <Card variant="glass">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-theme-primary">{help.moodTitle || 'Шкала настроения'}</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {moodLevels.map((m) => (
                  <div key={m.value} className="flex items-center gap-2 px-4 py-2 rounded-theme-md border border-theme bg-theme-card/50">
                    <span className="text-xl">{m.emoji}</span>
                    <div>
                      <span className="text-sm font-medium text-theme-primary">{m.value}</span>
                      <div className="w-8 h-1.5 rounded-full mt-1" style={{ background: m.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Pain Scale */}
          <motion.div variants={itemVariants}>
            <Card variant="glass">
              <div className="flex items-center gap-2 mb-4">
                <Thermometer className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-theme-primary">{help.painTitle || 'Шкала боли'}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((v) => (
                  <div key={v} className="flex items-center gap-2 px-3 py-2 rounded-theme-md border border-theme bg-theme-card/50">
                    {Array.from({ length: v }).map((_, i) => (
                      <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: `var(--mood-${v})`, opacity: 0.4 + i * 0.15 }} />
                    ))}
                    <span className="text-xs font-medium text-theme-muted ml-1">{v}/5</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Flow Levels */}
          <motion.div variants={itemVariants}>
            <Card variant="glass">
              <div className="flex items-center gap-2 mb-4">
                <Droplets className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-theme-primary">{help.flowTitle || 'Уровень выделений'}</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {flowLevels.map((f) => (
                  <div key={f.value} className="flex items-center gap-2 px-4 py-2 rounded-theme-md border border-theme bg-theme-card/50">
                    <span className="text-sm font-mono text-accent">{f.icon}</span>
                    <span className="text-sm text-theme-primary">{f.label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Symptoms */}
          <motion.div variants={itemVariants}>
            <Card variant="glass">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-theme-primary">{help.symptomsTitle || 'Симптомы'}</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {symptomsList.map((s) => (
                  <div key={s.key} className="flex items-center gap-2 px-3 py-2 rounded-theme-md border border-theme bg-theme-card/50">
                  <span className="text-base">{s.icon}</span>
                    <span className="text-xs text-theme-primary">{(t.diary.symptoms_list)[s.key] || s.key}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Symptom Guide */}
          <motion.div variants={itemVariants}>
            <Card variant="glass">
              <div className="flex items-center gap-2 mb-5">
                <Info className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-theme-primary">{help.symptomGuideTitle || 'Гид по симптомам'}</h2>
              </div>
              <p className="text-xs text-theme-muted mb-5">{help.symptomGuideDesc || 'Подробная информация о каждом отслеживаемом симптоме'}</p>
              <div className="space-y-2">
                {symptomsList.map((s) => {
                  const label = (t.diary.symptoms_list)[s.key] || s.key;
                  const detail = symptomDetails[s.key];
                  if (!detail) return null;
                  return (
                    <details key={s.key} className="group rounded-theme-md border border-theme bg-theme-card/30 overflow-hidden">
                      <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer text-sm font-medium text-theme-primary hover:bg-theme-card-hover/30 transition-colors">
                        <span className="text-base shrink-0">{s.icon}</span>
                        <span className="flex-1">{label}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-theme-muted transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="px-4 pb-3 text-xs text-theme-secondary leading-relaxed">{gt(detail)}</div>
                    </details>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* PMDD */}
          <motion.div variants={itemVariants}>
            <Card variant="glass">
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-theme-primary">ПМДР (PMDD)</h2>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-theme-md border border-red-200/30 bg-red-50/10">
                  <p className="text-sm text-theme-secondary leading-relaxed">
                    ПМДР (предменструальное дисфорическое расстройство) — это тяжёлая форма ПМС, затрагивающая 3–8% женщин. 
                    Симптомы появляются в лютеиновой фазе и значительно ухудшают качество жизни. В отличие от ПМС, ПМДР 
                    характеризуется выраженными эмоциональными симптомами: сильная раздражительность, депрессия, тревожность, 
                    гнев и чувство безнадёжности. Симптомы исчезают с началом менструации.
                  </p>
                </div>

                <div className="text-xs text-theme-muted mb-2">7 основных симптомов ПМДР:</div>
                <div className="space-y-2">
                  {pmddSymptoms.map((s) => {
                    const label = (t.diary.pmdd_list)?.[s.key] || s.key;
                    return (
                      <details key={s.key} className="group rounded-theme-md border border-theme bg-theme-card/30 overflow-hidden">
                        <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer text-sm font-medium text-theme-primary hover:bg-theme-card-hover/30 transition-colors">
                          <span className="text-base shrink-0">🔴</span>
                          <span className="flex-1">{label}</span>
                          <ChevronDown className="w-3.5 h-3.5 text-theme-muted transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="px-4 pb-3 text-xs text-theme-secondary leading-relaxed">{s.desc}</div>
                      </details>
                    );
                  })}
                </div>

                <div className="p-4 rounded-theme-md bg-amber-50/10 border border-amber-200/30 mt-4">
                  <p className="text-sm font-medium text-theme-primary mb-1">Когда обратиться к врачу</p>
                  <p className="text-xs text-theme-secondary leading-relaxed">
                    Если симптомы серьёзно нарушают вашу повседневную жизнь — работу, отношения, сон — обратитесь к гинекологу 
                    или психиатру. ПМДР поддаётся лечению: КПТ, антидепрессанты (СИОЗС), гормональная терапия, изменения образа жизни.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-theme-md border border-rose-200/30 bg-rose-50/10">
                  <p className="text-xs font-medium text-theme-primary mb-1">ПМС (PMS)</p>
                  <ul className="text-[11px] text-theme-secondary space-y-1">
                    <li>• До 75% женщин репродуктивного возраста</li>
                    <li>• Умеренные физические и эмоциональные симптомы</li>
                    <li>• Симптомы доставляют дискомфорт, но не нарушают жизнь</li>
                    </ul>
                  </div>
                <div className="p-3 rounded-theme-md border border-red-200/30 bg-red-50/10">
                  <p className="text-xs font-medium text-theme-primary mb-1">ПМДР (PMDD)</p>
                  <ul className="text-[11px] text-theme-secondary space-y-1">
                    <li>• 3–8% женщин репродуктивного возраста</li>
                    <li>• Тяжёлые эмоциональные симптомы</li>
                    <li>• Серьёзно нарушает качество жизни</li>
                    <li>• Требует профессиональной помощи</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Hormones */}
          <motion.div variants={itemVariants}>
            <Card variant="glass">
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-theme-primary">Гормональный фон</h2>
              </div>
              <p className="text-xs text-theme-muted mb-4">Как ключевые гормоны влияют на ваш цикл и самочувствие</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hormones.map((h) => (
                  <div key={h.key} className="p-3 rounded-theme-md border border-theme bg-theme-card/40">
                    <p className="text-sm font-medium text-theme-primary">{h.name}</p>
                    <p className="text-xs text-theme-secondary mt-1 leading-relaxed">{h.role}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Nutrition by Phase */}
          <motion.div variants={itemVariants}>
            <Card variant="glass">
              <div className="flex items-center gap-2 mb-4">
                <Pill className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-theme-primary">Питание по фазам</h2>
              </div>
              <p className="text-xs text-theme-muted mb-4">Что есть и чего избегать в каждой фазе цикла</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nutritionByPhase.map((n) => {
                  const phaseLabel = t.common[`phase${n.phase.charAt(0).toUpperCase() + n.phase.slice(1)}`] || n.phase;
                  const pColor = phases.find((p) => p.key === n.phase)?.color || 'var(--accent)';
                  return (
                    <div key={n.phase} className="p-3 rounded-theme-md border" style={{ borderColor: `${pColor}40`, background: `linear-gradient(135deg, ${pColor}08, transparent)` }}>
                      <p className="text-sm font-medium text-theme-primary mb-1" style={{ color: pColor }}>{phaseLabel}</p>
                      <div className="space-y-1 text-xs">
                        <p><span className="font-medium text-green-600">Рекомендуется:</span> {n.foods}</p>
                        <p><span className="font-medium text-red-500">Избегать:</span> {n.avoid}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Exercise & Activity */}
          <motion.div variants={itemVariants}>
            <Card variant="glass">
              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-theme-primary">Упражнения и активность</h2>
              </div>
              <p className="text-xs text-theme-muted mb-4">Рекомендованные виды физической активности для каждой фазы</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {exerciseByPhase.map((e) => {
                  const phaseKey = e.phase as 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
                  const label = t.common[`phase${phaseKey.charAt(0).toUpperCase() + phaseKey.slice(1)}`] || e.phase;
                  const pColor = phases.find((p) => p.key === e.phase)?.color || 'var(--accent)';
                  return (
                    <div key={e.phase} className="p-3 rounded-theme-md border" style={{ borderColor: `${pColor}40`, background: `linear-gradient(135deg, ${pColor}08, transparent)` }}>
                      <p className="text-sm font-medium text-theme-primary mb-1" style={{ color: pColor }}>{label}</p>
                      <p className="text-xs text-theme-secondary leading-relaxed">{e.activities}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Sleep, Water, BBT */}
          <motion.div variants={itemVariants}>
            <Card variant="glass">
              <div className="flex items-center gap-2 mb-4">
                <MoonIcon className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-theme-primary">Сон, вода и базальная температура</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-theme-md border border-theme bg-theme-card/40">
                  <div className="flex items-center gap-2 mb-2">
                    <MoonIcon className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-medium text-theme-primary">Сон</span>
                  </div>
                  <p className="text-xs text-theme-secondary leading-relaxed">
                    Недостаток сна повышает кортизол, что может нарушать овуляцию и усиливать ПМС. 
                    Рекомендуется 7–9 часов сна. В лютеиновой фазе качество сна может ухудшаться из-за повышения прогестерона.
                  </p>
                </div>
                <div className="p-3 rounded-theme-md border border-theme bg-theme-card/40">
                  <div className="flex items-center gap-2 mb-2">
                    <DropletIcon className="w-4 h-4 text-sky-400" />
                    <span className="text-sm font-medium text-theme-primary">Вода</span>
                  </div>
                  <p className="text-xs text-theme-secondary leading-relaxed">
                    Рекомендуется 1.5–2 литра воды в день. Во время менструации увеличивайте потребление воды 
                    для компенсации потери жидкости. Хорошая гидратация уменьшает вздутие и усталость.
                  </p>
                </div>
                <div className="p-3 rounded-theme-md border border-theme bg-theme-card/40">
                  <div className="flex items-center gap-2 mb-2">
                    <ThermometerIcon className="w-4 h-4 text-rose-400" />
                    <span className="text-sm font-medium text-theme-primary">БТ (базальная температура)</span>
                  </div>
                  <p className="text-xs text-theme-secondary leading-relaxed">
                    Норма: 36.0–36.5°C (до овуляции), 36.5–37.0°C (после овуляции). 
                    Измеряйте сразу после пробуждения, не вставая с кровати. Повышение БТ подтверждает овуляцию.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Calendar Legend */}
          <motion.div variants={itemVariants}>
            <Card variant="glass">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-theme-primary">{help.calendarTitle || 'Легенда календаря'}</h2>
              </div>
              <div className="flex flex-wrap gap-4">
                {[
                  { color: '#fca5a5', label: 'День менструации' },
                  { color: 'var(--accent)', label: 'Есть запись в дневнике' },
                  { color: 'transparent', label: 'Сегодня', border: 'var(--accent)' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm border" style={{ background: item.color, borderColor: item.border || item.color }} />
                    <span className="text-xs text-theme-secondary">{item.label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Themes */}
          <motion.div variants={itemVariants}>
            <Card variant="glass">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-theme-primary">{help.themesTitle || 'Темы оформления'}</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {themes.map((th) => (
                  <div key={th.key} className="p-3 rounded-theme-md border border-theme bg-theme-card/50">
                    <div className="flex gap-1 mb-2">
                      {th.colors.map((c, i) => (
                        <div key={i} className="flex-1 h-8 rounded-theme-sm" style={{ background: c }} />
                      ))}
                    </div>
                    <p className="text-xs font-medium text-theme-primary capitalize">{t.settings[th.key] || th.key}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* FAQ */}
          <motion.div variants={itemVariants}>
            <Card variant="glass">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-theme-primary">{help.faqTitle || 'Часто задаваемые вопросы'}</h2>
              </div>
              <div className="space-y-2">
                {faqItems.map((faq, i) => (
                  <details key={i} className="group rounded-theme-md border border-theme bg-theme-card/30 overflow-hidden">
                    <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-medium text-theme-primary hover:bg-theme-card-hover/30 transition-colors">
                      {faq.q}
                      <ChevronDown className="w-4 h-4 text-theme-muted transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-4 pb-3 text-xs text-theme-secondary leading-relaxed">{faq.a}</div>
                  </details>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Data & Privacy */}
          <motion.div variants={itemVariants}>
            <Card variant="glass">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-theme-primary">Данные и конфиденциальность</h2>
              </div>
              <div className="space-y-3 text-xs text-theme-secondary leading-relaxed">
                <div className="p-3 rounded-theme-md bg-green-50/10 border border-green-200/30">
                  <p className="text-sm font-medium text-theme-primary mb-1">Локальное хранение</p>
                  <p>Все основные данные хранятся в localStorage вашего браузера. Данные не покидают ваше устройство, 
                  если вы не включите облачную синхронизацию.</p>
                </div>
                <div className="p-3 rounded-theme-md bg-blue-50/10 border border-blue-200/30">
                  <p className="text-sm font-medium text-theme-primary mb-1">Облачная синхронизация (Supabase)</p>
                  <p>При регистрации аккаунта данные синхронизируются с Supabase — безопасной базой данных с 
                  шифрованием при передаче (TLS) и хранении. Вы можете отключить синхронизацию в любой момент.</p>
                </div>
                <div className="p-3 rounded-theme-md bg-purple-50/10 border border-purple-200/30">
                  <p className="text-sm font-medium text-theme-primary mb-1">GDPR</p>
                  <p>Luna соблюдает требования GDPR. Вы имеете право: получить копию своих данных, удалить свои данные, 
                  отозвать согласие на обработку. Для запроса напишите на почту поддержки.</p>
                </div>
                <div className="p-3 rounded-theme-md bg-amber-50/10 border border-amber-200/30">
                  <p className="text-sm font-medium text-theme-primary mb-1">Безопасность</p>
                  <p>Мы не собираем аналитику, не передаём данные третьим лицам, не используем рекламные трекеры. 
                  Все данные принадлежат только вам.</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* About */}
          <motion.div variants={itemVariants}>
            <Card variant="glass">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-theme-primary">{help.aboutTitle || 'О приложении'}</h2>
              </div>
              <div className="space-y-1 text-sm text-theme-secondary">
                <p><span className="font-medium text-theme-primary">Luna</span> — {help.aboutDesc || 'Красивое приложение для отслеживания менструального цикла'}</p>
                <p>{help.version || 'Версия'}: 2.0</p>
                <p>{help.tech || 'Стек технологий'}: Next.js 16, React 19, Zustand, Framer Motion, Tailwind CSS v4, Recharts, date-fns</p>
                <p>{help.dataStorage || 'Хранение данных'}: {help.localStorage || 'localStorage + Supabase Cloud'}</p>
                <p>{help.languages || 'Языки'}: 10 {help.languagesSupported || 'поддерживаемых языков'}</p>
              </div>
            </Card>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}