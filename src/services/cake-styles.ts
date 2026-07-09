import { createAdminClient, createPublicClient } from "@/lib/supabase/server";
import type { CakeStyle } from "@/types/content";

type Row = {
  id: string;
  name: string;
  order_index: number;
  published: boolean;
};

function toModel(row: Row): CakeStyle {
  return {
    id: row.id,
    name: row.name,
    orderIndex: row.order_index,
    published: row.published,
  };
}

export async function getCakeStyles(): Promise<CakeStyle[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("cake_styles")
    .select("*")
    .order("order_index");
  if (error) throw error;
  return (data as Row[]).map(toModel);
}

export async function getPublishedCakeStyles(): Promise<CakeStyle[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("cake_styles")
      .select("*")
      .eq("published", true)
      .order("order_index");
    if (error || !data) return [];
    return (data as Row[]).map(toModel);
  } catch {
    return [];
  }
}

export type CakeStyleInput = Omit<CakeStyle, "id" | "orderIndex">;

export async function createCakeStyle(input: CakeStyleInput): Promise<CakeStyle> {
  const supabase = createAdminClient();
  const { data: last } = await supabase
    .from("cake_styles")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .single();
  const orderIndex = last ? (last as { order_index: number }).order_index + 1 : 1;
  const { data, error } = await supabase
    .from("cake_styles")
    .insert({ name: input.name, published: input.published, order_index: orderIndex })
    .select()
    .single();
  if (error) throw error;
  return toModel(data as Row);
}

export async function updateCakeStyle(id: string, input: CakeStyleInput): Promise<CakeStyle | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("cake_styles")
    .update({ name: input.name, published: input.published })
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return toModel(data as Row);
}

export async function deleteCakeStyle(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("cake_styles").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleCakeStylePublished(id: string): Promise<CakeStyle | null> {
  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("cake_styles")
    .select("published")
    .eq("id", id)
    .single();
  if (!current) return null;
  const { data, error } = await supabase
    .from("cake_styles")
    .update({ published: !(current as { published: boolean }).published })
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return toModel(data as Row);
}

export async function reorderCakeStyles(orderedIds: string[]): Promise<void> {
  const supabase = createAdminClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("cake_styles").update({ order_index: index + 1 }).eq("id", id),
    ),
  );
}
