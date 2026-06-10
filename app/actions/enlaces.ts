"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { CreateEnlaceState } from "@/lib/enlace-form";

function normalizeUrl(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

export async function createEnlace(
  _prevState: CreateEnlaceState,
  formData: FormData,
): Promise<CreateEnlaceState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const urlInput = String(formData.get("url") ?? "").trim();
  const descripcionRaw = String(formData.get("descripcion") ?? "").trim();
  const descripcion = descripcionRaw.length > 0 ? descripcionRaw : null;
  const favorito = formData.get("favorito") === "on";

  if (!nombre) {
    return { error: "El nombre es obligatorio.", success: false };
  }

  if (nombre.length > 100) {
    return { error: "El nombre no puede superar los 100 caracteres.", success: false };
  }

  const url = normalizeUrl(urlInput);

  if (!url) {
    return { error: "Ingresa una URL válida (http o https).", success: false };
  }

  if (descripcion && descripcion.length > 500) {
    return {
      error: "La descripción no puede superar los 500 caracteres.",
      success: false,
    };
  }

  try {
    await prisma.enlace.create({
      data: {
        nombre,
        url,
        descripcion,
        favorito,
      },
    });

    revalidatePath("/");

    return { error: null, success: true };
  } catch {
    return {
      error: "No se pudo guardar el enlace. Verifica la conexión a la base de datos.",
      success: false,
    };
  }
}

export async function toggleFavorito(
  id: number,
): Promise<{ favorito: boolean } | { error: string }> {
  if (!Number.isInteger(id) || id <= 0) {
    return { error: "Enlace no válido." };
  }

  try {
    const enlace = await prisma.enlace.findUnique({
      where: { id },
      select: { favorito: true },
    });

    if (!enlace) {
      return { error: "El enlace no existe." };
    }

    const updated = await prisma.enlace.update({
      where: { id },
      data: { favorito: !enlace.favorito },
      select: { favorito: true },
    });

    revalidatePath("/");

    return { favorito: updated.favorito };
  } catch {
    return { error: "No se pudo actualizar el favorito." };
  }
}
