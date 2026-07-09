import { createClient } from "@supabase/supabase-js";

// SUPABASE_URL and SUPABASE_ANON_KEY intentionally lack the NEXT_PUBLIC_ prefix
// so that Turbopack does NOT inline them at build time. They are server-only
// and are read from process.env at runtime, when Vercel provides the real values.

// Public reads — RLS filters to published content (anon key)
export function createPublicClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

// Admin writes — bypasses RLS (service role, server-side only)
export function createAdminClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}
