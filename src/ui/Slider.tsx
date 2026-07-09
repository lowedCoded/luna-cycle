'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SliderProps {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  label?: string;
  icon?: React.ReactNode;
  formatValue?: (v: number) => string;
  showTooltip?: boolean;
}

export function Slider({ value, onChange, min, max, step = 1, label, icon, formatValue, showTooltip = true }: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltipState, setShowTooltip] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const updateFromPointer = useCallback((clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const val = min + x * (max - min);
    const stepped = Math.round(val / step) * step;
    onChange(Math.max(min, Math.min(max, stepped)));
  }, [min, max, step, onChange]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    isDraggingRef.current = true;
    updateFromPointer(e.clientX);
  }, [updateFromPointer]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      updateFromPointer(e.clientX);
    };
    const handleUp = () => {
      setIsDragging(false);
      isDraggingRef.current = false;
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [isDragging, updateFromPointer]);

  const displayValue = formatValue ? formatValue(value) : String(value);

  return (
    <div className="relative">
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            {icon && <span className="w-4 h-4 text-accent">{icon}</span>}
            <label className="text-xs font-medium text-theme-primary">{label}</label>
          </div>
          <span className="text-xs font-semibold text-theme-primary tabular-nums">{displayValue}</span>
        </div>
      )}
      <div
        ref={trackRef}
        className="relative h-7 flex items-center cursor-pointer group"
        onPointerDown={handlePointerDown}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => { if (!isDragging) setShowTooltip(false); }}
      >
        <div className="absolute inset-x-0 h-2 rounded-full bg-theme-card-hover border border-theme overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: 'var(--gradient-accent)',
              boxShadow: '0 0 8px var(--accent-glow)',
            }}
            layout
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          />
        </div>
        <motion.div
          className="absolute w-5 h-5 rounded-full bg-white shadow-lg border-2 border-accent flex items-center justify-center"
          style={{
            left: `calc(${pct}% - 10px)`,
            boxShadow: isDragging ? '0 0 12px var(--accent-glow), 0 0 24px var(--accent-glow)' : '0 2px 8px rgba(0,0,0,0.15)',
          }}
          animate={{ scale: isDragging ? 1.25 : 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
        >
          <div className="w-2 h-2 rounded-full bg-accent" />
        </motion.div>
        {showTooltip && (showTooltipState || isDragging) && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-theme-sm bg-theme-primary border border-theme text-[10px] text-theme-primary font-semibold shadow-theme whitespace-nowrap z-10 pointer-events-none"
          >
            {displayValue}
          </motion.div>
        )}
      </div>
    </div>
  );
}