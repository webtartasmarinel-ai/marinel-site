import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Container } from "@/components/layout/container";
import type { SiteSettings } from "@/types/content";

// Valor legal con marcador visible cuando aún no se ha rellenado en
// /admin/legal — así la titular ve exactamente qué falta por completar.
export function legalValue(value: string, label: string): string {
  return value.trim() !== "" ? value : `[${label} — pendiente de completar]`;
}

export function LegalPage({
  settings,
  title,
  updated,
  children,
}: {
  settings: SiteSettings;
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader whatsappUrl={settings.whatsappUrl} />
      <main className="pt-36 pb-24 md:pt-44 md:pb-32">
        <Container className="max-w-3xl">
          <h1 className="font-heading text-4xl leading-[1.1] font-medium text-foreground md:text-5xl">
            {title}
          </h1>
          <hr aria-hidden className="my-4 w-[60px] border-t border-[#c9a84c]" />
          {updated && (
            <p className="text-xs text-muted-foreground">
              Última actualización: {updated}
            </p>
          )}
          <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-foreground [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-pink-ink">
            {children}
          </div>
        </Container>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
