'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Circle,
  Info,
} from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  format,
  eachDayOfInterval,
  isSameDay,
  isToday,
  parseISO,
  addDays,
} from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import { getTagColor } from '@/lib/tagColors';
import { uk } from 'date-fns/locale/uk';
import { de } from 'date-fns/locale/de';
import { fr } from 'date-fns/locale/fr';
import { es } from 'date-fns/locale/es';
import type { Locale } from 'date-fns';
import { ThemeDecorations } from '@/components/decorations/ThemeDecorations';
import { useT } from '@/components/providers/AppProvider';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { useCycleStore } from '@/lib/store/cycleStore';
import { useDiaryStore } from '@/lib/store/diaryStore';
import type { CyclePhase } from '@/types';
import Link from 'next/link';
import { Button } from '@/ui/Button';

const localeMap: Record<string, Locale | undefined> = { ru, uk, de, fr, es };

const phaseConfig: Record<CyclePhase, { color: string; labelEn: string; labelRu: string }> = {
  menstrual: { color: 'var(--phase-menstrual)', labelEn: 'Menstrual', labelRu: 'Менструация' },
  follicular: { color: 'var(--phase-follicular)', labelEn: 'Follicular', labelRu: 'Фолликулярная' },
  ovulation: { color: 'var(--phase-ovulation)', labelEn: 'Ovulation', labelRu: 'Овуляция' },
  luteal: { color: 'var(--phase-luteal)', labelEn: 'Luteal', labelRu: 'Лютеиновая' },
};

const dayVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 12 },
  visible: (i: number) => ({
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring' as const, damping: 22, stiffness: 220, delay: i * 0.012 },
  }),
};

const moodEmojis = ['😢', '😐', '🙂', '😊', '🥰'];

export default function CalendarPage() {
  const t = useT();
  const lang = useSettingsStore((s) => s.lang);
  const dateLocale = localeMap[lang];
  const avgLength = useSettingsStore((s) => s.averageCycleLength);
  const avgPeriod = useSettingsStore((s) => s.averagePeriodLength);
  const getPhaseForDate = useCycleStore((s) => s.getPhaseForDate);
  const entries = useDiaryStore((s) => s.entries);
  const cycles = useCycleStore((s) => s.cycles);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [direction, setDirection] = useState(0);
  const [highlightPhase, setHighlightPhase] = useState<CyclePhase | null>(null);

  const days = useMemo(() => {
    const ms = startOfMonth(currentMonth);
    const me = endOfMonth(currentMonth);
    const cs = startOfWeek(ms, { weekStartsOn: 1 });
    const ce = endOfWeek(me, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: cs, end: ce });
  }, [currentMonth]);

  const entriesMap = useMemo(() => new Map(entries.map((e) => [e.date, e])), [entries]);

  const selectedEntry = useMemo(() => {
    if (!selectedDate) return null;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return entriesMap.get(dateStr) ?? null;
  }, [selectedDate, entriesMap]);

  const phases: CyclePhase[] = ['menstrual', 'follicular', 'ovulation', 'luteal'];
  const monthLabel = useMemo(() => format(currentMonth, 'LLLL yyyy', { locale: dateLocale }), [currentMonth, dateLocale]);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentMonth((m) => addMonths(m, 1));
    setSelectedDate(null);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentMonth((m) => subMonths(m, 1));
    setSelectedDate(null);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-6rem)]">
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-theme-primary">{t.calendar.title}</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 200 }}
              className="rounded-theme-xl bg-theme-card border border-theme shadow-theme overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-theme">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goPrev}
                  className="p-2 hover:bg-theme-card-hover rounded-theme-md transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-theme-secondary" />
                </motion.button>
                <AnimatePresence mode="wait">
                    <motion.h2
                      key={monthLabel}
                      initial={{ opacity: 0, y: direction > 0 ? 16 : -16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: direction > 0 ? -16 : 16 }}
                      transition={{ duration: 0.2 }}
                      className="text-lg font-semibold text-theme-primary"
                    >
                      {monthLabel}
                    </motion.h2>
                </AnimatePresence>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goNext}
                  className="p-2 hover:bg-theme-card-hover rounded-theme-md transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-theme-secondary" />
                </motion.button>
              </div>

              {cycles.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-12 text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Info className="w-12 h-12 text-theme-muted mx-auto mb-3" />
                  </motion.div>
                  <p className="text-theme-muted mb-4">{t.calendar.addData}</p>
                  <Link href="/" className="inline-block">
                    <Button variant="primary" size="md">
                      Начать отслеживание
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={monthLabel}
                    initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="grid grid-cols-7 gap-px bg-theme">
                      {t.calendar.weekDays.map((day) => (
                        <div key={day} className="p-2 text-center text-xs font-medium text-theme-muted bg-theme-primary">
                          {day}
                        </div>
                      ))}
                      {days.map((day, idx) => {
                        const phase = getPhaseForDate(day, avgLength, avgPeriod);
                        const phaseCfg = phaseConfig[phase];
                        const dayEntry = entriesMap.get(format(day, 'yyyy-MM-dd'));
                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                        const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                        const isHighlighted = highlightPhase && phase === highlightPhase;
                        const isTodayDate = isToday(day);

                        return (
                          <motion.button
                            key={day.toISOString()}
                            custom={idx}
                            variants={dayVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover={{ scale: 1.04, zIndex: 10 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setSelectedDate(day)}
                             className={`relative p-2 text-sm transition-all bg-theme-primary hover:bg-theme-card-hover group ${
                              !isCurrentMonth ? 'opacity-30' : ''
                            } ${isHighlighted ? 'bg-[var(--accent)]/5' : ''}`}
                          >
                            <motion.span
                              whileHover={{ scale: 1.1 }}
                              className={`flex items-center justify-center w-8 h-8 mx-auto text-sm relative ${
                                isTodayDate
                                  ? 'bg-gradient-accent text-white font-bold rounded-full shadow-theme'
                                  : 'text-theme-primary'
                              } ${isSelected ? 'rounded-full ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg-primary)]' : 'rounded-full'}`}
                            >
                              {format(day, 'd')}
                              {isTodayDate && (
                                <motion.span
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                                  className="absolute inset-0 rounded-full ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg-primary)]"
                                />
                              )}
                            </motion.span>
                            <div className="flex justify-center gap-0.5 mt-0.5 flex-wrap max-w-[56px]">
                              <Circle className="w-2 h-2" fill={phaseCfg.color} stroke="none" />
                              {dayEntry && dayEntry.tags && dayEntry.tags.slice(0, 3).map((tag) => (
                                <Circle key={tag} className="w-2 h-2" fill={getTagColor(tag)} stroke="none" />
                              ))}
                            </div>
                            {dayEntry && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded-theme-sm bg-theme-primary border border-theme shadow-theme text-[9px] text-theme-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 hidden group-hover:block">
                                {moodEmojis[dayEntry.mood - 1]} {t.diary.pain}: {'•'.repeat(dayEntry.pain)}{'○'.repeat(5 - dayEntry.pain)}
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              <div className="flex flex-wrap gap-3 p-3 border-t border-theme bg-theme-card-hover/50">
                {phases.map((phase) => (
                  <motion.button
                    key={phase}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setHighlightPhase(highlightPhase === phase ? null : phase)}
                    className={`flex items-center gap-1.5 transition-all ${
                      highlightPhase === phase ? 'scale-110' : ''
                    }`}
                  >
                    <Circle className="w-3 h-3" fill={phaseConfig[phase].color} stroke="none" />
                    <span className={`text-[10px] ${highlightPhase === phase ? 'text-accent font-semibold' : 'text-theme-muted'}`}>
                      {t.calendar[`phase${phase.charAt(0).toUpperCase()}${phase.slice(1)}` as keyof typeof t.calendar]}
                    </span>
                  </motion.button>
                ))}
                <div className="flex items-center gap-1.5 ml-auto">
                  <Circle className="w-3 h-3" fill="var(--accent)" stroke="none" opacity={0.5} />
                  <span className="text-[10px] text-theme-muted">
                    {t.calendar.entry}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 200, delay: 0.15 }}
            className="lg:col-span-1"
          >
            <div className="rounded-theme-xl bg-theme-card border border-theme shadow-theme p-5 sticky top-24">
              <h3 className="font-semibold text-theme-primary text-sm mb-3">
                {selectedDate
                  ? `${t.calendar.logForDay} ${format(selectedDate, 'd MMMM', { locale: dateLocale })}`
                  : t.calendar.selectDate}
              </h3>
              <AnimatePresence mode="wait">
                {selectedDate ? (
                  selectedEntry ? (
                    <motion.div
                      key={`entry-${selectedDate.toISOString()}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-3"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 15, stiffness: 250 }}
                        className="flex items-center gap-2"
                      >
                        <span className="text-sm text-theme-muted">{t.diary.mood}:</span>
                        <span className="text-2xl">{['😢', '😐', '🙂', '😊', '🥰'][selectedEntry.mood - 1]}</span>
                      </motion.div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-theme-muted">{t.diary.pain}:</span>
                        <span className="text-sm text-theme-primary">
                          {'●'.repeat(selectedEntry.pain)}{'○'.repeat(5 - selectedEntry.pain)}
                        </span>
                      </div>
                      {selectedEntry.symptoms.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <span className="text-sm text-theme-muted">{t.diary.symptoms}: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedEntry.symptoms.map((s, si) => (
                              <motion.span
                                key={s}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 + si * 0.05 }}
                                className="px-2 py-0.5 rounded-full bg-theme-card-hover text-[10px] text-theme-muted"
                              >
                                {t.diary.symptoms_list[s as keyof typeof t.diary.symptoms_list] as string || s}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      {selectedEntry.notes && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <span className="text-sm text-theme-muted">{t.diary.notes}:</span>
                          <p className="text-xs text-theme-secondary mt-1 bg-theme-card-hover p-2 rounded-theme-sm">{selectedEntry.notes}</p>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`noentry-${selectedDate.toISOString()}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-6"
                    >
                      <p className="text-sm text-theme-muted">{t.diary.noEntries}</p>
                      <p className="text-[10px] text-theme-muted mt-1">
                        {t.calendar.useDiary}
                      </p>
                    </motion.div>
                  )
                ) : (
                  <motion.div
                    key="no-selection"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-6"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Info className="w-8 h-8 text-theme-muted mx-auto mb-2" />
                    </motion.div>
                    <p className="text-xs text-theme-muted">
                      {t.calendar.tapDate}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
