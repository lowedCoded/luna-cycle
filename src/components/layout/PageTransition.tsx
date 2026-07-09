'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <motion.div
      key={pathname}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 220, mass: 0.8 }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}