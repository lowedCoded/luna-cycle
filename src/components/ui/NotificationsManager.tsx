'use client';

import { useEffect, useRef } from 'react';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { useCycleStore } from '@/lib/store/cycleStore';
import { addDays, parseISO, differenceInDays } from 'date-fns';

export function NotificationsManager() {
  const notifications = useSettingsStore((s) => s.notifications);
  const cycles = useCycleStore((s) => s.cycles);
  const asked = useRef(false);

  useEffect(() => {
    if (!notifications || asked.current) return;
    if (!('Notification' in window)) return;

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
    asked.current = true;
  }, [notifications]);

  useEffect(() => {
    if (!notifications || Notification.permission !== 'granted') return;
    if (cycles.length === 0) return;

    const latest = cycles[cycles.length - 1];
    const nextStart = addDays(parseISO(latest.startDate), latest.cycleLength);
    const daysUntil = differenceInDays(nextStart, new Date());

    if (daysUntil === 0) {
      new Notification('Luna', { body: 'Your period is expected to start today.' });
    } else if (daysUntil === 1) {
      new Notification('Luna', { body: 'Your period is expected to start tomorrow.' });
    } else if (daysUntil === 3) {
      new Notification('Luna', { body: 'Your period is expected in 3 days. Get prepared!' });
    }
  }, [notifications, cycles]);

  return null;
}
