/**
 * Ilustrações botânicas em traço — desenhadas pelo scroll (classe .draw + pathLength=1).
 * Elementos pontuais, sempre decorativos (aria-hidden).
 */

type P = { className?: string; strokeWidth?: number; /** Desenha conforme o scroll (MotionLayer). */ scroll?: boolean };

export function Sprig({ className = "", strokeWidth = 1.2, scroll = false }: P) {
  return (
    <svg viewBox="0 0 120 220" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" className={`draw ${className}`} data-draw={scroll ? "" : undefined} aria-hidden>
      <path pathLength={1} d="M62 216C60 170 58 120 64 70C68 40 74 20 80 4" />
      <path pathLength={1} d="M61 180C40 176 22 162 14 140C34 140 52 152 61 180Z" />
      <path pathLength={1} d="M62 150C82 142 98 124 104 100C84 104 66 122 62 150Z" />
      <path pathLength={1} d="M62 118C42 112 28 96 24 74C44 78 58 94 62 118Z" />
      <path pathLength={1} d="M66 86C84 76 94 58 96 36C78 44 66 62 66 86Z" />
      <path pathLength={1} d="M72 50C58 42 52 28 54 12C66 20 72 34 72 50Z" />
    </svg>
  );
}

export function CitrusSlice({ className = "", strokeWidth = 1.2, scroll = false }: P) {
  const spokes = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    return `M60 60L${(60 + Math.cos(a) * 40).toFixed(1)} ${(60 + Math.sin(a) * 40).toFixed(1)}`;
  });
  return (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" className={`draw ${className}`} data-draw={scroll ? "" : undefined} aria-hidden>
      <circle pathLength={1} cx="60" cy="60" r="54" />
      <circle pathLength={1} cx="60" cy="60" r="44" />
      {spokes.map((d) => (
        <path key={d} pathLength={1} d={d} />
      ))}
    </svg>
  );
}

export function Leaf({ className = "", strokeWidth = 1.2, scroll = false }: P) {
  return (
    <svg viewBox="0 0 100 160" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" className={`draw ${className}`} data-draw={scroll ? "" : undefined} aria-hidden>
      <path pathLength={1} d="M50 156C18 120 12 64 50 6C88 64 82 120 50 156Z" />
      <path pathLength={1} d="M50 150V20" />
      <path pathLength={1} d="M50 60L32 46M50 84L28 66M50 108L30 92M50 60L68 46M50 84L72 66M50 108L70 92" />
    </svg>
  );
}

/** Traço manuscrito usado para "riscar" uma palavra. */
export function Strike({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 40" preserveAspectRatio="none" fill="none" className={className} aria-hidden>
      <path
        data-strike
        pathLength={1}
        d="M4 26C60 18 120 22 170 17C215 13 258 12 296 9"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        style={{ strokeDasharray: 1 }}
      />
    </svg>
  );
}
