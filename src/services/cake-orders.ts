import { createAdminClient } from "@/lib/supabase/server";
import type { CakeOrder, CakeOrderStatus } from "@/types/content";

type Row = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  occasion: string;
  style: string;
  flavour: string;
  filling: string;
  size: string;
  size_dimensions: string;
  desired_date: string;
  description: string;
  status: CakeOrderStatus;
  created_at: string;
};

function toModel(row: Row): CakeOrder {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    occasion: row.occasion,
    style: row.style,
    flavour: row.flavour as CakeOrder["flavour"],
    filling: row.filling as CakeOrder["filling"],
    size: row.size,
    sizeDimensions: row.size_dimensions,
    desiredDate: row.desired_date,
    description: row.description,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function getCakeOrders(): Promise<CakeOrder[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("cake_orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Row[]).map(toModel);
}

export type CakeOrderInput = Omit<CakeOrder, "id" | "status" | "createdAt">;

export async function createCakeOrder(input: CakeOrderInput): Promise<CakeOrder> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("cake_orders")
    .insert({
      full_name: input.fullName,
      phone: input.phone,
      email: input.email,
      occasion: input.occasion,
      style: input.style,
      flavour: input.flavour,
      filling: input.filling,
      size: input.size,
      size_dimensions: input.sizeDimensions,
      desired_date: input.desiredDate,
      description: input.description,
    })
    .select()
    .single();
  if (error) throw error;
  return toModel(data as Row);
}

export async function updateCakeOrderStatus(id: string, status: CakeOrderStatus): Promise<CakeOrder | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("cake_orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return toModel(data as Row);
}

export async function deleteCakeOrder(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("cake_orders").delete().eq("id", id);
  if (error) throw error;
}
