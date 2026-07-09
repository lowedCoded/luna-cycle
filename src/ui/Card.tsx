'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type CardVariant = 'glass' | 'solid' | 'interactive';

interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  glass: 'bg-theme-card/80 backdrop-blur-xl border border-theme/50 shadow-theme',
  solid: 'bg-theme-card border border-theme shadow-theme',
  interactive: 'bg-theme-card border border-theme shadow-theme hover:shadow-theme-lg hover:border-accent/30 cursor-pointer',
};

export function Card({ variant = 'glass', className = '', children }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 22, stiffness: 200 }}
      className={`rounded-theme-xl p-5 transition-all duration-300 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </motion.div>
  );
}
