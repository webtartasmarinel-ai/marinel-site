"use server";

import { redirect } from "next/navigation";
import {
  createSession,
  destroySession,
  requireAdmin,
  updateAdminPassword,
  verifyPassword,
} from "@/lib/auth";
import { changePasswordSchema } from "@/lib/validations/admin-password";

export async function changePasswordAction(
  input: unknown,
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdmin();
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Revisa los datos del formulario.",
    };
  }
  const { currentPassword, newPassword } = parsed.data;
  if (!(await verifyPassword(currentPassword))) {
    return { success: false, error: "La contraseña actual no es correcta." };
  }
  await updateAdminPassword(newPassword);
  return { success: true };
}

export async function login(
  _prevState: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const password = formData.get("password");
  if (typeof password !== "string" || !(await verifyPassword(password))) {
    return { error: "Contraseña incorrecta." };
  }
  await createSession();
  redirect("/admin/dashboard");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
