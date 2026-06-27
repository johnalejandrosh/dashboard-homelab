import Link from "next/link";

type SiteNavProps = {
  active: "enlaces" | "accesos";
};

const items = [
  { key: "enlaces", label: "⊞ Enlaces", href: "/" },
  { key: "accesos", label: "🔑 Accesos", href: "/accesos" },
] as const;

export function SiteNav({ active }: SiteNavProps) {
  return (
    <nav className="flex justify-center">
      <div className="inline-flex rounded-full border border-white/10 bg-white/4 p-1">
        {items.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              active === item.key
                ? "bg-white text-slate-900"
                : "text-white/70 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
