import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Public reads — RLS filters to published content (anon key)
export function createPublicClient() {
  return createClient(url, anonKey);
}

// Admin writes — bypasses RLS (service role, server-side only)
export function createAdminClient() {
  return createClient(url, serviceKey);
}
