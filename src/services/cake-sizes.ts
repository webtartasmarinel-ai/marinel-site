import { createAdminClient, createPublicClient } from "@/lib/supabase/server";
import type { CakeSize } from "@/types/content";

type Row = {
  id: string;
  name: string;
  width: number;
  height: number;
  order_index: number;
  published: boolean;
};

function toModel(row: Row): CakeSize {
  return {
    id: row.id,
    name: row.name,
    width: row.width,
    height: row.height,
    orderIndex: row.order_index,
    published: row.published,
  };
}

export async function getCakeSizes(): Promise<CakeSize[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("cake_sizes")
    .select("*")
    .order("order_index");
  if (error) throw error;
  return (data as Row[]).map(toModel);
}

export async function getPublishedCakeSizes(): Promise<CakeSize[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("cake_sizes")
      .select("*")
      .eq("published", true)
      .order("order_index");
    if (error || !data) return [];
    return (data as Row[]).map(toModel);
  } catch {
    return [];
  }
}

export type CakeSizeInput = Omit<CakeSize, "id" | "orderIndex">;

export async function createCakeSize(input: CakeSizeInput): Promise<CakeSize> {
  const supabase = createAdminClient();
  const { data: last } = await supabase
    .from("cake_sizes")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .single();
  const orderIndex = last ? (last as { order_index: number }).order_index + 1 : 1;
  const { data, error } = await supabase
    .from("cake_sizes")
    .insert({ name: input.name, width: input.width, height: input.height, published: input.published, order_index: orderIndex })
    .select()
    .single();
  if (error) throw error;
  return toModel(data as Row);
}

export async function updateCakeSize(id: string, input: CakeSizeInput): Promise<CakeSize | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("cake_sizes")
    .update({ name: input.name, width: input.width, height: input.height, published: input.published })
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return toModel(data as Row);
}

export async function deleteCakeSize(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("cake_sizes").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleCakeSizePublished(id: string): Promise<CakeSize | null> {
  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("cake_sizes")
    .select("published")
    .eq("id", id)
    .single();
  if (!current) return null;
  const { data, error } = await supabase
    .from("cake_sizes")
    .update({ published: !(current as { published: boolean }).published })
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return toModel(data as Row);
}

export async function reorderCakeSizes(orderedIds: string[]): Promise<void> {
  const supabase = createAdminClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("cake_sizes").update({ order_index: index + 1 }).eq("id", id),
    ),
  );
}
