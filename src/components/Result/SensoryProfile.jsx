const AXES = [
  { key: 'acidite',    label: ['Acidité']                 },
  { key: 'intensite',  label: ['Intensité', 'aromatique'] },
  { key: 'corps',      label: ['Corps']                   },
  { key: 'complexite', label: ['Complexité']              },
  { key: 'equilibre',  label: ['Équilibre']               },
  { key: 'longueur',   label: ['Longueur']                },
  { key: 'clarte',     label: ['Clarté']                  },
  { key: 'sucrosite',  label: ['Sucrosité']               },
];

const CX      = 290;
const CY      = 285;
const R       = 140;
const ICON_R  = 172;
const LABEL_R = 202;
const RINGS   = 5;
const MAX     = 10;

const C = {
  ring:      '#E2D8CA',
  ringOuter: '#CEBFAA',
  axis:      '#D5CABC',
  fill:      'rgba(107,143,113,0.18)',
  stroke:    '#6B8F71',
  dotBg:     '#FAF6F1',
  icon:      '#6B8F71',
  label:     '#2E1810',
  score:     '#B87333',
};

function toRad(deg) { return (deg * Math.PI) / 180; }

function axisPoint(i, r) {
  const a = toRad(i * 45 - 90);
  return {
    x: +(CX + r * Math.cos(a)).toFixed(2),
    y: +(CY + r * Math.sin(a)).toFixed(2),
  };
}

function labelLayout(i) {
  return [
    { anchor: 'middle', oy: -15, lineH: 13 },
    { anchor: 'start',  oy: -10, lineH: 13 },
    { anchor: 'start',  oy:  -6, lineH: 13 },
    { anchor: 'start',  oy:   4, lineH: 13 },
    { anchor: 'middle', oy:  18, lineH: 13 },
    { anchor: 'end',    oy:   4, lineH: 13 },
    { anchor: 'end',    oy:  -6, lineH: 13 },
    { anchor: 'end',    oy: -10, lineH: 13 },
  ][i];
}

/* ── Icônes minimalistes (trait fin, centrées sur 0,0) ───────────────── */

function IconAcidite() {
  return (
    <>
      <circle r="7" fill="none" strokeWidth="1.3" />
      <line x1="0" y1="-7" x2="0" y2="7" strokeWidth="1" />
      <line x1="-6.06" y1="-3.5" x2="6.06" y2="3.5" strokeWidth="0.9" />
      <line x1="-6.06" y1="3.5" x2="6.06" y2="-3.5" strokeWidth="0.9" />
    </>
  );
}

function IconIntensite() {
  return (
    <>
      <path d="M-4,6 C-5,2 -4,-2 -4.5,-7" fill="none" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M0,6 C0,1 0,-2 0,-8" fill="none" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M4,6 C5,2 4,-2 4.5,-7" fill="none" strokeWidth="1.3" strokeLinecap="round" />
    </>
  );
}

function IconCorps() {
  return (
    <>
      <path d="M-6,-4 L-7,5 L7,5 L6,-4Z" fill="none" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M6.5,0.5 C11,0.5 11,5 6.5,5" fill="none" strokeWidth="1.2" />
      <line x1="-5" y1="7.5" x2="5" y2="7.5" strokeWidth="1.6" strokeLinecap="round" />
    </>
  );
}

function IconComplexite() {
  return (
    <>
      <circle cx="-2.5" cy="2" r="5" fill="none" strokeWidth="1.1" />
      <circle cx="2.5" cy="2" r="5" fill="none" strokeWidth="1.1" />
      <circle cx="0" cy="-3.5" r="5" fill="none" strokeWidth="1.1" />
    </>
  );
}

function IconEquilibre() {
  return (
    <>
      <line x1="0" y1="-6" x2="0" y2="6" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="-8" y1="-2" x2="8" y2="-2" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M-8,-2 L-10,4 L-6,4Z" fill="none" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M8,-2 L10,4 L6,4Z" fill="none" strokeWidth="1.1" strokeLinejoin="round" />
    </>
  );
}

function IconLongueur() {
  return (
    <>
      <path d="M-8,0 Q-4,-5.5 0,0 Q4,5.5 8,0" fill="none" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="0" r="2" stroke="none" />
    </>
  );
}

function IconClarte() {
  return (
    <>
      <circle cx="-0.5" cy="-0.5" r="5.5" fill="none" strokeWidth="1.3" />
      <line x1="4" y1="4" x2="8" y2="8" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function IconSucrosite() {
  return (
    <>
      <path d="M0,-8.5 L6,0 L0,8.5 L-6,0Z" fill="none" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="0" cy="0" r="2" fill="none" strokeWidth="1" />
    </>
  );
}

const ICONS = {
  acidite:    IconAcidite,
  intensite:  IconIntensite,
  corps:      IconCorps,
  complexite: IconComplexite,
  equilibre:  IconEquilibre,
  longueur:   IconLongueur,
  clarte:     IconClarte,
  sucrosite:  IconSucrosite,
};

/* ── Composant principal ─────────────────────────────────────────────── */

export default function SensoryProfile({ profile }) {
  if (!profile) return null;

  const dataPath = AXES.map((ax, i) => {
    const v  = Math.max(0, Math.min(MAX, profile[ax.key] ?? 0));
    const pt = axisPoint(i, (v / MAX) * R);
    return `${i === 0 ? 'M' : 'L'}${pt.x} ${pt.y}`;
  }).join(' ') + 'Z';

  return (
    <div className="sensory-profile">
      <div className="sensory-profile__header">
        <span className="sensory-profile__eyebrow">Fiche de dégustation</span>
        <h3 className="sensory-profile__title">Profil Sensoriel</h3>
        <p className="sensory-profile__sub">Café de Spécialité</p>
      </div>

      <svg
        className="sensory-profile__svg"
        viewBox="0 0 580 540"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Diagramme de profil sensoriel en araignée"
      >
        {/* Anneaux de grille */}
        {Array.from({ length: RINGS }, (_, ring) => {
          const frac    = (ring + 1) / RINGS;
          const isOuter = ring === RINGS - 1;
          const ringPath = AXES.map((_, i) => {
            const pt = axisPoint(i, frac * R);
            return `${i === 0 ? 'M' : 'L'}${pt.x} ${pt.y}`;
          }).join(' ') + 'Z';
          return (
            <path
              key={ring}
              d={ringPath}
              fill={isOuter ? 'rgba(235,228,218,0.4)' : 'none'}
              stroke={isOuter ? C.ringOuter : C.ring}
              strokeWidth={isOuter ? 1.4 : 0.7}
              strokeDasharray={isOuter ? undefined : '3 3'}
            />
          );
        })}

        {/* Axes */}
        {AXES.map((ax, i) => {
          const end = axisPoint(i, R);
          return (
            <line
              key={ax.key}
              x1={CX} y1={CY}
              x2={end.x} y2={end.y}
              stroke={C.axis}
              strokeWidth="0.8"
              strokeDasharray="2.5 3"
            />
          );
        })}

        {/* Zone de données */}
        <path
          d={dataPath}
          fill={C.fill}
          stroke={C.stroke}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Points sur les axes */}
        {AXES.map((ax, i) => {
          const v  = Math.max(0, Math.min(MAX, profile[ax.key] ?? 0));
          const pt = axisPoint(i, (v / MAX) * R);
          return (
            <circle
              key={ax.key}
              cx={pt.x} cy={pt.y}
              r="3.5"
              fill={C.dotBg}
              stroke={C.stroke}
              strokeWidth="1.8"
            />
          );
        })}

        {/* Icônes + étiquettes */}
        {AXES.map((ax, i) => {
          const iconPt = axisPoint(i, ICON_R);
          const lbPt   = axisPoint(i, LABEL_R);
          const ll     = labelLayout(i);
          const Icon   = ICONS[ax.key];
          const score  = (profile[ax.key] ?? 0).toFixed(1);
          const baseY  = lbPt.y + ll.oy;

          return (
            <g key={ax.key}>
              <g
                transform={`translate(${iconPt.x},${iconPt.y})`}
                stroke={C.icon}
                fill={C.icon}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Icon />
              </g>

              {ax.label.map((line, li) => (
                <text
                  key={li}
                  x={lbPt.x}
                  y={baseY + li * ll.lineH}
                  textAnchor={ll.anchor}
                  fontSize="10.5"
                  fill={C.label}
                  fontFamily="system-ui,-apple-system,sans-serif"
                  fontWeight="500"
                  letterSpacing="0.01em"
                >
                  {line}
                </text>
              ))}

              <text
                x={lbPt.x}
                y={baseY + ax.label.length * ll.lineH}
                textAnchor={ll.anchor}
                fontSize="9"
                fill={C.score}
                fontFamily="system-ui,-apple-system,sans-serif"
                fontWeight="600"
                letterSpacing="0.03em"
              >
                {score} / 10
              </text>
            </g>
          );
        })}

        {/* Point central */}
        <circle cx={CX} cy={CY} r="2.5" fill={C.score} opacity="0.5" />
      </svg>

      <p className="sensory-profile__footer">
        Torréfaction Artisanale · Café de Spécialité
      </p>
    </div>
  );
}
