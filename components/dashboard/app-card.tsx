"use client";

import { useEffect, useState, useTransition } from "react";
import { toggleFavorito } from "@/app/actions/enlaces";
import { getIconStyle, getIconVariant } from "@/lib/icon-style";
import { ServiceIcon } from "@/components/dashboard/service-icon";
import { EnlaceDetailDialog } from "@/components/dashboard/enlace-detail-dialog";
import { EnlaceFormDialog } from "@/components/dashboard/enlace-form-dialog";
import type { EnlaceItem } from "@/lib/enlaces";

type AppCardProps = {
  id: number;
  nombre: string;
  url: string;
  descripcion: string | null;
  favorito: boolean;
};

export function AppCard({
  id,
  nombre,
  url,
  descripcion,
  favorito: initialFavorito,
}: AppCardProps) {
  const [favorito, setFavorito] = useState(initialFavorito);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setFavorito(initialFavorito);
  }, [initialFavorito]);
  const style = getIconStyle(nombre);
  const variant = getIconVariant(nombre);

  const enlace: EnlaceItem = { id, nombre, url, descripcion, favorito };

  function handleToggleFavorito(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const nextValue = !favorito;
    setFavorito(nextValue);

    startTransition(async () => {
      const result = await toggleFavorito(id);

      if ("error" in result) {
        setFavorito(!nextValue);
        return;
      }

      setFavorito(result.favorito);
    });
  }

  function handleOpenDetail(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setDetailOpen(true);
  }

  return (
    <div className="group flex w-[88px] flex-col items-center gap-2.5 text-center">
      <div className="relative">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title={descripcion ?? nombre}
          className="block transition-transform group-hover:-translate-y-0.5"
        >
          <div
            className={`flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-white/8 bg-linear-to-br ${style.gradient} shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all group-hover:border-white/16 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)]`}
          >
            <ServiceIcon variant={variant} color={style.accent} />
          </div>
        </a>

        <button
          type="button"
          onClick={handleToggleFavorito}
          disabled={isPending}
          aria-label={favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
          title={favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
          className={`absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border text-xs transition-all ${
            favorito
              ? "border-amber-300/40 bg-amber-400/20 text-amber-300"
              : "border-white/12 bg-[#121a2e]/90 text-white/35 opacity-0 group-hover:opacity-100 hover:border-amber-300/30 hover:text-amber-300"
          } ${isPending ? "opacity-60" : ""}`}
        >
          {favorito ? "★" : "☆"}
        </button>

        <button
          type="button"
          onClick={handleOpenDetail}
          aria-label="Ver detalles del enlace"
          title="Ver detalles"
          className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-white/12 bg-[#121a2e]/90 text-xs leading-none text-white/45 opacity-0 transition-all group-hover:opacity-100 hover:border-white/25 hover:text-white"
        >
          ⋯
        </button>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="max-w-[88px] text-[11px] leading-tight font-medium text-white/90 transition-colors group-hover:text-white"
      >
        {nombre}
      </a>

      {detailOpen ? (
        <EnlaceDetailDialog
          enlace={enlace}
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          onEdit={() => {
            setDetailOpen(false);
            setEditOpen(true);
          }}
        />
      ) : null}

      {editOpen ? (
        <EnlaceFormDialog
          key={`edit-${id}`}
          open={editOpen}
          enlace={enlace}
          onClose={() => setEditOpen(false)}
        />
      ) : null}
    </div>
  );
}
