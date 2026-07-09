'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Habit, HabitLog } from '@/types';

interface HabitState {
  habits: Habit[];
  logs: HabitLog[];
  addHabit: (habit: Habit) => void;
  removeHabit: (id: string) => void;
  toggleLog: (habitId: string, date: string) => void;
  getLogsForDate: (date: string) => HabitLog[];
  getStreak: (habitId: string) => number;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      logs: [],
      addHabit: (habit) =>
        set((state) => ({ habits: [...state.habits, habit] })),
      removeHabit: (id) =>
        set((state) => ({ habits: state.habits.filter((h) => h.id !== id) })),
      toggleLog: (habitId, date) =>
        set((state) => {
          const existing = state.logs.find((l) => l.habitId === habitId && l.date === date);
          if (existing) {
            return { logs: state.logs.filter((l) => !(l.habitId === habitId && l.date === date)) };
          }
          return { logs: [...state.logs, { habitId, date, done: true }] };
        }),
      getLogsForDate: (date) =>
        get().logs.filter((l) => l.date === date),
      getStreak: (habitId) => {
        const logs = get().logs.filter((l) => l.habitId === habitId && l.done);
        if (logs.length === 0) return 0;
        const dates = [...new Set(logs.map((l) => l.date))].sort().reverse();
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < dates.length; i++) {
          const expected = new Date(today);
          expected.setDate(expected.getDate() - i);
          const expectedStr = expected.toISOString().slice(0, 10);
          if (dates[i] === expectedStr) streak++;
          else break;
        }
        return streak;
      },
    }),
    { name: 'luna-habits' }
  )
);

export function generateHabitId(): string {
  return `hab-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
