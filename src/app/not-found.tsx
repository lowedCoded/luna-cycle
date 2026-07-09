'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flower2, ArrowLeft } from 'lucide-react';
import { useT } from '@/components/providers/AppProvider';

export default function NotFound() {
  const t = useT();
  return (
    <div className="relative min-h-[calc(100vh-6rem)] flex items-center justify-center">
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full bg-gradient-accent flex items-center justify-center mx-auto mb-6"
        >
          <Flower2 className="w-12 h-12 text-white" />
        </motion.div>
        <h1 className="text-6xl font-bold text-theme-primary mb-2">404</h1>
        <p className="text-theme-secondary mb-6">{t.common.notFound || 'Page not found'}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-theme-lg bg-gradient-accent text-white font-semibold shadow-theme hover:shadow-theme-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.common.backToDashboard || 'Back to Dashboard'}
        </Link>
      </div>
    </div>
  );
}
