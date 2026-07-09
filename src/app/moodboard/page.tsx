'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Palette } from 'lucide-react';
import { useDiaryStore } from '@/lib/store/diaryStore';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { useT } from '@/components/providers/AppProvider';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, addMonths, subMonths, getDay, parseISO } from 'date-fns';

const moodEmojis: Record<number, string> = { 1: '😢', 2: '😐', 3: '🙂', 4: '😊', 5: '🥰' };
const moodColors = ['var(--mood-1)', 'var(--mood-2)', 'var(--mood-3)', 'var(--mood-4)', 'var(--mood-5)'];

export default function MoodBoardPage() {
  const t = useT();
  const lang = useSettingsStore((s) => s.lang);
  const entries = useDiaryStore((s) => s.entries);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const monthData = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startPad = getDay(monthStart) === 0 ? 6 : getDay(monthStart) - 1;
    const totalSlots = Math.ceil((startPad + days.length) / 7) * 7;
    return { monthStart, monthEnd, days, startPad, totalSlots };
  }, [currentDate]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getEntry = (dateStr: string) => entries.find((e) => e.date === dateStr);

  const weekDays = (t.calendar.weekDays as unknown as string[]) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="relative min-h-[calc(100vh-6rem)]">
      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-theme-lg bg-gradient-accent">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-theme-primary tracking-tight">Mood Board</h1>
              <p className="text-sm text-theme-muted mt-0.5">Your monthly mood canvas</p>
            </div>
          </div>
        </motion.div>

        {/* Month navigation */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevMonth}
            className="p-2 rounded-full bg-theme-card border border-theme text-theme-primary hover:bg-theme-card-hover"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <motion.h2
            key={format(currentDate, 'yyyy-MM')}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold text-theme-primary capitalize"
          >
            {format(currentDate, 'MMMM yyyy')}
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextMonth}
            className="p-2 rounded-full bg-theme-card border border-theme text-theme-primary hover:bg-theme-card-hover"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((d: string) => (
            <div key={d} className="text-center text-[10px] font-medium text-theme-muted uppercase tracking-wider py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Empty padding cells */}
          {Array.from({ length: monthData.startPad }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}

          <AnimatePresence mode="popLayout">
            {monthData.days.map((day, i) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const entry = getEntry(dateStr);
              const mood = entry?.mood || 0;
              const isToday = dateStr === format(new Date(), 'yyyy-MM-dd');
              const isHovered = hoveredDay === dateStr;

              return (
                <motion.div
                  key={dateStr}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 200, delay: i * 0.02 }}
                  onMouseEnter={() => setHoveredDay(dateStr)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`relative aspect-square rounded-theme-md flex flex-col items-center justify-center cursor-default transition-all ${
                    isToday ? 'ring-2 ring-[var(--accent)]' : ''
                  } ${mood > 0 ? 'shadow-sm' : 'bg-theme-card/30 border border-theme/50'}`}
                  style={mood > 0 ? { background: `color-mix(in srgb, ${moodColors[mood - 1]} 60%, var(--bg-card))` } : undefined}
                >
                  <span className={`text-xs font-medium ${mood > 0 ? 'text-white' : 'text-theme-muted'}`}>
                    {format(day, 'd')}
                  </span>
                  {mood > 0 && (
                    <span className="text-[8px] mt-0.5">{moodEmojis[mood] || ''}</span>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Tooltip for hovered day */}
        <AnimatePresence>
          {hoveredDay && (() => {
            const entry = getEntry(hoveredDay);
            if (!entry) return null;
            return (
              <motion.div
                key={hoveredDay}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="mt-4 p-4 rounded-theme-lg bg-theme-card border border-theme shadow-theme"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-theme-primary">
                    {format(parseISO(hoveredDay), 'MMMM d, yyyy')}
                  </span>
                  <span className="text-lg">{moodEmojis[entry.mood] || ''}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-theme-secondary">
                  <span>{t.diary.mood}: {entry.mood}/5</span>
                  <span>{t.diary.pain}: {entry.pain}/5</span>
                  {entry.symptoms.length > 0 && (
                    <span>{entry.symptoms.length} {t.diary.symptoms?.toLowerCase() || 'symptoms'}</span>
                  )}
                </div>
                {entry.notes && (
                  <p className="text-xs text-theme-muted mt-2 italic">{entry.notes}</p>
                )}
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 rounded-theme-lg bg-theme-card border border-theme"
        >
          <p className="text-xs font-medium text-theme-primary mb-3">{t.help?.moodTitle || 'Mood Scale'}</p>
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4, 5].map((v) => (
              <div key={v} className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-sm" style={{ background: moodColors[v - 1] }} />
                <span className="text-[10px] text-theme-muted">{moodEmojis[v]} {v}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
