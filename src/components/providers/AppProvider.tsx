'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { getTranslations, type Translations } from '@/lib/i18n';

const TranslationsContext = createContext<Translations>({} as Translations);

export function useT() {
  return useContext(TranslationsContext);
}

export function useLang() {
  return useSettingsStore((s) => s.lang);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const theme = useSettingsStore((s) => s.theme);
  const lang = useSettingsStore((s) => s.lang);
  const translations = getTranslations(lang);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <TranslationsContext.Provider value={translations}>
      {children}
    </TranslationsContext.Provider>
  );
}
