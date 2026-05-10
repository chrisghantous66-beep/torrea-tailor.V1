// Décorations SVG inspirées du caféier — line art, légères, en currentColor.
// Utilisation : <CoffeeBranch className="..." /> avec couleur héritée via color CSS.

export function CoffeeBranch({ className = '', flipped = false }) {
  return (
    <svg
      viewBox="0 0 80 280"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={flipped ? { transform: 'scaleX(-1)' } : undefined}
    >
      <g
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Tige principale, légèrement courbée */}
        <path d="M 40 280 Q 36 230, 40 180 Q 44 130, 40 80 Q 36 40, 40 0" />

        {/* Paire de feuilles (basse) */}
        <path d="M 40 230 Q 18 222, 8 200 Q 22 218, 40 230 Z" />
        <path d="M 40 230 Q 62 222, 72 200 Q 58 218, 40 230 Z" />

        {/* Paire de feuilles (milieu) */}
        <path d="M 40 155 Q 14 145, 4 120 Q 22 138, 40 155 Z" />
        <path d="M 40 155 Q 66 145, 76 120 Q 58 138, 40 155 Z" />

        {/* Paire de feuilles (haute) */}
        <path d="M 40 80 Q 18 72, 8 50 Q 22 68, 40 80 Z" />
        <path d="M 40 80 Q 62 72, 72 50 Q 58 68, 40 80 Z" />
      </g>

      {/* Cerises de café au sommet */}
      <g fill="currentColor">
        <circle cx="32" cy="22" r="4" />
        <circle cx="48" cy="22" r="4" />
        <circle cx="40" cy="12" r="4" />
      </g>
    </svg>
  );
}

export function CoffeeLeaf({ className = '' }) {
  return (
    <svg viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <g stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 20 58 Q 4 48, 4 28 Q 4 8, 20 2 Q 36 8, 36 28 Q 36 48, 20 58 Z" />
        <path d="M 20 58 L 20 2" />
        <path d="M 20 22 L 30 16" opacity="0.6" />
        <path d="M 20 32 L 32 28" opacity="0.6" />
        <path d="M 20 42 L 30 40" opacity="0.6" />
        <path d="M 20 22 L 10 16" opacity="0.6" />
        <path d="M 20 32 L 8 28" opacity="0.6" />
        <path d="M 20 42 L 10 40" opacity="0.6" />
      </g>
    </svg>
  );
}

export function CoffeeBeans({ className = '' }) {
  return (
    <svg viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <g stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round">
        <ellipse cx="15" cy="15" rx="9" ry="5.5" />
        <path d="M 6 15 Q 15 12, 24 15" />
        <ellipse cx="40" cy="15" rx="9" ry="5.5" transform="rotate(15 40 15)" />
        <path d="M 32 17 Q 41 14, 49 17" transform="rotate(15 40 15)" />
      </g>
    </svg>
  );
}
