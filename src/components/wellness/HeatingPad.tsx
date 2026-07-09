'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Thermometer, Clock, Zap, Heart } from 'lucide-react';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { ParticleBurst } from '@/components/widgets/ParticleBurst';

const DURATIONS = [
  { label: '10 мин', value: 10 },
  { label: '15 мин', value: 15 },
  { label: '20 мин', value: 20 },
  { label: '30 мин', value: 30 },
  { label: '45 мин', value: 45 },
  { label: '60 мин', value: 60 },
];

const LEVELS = [
  { label: 'Низкий', temp: 37, colors: ['#fef3c7', '#fde68a', '#fcd34d'] },
  { label: 'Средний', temp: 40, colors: ['#fed7aa', '#fdba74', '#fb923c'] },
  { label: 'Высокий', temp: 43, colors: ['#fecaca', '#fca5a5', '#f87171'] },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 22, stiffness: 200 } },
};

export function HeatingPad() {
  const [phase, setPhase] = useState<'idle' | 'active' | 'paused' | 'done'>('idle');
  const [duration, setDuration] = useState(20);
  const [level, setLevel] = useState(1);
  const [remaining, setRemaining] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [burstActive, setBurstActive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = duration * 60;
  const progress = phase === 'idle' ? 0 : 1 - remaining / totalSeconds;
  const currentLevel = LEVELS[level];

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    setPhase('active');
    setRemaining(duration * 60);
    clearTimer();
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearTimer();
          setPhase('done');
          setBurstActive(true);
          setTimeout(() => setBurstActive(false), 100);
          setShowCompletion(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [duration, clearTimer]);

  const pauseTimer = useCallback(() => {
    clearTimer();
    setPhase('paused');
  }, [clearTimer]);

  const resumeTimer = useCallback(() => {
    setPhase('active');
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearTimer();
          setPhase('done');
          setBurstActive(true);
          setTimeout(() => setBurstActive(false), 100);
          setShowCompletion(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer]);

  const resetTimer = useCallback(() => {
    clearTimer();
    setPhase('idle');
    setRemaining(0);
    setShowCompletion(false);
  }, [clearTimer]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center gap-6 relative"
    >
      <ParticleBurst active={burstActive} originX={0.5} originY={0.5} />

      <motion.div variants={itemVariants} className="relative w-64 h-64 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 256 256">
          <circle cx="128" cy="128" r="114" fill="none" stroke="currentColor" strokeWidth="4" className="text-theme-border" />
          <motion.circle
            cx="128" cy="128" r="114" fill="none" stroke="currentColor" strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 114}
            animate={{ strokeDashoffset: 2 * Math.PI * 114 * (1 - progress) }}
            transition={{ type: 'spring', damping: 25, stiffness: 150 }}
            className="text-accent"
          />
        </svg>

        <motion.div
          className="absolute inset-6 rounded-full"
          animate={{
            background: phase === 'active'
              ? `radial-gradient(circle at 50% 50%, ${currentLevel.colors[0]}88, ${currentLevel.colors[1]}44, transparent)`
              : 'radial-gradient(circle, transparent)',
            boxShadow: phase === 'active'
              ? `0 0 40px ${currentLevel.colors[1]}66, 0 0 80px ${currentLevel.colors[1]}33`
              : 'none',
          }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute inset-0 rounded-full"
          animate={phase === 'active' ? { scale: [1, 1.04, 1] } : { scale: 1 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 text-center">
          {phase === 'idle' ? (
            <motion.div
              animate={{ rotate: [0, 8, 0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Thermometer className="w-12 h-12 mx-auto mb-2 text-theme-muted" />
            </motion.div>
          ) : (
            <motion.div
              animate={phase === 'active' ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Zap className={`w-12 h-12 mx-auto mb-2 ${phase === 'active' ? 'text-accent' : 'text-theme-muted'}`} />
            </motion.div>
          )}
          <motion.div
            key={phase === 'idle' ? 'idle' : remaining}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="text-4xl font-bold text-theme-primary tabular-nums"
          >
            {phase === 'idle' ? `${duration}` : formatTime(remaining)}
          </motion.div>
          <div className="text-xs text-theme-muted mt-1">
            {phase === 'idle' ? 'минут' : phase === 'done' ? 'Готово' : remaining > 60 ? 'осталось' : 'секунд'}
          </div>
          {phase === 'active' && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-medium mt-1"
              style={{ color: currentLevel.colors[2] }}
            >
              {currentLevel.label}
            </motion.div>
          )}
        </div>
      </motion.div>

      {phase === 'idle' && (
        <Card variant="glass" className="w-full">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
            <motion.div variants={itemVariants} className="w-full">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-accent" />
                <label className="text-sm font-medium text-theme-primary">Длительность</label>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {DURATIONS.map(d => (
                  <motion.button
                    key={d.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDuration(d.value)}
                    className={`px-3 py-1.5 rounded-theme-md text-sm font-medium transition-all ${
                      duration === d.value
                        ? 'bg-gradient-accent text-white shadow-theme'
                        : 'bg-theme-card-hover text-theme-secondary hover:bg-theme-card border border-theme'
                    }`}
                  >
                    {d.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="w-full">
              <div className="flex items-center gap-2 mb-3">
                <Thermometer className="w-4 h-4 text-accent" />
                <label className="text-sm font-medium text-theme-primary">Интенсивность</label>
              </div>
              <div className="flex gap-2 justify-center">
                {LEVELS.map((l, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLevel(i)}
                    className={`flex-1 py-2 px-4 rounded-theme-md text-sm font-medium transition-all ${
                      level === i
                        ? 'bg-gradient-accent text-white shadow-theme'
                        : 'bg-theme-card-hover text-theme-secondary hover:bg-theme-card border border-theme'
                    }`}
                  >
                    {l.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="w-full">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={startTimer}
                icon={<Play className="w-5 h-5" />}
              >
                Начать
              </Button>
            </motion.div>
          </motion.div>
        </Card>
      )}

      {(phase === 'active' || phase === 'paused') && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-3"
        >
          <Button
            variant="primary"
            size="md"
            onClick={phase === 'active' ? pauseTimer : resumeTimer}
            icon={phase === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          >
            {phase === 'active' ? 'Пауза' : 'Продолжить'}
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={resetTimer}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Сброс
          </Button>
        </motion.div>
      )}

      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
            className="text-center p-6 bg-accent/10 rounded-theme-xl w-full border border-accent/20"
          >
            <motion.div
              animate={{ rotate: [0, 8, 0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart className="w-10 h-10 mx-auto mb-2 text-accent" />
            </motion.div>
            <p className="text-accent font-semibold">Сеанс завершён</p>
            <p className="text-xs text-theme-muted mt-1 mb-4">Отдохните и сделайте перерыв перед следующим сеансом</p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => { resetTimer(); setShowCompletion(false); }}
            >
              Ещё сеанс
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
