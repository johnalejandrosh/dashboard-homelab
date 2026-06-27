import { prisma } from "@/lib/prisma";

export type AccesoItem = {
  id: number;
  proyecto: string;
  servicio: string | null;
  entorno: string | null;
  descripcion: string | null;
  contenido: string;
  actualizadoEn: Date;
};

export async function getAccesos(): Promise<AccesoItem[] | null> {
  try {
    return await prisma.acceso.findMany({
      orderBy: [
        { proyecto: "asc" },
        { servicio: "asc" },
        { entorno: "asc" },
      ],
      select: {
        id: true,
        proyecto: true,
        servicio: true,
        entorno: true,
        descripcion: true,
        contenido: true,
        actualizadoEn: true,
      },
    });
  } catch {
    return null;
  }
}
