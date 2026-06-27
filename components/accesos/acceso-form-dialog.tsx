"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { createAcceso, updateAcceso } from "@/app/actions/accesos";
import { accesoFormInitialState } from "@/lib/acceso-form";
import { ENTORNOS_SUGERIDOS } from "@/lib/entornos";
import type { AccesoItem } from "@/lib/accesos";

type AccesoFormDialogProps = {
  open: boolean;
  onClose: () => void;
  /** Si se entrega, el diálogo opera en modo edición. */
  acceso?: AccesoItem;
  /** Sugerencias para autocompletar. */
  proyectos?: string[];
  servicios?: string[];
  /** Prerrellena el proyecto al crear (botón "+" dentro de un proyecto). */
  defaultProyecto?: string;
};

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/25 focus:bg-white/8";

const labelClassName =
  "mb-1.5 block text-xs font-medium tracking-wide text-white/55 uppercase";

export function AccesoFormDialog({
  open,
  onClose,
  acceso,
  proyectos = [],
  servicios = [],
  defaultProyecto,
}: AccesoFormDialogProps) {
  const isEdit = acceso !== undefined;
  const formRef = useRef<HTMLFormElement>(null);
  const handledSuccessRef = useRef(false);
  const listIdBase = useId();
  const [state, formAction, pending] = useActionState(
    isEdit ? updateAcceso : createAcceso,
    accesoFormInitialState,
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
        aria-labelledby="acceso-form-title"
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#121a2e] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.5)]"
      >
        <h2 id="acceso-form-title" className="text-lg font-semibold text-white">
          {isEdit ? "Editar acceso" : "Nuevo acceso"}
        </h2>
        <p className="mt-1 text-sm text-white/45">
          Variables de entorno, cadenas de conexión u otros secretos para
          copiarlos luego.
        </p>

        <form ref={formRef} action={formAction} className="mt-6 space-y-4">
          {isEdit ? <input type="hidden" name="id" value={acceso.id} /> : null}

          <div>
            <label htmlFor="proyecto" className={labelClassName}>
              Proyecto
            </label>
            <input
              id="proyecto"
              name="proyecto"
              type="text"
              required
              maxLength={100}
              list={`${listIdBase}-proyectos`}
              defaultValue={acceso?.proyecto ?? defaultProyecto ?? ""}
              placeholder="Ej. savvi"
              className={inputClassName}
              disabled={pending}
              autoComplete="off"
            />
            <datalist id={`${listIdBase}-proyectos`}>
              {proyectos.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="servicio" className={labelClassName}>
                Servicio
                <span className="ml-1 font-normal text-white/30 normal-case">
                  (opcional)
                </span>
              </label>
              <input
                id="servicio"
                name="servicio"
                type="text"
                maxLength={100}
                list={`${listIdBase}-servicios`}
                defaultValue={acceso?.servicio ?? ""}
                placeholder="Ej. backend"
                className={inputClassName}
                disabled={pending}
                autoComplete="off"
              />
              <datalist id={`${listIdBase}-servicios`}>
                {servicios.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            <div>
              <label htmlFor="entorno" className={labelClassName}>
                Entorno
                <span className="ml-1 font-normal text-white/30 normal-case">
                  (opcional)
                </span>
              </label>
              <input
                id="entorno"
                name="entorno"
                type="text"
                maxLength={50}
                list={`${listIdBase}-entornos`}
                defaultValue={acceso?.entorno ?? ""}
                placeholder="Ej. prod"
                className={inputClassName}
                disabled={pending}
                autoComplete="off"
              />
              <datalist id={`${listIdBase}-entornos`}>
                {ENTORNOS_SUGERIDOS.map((e) => (
                  <option key={e} value={e} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label htmlFor="descripcion" className={labelClassName}>
              Descripción
              <span className="ml-1 font-normal text-white/30 normal-case">
                (opcional)
              </span>
            </label>
            <input
              id="descripcion"
              name="descripcion"
              type="text"
              maxLength={500}
              defaultValue={acceso?.descripcion ?? ""}
              placeholder="Ej. Variables de producción"
              className={inputClassName}
              disabled={pending}
            />
          </div>

          <div>
            <label htmlFor="contenido" className={labelClassName}>
              Contenido
            </label>
            <textarea
              id="contenido"
              name="contenido"
              required
              rows={9}
              maxLength={20000}
              defaultValue={acceso?.contenido}
              placeholder={"DATABASE_URL=postgres://...\nAPI_KEY=...\nPORT=3000"}
              className={`${inputClassName} resize-y font-mono text-xs leading-relaxed`}
              disabled={pending}
              spellCheck={false}
            />
            <p className="mt-1.5 text-xs text-white/35">
              Pega aquí el bloque completo. Se guarda tal cual para copiarlo después.
            </p>
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
                  : "Crear acceso"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
