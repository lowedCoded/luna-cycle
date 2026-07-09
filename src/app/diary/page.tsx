'use client';

import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smile,
  Frown,
  Heart,
  Trash2,
  Save,
  Tag,
  X,
  Filter,
  Droplets,
  Moon,
  Thermometer,
  Zap,
  Brain,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import { ParticleBurst } from '@/components/widgets/ParticleBurst';
import { AnimatedTextarea } from '@/components/ui/AnimatedTextarea';
import { Slider } from '@/ui/Slider';
import { useT } from '@/components/providers/AppProvider';
import { useDiaryStore, generateDiaryId } from '@/lib/store/diaryStore';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import { uk } from 'date-fns/locale/uk';
import { de } from 'date-fns/locale/de';
import { fr } from 'date-fns/locale/fr';
import { es } from 'date-fns/locale/es';
import type { Locale } from 'date-fns';
import type { DiaryEntry } from '@/types';

const localeMap: Record<string, Locale | undefined> = { ru, uk, de, fr, es };

const moodEmojis = ['😢', '😐', '🙂', '😊', '🥰'];
const flowOptions = ['none', 'light', 'medium', 'heavy'] as const;
const symptomKeys = ['headache', 'bloating', 'cramps', 'fatigue', 'nausea', 'backpain', 'breast_tenderness', 'cravings', 'insomnia', 'acne'];

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.04 } } },
  item: {
    initial: { opacity: 0, y: 12, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, damping: 22, stiffness: 200 } },
    exit: { opacity: 0, x: 30, transition: { duration: 0.2 } },
  },
};

export default function DiaryPage() {
  const t = useT();
  const lang = useSettingsStore((s) => s.lang);
  const dateLocale = localeMap[lang];
  const entries = useDiaryStore((s) => s.entries);
  const addEntry = useDiaryStore((s) => s.addEntry);
  const removeEntry = useDiaryStore((s) => s.removeEntry);

  const [mood, setMood] = useState(3);
  const [pain, setPain] = useState(1);
  const [flow, setFlow] = useState<'none' | 'light' | 'medium' | 'heavy'>('none');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [burstActive, setBurstActive] = useState(false);
  const saveBtnRef = useRef<HTMLButtonElement>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [newSymptom, setNewSymptom] = useState('');
  const [showNewSymptom, setShowNewSymptom] = useState(false);
  const [water, setWater] = useState(0);
  const [sleep, setSleep] = useState(7);
  const [bbt, setBbt] = useState(36.6);
  const [energy, setEnergy] = useState(3);
  const [stress, setStress] = useState(3);
  const [symptomSeverity, setSymptomSeverity] = useState<Record<string, number>>({});
  const [pmdd, setPmdd] = useState<Record<string, number>>({
    irritability: 0, anxiety: 0, depression: 0,
    crying_spells: 0, overwhelm: 0, anger: 0, hopelessness: 0,
  });
  const [questionAnswer, setQuestionAnswer] = useState('');

  const customSymptoms = useDiaryStore((s) => s.customSymptoms);
  const addCustomSymptom = useDiaryStore((s) => s.addCustomSymptom);
  const removeCustomSymptom = useDiaryStore((s) => s.removeCustomSymptom);

  const sortedEntries = useMemo(() => [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [entries]);
  const allTags = useDiaryStore((s) => s.getAllTags)();
  const filteredEntries = useMemo(() => filterTag ? sortedEntries.filter((e) => e.tags?.includes(filterTag)) : sortedEntries, [sortedEntries, filterTag]);
  const today = format(new Date(), 'yyyy-MM-dd');
  const allSymptomKeys = [...symptomKeys, ...customSymptoms];

  const toggleSymptom = (s: string) => {
    setSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
    }
    setTagInput('');
  };

  const removeTag = (t: string) => {
    setTags(tags.filter((x) => x !== t));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSave = () => {
    const activeSeverity: Record<string, number> = {};
    symptoms.forEach(s => { if (symptomSeverity[s]) activeSeverity[s] = symptomSeverity[s]; });
    const pmddObj = Object.fromEntries(Object.entries(pmdd).filter(([_, v]) => v > 0));
    addEntry({
      id: generateDiaryId(),
      date: today,
      mood,
      pain,
      flow,
      symptoms,
      notes,
      tags,
      water,
      sleep,
      bbt,
      energy,
      stress,
      symptomSeverity: Object.keys(activeSeverity).length > 0 ? activeSeverity : undefined,
      pmdd: Object.keys(pmddObj).length > 0 ? pmddObj as unknown as DiaryEntry['pmdd'] : undefined,
      questionAnswer: questionAnswer || undefined,
      questionDate: questionAnswer ? today : undefined,
    });
    setBurstActive(true);
    setTimeout(() => setBurstActive(false), 100);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setMood(3);
      setPain(1);
      setFlow('none');
      setSymptoms([]);
      setNotes('');
      setTags([]);
      setWater(0);
      setSleep(7);
      setBbt(36.6);
      setEnergy(3);
      setStress(3);
      setSymptomSeverity({});
      setPmdd({ irritability: 0, anxiety: 0, depression: 0, crying_spells: 0, overwhelm: 0, anger: 0, hopelessness: 0 });
      setQuestionAnswer('');
    }, 1200);
  };

  const setPmddField = (field: string, value: number) => {
    setPmdd(prev => ({ ...prev, [field]: value }));
  };

  const setSeverityFor = (symptom: string, value: number) => {
    setSymptomSeverity(prev => ({ ...prev, [symptom]: value }));
  };

  const hasEntryToday = entries.some((e) => e.date === today);

  return (
    <div className="relative min-h-[calc(100vh-6rem)]">
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-theme-primary">{t.diary.title}</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
          >
            <div className="rounded-theme-xl bg-theme-card border border-theme shadow-theme p-6 relative overflow-hidden">
              <ParticleBurst active={burstActive} originX={0.5} originY={0.4} />
              <div className="relative z-10 space-y-5">
                {saved ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 250 }}
                    className="flex flex-col items-center justify-center py-8"
                  >
                    <motion.div
                      animate={{ rotate: [0, 8, 0, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Heart className="w-12 h-12 text-accent" />
                    </motion.div>
                    <p className="text-lg font-semibold text-theme-primary mt-3">
                      {t.diary.saved}
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Smile className="w-4 h-4 text-accent" />
                        <label className="text-sm font-medium text-theme-primary">{t.diary.mood}</label>
                      </div>
                      <div className="flex gap-2">
                        {moodEmojis.map((emoji, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.2, y: -3 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMood(i + 1)}
                            className={`w-12 h-12 flex items-center justify-center rounded-theme-lg text-xl transition-all ${
                              mood === i + 1
                                ? 'bg-gradient-accent shadow-theme scale-110'
                                : 'bg-theme-card-hover hover:bg-theme-card'
                            }`}
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <Slider
                      value={pain}
                      onChange={setPain}
                      min={1}
                      max={5}
                      label={t.diary.pain}
                      icon={<Frown className="w-4 h-4" />}
                      formatValue={(v) => '•'.repeat(v) + '○'.repeat(5 - v)}
                    />

                    <div>
                      <label className="block text-sm font-medium text-theme-primary mb-3">{t.diary.flow}</label>
                      <div className="flex gap-2">
                        {flowOptions.map((f) => (
                          <motion.button
                            key={f}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFlow(f)}
                            className={`flex-1 py-2.5 rounded-theme-md text-xs font-medium transition-all ${
                              flow === f
                                ? 'bg-gradient-accent text-white shadow-theme'
                                : 'bg-theme-card-hover text-theme-secondary hover:bg-theme-card'
                            }`}
                          >
                            {f === 'none' ? '—' : t.common[`flow${f.charAt(0).toUpperCase()}${f.slice(1)}` as keyof typeof t.common]}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Frown className="w-4 h-4 text-accent" />
                        <label className="text-sm font-medium text-theme-primary">{t.diary.symptoms}</label>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowNewSymptom(!showNewSymptom)}
                          className="ml-auto text-xs text-accent hover:text-accent-light transition-colors"
                        >
                          + {t.diary.addSymptom}
                        </motion.button>
                      </div>
                      {showNewSymptom && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="flex gap-2 mb-3"
                        >
                          <input
                            value={newSymptom}
                            onChange={(e) => setNewSymptom(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const s = newSymptom.trim().toLowerCase().replace(/\s+/g, '_');
                                if (s) {
                                  addCustomSymptom(s);
                                  setNewSymptom('');
                                  setShowNewSymptom(false);
                                }
                              }
                            }}
                            placeholder={t.diary.newSymptom}
                            className="flex-1 bg-theme-card-hover border border-theme rounded-theme-md px-3 py-2 text-xs text-theme-primary outline-none transition-all focus:border-[var(--accent)] focus:shadow-[0_0_0_3px var(--accent-glow)]"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              const s = newSymptom.trim().toLowerCase().replace(/\s+/g, '_');
                              if (s) {
                                addCustomSymptom(s);
                                setNewSymptom('');
                                setShowNewSymptom(false);
                              }
                            }}
                            className="px-3 py-2 rounded-theme-md bg-gradient-accent text-white text-xs font-medium"
                          >
                            {t.diary.save}
                          </motion.button>
                        </motion.div>
                      )}
                      <motion.div
                        variants={stagger.container}
                        initial="initial"
                        animate="animate"
                        className="flex flex-wrap gap-2"
                      >
                        {allSymptomKeys.map((sk) => (
                          <motion.button
                            key={sk}
                            variants={stagger.item}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleSymptom(sk)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                              symptoms.includes(sk)
                                ? 'bg-gradient-accent text-white shadow-theme'
                                : 'bg-theme-card-hover text-theme-secondary hover:bg-theme-card'
                            }`}
                          >
                            {t.diary.symptoms_list[sk as keyof typeof t.diary.symptoms_list] as string || sk}
                            {customSymptoms.includes(sk) && (
                              <span
                                onClick={(e) => { e.stopPropagation(); removeCustomSymptom(sk); }}
                                className="hover:text-red-400 transition-colors"
                              >
                                <X className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </motion.button>
                        ))}
                      </motion.div>
                    </div>

                    <Slider
                      value={water}
                      onChange={setWater}
                      min={0}
                      max={12}
                      label="Вода"
                      icon={<Droplets className="w-4 h-4" />}
                      formatValue={(v) => `${v} стак.`}
                    />

                    <Slider
                      value={sleep}
                      onChange={setSleep}
                      min={1}
                      max={12}
                      step={0.5}
                      label="Сон"
                      icon={<Moon className="w-4 h-4" />}
                      formatValue={(v) => `${v} ч`}
                    />

                    <Slider
                      value={bbt}
                      onChange={setBbt}
                      min={35.5}
                      max={38}
                      step={0.1}
                      label="БТТ"
                      icon={<Thermometer className="w-4 h-4" />}
                      formatValue={(v) => `${v}°C`}
                    />

                    <Slider
                      value={energy}
                      onChange={setEnergy}
                      min={1}
                      max={5}
                      label="Энергия"
                      icon={<Zap className="w-4 h-4" />}
                      formatValue={(v) => `${v}/5`}
                    />

                    <Slider
                      value={stress}
                      onChange={setStress}
                      min={1}
                      max={5}
                      label="Стресс"
                      icon={<Brain className="w-4 h-4" />}
                      formatValue={(v) => `${v}/5`}
                    />

                    {symptoms.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-4 h-4 text-accent" />
                          <label className="text-sm font-medium text-theme-primary">Тяжесть симптомов</label>
                        </div>
                        <div className="space-y-2">
                          {symptoms.map(s => (
                            <Slider
                              key={s}
                              value={symptomSeverity[s] || 1}
                              onChange={(v) => setSeverityFor(s, v)}
                              min={1}
                              max={5}
                              label={t.diary.symptoms_list[s as keyof typeof t.diary.symptoms_list] as string || s}
                              formatValue={(v) => `${v}/5`}
                              showTooltip={false}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-4 h-4 text-orange-400" />
                        <label className="text-sm font-medium text-theme-primary">ПМС / ПМДР</label>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(pmdd).map(([key, val]) => (
                          <Slider
                            key={key}
                            value={val}
                            onChange={(v) => setPmddField(key, v)}
                            min={0}
                            max={5}
                            step={1}
                            label={t.diary.pmdd_list?.[key as keyof typeof t.diary.pmdd_list] as string || key}
                            formatValue={(v) => `${v}/5`}
                            showTooltip={false}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <HelpCircle className="w-4 h-4 text-accent" />
                        <label className="text-sm font-medium text-theme-primary">Как прошёл день?</label>
                      </div>
                      <AnimatedTextarea
                        value={questionAnswer}
                        onChange={(e) => setQuestionAnswer(e.target.value)}
                        placeholder="Напишите пару слов о сегодняшнем дне…"
                        rows={2}
                        className="w-full bg-theme-card-hover border border-theme rounded-theme-md text-sm text-theme-primary transition-all focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_4px var(--accent-glow)]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-theme-primary mb-2">{t.diary.notes}</label>
                      <AnimatedTextarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={t.diary.placeholder}
                        rows={3}
                        className="w-full bg-theme-card-hover border border-theme rounded-theme-md text-sm text-theme-primary transition-all focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_4px var(--accent-glow)]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4 text-accent" />
                        <label className="text-sm font-medium text-theme-primary">{t.diary.tags}</label>
                      </div>
                      <div className="flex gap-2 mb-2">
                        <input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleTagKeyDown}
                          placeholder={t.diary.addTag}
                          className="flex-1 bg-theme-card-hover border border-theme rounded-theme-md px-3 py-2 text-xs text-theme-primary outline-none transition-all focus:border-[var(--accent)] focus:shadow-[0_0_0_3px var(--accent-glow)]"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={addTag}
                          className="px-3 py-2 rounded-theme-md bg-gradient-accent text-white text-xs font-medium"
                        >
                          +
                        </motion.button>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {tags.map((t) => (
                            <motion.span
                              key={t}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-theme-card-hover text-[10px] text-theme-secondary"
                            >
                              {t}
                              <button onClick={() => removeTag(t)} className="hover:text-red-400 transition-colors">
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </div>

                    <motion.button
                      ref={saveBtnRef}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      disabled={hasEntryToday}
                      className="w-full py-3 rounded-theme-lg bg-gradient-accent text-white font-semibold shadow-theme hover:shadow-theme-lg transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      {hasEntryToday
                        ? t.diary.alreadyLogged
                        : t.diary.save}
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 200, delay: 0.1 }}
          >
            <div className="rounded-theme-xl bg-theme-card border border-theme shadow-theme p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-theme-primary">{t.diary.title}</h2>
                {allTags.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3 h-3 text-theme-muted" />
                    <select
                      value={filterTag || ''}
                      onChange={(e) => setFilterTag(e.target.value || null)}
                      className="text-xs bg-theme-card-hover border border-theme rounded-theme-md px-2 py-1 text-theme-primary outline-none"
                    >
                      <option value="">{t.diary.allTags}</option>
                      {allTags.map((tag) => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <AnimatePresence mode="popLayout">
                {filteredEntries.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Smile className="w-10 h-10 text-theme-muted mx-auto mb-3" />
                    </motion.div>
                    <p className="text-sm text-theme-muted">{t.diary.noEntries}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={stagger.container}
                    initial="initial"
                    animate="animate"
                    className="space-y-3"
                  >
                    {filteredEntries.map((entry) => (
                      <motion.div
                        key={entry.id}
                        variants={stagger.item}
                        layout
                        whileHover={{ x: 4, transition: { type: 'spring', damping: 20 } }}
                        className="rounded-theme-lg bg-theme-card-hover border border-theme p-4 relative"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-medium text-theme-muted">
                            {format(parseISO(entry.date), 'd MMMM yyyy', { locale: dateLocale })}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1, color: '#ef4444' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeEntry(entry.id)}
                            className="text-theme-muted hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                        <div className="flex gap-2 items-center mb-2">
                          <span className="text-lg">{moodEmojis[entry.mood - 1]}</span>
                          <span className="text-xs text-theme-muted">
                            {t.diary.pain}: {'●'.repeat(entry.pain)}{'○'.repeat(5 - entry.pain)}
                          </span>
                          {entry.flow !== 'none' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-theme-card text-theme-muted">
                              {t.common[`flow${entry.flow.charAt(0).toUpperCase()}${entry.flow.slice(1)}` as keyof typeof t.common]}
                            </span>
                          )}
                        </div>
                        {entry.symptoms.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {entry.symptoms.map((s) => (
                              <span key={s} className="px-2 py-0.5 rounded-full bg-theme-card text-[10px] text-theme-muted">
                                {t.diary.symptoms_list[s as keyof typeof t.diary.symptoms_list] as string || s}
                              </span>
                            ))}
                          </div>
                        )}
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {entry.tags.map((t) => (
                              <span key={t} className="px-2 py-0.5 rounded-full border border-theme-light text-[10px] text-accent">
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 mb-2 text-[10px] text-theme-muted">
                          {entry.water !== undefined && <span>💧 {entry.water}</span>}
                          {entry.sleep !== undefined && <span>🌙 {entry.sleep}ч</span>}
                          {entry.bbt !== undefined && <span>🌡️ {entry.bbt}°</span>}
                          {entry.energy !== undefined && <span>⚡ {entry.energy}/5</span>}
                          {entry.stress !== undefined && <span>🧠 {entry.stress}/5</span>}
                        </div>
                        {entry.questionAnswer && (
                          <div className="mb-2 p-2 bg-theme-card rounded-theme-sm">
                            <p className="text-[10px] text-theme-muted mb-0.5">💬 Как прошёл день</p>
                            <p className="text-xs text-theme-secondary leading-relaxed">{entry.questionAnswer}</p>
                          </div>
                        )}
                        {entry.notes && (
                          <p className="text-xs text-theme-secondary bg-theme-card p-2 rounded-theme-sm leading-relaxed">
                            {entry.notes}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
