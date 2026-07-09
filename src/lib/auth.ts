import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "marinel_admin_session";
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ?? "dev-only-insecure-secret-change-me";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function sign(value: string): string {
  return createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected || !password) return false;
  return safeEqual(password, expected);
}

// In production (Vercel), update ADMIN_PASSWORD through the Vercel dashboard.
export async function updateAdminPassword(newPassword: string): Promise<void> {
  process.env.ADMIN_PASSWORD = newPassword;
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
  return safeEqual(signature, sign(issuedAt));
}
