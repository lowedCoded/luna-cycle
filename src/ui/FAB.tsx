'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, PenLine, ClipboardList, Smile } from 'lucide-react';
import { useRouter } from 'next/navigation';

const actions = [
  { icon: Smile, label: 'Quick Log', href: '/?quicklog=true' },
  { icon: PenLine, label: 'Diary', href: '/diary' },
  { icon: ClipboardList, label: 'Check-in', href: '/diary' },
];

export function FAB() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="fixed bottom-24 md:bottom-8 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && actions.map((a, i) => (
          <motion.button
            key={a.label}
            initial={{ opacity: 0, x: 40, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.8 }}
            transition={{ delay: i * 0.05, type: 'spring', damping: 22, stiffness: 250 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { router.push(a.href); setOpen(false); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-theme-lg bg-gradient-accent text-white shadow-theme-lg text-sm font-medium"
          >
            <a.icon className="w-4 h-4" />
            {a.label}
          </motion.button>
        ))}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-gradient-accent text-white shadow-theme-lg flex items-center justify-center"
      >
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
          <Plus className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </div>
  );
}
