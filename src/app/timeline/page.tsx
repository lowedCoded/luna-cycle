'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, CalendarDays, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { useCycleStore } from '@/lib/store/cycleStore';
import { useDiaryStore } from '@/lib/store/diaryStore';
import { parseISO, format, differenceInDays, isWithinInterval } from 'date-fns';
const flowerIcons = ['🌸', '🌷', '🌻', '🌺', '🌼', '🪷', '🌹', '💐', '🌿', '✨'];

const moodChars: Record<number, string> = { 1: '😢', 2: '😐', 3: '🙂', 4: '😊', 5: '🥰' };

const moodEmojis = ['😢', '😐', '🙂', '😊', '🥰'];

export default function TimelinePage() {
  const cycles = useCycleStore((s) => s.cycles);
  const entries = useDiaryStore((s) => s.entries);
  const [expandedCycle, setExpandedCycle] = useState<string | null>(null);

  const timelineData = useMemo(() => {
    const sorted = [...cycles].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    return sorted.map((cycle, idx) => {
      const start = parseISO(cycle.startDate);
      const end = cycle.endDate ? parseISO(cycle.endDate) : null;
      const cycleEntries = entries.filter((e) => {
        const ed = parseISO(e.date);
        if (end) return isWithinInterval(ed, { start, end });
        return ed >= start;
      });
      const moodString = cycleEntries.map((e) => moodChars[e.mood] || '·').join('');
      const avgMood = cycleEntries.length > 0
        ? (cycleEntries.reduce((sum, e) => sum + e.mood, 0) / cycleEntries.length).toFixed(1)
        : '—';
      const entryCount = cycleEntries.length;
      const flower = flowerIcons[idx % flowerIcons.length];
      const daysSince = differenceInDays(end || new Date(), start);
      const monthYear = format(start, 'MMMM yyyy');
      return { cycle, idx, start, end, moodString, avgMood, entryCount, flower, daysSince, monthYear, cycleEntries };
    });
  }, [cycles, entries]);

  return (
    <div className="relative min-h-[calc(100vh-6rem)]">
      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-theme-lg bg-gradient-accent">
              <History className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-theme-primary tracking-tight">Cycle Timeline</h1>
              <p className="text-sm text-theme-muted mt-0.5">Your cycle story through time</p>
            </div>
          </div>
        </motion.div>

        {timelineData.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-theme-muted text-center py-12"
          >
            No cycles recorded yet. Start tracking from the Dashboard!
          </motion.p>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-accent/40 via-accent/20 to-transparent" />

            <div className="space-y-6">
              {timelineData.map((item, i) => (
                <motion.div
                  key={item.cycle.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, type: 'spring', damping: 22, stiffness: 200 }}
                  className="relative pl-14"
                >
                  {/* Timeline dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.08 + 0.15, type: 'spring', damping: 12, stiffness: 200 }}
                    className="absolute left-4 top-1 w-4 h-4 rounded-full bg-gradient-accent shadow-theme flex items-center justify-center text-[8px]"
                  >
                    {item.flower}
                  </motion.div>

                  {/* Card */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="rounded-theme-lg bg-theme-card border border-theme p-4 shadow-theme hover:shadow-theme-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-sm font-semibold text-theme-primary capitalize">{item.monthYear}</span>
                        <span className="text-[10px] text-theme-muted ml-2">Cycle #{timelineData.length - i}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setExpandedCycle(expandedCycle === item.cycle.id ? null : item.cycle.id)}
                          className="text-theme-muted hover:text-theme-primary transition-colors"
                        >
                          {expandedCycle === item.cycle.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </motion.button>
                        <Link
                          href={`/calendar`}
                          className="text-accent hover:text-accent-light transition-colors"
                        >
                          <CalendarDays className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-theme-secondary mb-2">
                      <span>📅 {item.daysSince} days</span>
                      <span>🩸 {item.cycle.periodLength}d period</span>
                      <span>📊 {item.avgMood} avg</span>
                      <span>📝 {item.entryCount} entries</span>
                    </div>
                    {item.moodString && (
                      <div className="text-sm tracking-wider opacity-80">{item.moodString}</div>
                    )}
                    <div className="mt-2 pt-2 border-t border-theme flex items-center gap-1 text-[10px] text-theme-muted">
                      {format(item.start, 'MMM d')} — {item.end ? format(item.end, 'MMM d') : 'ongoing'}
                    </div>

                    <AnimatePresence>
                      {expandedCycle === item.cycle.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 pt-3 border-t border-theme space-y-2">
                            {item.cycleEntries.length === 0 ? (
                              <p className="text-xs text-theme-muted text-center py-2">No diary entries for this cycle</p>
                            ) : (
                              item.cycleEntries.slice(-10).reverse().map((entry) => (
                                <motion.div
                                  key={entry.id}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex items-center gap-2 text-xs text-theme-secondary bg-theme-card-hover p-2 rounded-theme-sm"
                                >
                                  <span className="text-[10px] text-theme-muted w-20">{format(parseISO(entry.date), 'd MMM')}</span>
                                  <span>{moodEmojis[entry.mood - 1]}</span>
                                  <span className="text-theme-muted">Pain: {'•'.repeat(entry.pain)}{'○'.repeat(5 - entry.pain)}</span>
                                  {entry.symptoms.length > 0 && (
                                    <span className="text-theme-muted truncate">{entry.symptoms.slice(0, 2).join(', ')}{entry.symptoms.length > 2 ? '…' : ''}</span>
                                  )}
                                </motion.div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
