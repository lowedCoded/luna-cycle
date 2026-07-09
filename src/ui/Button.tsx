'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-gradient-accent text-white shadow-theme hover:shadow-theme-lg',
  secondary: 'border border-theme bg-theme-card hover:bg-theme-card-hover text-theme-primary',
  ghost: 'text-theme-secondary hover:text-theme-primary hover:bg-theme-card-hover',
  danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, children, className = '', disabled, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`inline-flex items-center justify-center font-medium rounded-theme-md transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(props as any)}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : icon ? (
        <span className="w-4 h-4">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  )
);
Button.displayName = 'Button';
