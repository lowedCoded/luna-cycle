import type { DiaryEntry, Cycle, CyclePhase } from '@/types';
import { parseISO, differenceInDays, isWithinInterval } from 'date-fns';

const phases: CyclePhase[] = ['menstrual', 'follicular', 'ovulation', 'luteal'];
const symptoms_list = ['headache', 'bloating', 'cramps', 'fatigue', 'nausea', 'backpain', 'breast_tenderness', 'cravings', 'insomnia', 'acne'];
const moodEmojis: Record<number, string> = { 1: '😢', 2: '😐', 3: '🙂', 4: '😊', 5: '🥰' };

export function getMoodByPhase(entries: DiaryEntry[], cycles: Cycle[], avgCycleLength: number, avgPeriodLength: number): Record<CyclePhase, number[]> {
  const grouped: Record<string, number[]> = { menstrual: [], follicular: [], ovulation: [], luteal: [] };
  const sortedCycles = [...cycles].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  const lastCycle = sortedCycles[0];
  if (!lastCycle) return { menstrual: [3], follicular: [3], ovulation: [3], luteal: [3] };

  const lastStart = parseISO(lastCycle.startDate);
  for (const entry of entries) {
    const ed = parseISO(entry.date);
    const dayInCycle = differenceInDays(ed, lastStart) % avgCycleLength;
    if (dayInCycle < 0) continue;
    let phase: CyclePhase;
    if (dayInCycle < avgPeriodLength) phase = 'menstrual';
    else if (dayInCycle < 14) phase = 'follicular';
    else if (dayInCycle < 16) phase = 'ovulation';
    else phase = 'luteal';
    grouped[phase].push(entry.mood);
  }
  return grouped;
}

export function getTopSymptomsByPhase(entries: DiaryEntry[], cycles: Cycle[], avgCycleLength: number, avgPeriodLength: number): Record<CyclePhase, { symptom: string; count: number }[]> {
  const grouped: Record<string, Record<string, number>> = { menstrual: {}, follicular: {}, ovulation: {}, luteal: {} };
  const sortedCycles = [...cycles].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  const lastCycle = sortedCycles[0];
  if (!lastCycle) return { menstrual: [], follicular: [], ovulation: [], luteal: [] };

  const lastStart = parseISO(lastCycle.startDate);
  for (const entry of entries) {
    const ed = parseISO(entry.date);
    const dayInCycle = differenceInDays(ed, lastStart) % avgCycleLength;
    if (dayInCycle < 0) continue;
    let phase: CyclePhase;
    if (dayInCycle < avgPeriodLength) phase = 'menstrual';
    else if (dayInCycle < 14) phase = 'follicular';
    else if (dayInCycle < 16) phase = 'ovulation';
    else phase = 'luteal';
    for (const s of entry.symptoms) {
      grouped[phase][s] = (grouped[phase][s] || 0) + 1;
    }
  }

  return phases.reduce((acc, p) => {
    acc[p] = Object.entries(grouped[p])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([symptom, count]) => ({ symptom, count }));
    return acc;
  }, {} as Record<CyclePhase, { symptom: string; count: number }[]>);
}

export function getTotalStats(entries: DiaryEntry[], cycles: Cycle[]) {
  const allMoods = entries.map((e) => e.mood);
  const allPain = entries.map((e) => e.pain);
  const avgMood = allMoods.length > 0 ? (allMoods.reduce((a, b) => a + b, 0) / allMoods.length).toFixed(1) : '—';
  const avgPain = allPain.length > 0 ? (allPain.reduce((a, b) => a + b, 0) / allPain.length).toFixed(1) : '—';
  const totalEntries = entries.length;
  const totalCycles = cycles.length;
  const symptomFrequency: Record<string, number> = {};
  for (const e of entries) {
    for (const s of e.symptoms) {
      symptomFrequency[s] = (symptomFrequency[s] || 0) + 1;
    }
  }
  const topSymptoms = Object.entries(symptomFrequency).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return { avgMood, avgPain, totalEntries, totalCycles, topSymptoms };
}

export function getInsights(entries: DiaryEntry[], cycles: Cycle[], avgCycleLength: number, avgPeriodLength: number, lang: string = 'en'): string[] {
  const insights: string[] = [];
  const moodByPhase = getMoodByPhase(entries, cycles, avgCycleLength, avgPeriodLength);
  const topSymptoms = getTopSymptomsByPhase(entries, cycles, avgCycleLength, avgPeriodLength);

  // Mood comparison across phases
  const phaseAvgs = phases.map((p) => {
    const moods = moodByPhase[p];
    const avg = moods.length > 0 ? moods.reduce((a, b) => a + b, 0) / moods.length : 0;
    return { phase: p, avg };
  });
  const best = phaseAvgs.reduce((a, b) => a.avg > b.avg ? a : b);
  const worst = phaseAvgs.reduce((a, b) => a.avg < b.avg ? a : b);

  if (best.avg > 0 && worst.avg > 0 && best.avg !== worst.avg) {
    const bestEmoji = moodEmojis[Math.round(best.avg) as 1|2|3|4|5] || '';
    const worstEmoji = moodEmojis[Math.round(worst.avg) as 1|2|3|4|5] || '';
    if (lang === 'ru') {
      insights.push(`Ваше настроение выше всего в фазу «${getPhaseLabel(best.phase, 'ru')}» ${bestEmoji} (среднее ${best.avg.toFixed(1)}/5) и ниже всего — в «${getPhaseLabel(worst.phase, 'ru')}» ${worstEmoji} (${worst.avg.toFixed(1)}/5).`);
    } else {
      insights.push(`Your mood peaks during the ${getPhaseLabel(best.phase, 'en')} phase ${bestEmoji} (avg ${best.avg.toFixed(1)}/5) and dips during ${getPhaseLabel(worst.phase, 'en')} ${worstEmoji} (${worst.avg.toFixed(1)}/5).`);
    }
  }

  // Top symptoms per phase
  for (const p of phases) {
    const syms = topSymptoms[p];
    if (syms.length > 0) {
      const top = syms[0];
      if (lang === 'ru') {
        insights.push(`В фазу «${getPhaseLabel(p, 'ru')}» самый частый симптом — ${top.symptom} (${top.count} раз).`);
      } else {
        insights.push(`Your most common symptom during ${getPhaseLabel(p, 'en')} is "${top.symptom}" (${top.count}x).`);
      }
    }
  }

  // Streak info
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  if (sortedEntries.length >= 3) {
    const recentMoods = sortedEntries.slice(0, 7).map((e) => e.mood);
    const trend = recentMoods.length >= 2 ? recentMoods[0] - recentMoods[recentMoods.length - 1] : 0;
    if (trend > 0) {
      const emoji = moodEmojis[Math.round(recentMoods[0]) as 1|2|3|4|5] || '';
      insights.push(lang === 'ru' ? `За последние дни настроение улучшается ${emoji}. Отличный тренд!` : `Your mood has been improving over the last few days ${emoji}. Great trend!`);
    } else if (trend < 0) {
      insights.push(lang === 'ru' ? 'В последние дни настроение снижается. Не забудьте уделить время отдыху и заботе о себе.' : 'Your mood has been dipping recently. Remember to rest and practice self-care.');
    }
  }

  // Cycle regularity
  if (cycles.length >= 2) {
    const lengths = cycles.slice(0, Math.min(cycles.length, 5)).map((c) => c.cycleLength);
    const avgLen = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = Math.max(...lengths) - Math.min(...lengths);
    if (variance <= 3 && avgLen >= 21 && avgLen <= 35) {
      insights.push(lang === 'ru' ? 'Ваш цикл очень регулярный! Отличная работа по отслеживанию. 🌸' : 'Your cycle is very regular! Great tracking work. 🌸');
    } else if (variance > 7) {
      insights.push(lang === 'ru' ? 'Длина цикла варьируется. Это может быть связано со стрессом или образом жизни.' : 'Your cycle length varies. This could be related to stress or lifestyle changes.');
    }
  }

  return insights;
}

function getPhaseLabel(phase: CyclePhase, lang: string): string {
  const labels: Record<CyclePhase, Record<string, string>> = {
    menstrual: { en: 'menstrual', ru: 'менструальная' },
    follicular: { en: 'follicular', ru: 'фолликулярная' },
    ovulation: { en: 'ovulation', ru: 'овуляция' },
    luteal: { en: 'luteal', ru: 'лютеиновая' },
  };
  return labels[phase][lang] || phase;
}
