import { createHmac, timingSafeEqual, scryptSync, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";

const COOKIE_NAME = "marinel_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

// Strip BOM, stray quotes and whitespace that sneak in via dashboard copy-paste.
function cleanEnv(value: string | undefined): string {
  return (value ?? "").trim().replace(/^["']+|["']+$/g, "").trim();
}

const SESSION_SECRET =
  cleanEnv(process.env.ADMIN_SESSION_SECRET) || "dev-only-insecure-secret-change-me";

function sign(value: string): string {
  return createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

// Password hashing with scrypt (Node built-in — no external dependency).
// Stored format: "scrypt$<salt-hex>$<derived-hex>".
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

function verifyHash(password: string, stored: string): boolean {
  const [scheme, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const derived = scryptSync(password, salt, 64);
  const storedBuf = Buffer.from(hash, "hex");
  if (storedBuf.length !== derived.length) return false;
  return timingSafeEqual(storedBuf, derived);
}

// The password hash lives in the isolated `admin_auth` table (RLS on, no anon
// policy) — deliberately NOT in site_settings, which is read on the public path.
async function getStoredHash(): Promise<string | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("admin_auth")
      .select("password_hash")
      .eq("id", 1)
      .single();
    if (error || !data) return null;
    return (data.password_hash as string) || null;
  } catch {
    return null;
  }
}

export async function verifyPassword(password: string): Promise<boolean> {
  const candidate = password?.trim();
  if (!candidate) return false;
  const storedHash = await getStoredHash();
  if (storedHash) return verifyHash(candidate, storedHash);
  // Bootstrap: no hash saved yet → fall back to the env password so nobody is
  // locked out. The first successful password change writes a hash and this
  // fallback path stops being used.
  const expected = cleanEnv(process.env.ADMIN_PASSWORD);
  if (!expected) return false;
  return safeEqual(candidate, expected);
}

// Persists the new password as a scrypt hash in Supabase (via the server-only
// service_role client). Works in production, unlike writing to process.env.
export async function updateAdminPassword(newPassword: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("admin_auth").upsert({
    id: 1,
    password_hash: hashPassword(newPassword),
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function createSession(): Promise<void> {
  const issuedAt = Date.now().toString();
  const signature = sign(issuedAt);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, `${issuedAt}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return false;
  const [issuedAt, signature] = raw.split(".");
  if (!issuedAt || !signature) return false;
  if (!safeEqual(signature, sign(issuedAt))) return false;
  // Reject sessions older than MAX_AGE even if the cookie value was copied
  // elsewhere: the signature alone stays valid forever, the timestamp does not.
  const age = Date.now() - Number(issuedAt);
  return Number.isFinite(age) && age >= 0 && age <= MAX_AGE_SECONDS * 1000;
}

// Guard for admin-only Server Actions. Server Actions are public POST endpoints
// (their IDs ship in the client bundle), so the layout redirect is NOT enough —
// every mutating action must verify the session itself.
export async function requireAdmin(): Promise<void> {
  if (!(await isAuthenticated())) {
    throw new Error("No autorizado.");
  }
}
