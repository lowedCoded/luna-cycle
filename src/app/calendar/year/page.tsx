'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCycleStore } from '@/lib/store/cycleStore';
import { useDiaryStore } from '@/lib/store/diaryStore';
import {
  startOfYear, endOfYear, eachMonthOfInterval, eachDayOfInterval,
  format, parseISO, isSameDay, isToday, getDay, addDays,
} from 'date-fns';

export default function YearPage() {
  const cycles = useCycleStore((s) => s.cycles);
  const entries = useDiaryStore((s) => s.entries);
  const year = new Date().getFullYear();

  const entriesMap = useMemo(() => new Map(entries.map((e) => [e.date, e])), [entries]);

  const months = useMemo(() => {
    const yearStart = startOfYear(new Date(year, 0, 1));
    const yearEnd = endOfYear(yearStart);
    return eachMonthOfInterval({ start: yearStart, end: yearEnd }).map((month) => {
      const days = eachDayOfInterval({ start: month, end: endOfYear(month) }).filter(
        (d) => d.getMonth() === month.getMonth()
      );
      const dayEntries = days.map((d) => {
        const dateStr = format(d, 'yyyy-MM-dd');
        const entry = entriesMap.get(dateStr);
        const cycle = cycles.find((c) => {
          const cs = parseISO(c.startDate);
          const ce = c.endDate ? parseISO(c.endDate) : null;
          return isSameDay(d, cs) || (ce && d >= cs && d <= ce);
        });
        return {
          date: d,
          mood: entry?.mood,
          isPeriod: !!cycle && d >= parseISO(cycle.startDate) && d < addDays(parseISO(cycle.startDate), cycle.periodLength),
          hasEntry: !!entry,
        };
      });
      return { month: format(month, 'MMMM'), days: dayEntries };
    });
  }, [cycles, entriesMap, year]);

  return (
    <div className="relative min-h-[calc(100vh-6rem)]">
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-theme-primary">{year} Overview</h1>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {months.map((m) => (
            <motion.div
              key={m.month}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 22, stiffness: 200 }}
              className="rounded-theme-xl bg-theme-card border border-theme shadow-theme p-4"
            >
              <h3 className="text-xs font-semibold text-theme-primary mb-3">{m.month}</h3>
              <div className="grid grid-cols-7 gap-0.5">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
                  <div key={d} className="text-[8px] text-theme-muted text-center pb-1">{d}</div>
                ))}
                {Array.from({ length: (getDay(m.days[0].date) + 6) % 7 }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {m.days.map((d) => (
                  <motion.div
                    key={d.date.toISOString()}
                    whileHover={{ scale: 1.3 }}
                    className={`w-full aspect-square rounded-sm flex items-center justify-center text-[9px] font-medium transition-colors cursor-pointer ${
                      d.isPeriod
                        ? 'bg-red-200 text-red-800'
                        : d.hasEntry
                        ? 'bg-accent/10 text-accent'
                        : isToday(d.date)
                        ? 'border border-accent text-theme-primary'
                        : 'text-theme-muted hover:bg-theme-card-hover'
                    }`}
                    title={format(d.date, 'd MMM yyyy') + (d.mood ? ` Mood: ${d.mood}` : '')}
                  >
                    {format(d.date, 'd')}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
