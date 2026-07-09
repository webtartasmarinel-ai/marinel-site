import { z } from "zod";
import { imagePositionSchema } from "@/lib/validations/image-position";

export const siteSettingsSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroTitleAccent: z.string(),
  heroSubtitle: z.string(),
  heroImageUrl: z.string().nullable(),
  heroImagePosition: imagePositionSchema.nullable(),
  aboutTitle: z.string(),
  aboutTitleAccent: z.string(),
  aboutBody: z.array(z.string()),
  aboutImageUrl: z.string().nullable(),
  aboutImagePosition: imagePositionSchema.nullable(),
  instagramUrl: z.string(),
  tiktokUrl: z.string(),
  whatsappUrl: z.string(),
  whatsappNumber: z.string(),
  communityUrl: z.string(),
  phone: z.string(),
  email: z.string(),
  city: z.string(),
  address: z.string(),
  mapEmbedUrl: z.string(),
  seoTitle: z.string(),
  seoDescription: z.string(),
  legalHolderName: z.string(),
  legalNif: z.string(),
  legalAddress: z.string(),
  legalCity: z.string(),
  legalEmail: z.string(),
  legalPhone: z.string(),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;
