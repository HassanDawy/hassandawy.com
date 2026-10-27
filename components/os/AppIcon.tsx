import { useId, type ReactNode } from "react";

export type IconKind = "finder" | "terminal" | "notes" | "skills" | "trash" | "pdf" | "mail";

// iOS-style app icons: a rounded-square tile with a soft vertical gradient, a
// hairline edge and a familiar picture. Drawn here (not Apple's artwork) so
// they stay ours while reading instantly as Files, Terminal, Notes, Mail...
const TILES: Record<IconKind, [string, string]> = {
  finder: ["#FFFFFF", "#E6ECF4"],
  terminal: ["#3B4048", "#111317"],
  notes: ["#FFFFFF", "#F1F1EF"],
  skills: ["#FFC05A", "#F2861E"],
  trash: ["#F6F8FA", "#D5DBE2"],
  pdf: ["#FFFFFF", "#ECECEC"],
  mail: ["#5CC8FF", "#1A6FF2"],
};

export function AppIcon({ kind, size = 52 }: { kind: IconKind; size?: number }) {
  const id = useId();
  const [top, bottom] = TILES[kind];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <rect width="100" height="100" rx="22.5" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect width="100" height="100" fill={`url(#${id}-bg)`} />
        {GLYPHS[kind](id)}
      </g>
      <rect x="0.5" y="0.5" width="99" height="99" rx="22" fill="none" stroke="#000" strokeOpacity="0.1" />
    </svg>
  );
}

const GLYPHS: Record<IconKind, (id: string) => ReactNode> = {
  finder: (id) => (
    <>
      <defs>
        <linearGradient id={`${id}-folder`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5CB4FF" />
          <stop offset="1" stopColor="#1C7CF2" />
        </linearGradient>
      </defs>
      <path d="M18 33a6 6 0 0 1 6-6h17l7 7h28a6 6 0 0 1 6 6v6H18z" fill="#8CCBFF" />
      <rect x="18" y="39" width="64" height="40" rx="6" fill={`url(#${id}-folder)`} />
    </>
  ),
  terminal: () => (
    <g fill="none" stroke="#F5F5F5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M27 36l15 14-15 14" />
      <path d="M50 66h22" />
    </g>
  ),
  notes: (id) => (
    <>
      <defs>
        <linearGradient id={`${id}-band`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE27A" />
          <stop offset="1" stopColor="#FFC531" />
        </linearGradient>
      </defs>
      <rect width="100" height="30" fill={`url(#${id}-band)`} />
      <path d="M0 31h100" stroke="#C99A12" strokeWidth="1.5" strokeDasharray="2 3" />
      <g stroke="#D6D6D2" strokeWidth="2">
        <path d="M14 48h72M14 60h72M14 72h72M14 84h50" />
      </g>
    </>
  ),
  skills: () => (
    <>
      <path d="M27 24h24l25 25-27 27-25-25V27a3 3 0 0 1 3-3z" fill="#FFFFFF" />
      <circle cx="39" cy="36" r="5" fill="#F2861E" />
    </>
  ),
  trash: () => (
    <>
      <rect x="42" y="18" width="16" height="7" rx="2.5" fill="#7C8796" />
      <rect x="27" y="24" width="46" height="8" rx="3" fill="#7C8796" />
      <path d="M32 36h36l-3.2 41a5 5 0 0 1-5 4.6H40.2a5 5 0 0 1-5-4.6z" fill="#9AA5B4" />
      <g stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round">
        <path d="M43 45v28M50 45v28M57 45v28" />
      </g>
    </>
  ),
  pdf: () => (
    <>
      <g stroke="#CFCFCF" strokeWidth="3" strokeLinecap="round">
        <path d="M24 24h52M24 33h52M24 42h36" />
      </g>
      <rect x="20" y="56" width="60" height="26" rx="6" fill="#E5484D" />
      <text x="50" y="75" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="18" fontWeight="800" fill="#FFFFFF">
        PDF
      </text>
    </>
  ),
  mail: () => (
    <>
      <rect x="18" y="29" width="64" height="44" rx="7" fill="#FFFFFF" />
      <path d="M21 33l29 22 29-22" fill="none" stroke="#1A6FF2" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};
