import React, { useMemo } from 'react';

interface GradualBlurProps {
  height?: string;
  position?: 'top' | 'bottom';
  tint?: string;
  layers?: number;
  className?: string;
}

/**
 * Implementation of `@react-bits/GradualBlur` fixed at the top of the viewport.
 * Default props match specification:
 * `position="top"`, `height="7rem"`, `tint="rgba(238, 237, 231, 0.45)"`, `layers={8}`.
 */
export const GradualBlur: React.FC<GradualBlurProps> = ({
  height = '7.5rem',
  position = 'top',
  tint = 'rgba(238, 237, 231, 0.55)',
  layers = 8,
  className = '',
}) => {
  const isTop = position === 'top';
  const gradientDirection = isTop ? 'to bottom' : 'to top';

  const blurSteps = useMemo(() => {
    const count = Math.max(2, layers);
    return Array.from({ length: count }, (_, idx) => {
      const progress = idx / count;
      const nextProgress = (idx + 1.4) / count;
      const maxBlur = 18;
      const blurPx = Math.max(1.5, Number((maxBlur * (1 - progress * 0.85)).toFixed(1)));
      const stopStart = `${Math.round(progress * 80)}%`;
      const stopEnd = `${Math.min(100, Math.round(nextProgress * 100))}%`;
      return { blur: `${blurPx}px`, stopStart, stopEnd };
    });
  }, [layers]);

  return (
    <div
      data-testid="gradual-blur-top"
      data-component="@react-bits/GradualBlur"
      data-position={position}
      data-layers={layers}
      aria-hidden="true"
      style={{
        height,
        top: isTop ? 0 : undefined,
        bottom: !isTop ? 0 : undefined,
        background: `linear-gradient(${gradientDirection}, ${tint} 0%, rgba(238, 237, 231, 0.18) 68%, rgba(238, 237, 231, 0) 100%)`,
      }}
      className={`fixed left-0 right-0 z-40 pointer-events-none select-none overflow-hidden ${className}`}
    >
      {blurSteps.map((step, index) => {
        const maskImage = `linear-gradient(${gradientDirection}, rgba(0,0,0,1) ${step.stopStart}, rgba(0,0,0,0) ${step.stopEnd})`;
        return (
          <div
            key={index}
            style={{
              backdropFilter: `blur(${step.blur})`,
              WebkitBackdropFilter: `blur(${step.blur})`,
              maskImage,
              WebkitMaskImage: maskImage,
            }}
            className="absolute inset-0"
          />
        );
      })}
    </div>
  );
};
