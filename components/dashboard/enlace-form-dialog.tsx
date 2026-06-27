"use client";

import { useActionState, useEffect, useRef } from "react";
import { createEnlace, updateEnlace } from "@/app/actions/enlaces";
import { enlaceFormInitialState } from "@/lib/enlace-form";
import type { EnlaceItem } from "@/lib/enlaces";

type EnlaceFormDialogProps = {
  open: boolean;
  onClose: () => void;
  /** Si se entrega, el diálogo opera en modo edición. */
  enlace?: EnlaceItem;
};

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/25 focus:bg-white/8";

export function EnlaceFormDialog({ open, onClose, enlace }: EnlaceFormDialogProps) {
  const isEdit = enlace !== undefined;
  const formRef = useRef<HTMLFormElement>(null);
  const handledSuccessRef = useRef(false);
  const [state, formAction, pending] = useActionState(
    isEdit ? updateEnlace : createEnlace,
    enlaceFormInitialState,
  );

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose, pending]);

  useEffect(() => {
    if (!state.success || handledSuccessRef.current) {
      return;
    }

    handledSuccessRef.current = true;
    formRef.current?.reset();
    onClose();
  }, [state.success, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar formulario"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => {
          if (!pending) onClose();
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="enlace-form-title"
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#121a2e] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.5)]"
      >
        <h2 id="enlace-form-title" className="text-lg font-semibold text-white">
          {isEdit ? "Editar enlace" : "Nuevo enlace"}
        </h2>
        <p className="mt-1 text-sm text-white/45">
          {isEdit
            ? "Actualiza los datos del servicio."
            : "Agrega un servicio al dashboard homelab."}
        </p>

        <form ref={formRef} action={formAction} className="mt-6 space-y-4">
          {isEdit ? <input type="hidden" name="id" value={enlace.id} /> : null}

          <div>
            <label
              htmlFor="nombre"
              className="mb-1.5 block text-xs font-medium tracking-wide text-white/55 uppercase"
            >
              Nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              maxLength={100}
              defaultValue={enlace?.nombre}
              placeholder="Ej. Portainer"
              className={inputClassName}
              disabled={pending}
            />
          </div>

          <div>
            <label
              htmlFor="url"
              className="mb-1.5 block text-xs font-medium tracking-wide text-white/55 uppercase"
            >
              URL
            </label>
            <input
              id="url"
              name="url"
              type="url"
              required
              defaultValue={enlace?.url}
              placeholder="https://portainer.local"
              className={inputClassName}
              disabled={pending}
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/4 px-4 py-3">
            <input
              id="favorito"
              name="favorito"
              type="checkbox"
              defaultChecked={enlace?.favorito}
              disabled={pending}
              className="h-4 w-4 rounded border-white/20 bg-white/5 accent-amber-400"
            />
            <span className="text-sm text-white/80">Marcar como favorito</span>
          </label>

          <div>
            <label
              htmlFor="descripcion"
              className="mb-1.5 block text-xs font-medium tracking-wide text-white/55 uppercase"
            >
              Descripción
              <span className="ml-1 font-normal text-white/30 normal-case">
                (opcional)
              </span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={3}
              maxLength={500}
              defaultValue={enlace?.descripcion ?? ""}
              placeholder="Breve descripción del servicio"
              className={`${inputClassName} resize-none`}
              disabled={pending}
            />
          </div>

          {state.error ? (
            <p className="rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {state.error}
            </p>
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={pending}
              className="rounded-full px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:text-white disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-white px-5 py-2 text-sm font-medium text-slate-900 transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {pending
                ? "Guardando..."
                : isEdit
                  ? "Guardar cambios"
                  : "Crear enlace"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
