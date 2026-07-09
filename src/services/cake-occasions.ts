import { createAdminClient, createPublicClient } from "@/lib/supabase/server";
import type { CakeOccasion } from "@/types/content";

type Row = {
  id: string;
  name: string;
  order_index: number;
  published: boolean;
};

function toModel(row: Row): CakeOccasion {
  return {
    id: row.id,
    name: row.name,
    orderIndex: row.order_index,
    published: row.published,
  };
}

export async function getCakeOccasions(): Promise<CakeOccasion[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("cake_occasions")
    .select("*")
    .order("order_index");
  if (error) throw error;
  return (data as Row[]).map(toModel);
}

export async function getPublishedCakeOccasions(): Promise<CakeOccasion[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("cake_occasions")
      .select("*")
      .eq("published", true)
      .order("order_index");
    if (error || !data) return [];
    return (data as Row[]).map(toModel);
  } catch {
    return [];
  }
}

export type CakeOccasionInput = Omit<CakeOccasion, "id" | "orderIndex">;

export async function createCakeOccasion(input: CakeOccasionInput): Promise<CakeOccasion> {
  const supabase = createAdminClient();
  const { data: last } = await supabase
    .from("cake_occasions")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .single();
  const orderIndex = last ? (last as { order_index: number }).order_index + 1 : 1;
  const { data, error } = await supabase
    .from("cake_occasions")
    .insert({ name: input.name, published: input.published, order_index: orderIndex })
    .select()
    .single();
  if (error) throw error;
  return toModel(data as Row);
}

export async function updateCakeOccasion(id: string, input: CakeOccasionInput): Promise<CakeOccasion | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("cake_occasions")
    .update({ name: input.name, published: input.published })
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return toModel(data as Row);
}

export async function deleteCakeOccasion(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("cake_occasions").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleCakeOccasionPublished(id: string): Promise<CakeOccasion | null> {
  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("cake_occasions")
    .select("published")
    .eq("id", id)
    .single();
  if (!current) return null;
  const { data, error } = await supabase
    .from("cake_occasions")
    .update({ published: !(current as { published: boolean }).published })
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return toModel(data as Row);
}

export async function reorderCakeOccasions(orderedIds: string[]): Promise<void> {
  const supabase = createAdminClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("cake_occasions").update({ order_index: index + 1 }).eq("id", id),
    ),
  );
}
