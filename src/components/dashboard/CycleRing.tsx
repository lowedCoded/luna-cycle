'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { CyclePhase } from '@/types';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { useCycleStore } from '@/lib/store/cycleStore';
import { useT } from '@/components/providers/AppProvider';

const phaseColors: Record<CyclePhase, string> = {
  menstrual: 'var(--phase-menstrual)',
  follicular: 'var(--phase-follicular)',
  ovulation: 'var(--phase-ovulation)',
  luteal: 'var(--phase-luteal)',
};

const phaseKeyMap: Record<CyclePhase, keyof ReturnType<typeof useT>['dashboard']> = {
  menstrual: 'period',
  follicular: 'follicular',
  ovulation: 'ovulation',
  luteal: 'luteal',
};

export function CycleRing() {
  const t = useT();
  const theme = useSettingsStore((s) => s.theme);
  const avgLength = useSettingsStore((s) => s.averageCycleLength);
  const avgPeriod = useSettingsStore((s) => s.averagePeriodLength);
  const getCycleDay = useCycleStore((s) => s.getCycleDay);
  const getPhaseForDate = useCycleStore((s) => s.getPhaseForDate);
  const getDaysUntilNextPeriod = useCycleStore((s) => s.getDaysUntilNextPeriod);
  const cycles = useCycleStore((s) => s.cycles);

  const cycleDay = getCycleDay(avgLength);
  const daysUntil = getDaysUntilNextPeriod(avgLength);
  const currentPhase = getPhaseForDate(new Date(), avgLength, avgPeriod);
  const hasData = cycles.length > 0;

  const ringProgress = hasData ? (cycleDay / avgLength) * 100 : 0;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (circumference * ringProgress) / 100;

  const phaseInfo = useMemo(() => {
    const phaseKey = phaseKeyMap[currentPhase];
    const phaseName = t.dashboard[phaseKey] as string;

    const phaseDescs: Record<string, string> = {
      menstrual: theme === 'romantic' ? 'День восстановления' : theme === 'natural' ? 'Обновление' : 'Recovery',
      follicular: theme === 'romantic' ? 'Энергия растёт' : theme === 'natural' ? 'Рост' : 'Energy rising',
      ovulation: theme === 'romantic' ? 'Пик энергии' : theme === 'natural' ? 'Расцвет' : 'Peak energy',
      luteal: theme === 'romantic' ? 'Замедление' : theme === 'natural' ? 'Спад' : 'Wind down',
    };

    return {
      name: phaseName,
      desc: phaseDescs[currentPhase] || '',
      color: phaseColors[currentPhase],
    };
  }, [currentPhase, t, theme]);

  if (!hasData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="relative flex flex-col items-center justify-center p-8"
      >
        <motion.div
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-56 h-56 rounded-full bg-theme-card border-2 border-dashed border-theme flex items-center justify-center"
        >
          <div className="text-center">
            <p className="text-theme-muted text-sm">—</p>
            <p className="text-theme-secondary text-xs mt-2">{t.dashboard.noData}</p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 180 }}
      className="relative flex flex-col items-center justify-center p-6"
    >
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          boxShadow: [
            `0 0 20px ${phaseInfo.color}33`,
            `0 0 40px ${phaseInfo.color}22`,
            `0 0 20px ${phaseInfo.color}33`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <svg width="220" height="220" className="transform -rotate-90 relative z-10">
        <circle cx="110" cy="110" r="90" fill="none" stroke="var(--ring-track)" strokeWidth="8" strokeLinecap="round" />
        <motion.circle
          cx="110" cy="110" r="90" fill="none" stroke={phaseInfo.color}
          strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="110" cy="110" r="90" fill="none" stroke={phaseInfo.color}
          strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference}
          strokeDashoffset={circumference - (circumference * ringProgress) / 100}
          opacity={0.3}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={cycleDay}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 250 }}
          className="text-4xl font-bold text-theme-primary"
        >
          {cycleDay}
        </motion.span>
        <span className="text-xs text-theme-muted">{t.dashboard.cycleDay}</span>
        <motion.div
          key={currentPhase}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 18, stiffness: 200 }}
          className="mt-2 text-center"
        >
          <motion.span
            className="text-sm font-semibold text-theme-secondary"
            animate={{ color: [phaseInfo.color, 'var(--text-secondary)', phaseInfo.color] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {phaseInfo.name}
          </motion.span>
        </motion.div>
        {daysUntil !== null && (
          <div className="mt-1 flex items-center gap-1 text-xs text-theme-muted">
            <motion.span
              key={daysUntil}
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              {daysUntil}
            </motion.span>
            <span>{t.dashboard.daysUntil} {t.dashboard.nextPeriod.toLowerCase()}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
