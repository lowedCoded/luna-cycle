'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastCtx {
  toast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastCtx>({ toast: () => {} });
export const useToast = () => useContext(ToastContext);

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  error: <AlertCircle className="w-5 h-5 text-red-400" />,
  info: <Info className="w-5 h-5 text-accent" />,
};

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((type: ToastType, message: string) => {
    const id = nextId++;
    setItems((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const remove = (id: number) => setItems((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-theme-lg bg-theme-primary border border-theme shadow-theme-lg backdrop-blur-xl"
            >
              {icons[item.type]}
              <span className="text-sm text-theme-primary">{item.message}</span>
              <button onClick={() => remove(item.id)} className="ml-2 text-theme-muted hover:text-theme-primary">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
