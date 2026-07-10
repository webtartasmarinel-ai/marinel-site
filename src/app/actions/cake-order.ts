"use server";

import { cakeOrderSchema } from "@/lib/validations/cake-order";
import { createCakeOrder } from "@/services/cake-orders";
import { verifyTurnstile } from "@/lib/turnstile";

export async function submitCakeOrder(
  input: unknown,
  token: string | null = null,
): Promise<{ success: true } | { success: false; error: string }> {
  if (!(await verifyTurnstile(token))) {
    return {
      success: false,
      error: "No pudimos verificar que no eres un robot. Vuelve a intentarlo.",
    };
  }
  const parsed = cakeOrderSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Revisa los datos del formulario.",
    };
  }
  await createCakeOrder(parsed.data);
  return { success: true };
}
