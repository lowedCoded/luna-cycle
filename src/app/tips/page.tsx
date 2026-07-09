'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb,
  BadgeCheck,
  Heart,
  Apple,
  Dumbbell,
  Brain,
  Globe,
} from 'lucide-react';
import { useT } from '@/components/providers/AppProvider';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { tips } from '@/data/tips';
import type { TipCategory } from '@/types';

const categoryIcons: Record<TipCategory, typeof Heart> = {
  health: Heart,
  nutrition: Apple,
  sport: Dumbbell,
  psychology: Brain,
  general: Globe,
};

const categoryKeys: TipCategory[] = ['health', 'nutrition', 'sport', 'psychology', 'general'];

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring' as const, damping: 20, stiffness: 200, delay: i * 0.05 },
  }),
  exit: { opacity: 0, scale: 0.92, y: -10, transition: { duration: 0.15 } },
};

export default function TipsPage() {
  const t = useT();
  const lang = useSettingsStore((s) => s.lang);
  const getLang = (rec: Record<string, string | undefined>) => rec[lang] || rec.en || '';
  const [activeCategory, setActiveCategory] = useState<TipCategory | 'all'>('all');

  const filteredTips = useMemo(() => {
    if (activeCategory === 'all') return tips;
    return tips.filter((tip) => tip.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="relative min-h-[calc(100vh-6rem)]">
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-theme-primary">{t.tips.title}</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {['all', ...categoryKeys].map((cat) => {
            const label = t.tips.categories[cat as keyof typeof t.tips.categories] as string;
            const isActive = activeCategory === cat;
            const Icon = cat === 'all' ? Lightbulb : categoryIcons[cat as TipCategory];
            return (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveCategory(cat as TipCategory | 'all')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-accent text-white shadow-theme'
                    : 'bg-theme-card text-theme-secondary hover:bg-theme-card-hover border border-theme'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </motion.button>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredTips.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Lightbulb className="w-12 h-12 text-theme-muted mx-auto mb-3" />
                </motion.div>
                <p className="text-sm text-theme-muted">
                  {t.tips.noResults}
                </p>
              </motion.div>
            ) : (
              filteredTips.map((tip, i) => {
                const Icon = categoryIcons[tip.category];
                return (
                  <motion.div
                    key={tip.id}
                    layout
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover={{
                      y: -4,
                      boxShadow: 'var(--shadow-lg)',
                      transition: { type: 'spring', damping: 15, stiffness: 300 },
                    }}
                    className="rounded-theme-xl bg-theme-card border border-theme p-5 shadow-theme relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute top-0 right-0 w-24 h-24 opacity-[0.03] pointer-events-none"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    >
                      <Icon className="w-full h-full" />
                    </motion.div>
                    <div className="flex items-start gap-3 relative z-10">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                        className="w-10 h-10 rounded-theme-lg bg-gradient-accent flex items-center justify-center shrink-0"
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-medium text-theme-muted uppercase tracking-wider">
                            {t.tips.categories[tip.category] as string}
                          </span>
                          {tip.verified && (
                            <BadgeCheck className="w-3.5 h-3.5 text-green-500" />
                          )}
                        </div>
                        <h3 className="font-semibold text-theme-primary text-sm mb-1">
                          {getLang(tip.title)}
                        </h3>
                        <p className="text-xs text-theme-secondary leading-relaxed">
                          {getLang(tip.description)}
                        </p>
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-theme">
                          <span className="text-[10px] text-theme-muted">
                            {t.tips.source}: {tip.source}
                          </span>
                          {tip.verified && (
                            <span className="text-[10px] text-green-500 flex items-center gap-0.5 ml-auto">
                              <BadgeCheck className="w-3 h-3" /> {t.tips.verified}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
