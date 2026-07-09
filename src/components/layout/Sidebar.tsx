'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Activity,
  Calendar,
  BookOpen,
  Lightbulb,
  Settings,
  HelpCircle,
  Flower2,
  Sparkles,
  Palette,
  History,
  Grid3X3,
  Wind,
  Thermometer,
  BookOpenText,
} from 'lucide-react';
import { useT } from '@/components/providers/AppProvider';
import { PhaseAvatar } from '@/components/widgets/PhaseAvatar';

const navItems = [
  { href: '/', icon: Activity, labelKey: 'dashboard' as const },
  { href: '/calendar', icon: Calendar, labelKey: 'calendar' as const },
  { href: '/heatmap', icon: Grid3X3, labelKey: 'heatmap' as const },
  { href: '/moodboard', icon: Palette, labelKey: 'moodboard' as const },
  { href: '/timeline', icon: History, labelKey: 'timeline' as const },
  { href: '/diary', icon: BookOpen, labelKey: 'diary' as const },
  { href: '/tips', icon: Lightbulb, labelKey: 'tips' as const },
  { href: '/breathe', icon: Wind, labelKey: 'breathe' as const },
  { href: '/warmth', icon: Thermometer, labelKey: 'warmth' as const },
  { href: '/wiki', icon: BookOpenText, labelKey: 'wiki' as const },
  { href: '/help', icon: HelpCircle, labelKey: 'help' as const },
  { href: '/settings', icon: Settings, labelKey: 'settings' as const },
];

export function Sidebar() {
  const pathname = usePathname();
  const t = useT();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 z-40 border-r border-theme/50 bg-theme-primary/60 backdrop-blur-2xl sidebar-bg">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="relative">
          <div className="w-10 h-10 rounded-theme-lg bg-gradient-accent flex items-center justify-center shadow-theme">
            <Flower2 className="w-5 h-5 text-white" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="w-3 h-3 text-accent" />
          </motion.div>
        </div>
        <div>
          <h1 className="text-lg font-bold text-theme-primary leading-tight tracking-tight">Luna</h1>
          <p className="text-[10px] text-theme-muted uppercase tracking-widest">Cycle Tracker</p>
        </div>
      </div>

      <div className="flex justify-center py-4">
        <PhaseAvatar size="sm" />
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1" role="navigation" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} aria-current={isActive ? 'page' : undefined}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-theme-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                  isActive
                    ? 'bg-gradient-accent text-white shadow-theme'
                    : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-card-hover/50 backdrop-blur-sm'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{String((t.nav as Record<string, string>)[item.labelKey])}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-theme/50">
        <p className="text-[10px] text-theme-muted uppercase tracking-widest">Luna v2.0</p>
      </div>
    </aside>
  );
}
