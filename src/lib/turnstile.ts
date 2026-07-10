// Verificación server-side de Cloudflare Turnstile (anti-spam de los
// formularios públicos). La Secret Key vive solo en el servidor
// (env TURNSTILE_SECRET_KEY); la Site Key, pública, está en el widget.

const VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Verifica el token del widget contra Cloudflare.
// - Si la Secret Key aún no está configurada, NO bloquea (para no romper los
//   formularios durante el despliegue). En cuanto se añade la env var, la
//   verificación pasa a exigirse.
// - Si Cloudflare no responde, tampoco bloquea a un cliente legítimo.
export async function verifyTurnstile(token: string | null): Promise<boolean> {
  const secret = (process.env.TURNSTILE_SECRET_KEY ?? "").trim();
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return true;
  }
}
