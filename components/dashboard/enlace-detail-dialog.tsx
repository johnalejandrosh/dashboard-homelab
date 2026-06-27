"use client";

import { useEffect, useState, useTransition } from "react";
import { deleteEnlace } from "@/app/actions/enlaces";
import { getIconStyle, getIconVariant } from "@/lib/icon-style";
import { ServiceIcon } from "@/components/dashboard/service-icon";
import type { EnlaceItem } from "@/lib/enlaces";

type EnlaceDetailDialogProps = {
  enlace: EnlaceItem;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
};

export function EnlaceDetailDialog({
  enlace,
  open,
  onClose,
  onEdit,
}: EnlaceDetailDialogProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose, isPending]);

  if (!open) {
    return null;
  }

  const style = getIconStyle(enlace.nombre);
  const variant = getIconVariant(enlace.nombre);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteEnlace(enlace.id);

      if ("error" in result) {
        setError(result.error);
        return;
      }

      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar detalle"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => {
          if (!isPending) onClose();
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="enlace-detail-title"
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#121a2e] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-linear-to-br ${style.gradient} shadow-[0_8px_24px_rgba(0,0,0,0.35)]`}
          >
            <ServiceIcon variant={variant} color={style.accent} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2
                id="enlace-detail-title"
                className="truncate text-lg font-semibold text-white"
              >
                {enlace.nombre}
              </h2>
              {enlace.favorito ? (
                <span
                  title="Favorito"
                  className="shrink-0 rounded-full border border-amber-300/40 bg-amber-400/20 px-2 py-0.5 text-xs text-amber-300"
                >
                  ★ Favorito
                </span>
              ) : null}
            </div>
            <a
              href={enlace.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block truncate text-sm text-sky-300/90 transition-colors hover:text-sky-200"
            >
              {enlace.url}
            </a>
          </div>
        </div>

        <div className="mt-5">
          <span className="text-xs font-medium tracking-wide text-white/55 uppercase">
            Descripción
          </span>
          <p className="mt-1.5 text-sm whitespace-pre-wrap text-white/80">
            {enlace.descripcion?.trim()
              ? enlace.descripcion
              : "Sin descripción."}
          </p>
        </div>

        {error ? (
          <p className="mt-4 rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex items-center justify-between gap-3">
          {confirmingDelete ? (
            <div className="flex w-full items-center justify-between gap-3">
              <span className="text-sm text-white/70">¿Eliminar enlace?</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  disabled={isPending}
                  className="rounded-full px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:text-white disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {isPending ? "Eliminando..." : "Sí, eliminar"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                disabled={isPending}
                className="rounded-full border border-rose-400/30 px-4 py-2 text-sm font-medium text-rose-300 transition-colors hover:border-rose-400/50 hover:bg-rose-500/10 disabled:opacity-50"
              >
                Eliminar
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                  className="rounded-full px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:text-white disabled:opacity-50"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={onEdit}
                  disabled={isPending}
                  className="rounded-full bg-white px-5 py-2 text-sm font-medium text-slate-900 transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  Editar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
