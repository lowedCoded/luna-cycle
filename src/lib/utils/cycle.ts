import type { CyclePhase } from '@/types';
import {
  differenceInDays,
  parseISO,
  format,
} from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import { uk } from 'date-fns/locale/uk';
import { de } from 'date-fns/locale/de';
import { fr } from 'date-fns/locale/fr';
import { es } from 'date-fns/locale/es';
import type { Locale } from 'date-fns';
import type { Lang } from '@/types';

const localeMap: Record<string, Locale | undefined> = { ru, uk, de, fr, es };

export const phaseColors: Record<CyclePhase, string> = {
  menstrual: '#e8a0b4',
  follicular: '#a8d8ea',
  ovulation: '#f0c27f',
  luteal: '#c4a0d4',
};

export const phaseNames = {
  ru: {
    menstrual: 'Менструация',
    follicular: 'Фолликулярная',
    ovulation: 'Овуляция',
    luteal: 'Лютеиновая',
  },
  en: {
    menstrual: 'Menstrual',
    follicular: 'Follicular',
    ovulation: 'Ovulation',
    luteal: 'Luteal',
  },
};

export function formatDate(date: Date | string, lang: Lang, pattern = 'd MMMM'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern, { locale: localeMap[lang] });
}

export function getDaysBetween(start: string, end: string): number {
  return differenceInDays(parseISO(end), parseISO(start));
}
