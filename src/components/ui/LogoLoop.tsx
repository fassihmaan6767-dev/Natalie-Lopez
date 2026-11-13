import React, { useEffect, useRef, useState } from 'react';

export interface LogoItem {
  node?: React.ReactNode;
  title?: string;
  href?: string;
  src?: string;
  alt?: string;
}

export interface LogoLoopProps {
  logos: Array<LogoItem | React.ReactNode>;
  speed?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  fadeOutWidth?: number;
  scaleOnHover?: boolean;
  draggable?: boolean;
  renderItem?: (item: LogoItem | React.ReactNode, index: number) => React.ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Physics-driven React Bits `LogoLoop` component.
 * Supports smooth momentum, drag/fling interaction (`draggable`), edge fade-out mask (`fadeOut`, `fadeOutWidth`),
 * hover slowdown/pause (`hoverSpeed={0}`), subtle hover scale (`scaleOnHover`), and `prefers-reduced-motion`.
 */
export const LogoLoop: React.FC<LogoLoopProps> = ({
  logos = [],
  speed = 48,
  direction = 'left',
  width = '100%',
  logoHeight = 26,
  gap = 52,
  pauseOnHover,
  hoverSpeed = 0,
  fadeOut = true,
  fadeOutWidth = 0.14,
  scaleOnHover = true,
  draggable = true,
  renderItem,
  ariaLabel = 'Brand partners loop',
  className = '',
  style,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const [copyCount, setCopyCount] = useState<number>(4);
  const [isDraggingState, setIsDraggingState] = useState<boolean>(false);

  const stateRef = useRef({
    offset: 0,
    velocity: 0,
    flingVelocity: 0,
    isHovered: false,
    isDragging: false,
    startX: 0,
    lastX: 0,
    lastTime: 0,
    seqWidth: 0,
  });

  useEffect(() => {
    const updateMeasurements = () => {
      const containerEl = containerRef.current;
      const listEl = listRef.current;
      if (!containerEl || !listEl) return;

      const seqW = listEl.getBoundingClientRect().width;
      const containerW = containerEl.getBoundingClientRect().width;
      if (seqW > 0) {
        stateRef.current.seqWidth = seqW;
        const needed = Math.max(3, Math.ceil((containerW * 2.5) / seqW) + 1);
        setCopyCount((prev) => (prev !== needed ? needed : prev));
      }
    };

    updateMeasurements();
    const ro = new ResizeObserver(updateMeasurements);
    if (containerRef.current) ro.observe(containerRef.current);
    if (listRef.current) ro.observe(listRef.current);

    return () => ro.disconnect();
  }, [logos.length, gap, logoHeight]);

  useEffect(() => {
    const trackEl = trackRef.current;
    const containerEl = containerRef.current;
    if (!trackEl || !containerEl) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const sign = direction === 'right' || direction === 'down' ? -1 : 1;
    const baseTargetVel = prefersReducedMotion ? 0 : Math.abs(speed) * sign;

    const effectiveHoverSpeed =
      hoverSpeed !== undefined ? hoverSpeed : pauseOnHover ? 0 : Math.abs(speed);
    const hoverTargetVel = prefersReducedMotion ? 0 : effectiveHoverSpeed * sign;

    stateRef.current.velocity = baseTargetVel;

    let rafId = 0;
    let lastTs: number | null = null;

    const animate = (ts: number) => {
      if (lastTs === null) lastTs = ts;
      const dt = Math.min(0.064, Math.max(0, (ts - lastTs) / 1000));
      lastTs = ts;

      const st = stateRef.current;
      const seqW = st.seqWidth || listRef.current?.getBoundingClientRect().width || 0;

      if (seqW > 0) {
        if (!st.isDragging) {
          const target = st.isHovered ? hoverTargetVel : baseTargetVel;
          const easeFactor = 1 - Math.exp(-dt / 0.22);
          st.velocity += (target - st.velocity) * easeFactor;

          if (Math.abs(st.flingVelocity) > 0.5) {
            st.flingVelocity *= Math.exp(-dt * 4.2);
          } else {
            st.flingVelocity = 0;
          }

          st.offset += (st.velocity + st.flingVelocity) * dt;
        }

        st.offset = ((st.offset % seqW) + seqW) % seqW;
        trackEl.style.transform = `translate3d(${-st.offset}px, 0, 0)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [speed, direction, hoverSpeed, pauseOnHover]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable || e.button > 0) return;
    const st = stateRef.current;
    st.isDragging = true;
    st.flingVelocity = 0;
    st.startX = e.clientX;
    st.lastX = e.clientX;
    st.lastTime = performance.now();
    setIsDraggingState(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = stateRef.current;
    if (!draggable || !st.isDragging) return;
    const now = performance.now();
    const dx = e.clientX - st.lastX;
    const dt = Math.max(1, now - st.lastTime) / 1000;

    st.offset -= dx;
    st.flingVelocity = (-dx / dt) * 0.65;
    st.lastX = e.clientX;
    st.lastTime = now;
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = stateRef.current;
    if (!st.isDragging) return;
    st.isDragging = false;
    setIsDraggingState(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const fadeStop = `${Math.round(Math.min(0.45, Math.max(0.02, fadeOutWidth)) * 100)}%`;
  const maskGradient = fadeOut
    ? `linear-gradient(to right, transparent 0%, black ${fadeStop}, black ${
        100 - Math.round(Math.min(0.45, Math.max(0.02, fadeOutWidth)) * 100)
      }%, transparent 100%)`
    : undefined;

  const renderSingleLogo = (item: LogoItem | React.ReactNode, idx: number) => {
    if (renderItem) {
      return renderItem(item, idx);
    }
    if (
      item &&
      typeof item === 'object' &&
      !React.isValidElement(item) &&
      ('node' in item || 'src' in item || 'title' in item)
    ) {
      const logoObj = item as LogoItem;
      const content = logoObj.node ? (
        logoObj.node
      ) : logoObj.src ? (
        <img
          src={logoObj.src}
          alt={logoObj.alt || logoObj.title || ''}
          style={{ height: `${logoHeight}px`, width: 'auto' }}
          className="object-contain select-none pointer-events-none"
          draggable={false}
        />
      ) : (
        <span>{logoObj.title}</span>
      );

      if (logoObj.href) {
        return (
          <a
            href={logoObj.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={logoObj.title || logoObj.alt}
            className="inline-flex items-center"
          >
            {content}
          </a>
        );
      }
      return content;
    }

    return item as React.ReactNode;
  };

  return (
    <div
      ref={containerRef}
      data-component="@react-bits/LogoLoop"
      data-direction={direction}
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={() => {
        stateRef.current.isHovered = true;
      }}
      onMouseLeave={() => {
        stateRef.current.isHovered = false;
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrCancel}
      onPointerCancel={handlePointerUpOrCancel}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        maskImage: maskGradient,
        WebkitMaskImage: maskGradient,
        ...style,
      }}
      className={`logoloop ${draggable ? 'logoloop--draggable' : ''} ${
        isDraggingState ? 'logoloop--dragging' : ''
      } ${scaleOnHover ? 'logoloop--scale-hover' : ''} ${className}`.trim()}
    >
      <div ref={trackRef} className="logoloop__track">
        {Array.from({ length: copyCount }, (_, copyIdx) => (
          <ul
            key={copyIdx}
            ref={copyIdx === 0 ? listRef : undefined}
            aria-hidden={copyIdx > 0 ? 'true' : undefined}
            style={{ gap: `${gap}px`, paddingRight: `${gap}px` }}
            className="logoloop__list"
          >
            {logos.map((item, idx) => (
              <li
                key={`${copyIdx}-${idx}`}
                style={{ minHeight: `${logoHeight}px` }}
                className="logoloop__item"
              >
                {renderSingleLogo(item, idx)}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};

export default LogoLoop;
