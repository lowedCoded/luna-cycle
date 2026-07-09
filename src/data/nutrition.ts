export interface NutritionPhase {
  phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
  title: string;
  titleRu: string;
  color: string;
  icon: string;
  focus: string;
  focusRu: string;
  foods: { name: string; emoji: string; benefit: string; benefitRu: string }[];
  avoid: string[];
  avoidRu: string[];
  tips: string[];
  tipsRu: string[];
}

export const nutritionByPhase: NutritionPhase[] = [
  {
    phase: 'menstrual',
    title: 'Menstrual Phase',
    titleRu: 'Менструальная фаза',
    color: '#e8a0b4',
    icon: '🩸',
    focus: 'Iron & warmth',
    focusRu: 'Железо и тепло',
    foods: [
      { name: 'Leafy greens', emoji: '🥬', benefit: 'Iron for blood loss', benefitRu: 'Железо при кровопотере' },
      { name: 'Red meat', emoji: '🥩', benefit: 'Iron & B12', benefitRu: 'Железо и B12' },
      { name: 'Ginger tea', emoji: '🫚', benefit: 'Anti-inflammatory', benefitRu: 'Противовоспалительное' },
      { name: 'Dark chocolate', emoji: '🍫', benefit: 'Magnesium & mood', benefitRu: 'Магний и настроение' },
    ],
    avoid: ['Salty foods', 'Caffeine', 'Dairy'],
    avoidRu: ['Солёное', 'Кофеин', 'Молочное'],
    tips: ['Warm compresses on lower belly', 'Gentle walks', 'Prioritize rest'],
    tipsRu: ['Тёплые компрессы на живот', 'Лёгкие прогулки', 'Отдых'],
  },
  {
    phase: 'follicular',
    title: 'Follicular Phase',
    titleRu: 'Фолликулярная фаза',
    color: '#8b7ec8',
    icon: '🌱',
    focus: 'Light & fresh',
    focusRu: 'Лёгкость и свежесть',
    foods: [
      { name: 'Berries', emoji: '🫐', benefit: 'Antioxidants', benefitRu: 'Антиоксиданты' },
      { name: 'Fish', emoji: '🐟', benefit: 'Omega-3 for hormone balance', benefitRu: 'Омега-3 для гормонов' },
      { name: 'Avocado', emoji: '🥑', benefit: 'Healthy fats', benefitRu: 'Полезные жиры' },
      { name: 'Sprouts', emoji: '🌱', benefit: 'Enzymes & fiber', benefitRu: 'Ферменты и клетчатка' },
    ],
    avoid: ['Heavy fried foods', 'Processed sugar'],
    avoidRu: ['Жирное жареное', 'Сахар'],
    tips: ['Try new recipes', 'Increase protein', 'Light cardio'],
    tipsRu: ['Новые рецепты', 'Больше белка', 'Лёгкое кардио'],
  },
  {
    phase: 'ovulatory',
    title: 'Ovulatory Phase',
    titleRu: 'Овуляторная фаза',
    color: '#ec4899',
    icon: '✨',
    focus: 'Anti-inflammatory',
    focusRu: 'Противовоспалительное',
    foods: [
      { name: 'Turmeric', emoji: '🟡', benefit: 'Curcumin anti-inflammatory', benefitRu: 'Куркумин' },
      { name: 'Broccoli', emoji: '🥦', benefit: 'Liver support', benefitRu: 'Поддержка печени' },
      { name: 'Citrus', emoji: '🍊', benefit: 'Vitamin C', benefitRu: 'Витамин C' },
      { name: 'Quinoa', emoji: '🍚', benefit: 'Complete protein', benefitRu: 'Полный белок' },
    ],
    avoid: ['Alcohol', 'Spicy foods', 'Excess sugar'],
    avoidRu: ['Алкоголь', 'Острое', 'Сахар'],
    tips: ['Stay hydrated', 'Socialize', 'Moderate exercise'],
    tipsRu: ['Пейте воду', 'Общайтесь', 'Умеренные нагрузки'],
  },
  {
    phase: 'luteal',
    title: 'Luteal Phase',
    titleRu: 'Лютеиновая фаза',
    color: '#d4895a',
    icon: '🌙',
    focus: 'Magnesium & complex carbs',
    focusRu: 'Магний и сложные углеводы',
    foods: [
      { name: 'Bananas', emoji: '🍌', benefit: 'Potassium & B6', benefitRu: 'Калий и B6' },
      { name: 'Nuts', emoji: '🥜', benefit: 'Magnesium & selenium', benefitRu: 'Магний и селен' },
      { name: 'Oats', emoji: '🥣', benefit: 'Complex carbs for serotonin', benefitRu: 'Сложные углеводы' },
      { name: 'Sweet potato', emoji: '🍠', benefit: 'Beta-carotene & fiber', benefitRu: 'Каротин и клетчатка' },
    ],
    avoid: ['Salty snacks', 'Caffeine', 'Simple carbs'],
    avoidRu: ['Солёные снеки', 'Кофеин', 'Простые углеводы'],
    tips: ['Small frequent meals', 'Reduce salt', 'Herbal teas'],
    tipsRu: ['Дробное питание', 'Меньше соли', 'Травяные чаи'],
  },
];
