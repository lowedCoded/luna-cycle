import { en } from './en';
import { ru } from './ru';
import { uk } from './uk';
import { de } from './de';
import { fr } from './fr';
import { es } from './es';
import { it } from './it';
import { pt } from './pt';
import { zh } from './zh';
import { ar } from './ar';
import type { Lang } from '@/types';

export type Translations = typeof en;

const translations: Record<Lang, Translations> = { en, ru, uk, de, fr, es, it, pt, zh, ar };

export function getTranslations(lang: Lang): Translations {
  return translations[lang];
}
