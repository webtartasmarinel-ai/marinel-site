import { ExternalLink, MapPin } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionEyebrow } from "@/components/layout/section-eyebrow";
import { LocationMap } from "@/components/sections/location-map";
import { Reveal } from "@/components/motion/reveal";
import type { SiteSettings } from "@/types/content";

export function Location({ settings }: { settings: SiteSettings }) {
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`;

  return (
    <section id="ubicacion" className="py-24 md:py-36">
      <Container>
        <div className="grid gap-14 md:grid-cols-[1.25fr_0.75fr] md:items-center md:gap-16">
          <Reveal>
            <SectionEyebrow index="08" label="Ubicación" className="mb-6" />
            <h2 className="text-balance font-heading text-4xl leading-[1.05] font-medium text-foreground md:text-7xl">
              Te esperamos en el{" "}
              <em className="text-brown italic">obrador.</em>
            </h2>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-muted-foreground md:text-2xl">
              {settings.address}
            </p>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 text-base font-medium text-pink-ink hover:underline"
            >
              Cómo llegar
              <ExternalLink className="size-4" strokeWidth={1.5} />
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative mx-auto w-full max-w-sm">
              {settings.mapEmbedUrl ? (
                <LocationMap mapEmbedUrl={settings.mapEmbedUrl} />
              ) : (
                <div className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-3xl border border-border bg-gradient-to-br from-pink-tint to-warm">
                  <MapPin
                    className="size-7 text-brown/40"
                    strokeWidth={1.25}
                    aria-hidden
                  />
                  <span className="text-[0.65rem] font-medium tracking-[0.15em] text-brown/50 uppercase">
                    Mapa disponible próximamente
                  </span>
                </div>
              )}
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-background/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-background"
              >
                Abrir en Maps
                <ExternalLink className="size-3" strokeWidth={1.5} />
              </a>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
