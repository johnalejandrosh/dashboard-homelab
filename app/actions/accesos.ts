"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { AccesoFormState } from "@/lib/acceso-form";

type AccesoData = {
  proyecto: string;
  servicio: string | null;
  entorno: string | null;
  descripcion: string | null;
  contenido: string;
};

type ValidationResult =
  | { ok: true; data: AccesoData }
  | { ok: false; error: string };

function optionalField(formData: FormData, key: string): string | null {
  const value = String(formData.get(key) ?? "").trim();
  return value.length > 0 ? value : null;
}

function validateAccesoForm(formData: FormData): ValidationResult {
  const proyecto = String(formData.get("proyecto") ?? "").trim();
  const servicio = optionalField(formData, "servicio");
  const entorno = optionalField(formData, "entorno");
  const descripcion = optionalField(formData, "descripcion");
  const contenido = String(formData.get("contenido") ?? "").trim();

  if (!proyecto) {
    return { ok: false, error: "El proyecto es obligatorio." };
  }

  if (proyecto.length > 100) {
    return { ok: false, error: "El proyecto no puede superar los 100 caracteres." };
  }

  if (servicio && servicio.length > 100) {
    return { ok: false, error: "El servicio no puede superar los 100 caracteres." };
  }

  if (entorno && entorno.length > 50) {
    return { ok: false, error: "El entorno no puede superar los 50 caracteres." };
  }

  if (!contenido) {
    return { ok: false, error: "El contenido no puede estar vacío." };
  }

  if (contenido.length > 20000) {
    return {
      ok: false,
      error: "El contenido no puede superar los 20.000 caracteres.",
    };
  }

  if (descripcion && descripcion.length > 500) {
    return {
      ok: false,
      error: "La descripción no puede superar los 500 caracteres.",
    };
  }

  return {
    ok: true,
    data: { proyecto, servicio, entorno, descripcion, contenido },
  };
}

function parseId(value: FormDataEntryValue | null): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function createAcceso(
  _prevState: AccesoFormState,
  formData: FormData,
): Promise<AccesoFormState> {
  const result = validateAccesoForm(formData);

  if (!result.ok) {
    return { error: result.error, success: false };
  }

  try {
    await prisma.acceso.create({ data: result.data });

    revalidatePath("/accesos");

    return { error: null, success: true };
  } catch {
    return {
      error: "No se pudo guardar el acceso. Verifica la conexión a la base de datos.",
      success: false,
    };
  }
}

export async function updateAcceso(
  _prevState: AccesoFormState,
  formData: FormData,
): Promise<AccesoFormState> {
  const id = parseId(formData.get("id"));

  if (id === null) {
    return { error: "Acceso no válido.", success: false };
  }

  const result = validateAccesoForm(formData);

  if (!result.ok) {
    return { error: result.error, success: false };
  }

  try {
    const existing = await prisma.acceso.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return { error: "El acceso no existe.", success: false };
    }

    await prisma.acceso.update({
      where: { id },
      data: result.data,
    });

    revalidatePath("/accesos");

    return { error: null, success: true };
  } catch {
    return {
      error: "No se pudo actualizar el acceso. Verifica la conexión a la base de datos.",
      success: false,
    };
  }
}

export async function deleteAcceso(
  id: number,
): Promise<{ success: true } | { error: string }> {
  if (!Number.isInteger(id) || id <= 0) {
    return { error: "Acceso no válido." };
  }

  try {
    const existing = await prisma.acceso.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return { error: "El acceso no existe." };
    }

    await prisma.acceso.delete({ where: { id } });

    revalidatePath("/accesos");

    return { success: true };
  } catch {
    return { error: "No se pudo eliminar el acceso." };
  }
}
