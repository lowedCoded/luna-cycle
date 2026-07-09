'use client';

type SkeletonVariant = 'text' | 'card' | 'circle' | 'rect';

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string;
  height?: string;
  className?: string;
}

const variantDefaults: Record<SkeletonVariant, { className: string }> = {
  text: { className: 'h-4 rounded-md w-full' },
  card: { className: 'h-32 rounded-theme-xl w-full' },
  circle: { className: 'w-10 h-10 rounded-full' },
  rect: { className: 'h-20 rounded-theme-lg w-full' },
};

export function Skeleton({ variant = 'text', width, height, className = '' }: SkeletonProps) {
  const base = variantDefaults[variant];
  return (
    <div
      className={`animate-pulse bg-theme-card-hover/60 ${base.className} ${className}`}
      style={{ width, height }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-theme-xl border border-theme p-5 space-y-3">
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" />
      <Skeleton variant="rect" />
    </div>
  );
}
