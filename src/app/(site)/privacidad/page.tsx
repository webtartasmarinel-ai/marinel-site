import type { Metadata } from "next";
import { LegalPage, legalValue } from "@/components/layout/legal-page";
import { getSiteSettings } from "@/services/settings";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad y protección de datos de Marinel Pastelería.",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

const UPDATED = "julio de 2026";

export default async function PrivacidadPage() {
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
    <LegalPage
      settings={settings}
      title="Política de privacidad"
      updated={UPDATED}
    >
      <section className="space-y-3">
        <h2>1. Responsable del tratamiento</h2>
        <p>
          De acuerdo con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica
          3/2018, de Protección de Datos Personales y garantía de los derechos
          digitales (LOPDGDD), se informa de que la responsable del
          tratamiento de los datos personales recogidos en este sitio web es:
        </p>
        <ul>
          <li>
            <strong>Responsable:</strong> {holder}
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
        </ul>
      </section>

      <section className="space-y-3">
        <h2>2. Qué datos se recogen y con qué finalidad</h2>
        <p>
          Este sitio web no requiere registro de usuarios ni realiza pagos
          online. Únicamente se recogen los datos que tú decides facilitar a
          través de dos formularios:
        </p>
        <h3>Formulario de cursos y masterclasses</h3>
        <ul>
          <li>
            <strong>Datos:</strong> nombre, teléfono, email, ciudad, curso de
            interés, nivel de experiencia, objetivo y mensaje opcional.
          </li>
          <li>
            <strong>Finalidad:</strong> responder a tu solicitud de
            información y gestionar tu inscripción en el curso o masterclass.
          </li>
        </ul>
        <h3>Formulario de tartas a medida</h3>
        <ul>
          <li>
            <strong>Datos:</strong> nombre, teléfono, email, y las
            preferencias de la tarta (ocasión, estilo, bizcocho, relleno,
            tamaño, fecha deseada y descripción).
          </li>
          <li>
            <strong>Finalidad:</strong> preparar y enviarte un presupuesto
            personalizado.
          </li>
        </ul>
        <p>
          Los datos marcados como obligatorios son necesarios para atender la
          solicitud; sin ellos no es posible gestionarla.
        </p>
      </section>

      <section className="space-y-3">
        <h2>3. Base jurídica</h2>
        <p>
          La base jurídica del tratamiento es tu <strong>consentimiento</strong>{" "}
          (art. 6.1.a RGPD), que prestas al marcar la casilla de aceptación y
          enviar el formulario, así como la aplicación de{" "}
          <strong>medidas precontractuales</strong> a petición tuya (art.
          6.1.b RGPD), ya que las solicitudes están orientadas a la posible
          contratación de un curso o el encargo de una tarta.
        </p>
        <p>
          Los formularios de este sitio están dirigidos a personas mayores de
          14 años. Si eres menor de esa edad, pide a tu madre, padre o tutor
          que realice la solicitud por ti.
        </p>
      </section>

      <section className="space-y-3">
        <h2>4. Dónde se almacenan los datos y quién accede a ellos</h2>
        <p>
          Tus datos <strong>no se ceden a terceros</strong> ni se utilizan
          para publicidad. Para prestar el servicio se utilizan los siguientes
          proveedores tecnológicos, que actúan como encargados del
          tratamiento:
        </p>
        <ul>
          <li>
            <strong>Supabase</strong> — base de datos donde se almacenan las
            solicitudes, con servidores ubicados en la Unión Europea
            (Irlanda).
          </li>
          <li>
            <strong>Vercel</strong> — alojamiento del sitio web.
          </li>
        </ul>
        <p>
          Al enviar el formulario de tartas, el sitio te ofrece continuar la
          conversación por <strong>WhatsApp</strong>; ese canal se rige por la
          política de privacidad de WhatsApp y solo se usa si tú decides
          abrirlo.
        </p>
      </section>

      <section className="space-y-3">
        <h2>5. Plazo de conservación</h2>
        <p>
          Los datos se conservan mientras dure la gestión de tu solicitud y
          la relación posterior (curso o pedido), y después durante los plazos
          legalmente exigibles. Puedes pedir su supresión en cualquier
          momento.
        </p>
      </section>

      <section className="space-y-3">
        <h2>6. Tus derechos</h2>
        <p>
          Puedes ejercer en cualquier momento tus derechos de{" "}
          <strong>
            acceso, rectificación, supresión, oposición, limitación del
            tratamiento y portabilidad
          </strong>{" "}
          escribiendo a {email}, indicando el derecho que deseas ejercer y
          adjuntando un medio que permita verificar tu identidad.
        </p>
        <p>
          Si consideras que el tratamiento no se ajusta a la normativa, puedes
          presentar una reclamación ante la Agencia Española de Protección de
          Datos (
          <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
            www.aepd.es
          </a>
          ).
        </p>
      </section>

      <section className="space-y-3">
        <h2>7. Medidas de seguridad</h2>
        <p>
          La Titular aplica las medidas técnicas y organizativas apropiadas
          para proteger tus datos: comunicación cifrada (HTTPS), acceso a la
          base de datos restringido mediante credenciales y almacenamiento en
          proveedores con garantías de seguridad reconocidas.
        </p>
      </section>

      <section className="space-y-3">
        <h2>8. Cambios en esta política</h2>
        <p>
          Esta política puede actualizarse para reflejar cambios normativos o
          del propio sitio web. La fecha de la última actualización figura al
          principio de la página.
        </p>
      </section>
    </LegalPage>
  );
}
