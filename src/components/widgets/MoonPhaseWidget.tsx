'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useT } from '@/components/providers/AppProvider';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { getMoonPhase, getMoonPhaseLabel } from '@/lib/moonPhase';

export function MoonPhaseWidget() {
  const t = useT();
  const lang = useSettingsStore((s) => s.lang);
  const moon = useMemo(() => getMoonPhase(new Date()), []);

  const phaseAngle = (() => {
    const map: Record<string, number> = {
      'new': 0, 'waxing-crescent': 45, 'first-quarter': 90,
      'waxing-gibbous': 135, 'full': 180, 'waning-gibbous': 225,
      'last-quarter': 270, 'waning-crescent': 315,
    };
    return map[moon.phase] || 0;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className="rounded-theme-xl bg-theme-card border border-theme shadow-theme p-5 flex flex-col items-center"
    >
      <svg width="80" height="80" viewBox="0 0 100 100" className="mb-3">
        <defs>
          <radialGradient id="moonGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent-light)" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.6" />
          </radialGradient>
          <clipPath id="moonClip">
            <circle cx="50" cy="50" r="42" />
          </clipPath>
        </defs>
        <circle cx="50" cy="50" r="44" fill="var(--border)" opacity="0.3" />
        <g clipPath="url(#moonClip)">
          <circle cx="50" cy="50" r="42" fill="url(#moonGrad)" />
          <motion.rect
            x={phaseAngle <= 180 ? 50 : 0}
            y="0"
            width="50"
            height="100"
            fill="var(--bg-primary)"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.ellipse
            cx={50 + (phaseAngle <= 180 ? 28 : -28) * Math.cos(phaseAngle * Math.PI / 180)}
            cy={50}
            rx={22 * Math.abs(Math.sin(phaseAngle * Math.PI / 180))}
            ry={35}
            fill="var(--bg-primary)"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </g>
        <circle cx="50" cy="50" r="44" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.2" />
      </svg>
      <motion.p
        key={moon.phase}
        initial={{ y: 6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-sm font-medium text-theme-primary"
      >
        {getMoonPhaseLabel(moon.phase, lang)}
      </motion.p>
      <p className="text-xs text-theme-muted mt-0.5">
        {moon.illumination}% {t.common.illuminated}
      </p>
    </motion.div>
  );
}
