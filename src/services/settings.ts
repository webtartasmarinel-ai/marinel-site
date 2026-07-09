import { createAdminClient, createPublicClient } from "@/lib/supabase/server";
import type { ImagePosition, SiteSettings } from "@/types/content";

type Row = {
  id: number;
  hero_eyebrow: string;
  hero_title: string;
  hero_title_accent: string;
  hero_subtitle: string;
  hero_image_url: string | null;
  hero_image_position: ImagePosition | null;
  about_title: string;
  about_title_accent: string;
  about_body: string[];
  about_image_url: string | null;
  about_image_position: ImagePosition | null;
  instagram_url: string;
  tiktok_url: string;
  whatsapp_url: string;
  whatsapp_number: string;
  community_url: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  map_embed_url: string;
  seo_title: string;
  seo_description: string;
};

function toModel(row: Row): SiteSettings {
  return {
    heroEyebrow: row.hero_eyebrow,
    heroTitle: row.hero_title,
    heroTitleAccent: row.hero_title_accent,
    heroSubtitle: row.hero_subtitle,
    heroImageUrl: row.hero_image_url,
    heroImagePosition: row.hero_image_position,
    aboutTitle: row.about_title,
    aboutTitleAccent: row.about_title_accent,
    aboutBody: row.about_body ?? [],
    aboutImageUrl: row.about_image_url,
    aboutImagePosition: row.about_image_position,
    instagramUrl: row.instagram_url,
    tiktokUrl: row.tiktok_url,
    whatsappUrl: row.whatsapp_url,
    whatsappNumber: row.whatsapp_number,
    communityUrl: row.community_url,
    phone: row.phone,
    email: row.email,
    city: row.city,
    address: row.address,
    mapEmbedUrl: row.map_embed_url,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
  };
}

const DEFAULT_SETTINGS: SiteSettings = {
  heroEyebrow: "",
  heroTitle: "",
  heroTitleAccent: "",
  heroSubtitle: "",
  heroImageUrl: null,
  heroImagePosition: null,
  aboutTitle: "",
  aboutTitleAccent: "",
  aboutBody: [],
  aboutImageUrl: null,
  aboutImagePosition: null,
  instagramUrl: "",
  tiktokUrl: "",
  whatsappUrl: "",
  whatsappNumber: "",
  communityUrl: "",
  phone: "",
  email: "",
  city: "",
  address: "",
  mapEmbedUrl: "",
  seoTitle: "",
  seoDescription: "",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error || !data) return DEFAULT_SETTINGS;
  return toModel(data as Row);
}

export async function updateSiteSettings(input: Partial<SiteSettings>): Promise<SiteSettings> {
  const supabase = createAdminClient();
  const patch: Record<string, unknown> = {};
  if (input.heroEyebrow !== undefined) patch.hero_eyebrow = input.heroEyebrow;
  if (input.heroTitle !== undefined) patch.hero_title = input.heroTitle;
  if (input.heroTitleAccent !== undefined) patch.hero_title_accent = input.heroTitleAccent;
  if (input.heroSubtitle !== undefined) patch.hero_subtitle = input.heroSubtitle;
  if (input.heroImageUrl !== undefined) patch.hero_image_url = input.heroImageUrl;
  if (input.heroImagePosition !== undefined) patch.hero_image_position = input.heroImagePosition;
  if (input.aboutTitle !== undefined) patch.about_title = input.aboutTitle;
  if (input.aboutTitleAccent !== undefined) patch.about_title_accent = input.aboutTitleAccent;
  if (input.aboutBody !== undefined) patch.about_body = input.aboutBody;
  if (input.aboutImageUrl !== undefined) patch.about_image_url = input.aboutImageUrl;
  if (input.aboutImagePosition !== undefined) patch.about_image_position = input.aboutImagePosition;
  if (input.instagramUrl !== undefined) patch.instagram_url = input.instagramUrl;
  if (input.tiktokUrl !== undefined) patch.tiktok_url = input.tiktokUrl;
  if (input.whatsappUrl !== undefined) patch.whatsapp_url = input.whatsappUrl;
  if (input.whatsappNumber !== undefined) patch.whatsapp_number = input.whatsappNumber;
  if (input.communityUrl !== undefined) patch.community_url = input.communityUrl;
  if (input.phone !== undefined) patch.phone = input.phone;
  if (input.email !== undefined) patch.email = input.email;
  if (input.city !== undefined) patch.city = input.city;
  if (input.address !== undefined) patch.address = input.address;
  if (input.mapEmbedUrl !== undefined) patch.map_embed_url = input.mapEmbedUrl;
  if (input.seoTitle !== undefined) patch.seo_title = input.seoTitle;
  if (input.seoDescription !== undefined) patch.seo_description = input.seoDescription;
  patch.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("site_settings")
    .update(patch)
    .eq("id", 1)
    .select()
    .single();
  if (error) throw error;
  return toModel(data as Row);
}
