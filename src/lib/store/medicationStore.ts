'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Medication, MedicationLog } from '@/types';

interface MedicationState {
  medications: Medication[];
  logs: MedicationLog[];
  addMedication: (med: Medication) => void;
  removeMedication: (id: string) => void;
  updateMedication: (id: string, data: Partial<Medication>) => void;
  addLog: (log: MedicationLog) => void;
  getLogsForDate: (date: string) => MedicationLog[];
}

export const useMedicationStore = create<MedicationState>()(
  persist(
    (set, get) => ({
      medications: [],
      logs: [],
      addMedication: (med) =>
        set((state) => ({ medications: [...state.medications, med] })),
      removeMedication: (id) =>
        set((state) => ({ medications: state.medications.filter((m) => m.id !== id) })),
      updateMedication: (id, data) =>
        set((state) => ({
          medications: state.medications.map((m) => (m.id === id ? { ...m, ...data } : m)),
        })),
      addLog: (log) =>
        set((state) => ({ logs: [...state.logs, log] })),
      getLogsForDate: (date) =>
        get().logs.filter((l) => l.date === date),
    }),
    { name: 'luna-medications' }
  )
);

export function generateMedicationId(): string {
  return `med-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
