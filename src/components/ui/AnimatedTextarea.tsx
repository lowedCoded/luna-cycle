'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  lang?: string;
}

export function AnimatedTextarea({ value, onChange, placeholder, rows, className = '', lang }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const keyCounter = useRef(0);
  const [charKeys, setCharKeys] = useState<number[]>([]);

  useEffect(() => {
    setCharKeys((prev) => {
      if (prev.length === value.length) return prev;
      const next = prev.slice(0, value.length);
      while (next.length < value.length) {
        next.push(keyCounter.current++);
      }
      return next;
    });
  }, [value]);

  const handleScroll = useCallback(() => {
    if (textareaRef.current && overlayRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop;
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onScroll={handleScroll}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none bg-transparent text-transparent caret-[var(--accent)] outline-none p-3"
        lang={lang}
      />
      <div
        ref={overlayRef}
        className="absolute inset-0 p-3 overflow-auto whitespace-pre-wrap break-words pointer-events-none"
        aria-hidden
        style={{ color: 'inherit' }}
      >
        {charKeys.length === 0 && placeholder && (
          <span className="text-theme-muted">{placeholder}</span>
        )}
        {value.split('').map((char, i) => {
          if (char === '\n') return <br key={charKeys[i]} />;
          return (
            <motion.span
              key={charKeys[i]}
              initial={{ scale: 0.4, opacity: 0, y: 4 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 260, mass: 0.4 }}
              className="inline-block"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}
