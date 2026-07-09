'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, X, RotateCcw, Wind } from 'lucide-react';

type BreathingMode = '478' | '444' | '55';

interface ModeConfig {
  id: BreathingMode;
  inhale: number;
  hold: number;
  exhale: number;
  label: string;
  desc: string;
}

const modes: ModeConfig[] = [
  { id: '478', inhale: 4, hold: 7, exhale: 8, label: '4-7-8', desc: 'Расслабление. Снижает тревогу, помогает уснуть.' },
  { id: '444', inhale: 4, hold: 4, exhale: 4, label: '4-4-4', desc: 'Фокус. Успокаивает ум и возвращает концентрацию.' },
  { id: '55', inhale: 5, hold: 0, exhale: 5, label: '5-5', desc: 'Успокоение. Быстро снижает стресс.' },
];

export function BreathingExercise() {
  const [mode, setMode] = useState<BreathingMode>('478');
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'idle'>('idle');
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [started, setStarted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const config = modes.find((m) => m.id === mode)!;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startExercise = useCallback(() => {
    clearTimer();
    setActive(true);
    setStarted(true);
    setCycles(0);
    setPhase('inhale');
    setCount(config.inhale);

    let currentPhase: 'inhale' | 'hold' | 'exhale' = 'inhale';
    let currentCount = config.inhale;
    let cycleCount = 0;

    intervalRef.current = setInterval(() => {
      currentCount--;
      setCount(currentCount);

      if (currentCount <= 0) {
        if (currentPhase === 'inhale') {
          if (config.hold > 0) {
            currentPhase = 'hold';
            currentCount = config.hold;
            setPhase('hold');
          } else {
            currentPhase = 'exhale';
            currentCount = config.exhale;
            setPhase('exhale');
          }
        } else if (currentPhase === 'hold') {
          currentPhase = 'exhale';
          currentCount = config.exhale;
          setPhase('exhale');
        } else {
          cycleCount++;
          setCycles(cycleCount);
          currentPhase = 'inhale';
          currentCount = config.inhale;
          setPhase('inhale');
        }
      }
    }, 1000);
  }, [config, clearTimer]);

  const stopExercise = useCallback(() => {
    clearTimer();
    setActive(false);
    setPhase('idle');
    setCount(0);
  }, [clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const scale = phase === 'inhale' ? 1 : phase === 'hold' ? 1 : phase === 'exhale' ? 0.6 : 0.8;
  const phaseLabel = phase === 'inhale' ? 'Вдох' : phase === 'hold' ? 'Задержка' : phase === 'exhale' ? 'Выдох' : '';

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="flex gap-2">
        {modes.map((m) => (
          <motion.button
            key={m.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { if (!active) { setMode(m.id); setStarted(false); } }}
            disabled={active}
            className={`px-4 py-2 rounded-theme-lg text-sm font-medium transition-all ${
              mode === m.id ? 'bg-gradient-accent text-white shadow-theme' : 'bg-theme-card-hover text-theme-secondary'
            } disabled:opacity-50`}
          >
            {m.label}
          </motion.button>
        ))}
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        <motion.div
          animate={{
            scale,
            borderRadius: phase === 'inhale' ? '30%' : phase === 'exhale' ? '50%' : '40%',
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full"
        />
        <motion.div
          animate={{
            scale: scale * 0.8,
            borderRadius: phase === 'inhale' ? '30%' : phase === 'exhale' ? '50%' : '40%',
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-4 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full"
        />
        <div className="relative z-10 flex flex-col items-center gap-1">
          <Wind className={`w-8 h-8 transition-colors ${active ? 'text-accent' : 'text-theme-muted'}`} />
          {active ? (
            <>
              <span className="text-4xl font-bold text-theme-primary tabular-nums">{count}</span>
              <span className="text-sm font-medium text-accent">{phaseLabel}</span>
              <span className="text-xs text-theme-muted mt-1">Циклов: {cycles}</span>
            </>
          ) : (
            <span className="text-sm text-theme-muted">Нажми Старт</span>
          )}
        </div>
      </div>

      {!started && (
        <p className="text-sm text-theme-muted text-center max-w-xs">{config.desc}</p>
      )}

      <div className="flex gap-3">
        {!active ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startExercise}
            className="px-8 py-3 rounded-theme-xl bg-gradient-accent text-white font-semibold shadow-theme flex items-center gap-2"
          >
            <Play className="w-5 h-5" /> {started ? 'Ещё раз' : 'Старт'}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={stopExercise}
            className="px-8 py-3 rounded-theme-xl bg-red-400 text-white font-semibold shadow-theme flex items-center gap-2"
          >
            <Pause className="w-5 h-5" /> Стоп
          </motion.button>
        )}
      </div>

      {started && !active && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-theme-muted"
        >
          Сделано циклов: {cycles} — молодец 🌸
        </motion.p>
      )}
    </div>
  );
}
