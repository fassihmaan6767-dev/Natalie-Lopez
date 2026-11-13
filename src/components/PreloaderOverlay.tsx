import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import {
  generateArchPath,
  calculateStrokeDashoffset,
  computeViewportExpansion,
  PreloaderPhase,
} from '../utils/preloaderMath';
import { BRAND_LOGO_URL, FALLBACK_LOGO_DATA_URI } from '../data/portfolioData';
import { SlidingNumber } from './SlidingNumber';

gsap.registerPlugin(Flip);

interface PreloaderOverlayProps {
  isCompleted: boolean;
  replayTrigger: number;
  routeTransitionTrigger: number;
  targetPhaseJump: PreloaderPhase | null;
  headerLogoImgRef: React.RefObject<HTMLImageElement | null>;
  pageContentRef: React.RefObject<HTMLDivElement | null>;
  onPhaseChange: (phase: PreloaderPhase) => void;
  onRouteMidpoint?: () => void;
  onSequenceComplete: () => void;
}

const ARCH_VIEWBOX_W = 320;
const ARCH_VIEWBOX_H = 430;
const ARCH_STROKE_INSET = 0;

export const PreloaderOverlay: React.FC<PreloaderOverlayProps> = ({
  isCompleted,
  replayTrigger,
  routeTransitionTrigger,
  targetPhaseJump,
  headerLogoImgRef,
  pageContentRef,
  onPhaseChange,
  onRouteMidpoint,
  onSequenceComplete,
}) => {
  const archGeometry = React.useMemo(
    () => generateArchPath(ARCH_VIEWBOX_W, ARCH_VIEWBOX_H, ARCH_STROKE_INSET),
    []
  );

  const [counterNumber, setCounterNumber] = useState<number>(isCompleted ? 100 : 0);
  const [logoSrc, setLogoSrc] = useState<string>(BRAND_LOGO_URL);
  const [overlayFinished, setOverlayFinished] = useState<boolean>(isCompleted);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const archFrameRef = useRef<HTMLDivElement | null>(null);
  const archMorphSurfaceRef = useRef<HTMLDivElement | null>(null);
  const svgPathRef = useRef<SVGPathElement | null>(null);
  const counterContainerRef = useRef<HTMLDivElement | null>(null);
  const counterRollRef = useRef<HTMLDivElement | null>(null);
  const floatingLogoRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const onPhaseChangeRef = useRef(onPhaseChange);
  onPhaseChangeRef.current = onPhaseChange;
  const onRouteMidpointRef = useRef(onRouteMidpoint);
  onRouteMidpointRef.current = onRouteMidpoint;
  const onSequenceCompleteRef = useRef(onSequenceComplete);
  onSequenceCompleteRef.current = onSequenceComplete;

  const lastTrackedIntRef = useRef<number>(-1);

  const handleLogoError = useCallback(() => {
    setLogoSrc((prev) => (prev !== FALLBACK_LOGO_DATA_URI ? FALLBACK_LOGO_DATA_URI : prev));
  }, []);

  const syncStrokeToProgress = useCallback(
    (progressVal: number) => {
      const rounded = Math.min(100, Math.max(0, Math.round(progressVal)));
      if (lastTrackedIntRef.current !== rounded) {
        lastTrackedIntRef.current = rounded;
        setCounterNumber(rounded);
      }

      if (svgPathRef.current) {
        const measuredLen =
          typeof svgPathRef.current.getTotalLength === 'function'
            ? svgPathRef.current.getTotalLength()
            : archGeometry.perimeter;
        const offset = calculateStrokeDashoffset(progressVal, measuredLen);
        svgPathRef.current.style.strokeDasharray = `${measuredLen}`;
        svgPathRef.current.style.strokeDashoffset = `${offset}`;
      }
    },
    [archGeometry.perimeter]
  );

  const buildAndRunTimeline = useCallback(
    (jumpToPhase: PreloaderPhase | null = null) => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      const overlayEl = overlayRef.current;
      const archFrameEl = archFrameRef.current;
      const archMorphEl = archMorphSurfaceRef.current;
      const svgPathEl = svgPathRef.current;
      const counterEl = counterContainerRef.current;
      const floatingLogoEl = floatingLogoRef.current;
      const pageContentEl = pageContentRef.current;
      const headerImgEl = headerLogoImgRef.current;

      if (
        !overlayEl ||
        !archFrameEl ||
        !archMorphEl ||
        !svgPathEl ||
        !counterEl ||
        !floatingLogoEl ||
        !pageContentEl
      ) {
        return;
      }

      setOverlayFinished(false);
      overlayEl.style.pointerEvents = 'auto';
      overlayEl.style.visibility = 'visible';

      gsap.set(overlayEl, {
        autoAlpha: 1,
        backgroundColor: '#000000',
      });

      const measuredLen =
        typeof svgPathEl.getTotalLength === 'function'
          ? svgPathEl.getTotalLength()
          : archGeometry.perimeter;

      gsap.set(svgPathEl, {
        strokeDasharray: measuredLen,
        strokeDashoffset: measuredLen,
        fillOpacity: 0,
        strokeOpacity: 1,
      });

      gsap.set(archFrameEl, {
        autoAlpha: 1,
        scale: 1,
      });

      gsap.set(archMorphEl, {
        opacity: 0,
        scaleX: 1,
        scaleY: 1,
        borderTopLeftRadius: '160px',
        borderTopRightRadius: '160px',
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px',
      });

      gsap.set(counterEl, {
        opacity: 1,
        y: 0,
      });
      if (counterRollRef.current) {
        gsap.set(counterRollRef.current, {
          yPercent: 0,
          opacity: 1,
        });
      }

      gsap.set(floatingLogoEl, {
        opacity: 0,
        scale: 0.78,
        x: 0,
        y: 14,
        filter: 'blur(8px)',
      });

      gsap.set(pageContentEl, {
        filter: 'blur(14px)',
        opacity: 0,
        y: 20,
      });

      if (headerImgEl) {
        gsap.set(headerImgEl, { opacity: 0 });
      }

      syncStrokeToProgress(0);
      onPhaseChangeRef.current(1);

      const proxy = { count: 0 };

      const tl = gsap.timeline({
        defaults: { overwrite: 'auto' },
      });

      // =====================================================================
      // PHASE 1: Shorter Arch Mirror Trace & SlidingNumber (00 to 100)
      // =====================================================================
      tl.addLabel('phase1', 0);
      tl.to(
        proxy,
        {
          count: 100,
          duration: 1.85,
          ease: 'power2.inOut',
          onStart: () => onPhaseChangeRef.current(1),
          onUpdate: () => {
            syncStrokeToProgress(proxy.count);
          },
        },
        'phase1'
      );

      // =====================================================================
      // PHASE 2: Hold 0.15s at 100, then roll 3-digit odometer downward (translateY(105%), opacity: 0, 0.45s)
      // while Arch Fills & Expands
      // =====================================================================
      tl.addLabel('phase2', '+=0.15');

      tl.to(
        counterRollRef.current || counterEl,
        {
          yPercent: 105,
          opacity: 0,
          duration: 0.45,
          ease: 'power3.inOut',
          onStart: () => onPhaseChangeRef.current(2),
        },
        'phase2'
      );

      tl.to(
        svgPathEl,
        {
          fillOpacity: 1,
          duration: 0.42,
          ease: 'power2.inOut',
        },
        'phase2'
      );

      tl.to(
        archMorphEl,
        {
          opacity: 1,
          duration: 0.42,
          ease: 'power2.inOut',
        },
        'phase2'
      );

      tl.addLabel('phase2Expand', '>-0.04');
      tl.to(
        svgPathEl,
        {
          strokeOpacity: 0,
          duration: 0.22,
          ease: 'power2.out',
        },
        'phase2Expand'
      );

      tl.to(
        archMorphEl,
        {
          scaleX: () => {
            const rect = archFrameEl.getBoundingClientRect();
            const exp = computeViewportExpansion(
              window.innerWidth,
              window.innerHeight,
              rect.width || 260,
              rect.height || 350
            );
            return Math.max(exp.scaleX * 1.06, 1.5);
          },
          scaleY: () => {
            const rect = archFrameEl.getBoundingClientRect();
            const exp = computeViewportExpansion(
              window.innerWidth,
              window.innerHeight,
              rect.width || 260,
              rect.height || 350
            );
            return Math.max(exp.scaleY * 1.06, 1.5);
          },
          borderTopLeftRadius: '0px',
          borderTopRightRadius: '0px',
          duration: 0.82,
          ease: 'expo.inOut',
          onComplete: () => {
            gsap.set(overlayEl, { backgroundColor: 'rgb(238, 237, 231)' });
          },
        },
        'phase2Expand'
      );

      // =====================================================================
      // PHASE 3: Logo Entrance (Netflix Profile Glide)
      // =====================================================================
      tl.addLabel('phase3', '>-0.15');
      tl.to(
        floatingLogoEl,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.78,
          ease: 'power3.out',
          onStart: () => onPhaseChangeRef.current(3),
        },
        'phase3'
      );

      // =====================================================================
      // PHASE 4: Logo Flight to Top-Left Header (0.4s pause -> top: 1.5rem; left: 2rem; ~38px)
      // =====================================================================
      tl.addLabel('phase4', '+=0.4');
      tl.to(
        floatingLogoEl,
        {
          x: () => {
            if (!headerImgEl) return -window.innerWidth * 0.38;
            const targetRect = headerImgEl.getBoundingClientRect();
            const currentCenterX = window.innerWidth / 2;
            const targetCenterX = targetRect.left + targetRect.width / 2;
            return targetCenterX - currentCenterX;
          },
          y: () => {
            if (!headerImgEl) return -window.innerHeight * 0.43;
            const targetRect = headerImgEl.getBoundingClientRect();
            const currentCenterY = window.innerHeight / 2;
            const targetCenterY = targetRect.top + targetRect.height / 2;
            return targetCenterY - currentCenterY;
          },
          scale: () => {
            if (!headerImgEl || !floatingLogoEl) return 0.32;
            const targetRect = headerImgEl.getBoundingClientRect();
            const baseHeight = floatingLogoEl.offsetHeight || 240;
            return Math.max(0.16, Math.min(0.85, targetRect.height / baseHeight));
          },
          duration: 0.92,
          ease: 'expo.inOut',
          onStart: () => onPhaseChangeRef.current(4),
        },
        'phase4'
      );

      // =====================================================================
      // PHASE 5: Page Content Reveal (filter: blur(14px) -> blur(0px), opacity: 0 -> 1)
      // =====================================================================
      tl.addLabel('phase5', '>-0.25');
      tl.to(
        headerImgEl,
        {
          opacity: 1,
          duration: 0.25,
          ease: 'power2.out',
          onStart: () => onPhaseChangeRef.current(5),
        },
        'phase5'
      );

      tl.to(
        overlayEl,
        {
          autoAlpha: 0,
          duration: 0.5,
          ease: 'power2.inOut',
          onStart: () => {
            overlayEl.style.pointerEvents = 'none';
          },
          onComplete: () => {
            overlayEl.style.visibility = 'hidden';
            setOverlayFinished(true);
            onSequenceCompleteRef.current();
          },
        },
        'phase5'
      );

      tl.to(
        pageContentEl,
        {
          filter: 'blur(0px)',
          opacity: 1,
          y: 0,
          duration: 0.95,
          ease: 'expo.out',
          clearProps: 'filter,transform,willChange',
        },
        'phase5'
      );

      timelineRef.current = tl;

      if (jumpToPhase !== null && jumpToPhase === 5) {
        tl.progress(1);
        overlayEl.style.pointerEvents = 'none';
        overlayEl.style.visibility = 'hidden';
        setOverlayFinished(true);
        onPhaseChangeRef.current(5);
        onSequenceCompleteRef.current();
      }
    },
    [archGeometry.perimeter, headerLogoImgRef, pageContentRef, syncStrokeToProgress]
  );

  /**
   * B. Route Changes (Reverse Mirror Page Transition):
   * Screen contracts back into the shorter arch mirror, fades to pitch black (#000000),
   * switches the route, and smoothly expands back out to reveal the new page.
   */
  const runReverseMirrorRouteTransition = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const overlayEl = overlayRef.current;
    const archFrameEl = archFrameRef.current;
    const archMorphEl = archMorphSurfaceRef.current;
    const svgPathEl = svgPathRef.current;
    const counterEl = counterContainerRef.current;
    const floatingLogoEl = floatingLogoRef.current;
    const pageContentEl = pageContentRef.current;

    if (!overlayEl || !archFrameEl || !archMorphEl || !svgPathEl || !pageContentEl) return;

    setOverlayFinished(false);
    overlayEl.style.pointerEvents = 'auto';
    overlayEl.style.visibility = 'visible';

    const rect = archFrameEl.getBoundingClientRect();
    const exp = computeViewportExpansion(
      window.innerWidth,
      window.innerHeight,
      rect.width || 260,
      rect.height || 350
    );
    const fullScaleX = Math.max(exp.scaleX * 1.06, 1.5);
    const fullScaleY = Math.max(exp.scaleY * 1.06, 1.5);

    if (counterEl) gsap.set(counterEl, { opacity: 0 });
    if (floatingLogoEl) gsap.set(floatingLogoEl, { opacity: 0 });

    gsap.set(overlayEl, { autoAlpha: 1, backgroundColor: '#000000' });
    gsap.set(archMorphEl, {
      opacity: 1,
      scaleX: fullScaleX,
      scaleY: fullScaleY,
      borderTopLeftRadius: '0px',
      borderTopRightRadius: '0px',
    });
    gsap.set(svgPathEl, { strokeOpacity: 1, fillOpacity: 0, strokeDashoffset: 0 });

    const tl = gsap.timeline();

    // 1. Blur out current page & contract viewport back into the arch mirror
    tl.to(
      pageContentEl,
      {
        filter: 'blur(14px)',
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
      },
      0
    );

    tl.to(
      archMorphEl,
      {
        scaleX: 1,
        scaleY: 1,
        borderTopLeftRadius: '160px',
        borderTopRightRadius: '160px',
        duration: 0.65,
        ease: 'expo.inOut',
      },
      0.05
    );

    // 2. Fade arch interior to black, switch route at midpoint
    tl.to(
      archMorphEl,
      {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.inOut',
        onComplete: () => {
          onRouteMidpointRef.current?.();
        },
      },
      '>-0.05'
    );

    // 3. Re-fill arch with rgb(238, 237, 231) and expand back out to reveal new route
    tl.to(
      archMorphEl,
      {
        opacity: 1,
        duration: 0.28,
        ease: 'power2.out',
      },
      '+=0.08'
    );

    tl.to(
      archMorphEl,
      {
        scaleX: fullScaleX,
        scaleY: fullScaleY,
        borderTopLeftRadius: '0px',
        borderTopRightRadius: '0px',
        duration: 0.68,
        ease: 'expo.inOut',
      },
      '>-0.05'
    );

    tl.to(
      pageContentEl,
      {
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'expo.out',
        clearProps: 'filter,transform,willChange',
      },
      '>-0.25'
    );

    tl.to(
      overlayEl,
      {
        autoAlpha: 0,
        duration: 0.35,
        ease: 'power2.out',
        onComplete: () => {
          overlayEl.style.pointerEvents = 'none';
          overlayEl.style.visibility = 'hidden';
          setOverlayFinished(true);
          onSequenceCompleteRef.current();
        },
      },
      '<'
    );

    timelineRef.current = tl;
  }, [pageContentRef]);

  useEffect(() => {
    if (routeTransitionTrigger > 0) {
      runReverseMirrorRouteTransition();
    }
  }, [routeTransitionTrigger, runReverseMirrorRouteTransition]);

  useEffect(() => {
    if (isCompleted && replayTrigger === 0 && targetPhaseJump === null) {
      setOverlayFinished(true);
      if (overlayRef.current) {
        gsap.set(overlayRef.current, { autoAlpha: 0 });
        overlayRef.current.style.pointerEvents = 'none';
        overlayRef.current.style.visibility = 'hidden';
      }
      if (pageContentRef.current) {
        gsap.set(pageContentRef.current, {
          opacity: 1,
          clearProps: 'filter,transform,willChange',
        });
      }
      if (headerLogoImgRef.current) {
        gsap.set(headerLogoImgRef.current, { opacity: 1 });
      }
      onPhaseChangeRef.current(5);
      return;
    }

    buildAndRunTimeline(targetPhaseJump);

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [replayTrigger, targetPhaseJump, buildAndRunTimeline]);

  return (
    <div
      ref={overlayRef}
      data-testid="preloader-overlay"
      aria-hidden={overlayFinished ? 'true' : 'false'}
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black ${
        overlayFinished ? 'pointer-events-none invisible' : ''
      }`}
    >
      {/* Shorter Arch Mirror (approx 1:1.35 proportion, viewBox="0 0 320 430", arch radius 160px) */}
      <div
        ref={archFrameRef}
        data-testid="preloader-arch-frame"
        className="relative flex items-center justify-center w-[240px] h-[322px] sm:w-[280px] sm:h-[376px] md:w-[320px] md:h-[430px]"
      >
        {/* Interior Morphing Surface (fills with rgb(238, 237, 231) and expands to 100vw x 100vh) */}
        <div
          ref={archMorphSurfaceRef}
          data-testid="preloader-arch-morph"
          style={{
            backgroundColor: 'rgb(238, 237, 231)',
            borderTopLeftRadius: '160px',
            borderTopRightRadius: '160px',
            borderBottomLeftRadius: '0px',
            borderBottomRightRadius: '0px',
          }}
          className="absolute inset-0 opacity-0 will-change-transform"
        />

        {/* Crisp white SVG path outline (stroke-width: 1.5px, viewBox="0 0 320 430") */}
        <svg
          viewBox={`0 0 ${ARCH_VIEWBOX_W} ${ARCH_VIEWBOX_H}`}
          preserveAspectRatio="xMidYMid meet"
          className="relative z-10 w-full h-full block overflow-visible"
          aria-label="Shorter architectural arch mirror preloader path"
        >
          <path
            ref={svgPathRef}
            data-testid="preloader-arch-path"
            d={archGeometry.d}
            fill="rgb(238, 237, 231)"
            fillOpacity={0}
            stroke="#FFFFFF"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Phase 3 & 4: Centered Brand Logo Stage (Netflix Profile Glide -> Header Flight) */}
      <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div
          ref={floatingLogoRef}
          data-testid="preloader-floating-logo"
          data-flip-id="brand-logo"
          className="flex items-center justify-center h-[200px] sm:h-[250px] md:h-[290px] w-auto opacity-0 will-change-transform"
        >
          <img
            src={logoSrc}
            onError={handleLogoError}
            referrerPolicy="no-referrer"
            alt="Natalie Lopez — Indretningsarkitekt & Boligstylist"
            className="h-full w-auto object-contain select-none"
          />
        </div>
      </div>

      {/* Phase 1: Lusion-Style 3-Digit Odometer Counter (000 -> 100) */}
      <div
        ref={counterContainerRef}
        data-testid="preloader-counter"
        className="fixed bottom-6 left-6 sm:bottom-8 sm:left-10 z-30 pointer-events-none select-none overflow-hidden"
      >
        <div ref={counterRollRef} data-testid="preloader-counter-roll" className="will-change-transform">
          <SlidingNumber number={counterNumber} padStart padDigits={3} />
        </div>
      </div>
    </div>
  );
};
