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
  Palette,
  Wind,
  Thermometer,
  BookOpenText,
} from 'lucide-react';
import { useT } from '@/components/providers/AppProvider';

const navItems = [
  { href: '/', icon: Activity, labelKey: 'dashboard' as const },
  { href: '/calendar', icon: Calendar, labelKey: 'calendar' as const },
  { href: '/moodboard', icon: Palette, labelKey: 'moodboard' as const },
  { href: '/breathe', icon: Wind, labelKey: 'breathe' as const },
  { href: '/warmth', icon: Thermometer, labelKey: 'warmth' as const },
  { href: '/diary', icon: BookOpen, labelKey: 'diary' as const },
  { href: '/tips', icon: Lightbulb, labelKey: 'tips' as const },
  { href: '/wiki', icon: BookOpenText, labelKey: 'wiki' as const },
  { href: '/help', icon: HelpCircle, labelKey: 'help' as const },
  { href: '/settings', icon: Settings, labelKey: 'settings' as const },
];

export function BottomNav() {
  const pathname = usePathname();
  const t = useT();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-theme bg-theme-primary/90 backdrop-blur-xl safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} aria-current={isActive ? 'page' : undefined} className="relative flex flex-col items-center gap-0.5 px-3 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-md">
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-2 w-8 h-1 rounded-full bg-gradient-accent"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'text-accent' : 'text-theme-muted'}`} />
              <span className={`text-[10px] ${isActive ? 'text-theme-primary font-medium' : 'text-theme-muted'}`}>
                {String(t.nav[item.labelKey]).slice(0, 4)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
