"use client";

import { useCallback, useMemo, useState } from "react";
import type { EnlaceItem } from "@/lib/enlaces";
import { AppCard } from "@/components/dashboard/app-card";
import { CreateEnlaceDialog } from "@/components/dashboard/create-enlace-dialog";

type DashboardViewProps = {
  enlaces: EnlaceItem[];
};

type FilterMode = "all" | "favorites";

export function DashboardView({ enlaces }: DashboardViewProps) {
  const [filter, setFilter] = useState<FilterMode>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [createFormKey, setCreateFormKey] = useState(0);

  const handleCloseCreateDialog = useCallback(() => {
    setCreateOpen(false);
  }, []);

  const visibleEnlaces = useMemo(() => {
    if (filter === "favorites") {
      return enlaces.filter((enlace) => enlace.favorito);
    }
    return enlaces;
  }, [enlaces, filter]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Dashboard Homelab
        </h1>
        <p className="mt-2 text-sm text-white/45">
          Seleccione un servicio. Los enlaces se abren en una nueva pestaña.
        </p>
      </header>

      <div className="mb-10 inline-flex rounded-full border border-white/10 bg-white/4 p-1">
        <button
          type="button"
          onClick={() => setFilter("favorites")}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
            filter === "favorites"
              ? "bg-white text-slate-900"
              : "text-white/70 hover:text-white"
          }`}
        >
          ★ Favoritos
        </button>
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-white text-slate-900"
              : "text-white/70 hover:text-white"
          }`}
        >
          ⊞ Todos los servicios
        </button>
      </div>

      <section className="w-full">
        <div className="mb-6 flex items-center gap-4">
          <span className="text-[11px] font-semibold tracking-[0.2em] text-white/35 uppercase">
            Servicios
          </span>
          <div className="h-px flex-1 bg-white/8" />
          <button
            type="button"
            onClick={() => {
              setCreateFormKey((key) => key + 1);
              setCreateOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-1.5 text-xs font-medium text-white/80 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <span className="text-base leading-none">+</span>
            Nuevo enlace
          </button>
        </div>

        {visibleEnlaces.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-8">
            {visibleEnlaces.map((enlace) => (
              <AppCard
                key={enlace.id}
                id={enlace.id}
                nombre={enlace.nombre}
                url={enlace.url}
                descripcion={enlace.descripcion}
                favorito={enlace.favorito}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/12 bg-white/3 px-6 py-14 text-center">
            <p className="text-sm text-white/55">
              {filter === "favorites"
                ? "No hay favoritos guardados todavía."
                : "No hay servicios registrados en la base de datos."}
            </p>
          </div>
        )}
      </section>

      {createOpen ? (
        <CreateEnlaceDialog
          key={createFormKey}
          open={createOpen}
          onClose={handleCloseCreateDialog}
        />
      ) : null}
    </div>
  );
}
