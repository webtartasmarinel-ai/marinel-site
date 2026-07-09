import type { Metadata } from "next";
import { LegalPage, legalValue } from "@/components/layout/legal-page";
import { getSiteSettings } from "@/services/settings";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aviso legal",
  description:
    "Aviso legal y condiciones de uso del sitio web de Marinel Pastelería.",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

const UPDATED = "julio de 2026";

export default async function AvisoLegalPage() {
  const settings = await getSiteSettings();
  const holder = legalValue(settings.legalHolderName, "Nombre de la titular");
  const nif = legalValue(settings.legalNif, "NIF");
  const address = legalValue(settings.legalAddress, "Dirección");
  const city = legalValue(settings.legalCity, "CP y ciudad");
  const email = legalValue(
    settings.legalEmail || settings.email,
    "Email de contacto",
  );

  return (
    <LegalPage settings={settings} title="Aviso legal" updated={UPDATED}>
      <section className="space-y-3">
        <h2>1. Datos identificativos</h2>
        <p>
          En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio,
          de Servicios de la Sociedad de la Información y de Comercio
          Electrónico (LSSI-CE), se informa de que la titular de este sitio
          web es:
        </p>
        <ul>
          <li>
            <strong>Titular:</strong> {holder}
          </li>
          <li>
            <strong>NIF:</strong> {nif}
          </li>
          <li>
            <strong>Domicilio:</strong> {address}, {city}
          </li>
          <li>
            <strong>Email de contacto:</strong> {email}
          </li>
          <li>
            <strong>Sitio web:</strong> {SITE_URL}
          </li>
        </ul>
        <p>
          En adelante, «la Titular». Este sitio web tiene por objeto ofrecer
          información sobre los cursos, masterclasses y clases privadas de
          repostería impartidos por la Titular, así como permitir la solicitud
          de presupuestos de tartas personalizadas.
        </p>
      </section>

      <section className="space-y-3">
        <h2>2. Condiciones de uso</h2>
        <p>
          El acceso y la navegación por este sitio web atribuyen la condición
          de usuario e implican la aceptación de este Aviso legal. El usuario
          se compromete a hacer un uso adecuado de los contenidos y a no
          emplearlos para actividades ilícitas o contrarias a la buena fe.
        </p>
        <p>
          La formalización de inscripciones en cursos y el encargo de tartas
          no se realizan ni se pagan a través de este sitio web: los
          formularios únicamente inician una solicitud de información o de
          presupuesto que la Titular gestiona de forma personal, y cualquier
          pago se acuerda directamente con ella (Bizum o transferencia).
        </p>
      </section>

      <section className="space-y-3">
        <h2>3. Propiedad intelectual e industrial</h2>
        <p>
          Todos los contenidos de este sitio web (textos, fotografías de
          tartas y del obrador, logotipo, diseño y código) son titularidad de
          la Titular o se publican con su autorización, y están protegidos por
          la normativa española de propiedad intelectual e industrial. Queda
          prohibida su reproducción, distribución o comunicación pública con
          fines comerciales sin autorización expresa.
        </p>
      </section>

      <section className="space-y-3">
        <h2>4. Enlaces externos</h2>
        <p>
          Este sitio contiene enlaces a servicios de terceros (Instagram,
          TikTok, WhatsApp y Google Maps). La Titular no se hace responsable
          de los contenidos ni de las prácticas de privacidad de dichos
          servicios, que se rigen por sus propias condiciones.
        </p>
      </section>

      <section className="space-y-3">
        <h2>5. Responsabilidad</h2>
        <p>
          La Titular no garantiza la disponibilidad ininterrumpida del sitio
          web ni la ausencia de errores en los contenidos, aunque se
          compromete a subsanarlos tan pronto como tenga conocimiento de
          ellos. Las fechas, plazas y precios de los cursos publicados tienen
          carácter informativo y pueden variar; las condiciones definitivas se
          confirman siempre de forma personal con la Titular.
        </p>
      </section>

      <section className="space-y-3">
        <h2>6. Protección de datos y cookies</h2>
        <p>
          El tratamiento de los datos personales recogidos a través de los
          formularios se describe en la{" "}
          <a href="/privacidad">Política de privacidad</a>. El uso de cookies
          se describe en la <a href="/cookies">Política de cookies</a>.
        </p>
      </section>

      <section className="space-y-3">
        <h2>7. Legislación aplicable y jurisdicción</h2>
        <p>
          Este Aviso legal se rige por la legislación española. Para cualquier
          controversia que pudiera derivarse del acceso o uso de este sitio
          web, las partes se someten a los juzgados y tribunales que
          correspondan conforme a la normativa aplicable en materia de
          consumidores y usuarios.
        </p>
      </section>
    </LegalPage>
  );
}
