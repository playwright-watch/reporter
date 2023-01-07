import { createClient } from '@supabase/supabase-js';

export const getSupabase = (project: string, key: string) =>
  createClient(`https://${project}.supabase.co`, key);
