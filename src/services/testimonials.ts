import { createAdminClient, createPublicClient } from "@/lib/supabase/server";
import type { ImagePosition, Testimonial } from "@/types/content";

type Row = {
  id: string;
  author_name: string;
  author_role: string | null;
  content: string;
  avatar_url: string | null;
  image_position: ImagePosition | null;
  order_index: number;
  published: boolean;
};

function toModel(row: Row): Testimonial {
  return {
    id: row.id,
    authorName: row.author_name,
    authorRole: row.author_role,
    content: row.content,
    avatarUrl: row.avatar_url,
    imagePosition: row.image_position,
    orderIndex: row.order_index,
    published: row.published,
  };
}

function toRow(input: TestimonialInput, extra?: { order_index?: number }) {
  return {
    author_name: input.authorName,
    author_role: input.authorRole,
    content: input.content,
    avatar_url: input.avatarUrl,
    image_position: input.imagePosition,
    published: input.published,
    ...(extra?.order_index !== undefined ? { order_index: extra.order_index } : {}),
  };
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("order_index");
  if (error) throw error;
  return (data as Row[]).map(toModel);
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .order("order_index");
  if (error) throw error;
  return (data as Row[]).map(toModel);
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return toModel(data as Row);
}

export type TestimonialInput = Omit<Testimonial, "id" | "orderIndex">;

export async function createTestimonial(input: TestimonialInput): Promise<Testimonial> {
  const supabase = createAdminClient();
  const { data: last } = await supabase
    .from("testimonials")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .single();
  const orderIndex = last ? (last as { order_index: number }).order_index + 1 : 1;
  const { data, error } = await supabase
    .from("testimonials")
    .insert(toRow(input, { order_index: orderIndex }))
    .select()
    .single();
  if (error) throw error;
  return toModel(data as Row);
}

export async function updateTestimonial(id: string, input: TestimonialInput): Promise<Testimonial | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("testimonials")
    .update(toRow(input))
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return toModel(data as Row);
}

export async function deleteTestimonial(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleTestimonialPublished(id: string): Promise<Testimonial | null> {
  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("testimonials")
    .select("published")
    .eq("id", id)
    .single();
  if (!current) return null;
  const { data, error } = await supabase
    .from("testimonials")
    .update({ published: !(current as { published: boolean }).published })
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return toModel(data as Row);
}
