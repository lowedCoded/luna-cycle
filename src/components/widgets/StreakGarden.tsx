'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDiaryStore } from '@/lib/store/diaryStore';
import { subDays, format } from 'date-fns';

const FLOWER_COLORS = ['#e8a0b4', '#a8d8ea', '#f0c27f', '#c4a0d4', '#6b8f71'];

function Flower({ stage, color, delay }: { stage: number; color: string; delay: number }) {
  const scale = 0.3 + stage * 0.18;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale, rotate: 0 }}
      transition={{ type: 'spring', damping: 15, stiffness: 150, delay }}
      className="relative w-10 h-10 flex items-center justify-center"
    >
      {stage >= 1 && (
        <motion.div
          className="absolute bottom-0 w-0.5 rounded-full"
          style={{
            height: `${8 + stage * 4}px`,
            background: `linear-gradient(to top, ${color}, transparent)`,
            transformOrigin: 'bottom',
          }}
          animate={{ scaleY: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay }}
        />
      )}
      {stage >= 2 && (
        <motion.div
          className="absolute w-3 h-3 rounded-full"
          style={{ background: color, opacity: 0.3 + stage * 0.15, top: '30%' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2 + delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      {stage >= 4 && (
        <>
          {[0, 60, 120, 180, 240].map((angle) => (
            <motion.div
              key={angle}
              className="absolute w-1 h-2 rounded-full"
              style={{
                background: color,
                opacity: 0.6,
                transform: `rotate(${angle}deg) translateY(-6px)`,
                transformOrigin: 'center bottom',
              }}
              animate={{ scale: [1, 0.8, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: delay + angle / 360 }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}

export function StreakGarden() {
  const entries = useDiaryStore((s) => s.entries);

  const plants = useMemo(() => {
    return Array.from({ length: 9 }, (_, i) => {
      const offset = 8 - i;
      const dateStr = format(subDays(new Date(), offset), 'yyyy-MM-dd');
      const entry = entries.find((e) => e.date === dateStr);
      const logged = !!entry;
      const daysSince = offset;
      const stage = logged ? Math.min(4, Math.floor(daysSince / 2) + 1) : Math.max(0, 3 - Math.floor(daysSince / 3));
      return { stage, color: FLOWER_COLORS[i % FLOWER_COLORS.length], delay: i * 0.08 };
    });
  }, [entries]);

  return (
    <div className="grid grid-cols-3 gap-2 justify-items-center">
      {plants.map((p, i) => (
        <Flower key={i} stage={p.stage} color={p.color} delay={p.delay} />
      ))}
    </div>
  );
}
