import { createAdminClient, createPublicClient } from "@/lib/supabase/server";
import type { Course, ImagePosition } from "@/types/content";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

type Row = {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  format: string;
  image_url: string | null;
  image_position: ImagePosition | null;
  start_date: string | null;
  available_places: number | null;
  duration: string | null;
  badge: string | null;
  price: string | null;
  featured: boolean;
  order_index: number;
  published: boolean;
};

function toModel(row: Row): Course {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    level: row.level as Course["level"],
    format: row.format as Course["format"],
    imageUrl: row.image_url,
    imagePosition: row.image_position,
    startDate: row.start_date,
    availablePlaces: row.available_places,
    duration: row.duration,
    badge: row.badge,
    price: row.price,
    featured: row.featured,
    orderIndex: row.order_index,
    published: row.published,
  };
}

function toRow(input: CourseInput, extra?: { slug?: string; order_index?: number }) {
  return {
    title: input.title,
    slug: extra?.slug ?? slugify(input.title),
    description: input.description,
    level: input.level,
    format: input.format,
    image_url: input.imageUrl,
    image_position: input.imagePosition,
    start_date: input.startDate,
    available_places: input.availablePlaces,
    duration: input.duration,
    badge: input.badge,
    price: input.price,
    featured: input.featured,
    published: input.published,
    ...(extra?.order_index !== undefined ? { order_index: extra.order_index } : {}),
  };
}

export async function getCourses(): Promise<Course[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("order_index");
  if (error) throw error;
  return (data as Row[]).map(toModel);
}

export async function getPublishedCourses(): Promise<Course[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("published", true)
    .order("order_index");
  if (error) throw error;
  return (data as Row[]).map(toModel);
}

export async function getCourseById(id: string): Promise<Course | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return toModel(data as Row);
}

export type CourseInput = Omit<Course, "id" | "slug" | "orderIndex"> & {
  slug?: string;
};

export async function createCourse(input: CourseInput): Promise<Course> {
  const supabase = createAdminClient();
  const { data: last } = await supabase
    .from("courses")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .single();
  const orderIndex = last ? (last as { order_index: number }).order_index + 1 : 1;
  const { data, error } = await supabase
    .from("courses")
    .insert(toRow(input, { slug: input.slug, order_index: orderIndex }))
    .select()
    .single();
  if (error) throw error;
  return toModel(data as Row);
}

export async function updateCourse(id: string, input: CourseInput): Promise<Course | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("courses")
    .update({ ...toRow(input, { slug: input.slug }), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return toModel(data as Row);
}

export async function deleteCourse(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleCoursePublished(id: string): Promise<Course | null> {
  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("courses")
    .select("published")
    .eq("id", id)
    .single();
  if (!current) return null;
  const { data, error } = await supabase
    .from("courses")
    .update({ published: !(current as { published: boolean }).published, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return toModel(data as Row);
}
