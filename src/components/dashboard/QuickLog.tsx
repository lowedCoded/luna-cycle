'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Heart } from 'lucide-react';
import { useDiaryStore, generateDiaryId } from '@/lib/store/diaryStore';
import { useT } from '@/components/providers/AppProvider';
import { ParticleBurst } from '@/components/widgets/ParticleBurst';
import { format } from 'date-fns';

const moods = [
  { value: 1, emoji: '😢' },
  { value: 2, emoji: '😐' },
  { value: 3, emoji: '🙂' },
  { value: 4, emoji: '😊' },
  { value: 5, emoji: '🥰' },
];

const flowOptions = ['none', 'light', 'medium', 'heavy'] as const;
const symptomKeys = ['headache', 'bloating', 'cramps', 'fatigue', 'nausea', 'backpain', 'breast_tenderness', 'cravings', 'insomnia', 'acne'];

export function QuickLog({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const t = useT();
  const entries = useDiaryStore((s) => s.entries);
  const addEntry = useDiaryStore((s) => s.addEntry);
  const customSymptoms = useDiaryStore((s) => s.customSymptoms);
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const isOpen = open !== undefined ? open : isOpenInternal;
  const setIsOpen = useMemo(() => onClose
    ? (v: boolean) => { if (!v && onClose) onClose(); else setIsOpenInternal(v); }
    : setIsOpenInternal,
  [onClose]);
  const [mood, setMood] = useState(3);
  const [pain, setPain] = useState(1);
  const [flow, setFlow] = useState<'none' | 'light' | 'medium' | 'heavy'>('none');
  const [notes, setNotes] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [burstActive, setBurstActive] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');
  const hasEntryToday = entries.some((e) => e.date === today);

  const toggleSymptom = (s: string) => {
    setSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSave = () => {
    addEntry({
      id: generateDiaryId(),
      date: today,
      mood,
      pain,
      flow,
      symptoms,
      tags: [],
      notes,
    });
    setBurstActive(true);
    setTimeout(() => setBurstActive(false), 100);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setIsOpen(false);
      setMood(3);
      setPain(1);
      setFlow('none');
      setSymptoms([]);
      setNotes('');
    }, 1000);
  };

  const allSymptomKeys = [...symptomKeys, ...customSymptoms];

  return (
    <div>
      {open === undefined && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          className="w-full py-3 px-4 rounded-theme-lg bg-gradient-accent text-white font-medium flex items-center justify-center gap-2 shadow-theme hover:shadow-theme-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          {t.dashboard.quickLog}
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-theme-primary w-full md:max-w-md md:rounded-theme-xl rounded-t-theme-xl p-6 space-y-5 relative overflow-hidden"
            >
              <ParticleBurst active={burstActive} originX={0.5} originY={0.3} />
              <div className="relative z-10">
                {saved ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 250 }}
                    className="flex flex-col items-center justify-center py-8"
                  >
                    <motion.div
                      animate={{ rotate: [0, 8, 0, -8, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Heart className="w-12 h-12 text-accent" />
                    </motion.div>
                    <p className="text-lg font-semibold text-theme-primary mt-3">
                      {t.dashboard.saved}
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <motion.h3
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-lg font-bold text-theme-primary"
                      >
                        {t.diary.title}
                      </motion.h3>
                      <motion.button
                        whileHover={{ rotate: 90 }}
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-theme-card-hover rounded-theme-sm"
                      >
                        <X className="w-5 h-5 text-theme-muted" />
                      </motion.button>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                    >
                      <p className="text-sm font-medium text-theme-secondary mb-2">{t.diary.mood}</p>
                      <div className="flex gap-3 justify-center">
                        {moods.map((m) => (
                          <motion.button
                            key={m.value}
                            whileHover={{ scale: 1.2, y: -3 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMood(m.value)}
                            className={`text-2xl p-2 rounded-theme-md transition-all ${
                              mood === m.value ? 'scale-125 bg-theme-card-hover shadow-theme' : 'opacity-50 hover:opacity-80'
                            }`}
                          >
                            {m.emoji}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <p className="text-sm font-medium text-theme-secondary mb-2">{t.diary.pain}</p>
                      <input type="range" min="1" max="5" value={pain}
                        onChange={(e) => setPain(Number(e.target.value))}
                        className="w-full accent-[var(--accent)]" />
                      <div className="flex justify-between text-xs text-theme-muted mt-1">
                        <span>😌</span>
                        <span>😣</span>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <p className="text-sm font-medium text-theme-secondary mb-2">{t.diary.flow}</p>
                      <div className="flex gap-2">
                        {flowOptions.map((f) => (
                          <motion.button
                            key={f}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setFlow(f)}
                            className={`flex-1 py-2 px-3 rounded-theme-md text-sm font-medium transition-all ${
                              flow === f
                                ? 'bg-gradient-accent text-white shadow-theme'
                                : 'bg-theme-card text-theme-secondary hover:bg-theme-card-hover'
                            }`}
                          >
                            {f === 'none' ? '—' : t.common[`flow${f.charAt(0).toUpperCase()}${f.slice(1)}` as keyof typeof t.common]}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="text-sm font-medium text-theme-secondary mb-2">{t.diary.symptoms}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {allSymptomKeys.map((sk) => (
                          <motion.button
                            key={sk}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleSymptom(sk)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                              symptoms.includes(sk)
                                ? 'bg-gradient-accent text-white shadow-theme'
                                : 'bg-theme-card-hover text-theme-secondary hover:bg-theme-card'
                            }`}
                          >
                            {t.diary.symptoms_list[sk as keyof typeof t.diary.symptoms_list] as string || sk}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <p className="text-sm font-medium text-theme-secondary mb-2">{t.diary.notes}</p>
                      <textarea value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-theme-card border border-theme rounded-theme-md p-3 text-sm text-theme-primary placeholder:text-theme-muted resize-none outline-none transition-all focus:border-[var(--accent)] focus:shadow-[0_0_0_4px var(--accent-glow)]"
                        rows={2}
                        placeholder={t.dashboard.howAreYou}
                      />
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      disabled={hasEntryToday}
                      className="w-full py-3 rounded-theme-lg bg-gradient-accent text-white font-semibold shadow-theme hover:shadow-theme-lg transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Heart className="w-4 h-4" />
                      {hasEntryToday ? t.diary.alreadyLogged : t.diary.save}
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
