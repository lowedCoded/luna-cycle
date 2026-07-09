'use client';

import { useDiaryStore } from '@/lib/store/diaryStore';
import { format } from 'date-fns';
import { Droplets } from 'lucide-react';
import { motion } from 'framer-motion';

export function WaterWidget() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const entry = useDiaryStore((s) => s.entries.find((e) => e.date === today));
  const water = entry?.water ?? 0;
  const target = 8;
  const pct = Math.min(water / target, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-theme-xl bg-theme-card border border-theme shadow-theme p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <Droplets className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-theme-primary">Вода</h3>
      </div>
      <div className="flex items-end gap-3">
        <div className="relative w-12 h-20 rounded-theme-lg bg-blue-900/20 overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500/60 to-blue-400/30"
            initial={{ height: 0 }}
            animate={{ height: `${pct * 100}%` }}
            transition={{ type: 'spring', damping: 20 }}
          />
        </div>
        <div>
          <div className="text-2xl font-bold text-theme-primary tabular-nums">{water}</div>
          <div className="text-xs text-theme-muted">из {target} стак.</div>
        </div>
      </div>
    </motion.div>
  );
}
