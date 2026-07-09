"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

// Mapa "clic para cargar" (RGPD): el iframe de Google Maps solo se inserta
// cuando la visitante lo activa — hasta entonces no hay ninguna conexión con
// Google ni cookies de terceros. Ver /cookies § 3.
export function LocationMap({ mapEmbedUrl }: { mapEmbedUrl: string }) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        src={mapEmbedUrl}
        title="Ubicación de Marinel Pastelería"
        className="aspect-square w-full rounded-3xl border border-border shadow-[0_20px_50px_-30px_rgba(139,107,92,0.3)]"
        loading="lazy"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-3xl border border-border bg-gradient-to-br from-pink-tint to-warm transition-colors hover:border-[#c9a84c]"
    >
      <MapPin className="size-7 text-brown/60" strokeWidth={1.25} aria-hidden />
      <span className="px-6 text-sm font-medium text-foreground">
        Ver el mapa
      </span>
      <span className="px-8 text-center text-[0.65rem] leading-relaxed text-muted-foreground">
        Al cargar el mapa se conecta con Google Maps, que puede usar cookies
        propias.
      </span>
    </button>
  );
}
