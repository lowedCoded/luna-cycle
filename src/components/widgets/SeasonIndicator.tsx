'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useT } from '@/components/providers/AppProvider';
import { Snowflake, Sun, Cloud, CloudRain } from 'lucide-react';

type Season = 'spring' | 'summer' | 'autumn' | 'winter';

function getSeason(date: Date): Season {
  const m = date.getMonth();
  if (m >= 2 && m <= 4) return 'spring';
  if (m >= 5 && m <= 7) return 'summer';
  if (m >= 8 && m <= 10) return 'autumn';
  return 'winter';
}

const seasonConfig: Record<Season, {
  icon: typeof Sun;
  colors: string[];
  bgGradient: string;
  particles: number;
  animateY: [number, number, number];
}> = {
  spring: {
    icon: Cloud,
    colors: ['#f0c4d8', '#c4e0a0', '#d4a0c4', '#f7d4e0'],
    bgGradient: 'radial-gradient(circle at 50% 0%, rgba(240,196,216,0.15) 0%, transparent 70%)',
    particles: 12,
    animateY: [0, -40, 0],
  },
  summer: {
    icon: Sun,
    colors: ['#ffe082', '#ffab91', '#ff8a65', '#ffd54f'],
    bgGradient: 'radial-gradient(circle at 50% 0%, rgba(255,224,130,0.15) 0%, transparent 70%)',
    particles: 14,
    animateY: [0, -20, 0],
  },
  autumn: {
    icon: CloudRain,
    colors: ['#d4a060', '#c07a50', '#a06040', '#e8b878'],
    bgGradient: 'radial-gradient(circle at 50% 0%, rgba(212,160,96,0.12) 0%, transparent 70%)',
    particles: 12,
    animateY: [0, 30, 0],
  },
  winter: {
    icon: Snowflake,
    colors: ['#c8dce8', '#a8c8e0', '#88b4d0', '#dce8f0'],
    bgGradient: 'radial-gradient(circle at 50% 0%, rgba(200,220,232,0.15) 0%, transparent 70%)',
    particles: 16,
    animateY: [0, 50, 0],
  },
};

export function SeasonIndicator() {
  const t = useT();
  const season = useMemo(() => getSeason(new Date()), []);
  const cfg = seasonConfig[season];
  const Icon = cfg.icon;
  const seasonLabel = t.common[season];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.1 }}
      className="rounded-theme-xl bg-theme-card border border-theme shadow-theme p-5 flex flex-col items-center relative overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: cfg.bgGradient }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      {Array.from({ length: cfg.particles }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute ${i % 3 === 0 ? 'w-2 h-2' : 'w-1.5 h-1.5'} rounded-full`}
          style={{
            background: cfg.colors[i % cfg.colors.length],
            top: `${40 + (i * 7) % 50}%`,
            left: `${10 + (i * 13) % 80}%`,
          }}
          animate={{
            y: cfg.animateY,
            x: [0, (i % 2 === 0 ? 15 : -15), 0],
            opacity: [0.3, 0.9, 0.3],
            scale: [0.6, 1.1, 0.6],
          }}
          transition={{
            duration: 3 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
      <motion.div
        animate={{ rotate: [0, 12, 0, -12, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10"
      >
        <Icon className="w-8 h-8" style={{ color: cfg.colors[0] }} />
      </motion.div>
      <span className="text-sm font-medium text-theme-primary mt-2 relative z-10">
        {seasonLabel}
      </span>
    </motion.div>
  );
}
