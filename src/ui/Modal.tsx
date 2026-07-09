'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ open, onClose, title, children }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !ref.current) return;
    const focusable = ref.current.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    window.addEventListener('keydown', trapFocus);
    requestAnimationFrame(() => {
      const focusable = ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (focusable && focusable.length > 0) focusable[0].focus();
    });
    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('keydown', trapFocus);
      previousFocus.current?.focus();
    };
  }, [open, onClose, trapFocus]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            ref={ref}
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-theme-primary rounded-theme-xl p-6 w-full max-w-sm shadow-theme-lg border border-theme"
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {title && (
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-theme-primary">{title}</h3>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  onClick={onClose}
                  className="p-1 hover:bg-theme-card-hover rounded-theme-sm"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-theme-muted" />
                </motion.button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
