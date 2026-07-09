'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sparkles, Droplets } from 'lucide-react';
import { CycleRing } from '@/components/dashboard/CycleRing';
import { QuickLog } from '@/components/dashboard/QuickLog';
import { TodayTip } from '@/components/dashboard/TodayTip';
import { MoodChart } from '@/components/dashboard/MoodChart';
import { MoonPhaseWidget } from '@/components/widgets/MoonPhaseWidget';
import { DailyQuote } from '@/components/widgets/DailyQuote';
import { StatsCards } from '@/components/widgets/StatsCards';
import { SeasonIndicator } from '@/components/widgets/SeasonIndicator';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { PhaseAvatar } from '@/components/widgets/PhaseAvatar';
import { StreakGarden } from '@/components/widgets/StreakGarden';
import { InsightCards } from '@/components/insights/InsightCards';
import { WaterWidget } from '@/components/widgets/WaterWidget';
import { PhaseNutrition } from '@/components/wellness/PhaseNutrition';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Modal } from '@/ui/Modal';
import { useT } from '@/components/providers/AppProvider';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { useCycleStore, generateCycleId } from '@/lib/store/cycleStore';
import { format } from 'date-fns';
import type { Locale } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import { uk } from 'date-fns/locale/uk';
import { de } from 'date-fns/locale/de';
import { fr } from 'date-fns/locale/fr';
import { es } from 'date-fns/locale/es';
import { it } from 'date-fns/locale/it';
import { pt } from 'date-fns/locale/pt';
import { zhCN } from 'date-fns/locale/zh-CN';

const localeMap: Record<string, Locale> = {
  ru, uk, de, fr, es, it, pt, zh: zhCN,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
} as const;

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 200 } },
} as const;

export default function DashboardPage() {
  const t = useT();
  const lang = useSettingsStore((s) => s.lang);
  const addCycle = useCycleStore((s) => s.addCycle);
  const cycles = useCycleStore((s) => s.cycles);

  const [showQuickLog, setShowQuickLog] = useState(false);
  const [newPeriodDate, setNewPeriodDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showStartModal, setShowStartModal] = useState(false);

  const locale = localeMap[lang] || undefined;
  const todayStr = format(new Date(), 'd MMMM yyyy', { locale });

  const handleStartTracking = useCallback(() => {
    const id = generateCycleId();
    addCycle({ id, startDate: newPeriodDate, periodLength: 5, cycleLength: 28 });
    setShowStartModal(false);
  }, [newPeriodDate, addCycle]);

  const hasCycles = cycles.length > 0;

  return (
    <div className="relative min-h-[calc(100vh-6rem)]">
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-theme-primary tracking-tight">
                {t.dashboard.greeting}
              </h1>
              <p className="text-sm text-theme-muted mt-0.5">{todayStr}</p>
            </div>
            <div className="hidden sm:block">
              <PhaseAvatar size="md" />
            </div>
          </div>
        </motion.div>

        {!hasCycles && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
            className="mb-8"
          >
            <Card variant="glass">
              <div className="flex flex-col items-center text-center py-6">
                <motion.div
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Sparkles className="w-12 h-12 text-accent mb-4" />
                </motion.div>
                <h2 className="text-xl font-bold text-theme-primary mb-2">{t.dashboard.welcome}</h2>
                <p className="text-sm text-theme-secondary mb-6 max-w-md">{t.dashboard.welcomeDesc}</p>
                <Button variant="primary" size="lg" onClick={() => setShowStartModal(true)}>
                  <Plus className="w-4 h-4" />
                  {t.dashboard.startTracking}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {hasCycles && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <motion.div variants={childVariants} className="lg:col-span-1">
                <Card variant="glass">
                  <CycleRing />
                </Card>
              </motion.div>
              <motion.div variants={childVariants} className="lg:col-span-1">
                <Card variant="glass">
                  <InsightCards />
                </Card>
              </motion.div>
              <motion.div variants={childVariants} className="lg:col-span-2">
                <Card variant="glass">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-theme-primary text-sm">Streak Garden</h3>
                    <span className="text-[10px] text-theme-muted uppercase tracking-wider">Log daily to grow</span>
                  </div>
                  <StreakGarden />
                </Card>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <motion.div variants={childVariants} className="lg:col-span-3">
                <Card variant="glass">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-theme-primary text-sm">{t.dashboard.quickActions}</h3>
                    <Button variant="secondary" size="sm" onClick={() => setShowQuickLog(true)}>
                      <Plus className="w-3.5 h-3.5" />
                      {t.dashboard.logToday}
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
                    <TodayTip />
                    <DailyQuote />
                    <StatsCards />
                    <WaterWidget />
                  </div>
                </Card>
              </motion.div>
              <motion.div variants={childVariants}>
                <Card variant="glass">
                  <MoonPhaseWidget />
                  <div className="mt-3">
                    <SeasonIndicator />
                  </div>
                </Card>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <motion.div variants={childVariants} className="lg:col-span-2">
                <MoodChart />
              </motion.div>
              <motion.div variants={childVariants} className="lg:col-span-1">
                <TrendChart />
              </motion.div>
              <motion.div variants={childVariants} className="lg:col-span-1">
                <PhaseNutrition />
              </motion.div>
            </div>
          </motion.div>
        )}

        <div className="mt-8">
          <QuickLog open={showQuickLog} onClose={() => setShowQuickLog(false)} />
        </div>

        <Modal open={showStartModal} onClose={() => setShowStartModal(false)} title={t.dashboard.startTracking}>
          <p className="text-sm text-theme-secondary mb-4">{t.dashboard.startTrackingDesc}</p>
          <input
            type="date"
            value={newPeriodDate}
            onChange={(e) => setNewPeriodDate(e.target.value)}
            className="w-full bg-theme-card-hover/50 border border-theme rounded-theme-md p-3 text-sm text-theme-primary mb-4 outline-none transition-all focus:border-accent focus:shadow-[0_0_0_4px_var(--accent-glow)]"
          />
          <Button variant="primary" className="w-full" onClick={handleStartTracking}>
            {t.common.save}
          </Button>
        </Modal>
      </div>
    </div>
  );
}
