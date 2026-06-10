import { prisma } from "@/lib/prisma";

export type EnlaceItem = {
  id: number;
  nombre: string;
  url: string;
  descripcion: string | null;
  favorito: boolean;
};

export async function getEnlaces(): Promise<EnlaceItem[] | null> {
  try {
    return await prisma.enlace.findMany({
      orderBy: { nombre: "asc" },
      select: {
        id: true,
        nombre: true,
        url: true,
        descripcion: true,
        favorito: true,
      },
    });
  } catch {
    return null;
  }
}
