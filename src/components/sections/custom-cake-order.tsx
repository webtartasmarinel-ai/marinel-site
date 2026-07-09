"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cake,
  CalendarDays,
  Palette,
  Ruler,
  Utensils,
} from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/layout/container";
import { SectionEyebrow } from "@/components/layout/section-eyebrow";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitCakeOrder } from "@/app/actions/cake-order";
import { cakeOrderSchema } from "@/lib/validations/cake-order";
import { buildCakeOrderWhatsAppUrl } from "@/lib/whatsapp-message";
import { formatCakeDimensions, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type {
  CakeFilling,
  CakeFlavour,
  CakeOccasion,
  CakeSize,
  CakeStyle,
} from "@/types/content";
import type { CakeOrderFormValues } from "@/lib/validations/cake-order";

interface FormState {
  occasion: string;
  style: string;
  flavour: string;
  filling: string;
  size: string;
  desiredDate: string;
  description: string;
  fullName: string;
  phone: string;
  email: string;
}

const DEFAULT_VALUES: FormState = {
  occasion: "",
  style: "",
  flavour: "",
  filling: "",
  size: "",
  desiredDate: "",
  description: "",
  fullName: "",
  phone: "",
  email: "",
};

function OptionCards<T extends string>({
  options,
  value,
  onChange,
  gridClassName,
  badges,
}: {
  options: readonly T[];
  value: T | "";
  onChange: (value: T | "") => void;
  gridClassName?: string;
  badges?: Partial<Record<T, string>>;
}) {
  return (
    <div className={cn("grid gap-3", gridClassName ?? "grid-cols-2 sm:grid-cols-3")}>
      {options.map((option) => {
        const selected = value === option;
        return (
          <motion.button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(selected ? "" : option)}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className={cn(
              "relative flex items-center justify-center rounded-2xl border px-4 py-3.5 text-center text-sm font-medium",
              selected
                ? "border-pink bg-pink/20 text-foreground"
                : "border-border bg-background text-foreground",
            )}
          >
            {badges?.[option] && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-pink-tint px-2 py-0.5 text-[0.6rem] font-medium tracking-wide whitespace-nowrap text-pink-ink uppercase">
                {badges[option]}
              </span>
            )}
            <AnimatePresence>
              {selected && (
                <motion.span
                  key="ring"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: "spring", stiffness: 500, damping: 28 }}
                  className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-pink"
                />
              )}
            </AnimatePresence>
            {option}
          </motion.button>
        );
      })}
    </div>
  );
}

function ProgressBar({ filled, total }: { filled: number; total: number }) {
  const pct = total > 0 ? (filled / total) * 100 : 0;
  return (
    <div className="mb-10">
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Tu configuración</span>
        <span className="font-medium text-pink-ink">
          {filled >= total ? "Finalizar" : `${filled}/${total} pasos`}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
        <motion.div
          className="h-full rounded-full bg-pink"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}

function FormStep({
  index,
  label,
  children,
}: {
  index?: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {index ? (
        <SectionEyebrow index={index} label={label} className="mb-4" />
      ) : (
        <p className="mb-4 text-xs font-medium tracking-[0.2em] text-brown uppercase">
          {label}
        </p>
      )}
      {children}
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-foreground">
      <Icon className="size-4 shrink-0 text-pink-ink" strokeWidth={1.5} />
      <span>{value}</span>
    </div>
  );
}

export function CustomCakeOrder({
  whatsappUrl,
  sizes,
  styles,
  occasions,
  flavours,
  fillings,
}: {
  whatsappUrl: string;
  sizes: CakeSize[];
  styles: CakeStyle[];
  occasions: CakeOccasion[];
  flavours: CakeFlavour[];
  fillings: CakeFilling[];
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submittedValues, setSubmittedValues] =
    useState<CakeOrderFormValues | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<FormState>({ defaultValues: DEFAULT_VALUES });

  const watched = watch();
  const selectedSize = sizes.find((size) => size.name === watched.size);
  const hasSummary = Boolean(
    watched.style ||
      watched.flavour ||
      watched.filling ||
      selectedSize ||
      watched.desiredDate,
  );

  async function onSubmit(values: FormState) {
    const matchedSize = sizes.find((size) => size.name === values.size);
    const payload = {
      ...values,
      sizeDimensions: matchedSize
        ? formatCakeDimensions(matchedSize.width, matchedSize.height)
        : "",
    };
    const parsed = cakeOrderSchema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Revisa los datos del formulario.");
      return;
    }
    const result = await submitCakeOrder(parsed.data);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    const href = buildCakeOrderWhatsAppUrl(whatsappUrl, parsed.data);
    setSubmittedValues(parsed.data);
    setSubmitted(true);
    reset();
    // Scroll back to section top so the layout shift isn't jarring
    requestAnimationFrame(() => {
      document.getElementById("tartas")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    // Open WhatsApp in a new tab so the user stays on the site
    window.open(href, "_blank", "noopener,noreferrer");
  }

  const whatsappHref = submittedValues
    ? buildCakeOrderWhatsAppUrl(whatsappUrl, submittedValues)
    : null;

  // (no auto-redirect useEffect — WhatsApp opens immediately in new tab on submit)

  return (
    <section id="tartas" className="bg-warm py-24 md:py-36">
      <Container>
        <Reveal>
          <SectionEyebrow index="04" label="Tartas a Medida" className="mb-6" />
          <SectionHeading
            title="Crea tu"
            accent="tarta perfecta."
            accentColor="pink"
            align="center"
            className="mx-auto max-w-2xl"
            description="Cada celebración es única. Elige tus preferencias y cuéntanos tu idea. Marinel preparará un presupuesto totalmente personalizado para ti."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-14 max-w-3xl rounded-3xl border border-border bg-background p-6 shadow-[0_30px_80px_-45px_rgba(139,107,92,0.3)] md:p-12">
            {submitted && whatsappHref ? (
              <div className="py-10 text-center">
                <p className="font-heading text-3xl text-foreground italic">
                  ¡Gracias, {submittedValues?.fullName.split(" ")[0]}!
                </p>
                <p className="mt-4 max-w-sm mx-auto text-sm leading-relaxed text-muted-foreground">
                  Tu solicitud ha sido enviada. Marinel revisará todos los detalles y te contactará por WhatsApp en breve con un presupuesto personalizado.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                <h3 className="form-title text-center font-heading text-2xl font-medium text-foreground italic md:text-3xl">
                  Diseña tu tarta
                </h3>
                <ProgressBar
                  filled={[watched.occasion, watched.style, watched.flavour, watched.filling, watched.size].filter(Boolean).length}
                  total={5}
                />
                <FormStep index="01" label="Ocasión">
                  <Controller
                    control={control}
                    name="occasion"
                    render={({ field }) => (
                      <OptionCards
                        options={occasions.map((occasion) => occasion.name)}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </FormStep>

                <FormStep index="02" label="Estilo de la Tarta">
                  <Controller
                    control={control}
                    name="style"
                    render={({ field }) => (
                      <OptionCards
                        options={styles.map((style) => style.name)}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </FormStep>

                <FormStep index="03" label="Bizcocho">
                  <Controller
                    control={control}
                    name="flavour"
                    render={({ field }) => (
                      <OptionCards
                        options={flavours.map((flavour) => flavour.name)}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </FormStep>

                <FormStep index="04" label="Relleno">
                  <Controller
                    control={control}
                    name="filling"
                    render={({ field }) => (
                      <OptionCards
                        options={fillings.map((filling) => filling.name)}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </FormStep>

                <FormStep index="05" label="Tamaño">
                  <Controller
                    control={control}
                    name="size"
                    render={({ field }) => (
                      <OptionCards
                        options={sizes.map((size) => size.name)}
                        value={field.value}
                        onChange={field.onChange}
                        gridClassName="grid-cols-3"
                      />
                    )}
                  />
                </FormStep>

                {/* Etapa final "Finalizar" — fuera del contador de 5 pasos */}
                <div className="space-y-8 rounded-2xl border border-border bg-warm/60 p-6 md:p-8">
                  <p className="flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-pink-ink uppercase">
                    Finalizar
                    <span aria-hidden className="h-px flex-1 bg-border" />
                  </p>

                  <FormStep label="Fecha deseada">
                    <Input
                      type="date"
                      className="h-11 max-w-xs"
                      {...register("desiredDate")}
                    />
                  </FormStep>

                  <FormStep label="Cuéntanos tu idea">
                    <Textarea
                      rows={5}
                      placeholder="Cuéntanos cómo imaginas tu tarta, los colores, el estilo, la temática o cualquier detalle importante."
                      {...register("description")}
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Ejemplos: temática · colores · número aproximado de
                      personas · decoración · cualquier detalle especial
                    </p>
                  </FormStep>

                  <FormStep label="Tus datos">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <Label htmlFor="cake-fullName">Nombre completo</Label>
                      <Input id="cake-fullName" {...register("fullName")} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="cake-phone">Teléfono</Label>
                      <Input
                        id="cake-phone"
                        type="tel"
                        {...register("phone")}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="cake-email">Email</Label>
                      <Input
                        id="cake-email"
                        type="email"
                        {...register("email")}
                      />
                    </div>
                  </div>
                  </FormStep>
                </div>

                {hasSummary && (
                  <div className="rounded-2xl border border-pink/30 bg-pink-tint/40 p-6">
                    <p className="text-xs font-medium tracking-[0.15em] text-brown uppercase">
                      Tu selección
                    </p>
                    <div className="mt-4 space-y-2.5">
                      {watched.style && (
                        <SummaryRow icon={Palette} value={watched.style} />
                      )}
                      {watched.flavour && (
                        <SummaryRow icon={Cake} value={watched.flavour} />
                      )}
                      {watched.filling && (
                        <SummaryRow icon={Utensils} value={watched.filling} />
                      )}
                      {selectedSize && (
                        <SummaryRow
                          icon={Ruler}
                          value={`${selectedSize.name} — ${formatCakeDimensions(selectedSize.width, selectedSize.height)}`}
                        />
                      )}
                      {watched.desiredDate && (
                        <SummaryRow
                          icon={CalendarDays}
                          value={formatDate(watched.desiredDate)}
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Consentimiento RGPD — checkbox nativo required: el
                    navegador bloquea el envío si no está marcado. */}
                <label className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
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

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary relative h-auto w-full overflow-hidden rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground transition-shadow duration-300 hover:bg-primary/85 hover:shadow-btn-gold sm:w-auto"
                >
                  {isSubmitting ? "Enviando..." : "Solicitar presupuesto"}
                  <span
                    aria-hidden
                    className="btn-shimmer pointer-events-none absolute inset-y-0 w-[60%] bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  />
                </Button>
              </form>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
