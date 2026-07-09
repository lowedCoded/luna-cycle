'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cycle, CyclePhase } from '@/types';
import {
  addDays,
  differenceInDays,
  isAfter,
  isBefore,
  parseISO,
  startOfDay,
} from 'date-fns';

interface CycleState {
  cycles: Cycle[];
  addCycle: (cycle: Cycle) => void;
  removeCycle: (id: string) => void;
  getCurrentCycle: () => Cycle | undefined;
  getPhaseForDate: (date: Date, avgCycleLength: number, avgPeriodLength: number) => CyclePhase;
  predictNextPeriod: (avgCycleLength: number) => Date | null;
  getCycleDay: (avgCycleLength: number) => number;
  getDaysUntilNextPeriod: (avgCycleLength: number) => number | null;
}

export const useCycleStore = create<CycleState>()(
  persist(
    (set, get) => ({
      cycles: [],
      addCycle: (cycle) =>
        set((state) => ({ cycles: [...state.cycles, cycle].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()) })),
      removeCycle: (id) =>
        set((state) => ({ cycles: state.cycles.filter((c) => c.id !== id) })),
      getCurrentCycle: () => {
        const { cycles } = get();
        if (cycles.length === 0) return undefined;
        const now = new Date();
        const current = cycles.find((c) => {
          const start = parseISO(c.startDate);
          const end = c.endDate ? parseISO(c.endDate) : addDays(start, c.periodLength || 5);
          return !isBefore(now, start) && (c.endDate ? !isAfter(now, end) : true);
        });
        return current || cycles[0];
      },
      getPhaseForDate: (date, avgCycleLength, avgPeriodLength) => {
        const { cycles } = get();
        if (cycles.length === 0) {
          return 'follicular';
        }
        const sorted = [...cycles].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        const lastCycle = sorted[0];
        const lastStart = parseISO(lastCycle.startDate);
        const dayInCycle = differenceInDays(startOfDay(date), startOfDay(lastStart)) % avgCycleLength;

        if (dayInCycle < 0) return 'follicular';
        if (dayInCycle < avgPeriodLength) return 'menstrual';
        if (dayInCycle < 14) return 'follicular';
        if (dayInCycle < 16) return 'ovulation';
        return 'luteal';
      },
      predictNextPeriod: (avgCycleLength) => {
        const { cycles } = get();
        if (cycles.length === 0) return null;
        const sorted = [...cycles].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        const lastStart = parseISO(sorted[0].startDate);
        return addDays(lastStart, avgCycleLength);
      },
      getCycleDay: (avgCycleLength) => {
        const { cycles } = get();
        if (cycles.length === 0) return 1;
        const sorted = [...cycles].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        const lastStart = parseISO(sorted[0].startDate);
        const diff = differenceInDays(startOfDay(new Date()), startOfDay(lastStart));
        return (diff % avgCycleLength) + 1;
      },
      getDaysUntilNextPeriod: (avgCycleLength) => {
        const next = get().predictNextPeriod(avgCycleLength);
        if (!next) return null;
        const diff = differenceInDays(startOfDay(next), startOfDay(new Date()));
        return diff >= 0 ? diff : null;
      },
    }),
    { name: 'cycle-tracker-cycles' }
  )
);

export function generateCycleId(): string {
  return `cycle-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
