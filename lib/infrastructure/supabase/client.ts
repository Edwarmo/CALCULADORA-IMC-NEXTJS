/**
 * Supabase Client
 * Infrastructure layer - External service integration
 */

import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client for browser-side usage
 * Uses public anon key - safe to expose in client code
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Type-safe Supabase client for server-side usage
 * Use this in Server Components and Server Actions
 */
export const supabaseServer = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
