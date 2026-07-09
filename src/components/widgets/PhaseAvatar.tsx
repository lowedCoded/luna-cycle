'use client';

import { useId, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCycleStore } from '@/lib/store/cycleStore';
import { useDiaryStore } from '@/lib/store/diaryStore';
import { parseISO, isWithinInterval } from 'date-fns';
import type { CyclePhase } from '@/types';

function MoonIcon({ className, color }: { className?: string; color?: string }) {
  const maskId = useId();
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" style={{ color }}>
      <defs>
        <mask id={maskId}>
          <rect width="100" height="100" fill="white" />
          <circle cx="72" cy="50" r="38" fill="black" />
        </mask>
      </defs>
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <circle cx="50" cy="50" r="44" fill="currentColor" opacity="0.9" mask={`url(#${maskId})`} />
      <circle cx="28" cy="38" r="3.5" fill="currentColor" opacity="0.20" mask={`url(#${maskId})`} />
      <circle cx="24" cy="56" r="2.5" fill="currentColor" opacity="0.15" mask={`url(#${maskId})`} />
      <circle cx="34" cy="70" r="3" fill="currentColor" opacity="0.12" mask={`url(#${maskId})`} />
      <circle cx="62" cy="16" r="1.5" fill="currentColor" opacity="0.30" />
      <circle cx="72" cy="24" r="1" fill="currentColor" opacity="0.22" />
    </svg>
  );
}

function SunIcon({ className, color }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" style={{ color }}>
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <circle cx="50" cy="50" r="42" fill="currentColor" opacity="0.06" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const len = i % 2 === 0 ? 34 : 28;
        const inner = 30;
        const outer = inner + len;
        return (
          <line
            key={i}
            x1={50 + Math.cos(rad) * inner}
            y1={50 + Math.sin(rad) * inner}
            x2={50 + Math.cos(rad) * outer}
            y2={50 + Math.sin(rad) * outer}
            stroke="currentColor"
            strokeWidth={i % 2 === 0 ? 2.5 : 2}
            strokeLinecap="round"
            opacity={0.35}
          />
        );
      })}
      <circle cx="50" cy="50" r="22" fill="currentColor" opacity="0.9" />
      <circle cx="50" cy="50" r="16" fill="currentColor" opacity="0.15" />
    </svg>
  );
}

function SparkleIcon({ className, color }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" style={{ color }}>
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      <path d="M50 8 L56 36 L84 42 L56 48 L50 76 L44 48 L16 42 L44 36Z" fill="currentColor" opacity="0.85" />
      <path d="M50 18 L53 38 L73 41 L53 44 L50 64 L47 44 L27 41 L47 38Z" fill="currentColor" opacity="0.20" />
      <circle cx="72" cy="22" r="2" fill="currentColor" opacity="0.20" />
      <circle cx="28" cy="68" r="1.5" fill="currentColor" opacity="0.15" />
    </svg>
  );
}

function CloudMoonIcon({ className, color }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" style={{ color }}>
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      <path d="M62 16A30 30 0 1 0 62 82 24 24 0 1 1 62 16Z" fill="currentColor" opacity="0.50" />
      <circle cx="47" cy="35" r="2" fill="currentColor" opacity="0.15" />
      <circle cx="43" cy="48" r="1.5" fill="currentColor" opacity="0.12" />
      <path d="M28 62 Q36 54 44 62 Q52 54 60 62 Q68 54 74 62 L74 80 L28 80Z" fill="currentColor" opacity="0.15" />
      <path d="M30 66 Q38 58 46 66 Q54 58 62 66 Q70 58 76 66 L76 82 L30 82Z" fill="currentColor" opacity="0.10" />
    </svg>
  );
}

const phaseConfig: Record<CyclePhase, {
  icon: typeof MoonIcon;
  state: 'resting' | 'energetic' | 'radiant' | 'contemplative';
  color: string;
  particles: string[];
}> = {
  menstrual: {
    icon: MoonIcon,
    state: 'resting',
    color: 'var(--accent)',
    particles: ['💜', '✨', '🌙'],
  },
  follicular: {
    icon: SunIcon,
    state: 'energetic',
    color: 'var(--accent)',
    particles: ['☀️', '⚡', '🌸'],
  },
  ovulation: {
    icon: SparkleIcon,
    state: 'radiant',
    color: 'var(--accent)',
    particles: ['✨', '💫', '🌟'],
  },
  luteal: {
    icon: CloudMoonIcon,
    state: 'contemplative',
    color: 'var(--accent)',
    particles: ['🌧️', '☁️', '🫂'],
  },
};

const particleTrajectories = [
  { x: [0, -20], y: [0, -50], rotate: [0, -15] },
  { x: [0, 0], y: [0, -55], rotate: [0, 0] },
  { x: [0, 20], y: [0, -45], rotate: [0, 15] },
];

export function PhaseAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const getCurrentCycle = useCycleStore((s) => s.getCurrentCycle);
  const getPhaseForDate = useCycleStore((s) => s.getPhaseForDate);
  const entries = useDiaryStore((s) => s.entries);
  const currentCycle = getCurrentCycle();
  const avgCycleLength = useCycleStore((s) => s.cycles)[0]?.cycleLength || 28;
  const avgPeriodLength = useCycleStore((s) => s.cycles)[0]?.periodLength || 5;

  const phase: CyclePhase = useMemo(() => {
    if (!currentCycle) return 'follicular';
    return getPhaseForDate(new Date(), avgCycleLength, avgPeriodLength);
  }, [currentCycle, getPhaseForDate, avgCycleLength, avgPeriodLength]);

  const avgMood = useMemo(() => {
    if (!currentCycle) return 0;
    const start = parseISO(currentCycle.startDate);
    const end = currentCycle.endDate ? parseISO(currentCycle.endDate) : new Date();
    const cycleEntries = entries.filter((e) => {
      const d = parseISO(e.date);
      return isWithinInterval(d, { start, end });
    });
    if (cycleEntries.length === 0) return 0;
    return cycleEntries.reduce((sum, e) => sum + e.mood, 0) / cycleEntries.length;
  }, [currentCycle, entries]);

  const moodFactor = avgMood > 0 ? 0.5 + avgMood / 5 : 0.5;

  const config = phaseConfig[phase];
  const Icon = config.icon;

  const sizeMap = { sm: 'w-14 h-14', md: 'w-24 h-24', lg: 'w-32 h-32' };
  const iconSizes = { sm: 'w-7 h-7', md: 'w-12 h-12', lg: 'w-16 h-16' };
  const particleSizes = { sm: 'text-[8px]', md: 'text-xs', lg: 'text-sm' };

  return (
    <div className={`relative ${sizeMap[size]} flex items-center justify-center`}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: `radial-gradient(circle at center, ${config.color}35, ${config.color}08)` }}
        animate={{
          scale: [1, 1.08 + moodFactor * 0.06, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 4 - moodFactor, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative z-10"
        animate={{
          y: [0, -2 - moodFactor, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Icon className={`${iconSizes[size]}`} color={config.color} />
      </motion.div>

      <AnimatePresence>
        {config.particles.map((p, i) => (
          <motion.span
            key={i}
            className={`absolute pointer-events-none ${particleSizes[size]} z-20`}
            style={{ top: '45%', left: '50%' }}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
            animate={{
              opacity: [0, 0.9, 0],
              x: particleTrajectories[i].x,
              y: particleTrajectories[i].y,
              scale: [0.5, 1.1, 0.6],
              rotate: particleTrajectories[i].rotate,
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: i * 1.0,
              ease: 'easeOut',
            }}
          >
            {p}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
