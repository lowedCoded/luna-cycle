'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Moon } from 'lucide-react';
import { useT } from '@/components/providers/AppProvider';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { useCycleStore } from '@/lib/store/cycleStore';
import { getMoonPhase } from '@/lib/moonPhase';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay } from 'date-fns';

const moonChars: Record<string, string> = {
  'new': '🌑', 'waxing-crescent': '🌒', 'first-quarter': '🌓',
  'waxing-gibbous': '🌔', 'full': '🌕', 'waning-gibbous': '🌖',
  'last-quarter': '🌗', 'waning-crescent': '🌘',
};

const keyPhases = ['new', 'full'];

export function LunarCalendar() {
  const t = useT();
  const lang = useSettingsStore((s) => s.lang);
  const cycles = useCycleStore((s) => s.cycles);

  const monthDays = useMemo(() => {
    const now = new Date();
    const days = eachDayOfInterval({ start: startOfMonth(now), end: endOfMonth(now) });
    return days.map((d) => {
      const moon = getMoonPhase(d);
      return { date: d, phase: moon.phase, illumination: moon.illumination };
    });
  }, []);

  const todayMoon = useMemo(() => getMoonPhase(new Date()), []);

  // Find upcoming key moon phases
  const upcomingKey = useMemo(() => {
    return monthDays.filter((d) => keyPhases.includes(d.phase) && d.date > new Date()).slice(0, 3);
  }, [monthDays]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 22, stiffness: 180, delay: 0.25 }}
      className="rounded-theme-xl bg-theme-card border border-theme shadow-theme p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Moon className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-semibold text-theme-primary">Lunar Calendar</h3>
        <span className="text-xs text-theme-muted ml-auto">{format(new Date(), 'MMMM')}</span>
      </div>

      {/* Mini month grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Weekday headers */}
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="text-center text-[8px] font-medium text-theme-muted uppercase py-0.5">{d}</div>
        ))}

        {/* Day offsets */}
        {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay() || 7 }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {monthDays.map((d) => {
          const isToday = isSameDay(d.date, new Date());
          const isKey = keyPhases.includes(d.phase);
          return (
            <div
              key={d.date.toISOString()}
              className={`relative flex items-center justify-center aspect-square rounded-md text-[9px] cursor-default transition-all ${
                isToday ? 'bg-accent/20 ring-1 ring-accent' : 'hover:bg-theme-card-hover'
              }`}
              title={`${format(d.date, 'MMM d')} — ${d.phase} (${d.illumination}%)`}
            >
              {isKey ? (
                <span className="text-sm">{moonChars[d.phase]}</span>
              ) : (
                <span className="text-theme-muted text-[8px]">{d.illumination >= 50 ? '🌔' : '🌘'}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Upcoming key phases */}
      {upcomingKey.length > 0 && (
        <div className="mt-3 pt-3 border-t border-theme space-y-1">
          <p className="text-[10px] text-theme-muted font-medium">Upcoming key phases</p>
          {upcomingKey.map((d) => (
            <div key={d.date.toISOString()} className="flex items-center gap-2 text-[10px] text-theme-secondary">
              <span>{moonChars[d.phase]}</span>
              <span className="font-medium">{format(d.date, 'MMM d')}</span>
              <span className="text-theme-muted capitalize">{d.phase}</span>
            </div>
          ))}
        </div>
      )}

      {/* Today's moon phase */}
      <div className="mt-3 pt-3 border-t border-theme flex items-center gap-2 text-xs text-theme-secondary">
        <span className="text-base">{moonChars[todayMoon.phase]}</span>
        <span className="font-medium text-theme-primary capitalize">{todayMoon.phase}</span>
        <span className="text-theme-muted">({todayMoon.illumination}% illuminated)</span>
      </div>
    </motion.div>
  );
}
