type ServiceIconProps = {
  variant: number;
  color: string;
};

export function ServiceIcon({ variant, color }: ServiceIconProps) {
  const common = {
    width: 34,
    height: 34,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (variant) {
    case 0:
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="6" rx="1.5" />
          <rect x="3" y="14" width="18" height="6" rx="1.5" />
          <circle cx="7" cy="7" r="1" fill={color} stroke="none" />
          <circle cx="7" cy="17" r="1" fill={color} stroke="none" />
        </svg>
      );
    case 1:
      return (
        <svg {...common}>
          <ellipse cx="12" cy="6" rx="7" ry="3" />
          <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
          <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
        </svg>
      );
    case 2:
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="14" rx="2" />
          <path d="M8 21h8" />
          <path d="M12 17v4" />
        </svg>
      );
    case 3:
      return (
        <svg {...common}>
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
          <path d="M12 12l8-4.5" />
          <path d="M12 12v9" />
          <path d="M12 12L4 7.5" />
        </svg>
      );
    case 4:
      return (
        <svg {...common}>
          <path d="M4 7h16" />
          <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
          <rect x="5" y="7" width="14" height="13" rx="2" />
          <path d="M10 12h4" />
        </svg>
      );
    case 5:
      return (
        <svg {...common}>
          <path d="M12 2v4" />
          <path d="M12 18v4" />
          <path d="M4.93 4.93l2.83 2.83" />
          <path d="M16.24 16.24l2.83 2.83" />
          <path d="M2 12h4" />
          <path d="M18 12h4" />
          <path d="M4.93 19.07l2.83-2.83" />
          <path d="M16.24 7.76l2.83-2.83" />
          <circle cx="12" cy="12" r="3.5" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M10 13a5 5 0 0 1 7.07 0" />
          <path d="M8.5 10.5a8.5 8.5 0 0 1 12 0" />
          <path d="M6.5 8a12 12 0 0 1 15 0" />
          <circle cx="12" cy="17" r="1.2" fill={color} stroke="none" />
        </svg>
      );
  }
}
