"use client";

import { useState, useTransition } from "react";
import { deleteAcceso } from "@/app/actions/accesos";
import { AccesoFormDialog } from "@/components/accesos/acceso-form-dialog";
import { getEntornoStyle } from "@/lib/entornos";
import type { AccesoItem } from "@/lib/accesos";

type AccesoRowProps = {
  acceso: AccesoItem;
  proyectos: string[];
  servicios: string[];
};

export function AccesoRow({ acceso, proyectos, servicios }: AccesoRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const entorno = getEntornoStyle(acceso.entorno);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(acceso.contenido);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("No se pudo copiar al portapapeles.");
    }
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteAcceso(acceso.id);
      if ("error" in result) {
        setError(result.error);
      }
      // En éxito, revalidatePath refresca la lista.
    });
  }

  return (
    <div className="group/row overflow-hidden rounded-xl border border-white/8 bg-white/[0.02] transition-colors hover:border-white/15 hover:bg-white/[0.05]">
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpanded((v) => !v);
          }
        }}
        className="flex cursor-pointer items-center gap-3 px-3 py-2.5"
      >
        <span
          className={`shrink-0 text-[10px] text-white/30 transition-transform ${
            expanded ? "rotate-90" : ""
          }`}
        >
          ▶
        </span>

        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${entorno.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${entorno.dot}`} />
          {acceso.entorno ?? "default"}
        </span>

        <p className="min-w-0 flex-1 truncate text-sm text-white/65">
          {acceso.descripcion || (
            <span className="text-white/25">Sin descripción</span>
          )}
        </p>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-900 transition-opacity hover:opacity-90"
          >
            {copied ? "✓ Copiado" : "Copiar"}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setEditOpen(true);
            }}
            disabled={isPending}
            aria-label="Editar acceso"
            title="Editar"
            className="flex h-7 w-7 items-center justify-center rounded-full text-xs text-white/40 opacity-0 transition-all group-hover/row:opacity-100 hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            ✎
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmingDelete(true);
            }}
            disabled={isPending}
            aria-label="Eliminar acceso"
            title="Eliminar"
            className="flex h-7 w-7 items-center justify-center rounded-full text-xs text-white/40 opacity-0 transition-all group-hover/row:opacity-100 hover:bg-rose-500/15 hover:text-rose-300 disabled:opacity-50"
          >
            🗑
          </button>
        </div>
      </div>

      {expanded ? (
        <div className="px-3 pb-3">
          <pre className="max-h-72 overflow-auto rounded-lg border border-white/8 bg-[#0c1322] p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-white/85">
            {acceso.contenido}
          </pre>
        </div>
      ) : null}

      {confirmingDelete ? (
        <div className="mx-3 mb-3 flex items-center justify-between gap-3 rounded-lg border border-rose-400/20 bg-rose-500/8 px-3 py-2">
          <span className="text-xs text-white/80">¿Eliminar este acceso?</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              disabled={isPending}
              className="rounded-full px-3 py-1 text-xs font-medium text-white/60 transition-colors hover:text-white disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-full bg-rose-500 px-3 py-1 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isPending ? "Eliminando..." : "Sí, eliminar"}
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="mx-3 mb-3 rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
          {error}
        </p>
      ) : null}

      {editOpen ? (
        <AccesoFormDialog
          key={`edit-${acceso.id}`}
          open={editOpen}
          acceso={acceso}
          proyectos={proyectos}
          servicios={servicios}
          onClose={() => setEditOpen(false)}
        />
      ) : null}
    </div>
  );
}
