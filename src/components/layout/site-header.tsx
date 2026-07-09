"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

export function SiteHeader({ whatsappUrl }: { whatsappUrl: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:px-6 md:pt-6">
      <div
        className={cn(
          "grid w-full max-w-5xl grid-cols-[auto_1fr_auto] items-center gap-4 rounded-full px-5 py-3 transition-all duration-500 lg:px-4",
          scrolled
            ? "border border-[#c9a84c]/40 bg-background/90 shadow-[0_10px_40px_-20px_rgba(139,107,92,0.25)] backdrop-blur-md"
            : "border border-transparent bg-transparent",
        )}
      >
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Marinel Pastelería"
            width={52}
            height={52}
            className="size-12 rounded-full object-cover"
            priority
          />
        </Link>

        <nav className="hidden items-center justify-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            // <a> nativo a propósito: next/link no baja el scroll a un
            // #ancla cuando el pathname no cambia (probado en preview).
            <a
              key={link.href}
              href={link.href}
              className="text-sm whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2">
          <div className="hidden lg:block">
            <LinkButton
              href={whatsappUrl}
              external
              className="h-auto rounded-full bg-primary px-5 py-2.5 text-primary-foreground hover:bg-primary/85"
            >
              Hablar por WhatsApp
            </LinkButton>
          </div>

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Abrir menú"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col gap-1 pt-14">
              <SheetHeader className="sr-only">
                <SheetTitle>Menú</SheetTitle>
              </SheetHeader>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-3 font-heading text-lg text-foreground hover:bg-muted"
                >
                  {link.label}
                </a>
              ))}
              <LinkButton
                href={whatsappUrl}
                external
                className="mt-4 h-auto rounded-full bg-primary px-5 py-3 text-primary-foreground hover:bg-primary/85"
              >
                Hablar por WhatsApp
              </LinkButton>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
