'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme, Lang, UserSettings } from '@/types';

type SoundType = 'rain' | 'ocean' | 'wind';

interface SettingsState extends UserSettings {
  theme: Theme;
  lang: Lang;
  soundEnabled: boolean;
  soundType: SoundType;
  customCursor: boolean;
  notifications: boolean;
  setTheme: (theme: Theme) => void;
  setLang: (lang: Lang) => void;
  setCycleLength: (length: number) => void;
  setPeriodLength: (length: number) => void;
  setLastPeriodStart: (date: string | null) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundType: (type: SoundType) => void;
  toggleSound: () => void;
  setCustomCursor: (v: boolean) => void;
  setNotifications: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'romantic',
      lang: 'ru',
      averageCycleLength: 28,
      averagePeriodLength: 5,
      lastPeriodStart: null,
      soundEnabled: false,
      soundType: 'rain',
      customCursor: false,
      notifications: false,
      setTheme: (theme) => set({ theme }),
      setLang: (lang) => set({ lang }),
      setCycleLength: (averageCycleLength) => set({ averageCycleLength }),
      setPeriodLength: (averagePeriodLength) => set({ averagePeriodLength }),
      setLastPeriodStart: (lastPeriodStart) => set({ lastPeriodStart }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setSoundType: (soundType) => set({ soundType }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      setCustomCursor: (customCursor) => set({ customCursor }),
      setNotifications: (notifications) => set({ notifications }),
    }),
    { name: 'cycle-tracker-settings' }
  )
);
