"use server";

import { leadSchema } from "@/lib/validations/lead";
import { createLead } from "@/services/leads";
import { verifyTurnstile } from "@/lib/turnstile";

export async function submitLead(
  input: unknown,
  token: string | null = null,
): Promise<{ success: true } | { success: false; error: string }> {
  if (!(await verifyTurnstile(token))) {
    return {
      success: false,
      error: "No pudimos verificar que no eres un robot. Vuelve a intentarlo.",
    };
  }
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Revisa los datos del formulario." };
  }
  await createLead({
    ...parsed.data,
    goal: parsed.data.goal || null,
    message: parsed.data.message || null,
  });
  return { success: true };
}
