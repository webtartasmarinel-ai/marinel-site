import { createAdminClient, createPublicClient } from "@/lib/supabase/server";
import type { GalleryCategory, GalleryImage, ImagePosition } from "@/types/content";

type Row = {
  id: string;
  image_url: string | null;
  image_position: ImagePosition | null;
  caption: string | null;
  categories: GalleryCategory[];
  featured: boolean;
  order_index: number;
  published: boolean;
};

function toModel(row: Row): GalleryImage {
  return {
    id: row.id,
    imageUrl: row.image_url,
    imagePosition: row.image_position,
    caption: row.caption,
    categories: row.categories ?? [],
    featured: row.featured,
    orderIndex: row.order_index,
    published: row.published,
  };
}

function toRow(input: GalleryImageInput, extra?: { order_index?: number }) {
  return {
    image_url: input.imageUrl,
    image_position: input.imagePosition,
    caption: input.caption,
    categories: input.categories,
    featured: input.featured,
    published: input.published,
    ...(extra?.order_index !== undefined ? { order_index: extra.order_index } : {}),
  };
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("order_index");
  if (error) throw error;
  return (data as Row[]).map(toModel);
}

export async function getPublishedGalleryImages(): Promise<GalleryImage[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("published", true)
    .order("order_index");
  if (error) throw error;
  return (data as Row[]).map(toModel);
}

export type GalleryImageInput = Omit<GalleryImage, "id" | "orderIndex">;

export async function createGalleryImage(input: GalleryImageInput): Promise<GalleryImage> {
  const supabase = createAdminClient();
  const { data: last } = await supabase
    .from("gallery_images")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .single();
  const orderIndex = last ? (last as { order_index: number }).order_index + 1 : 1;
  const { data, error } = await supabase
    .from("gallery_images")
    .insert(toRow(input, { order_index: orderIndex }))
    .select()
    .single();
  if (error) throw error;
  return toModel(data as Row);
}

export async function updateGalleryImage(id: string, input: GalleryImageInput): Promise<GalleryImage | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("gallery_images")
    .update(toRow(input))
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return toModel(data as Row);
}

export async function deleteGalleryImage(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleGalleryImagePublished(id: string): Promise<GalleryImage | null> {
  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("gallery_images")
    .select("published")
    .eq("id", id)
    .single();
  if (!current) return null;
  const { data, error } = await supabase
    .from("gallery_images")
    .update({ published: !(current as { published: boolean }).published })
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return toModel(data as Row);
}

export async function reorderGalleryImages(orderedIds: string[]): Promise<void> {
  const supabase = createAdminClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("gallery_images")
        .update({ order_index: index + 1 })
        .eq("id", id),
    ),
  );
}
