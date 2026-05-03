/**
 * Decorative abstract “coastline + corridors” motif — avoids stock faces while nodding at Chennai geography (Marina shoreline + radial corridors).
 * Pure SVG, no remote images.
 */
export function ChennaiHeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 460"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      role="img"
    >
      <defs>
        <linearGradient id="chsand" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(251,191,36,0.35)" />
          <stop offset="55%" stopColor="rgba(37,99,235,0.15)" />
          <stop offset="100%" stopColor="rgba(15,118,168,0.12)" />
        </linearGradient>
        <linearGradient id="chor" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="384" height="444" rx="28" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      <path
        d="M32 392 C 140 348, 200 312, 360 296"
        stroke="url(#chsand)"
        strokeWidth="72"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M48 368 Q 140 288 288 236 T 372 148"
        stroke="url(#chor)"
        strokeWidth="3"
        strokeDasharray="10 14"
      />
      <path
        d="M72 392 Q 180 296 296 236 T 356 164"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="2.5"
        strokeDasharray="6 12"
      />
      <path
        d="M288 420 L 288 268 L 340 236 L 340 392 Z"
        fill="rgba(37,99,235,0.14)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.2"
      />
      <circle cx="118" cy="312" r="6" fill="rgba(251,191,36,0.85)" />
      <circle cx="214" cy="258" r="5" fill="rgba(255,255,255,0.75)" />
      <circle cx="312" cy="204" r="5" fill="rgba(255,255,255,0.55)" />
      <circle cx="178" cy="344" r="4" fill="rgba(37,99,235,0.55)" />
      <text
        x="48"
        y="54"
        fill="rgba(255,255,255,0.35)"
        fontSize="11"
        fontWeight="600"
        letterSpacing="0.18em"
        style={{ textTransform: "uppercase" }}
      >
        Coast · Corridors
      </text>
      <text x="48" y="426" fill="rgba(251,211,141,0.55)" fontSize="12" fontWeight="600">
        OMR ⇄ Tambaram ⇄ Porur
      </text>
    </svg>
  );
}
