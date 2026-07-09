"use server";

import { createAdminClient } from "@/lib/supabase/server";
import path from "path";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const BUCKET = "uploads";

export async function uploadImage(
  formData: FormData,
  folder: string,
): Promise<{ url: string } | { error: string }> {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "Archivo inválido." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "El archivo debe ser una imagen." };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { error: "La imagen no puede superar 5MB." };
  }

  const safeFolder = folder.replace(/[^a-z0-9-]/gi, "");
  const ext = path.extname(file.name).toLowerCase() || ".jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const storagePath = `${safeFolder}/${filename}`;

  const supabase = createAdminClient();
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, bytes, { contentType: file.type, upsert: false });

  if (error) {
    return { error: "Error al subir la imagen. Inténtalo de nuevo." };
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return { url: data.publicUrl };
}
