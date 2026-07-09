'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useDiaryStore } from '@/lib/store/diaryStore';
import { useCycleStore } from '@/lib/store/cycleStore';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { getInsights } from '@/lib/analysis';

export function AIInsightCard() {
  const entries = useDiaryStore((s) => s.entries);
  const cycles = useCycleStore((s) => s.cycles);
  const lang = useSettingsStore((s) => s.lang);
  const avgLength = useSettingsStore((s) => s.averageCycleLength);
  const avgPeriod = useSettingsStore((s) => s.averagePeriodLength);
  const [insightIdx, setInsightIdx] = useState(0);

  const insights = useMemo(() => {
    return getInsights(entries, cycles, avgLength, avgPeriod, lang);
  }, [entries, cycles, avgLength, avgPeriod, lang]);

  // Rotate insight every 10s
  useEffect(() => {
    if (insights.length <= 1) return;
    const interval = setInterval(() => {
      setInsightIdx((prev) => (prev + 1) % insights.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [insights.length]);

  if (insights.length === 0) return null;

  const currentInsight = insights[insightIdx % insights.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 22, stiffness: 180, delay: 0.35 }}
      className="rounded-theme-xl bg-theme-card border border-theme shadow-theme p-5 relative overflow-hidden"
    >
      <motion.div
        className="absolute -top-6 -right-6 w-16 h-16 text-accent/10 pointer-events-none"
        animate={{ rotate: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles className="w-full h-full" />
      </motion.div>
      <div className="flex items-start gap-3 relative z-10">
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-8 h-8 rounded-theme-lg bg-gradient-accent flex items-center justify-center shrink-0"
        >
          <Sparkles className="w-4 h-4 text-white" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-medium text-theme-muted uppercase tracking-wider mb-1">
            {lang === 'ru' ? 'Инсайт' : 'Insight'}
          </p>
          <motion.p
            key={`${insightIdx}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-theme-secondary leading-relaxed"
          >
            {currentInsight}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
