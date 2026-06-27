"use client";

import { useMemo, useState } from "react";
import type { AccesoItem } from "@/lib/accesos";
import { AccesoRow } from "@/components/accesos/acceso-row";
import { AccesoFormDialog } from "@/components/accesos/acceso-form-dialog";
import { SiteNav } from "@/components/site-nav";

type AccesosViewProps = {
  accesos: AccesoItem[];
};

type ServicioGroup = {
  servicio: string | null;
  items: AccesoItem[];
};

type ProyectoGroup = {
  proyecto: string;
  count: number;
  servicios: ServicioGroup[];
};

function uniqueSorted(values: (string | null)[]): string[] {
  return Array.from(
    new Set(values.filter((v): v is string => !!v && v.trim().length > 0)),
  ).sort((a, b) => a.localeCompare(b));
}

function groupByProyecto(accesos: AccesoItem[]): ProyectoGroup[] {
  const byProyecto = new Map<string, AccesoItem[]>();

  for (const acceso of accesos) {
    const list = byProyecto.get(acceso.proyecto) ?? [];
    list.push(acceso);
    byProyecto.set(acceso.proyecto, list);
  }

  return Array.from(byProyecto.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([proyecto, items]) => {
      const byServicio = new Map<string, AccesoItem[]>();
      for (const item of items) {
        const key = item.servicio ?? "";
        const list = byServicio.get(key) ?? [];
        list.push(item);
        byServicio.set(key, list);
      }

      const servicios: ServicioGroup[] = Array.from(byServicio.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([servicio, list]) => ({
          servicio: servicio.length > 0 ? servicio : null,
          items: list,
        }));

      return { proyecto, count: items.length, servicios };
    });
}

export function AccesosView({ accesos }: AccesosViewProps) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [createOpen, setCreateOpen] = useState(false);
  const [createKey, setCreateKey] = useState(0);
  const [createProyecto, setCreateProyecto] = useState<string | undefined>(
    undefined,
  );

  const proyectos = useMemo(
    () => uniqueSorted(accesos.map((a) => a.proyecto)),
    [accesos],
  );
  const servicios = useMemo(
    () => uniqueSorted(accesos.map((a) => a.servicio)),
    [accesos],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return accesos.filter((a) => {
      if (!term) return true;
      const haystack = [a.proyecto, a.servicio, a.entorno, a.descripcion]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [accesos, search]);

  const groups = useMemo(() => groupByProyecto(filtered), [filtered]);

  const searchActive = search.trim().length > 0;

  function toggleProyecto(proyecto: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(proyecto)) {
        next.delete(proyecto);
      } else {
        next.add(proyecto);
      }
      return next;
    });
  }

  function openCreate(proyecto?: string) {
    setCreateProyecto(proyecto);
    setCreateKey((k) => k + 1);
    setCreateOpen(true);
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-6 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Accesos
        </h1>
        <p className="mt-2 text-sm text-white/45">
          Variables de entorno y secretos, organizados por proyecto, servicio y
          entorno.
        </p>
      </header>

      <SiteNav active="accesos" />

      <section className="mt-10 w-full">
        {/* Buscador + nuevo */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-white/30">
              🔍
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por proyecto, servicio, entorno o descripción…"
              className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pr-4 pl-9 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/25 focus:bg-white/8"
            />
          </div>
          <button
            type="button"
            onClick={() => openCreate()}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition-opacity hover:opacity-90"
          >
            <span className="text-base leading-none">+</span>
            Nuevo acceso
          </button>
        </div>

        {/* Resultados */}
        <div className="mt-6 flex flex-col gap-3">
          {groups.length > 0 ? (
            groups.map((group) => {
              const isCollapsed = !searchActive && !expanded.has(group.proyecto);
              return (
                <div
                  key={group.proyecto}
                  className="group/proj overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/15"
                >
                  <div
                    role="button"
                    tabIndex={searchActive ? -1 : 0}
                    aria-expanded={!isCollapsed}
                    onClick={() => {
                      if (!searchActive) toggleProyecto(group.proyecto);
                    }}
                    onKeyDown={(e) => {
                      if (!searchActive && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        toggleProyecto(group.proyecto);
                      }
                    }}
                    className={`flex items-center gap-3 px-4 py-3.5 ${
                      searchActive ? "" : "cursor-pointer"
                    }`}
                  >
                    <span
                      className={`shrink-0 text-xs text-white/40 transition-transform ${
                        isCollapsed ? "" : "rotate-90"
                      }`}
                    >
                      ▶
                    </span>
                    <span className="truncate text-sm font-semibold text-white">
                      {group.proyecto}
                    </span>
                    <span className="shrink-0 rounded-full bg-white/8 px-2 py-0.5 text-[11px] font-medium text-white/50">
                      {group.count}
                    </span>
                    <div className="flex-1" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openCreate(group.proyecto);
                      }}
                      title={`Nuevo acceso en ${group.proyecto}`}
                      className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium text-white/45 opacity-0 transition-all group-hover/proj:opacity-100 hover:bg-white/8 hover:text-white focus-visible:opacity-100"
                    >
                      + acceso
                    </button>
                  </div>

                  {!isCollapsed ? (
                    <div className="space-y-4 px-4 pt-1 pb-4">
                      {group.servicios.map((sg) => (
                        <div key={sg.servicio ?? "__none__"}>
                          <div className="mb-2 flex items-center gap-2">
                            <span className="text-[11px] font-semibold tracking-[0.15em] text-white/40 uppercase">
                              {sg.servicio ?? "Sin servicio"}
                            </span>
                            <div className="h-px flex-1 bg-white/6" />
                          </div>
                          <div className="flex flex-col gap-2">
                            {sg.items.map((acceso) => (
                              <AccesoRow
                                key={acceso.id}
                                acceso={acceso}
                                proyectos={proyectos}
                                servicios={servicios}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-white/12 bg-white/3 px-6 py-14 text-center">
              <p className="text-sm text-white/55">
                {accesos.length === 0
                  ? "No hay accesos guardados todavía."
                  : "Ningún acceso coincide con la búsqueda."}
              </p>
            </div>
          )}
        </div>
      </section>

      {createOpen ? (
        <AccesoFormDialog
          key={createKey}
          open={createOpen}
          proyectos={proyectos}
          servicios={servicios}
          defaultProyecto={createProyecto}
          onClose={() => setCreateOpen(false)}
        />
      ) : null}
    </div>
  );
}
