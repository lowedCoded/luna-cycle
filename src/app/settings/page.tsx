'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Palette,
  Languages,
  RotateCcw,
  Download,
  AlertTriangle,
  Save,
  Trash2,
  Flower2,
  Leaf,
  Sparkles,
  Moon,
  Sun,
  Snowflake,
  User,
  Volume2,
  VolumeX,
  FileText,
  Music,
  MousePointer2,
  Bell,
} from 'lucide-react';
import { useT } from '@/components/providers/AppProvider';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { HealthReport } from '@/components/report/HealthReport';
import { useCycleStore, generateCycleId } from '@/lib/store/cycleStore';
import { useUserStore } from '@/lib/store/userStore';
import { ambientSound } from '@/lib/sound';
import { format, parseISO } from 'date-fns';
import type { Theme, Lang, DiaryEntry } from '@/types';

const themeConfig: { key: Theme; icon: typeof Flower2; labelEn: string; labelRu: string; vibe: string; vibeRu: string; colors: string[] }[] = [
  { key: 'romantic', icon: Flower2, labelEn: 'Blush & Rose', labelRu: 'Румянец и Роза', vibe: 'warm, romantic, luxurious', vibeRu: 'тёплая, романтичная, роскошная', colors: ['#faf0f2', '#d45a7a', '#f0b070'] },
  { key: 'natural', icon: Leaf, labelEn: 'Sage & Clay', labelRu: 'Шалфей и Глина', vibe: 'earthy, organic, grounded', vibeRu: 'природная, органичная, земная', colors: ['#f4efe8', '#3d7a5a', '#c48050'] },
  { key: 'modern', icon: Sparkles, labelEn: 'Midnight & Violet', labelRu: 'Полночь и Фиолет', vibe: 'cosmic, edgy, bold', vibeRu: 'космическая, смелая, дерзкая', colors: ['#080812', '#8b5cf6', '#06b6d4'] },
  { key: 'serene', icon: Moon, labelEn: 'Mist & Lavender', labelRu: 'Дымка и Лаванда', vibe: 'airy, calm, ethereal', vibeRu: 'воздушная, спокойная, невесомая', colors: ['#f5f3ff', '#9d8ec9', '#b8c8e8'] },
  { key: 'cozy', icon: Sun, labelEn: 'Honey & Amber', labelRu: 'Мёд и Янтарь', vibe: 'warm, hug-like, autumnal', vibeRu: 'уютная, обволакивающая, осенняя', colors: ['#faf0e6', '#c47a3a', '#d4a850'] },
  { key: 'frost', icon: Snowflake, labelEn: 'Ice & Steel', labelRu: 'Лёд и Сталь', vibe: 'crisp, clean, modern', vibeRu: 'чистая, холодная, современная', colors: ['#f8fafc', '#5b8def', '#a0c0f8'] },
  { key: 'moon', icon: Moon, labelEn: 'Obsidian & Pearl', labelRu: 'Обсидиан и Жемчуг', vibe: 'elegant, calm, nocturnal', vibeRu: 'элегантная, спокойная, ночная', colors: ['#0e0e16', '#7c8fa0', '#b0c0d0'] },
  { key: 'coral', icon: Sparkles, labelEn: 'Sunset Reef', labelRu: 'Коралловый Риф', vibe: 'vibrant, tropical, warm', vibeRu: 'яркая, тропическая, тёплая', colors: ['#fff5f0', '#ff7f6e', '#ffb070'] },
  { key: 'jade', icon: Leaf, labelEn: 'Botanical Luxe', labelRu: 'Ботанический Люкс', vibe: 'fresh, premium, natural', vibeRu: 'свежая, премиальная, природная', colors: ['#f4f9f4', '#3a9d6e', '#50b888'] },
  { key: 'terracotta', icon: Sun, labelEn: 'Mediterranean Clay', labelRu: 'Средиземноморская Глина', vibe: 'earthy, warm, rustic', vibeRu: 'земная, тёплая, деревенская', colors: ['#faf0ea', '#c47048', '#d4a070'] },
  { key: 'lavender', icon: Flower2, labelEn: 'Blooming Garden', labelRu: 'Цветущий Сад', vibe: 'mystical, elegant, serene', vibeRu: 'мистическая, элегантная, безмятежная', colors: ['#f8f5ff', '#9b7ec8', '#c0a0e0'] },
  { key: 'ocean', icon: Moon, labelEn: 'Deep Blue Calm', labelRu: 'Глубокий Синий', vibe: 'calm, trustworthy, deep', vibeRu: 'спокойная, надёжная, глубокая', colors: ['#f0f8fc', '#2a7a9a', '#60b8d8'] },
  { key: 'sunset', icon: Sparkles, labelEn: 'Twilight Drama', labelRu: 'Закатная Драма', vibe: 'bold, dramatic, fiery', vibeRu: 'смелая, драматичная, огненная', colors: ['#1a0a18', '#e06050', '#f0c040'] },
  { key: 'rosegold', icon: Flower2, labelEn: 'Precious Glow', labelRu: 'Розовое Золото', vibe: 'luxurious, soft, refined', vibeRu: 'роскошная, мягкая, изысканная', colors: ['#faf0f0', '#d4a0a8', '#e8c8a8'] },
  { key: 'charcoal', icon: Moon, labelEn: 'Monochrome Minimal', labelRu: 'Монохромный Минимум', vibe: 'sleek, modern, minimal', vibeRu: 'гладкая, современная, минимальная', colors: ['#121216', '#8a8a9a', '#b0b0be'] },
  { key: 'forest', icon: Leaf, labelEn: 'Deep Woods', labelRu: 'Глубокий Лес', vibe: 'grounded, earthy, calm', vibeRu: 'приземлённая, земная, спокойная', colors: ['#f2f6ef', '#2d6a3a', '#c48040'] },
  { key: 'blush', icon: Flower2, labelEn: 'Watercolor Soft', labelRu: 'Акварельная Нежность', vibe: 'delicate, airy, gentle', vibeRu: 'деликатная, воздушная, нежная', colors: ['#fdf8fb', '#e0a0b0', '#f0c8b8'] },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring' as const, damping: 22, stiffness: 200, delay: i * 0.08 },
  }),
};

type SoundType = 'rain' | 'ocean' | 'wind';

const soundOptions: { key: SoundType; labelRu: string; labelEn: string; icon: typeof Volume2 }[] = [
  { key: 'rain', labelRu: 'Дождь', labelEn: 'Rain', icon: Volume2 },
  { key: 'ocean', labelRu: 'Океан', labelEn: 'Ocean', icon: Music },
  { key: 'wind', labelRu: 'Ветер', labelEn: 'Wind', icon: Volume2 },
];

export default function SettingsPage() {
  const t = useT();
  const theme = useSettingsStore((s) => s.theme);
  const lang = useSettingsStore((s) => s.lang);
  const avgCycleLength = useSettingsStore((s) => s.averageCycleLength);
  const avgPeriodLength = useSettingsStore((s) => s.averagePeriodLength);
  const lastPeriodStart = useSettingsStore((s) => s.lastPeriodStart);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const soundType = useSettingsStore((s) => s.soundType);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const setLang = useSettingsStore((s) => s.setLang);
  const setCycleLength = useSettingsStore((s) => s.setCycleLength);
  const setPeriodLength = useSettingsStore((s) => s.setPeriodLength);
  const setLastPeriodStart = useSettingsStore((s) => s.setLastPeriodStart);
  const setSoundEnabled = useSettingsStore((s) => s.setSoundEnabled);
  const setSoundType = useSettingsStore((s) => s.setSoundType);
  const customCursor = useSettingsStore((s) => s.customCursor);
  const setCustomCursor = useSettingsStore((s) => s.setCustomCursor);
  const notifications = useSettingsStore((s) => s.notifications);
  const setNotifications = useSettingsStore((s) => s.setNotifications);

  const profile = useUserStore((s) => s.profile);
  const updateNickname = useUserStore((s) => s.updateNickname);
  const addCycle = useCycleStore((s) => s.addCycle);
  const cycles = useCycleStore((s) => s.cycles);
  const removeCycle = useCycleStore((s) => s.removeCycle);

  const [localCycleLength, setLocalCycleLength] = useState(avgCycleLength);
  const [localPeriodLength, setLocalPeriodLength] = useState(avgPeriodLength);
  const [localLastPeriod, setLocalLastPeriod] = useState(lastPeriodStart || '');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDeleteCycle, setConfirmDeleteCycle] = useState<string | null>(null);

  const handleSave = useCallback(() => {
    setCycleLength(localCycleLength);
    setPeriodLength(localPeriodLength);
    setLastPeriodStart(localLastPeriod || null);
    if (localLastPeriod) {
      addCycle({
        id: generateCycleId(),
        startDate: localLastPeriod,
        periodLength: localPeriodLength,
        cycleLength: localCycleLength,
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [localCycleLength, localPeriodLength, localLastPeriod, setCycleLength, setPeriodLength, setLastPeriodStart, addCycle]);

  const handleClearData = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      window.location.reload();
    }
  }, []);

  const handleExport = useCallback(() => {
    const data = {
      settings: { theme, lang, averageCycleLength: avgCycleLength, averagePeriodLength: avgPeriodLength, lastPeriodStart },
      cycles: JSON.parse(localStorage.getItem('cycle-tracker-cycles') || '{}'),
      diary: JSON.parse(localStorage.getItem('cycle-tracker-diary') || '{}'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `luna-cycle-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [theme, lang, avgCycleLength, avgPeriodLength, lastPeriodStart]);

  const handleCsvExport = useCallback(() => {
    const raw = localStorage.getItem('cycle-tracker-diary');
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const entries: DiaryEntry[] = parsed?.state?.entries || [];

    const pmddKeys = ['irritability', 'anxiety', 'depression', 'crying_spells', 'overwhelm', 'anger', 'hopelessness'] as const;
    const headers = ['Date', 'Mood', 'Pain', 'Flow', 'Symptoms', 'Notes', 'Tags', 'Water', 'Sleep', 'BBT', 'Energy', 'Stress', ...pmddKeys.map(k => 'PMDD_' + k)];

    const rows = entries.map(e => {
      const pmdd = e.pmdd || {};
      return [
        e.date,
        e.mood ?? '',
        e.pain ?? '',
        e.flow ?? '',
        (e.symptoms || []).join('; '),
        `"${(e.notes || '').replace(/"/g, '""')}"`,
        (e.tags || []).join('; '),
        e.water ?? '',
        e.sleep ?? '',
        e.bbt ?? '',
        e.energy ?? '',
        e.stress ?? '',
        ...pmddKeys.map(k => pmdd[k as keyof typeof pmdd] ?? ''),
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `luna-symptoms-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const toggleSound = useCallback(() => {
    if (soundEnabled) {
      ambientSound.stop();
    } else {
      ambientSound.start(soundType);
    }
    setSoundEnabled(!soundEnabled);
  }, [soundEnabled, soundType, setSoundEnabled]);

  const changeSoundType = useCallback((type: SoundType) => {
    setSoundType(type);
    if (soundEnabled) {
      ambientSound.start(type);
    }
  }, [soundEnabled, setSoundType]);

  const sections = [
    { id: 'theme', content: (
      <>
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-theme-accent" />
          <h2 className="text-lg font-semibold text-theme-primary">{t.settings.theme}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {themeConfig.map((cfg) => {
            const Icon = cfg.icon;
            const isActive = theme === cfg.key;
            return (
              <motion.button
                key={cfg.key}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setTheme(cfg.key)}
                className={`relative rounded-theme-lg p-4 border-2 transition-all ${
                  isActive ? 'border-[var(--accent)] shadow-theme shadow-theme-lg' : 'border-theme hover:border-[var(--accent)]'
                }`}
                style={{ background: cfg.colors[0] }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-1">
                    {cfg.colors.map((color, i) => (
                      <div key={i} className="w-4 h-4 rounded-full ring-2 ring-white/30" style={{ background: color }} />
                    ))}
                  </div>
                  <Icon className="w-5 h-5" style={{ color: cfg.colors[1] }} />
                  <span className="text-xs font-semibold" style={{ color: cfg.colors[2] }}>
                    {lang === 'ru' ? cfg.labelRu : cfg.labelEn}
                  </span>
                  <span className="text-[8px] opacity-60" style={{ color: cfg.colors[2] }}>
                    {lang === 'ru' ? cfg.vibeRu : cfg.vibe}
                  </span>
                </div>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gradient-accent flex items-center justify-center shadow-lg"
                  >
                    <span className="text-white text-[10px]">✓</span>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </>
    )},
    { id: 'language', content: (
      <>
        <div className="flex items-center gap-2 mb-4">
          <Languages className="w-5 h-5 text-theme-accent" />
          <h2 className="text-lg font-semibold text-theme-primary">{t.settings.language}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {(['en', 'ru', 'uk', 'de', 'fr', 'es', 'it', 'pt', 'zh', 'ar'] as Lang[]).map((l) => (
            <motion.button
              key={l}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setLang(l)}
              className={`py-2.5 px-3 rounded-theme-lg text-sm font-medium transition-all ${
                lang === l ? 'bg-gradient-accent text-white shadow-theme' : 'bg-theme-card-hover text-theme-secondary hover:bg-theme-card'
              }`}
            >
              {l === 'en' ? 'English' : l === 'ru' ? 'Русский' : l === 'uk' ? 'Українська' : l === 'de' ? 'Deutsch' : l === 'fr' ? 'Français' : l === 'es' ? 'Español' : l === 'it' ? 'Italiano' : l === 'pt' ? 'Português' : l === 'zh' ? '中文' : 'العربية'}
            </motion.button>
          ))}
        </div>
      </>
    )},
    { id: 'profile', content: (
      <>
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-theme-accent" />
          <h2 className="text-lg font-semibold text-theme-primary">{t.auth.editNickname}</h2>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            defaultValue={profile?.nickname || ''}
            maxLength={30}
            onBlur={(e) => {
              const val = e.target.value.trim();
              if (val) updateNickname(val);
            }}
            className="flex-1 bg-theme-card-hover border border-theme rounded-theme-md p-2.5 text-sm text-theme-primary outline-none transition-all focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-glow)]"
          />
        </div>
        <p className="text-xs text-theme-muted mt-2">
          {t.auth.editNicknameHint}
        </p>
      </>
    )},
    { id: 'sound', content: (
      <>
        <div className="flex items-center gap-2 mb-4">
          <Music className="w-5 h-5 text-theme-accent" />
          <h2 className="text-lg font-semibold text-theme-primary">
            {t.settings.ambientSound}
          </h2>
        </div>
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleSound}
            className={`flex items-center gap-3 w-full p-3 rounded-theme-lg border transition-all ${
              soundEnabled ? 'border-[var(--accent)] bg-theme-card-hover' : 'border-theme'
            }`}
          >
            <motion.div
              animate={soundEnabled ? { rotate: [0, 15, 0, -15, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-accent" /> : <VolumeX className="w-5 h-5 text-theme-muted" />}
            </motion.div>
            <span className="flex-1 text-sm font-medium text-theme-primary">
              {soundEnabled ? t.settings.soundOn : t.settings.enableSound}
            </span>
          </motion.button>

          {soundEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex gap-2"
            >
              {soundOptions.map((opt) => {
                const Icon = opt.icon;
                const isActive = soundType === opt.key;
                return (
                  <motion.button
                    key={opt.key}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => changeSoundType(opt.key)}
                    className={`flex-1 py-2 rounded-theme-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                      isActive ? 'bg-gradient-accent text-white shadow-theme' : 'bg-theme-card-hover text-theme-secondary'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {lang === 'ru' ? opt.labelRu : opt.labelEn}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
          <p className="text-[10px] text-theme-muted">
            {t.settings.soundGenerated}
          </p>
        </div>
        <div className="flex items-center justify-between p-4 rounded-theme-lg border border-theme bg-theme-card-hover/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-theme-md transition-colors ${customCursor ? 'bg-accent/10' : 'bg-theme-card-hover'}`}>
              <MousePointer2 className={`w-5 h-5 ${customCursor ? 'text-accent' : 'text-theme-muted'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-theme-primary">Custom Cursor</p>
              <p className="text-xs text-theme-muted">Animated cursor trail</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setCustomCursor(!customCursor)}
            className={`relative w-11 h-6 rounded-full transition-colors ${customCursor ? 'bg-accent' : 'bg-theme-card-hover'}`}
          >
            <motion.div
              animate={{ x: customCursor ? 22 : 2 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
            />
          </motion.button>
        </div>
        <div className="flex items-center justify-between p-4 rounded-theme-lg border border-theme bg-theme-card-hover/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-theme-md transition-colors ${notifications ? 'bg-accent/10' : 'bg-theme-card-hover'}`}>
              <Bell className={`w-5 h-5 ${notifications ? 'text-accent' : 'text-theme-muted'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-theme-primary">Notifications</p>
              <p className="text-xs text-theme-muted">Period & phase reminders</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setNotifications(!notifications)}
            className={`relative w-11 h-6 rounded-full transition-colors ${notifications ? 'bg-accent' : 'bg-theme-card-hover'}`}
          >
            <motion.div
              animate={{ x: notifications ? 22 : 2 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
            />
          </motion.button>
        </div>
      </>
    )},
    { id: 'cycle', content: (
      <>
        <div className="flex items-center gap-2 mb-4">
          <RotateCcw className="w-5 h-5 text-theme-accent" />
          <h2 className="text-lg font-semibold text-theme-primary">{t.settings.cycleSettings}</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-theme-secondary mb-1.5">{t.settings.cycleLength}</label>
            <div className="flex items-center gap-3">
              <input type="range" min="21" max="45" value={localCycleLength}
                onChange={(e) => setLocalCycleLength(Number(e.target.value))}
                className="flex-1 accent-[var(--accent)]" />
              <motion.span
                key={localCycleLength}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="text-sm font-semibold text-theme-primary w-8 text-right"
              >
                {localCycleLength}
              </motion.span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-theme-secondary mb-1.5">{t.settings.periodLength}</label>
            <div className="flex items-center gap-3">
              <input type="range" min="2" max="10" value={localPeriodLength}
                onChange={(e) => setLocalPeriodLength(Number(e.target.value))}
                className="flex-1 accent-[var(--accent)]" />
              <motion.span
                key={localPeriodLength}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="text-sm font-semibold text-theme-primary w-8 text-right"
              >
                {localPeriodLength}
              </motion.span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-theme-secondary mb-1.5">{t.settings.lastPeriod}</label>
            <input type="date" value={localLastPeriod}
              onChange={(e) => setLocalLastPeriod(e.target.value)}
              className="w-full bg-theme-card-hover border border-theme rounded-theme-md p-2.5 text-sm text-theme-primary outline-none transition-all focus:border-[var(--accent)] focus:shadow-[0_0_0_4px_var(--accent-glow)]" />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="w-full py-3 rounded-theme-lg bg-gradient-accent text-white font-semibold shadow-theme hover:shadow-theme-lg transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saved ? '✓ ' + t.settings.saved : t.settings.save}
          </motion.button>
        </div>
      </>
    )},
    { id: 'history', content: (
      <>
        <div className="flex items-center gap-2 mb-4">
          <RotateCcw className="w-5 h-5 text-theme-accent" />
          <h2 className="text-lg font-semibold text-theme-primary">{t.settings.cycleHistory}</h2>
        </div>
        {cycles.length === 0 ? (
          <p className="text-sm text-theme-muted text-center py-6">{t.dashboard.noData}</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {cycles.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 rounded-theme-md bg-theme-card-hover border border-theme"
              >
                <div className="flex gap-4 text-xs">
                  <span className="text-theme-muted">{t.settings.startDate}: <span className="text-theme-primary font-medium">{format(parseISO(c.startDate), 'd MMM yyyy')}</span></span>
                  {c.endDate && (
                    <span className="text-theme-muted">{t.settings.endDate}: <span className="text-theme-primary font-medium">{format(parseISO(c.endDate), 'd MMM yyyy')}</span></span>
                  )}
                  <span className="text-theme-muted">{t.settings.length}: <span className="text-theme-primary font-medium">{c.cycleLength} {t.common.days}</span></span>
                </div>
                {confirmDeleteCycle === c.id ? (
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-red-400">{t.settings.confirmDeleteCycle}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => { removeCycle(c.id); setConfirmDeleteCycle(null); }}
                      className="text-xs px-2 py-1 rounded-theme-sm bg-red-500 text-white"
                    >
                      {t.common.delete}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setConfirmDeleteCycle(null)}
                      className="text-xs px-2 py-1 rounded-theme-sm bg-theme-card text-theme-muted"
                    >
                      {t.common.cancel}
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.1, color: '#ef4444' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setConfirmDeleteCycle(c.id)}
                    className="text-xs text-theme-muted hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </>
    )},
    { id: 'data', content: (
      <>
        <div className="flex items-center gap-2 mb-4">
          <Download className="w-5 h-5 text-theme-accent" />
          <h2 className="text-lg font-semibold text-theme-primary">{t.settings.dataManagement}</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowReport(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-theme-lg bg-gradient-accent text-white text-sm font-medium transition-all shadow-theme"
          >
            <FileText className="w-4 h-4" />
            {t.settings.exportData === 'Export Data' ? 'Health Report' : 'Отчёт для врача'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-theme-lg bg-theme-card-hover text-theme-secondary hover:bg-theme-card border border-theme text-sm font-medium transition-all"
          >
            <Download className="w-4 h-4" />
            {t.settings.exportData}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCsvExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-theme-lg bg-theme-card-hover text-theme-secondary hover:bg-theme-card border border-theme text-sm font-medium transition-all"
          >
            <Download className="w-4 h-4" />
            CSV
          </motion.button>
          {showClearConfirm ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2"
            >
              <span className="text-sm text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {t.settings.confirmClear}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearData}
                className="px-4 py-2.5 rounded-theme-lg bg-red-500 text-white text-sm font-medium"
              >
                {t.common.delete}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2.5 rounded-theme-lg bg-theme-card-hover text-theme-secondary text-sm font-medium"
              >
                {t.common.cancel}
              </motion.button>
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-theme-lg bg-red-50 text-red-400 border border-red-200 text-sm font-medium transition-all hover:bg-red-100"
            >
              <AlertTriangle className="w-4 h-4" />
              {t.settings.clearData}
            </motion.button>
          )}
        </div>
      </>
    )},
  ];

  return (
    <div className="relative min-h-[calc(100vh-6rem)]">
      {showReport && <HealthReport onClose={() => setShowReport(false)} />}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-theme-primary">{t.settings.title}</h1>
        </motion.div>

        <div className="max-w-2xl space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.id}
              custom={i}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="rounded-theme-xl bg-theme-card border border-theme shadow-theme p-6"
            >
              {section.content}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
