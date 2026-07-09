'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useSettingsStore } from '@/lib/store/settingsStore';

interface QuoteData {
  text: Partial<Record<string, string>>;
  author: string;
}

const quotes: QuoteData[] = [
  {
    text: { en: 'Your body is not a book to be read by someone else\'s rules.', ru: 'Твоё тело — не книга, которую нужно читать по чужим правилам.', de: 'Dein Körper ist kein Buch, das nach den Regeln anderer gelesen wird.', fr: 'Ton corps n\'est pas un livre à lire selon les règles des autres.', es: 'Tu cuerpo no es un libro para ser leído por las reglas de otro.', it: 'Il tuo corpo non è un libro da leggere secondo le regole altrui.', pt: 'Seu corpo não é um livro para ser lido pelas regras dos outros.', zh: '你的身体不是一本需要按照别人规则来读的书。', ar: 'جسدك ليس كتابًا يُقرأ بقواعد الآخرين.' },
    author: 'Unknown',
  },
  {
    text: { en: 'The cycle is not weakness, it\'s the rhythm of your power.', ru: 'Цикл — это не слабость, это ритм твоей силы.', de: 'Der Zyklus ist keine Schwäche, sondern der Rhythmus deiner Stärke.', fr: 'Le cycle n\'est pas une faiblesse, c\'est le rythme de votre force.', es: 'El ciclo no es debilidad, es el ritmo de tu poder.', it: 'Il ciclo non è debolezza, è il ritmo del tuo potere.', pt: 'O ciclo não é fraqueza, é o ritmo do seu poder.', zh: '周期不是弱点，而是你力量的节奏。', ar: 'الدورة ليست ضعفًا، بل هي إيقاع قوتك.' },
    author: 'Unknown',
  },
  {
    text: { en: 'Listen to your body. It speaks to you in the language of cycles.', ru: 'Слушай своё тело. Оно говорит с тобой на языке циклов.', de: 'Hör auf deinen Körper. Er spricht zu dir in der Sprache der Zyklen.', fr: 'Écoutez votre corps. Il vous parle dans le langage des cycles.', es: 'Escucha a tu cuerpo. Te habla en el lenguaje de los ciclos.', it: 'Ascolta il tuo corpo. Ti parla nel linguaggio dei cicli.', pt: 'Ouça seu corpo. Ele fala com você na linguagem dos ciclos.', zh: '倾听你的身体。它用周期的语言与你对话。', ar: 'استمعي إلى جسدك. إنه يتحدث إليك بلغة الدورات.' },
    author: 'Unknown',
  },
  {
    text: { en: 'Every phase is a new chapter of your story.', ru: 'Каждая фаза — это новая глава твоей истории.', de: 'Jede Phase ist ein neues Kapitel deiner Geschichte.', fr: 'Chaque phase est un nouveau chapitre de votre histoire.', es: 'Cada fase es un nuevo capítulo de tu historia.', it: 'Ogni fase è un nuovo capitolo della tua storia.', pt: 'Cada fase é um novo capítulo da sua história.', zh: '每个阶段都是你故事的新篇章。', ar: 'كل مرحلة هي فصل جديد من قصتك.' },
    author: 'Unknown',
  },
  {
    text: { en: 'You don\'t have to be productive every day. Rest is also action.', ru: 'Ты не обязана быть продуктивной каждый день. Отдых — тоже действие.', de: 'Du musst nicht jeden Tag produktiv sein. Ruhe ist auch Handeln.', fr: 'Vous n\'avez pas à être productive chaque jour. Le repos est aussi une action.', es: 'No tienes que ser productiva todos los días. Descansar también es acción.', it: 'Non devi essere produttiva ogni giorno. Riposare è anche agire.', pt: 'Você não precisa ser produtiva todos os dias. Descansar também é ação.', zh: '你不必每天都高效。休息也是一种行动。', ar: 'ليس عليكِ أن تكوني منتجة كل يوم. الراحة هي أيضًا عمل.' },
    author: 'Unknown',
  },
  {
    text: { en: 'Knowing your cycle means knowing yourself.', ru: 'Знать свой цикл — значит знать себя.', de: 'Seinen Zyklus zu kennen bedeutet, sich selbst zu kennen.', fr: 'Connaître son cycle, c\'est se connaître soi-même.', es: 'Conocer tu ciclo significa conocerte a ti misma.', it: 'Conoscere il proprio ciclo significa conoscere se stesse.', pt: 'Conhecer seu ciclo significa conhecer a si mesma.', zh: '了解你的周期就是了解你自己。', ar: 'معرفة دورتك تعني معرفة نفسك.' },
    author: 'Unknown',
  },
  {
    text: { en: 'Nature does not hurry, yet everything is accomplished.', ru: 'Природа не торопится, но всё успевает.', de: 'Die Natur beeilt sich nicht, und doch ist alles vollbracht.', fr: 'La nature ne se presse pas, et pourtant tout est accompli.', es: 'La naturaleza no se apresura, y sin embargo todo se logra.', it: 'La natura non si affretta, eppure tutto è compiuto.', pt: 'A natureza não se apressa, e ainda assim tudo é realizado.', zh: '自然不匆忙，却成就一切。', ar: 'الطبيعة لا تتعجل، ومع ذلك يتحقق كل شيء.' },
    author: 'Lao Tzu',
  },
  {
    text: { en: 'Within you is a silence and a sanctuary to which you can return at any time.', ru: 'Внутри тебя есть тишина, и убежище, куда ты можешь вернуться в любой момент.', de: 'In dir ist eine Stille und ein Zufluchtsort, zu dem du jederzeit zurückkehren kannst.', fr: 'En vous se trouve un silence et un sanctuaire où vous pouvez retourner à tout moment.', es: 'Dentro de ti hay un silencio y un santuario al que puedes regresar en cualquier momento.', it: 'Dentro di te c\'è un silenzio e un rifugio a cui puoi tornare in qualsiasi momento.', pt: 'Dentro de você há um silêncio e um santuário ao qual pode retornar a qualquer momento.', zh: '你内心有一片寂静和庇护所，随时可以回归。', ar: 'بداخلك صمت وملاذ يمكنك العودة إليه في أي وقت.' },
    author: 'Hermann Hesse',
  },
  {
    text: { en: 'The body remembers everything. Give it time to speak.', ru: 'Тело помнит всё. Дайте ему время рассказать.', de: 'Der Körper erinnert sich an alles. Gib ihm Zeit zu sprechen.', fr: 'Le corps se souvient de tout. Donnez-lui le temps de parler.', es: 'El cuerpo lo recuerda todo. Dale tiempo para hablar.', it: 'Il corpo ricorda tutto. Dagli il tempo di parlare.', pt: 'O corpo lembra de tudo. Dê a ele tempo para falar.', zh: '身体记得一切。给它时间表达。', ar: 'الجسد يتذكر كل شيء. أعطه وقتًا ليتحدث.' },
    author: 'Unknown',
  },
  {
    text: { en: 'Being a woman is not a role, it\'s a power.', ru: 'Быть женщиной — не роль, а сила.', de: 'Eine Frau zu sein ist keine Rolle, es ist eine Stärke.', fr: 'Être une femme n\'est pas un rôle, c\'est une force.', es: 'Ser mujer no es un rol, es un poder.', it: 'Essere donna non è un ruolo, è un potere.', pt: 'Ser mulher não é um papel, é um poder.', zh: '做女人不是一种角色，而是一种力量。', ar: 'أن تكوني امرأة ليس دورًا، بل قوة.' },
    author: 'Unknown',
  },
  {
    text: { en: 'Every cycle is a chance to begin again.', ru: 'Каждый цикл — это возможность начать заново.', de: 'Jeder Zyklus ist eine Chance, neu zu beginnen.', fr: 'Chaque cycle est une chance de recommencer.', es: 'Cada ciclo es una oportunidad para empezar de nuevo.', it: 'Ogni ciclo è un\'opportunità per ricominciare.', pt: 'Cada ciclo é uma chance de recomeçar.', zh: '每个周期都是重新开始的机会。', ar: 'كل دورة هي فرصة للبدء من جديد.' },
    author: 'Unknown',
  },
  {
    text: { en: 'Gentleness is also a form of strength.', ru: 'Нежность — это тоже вид силы.', de: 'Sanftheit ist auch eine Form von Stärke.', fr: 'La douceur est aussi une forme de force.', es: 'La ternura también es una forma de fuerza.', it: 'La dolcezza è anche una forma di forza.', pt: 'A delicadeza também é uma forma de força.', zh: '温柔也是一种力量。', ar: 'اللطف هو أيضًا شكل من أشكال القوة.' },
    author: 'Unknown',
  },
  {
    text: { en: 'Your body knows the way. Trust it.', ru: 'Твоё тело знает путь. Доверься ему.', de: 'Dein Körper kennt den Weg. Vertraue ihm.', fr: 'Votre corps connaît le chemin. Faites-lui confiance.', es: 'Tu cuerpo conoce el camino. Confía en él.', it: 'Il tuo corpo conosce la strada. Fidati.', pt: 'Seu corpo conhece o caminho. Confie nele.', zh: '你的身体知道路。相信它。', ar: 'جسدك يعرف الطريق. ثقي به.' },
    author: 'Unknown',
  },
  {
    text: { en: 'Hormones are not enemies, they\'re your inner orchestra.', ru: 'Гормоны — это не враги, это твой внутренний оркестр.', de: 'Hormone sind keine Feinde, sie sind dein inneres Orchester.', fr: 'Les hormones ne sont pas des ennemies, elles sont votre orchestre intérieur.', es: 'Las hormonas no son enemigas, son tu orquesta interior.', it: 'Gli ormoni non sono nemici, sono la tua orchestra interiore.', pt: 'Os hormônios não são inimigos, são sua orquestra interior.', zh: '激素不是敌人，它们是你内心的交响乐团。', ar: 'الهرمونات ليست أعداء، بل هي أوركسترا الداخلية.' },
    author: 'Unknown',
  },
  {
    text: { en: 'The bravest thing is to be yourself in a world that wants to make you someone else.', ru: 'Самая смелая вещь — быть собой в мире, который хочет сделать тебя кем-то другим.', de: 'Das Mutigste ist, du selbst zu sein in einer Welt, die dich zu jemand anderem machen will.', fr: 'La chose la plus courageuse est d\'être vous-même dans un monde qui veut faire de vous quelqu\'un d\'autre.', es: 'Lo más valiente es ser tú misma en un mundo que quiere hacerte alguien más.', it: 'La cosa più coraggiosa è essere te stessa in un mondo che vuole farti diventare qualcun\'altra.', pt: 'A coisa mais corajosa é ser você mesma em um mundo que quer fazer de você outra pessoa.', zh: '最勇敢的事是在一个想把你变成别人的世界里做自己。', ar: 'أشجع شيء هو أن تكوني نفسك في عالم يريد أن يجعلك شخصًا آخر.' },
    author: 'Unknown',
  },
  {
    text: { en: 'Wounds are places where the light enters you.', ru: 'Раны — это места, куда входит свет.', de: 'Wunden sind die Stellen, durch die das Licht in dich eindringt.', fr: 'Les blessures sont les endroits par lesquels la lumière entre en vous.', es: 'Las heridas son los lugares por donde entra la luz.', it: 'Le ferite sono i luoghi da cui la luce entra in te.', pt: 'As feridas são lugares por onde a luz entra em você.', zh: '伤口是光进入你内心的入口。', ar: 'الجروح هي الأماكن التي يدخل منها النور إليك.' },
    author: 'Rumi',
  },
  {
    text: { en: 'Don\'t rush. Everything you need is already within you.', ru: 'Не спеши. Всё, что тебе нужно, уже есть внутри.', de: 'Beeile dich nicht. Alles, was du brauchst, ist bereits in dir.', fr: 'Ne vous précipitez pas. Tout ce dont vous avez besoin est déjà en vous.', es: 'No te apresures. Todo lo que necesitas ya está dentro de ti.', it: 'Non avere fretta. Tutto ciò di cui hai bisogno è già dentro di te.', pt: 'Não se apresse. Tudo que você precisa já está dentro de você.', zh: '不要着急。你需要的一切都已经在你内心。', ar: 'لا تتعجلي. كل ما تحتاجينه موجود بالفعل بداخلك.' },
    author: 'Unknown',
  },
  {
    text: { en: 'She remembered who she was and the game changed.', ru: 'Она вспомнила, кто она, и игра изменилась.', de: 'Sie erinnerte sich, wer sie war, und das Spiel änderte sich.', fr: 'Elle s\'est souvenue qui elle était et le jeu a changé.', es: 'Ella recordó quién era y el juego cambió.', it: 'Si è ricordata chi era e il gioco è cambiato.', pt: 'Ela lembrou quem era e o jogo mudou.', zh: '她记起了自己是谁，游戏规则就此改变。', ar: 'تذكرت من تكون وتغيرت اللعبة.' },
    author: 'Lalah Delia',
  },
  {
    text: { en: 'You are the author of your own story. Write yourself well.', ru: 'Ты автор своей собственной истории. Напиши себя хорошо.', de: 'Du bist der Autor deiner eigenen Geschichte. Schreib dich gut.', fr: 'Vous êtes l\'auteur de votre propre histoire. Écrivez-vous bien.', es: 'Eres la autora de tu propia historia. Escríbete bien.', it: 'Sei l\'autrice della tua storia. Scriviti bene.', pt: 'Você é a autora da sua própria história. Escreva-se bem.', zh: '你是自己故事的作者。好好书写自己。', ar: 'أنتِ مؤلفة قصتكِ الخاصة. اكتبي نفسكِ جيدًا.' },
    author: 'Unknown',
  },
  {
    text: { en: 'Fall in love with taking care of yourself.', ru: 'Влюбись в заботу о себе.', de: 'Verliebe dich in die Fürsorge für dich selbst.', fr: 'Tombez amoureuse de prendre soin de vous.', es: 'Enamórate de cuidarte a ti misma.', it: 'Innamorati di prenderti cura di te stessa.', pt: 'Apaixone-se por cuidar de si mesma.', zh: '爱上照顾自己。', ar: 'أوقعي في حب العناية بنفسك.' },
    author: 'Unknown',
  },
  {
    text: { en: 'Your blood is the tide that moves the moon within you.', ru: 'Твоя кровь — это прилив, который движет луну внутри тебя.', de: 'Dein Blut ist die Flut, die den Mond in dir bewegt.', fr: 'Votre sang est la marée qui fait bouger la lune en vous.', es: 'Tu sangre es la marea que mueve la luna dentro de ti.', it: 'Il tuo sangue è la marea che muove la luna dentro di te.', pt: 'Seu sangue é a maré que move a lua dentro de você.', zh: '你的血液是推动你内心月亮的潮汐。', ar: 'دمك هو المد الذي يحرك القمر بداخلك.' },
    author: 'Unknown',
  },
  {
    text: { en: 'Resting is not a reward for being productive. It is a basic need.', ru: 'Отдых — это не награда за продуктивность. Это базовая потребность.', de: 'Ruhe ist keine Belohnung für Produktivität. Sie ist ein Grundbedürfnis.', fr: 'Se reposer n\'est pas une récompense pour être productive. C\'est un besoin fondamental.', es: 'Descansar no es una recompensa por ser productiva. Es una necesidad básica.', it: 'Riposare non è una ricompensa per essere produttive. È un bisogno fondamentale.', pt: 'Descansar não é uma recompensa por ser produtiva. É uma necessidade básica.', zh: '休息不是对高效率的奖励。而是一种基本需求。', ar: 'الراحة ليست مكافأة على الإنتاجية. إنها حاجة أساسية.' },
    author: 'Unknown',
  },
  {
    text: { en: 'The moon does not fight. It does not attack. It only moves. And the sea moves with it.', ru: 'Луна не сражается. Она не нападает. Она просто движется. И море движется за ней.', de: 'Der Mond kämpft nicht. Er greift nicht an. Er bewegt sich nur. Und das Meer bewegt sich mit ihm.', fr: 'La lune ne se bat pas. Elle n\'attaque pas. Elle bouge seulement. Et la mer se déplace avec elle.', es: 'La luna no lucha. No ataca. Solo se mueve. Y el mar se mueve con ella.', it: 'La luna non combatte. Non attacca. Si muove soltanto. E il mare si muove con lei.', pt: 'A lua não luta. Não ataca. Apenas se move. E o mar se move com ela.', zh: '月亮不战斗。不攻击。它只是移动。而大海随它而动。', ar: 'القمر لا يقاتل. لا يهاجم. إنه يتحرك فقط. والبحر يتحرك معه.' },
    author: 'Unknown',
  },
  {
    text: { en: 'A woman with a voice is, by definition, a strong woman.', ru: 'Женщина с голосом — по определению сильная женщина.', de: 'Eine Frau mit einer Stimme ist per Definition eine starke Frau.', fr: 'Une femme qui a une voix est, par définition, une femme forte.', es: 'Una mujer con voz es, por definición, una mujer fuerte.', it: 'Una donna con una voce è, per definizione, una donna forte.', pt: 'Uma mulher com voz é, por definição, uma mulher forte.', zh: '有声音的女性，本身就是强者。', ar: 'المرأة التي لها صوت هي، بحكم التعريف، امرأة قوية.' },
    author: 'Melinda Gates',
  },
  {
    text: { en: 'There is no force more powerful than a woman determined to rise.', ru: 'Нет силы более могущественной, чем женщина, решившая подняться.', de: 'Es gibt keine mächtigere Kraft als eine Frau, die entschlossen ist, aufzustehen.', fr: 'Il n\'y a pas de force plus puissante qu\'une femme déterminée à s\'élever.', es: 'No hay fuerza más poderosa que una mujer decidida a levantarse.', it: 'Non c\'è forza più potente di una donna determinata a rialzarsi.', pt: 'Não há força mais poderosa do que uma mulher determinada a se levantar.', zh: '没有什么力量比一个决心崛起的女性更强大。', ar: 'لا توجد قوة أقوى من امرأة عازمة على النهوض.' },
    author: 'W.E.B. Du Bois',
  },
  {
    text: { en: 'She let go of who she was supposed to be and embraced who she is.', ru: 'Она отпустила ту, кем должна была быть, и приняла ту, кто она есть.', de: 'Sie ließ los, wer sie sein sollte, und umarmte, wer sie ist.', fr: 'Elle a lâché prise sur qui elle était censée être et a embrassé qui elle est.', es: 'Ella soltó a quien se suponía que debía ser y abrazó a quien es.', it: 'Ha lasciato andare chi avrebbe dovuto essere e ha abbracciato chi è.', pt: 'Ela soltou quem deveria ser e abraçou quem é.', zh: '她放下了应该成为的样子，拥抱了真正的自己。', ar: 'تخلت عن من كان يُفترض أن تكون عليه واحتضنت من هي.' },
    author: 'Unknown',
  },
  {
    text: { en: 'Self-care is not selfish. You cannot serve from an empty vessel.', ru: 'Забота о себе — не эгоизм. Нельзя давать из пустого сосуда.', de: 'Selbstfürsorge ist nicht egoistisch. Du kannst nicht aus einem leeren Gefäß schöpfen.', fr: 'Prendre soin de soi n\'est pas égoïste. On ne peut pas servir à partir d\'un récipient vide.', es: 'El cuidado personal no es egoísmo. No puedes servir desde un recipiente vacío.', it: 'Prendersi cura di sé non è egoismo. Non puoi servire da un vaso vuoto.', pt: 'Cuidar de si mesma não é egoísmo. Você não pode servir de um recipiente vazio.', zh: '自我关怀不是自私。你无法从空杯中倒出东西。', ar: 'الاعتناء بالنفس ليس أنانية. لا يمكنك العطاء من وعاء فارغ.' },
    author: 'Eleanor Brown',
  },
  {
    text: { en: 'The most common way people give up their power is by thinking they don\'t have any.', ru: 'Самый распространённый способ отказаться от своей силы — думать, что у тебя её нет.', de: 'Die häufigste Art, seine Macht aufzugeben, ist zu denken, man hätte keine.', fr: 'La façon la plus courante dont les gens renoncent à leur pouvoir est de penser qu\'ils n\'en ont pas.', es: 'La forma más común en que la gente renuncia a su poder es pensando que no lo tiene.', it: 'Il modo più comune in cui le persone rinunciano al proprio potere è pensare di non averne.', pt: 'A maneira mais comum das pessoas desistirem do seu poder é pensando que não o têm.', zh: '人们放弃力量最常见的方式是认为自己没有力量。', ar: 'الطريقة الأكثر شيوعًا التي يتخلى بها الناس عن قوتهم هي الاعتقاد بأنهم لا يملكون أيًا منها.' },
    author: 'Alice Walker',
  },
  {
    text: { en: 'You carry the moon in your womb. You are made of ancient tides.', ru: 'Ты носишь луну в своей утробе. Ты создана из древних приливов.', de: 'Du trägst den Mond in deinem Schoß. Du bist aus alten Gezeiten gemacht.', fr: 'Vous portez la lune dans votre ventre. Vous êtes faite de marées anciennes.', es: 'Llevas la luna en tu vientre. Estás hecha de mareas antiguas.', it: 'Porti la luna nel tuo grembo. Sei fatta di maree antiche.', pt: 'Você carrega a lua em seu ventre. Você é feita de marés antigas.', zh: '你的子宫承载着月亮。你由古老的潮汐构成。', ar: 'تحملين القمر في رحمك. أنتِ مصنوعة من المد والجزر القديم.' },
    author: 'Unknown',
  },
  {
    text: { en: 'Your body is not broken. It is cycling. It is alive. It is wise.', ru: 'Твоё тело не сломано. Оно циклично. Оно живо. Оно мудро.', de: 'Dein Körper ist nicht kaputt. Er zyklisiert. Er lebt. Er ist weise.', fr: 'Votre corps n\'est pas cassé. Il cycle. Il est vivant. Il est sage.', es: 'Tu cuerpo no está roto. Está ciclando. Está vivo. Es sabio.', it: 'Il tuo corpo non è rotto. Sta ciclando. È vivo. È saggio.', pt: 'Seu corpo não está quebrado. Está ciclando. Está vivo. É sábio.', zh: '你的身体没有坏。它在循环。它有生命。它充满智慧。', ar: 'جسدك ليس مكسورًا. إنه يدور. إنه حي. إنه حكيم.' },
    author: 'Unknown',
  },
  {
    text: { en: 'Your menstrual cycle is your fifth vital sign.', ru: 'Твой менструальный цикл — пятый показатель жизнедеятельности.', de: 'Dein Menstruationszyklus ist dein fünftes Lebenszeichen.', fr: 'Votre cycle menstruel est votre cinquième signe vital.', es: 'Tu ciclo menstrual es tu quinto signo vital.', it: 'Il tuo ciclo mestruale è il tuo quinto segno vitale.', pt: 'Seu ciclo menstrual é o seu quinto sinal vital.', zh: '你的月经周期是第五个生命体征。', ar: 'دورتك الشهرية هي علامتك الحيوية الخامسة.' },
    author: 'Unknown',
  },
  {
    text: { en: 'She thrives in her own rhythm, danced by a different drummer.', ru: 'Она процветает в своём ритме, танцуя под другого барабанщика.', de: 'Sie gedeiht in ihrem eigenen Rhythmus, getanzt von einem anderen Trommler.', fr: 'Elle prospère à son propre rythme, dansé par un batteur différent.', es: 'Ella prospera en su propio ritmo, bailado por un baterista diferente.', it: 'Lei prospera nel proprio ritmo, danzato da un batterista diverso.', pt: 'Ela prospera em seu próprio ritmo, dançado por um baterista diferente.', zh: '她按照自己的节奏茁壮成长，跟随不同的鼓点起舞。', ar: 'تزدهر في إيقاعها الخاص، ترقص على طبول مختلفة.' },
    author: 'Henry David Thoreau',
  },
  {
    text: { en: 'You are not at the mercy of your hormones. You are in conversation with them.', ru: 'Ты не во власти своих гормонов. Ты ведёшь с ними диалог.', de: 'Du bist nicht deinen Hormonen ausgeliefert. Du führst ein Gespräch mit ihnen.', fr: 'Vous n\'êtes pas à la merci de vos hormones. Vous êtes en conversation avec elles.', es: 'No estás a merced de tus hormonas. Estás en conversación con ellas.', it: 'Non sei in balia dei tuoi ormoni. Sei in conversazione con loro.', pt: 'Você não está à mercê dos seus hormônios. Você está em conversa com eles.', zh: '你并非受制于激素。你在与它们对话。', ar: 'أنتِ لستِ تحت رحمة هرموناتك. أنتِ في حوار معها.' },
    author: 'Unknown',
  },
  {
    text: { en: 'She turned her can\'ts into cans and her dreams into plans.', ru: 'Она превратила свои «не могу» в «могу», а мечты — в планы.', de: 'Sie verwandelte ihr Kann-nicht in Kann und ihre Träume in Pläne.', fr: 'Elle a transformé ses « je ne peux pas » en « je peux » et ses rêves en plans.', es: 'Ella convirtió sus «no puedo» en «puedo» y sus sueños en planes.', it: 'Ha trasformato i suoi «non posso» in «posso» e i suoi sogni in piani.', pt: 'Ela transformou seus «não consigo» em «consigo» e seus sonhos em planos.', zh: '她把「不能」变成了「能」，把梦想变成了计划。', ar: 'حوّلت «لا أستطيع» إلى «أستطيع» وأحلامها إلى خطط.' },
    author: 'Unknown',
  },
];

export function DailyQuote() {
  const lang = useSettingsStore((s) => s.lang);
  const [quoteIdx] = useState(() => Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % quotes.length);
  const q = quotes[quoteIdx];
  const quoteText = q.text[lang] || q.text.en || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 22, stiffness: 180, delay: 0.15 }}
      className="rounded-theme-xl bg-theme-card border border-theme shadow-theme p-5 relative overflow-hidden"
    >
      <motion.div
        animate={{ rotate: [0, 8, 0, -8, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-2 right-2 w-8 h-8 text-accent/6"
      >
        <Quote className="w-full h-full" />
      </motion.div>
      <div className="relative z-10 pr-6">
        <motion.p
          key={`${quoteIdx}-text`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-theme-primary leading-relaxed italic"
        >
          &ldquo;{quoteText}&rdquo;
        </motion.p>
        <motion.p
          key={`${quoteIdx}-author`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs text-theme-muted mt-2 text-right"
        >
          — {q.author}
        </motion.p>
      </div>
    </motion.div>
  );
}
