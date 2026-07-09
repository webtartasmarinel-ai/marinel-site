// Dominio aún no registrado — placeholder hasta que la clienta elija uno y
// Smolak Studio configure el dominio definitivo en producción.
function resolveUrl(fromEnv: string | undefined, fallback: string): string {
  if (!fromEnv) return fallback;
  try { new URL(fromEnv); return fromEnv; } catch { return fallback; }
}
export const SITE_URL = resolveUrl(
  process.env.NEXT_PUBLIC_SITE_URL,
  "https://marinelpasteleria.com",
);

// Las imágenes hoy vienen de /public/uploads (ruta relativa); en el futuro
// (go-live) pueden venir de Supabase Storage (URL ya absoluta).
export function toAbsoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}
