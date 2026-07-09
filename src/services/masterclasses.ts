import { createAdminClient, createPublicClient } from "@/lib/supabase/server";
import type { ImagePosition, Masterclass } from "@/types/content";

type Row = {
  id: string;
  title: string;
  description: string;
  date: string | null;
  location: string | null;
  image_url: string | null;
  image_position: ImagePosition | null;
  capacity: number | null;
  order_index: number;
  published: boolean;
};

function toModel(row: Row): Masterclass {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date,
    location: row.location,
    imageUrl: row.image_url,
    imagePosition: row.image_position,
    capacity: row.capacity,
    orderIndex: row.order_index,
    published: row.published,
  };
}

function toRow(input: MasterclassInput, extra?: { order_index?: number }) {
  return {
    title: input.title,
    description: input.description,
    date: input.date,
    location: input.location,
    image_url: input.imageUrl,
    image_position: input.imagePosition,
    capacity: input.capacity,
    published: input.published,
    ...(extra?.order_index !== undefined ? { order_index: extra.order_index } : {}),
  };
}

export async function getMasterclasses(): Promise<Masterclass[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("masterclasses")
    .select("*")
    .order("order_index");
  if (error) throw error;
  return (data as Row[]).map(toModel);
}

export async function getPublishedMasterclasses(): Promise<Masterclass[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("masterclasses")
      .select("*")
      .eq("published", true)
      .order("order_index");
    if (error || !data) return [];
    return (data as Row[]).map(toModel);
  } catch {
    return [];
  }
}

export async function getMasterclassById(id: string): Promise<Masterclass | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("masterclasses")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return toModel(data as Row);
}

export type MasterclassInput = Omit<Masterclass, "id" | "orderIndex">;

export async function createMasterclass(input: MasterclassInput): Promise<Masterclass> {
  const supabase = createAdminClient();
  const { data: last } = await supabase
    .from("masterclasses")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .single();
  const orderIndex = last ? (last as { order_index: number }).order_index + 1 : 1;
  const { data, error } = await supabase
    .from("masterclasses")
    .insert(toRow(input, { order_index: orderIndex }))
    .select()
    .single();
  if (error) throw error;
  return toModel(data as Row);
}

export async function updateMasterclass(id: string, input: MasterclassInput): Promise<Masterclass | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("masterclasses")
    .update({ ...toRow(input), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return toModel(data as Row);
}

export async function deleteMasterclass(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("masterclasses").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleMasterclassPublished(id: string): Promise<Masterclass | null> {
  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("masterclasses")
    .select("published")
    .eq("id", id)
    .single();
  if (!current) return null;
  const { data, error } = await supabase
    .from("masterclasses")
    .update({ published: !(current as { published: boolean }).published, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return toModel(data as Row);
}
