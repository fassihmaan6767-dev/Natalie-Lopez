export type PreloaderPhase = 1 | 2 | 3 | 4 | 5;

export interface ArchGeometry {
  d: string;
  perimeter: number;
  innerWidth: number;
  innerHeight: number;
  archRadius: number;
}

/**
 * Generates an SVG path string and exact geometric perimeter for the
 * Shorter Arch Mirror (approx 1:1.35 proportion, viewBox="0 0 320 430",
 * rounded top semicircular arch radius ~160px, flat bottom).
 * When inset = 0, width = 320, height = 430, archRadius = 160.
 */
export function generateArchPath(
  viewBoxWidth: number = 320,
  viewBoxHeight: number = 430,
  inset: number = 0
): ArchGeometry {
  const innerWidth = Math.max(10, viewBoxWidth - inset * 2);
  const innerHeight = Math.max(20, viewBoxHeight - inset * 2);
  const r = innerWidth / 2;
  const straightHeight = Math.max(0, innerHeight - r);

  const left = inset;
  const right = inset + innerWidth;
  const topArcStartY = inset + r;
  const bottom = inset + innerHeight;
  const centerX = inset + r;

  const d = [
    `M ${centerX} ${bottom}`,
    `L ${left} ${bottom}`,
    `L ${left} ${topArcStartY}`,
    `A ${r} ${r} 0 0 1 ${right} ${topArcStartY}`,
    `L ${right} ${bottom}`,
    `Z`,
  ].join(' ');

  const perimeter = 2 * straightHeight + Math.PI * r + innerWidth;

  return {
    d,
    perimeter,
    innerWidth,
    innerHeight,
    archRadius: r,
  };
}

/**
 * Synchronizes SVG stroke-dashoffset with numeric counter (0% to 100%).
 * At 0%, offset = pathLength (fully hidden).
 * At 100%, offset = 0 (closed loop completed).
 */
export function calculateStrokeDashoffset(
  progressPercent: number,
  pathLength: number
): number {
  const clamped = Math.min(100, Math.max(0, progressPercent));
  const normalized = clamped / 100;
  const offset = pathLength * (1 - normalized);
  return Math.abs(offset) < 1e-9 ? 0 : offset;
}

/**
 * Formats the counter value from 0 to 100 as minimalist typographic strings:
 * "00" to "100" and "00%" to "100%".
 */
export function formatCounterValue(progressPercent: number): {
  raw: number;
  paddedDigits: string;
  label: string;
} {
  const rounded = Math.min(100, Math.max(0, Math.round(progressPercent)));
  const paddedDigits = rounded < 10 ? `0${rounded}` : `${rounded}`;
  return {
    raw: rounded,
    paddedDigits,
    label: `${paddedDigits}%`,
  };
}

/**
 * Computes responsive expansion ratios to guarantee the central arch
 * smoothly covers the entire viewport on both mobile and ultrawide screens.
 */
export function computeViewportExpansion(
  viewportWidth: number,
  viewportHeight: number,
  archWidth: number,
  archHeight: number
): {
  scaleX: number;
  scaleY: number;
  coverScale: number;
} {
  const safeArchW = Math.max(1, archWidth);
  const safeArchH = Math.max(1, archHeight);
  const scaleX = viewportWidth / safeArchW;
  const scaleY = viewportHeight / safeArchH;
  const coverScale = Math.max(scaleX, scaleY) * 1.04;

  return {
    scaleX,
    scaleY,
    coverScale,
  };
}

/**
 * Maps normalized sequence progress [0, 1] to the 5 discrete animation phases.
 */
export function resolveSequencePhase(normalizedProgress: number): {
  phase: PreloaderPhase;
  name: string;
  description: string;
} {
  const p = Math.min(1, Math.max(0, normalizedProgress));
  if (p < 0.42) {
    return {
      phase: 1,
      name: 'Phase 1 · Shorter Arch Trace & Sliding Counter',
      description: 'SlidingNumber 00–100 synchronized with 320×430 SVG arch stroke-dashoffset.',
    };
  }
  if (p < 0.64) {
    return {
      phase: 2,
      name: 'Phase 2 · Fill & Viewport Expansion',
      description: 'Counter fades out (0.3s), arch fills with rgb(238, 237, 231) and expands to 100vw × 100vh.',
    };
  }
  if (p < 0.78) {
    return {
      phase: 3,
      name: 'Phase 3 · Logo Entrance (Netflix Profile Glide)',
      description: 'Centered brand mark zooms into crisp focus with power3.out deceleration.',
    };
  }
  if (p < 0.9) {
    return {
      phase: 4,
      name: 'Phase 4 · Logo Flight to Top-Left Header',
      description: 'After 0.4s hold, logo glides to top: 1.5rem; left: 2rem; (~48px–54px height).',
    };
  }
  return {
    phase: 5,
    name: 'Phase 5 · Page Content Reveal',
    description: 'Page elements unblur from filter: blur(14px); opacity: 0 to blur(0px); opacity: 1.',
  };
}

/**
 * Parses numeric props that may be passed either as numbers or stringified JSX literals like "{0.34}" or "-180".
 */
export function parseNumericProp(val: number | string | undefined, fallback: number): number {
  if (typeof val === 'number' && !Number.isNaN(val)) return val;
  if (typeof val === 'string') {
    const cleaned = val.replace(/[{}]/g, '').trim();
    const parsed = Number.parseFloat(cleaned);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return fallback;
}

export interface FlexCardTransformResult {
  flexGrow: number;
  heightScale: number;
  rotateYDeg: number;
  rotateZDeg: number;
  translateYpx: number;
  opacity: number;
  isFocused: boolean;
}

/**
 * Pure layout & optical lens calculation for React Bits FlexCarousel cards.
 */
export function computeFlexCarouselCardStyle(params: {
  index: number;
  activeIndex: number;
  totalItems: number;
  bend?: number;
  cardHeight?: number;
  dispersion?: number;
  lensHeight?: number;
  lensWidth?: number;
  reach?: number;
  squeeze?: number;
  tilt?: number;
  curl?: string;
}): FlexCardTransformResult {
  const {
    index,
    activeIndex,
    totalItems,
    bend = 0.34,
    cardHeight = 0.5,
    dispersion = 0.45,
    lensHeight = 1.18,
    lensWidth = 0.74,
    reach = 0.38,
    squeeze = 0.2,
    tilt = 62,
    curl = 'twist',
  } = params;

  const signedDist = index - activeIndex;
  const absDist = Math.abs(signedDist);
  const maxSpan = Math.max(1, totalItems * reach);
  const normalizedDist = Math.min(1, absDist / maxSpan);
  const lensFalloff = Math.exp(-Math.pow(absDist / Math.max(0.5, reach * 3.2), 2));

  const isFocused = absDist === 0;
  const flexGrow = isFocused
    ? 4.6 * lensWidth + 1.2
    : Math.max(0.55, (1.4 - normalizedDist * squeeze * 2.2) * (1 + lensFalloff * 0.65));

  const heightScale = isFocused
    ? Math.min(1, cardHeight * lensHeight * 1.48)
    : Math.max(0.46, cardHeight + lensFalloff * (lensHeight * 0.28) - normalizedDist * squeeze * 0.25);

  const direction = signedDist === 0 ? 0 : signedDist > 0 ? 1 : -1;
  const rotateYDeg = isFocused ? 0 : -direction * Math.min(28, (tilt * 0.28) * normalizedDist * dispersion);
  const rotateZDeg =
    curl === 'twist' && !isFocused ? direction * Math.min(4.5, bend * 6.5 * normalizedDist) : 0;
  const translateYpx = isFocused ? 0 : Math.round(Math.pow(normalizedDist, 1.35) * bend * 46);
  const opacity = isFocused ? 1 : Math.max(0.72, 1 - normalizedDist * 0.24);

  return {
    flexGrow: Number(flexGrow.toFixed(4)),
    heightScale: Number(heightScale.toFixed(4)),
    rotateYDeg: Number(rotateYDeg.toFixed(3)),
    rotateZDeg: Number(rotateZDeg.toFixed(3)),
    translateYpx,
    opacity: Number(opacity.toFixed(3)),
    isFocused,
  };
}

export interface ResponsiveFlexCarouselConfig {
  isMobile: boolean;
  height: number;
  cardHeight: number;
  gap: number;
  squeeze: number;
  lensWidth: number;
  lensHeight: number;
  tilt: number;
  bend: number;
  reach: number;
  dispersion: number;
}

/**
 * Dynamically adapts FlexCarousel configuration based on viewport width (< 768px for mobile).
 * - Desktop (>= 768px): cardHeight: 0.54, gap: 12, squeeze: 0.2, lensWidth: 0.74, lensHeight: 1.18, tilt: 62, bend: 0.34, reach: 0.38, dispersion: 0.45
 * - Mobile (< 768px): cardHeight: 0.62, gap: 10, squeeze: 0.08, lensWidth: 1.05, lensHeight: 1.05, tilt: 28, bend: 0.22, reach: 0.28, dispersion: 0.35
 */
export function getResponsiveFlexCarouselConfig(
  viewportWidth: number
): ResponsiveFlexCarouselConfig {
  const isMobile = viewportWidth < 768;
  if (isMobile) {
    return {
      isMobile: true,
      height: 460,
      cardHeight: 0.62,
      gap: 10,
      squeeze: 0.08,
      lensWidth: 1.05,
      lensHeight: 1.05,
      tilt: 28,
      bend: 0.22,
      reach: 0.28,
      dispersion: 0.35,
    };
  }
  return {
    isMobile: false,
    height: 540,
    cardHeight: 0.54,
    gap: 12,
    squeeze: 0.2,
    lensWidth: 0.74,
    lensHeight: 1.18,
    tilt: 62,
    bend: 0.34,
    reach: 0.38,
    dispersion: 0.45,
  };
}

/**
 * Computes progressive word-by-word text fill colors from muted stone tint
 * rgba(18, 15, 23, 0.18) to solid obsidian ink #120F17 for scroll progress [0, 1].
 */
export function computeWordFillColors(scrollProgress: number, wordCount: number): string[] {
  const count = Math.max(1, wordCount);
  const p = Math.min(1, Math.max(0, scrollProgress));
  if (p <= 0) {
    return Array.from({ length: count }, () => 'rgba(18, 15, 23, 0.18)');
  }
  if (p >= 1) {
    return Array.from({ length: count }, () => '#120F17');
  }

  const windowSpan = 1 / count;
  return Array.from({ length: count }, (_, idx) => {
    const start = idx * windowSpan * 0.85;
    const local = Math.min(1, Math.max(0, (p - start) / Math.max(0.08, windowSpan * 1.8)));
    if (local >= 0.999) return '#120F17';
    const alpha = Number((0.18 + local * 0.82).toFixed(3));
    return `rgba(18, 15, 23, ${alpha})`;
  });
}

/**
 * Returns compact GlassSurface pill dimensions for the Hero section:
 * 245x56 (borderRadius 28) on mobile (< 768px) and 270x56 (borderRadius 28) on desktop (>= 768px).
 */
export function getCompactGlassSurfaceConfig(viewportWidth: number): {
  width: number;
  height: number;
  borderRadius: number;
} {
  return {
    width: viewportWidth < 768 ? 245 : 270,
    height: 56,
    borderRadius: 28,
  };
}

/**
 * Computes Windows Fluent Reveal relative cursor coordinates (--mouse-x, --mouse-y)
 * and mild 3D perspective tilt clamped strictly to max ±3.5deg on rotateX and rotateY.
 */
export function computeServiceCardTilt(params: {
  clientX: number;
  clientY: number;
  rectLeft: number;
  rectTop: number;
  rectWidth: number;
  rectHeight: number;
  maxDeg?: number;
}): {
  mouseX: number;
  mouseY: number;
  rotateX: number;
  rotateY: number;
  isInside: boolean;
} {
  const {
    clientX,
    clientY,
    rectLeft,
    rectTop,
    rectWidth,
    rectHeight,
    maxDeg = 3.5,
  } = params;

  const mouseX = clientX - rectLeft;
  const mouseY = clientY - rectTop;
  const safeW = Math.max(1, rectWidth);
  const safeH = Math.max(1, rectHeight);

  const isInside =
    mouseX >= 0 && mouseX <= safeW && mouseY >= 0 && mouseY <= safeH;

  if (!isInside) {
    return {
      mouseX: Math.round(mouseX),
      mouseY: Math.round(mouseY),
      rotateX: 0,
      rotateY: 0,
      isInside: false,
    };
  }

  const normX = (mouseX / safeW - 0.5) * 2; // -1 to 1
  const normY = (mouseY / safeH - 0.5) * 2; // -1 to 1

  const rawRotateX = -normY * maxDeg;
  const rawRotateY = normX * maxDeg;

  const clampTilt = (v: number) => Math.max(-maxDeg, Math.min(maxDeg, Number(v.toFixed(3))));

  return {
    mouseX: Math.round(mouseX),
    mouseY: Math.round(mouseY),
    rotateX: clampTilt(rawRotateX),
    rotateY: clampTilt(rawRotateY),
    isInside: true,
  };
}
