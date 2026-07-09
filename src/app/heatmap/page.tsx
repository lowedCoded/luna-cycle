'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, ChevronLeft, ChevronRight, Smile, Flame, Activity, BarChart3 } from 'lucide-react';
import { useDiaryStore } from '@/lib/store/diaryStore';
import { useCycleStore } from '@/lib/store/cycleStore';
import { useSettingsStore } from '@/lib/store/settingsStore';
import {
  startOfYear, endOfYear, eachMonthOfInterval, eachDayOfInterval,
  format, parseISO, isSameDay, isToday,
} from 'date-fns';
import Link from 'next/link';
import { Button } from '@/ui/Button';

type HeatMode = 'mood' | 'pain' | 'symptoms';

const modeConfig: Record<HeatMode, { icon: typeof Smile; label: string; labelRu: string; colors: string[] }> = {
  mood: { icon: Smile, label: 'Mood', labelRu: 'Настроение', colors: ['#ef9a9a', '#ffab91', '#ffe0b2', '#c5e1a5', '#a5d6a7'] },
  pain: { icon: Flame, label: 'Pain', labelRu: 'Боль', colors: ['#fce4ec', '#f48fb1', '#ec407a', '#d81b60', '#880e4f'] },
  symptoms: { icon: Activity, label: 'Symptoms', labelRu: 'Симптомы', colors: ['#f3e5f5', '#ce93d8', '#ab47bc', '#7b1fa2', '#4a148c'] },
};

const cellVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: (i: number) => ({
    opacity: 1, scale: 1,
    transition: { type: 'spring' as const, damping: 20, stiffness: 200, delay: i * 0.003 },
  }),
};

export default function HeatmapPage() {
  const entries = useDiaryStore((s) => s.entries);
  const cycles = useCycleStore((s) => s.cycles);
  const lang = useSettingsStore((s) => s.lang);
  const [year, setYear] = useState(new Date().getFullYear());
  const [mode, setMode] = useState<HeatMode>('mood');
  const [tooltip, setTooltip] = useState<{ date: string; value: string } | null>(null);

  const config = modeConfig[mode];
  const hasAnyData = entries.length > 0;

  const entriesMap = useMemo(() => new Map(entries.map((e) => [e.date, e])), [entries]);

  const months = useMemo(() => {
    const yearStart = startOfYear(new Date(year, 0, 1));
    const yearEnd = endOfYear(yearStart);
    return eachMonthOfInterval({ start: yearStart, end: yearEnd }).map((month) => {
      const days = eachDayOfInterval({ start: month, end: endOfYear(month) }).filter(
        (d) => d.getMonth() === month.getMonth()
      );
      const dayData = days.map((d) => {
        const dateStr = format(d, 'yyyy-MM-dd');
        const entry = entriesMap.get(dateStr);
        let value = 0;
        let display = '';
        if (entry) {
          switch (mode) {
            case 'mood': value = entry.mood; display = `${entry.mood}/5`; break;
            case 'pain': value = entry.pain; display = `${entry.pain}/5`; break;
            case 'symptoms': value = Math.min(entry.symptoms.length, 5); display = `${entry.symptoms.length}`; break;
          }
        }
        return { date: d, dateStr, entry, value, display };
      });
      return { month: format(month, 'MMMM'), days: dayData };
    });
  }, [entries, year, mode]);

  const getColor = (value: number) => {
    if (value === 0) return 'var(--bg-card)';
    const idx = Math.min(Math.floor(value), 4);
    return config.colors[idx];
  };

  return (
    <div className="relative min-h-[calc(100vh-6rem)]">
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-theme-lg bg-gradient-accent">
              <Grid3X3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-theme-primary tracking-tight">Heatmap</h1>
              <p className="text-sm text-theme-muted mt-0.5">{lang === 'ru' ? 'Годовая тепловая карта' : 'Yearly activity heatmap'}</p>
            </div>
          </div>
        </motion.div>

        {/* Mode selector */}
        <div className="flex items-center gap-2 mb-6">
          {(Object.entries(modeConfig) as [HeatMode, typeof config][]).map(([key, cfg]) => {
            const Icon = cfg.icon;
            const isActive = mode === key;
            return (
              <motion.button
                key={key}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setMode(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive ? 'bg-gradient-accent text-white shadow-theme' : 'bg-theme-card text-theme-secondary border border-theme'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {lang === 'ru' ? cfg.labelRu : cfg.label}
              </motion.button>
            );
          })}

          {/* Year navigation */}
          <div className="flex items-center gap-2 ml-auto">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setYear((y) => y - 1)}
              className="p-1.5 rounded-full bg-theme-card border border-theme text-theme-primary"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <span className="text-sm font-semibold text-theme-primary w-12 text-center">{year}</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setYear((y) => y + 1)}
              className="p-1.5 rounded-full bg-theme-card border border-theme text-theme-primary"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {!hasAnyData ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <BarChart3 className="w-20 h-20 text-theme-muted mb-4" />
            </motion.div>
            <h3 className="text-lg font-semibold text-theme-primary mb-1">Нет данных для отображения</h3>
            <p className="text-sm text-theme-muted mb-6 max-w-sm">Начните вести дневник, чтобы увидеть тепловую карту настроения, боли и симптомов</p>
            <Link href="/diary">
              <Button variant="primary" size="lg">
                Перейти к дневнику
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Month grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {months.map((m, mi) => (
                <motion.div
                  key={m.month}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: mi * 0.05 }}
                  className="rounded-theme-lg bg-theme-card border border-theme p-3"
                >
                  <h3 className="text-xs font-semibold text-theme-primary mb-2 capitalize">{m.month}</h3>
                  <div className="grid grid-cols-7 gap-1">
                    {/* Weekday headers */}
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                      <div key={i} className="text-center text-[7px] font-medium text-theme-muted uppercase">{d}</div>
                    ))}

                    {/* Day padding */}
                    {Array.from({ length: m.days[0]?.date ? (m.days[0].date.getDay() || 7) - 1 : 0 }).map((_, i) => (
                      <div key={`pad-${mi}-${i}`} />
                    ))}

                    {m.days.map((d, di) => {
                      const isTodayDay = isToday(d.date);
                      const isTooltip = tooltip?.date === d.dateStr;
                      const color = getColor(d.value);
                      return (
                        <motion.div
                          key={d.dateStr}
                          custom={di}
                          variants={cellVariants}
                          initial="hidden"
                          animate="visible"
                          onMouseEnter={() => setTooltip({ date: d.dateStr, value: d.display })}
                          onMouseLeave={() => setTooltip(null)}
                          className="relative aspect-square rounded-sm cursor-default hover:scale-125"
                          style={{
                            background: color,
                            border: isTodayDay ? '2px solid var(--accent)' : '1px solid var(--border)',
                            opacity: d.value === 0 ? 0.3 : 0.85,
                          }}
                        >
                          {isTooltip && d.entry && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded-md bg-theme-card border border-theme shadow-theme text-[9px] text-theme-primary whitespace-nowrap z-20">
                              {format(d.date, 'MMM d')} — {d.display}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Legend */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-4 rounded-theme-lg bg-theme-card border border-theme flex items-center gap-3"
            >
              <span className="text-[10px] text-theme-muted font-medium">{lang === 'ru' ? 'Нет' : 'None'}</span>
              {config.colors.map((c, i) => (
                <div key={i} className="w-5 h-5 rounded-sm" style={{ background: c }} />
              ))}
              <span className="text-[10px] text-theme-muted font-medium ml-auto">{lang === 'ru' ? 'Макс' : 'Max'}</span>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
