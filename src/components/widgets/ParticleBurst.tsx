'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  duration: number;
}

function generateParticles(): Particle[] {
  const colors = ['var(--accent)', 'var(--accent-light)', 'var(--accent-dark)', 'var(--text-accent)'];
  return Array.from({ length: 16 }, (_, i) => ({
    id: Date.now() + i,
    x: (Math.random() - 0.5) * 200,
    y: (Math.random() - 0.5) * 200,
    size: 3 + Math.random() * 6,
    color: colors[i % colors.length],
    rotation: Math.random() * 360,
    duration: 0.8 + Math.random() * 0.4,
  }));
}

export function ParticleBurst({ active, originX = 0.5, originY = 0.5 }: { active: boolean; originX?: number; originY?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (active) {
      const pid = requestAnimationFrame(() => setParticles(generateParticles()));
      return () => cancelAnimationFrame(pid);
    } else {
      timeoutRef.current = setTimeout(() => setParticles([]), 1200);
      return () => clearTimeout(timeoutRef.current);
    }
  }, [active]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ clipPath: 'inset(0)' }}>
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
            animate={{
              x: p.x,
              y: p.y,
              scale: [0, 1.5, 0],
              opacity: [1, 1, 0],
              rotate: p.rotation,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: p.duration, ease: 'easeOut' }}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              left: `${originX * 100}%`,
              top: `${originY * 100}%`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
