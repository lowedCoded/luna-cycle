'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, BadgeCheck } from 'lucide-react';
import { tips } from '@/data/tips';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { useT } from '@/components/providers/AppProvider';

export function TodayTip() {
  const t = useT();
  const lang = useSettingsStore((s) => s.lang);
  const getLang = (rec: Record<string, string | undefined>) => rec[lang] || rec.en || '';

  const tip = useMemo(() => {
    const today = new Date().getDate();
    return tips[today % tips.length];
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 22, stiffness: 200, delay: 0.3 }}
      whileHover={{ y: -3, transition: { type: 'spring', damping: 15, stiffness: 300 } }}
      className="rounded-theme-xl bg-theme-card border border-theme p-5 shadow-theme relative overflow-hidden"
    >
      <motion.div
        className="absolute top-2 right-2 w-10 h-10 text-accent/5 pointer-events-none"
        animate={{ rotate: [0, 15, 0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Lightbulb className="w-full h-full" />
      </motion.div>
      <div className="flex items-start gap-3 relative z-10 pr-6">
        <motion.div
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-10 h-10 rounded-theme-lg bg-gradient-accent flex items-center justify-center shrink-0"
        >
          <Lightbulb className="w-5 h-5 text-white" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-theme-primary text-sm">{t.dashboard.todayTip}</h3>
            {tip.verified && (
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <BadgeCheck className="w-4 h-4 text-green-500" />
              </motion.div>
            )}
          </div>
          <motion.p
            key={`${tip.id}-title`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="text-sm font-medium text-theme-primary mb-1"
          >
            {getLang(tip.title)}
          </motion.p>
          <p className="text-xs text-theme-secondary leading-relaxed line-clamp-3">
            {getLang(tip.description)}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-theme-muted">{t.tips.source}: {tip.source}</span>
            {tip.verified && (
              <span className="text-[10px] text-green-500 flex items-center gap-0.5">
                <BadgeCheck className="w-3 h-3" /> {t.tips.verified}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
