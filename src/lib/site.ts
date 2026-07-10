// Dominio de producción: www.tartasmarinel.com (el apex redirige a www).
// NEXT_PUBLIC_SITE_URL lo sobreescribe en local (http://localhost:3000).
function resolveUrl(fromEnv: string | undefined, fallback: string): string {
  if (!fromEnv) return fallback;
  try { new URL(fromEnv); return fromEnv; } catch { return fallback; }
}
export const SITE_URL = resolveUrl(
  process.env.NEXT_PUBLIC_SITE_URL,
  "https://www.tartasmarinel.com",
);

// Las imágenes hoy vienen de /public/uploads (ruta relativa); en el futuro
// (go-live) pueden venir de Supabase Storage (URL ya absoluta).
export function toAbsoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}
