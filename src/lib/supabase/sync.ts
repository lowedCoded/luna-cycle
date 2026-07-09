'use client';

import { createClient } from './client';

type SyncType = 'cycles' | 'entries' | 'habits' | 'medications' | 'settings';

export async function syncToServer(type: SyncType, data: unknown) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const tableMap: Record<string, string> = {
    cycles: 'user_cycles',
    entries: 'user_entries',
    habits: 'user_habits',
    medications: 'user_medications',
    settings: 'user_settings',
  };

  const table = tableMap[type];
  if (!table) return;

  await supabase.from(table).upsert({
    user_id: session.user.id,
    data,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
}

export async function syncFromServer(type: SyncType | 'all'): Promise<Record<string, unknown> | null> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const tableMap: Record<string, string> = {
    cycles: 'user_cycles',
    entries: 'user_entries',
    habits: 'user_habits',
    medications: 'user_medications',
    settings: 'user_settings',
  };

  const result: Record<string, unknown> = {};

  if (type === 'all') {
    for (const [key, table] of Object.entries(tableMap)) {
      const { data } = await supabase.from(table).select('data').eq('user_id', session.user.id).single();
      result[key] = data?.data || null;
    }
  } else {
    const table = tableMap[type];
    if (!table) return null;
    const { data } = await supabase.from(table).select('data').eq('user_id', session.user.id).single();
    result[type] = data?.data || null;
  }

  return result;
}

export async function isAuthenticated(): Promise<boolean> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}