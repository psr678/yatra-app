// Reusable SVG compass logo — used in Nav, Footer, and OG image
export default function CompassLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="Roamai compass logo">
      {/* Outer ring */}
      <circle cx="50" cy="50" r="47" fill="#8B1A1A" />
      <circle cx="50" cy="50" r="47" fill="none" stroke="#F0A500" strokeWidth="3" />
      {/* Inner dashed ring */}
      <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(240,165,0,0.45)" strokeWidth="1.2" strokeDasharray="4 3" />
      {/* North arrow — cream/white, pointing up */}
      <polygon points="50,7 54.5,30 50,26 45.5,30" fill="#FFF8F0" />
      {/* South arrow — saffron, pointing down */}
      <polygon points="50,93 45.5,70 50,74 54.5,70" fill="#FF6B00" />
      {/* East arrow — cream */}
      <polygon points="93,50 70,45.5 74,50 70,54.5" fill="#FFF8F0" />
      {/* West arrow — saffron */}
      <polygon points="7,50 30,54.5 26,50 30,45.5" fill="#FF6B00" />
      {/* Cardinal labels */}
      <text x="50" y="20" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#FFF8F0" fontFamily="Georgia, serif">N</text>
      <text x="50" y="88" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#FF6B00" fontFamily="Georgia, serif">S</text>
      <text x="88" y="54" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#FFF8F0" fontFamily="Georgia, serif">E</text>
      <text x="12" y="54" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#FF6B00" fontFamily="Georgia, serif">W</text>
      {/* Centre circle */}
      <circle cx="50" cy="50" r="19" fill="#FFF8F0" stroke="#F0A500" strokeWidth="1.5" />
      {/* R in centre */}
      <text x="50" y="58" textAnchor="middle" fontSize="23" fontWeight="bold" fill="#8B1A1A" fontFamily="Georgia, serif">R</text>
    </svg>
  );
}
