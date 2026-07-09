'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { useDiaryStore } from '@/lib/store/diaryStore';
import { useT } from '@/components/providers/AppProvider';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { subDays, format } from 'date-fns';

export function TrendChart() {
  const t = useT();
  const entries = useDiaryStore((s) => s.entries);

  const data = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const entry = entries.find((e) => e.date === dateStr);
      return {
        date: format(date, 'd MMM'),
        mood: entry?.mood ?? null,
        pain: entry?.pain ?? null,
        symptoms: entry?.symptoms?.length ?? 0,
      };
    });
    return last30Days;
  }, [entries]);

  const hasData = data.some((d) => d.mood !== null);

  if (!hasData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 22, stiffness: 200, delay: 0.4 }}
      className="rounded-theme-xl bg-theme-card border border-theme p-5 shadow-theme"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-theme-primary text-sm">{t.dashboard.moodTrend}</h3>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis domain={[0, 5]} tick={false} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                fontSize: '12px',
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
            <Line type="monotone" dataKey="mood" stroke="var(--accent)" strokeWidth={2} dot={{ r: 3 }} connectNulls name="Mood" />
            <Line type="monotone" dataKey="pain" stroke="var(--mood-1)" strokeWidth={2} dot={{ r: 3 }} connectNulls name="Pain" />
            <Line type="monotone" dataKey="symptoms" stroke="var(--phase-luteal)" strokeWidth={2} dot={{ r: 3 }} connectNulls name="Symptoms" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
