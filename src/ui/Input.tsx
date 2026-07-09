'use client';

import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, icon, className = '', ...props }, ref) => (
    <div>
      {label && <label className="block text-sm text-theme-secondary mb-1.5 font-medium">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted w-4 h-4">{icon}</div>}
        <input
          ref={ref}
          className={`w-full bg-theme-card-hover/50 border ${error ? 'border-red-400' : 'border-theme'} rounded-theme-md p-3 text-sm text-theme-primary outline-none transition-all focus:border-accent focus:shadow-[0_0_0_4px_var(--accent-glow)] ${icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      {helper && !error && <p className="text-xs text-theme-muted mt-1">{helper}</p>}
    </div>
  )
);
Input.displayName = 'Input';
