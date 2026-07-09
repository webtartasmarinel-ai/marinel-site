import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import type { SiteSettings } from "@/types/content";

// Prefijadas con "/" para que funcionen también desde otras páginas (p. ej.
// /galeria), donde un "#ancla" suelto no tendría destino y no haría nada.
const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/#sobre", label: "Sobre Marinel" },
  { href: "/#galeria", label: "Galería" },
  { href: "/#tartas", label: "Tartas a Medida" },
  { href: "/#cursos", label: "Cursos" },
  { href: "/#contacto", label: "Contacto" },
];

// Iconos de marca minimalistas — lucide-react ya no incluye logotipos.
function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.5 3c.4 2.1 1.9 3.7 4 4v3a7 7 0 0 1-4-1.3v6.4a5.9 5.9 0 1 1-5.9-5.9c.2 0 .4 0 .6.03v3.06a2.9 2.9 0 1 0 2.3 2.84V3h3z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium tracking-[0.2em] text-brown uppercase">
      {children}
    </p>
  );
}

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    // Línea dorada superior — enlaza el footer con los acentos dorados del sitio
    <footer className="border-t border-[#c9a84c]/40 bg-footer-bg">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.3fr_0.8fr_1fr_1fr] md:gap-10 md:py-20">
        {/* Marca */}
        <div className="max-w-xs">
          <Link href="/" className="flex w-fit flex-col items-center gap-1.5">
            <Image
              src="/logo.png"
              alt="Marinel Pastelería"
              width={48}
              height={48}
              className="size-12 rounded-full object-cover"
            />
            <span className="font-heading text-xl leading-none font-medium text-foreground italic">
              Tartas Marinel
            </span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Cursos, masterclasses y clases privadas de pastelería, enseñadas
            con técnica y cariño.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-[#c9a84c] hover:text-pink-ink"
            >
              <InstagramIcon className="size-4.5" />
            </a>
            <a
              href={settings.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-[#c9a84c] hover:text-pink-ink"
            >
              <TikTokIcon className="size-4.5" />
            </a>
            <a
              href={settings.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-[#c9a84c] hover:text-pink-ink"
            >
              <MessageCircle className="size-4.5" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex flex-col gap-3">
          <ColumnTitle>Navegación</ColumnTitle>
          {NAV_LINKS.map((link) => (
            // <a> nativo a propósito: next/link no baja el scroll a un
            // #ancla cuando el pathname no cambia (probado en preview).
            <a
              key={link.href}
              href={link.href}
              className="w-fit text-sm text-muted-foreground transition-colors hover:text-[#b5677b]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Contacto */}
        <div className="flex flex-col gap-3">
          <ColumnTitle>Contacto</ColumnTitle>
          <a
            href={`mailto:${settings.email}`}
            className="flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[#b5677b]"
          >
            <Mail className="size-3.5 shrink-0" strokeWidth={1.5} />
            {settings.email}
          </a>
          <a
            href={`tel:${settings.phone.replace(/\s/g, "")}`}
            className="flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[#b5677b]"
          >
            <Phone className="size-3.5 shrink-0" strokeWidth={1.5} />
            {settings.phone}
          </a>
          <a
            href={settings.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/85"
          >
            <MessageCircle className="size-3.5" strokeWidth={1.5} />
            Hablar por WhatsApp
          </a>
        </div>

        {/* Visítanos */}
        <div className="flex flex-col gap-3">
          <ColumnTitle>Visítanos</ColumnTitle>
          {(settings.address || settings.city) && (
            <p className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
              <MapPin className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.5} />
              <span>
                {settings.address}
                {settings.address && settings.city && <br />}
                {settings.city}
              </span>
            </p>
          )}
          <p className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
            <Clock className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.5} />
            Pedidos y clases con cita previa
          </p>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Marinel Pastelería</p>
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link
              href="/aviso-legal"
              className="transition-colors hover:text-[#b5677b]"
            >
              Aviso legal
            </Link>
            <Link
              href="/privacidad"
              className="transition-colors hover:text-[#b5677b]"
            >
              Privacidad
            </Link>
            <Link
              href="/cookies"
              className="transition-colors hover:text-[#b5677b]"
            >
              Cookies
            </Link>
          </nav>
        </Container>
      </div>
    </footer>
  );
}
