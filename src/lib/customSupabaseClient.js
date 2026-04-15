import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠ Supabase env vars missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).',
    '\n  The app will run in offline mode. Restart Vite after setting your .env.'
  );
  // Create a dummy client that won't crash the app
  const noOp = () => ({ data: null, error: { message: 'Supabase not configured', code: 'NO_CONFIG' } });
  const noOpChain = () => new Proxy({}, { get: () => noOpChain });
  supabase = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => noOp(),
      signUp: async () => noOp(),
      signOut: async () => noOp(),
      signInWithOAuth: async () => noOp(),
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: async () => noOp(), maybeSingle: async () => noOp(), order: () => Promise.resolve(noOp()) }), single: async () => noOp(), maybeSingle: async () => noOp() }),
      insert: () => ({ select: () => ({ single: async () => noOp() }) }),
      upsert: () => ({ select: () => ({ single: async () => noOp() }) }),
      update: () => ({ eq: async () => noOp() }),
      delete: () => ({ eq: async () => noOp() }),
    }),
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
