import type { Metadata } from "next";
import { LegalPage, legalValue } from "@/components/layout/legal-page";
import { getSiteSettings } from "@/services/settings";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Política de cookies del sitio web de Marinel Pastelería.",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

const UPDATED = "julio de 2026";

export default async function CookiesPage() {
  const settings = await getSiteSettings();
  const email = legalValue(
    settings.legalEmail || settings.email,
    "Email de contacto",
  );

  return (
    <LegalPage
      settings={settings}
      title="Política de cookies"
      updated={UPDATED}
    >
      <section className="space-y-3">
        <h2>1. Qué son las cookies</h2>
        <p>
          Las cookies son pequeños archivos que los sitios web guardan en tu
          navegador para recordar información entre visitas, como una sesión
          iniciada o tus preferencias.
        </p>
      </section>

      <section className="space-y-3">
        <h2>2. Cookies que utiliza este sitio</h2>
        <p>
          Este sitio web utiliza únicamente{" "}
          <strong>una cookie técnica propia</strong>:
        </p>
        <ul>
          <li>
            <strong>marinel_admin_session</strong> — mantiene la sesión
            iniciada en el panel de administración. Solo se crea si accedes a
            dicha área con contraseña; los visitantes normales del sitio
            nunca la reciben. Caduca a los 7 días.
          </li>
        </ul>
        <p>
          Conforme al artículo 22.2 de la LSSI-CE y a los criterios de la
          Agencia Española de Protección de Datos, las cookies estrictamente
          técnicas están <strong>exentas de consentimiento</strong>; por ese
          motivo este sitio no muestra un banner de cookies.
        </p>
        <p>
          Este sitio <strong>no utiliza</strong> cookies de análisis,
          publicidad, seguimiento ni redes sociales.
        </p>
      </section>

      <section className="space-y-3">
        <h2>3. Servicios de terceros bajo demanda</h2>
        <p>
          La sección de localización incluye un mapa de{" "}
          <strong>Google Maps</strong> que solo se carga cuando tú decides
          activarlo haciendo clic. Al activarlo, Google puede instalar sus
          propias cookies conforme a su{" "}
          <a
            href="https://policies.google.com/technologies/cookies"
            target="_blank"
            rel="noopener noreferrer"
          >
            política de cookies
          </a>
          . Hasta ese momento no se realiza ninguna conexión con Google.
        </p>
      </section>

      <section className="space-y-3">
        <h2>4. Cómo gestionar las cookies en tu navegador</h2>
        <p>
          Puedes bloquear o eliminar las cookies desde la configuración de tu
          navegador: Chrome, Safari, Firefox y Edge disponen de opciones para
          ello en sus ajustes de privacidad. Ten en cuenta que bloquear la
          cookie técnica solo afectaría al panel de administración, no a tu
          navegación por el sitio.
        </p>
      </section>

      <section className="space-y-3">
        <h2>5. Contacto</h2>
        <p>
          Para cualquier duda sobre esta política puedes escribir a {email}.
          Más información sobre el tratamiento de datos en la{" "}
          <a href="/privacidad">Política de privacidad</a>.
        </p>
      </section>
    </LegalPage>
  );
}
