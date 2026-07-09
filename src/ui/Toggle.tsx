'use client';

import { motion } from 'framer-motion';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function Toggle({ checked, onChange, label, description, icon }: ToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-theme-lg border border-theme bg-theme-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {icon && (
          <div className={`p-2 rounded-theme-md transition-colors ${checked ? 'bg-accent/10' : 'bg-theme-card-hover'}`}>
            <div className={`w-5 h-5 ${checked ? 'text-accent' : 'text-theme-muted'}`}>{icon}</div>
          </div>
        )}
        <div>
          {label && <p className="text-sm font-medium text-theme-primary">{label}</p>}
          {description && <p className="text-xs text-theme-muted">{description}</p>}
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? 'bg-accent' : 'bg-theme-card-hover border border-theme'}`}
        role="switch"
        aria-checked={checked}
      >
        <motion.div
          animate={{ x: checked ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
        />
      </motion.button>
    </div>
  );
}
