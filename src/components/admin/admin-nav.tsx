"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  Cake,
  CakeSlice,
  Images,
  Layers,
  Quote,
  Inbox,
  Palette,
  Scale,
  PartyPopper,
  Ruler,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/admin/actions/auth";

const NAV_GROUPS = [
  {
    label: null as string | null,
    items: [{ href: "/admin/dashboard", label: "Panel", icon: LayoutDashboard }],
  },
  {
    label: "Contenido",
    items: [
      { href: "/admin/cursos", label: "Cursos", icon: BookOpen },
      { href: "/admin/masterclass", label: "Masterclass", icon: CalendarDays },
      { href: "/admin/galeria", label: "Galería", icon: Images },
      { href: "/admin/testimonios", label: "Testimonios", icon: Quote },
    ],
  },
  {
    label: "Negocio",
    items: [
      { href: "/admin/pedidos", label: "Pedidos", icon: CakeSlice },
      { href: "/admin/ocasiones", label: "Ocasiones", icon: PartyPopper },
      { href: "/admin/tamanos", label: "Tamaños", icon: Ruler },
      { href: "/admin/estilos", label: "Estilos", icon: Palette },
      { href: "/admin/bizcochos", label: "Bizcochos", icon: Cake },
      { href: "/admin/rellenos", label: "Rellenos", icon: Layers },
      { href: "/admin/formularios", label: "Formularios", icon: Inbox },
      { href: "/admin/legal", label: "Datos legales", icon: Scale },
      { href: "/admin/configuracion", label: "Configuración", icon: Settings },
    ],
  },
];

export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <Link
        href="/admin/dashboard"
        className="px-2 font-heading text-xl text-foreground italic"
      >
        Gestión Marinel
      </Link>

      <nav className="mt-8 flex-1 space-y-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.label ?? "root"}>
            {group.label && (
              <p className="px-2.5 text-[0.65rem] font-medium tracking-wider text-muted-foreground uppercase">
                {group.label}
              </p>
            )}
            <div className="mt-2 space-y-0.5">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname?.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-colors",
                      active
                        ? "bg-pink-tint font-medium text-pink-ink"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className="size-4" strokeWidth={1.5} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-1 border-t border-border pt-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="size-4" strokeWidth={1.5} />
          Ver sitio
        </a>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="size-4" strokeWidth={1.5} />
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );
}
