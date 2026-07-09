'use client';

import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { RegisterModal } from '@/components/auth/RegisterModal';
import { Greeting } from '@/components/auth/Greeting';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { NotificationsManager } from '@/components/ui/NotificationsManager';
import { AmbientCanvas } from '@/components/ambient/AmbientCanvas';
import { ThemeDecorations } from '@/components/decorations/ThemeDecorations';
import { PageTransition } from '@/components/layout/PageTransition';
import { ToastProvider } from '@/ui/Toast';
import { FAB } from '@/ui/FAB';
import { useSettingsStore } from '@/lib/store/settingsStore';

export function AppLayout({ children }: { children: ReactNode }) {
  const customCursor = useSettingsStore((s) => s.customCursor);

  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        {customCursor && <CustomCursor />}
        <AmbientCanvas />
        <ThemeDecorations />
        <NotificationsManager />
        <RegisterModal />
        <Sidebar />
        <main className="flex-1 md:ml-64 pb-20 md:pb-0 min-h-screen main-bg relative">
          <div className="p-4 md:p-8 max-w-6xl mx-auto scroll-mt-20">
            <Greeting />
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
        <FAB />
        <BottomNav />
      </div>
    </ToastProvider>
  );
}
