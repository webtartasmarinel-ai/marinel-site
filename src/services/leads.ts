import { createAdminClient } from "@/lib/supabase/server";
import type { Lead, LeadStatus } from "@/types/content";

type Row = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  city: string;
  course_interest: string;
  experience_level: string;
  goal: string | null;
  message: string | null;
  status: LeadStatus;
  created_at: string;
};

function toModel(row: Row): Lead {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    city: row.city,
    courseInterest: row.course_interest,
    experienceLevel: row.experience_level,
    goal: row.goal,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function getLeads(): Promise<Lead[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Row[]).map(toModel);
}

export type LeadInput = Omit<Lead, "id" | "status" | "createdAt">;

export async function createLead(input: LeadInput): Promise<Lead> {
  // Public form submission — uses admin client since service_role key is server-only
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("leads")
    .insert({
      full_name: input.fullName,
      phone: input.phone,
      email: input.email,
      city: input.city,
      course_interest: input.courseInterest,
      experience_level: input.experienceLevel,
      goal: input.goal,
      message: input.message,
    })
    .select()
    .single();
  if (error) throw error;
  return toModel(data as Row);
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return toModel(data as Row);
}

export async function deleteLead(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
}
