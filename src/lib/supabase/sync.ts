'use client';

import { createClient } from './client';

type SyncType = 'cycles' | 'entries' | 'habits' | 'medications' | 'settings';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sb = () => createClient() as any;

export async function syncToServer(type: SyncType, data: unknown) {
  const supabase = createClient();
  if (!supabase) return;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  await sb().from(`user_${type}`).upsert({
    user_id: session.user.id,
    data,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
}

export async function syncFromServer(type: SyncType | 'all'): Promise<Record<string, unknown> | null> {
  const supabase = createClient();
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const result: Record<string, unknown> = {};

  if (type === 'all') {
    const tables: SyncType[] = ['cycles', 'entries', 'habits', 'medications', 'settings'];
    for (const t of tables) {
      const { data } = await sb().from(`user_${t}`).select('data').eq('user_id', session.user.id).single();
      result[t] = data?.data ?? null;
    }
  } else {
    const { data } = await sb().from(`user_${type}`).select('data').eq('user_id', session.user.id).single();
    result[type] = data?.data ?? null;
  }

  return result;
}

export async function isAuthenticated(): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}