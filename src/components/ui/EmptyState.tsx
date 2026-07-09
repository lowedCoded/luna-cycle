'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-4 text-theme-muted"
      >
        {icon}
      </motion.div>
      <p className="text-sm text-theme-muted mb-2">{title}</p>
      {description && (
        <p className="text-[10px] text-theme-muted/60 max-w-[200px]">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}
