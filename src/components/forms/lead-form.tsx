"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { submitLead } from "@/app/actions/lead";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { buildLeadWhatsAppUrl } from "@/lib/whatsapp-message";
import {
  EXPERIENCE_LEVELS,
  leadSchema,
  type LeadFormValues,
} from "@/lib/validations/lead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Course, Masterclass } from "@/types/content";

export function LeadForm({
  courses,
  masterclasses,
  defaultCourse,
  whatsappUrl,
}: {
  courses: Course[];
  masterclasses: Masterclass[];
  defaultCourse?: string;
  whatsappUrl: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [whatsappHref, setWhatsappHref] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      city: "",
      courseInterest: defaultCourse ?? "",
      experienceLevel: "",
      goal: "",
      message: "",
    },
  });

  async function onSubmit(values: LeadFormValues) {
    const result = await submitLead(values, token);
    if (result.success) {
      toast.success(
        "¡Gracias! Marinel revisará tu solicitud y te contactará muy pronto.",
      );
      // Abre WhatsApp en una pestaña nueva con un mensaje ya redactado —
      // misma pauta que el formulario de tartas.
      const href = buildLeadWhatsAppUrl(whatsappUrl, values);
      setWhatsappHref(href);
      window.open(href, "_blank", "noopener,noreferrer");
      reset();
      setSubmitted(true);
    } else {
      toast.error(result.error);
      // El token de Turnstile es de un solo uso: refresca el widget.
      setToken(null);
      setCaptchaKey((k) => k + 1);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-border bg-warm p-10 text-center">
        <p className="font-heading text-2xl text-foreground italic">
          ¡Solicitud enviada!
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Hemos abierto WhatsApp con un mensaje listo para Marinel — envíalo
          para reservar tu plaza más rápido. Si no se abrió, usa el botón de
          abajo.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-auto items-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
            >
              Abrir WhatsApp
            </a>
          )}
          <Button
            variant="outline"
            className="h-auto rounded-full px-6 py-2.5"
            onClick={() => setSubmitted(false)}
          >
            Enviar otra solicitud
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="fullName">Nombre completo</Label>
        <Input id="fullName" {...register("fullName")} />
        {errors.fullName && (
          <p className="text-xs text-destructive">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">Teléfono / WhatsApp</Label>
        <Input id="phone" type="tel" {...register("phone")} />
        {errors.phone && (
          <p className="text-xs text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="city">Ciudad</Label>
        <Input id="city" {...register("city")} />
        {errors.city && (
          <p className="text-xs text-destructive">{errors.city.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="courseInterest">Curso de interés</Label>
        <Controller
          control={control}
          name="courseInterest"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="courseInterest" className="w-full">
                <SelectValue placeholder="Selecciona un curso" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Cursos</SelectLabel>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.title}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
                {masterclasses.length > 0 && (
                  <SelectGroup>
                    <SelectLabel>Masterclasses</SelectLabel>
                    {masterclasses.map((masterclass) => (
                      <SelectItem
                        key={masterclass.id}
                        value={masterclass.title}
                      >
                        {masterclass.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
                <SelectItem value="Aún no lo sé">Aún no lo sé</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.courseInterest && (
          <p className="text-xs text-destructive">
            {errors.courseInterest.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="experienceLevel">Nivel de experiencia</Label>
        <Controller
          control={control}
          name="experienceLevel"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="experienceLevel" className="w-full">
                <SelectValue placeholder="Selecciona tu nivel" />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.experienceLevel && (
          <p className="text-xs text-destructive">
            {errors.experienceLevel.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <Label htmlFor="goal">¿Qué te gustaría conseguir con el curso?</Label>
        <Input id="goal" {...register("goal")} />
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <Label htmlFor="message">Mensaje (opcional)</Label>
        <Textarea id="message" rows={4} {...register("message")} />
      </div>

      {/* Consentimiento RGPD — checkbox nativo required: el navegador
          bloquea el envío si no está marcado. */}
      <label className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground sm:col-span-2">
        <input
          type="checkbox"
          required
          className="mt-0.5 size-4 shrink-0 accent-[#b5677b]"
        />
        <span>
          He leído y acepto la{" "}
          <a
            href="/privacidad"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-pink-ink"
          >
            política de privacidad
          </a>
          .
        </span>
      </label>

      <div className="sm:col-span-2">
        <TurnstileWidget key={captchaKey} onToken={setToken} />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="btn-sweep h-auto w-fit rounded-full bg-primary px-7 py-3.5 text-base text-primary-foreground hover:bg-primary/85 sm:col-span-2"
      >
        {isSubmitting ? "Enviando..." : "Solicitar información"}
      </Button>
    </form>
  );
}
