import type { ReactNode } from 'react';

type BadgeVariant = 'phase' | 'category' | 'verified' | 'custom';

interface BadgeProps {
  variant?: BadgeVariant;
  color?: string;
  className?: string;
  children: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  phase: 'bg-accent/10 text-accent border border-accent/20',
  category: 'bg-theme-card-hover text-theme-secondary border border-theme',
  verified: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
  custom: '',
};

export function Badge({ variant = 'phase', color, className = '', children }: BadgeProps) {
  const style = variant === 'custom' && color ? { background: `${color}20`, color, borderColor: `${color}40` } : {};
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${variantClasses[variant]} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}
