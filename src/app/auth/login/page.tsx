'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message === 'Invalid login credentials' ? 'Неверный email или пароль' : error.message);
    } else {
      router.push('/');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-secondary)] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-theme-xl bg-theme-card border border-theme shadow-theme p-8"
      >
        <div className="flex flex-col items-center mb-6">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-12 h-12 rounded-full bg-gradient-accent flex items-center justify-center mb-3"
          >
            <LogIn className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="text-xl font-bold text-theme-primary">Вход в Luna</h1>
          <p className="text-sm text-theme-muted mt-1">Войдите, чтобы продолжить</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-theme-secondary block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-theme-card-hover border border-theme rounded-theme-md px-3 py-2 text-sm text-theme-primary outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-glow)] transition-all"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-theme-secondary block mb-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-theme-card-hover border border-theme rounded-theme-md px-3 py-2 text-sm text-theme-primary outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-glow)] transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-theme-sm"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-theme-md bg-gradient-accent text-white font-medium text-sm shadow-theme disabled:opacity-50 transition-all"
          >
            {loading ? 'Вход...' : 'Войти'}
          </motion.button>
        </form>

        <p className="text-xs text-theme-muted text-center mt-4">
          Нет аккаунта?{' '}
          <Link href="/auth/signup" className="text-accent hover:text-accent-light">
            Зарегистрироваться
          </Link>
        </p>
      </motion.div>
    </div>
  );
}