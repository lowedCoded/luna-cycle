'use client';

import { motion } from 'framer-motion';
import { Sparkles, Flower2 } from 'lucide-react';
import { useUserStore } from '@/lib/store/userStore';
import { useT } from '@/components/providers/AppProvider';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import { uk } from 'date-fns/locale/uk';
import { de } from 'date-fns/locale/de';
import { fr } from 'date-fns/locale/fr';
import { es } from 'date-fns/locale/es';
import type { Locale } from 'date-fns';
import { useSettingsStore } from '@/lib/store/settingsStore';

const localeMap: Record<string, Locale | undefined> = { ru, uk, de, fr, es };

export function Greeting() {
  const t = useT();
  const profile = useUserStore((s) => s.profile);
  const lang = useSettingsStore((s) => s.lang);
  const dateLocale = localeMap[lang];

  if (!profile) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className="flex items-center gap-3 mb-6"
    >
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
        className="flex items-center gap-2.5 px-4 py-2 rounded-theme-lg bg-theme-card border border-theme shadow-theme relative overflow-hidden"
      >
        <motion.div
          animate={{ rotate: [0, 8, 0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Flower2 className="w-4 h-4 text-accent" />
        </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-medium text-theme-primary"
          >
            {t.auth.greeting},{' '}
            <motion.span
              className="text-accent font-semibold inline-block"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {profile.nickname}
            </motion.span>
          </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-[11px] text-theme-muted hidden sm:inline"
        >
          {format(new Date(), 'd MMMM', { locale: dateLocale })}
        </motion.span>

        {/* Sparkle trail */}
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        >
          <Sparkles className="w-3 h-3 text-accent" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
