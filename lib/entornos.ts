// Lista fija de entornos sugeridos. El usuario puede escribir uno personalizado.
export const ENTORNOS_SUGERIDOS = ["dev", "qa", "staging", "prod"] as const;

type EntornoStyle = {
  /** Clases para el badge (fondo, borde, texto). */
  badge: string;
  /** Clase de color para el punto indicador. */
  dot: string;
};

const STYLES: Record<string, EntornoStyle> = {
  dev: {
    badge: "border-sky-400/30 bg-sky-500/15 text-sky-300",
    dot: "bg-sky-400",
  },
  qa: {
    badge: "border-amber-400/30 bg-amber-500/15 text-amber-300",
    dot: "bg-amber-400",
  },
  staging: {
    badge: "border-violet-400/30 bg-violet-500/15 text-violet-300",
    dot: "bg-violet-400",
  },
  prod: {
    badge: "border-rose-400/30 bg-rose-500/15 text-rose-300",
    dot: "bg-rose-400",
  },
};

const DEFAULT_STYLE: EntornoStyle = {
  badge: "border-white/15 bg-white/8 text-white/60",
  dot: "bg-white/40",
};

export function getEntornoStyle(entorno: string | null): EntornoStyle {
  if (!entorno) {
    return DEFAULT_STYLE;
  }
  return STYLES[entorno.toLowerCase()] ?? DEFAULT_STYLE;
}
