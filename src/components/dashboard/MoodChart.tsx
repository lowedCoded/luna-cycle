'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Smile } from 'lucide-react';
import { useDiaryStore } from '@/lib/store/diaryStore';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { useT } from '@/components/providers/AppProvider';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { subDays, format } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import { uk } from 'date-fns/locale/uk';
import { de } from 'date-fns/locale/de';
import { fr } from 'date-fns/locale/fr';
import { es } from 'date-fns/locale/es';
import type { Locale } from 'date-fns';

const moodColors = ['var(--mood-1)', 'var(--mood-2)', 'var(--mood-3)', 'var(--mood-4)', 'var(--mood-5)'];

const localeMap: Record<string, Locale | undefined> = { ru, uk, de, fr, es };

export function MoodChart() {
  const t = useT();
  const lang = useSettingsStore((s) => s.lang);
  const entries = useDiaryStore((s) => s.entries);
  const dateLocale = localeMap[lang];

  const data = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return {
        date: format(date, 'yyyy-MM-dd'),
        label: format(date, 'EEE', { locale: dateLocale }),
        mood: null as number | null,
        pain: null as number | null,
      };
    });

    entries.forEach((entry) => {
      const found = last7Days.find((d) => d.date === entry.date);
      if (found) {
        found.mood = entry.mood;
        found.pain = entry.pain;
      }
    });

    return last7Days;
  }, [entries, dateLocale]);

  const hasData = data.some((d) => d.mood !== null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 22, stiffness: 200, delay: 0.2, duration: 0.6 }}
      whileHover={{ y: -2, transition: { type: 'spring', damping: 15 } }}
      className="rounded-theme-xl bg-theme-card/80 backdrop-blur-xl border border-theme/50 p-5 shadow-theme"
    >
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Smile className="w-5 h-5 text-accent" />
        </motion.div>
        <h3 className="font-semibold text-theme-primary text-sm">
          {t.dashboard.weeklyMood}
        </h3>
      </div>

      {hasData ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="h-40"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[1, 5]} ticks={[1, 3, 5]} tick={false} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  fontSize: '12px',
                }}
                formatter={(value: unknown) => {
                  const v = value as number;
                  return ['😢', '😐', '🙂', '😊', '🥰'][v - 1] || '—';
                }}
              />
              <Bar dataKey="mood" radius={[6, 6, 0, 0]} maxBarSize={36}>
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.mood ? moodColors[entry.mood - 1] : 'var(--border)'}
                    style={{ transition: 'fill 0.3s ease' }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="h-40 flex items-center justify-center"
        >
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-sm text-theme-muted"
          >
            {t.dashboard.noMoodData}
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );
}
