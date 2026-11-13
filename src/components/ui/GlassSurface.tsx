import React, { useId, useMemo } from 'react';
import { parseNumericProp } from '../../utils/preloaderMath';

export interface GlassSurfaceProps {
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  borderWidth?: number | string;
  brightness?: number | string;
  opacity?: number | string;
  blur?: number | string;
  displace?: number | string;
  distortionScale?: number | string;
  redOffset?: number | string;
  greenOffset?: number | string;
  blueOffset?: number | string;
  saturation?: number | string;
  refraction?: boolean;
  renderer?: 'auto' | 'svg' | 'css';
  className?: string;
}

/**
 * React Bits `GlassSurface` component (`components/ui/GlassSurface`)
 * Provides liquid glass surface refraction, SVG displacement map & chromatic distortion
 * (red/green/blue channel offsets) combined with optical backdrop blur and specular borders.
 */
export const GlassSurface: React.FC<GlassSurfaceProps> = ({
  children,
  width = 340,
  height = 76,
  borderRadius = 38,
  borderWidth = 0.07,
  brightness = 50,
  opacity = 0.93,
  blur = 11,
  displace = 0.5,
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  saturation = 1.1,
  refraction = true,
  renderer = 'auto',
  className = '',
}) => {
  const rawId = useId();
  const filterId = `glass-surface-refraction-${rawId.replace(/:/g, '')}`;

  const w = parseNumericProp(width, 340);
  const h = parseNumericProp(height, 76);
  const r = parseNumericProp(borderRadius, 38);
  const bw = parseNumericProp(borderWidth, 0.07);
  const br = parseNumericProp(brightness, 50);
  const op = parseNumericProp(opacity, 0.93);
  const bl = parseNumericProp(blur, 11);
  const disp = parseNumericProp(displace, 0.5);
  const dScale = parseNumericProp(distortionScale, -180);
  const rOff = parseNumericProp(redOffset, 0);
  const gOff = parseNumericProp(greenOffset, 10);
  const bOff = parseNumericProp(blueOffset, 20);
  const sat = parseNumericProp(saturation, 1.1);

  // Build SVG displacement map data URI for liquid lens edge refraction
  const displacementMapUri = useMemo(() => {
    const innerPad = Math.max(4, Math.round(Math.min(w, h) * bw));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <defs>
        <linearGradient id="gx" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#000080"/>
          <stop offset="50%" stop-color="#808080"/>
          <stop offset="100%" stop-color="#FF0080"/>
        </linearGradient>
        <linearGradient id="gy" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#800080"/>
          <stop offset="50%" stop-color="#808080"/>
          <stop offset="100%" stop-color="#80FF80"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" rx="${r}" fill="url(#gx)"/>
      <rect width="${w}" height="${h}" rx="${r}" fill="url(#gy)" style="mix-blend-mode:overlay"/>
      <rect x="${innerPad}" y="${innerPad}" width="${Math.max(10, w - innerPad * 2)}" height="${Math.max(10, h - innerPad * 2)}" rx="${Math.max(4, r - innerPad)}" fill="#808080" opacity="${op}"/>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }, [w, h, r, bw, op]);

  return (
    <div
      data-testid="glass-surface-pill"
      data-renderer={renderer}
      data-refraction={refraction ? 'true' : 'false'}
      style={{
        width: `${w}px`,
        maxWidth: '100%',
        height: `${h}px`,
        borderRadius: `${r}px`,
        backdropFilter: `blur(${bl}px) saturate(${Math.round(sat * 100)}%) brightness(${Math.max(92, 55 + br)}%)`,
        WebkitBackdropFilter: `blur(${bl}px) saturate(${Math.round(sat * 100)}%) brightness(${Math.max(92, 55 + br)}%)`,
        background: `linear-gradient(135deg, rgba(255, 255, 255, ${Math.min(0.26, op * 0.22)}) 0%, rgba(255, 255, 255, 0.08) 55%, rgba(18, 15, 23, 0.28) 100%)`,
        boxShadow: `
          0 16px 38px -8px rgba(0, 0, 0, 0.36),
          inset 0 1px 1.5px rgba(255, 255, 255, 0.45),
          inset 0 -1px 1.5px rgba(255, 255, 255, 0.14),
          inset 2px 0 6px rgba(80, 175, 255, 0.12),
          inset -2px 0 6px rgba(255, 120, 100, 0.1)
        `,
        border: '1px solid rgba(255, 255, 255, 0.26)',
      }}
      className={`relative overflow-hidden flex items-center justify-center select-none ${className}`}
    >
      {/* Hidden SVG Chromatic Refraction Filter Definition */}
      {refraction && (
        <svg
          aria-hidden="true"
          className="absolute w-0 h-0 pointer-events-none opacity-0"
           focusable="false"
        >
          <defs>
            <filter
              id={filterId}
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              colorInterpolationFilters="sRGB"
            >
              <feImage
                href={displacementMapUri}
                x="0"
                y="0"
                width={w}
                height={h}
                preserveAspectRatio="none"
                result="dispMap"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="dispMap"
                scale={dScale + rOff}
                xChannelSelector="R"
                yChannelSelector="G"
                result="dispRed"
              />
              <feColorMatrix
                in="dispRed"
                type="matrix"
                values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="redOut"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="dispMap"
                scale={dScale + gOff}
                xChannelSelector="R"
                yChannelSelector="G"
                result="dispGreen"
              />
              <feColorMatrix
                in="dispGreen"
                type="matrix"
                values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="greenOut"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="dispMap"
                scale={dScale + bOff}
                xChannelSelector="R"
                yChannelSelector="G"
                result="dispBlue"
              />
              <feColorMatrix
                in="dispBlue"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                result="blueOut"
              />
              <feBlend in="redOut" in2="greenOut" mode="screen" result="rgOut" />
              <feBlend in="rgOut" in2="blueOut" mode="screen" result="rgbOut" />
              <feGaussianBlur in="rgbOut" stdDeviation={disp} />
            </filter>
          </defs>
        </svg>
      )}

      {/* Subtle chromatic rim sheen */}
      <div
        aria-hidden="true"
        style={{ borderRadius: `${r}px` }}
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/20 opacity-80"
      />

      {/* Inner Content */}
      <div className="relative z-10 w-full flex items-center">{children}</div>
    </div>
  );
};

export default GlassSurface;
