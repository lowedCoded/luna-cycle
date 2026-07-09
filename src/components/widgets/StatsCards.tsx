'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, BookOpen, Smile, Calendar } from 'lucide-react';
import { useCycleStore } from '@/lib/store/cycleStore';
import { useDiaryStore } from '@/lib/store/diaryStore';
import { useT } from '@/components/providers/AppProvider';
import { differenceInDays } from 'date-fns';

export function StatsCards() {
  const t = useT();
  const cycles = useCycleStore((s) => s.cycles);
  const entries = useDiaryStore((s) => s.entries);

  const stats = useMemo(() => {
    const totalCycles = cycles.length;
    let daysTracked = 0;
    if (cycles.length > 0) {
      const sorted = [...cycles].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      const first = new Date(sorted[0].startDate);
      daysTracked = differenceInDays(new Date(), first);
    }
    const avgMood = entries.length > 0
      ? Math.round(entries.reduce((s, e) => s + e.mood, 0) / entries.length * 10) / 10
      : null;
    const currentStreak = (() => {
      if (entries.length === 0) return 0;
      const sorted = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      let streak = 1;
      for (let i = 0; i < sorted.length - 1; i++) {
        const diff = differenceInDays(new Date(sorted[i].date), new Date(sorted[i + 1].date));
        if (diff === 1) streak++;
        else break;
      }
      return streak;
    })();

    return { totalCycles, daysTracked, avgMood, currentStreak };
  }, [cycles, entries]);

  const cards = [
    {
      icon: Activity,
      value: stats.totalCycles,
      label: t.dashboard.statsCycles,
      color: 'text-accent',
      delay: 0,
    },
    {
      icon: Calendar,
      value: stats.daysTracked,
      label: t.dashboard.statsDays,
      color: 'text-accent',
      delay: 0.08,
    },
    {
      icon: Smile,
      value: stats.avgMood ? `${stats.avgMood}` : '—',
      label: t.dashboard.statsMood,
      color: 'text-accent',
      delay: 0.16,
    },
    {
      icon: BookOpen,
      value: stats.currentStreak,
      label: t.dashboard.statsStreak,
      color: 'text-accent',
      delay: 0.24,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: 'spring' as const, damping: 20, stiffness: 200,
              delay: card.delay,
            }}
            whileHover={{
              y: -3,
              transition: { type: 'spring', damping: 15, stiffness: 300 },
            }}
            className="rounded-theme-lg bg-theme-card border border-theme shadow-theme p-4 flex flex-col items-center text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Icon className={`w-5 h-5 ${card.color} mb-1.5`} />
            </motion.div>
            <motion.span
              key={String(card.value)}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15, stiffness: 250, delay: card.delay + 0.2 }}
              className="text-xl font-bold text-theme-primary"
            >
              {card.value}
            </motion.span>
            <span className="text-[10px] text-theme-muted mt-0.5 leading-tight">
              {card.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
