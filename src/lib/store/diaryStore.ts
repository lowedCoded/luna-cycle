'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DiaryEntry } from '@/types';

interface DiaryState {
  entries: DiaryEntry[];
  customSymptoms: string[];
  addEntry: (entry: DiaryEntry) => void;
  removeEntry: (id: string) => void;
  getEntryByDate: (date: string) => DiaryEntry | undefined;
  getAllTags: () => string[];
  addCustomSymptom: (symptom: string) => void;
  removeCustomSymptom: (symptom: string) => void;
}

export const useDiaryStore = create<DiaryState>()(
  persist(
    (set, get) => ({
      entries: [],
      customSymptoms: [],
      addEntry: (entry) =>
        set((state) => {
          const existing = state.entries.findIndex((e) => e.date === entry.date);
          if (existing >= 0) {
            const updated = [...state.entries];
            updated[existing] = entry;
            return { entries: updated };
          }
          return { entries: [...state.entries, entry].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) };
        }),
      removeEntry: (id) =>
        set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),
      getEntryByDate: (date) => {
        return get().entries.find((e) => e.date === date);
      },
      getAllTags: () => {
        const tags = new Set<string>();
        get().entries.forEach((e) => e.tags?.forEach((t) => tags.add(t)));
        return Array.from(tags).sort();
      },
      addCustomSymptom: (symptom) =>
        set((state) => {
          if (state.customSymptoms.includes(symptom)) return state;
          return { customSymptoms: [...state.customSymptoms, symptom].sort() };
        }),
      removeCustomSymptom: (symptom) =>
        set((state) => ({ customSymptoms: state.customSymptoms.filter((s) => s !== symptom) })),
    }),
    { name: 'cycle-tracker-diary' }
  )
);

export function generateDiaryId(): string {
  return `diary-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
