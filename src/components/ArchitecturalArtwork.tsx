import React from 'react';

export type ArtworkVariant =
  | 'hero-video-scene'
  | 'islands-brygge-1'
  | 'islands-brygge-2'
  | 'skodsborg'
  | 'oesterbro'
  | 'natalie-portrait'
  | 'showroom-strandvejen';

interface ArchitecturalArtworkProps {
  variant: ArtworkVariant;
  className?: string;
}

/**
 * Bespoke Scandinavian architectural compositions and fixed placeholders
 * with subtle lighting, travertine/oak textures, and arched perspectives.
 */
export const ArchitecturalArtwork: React.FC<ArchitecturalArtworkProps> = ({
  variant,
  className = '',
}) => {
  if (variant === 'hero-video-scene') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#19161F] select-none ${className}`}>
        {/* Subtle ambient architectural motion SVG + HTML5 video layer */}
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full block"
          role="img"
          aria-label="Stemningsfuldt skandinavisk interiør med bueformede døråbninger og naturligt lysindfald"
        >
          <defs>
            <linearGradient id="heroDarkWall" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2B2730" />
              <stop offset="50%" stopColor="#1E1B24" />
              <stop offset="100%" stopColor="#120F17" />
            </linearGradient>
            <linearGradient id="heroWarmLight" x1="0%" y1="0%" x2="85%" y2="100%">
              <stop offset="0%" stopColor="#EEEDE7" stopOpacity="0.42" />
              <stop offset="50%" stopColor="#D6D1C4" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#120F17" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="archInnerLight" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#E5E1D6" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#9E9789" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#231F29" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          <rect width="1440" height="900" fill="url(#heroDarkWall)" />

          {/* Architectural perspective lines */}
          <polygon points="0,720 1440,720 1440,900 0,900" fill="#17141C" />
          <polygon points="180,0 920,0 1340,900 420,900" fill="url(#heroWarmLight)" />

          {/* Grand arched portal on right side */}
          <path
            d="M 760 740 L 760 310 A 190 190 0 0 1 1140 310 L 1140 740 Z"
            fill="url(#archInnerLight)"
            stroke="#EEEDE7"
            strokeOpacity="0.22"
            strokeWidth="1.5"
          />
          <path
            d="M 815 740 L 815 330 A 135 135 0 0 1 1085 330 L 1085 740 Z"
            fill="#120F17"
            fillOpacity="0.45"
            stroke="#EEEDE7"
            strokeOpacity="0.14"
            strokeWidth="1"
          />

          {/* Secondary arched mirror silhouette on left */}
          <path
            d="M 240 720 L 240 370 A 120 120 0 0 1 480 370 L 480 720 Z"
            fill="none"
            stroke="#EEEDE7"
            strokeOpacity="0.15"
            strokeWidth="1.2"
          />

          {/* Sunlit travertine monolith table */}
          <rect x="640" y="650" width="320" height="22" fill="#D5D0C3" fillOpacity="0.32" />
          <rect x="680" y="672" width="48" height="78" fill="#B8B1A2" fillOpacity="0.25" />
          <rect x="872" y="672" width="48" height="78" fill="#B8B1A2" fillOpacity="0.25" />
        </svg>
      </div>
    );
  }

  if (variant === 'islands-brygge-1') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#DFDDD4] ${className}`}>
        <svg
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full block"
          role="img"
          aria-label="TOTAL RENOVERING — Islands Brygge"
        >
          <rect width="800" height="600" fill="#E3E1D8" />
          <polygon points="0,460 800,460 800,600 0,600" fill="#CFCBC0" />
          <polygon points="180,0 640,0 800,460 320,460" fill="#F4F3EE" opacity="0.75" />
          {/* Custom smoked oak kitchen monolith & arched passage */}
          <path
            d="M 110 460 L 110 185 A 95 95 0 0 1 300 185 L 300 460 Z"
            fill="#F2F1EC"
            stroke="#120F17"
            strokeOpacity="0.25"
            strokeWidth="1.5"
          />
          <rect x="360" y="290" width="330" height="170" fill="#3B332B" />
          <rect x="352" y="276" width="346" height="16" fill="#EAE7DF" stroke="#120F17" strokeOpacity="0.2" />
          <line x1="470" y1="292" x2="470" y2="460" stroke="#120F17" strokeOpacity="0.35" />
          <line x1="580" y1="292" x2="580" y2="460" stroke="#120F17" strokeOpacity="0.35" />
        </svg>
      </div>
    );
  }

  if (variant === 'islands-brygge-2') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#DBD8CE] ${className}`}>
        <svg
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full block"
          role="img"
          aria-label="TOTAL RENOVERING — Islands Brygge Penthouse"
        >
          <rect width="800" height="600" fill="#DFDCD2" />
          {/* Double arched enfilade */}
          <path d="M 160 510 L 160 210 A 150 150 0 0 1 460 210 L 460 510 Z" fill="#C9C4B8" />
          <path
            d="M 215 510 L 215 245 A 95 95 0 0 1 405 245 L 405 510 Z"
            fill="#F5F4EF"
            stroke="#120F17"
            strokeOpacity="0.25"
            strokeWidth="1.5"
          />
          {/* Bespoke arched brass mirror on right wall */}
          <path
            d="M 525 480 L 525 250 A 65 65 0 0 1 655 250 L 655 480 Z"
            fill="#ECEAE2"
            stroke="#120F17"
            strokeWidth="1.75"
          />
          <rect x="0" y="510" width="800" height="90" fill="#D1CCC0" />
        </svg>
      </div>
    );
  }

  if (variant === 'skodsborg') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#E5E3DA] ${className}`}>
        <svg
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full block"
          role="img"
          aria-label="TOTAL RENOVERING — Skodsborg Kystvilla"
        >
          <rect width="800" height="600" fill="#E6E4DC" />
          {/* Panoramic coastal arch window */}
          <path
            d="M 220 470 L 220 220 A 180 180 0 0 1 580 220 L 580 470 Z"
            fill="#F7F6F2"
            stroke="#120F17"
            strokeOpacity="0.3"
            strokeWidth="1.5"
          />
          {/* Øresund horizon line */}
          <line x1="220" y1="340" x2="580" y2="340" stroke="#120F17" strokeOpacity="0.2" strokeWidth="1" />
          <line x1="400" y1="40" x2="400" y2="470" stroke="#120F17" strokeOpacity="0.15" strokeWidth="1" />
          {/* Freestanding stone bathtub */}
          <path
            d="M 290 430 Q 290 495 400 495 Q 510 495 510 430 Z"
            fill="#DCD8CC"
            stroke="#120F17"
            strokeOpacity="0.3"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'oesterbro') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#DEDBD1] ${className}`}>
        <svg
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full block"
          role="img"
          aria-label="TOTAL RENOVERING — Østerbro Herskabslejlighed"
        >
          <rect width="800" height="600" fill="#E1DFD5" />
          {/* Classic Haussmann/Copenhagen wall panelling + modern arch */}
          <rect x="70" y="70" width="260" height="390" fill="none" stroke="#120F17" strokeOpacity="0.16" strokeWidth="1.2" />
          <rect x="90" y="90" width="220" height="350" fill="none" stroke="#120F17" strokeOpacity="0.12" strokeWidth="1" />
          <path
            d="M 410 500 L 410 215 A 130 130 0 0 1 670 215 L 670 500 Z"
            fill="#231F29"
          />
          <path
            d="M 450 500 L 450 245 A 90 90 0 0 1 630 245 L 630 500 Z"
            fill="#EEEDE7"
          />
          <rect x="0" y="500" width="800" height="100" fill="#CCC7BA" />
        </svg>
      </div>
    );
  }

  if (variant === 'natalie-portrait') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#DFDCD3] ${className}`}>
        <svg
          viewBox="0 0 600 760"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full block"
          role="img"
          aria-label="Om Natalie — Arkitektonisk studie og materialekomposition"
        >
          <rect width="600" height="760" fill="#E3E0D7" />
          <polygon points="140,0 600,0 600,580 40,760" fill="#F2F0EA" opacity="0.7" />
          {/* Tall arched mirror framing silhouette */}
          <path
            d="M 135 660 L 135 260 A 165 165 0 0 1 465 260 L 465 660 Z"
            fill="#D4CFC2"
            stroke="#120F17"
            strokeWidth="1.5"
          />
          <path
            d="M 165 660 L 165 275 A 135 135 0 0 1 435 275 L 435 660 Z"
            fill="#ECEAE3"
          />
          {/* Minimalist architectural silhouette & material samples */}
          <circle cx="300" cy="365" r="44" fill="#120F17" fillOpacity="0.85" />
          <path d="M 225 560 C 225 465 375 465 375 560 L 390 660 L 210 660 Z" fill="#120F17" fillOpacity="0.88" />
          <rect x="90" y="630" width="140" height="55" fill="#EAE7DF" stroke="#120F17" strokeOpacity="0.25" />
        </svg>
      </div>
    );
  }

  // showroom-strandvejen
  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#DBD7CC] ${className}`}>
      <svg
        viewBox="0 0 900 620"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full block"
        role="img"
        aria-label="Showroom, Strandvejen 153, Hellerup — Materialebibliotek"
      >
        <rect width="900" height="620" fill="#E2DFD6" />
        {/* Material library shelves & arched sample niches */}
        <path
          d="M 110 510 L 110 210 A 110 110 0 0 1 330 210 L 330 510 Z"
          fill="#201C26"
        />
        <path
          d="M 380 510 L 380 210 A 110 110 0 0 1 600 210 L 600 510 Z"
          fill="#F4F3EE"
          stroke="#120F17"
          strokeWidth="1.5"
        />
        {/* Tactile stone, timber, and brass samples on plinth */}
        <rect x="650" y="160" width="150" height="350" fill="#D0CBBF" stroke="#120F17" strokeOpacity="0.2" />
        <rect x="240" y="450" width="420" height="75" fill="#EAE7DF" stroke="#120F17" strokeOpacity="0.25" />
        <circle cx="490" cy="360" r="38" fill="#C4B9A5" />
      </svg>
    </div>
  );
};
