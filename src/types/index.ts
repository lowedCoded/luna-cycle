export type Theme = 'romantic' | 'natural' | 'modern' | 'serene' | 'cozy' | 'frost' | 'moon' | 'coral' | 'jade' | 'terracotta' | 'lavender' | 'ocean' | 'sunset' | 'rosegold' | 'charcoal' | 'forest' | 'blush';
export type Lang = 'en' | 'ru' | 'uk' | 'de' | 'fr' | 'es' | 'it' | 'pt' | 'zh' | 'ar';

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export interface CycleDay {
  date: string;
  phase: CyclePhase;
  isPeriod: boolean;
  flow?: 'light' | 'medium' | 'heavy';
}

export interface Cycle {
  id: string;
  startDate: string;
  endDate?: string;
  periodLength: number;
  cycleLength: number;
}

export interface PMDDSymptoms {
  irritability: number;
  anxiety: number;
  depression: number;
  crying_spells: number;
  overwhelm: number;
  anger: number;
  hopelessness: number;
}

export interface DiaryEntry {
  id: string;
  date: string;
  mood: number;
  pain: number;
  flow: 'light' | 'medium' | 'heavy' | 'none';
  symptoms: string[];
  notes: string;
  tags: string[];
  water?: number;
  sleep?: number;
  bbt?: number;
  energy?: number;
  stress?: number;
  symptomSeverity?: Record<string, number>;
  pmdd?: PMDDSymptoms;
  questionAnswer?: string;
  questionDate?: string;
}

export interface Habit {
  id: string;
  name: Record<Lang, string>;
  icon: string;
  color: string;
  archived: boolean;
}

export interface HabitLog {
  habitId: string;
  date: string;
  done: boolean;
}

export interface Medication {
  id: string;
  name: Record<Lang, string>;
  type: 'hormonal' | 'painkiller' | 'vitamin' | 'other';
  dosage: string;
  schedule: 'daily' | 'cycle_days' | 'phase' | 'as_needed' | 'custom';
  scheduleDays?: number[];
  schedulePhase?: CyclePhase;
  color: string;
  time?: string;
  archived: boolean;
}

export interface MedicationLog {
  date: string;
  taken: string[];  // medication ids
}

export interface CycleNote {
  cycleId: string;
  rating: number;
  note: string;
}

export interface Tip {
  id: string;
  title: Partial<Record<Lang, string>>;
  description: Partial<Record<Lang, string>>;
  category: TipCategory;
  image: string;
  source: string;
  verified: boolean;
}

export type TipCategory = 'health' | 'nutrition' | 'sport' | 'psychology' | 'general';

export interface UserProfile {
  nickname: string;
  registeredAt: string;
}

export interface UserSettings {
  theme: Theme;
  lang: Lang;
  averageCycleLength: number;
  averagePeriodLength: number;
  lastPeriodStart: string | null;
}
