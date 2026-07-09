export type MoonPhase =
  | 'new'
  | 'waxing-crescent'
  | 'first-quarter'
  | 'waxing-gibbous'
  | 'full'
  | 'waning-gibbous'
  | 'last-quarter'
  | 'waning-crescent';

export interface MoonData {
  phase: MoonPhase;
  illumination: number;
  age: number;
}

function normalize(value: number): number {
  return ((value % 1) + 1) % 1;
}

export function getMoonPhase(date: Date): MoonData {
  const knownNewMoon = new Date(2000, 0, 6, 18, 14, 0);
  const lunarCycle = 29.53058867;
  const diff = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const age = normalize(diff / lunarCycle) * lunarCycle;
  const illumination = (1 - Math.cos(2 * Math.PI * age / lunarCycle)) / 2;

  const phases: MoonPhase[] = [
    'new', 'waxing-crescent', 'first-quarter', 'waxing-gibbous',
    'full', 'waning-gibbous', 'last-quarter', 'waning-crescent',
  ];
  const idx = Math.round(age / lunarCycle * 8) % 8;
  const phase = phases[idx];

  return { phase, illumination: Math.round(illumination * 100), age: Math.round(age) };
}

import type { Lang } from '@/types';

export function getMoonPhaseLabel(phase: MoonPhase, lang: Lang): string {
  const labels: Record<string, Record<string, string>> = {
    'new': { ru: 'Новолуние', en: 'New Moon', uk: 'Новолуння', de: 'Neumond', fr: 'Nouvelle Lune', es: 'Luna Nueva', it: 'Luna Nuova', pt: 'Lua Nova', zh: '新月', ar: 'قمر جديد' },
    'waxing-crescent': { ru: 'Растущий серп', en: 'Waxing Crescent', uk: 'Зростаючий серп', de: 'Zunehmende Sichel', fr: 'Croissant', es: 'Creciente', it: 'Falce Crescente', pt: 'Crescente', zh: '蛾眉月', ar: 'هلال متزايد' },
    'first-quarter': { ru: 'Первая четверть', en: 'First Quarter', uk: 'Перша чверть', de: 'Erstes Viertel', fr: 'Premier Quartier', es: 'Cuarto Creciente', it: 'Primo Quarto', pt: 'Quarto Crescente', zh: '上弦月', ar: 'الربع الأول' },
    'waxing-gibbous': { ru: 'Растущая луна', en: 'Waxing Gibbous', uk: 'Зростаюча луна', de: 'Zunehmender Mond', fr: 'Gibbeuse Croissante', es: 'Gibosa Creciente', it: 'Gibbosa Crescente', pt: 'Gibosa Crescente', zh: '盈凸月', ar: 'أحدب متزايد' },
    'full': { ru: 'Полнолуние', en: 'Full Moon', uk: 'Повний місяць', de: 'Vollmond', fr: 'Pleine Lune', es: 'Luna Llena', it: 'Luna Piena', pt: 'Lua Cheia', zh: '满月', ar: 'بدر' },
    'waning-gibbous': { ru: 'Убывающая луна', en: 'Waning Gibbous', uk: 'Спадаюча луна', de: 'Abnehmender Mond', fr: 'Gibbeuse Décroissante', es: 'Gibosa Menguante', it: 'Gibbosa Calante', pt: 'Gibosa Minguante', zh: '亏凸月', ar: 'أحدب متناقص' },
    'last-quarter': { ru: 'Последняя четверть', en: 'Last Quarter', uk: 'Остання чверть', de: 'Letztes Viertel', fr: 'Dernier Quartier', es: 'Cuarto Menguante', it: 'Ultimo Quarto', pt: 'Quarto Minguante', zh: '下弦月', ar: 'الربع الأخير' },
    'waning-crescent': { ru: 'Убывающий серп', en: 'Waning Crescent', uk: 'Спадаючий серп', de: 'Abnehmende Sichel', fr: 'Croissant Décroissant', es: 'Menguante', it: 'Falce Calante', pt: 'Minguante', zh: '残月', ar: 'هلال متناقص' },
  };
  return labels[phase]?.[lang] || labels[phase]?.en || labels['new'].en;
}
