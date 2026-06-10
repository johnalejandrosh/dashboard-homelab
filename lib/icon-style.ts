const ICON_STYLES = [
  { gradient: "from-violet-500/25 to-violet-700/10", accent: "#a78bfa" },
  { gradient: "from-sky-500/25 to-sky-700/10", accent: "#38bdf8" },
  { gradient: "from-emerald-500/25 to-emerald-700/10", accent: "#34d399" },
  { gradient: "from-amber-500/25 to-amber-700/10", accent: "#fbbf24" },
  { gradient: "from-rose-500/25 to-rose-700/10", accent: "#fb7185" },
  { gradient: "from-cyan-500/25 to-cyan-700/10", accent: "#22d3ee" },
  { gradient: "from-fuchsia-500/25 to-fuchsia-700/10", accent: "#e879f9" },
  { gradient: "from-orange-500/25 to-orange-700/10", accent: "#fb923c" },
] as const;

function hashString(value: string): number {
  let hash = 0;

  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return hash;
}

export function getIconStyle(seed: string) {
  return ICON_STYLES[hashString(seed) % ICON_STYLES.length];
}

export function getIconVariant(seed: string): number {
  return hashString(seed) % 6;
}
