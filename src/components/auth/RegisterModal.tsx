'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flower2, Sparkles, Heart } from 'lucide-react';
import { useUserStore } from '@/lib/store/userStore';
import { useT } from '@/components/providers/AppProvider';
import { ParticleBurst } from '@/components/widgets/ParticleBurst';

const petalVariants = {
  hidden: { opacity: 0, scale: 0, y: 20, rotate: -30 },
  visible: (i: number) => ({
    opacity: [0, 0.6, 0],
    scale: [0, 1, 0.8],
    y: [-10, -60 - i * 8],
    x: [0, (i % 2 === 0 ? 20 : -20) + i * 5],
    rotate: [-30, 30 + i * 10],
    transition: { duration: 3 + i * 0.2, repeat: Infinity, delay: i * 0.3, ease: 'easeOut' as const },
  }),
};

const floatingEmojiVariants = {
  hidden: { opacity: 0, y: 20, scale: 0 },
  visible: (i: number) => ({
    opacity: [0, 1, 0.8, 0],
    y: [0, -40 - i * 12, -70 - i * 8],
    x: [0, (i % 2 === 0 ? 25 : -25) + i * 4, (i % 2 === 0 ? 35 : -35) + i * 3],
    scale: [0, 1.2, 1, 0.6],
    rotate: [0, 15 + i * 8, -10 - i * 5],
    transition: { duration: 2.8, delay: 0.3 + i * 0.1, ease: 'easeOut' as const },
  }),
};

const sparkleVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: [0, 1, 0],
    scale: [0, 1.5, 0],
    x: [0, (i % 2 === 0 ? 40 : -40)],
    y: [0, -30 - i * 5],
    transition: { duration: 1.5, delay: 0.5 + i * 0.2, ease: 'easeOut' as const, repeat: 0 as const },
  }),
};

const greetingEmojis = ['🌸', '✨', '🦋', '🌺', '💫', '🌷', '💖', '🌟'];

export function RegisterModal() {
  const t = useT();
  const register = useUserStore((s) => s.register);
  const profile = useUserStore((s) => s.profile);
  const [nickname, setNickname] = useState('');
  const [showGreeting, setShowGreeting] = useState(false);
  const [nicknameForGreeting, setNicknameForGreeting] = useState('');
  const [burstActive, setBurstActive] = useState(false);
  const [cleanedUp, setCleanedUp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (cleanedUp) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = nickname.trim();
    if (!name) return;
    register(name);
    setNicknameForGreeting(name);
    setBurstActive(true);
    setTimeout(() => setBurstActive(false), 100);
    setShowGreeting(true);
    setTimeout(() => {
      setShowGreeting(false);
      setTimeout(() => setCleanedUp(true), 900);
    }, 2800);
  };

  const petals = Array.from({ length: 8 });

  return (
    <AnimatePresence mode="wait">
      {showGreeting ? (
        <motion.div
          key="greeting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95, filter: 'blur(6px)' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-sm mx-auto flex items-center justify-center min-h-[300px]">
            <ParticleBurst active={burstActive} originX={0.5} originY={0.4} />

            {/* Floating petals */}
            {petals.map((_, i) => (
              <motion.div
                key={`petal-${i}`}
                custom={i}
                variants={petalVariants}
                initial="hidden"
                animate="visible"
                className="absolute w-2 h-3 rounded-full pointer-events-none"
                style={{
                  background: `var(--accent-light)`,
                  left: `${15 + i * 9}%`,
                  top: '35%',
                  opacity: 0,
                }}
              />
            ))}

            {/* Floating emoji */}
            {greetingEmojis.map((emoji, i) => (
              <motion.div
                key={`emoji-${i}`}
                custom={i}
                variants={floatingEmojiVariants}
                initial="hidden"
                animate="visible"
                className="absolute pointer-events-none text-xl"
                style={{ left: `${8 + i * 11}%`, top: `${30 + (i % 3) * 15}%` }}
              >
                {emoji}
              </motion.div>
            ))}

            {/* Sparkles */}
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                custom={i}
                variants={sparkleVariants}
                initial="hidden"
                animate="visible"
                className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
                style={{
                  background: 'var(--accent)',
                  left: `${30 + i * 15}%`,
                  top: `${40 + i * 8}%`,
                  boxShadow: '0 0 6px var(--accent), 0 0 12px var(--accent-glow)',
                }}
              />
            ))}

            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.06]">
              <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                <circle cx="40" cy="40" r="60" fill="var(--accent)" />
                <circle cx="170" cy="160" r="50" fill="var(--accent)" />
                <circle cx="100" cy="100" r="80" fill="var(--accent-light)" opacity="0.5" />
              </svg>
            </div>

            {/* Greeting text */}
            <motion.div
              initial={{ scale: 0, rotate: -12, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 220, delay: 0.15 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, 0, -10, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 rounded-theme-lg bg-gradient-accent flex items-center justify-center mb-5 shadow-theme-lg"
              >
                <Flower2 className="w-10 h-10 text-white" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, type: 'spring', damping: 18, stiffness: 200 }}
                className="text-3xl font-bold text-white drop-shadow-lg"
              >
                {t.auth.greeting},{' '}
                <motion.span
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-block"
                >
                  {nicknameForGreeting}
                </motion.span>
                !
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm text-white/70 mt-3"
              >
                🌸 {t.auth.welcome}
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      ) : !profile ? (
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-sm"
            ref={containerRef}
          >
            <div className="rounded-theme-xl bg-theme-card border-2 border-[var(--border)] shadow-theme-lg p-8 relative overflow-hidden">
              <ParticleBurst active={burstActive} originX={0.5} originY={0.3} />

              {petals.map((_, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={petalVariants}
                  initial="hidden"
                  animate="visible"
                  className="absolute w-2 h-3 rounded-full pointer-events-none"
                  style={{
                    background: `var(--accent-light)`,
                    left: `${20 + i * 12}%`,
                    top: '40%',
                    opacity: 0,
                  }}
                />
              ))}

              <div className="absolute inset-0 pointer-events-none opacity-[0.08]">
                <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                  <circle cx="40" cy="40" r="60" fill="var(--accent)" />
                  <circle cx="170" cy="160" r="50" fill="var(--accent)" />
                  <circle cx="160" cy="30" r="30" fill="var(--accent-light)" />
                  <path d="M0 180 Q50 140 100 170 Q150 200 200 160" stroke="var(--accent)" strokeWidth="2" />
                </svg>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{
                    scale: 1,
                    rotate: [0, 8, 0, -8, 0],
                  }}
                  transition={{
                    scale: { delay: 0.15, type: 'spring', damping: 15 },
                    rotate: { delay: 1, duration: 4, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  className="w-16 h-16 rounded-theme-lg bg-gradient-accent flex items-center justify-center mb-5 shadow-theme"
                >
                  <Flower2 className="w-8 h-8 text-white" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <h2 className="text-2xl font-bold text-theme-primary mb-2">
                    {t.auth.welcome}
                  </h2>
                  <p className="text-sm text-theme-secondary mb-6 max-w-xs">
                    {t.auth.welcomeDesc}
                  </p>
                </motion.div>

                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="w-full space-y-4"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ x: [0, 4, 0, -4, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    >
                      <Sparkles className="w-4 h-4 text-accent" />
                    </motion.div>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder={t.auth.placeholder}
                      maxLength={30}
                      autoFocus
                      className="w-full bg-[var(--bg-secondary)] border-2 border-[var(--border)] rounded-theme-md p-3.5 pl-11 text-sm text-theme-primary placeholder:text-theme-muted outline-none transition-all focus:border-[var(--accent)] focus:shadow-[0_0_0_4px_var(--accent-glow)]"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={!nickname.trim()}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3.5 rounded-theme-lg bg-gradient-accent text-white font-semibold shadow-theme hover:shadow-theme-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    {t.auth.start}
                  </motion.button>
                </motion.form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
