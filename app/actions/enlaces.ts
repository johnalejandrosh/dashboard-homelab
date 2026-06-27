"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { EnlaceFormState } from "@/lib/enlace-form";

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

type EnlaceData = {
  nombre: string;
  url: string;
  descripcion: string | null;
  favorito: boolean;
};

type ValidationResult =
  | { ok: true; data: EnlaceData }
  | { ok: false; error: string };

function validateEnlaceForm(formData: FormData): ValidationResult {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const urlInput = String(formData.get("url") ?? "").trim();
  const descripcionRaw = String(formData.get("descripcion") ?? "").trim();
  const descripcion = descripcionRaw.length > 0 ? descripcionRaw : null;
  const favorito = formData.get("favorito") === "on";

  if (!nombre) {
    return { ok: false, error: "El nombre es obligatorio." };
  }

  if (nombre.length > 100) {
    return { ok: false, error: "El nombre no puede superar los 100 caracteres." };
  }

  const url = normalizeUrl(urlInput);

  if (!url) {
    return { ok: false, error: "Ingresa una URL válida (http o https)." };
  }

  if (descripcion && descripcion.length > 500) {
    return {
      ok: false,
      error: "La descripción no puede superar los 500 caracteres.",
    };
  }

  return { ok: true, data: { nombre, url, descripcion, favorito } };
}

function parseId(value: FormDataEntryValue | null): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function createEnlace(
  _prevState: EnlaceFormState,
  formData: FormData,
): Promise<EnlaceFormState> {
  const result = validateEnlaceForm(formData);

  if (!result.ok) {
    return { error: result.error, success: false };
  }

  try {
    await prisma.enlace.create({ data: result.data });

    revalidatePath("/");

    return { error: null, success: true };
  } catch {
    return {
      error: "No se pudo guardar el enlace. Verifica la conexión a la base de datos.",
      success: false,
    };
  }
}

export async function updateEnlace(
  _prevState: EnlaceFormState,
  formData: FormData,
): Promise<EnlaceFormState> {
  const id = parseId(formData.get("id"));

  if (id === null) {
    return { error: "Enlace no válido.", success: false };
  }

  const result = validateEnlaceForm(formData);

  if (!result.ok) {
    return { error: result.error, success: false };
  }

  try {
    const existing = await prisma.enlace.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return { error: "El enlace no existe.", success: false };
    }

    await prisma.enlace.update({
      where: { id },
      data: result.data,
    });

    revalidatePath("/");

    return { error: null, success: true };
  } catch {
    return {
      error: "No se pudo actualizar el enlace. Verifica la conexión a la base de datos.",
      success: false,
    };
  }
}

export async function deleteEnlace(
  id: number,
): Promise<{ success: true } | { error: string }> {
  if (!Number.isInteger(id) || id <= 0) {
    return { error: "Enlace no válido." };
  }

  try {
    const existing = await prisma.enlace.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return { error: "El enlace no existe." };
    }

    await prisma.enlace.delete({ where: { id } });

    revalidatePath("/");

    return { success: true };
  } catch {
    return { error: "No se pudo eliminar el enlace." };
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
