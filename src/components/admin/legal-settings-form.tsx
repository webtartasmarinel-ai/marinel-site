"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSiteSettingsAction } from "@/app/admin/actions/settings";
import type { SiteSettings } from "@/types/content";

const FIELDS = [
  {
    key: "legalHolderName",
    label: "Nombre completo o razón social",
    placeholder: "María Pérez García",
    hint: "La titular del negocio tal y como aparece en Hacienda.",
  },
  {
    key: "legalNif",
    label: "NIF / CIF",
    placeholder: "12345678A",
    hint: "Identificación fiscal de la titular o de la empresa.",
  },
  {
    key: "legalAddress",
    label: "Dirección fiscal (calle y número)",
    placeholder: "Calle Mayor, 12",
    hint: "Domicilio fiscal, puede ser distinto del obrador.",
  },
  {
    key: "legalCity",
    label: "Código postal, ciudad y provincia",
    placeholder: "46001 Valencia (Valencia)",
    hint: "",
  },
  {
    key: "legalEmail",
    label: "Email de contacto legal",
    placeholder: "hola@marinelpasteleria.com",
    hint: "Donde se atenderán las solicitudes de privacidad (acceso, supresión...).",
  },
  {
    key: "legalPhone",
    label: "Teléfono (opcional)",
    placeholder: "+34 600 000 000",
    hint: "",
  },
] as const;

type LegalKey = (typeof FIELDS)[number]["key"];

export function LegalSettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<LegalKey, string>>({
    legalHolderName: settings.legalHolderName,
    legalNif: settings.legalNif,
    legalAddress: settings.legalAddress,
    legalCity: settings.legalCity,
    legalEmail: settings.legalEmail,
    legalPhone: settings.legalPhone,
  });
  const [isSaving, startSaving] = useTransition();

  function save() {
    startSaving(async () => {
      const result = await updateSiteSettingsAction(values);
      if (result.success) {
        toast.success("Datos legales guardados.");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="max-w-xl space-y-6 rounded-3xl border border-border bg-background p-6 md:p-8">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Estos datos aparecen automáticamente en el{" "}
        <span className="font-medium text-foreground">Aviso legal</span> y la{" "}
        <span className="font-medium text-foreground">
          Política de privacidad
        </span>{" "}
        del sitio. Son obligatorios por la ley española (LSSI-CE y RGPD) para
        cualquier web que recoja datos de contacto.
      </p>

      {FIELDS.map((field) => (
        <div key={field.key} className="flex flex-col gap-1.5">
          <Label htmlFor={`legal-${field.key}`}>{field.label}</Label>
          <Input
            id={`legal-${field.key}`}
            value={values[field.key]}
            placeholder={field.placeholder}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                [field.key]: event.target.value,
              }))
            }
          />
          {field.hint && (
            <p className="text-xs text-muted-foreground">{field.hint}</p>
          )}
        </div>
      ))}

      <Button
        onClick={save}
        disabled={isSaving}
        className="h-auto rounded-full bg-foreground px-6 py-2.5 text-primary-foreground hover:bg-foreground/85"
      >
        {isSaving ? "Guardando..." : "Guardar datos legales"}
      </Button>
    </div>
  );
}
