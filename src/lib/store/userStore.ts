'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '@/types';

interface UserState {
  profile: UserProfile | null;
  register: (nickname: string) => void;
  updateNickname: (nickname: string) => void;
  isRegistered: () => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      register: (nickname) =>
        set({
          profile: {
            nickname,
            registeredAt: new Date().toISOString(),
          },
        }),
      updateNickname: (nickname) =>
        set((state) => {
          if (!state.profile) return state;
          return { profile: { ...state.profile, nickname } };
        }),
      isRegistered: () => get().profile !== null,
    }),
    { name: 'luna-user' }
  )
);
