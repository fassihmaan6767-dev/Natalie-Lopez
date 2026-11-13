'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AppPath, normalizeAppPath } from '../utils/consentAndBooking';
import {
  calculateStrokeDashoffset,
  generateArchPath,
} from '../utils/preloaderMath';
import { useSmoothScroll } from '../components/layout/SmoothScrollProvider';

gsap.registerPlugin(ScrollTrigger);

const ARCH_VIEWBOX_W = 320;
const ARCH_VIEWBOX_H = 430;

/**
 * Exact cubic-bezier evaluator for GSAP custom easing curves:
 * - Squeeze: [0.76, 0, 0.24, 1]
 * - Expand:  [0.16, 1, 0.3, 1]
 */
function createCubicBezierEase(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  const sampleCurveX = (t: number) => ((1 - 3 * x2 + 3 * x1) * t * t * t) + ((3 * x2 - 6 * x1) * t * t) + (3 * x1 * t);
  const sampleCurveY = (t: number) => ((1 - 3 * y2 + 3 * y1) * t * t * t) + ((3 * y2 - 6 * y1) * t * t) + (3 * y1 * t);
  const sampleCurveDerivativeX = (t: number) => (3 * (1 - 3 * x2 + 3 * x1) * t * t) + (2 * (3 * x2 - 6 * x1) * t) + (3 * x1);

  return (x: number): number => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t2 = x;
    for (let i = 0; i < 8; i++) {
      const xEst = sampleCurveX(t2) - x;
      if (Math.abs(xEst) < 1e-6) break;
      const d = sampleCurveDerivativeX(t2);
      if (Math.abs(d) < 1e-6) break;
      t2 -= xEst / d;
    }
    return sampleCurveY(Math.min(1, Math.max(0, t2)));
  };
}

const SQUEEZE_EASE = createCubicBezierEase(0.76, 0, 0.24, 1);
const EXPAND_EASE = createCubicBezierEase(0.16, 1, 0.3, 1);

interface NavigateOptions {
  topic?: string;
  hash?: string;
}

interface PageTransitionContextValue {
  currentPath: AppPath;
  bookingTopic: string;
  setBookingTopic: (topic: string) => void;
  isTransitioning: boolean;
  hasNavigatedInApp: boolean;
  navigate: (href: string, options?: NavigateOptions) => void;
}

const PageTransitionContext = createContext<PageTransitionContextValue>({
  currentPath: '/',
  bookingTopic: 'Renovering',
  setBookingTopic: () => {},
  isTransitioning: false,
  hasNavigatedInApp: false,
  navigate: () => {},
});

export const usePageTransition = () => useContext(PageTransitionContext);

/**
 * 3. "SQUEEZE & EXPAND" ARCH MIRROR PAGE TRANSITION
 * Applies across all internal `<TransitionLink>` clicks (`/`, `/booking`, `/cookiepolitik`, `/persondatapolitik`, `/handelsbetingelser`, and back-to-home):
 * 1. Phase 1 — Smooth Reverse Squeeze (100vw × 100vh -> Centered Arch Window Frame, 0.55s):
 *    Fullscreen pitch-black `#000000` backdrop (`fixed inset-0 z-[200]`) behind a centered morphing `#EEEDE7` viewport frame
 *    that starts at full screen (`width: 100vw`, `height: 100vh`, `borderRadius: '0px'`) and smoothly zooms out / squeezes down
 *    (`ease: [0.76, 0, 0.24, 1]`) into the centered architectural arch mirror silhouette (`260px × 350px` on mobile / `320px × 430px` on desktop,
 *    `borderRadius: '160px 160px 0px 0px'`).
 * 2. Phase 2 — `00` -> `100` Counter & Outline Trace (0.75s):
 *    Once squeezed into the centered arch frame on the black screen, fade in the bold bottom-left counter (`00` -> `100`)
 *    and trace the crisp white SVG arch outline (`viewBox="0 0 320 430"`, `stroke="#FFFFFF"`, `strokeWidth="1.5"`) from `0%` to `100%`
 *    while the arch interior solidifies to `#EEEDE7`. At `100%`, push route & reset scroll (`lenis?.scrollTo(0, { immediate: true })` + `window.scrollTo(0, 0)`).
 * 3. Phase 3 — Outward Expansion (100% Arch Frame -> 100vw × 100vh, 0.6s):
 *    Fade out the counter (`opacity: 0`) and expand the `#EEEDE7`-filled arch mirror smoothly outward (`ease: [0.16, 1, 0.3, 1]`)
 *    from its centered arch dimensions (`borderRadius: '160px 160px 0px 0px'`) back to full viewport (`width: 100vw`, `height: 100vh`, `borderRadius: '0px'`),
 *    then fade away the transition layer to reveal the new page cleanly.
 */
export const PageTransitionProvider: React.FC<{
  children: React.ReactNode;
  pageContentRef?: React.RefObject<HTMLDivElement | null>;
}> = ({ children, pageContentRef }) => {
  const { lenis, scrollToTop, scrollToTarget } = useSmoothScroll();
  const archGeometry = useMemo(
    () => generateArchPath(ARCH_VIEWBOX_W, ARCH_VIEWBOX_H, 0),
    []
  );

  const [currentPath, setCurrentPath] = useState<AppPath>(() => {
    if (typeof window === 'undefined') return '/';
    return normalizeAppPath(window.location.pathname);
  });
  const [bookingTopic, setBookingTopic] = useState<string>(() => {
    if (typeof window === 'undefined') return 'Renovering';
    const params = new URLSearchParams(window.location.search);
    return params.get('topic') || 'Renovering';
  });
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [hasNavigatedInApp, setHasNavigatedInApp] = useState<boolean>(false);
  const [counterNumber, setCounterNumber] = useState<number>(0);

  const hasNavigatedInAppRef = useRef<boolean>(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const archFrameRef = useRef<HTMLDivElement | null>(null);
  const archMorphRef = useRef<HTMLDivElement | null>(null);
  const svgPathRef = useRef<SVGPathElement | null>(null);
  const counterWrapRef = useRef<HTMLDivElement | null>(null);
  const counterRollRef = useRef<HTMLDivElement | null>(null);
  const digitReelRefs = useRef<Array<HTMLSpanElement | null>>([null, null, null]);
  const activeTlRef = useRef<gsap.core.Timeline | null>(null);
  const currentPathRef = useRef<AppPath>(currentPath);
  currentPathRef.current = currentPath;
  const lastTrackedIntRef = useRef<number>(-1);

  const scrollToTopImmediate = useCallback(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      scrollToTop(true);
    }
    window.scrollTo(0, 0);
  }, [lenis, scrollToTop]);

  const scrollToHash = useCallback(
    (hash: string) => {
      scrollToTarget(hash, 0);
    },
    [scrollToTarget]
  );

  const syncArchProgress = useCallback(
    (progressVal: number) => {
      const clamped = Math.min(100, Math.max(0, Math.round(progressVal)));
      if (lastTrackedIntRef.current !== clamped) {
        lastTrackedIntRef.current = clamped;
        setCounterNumber(clamped);
        const padded3 = String(clamped).padStart(3, '0');
        for (let i = 0; i < 3; i++) {
          const reelEl = digitReelRefs.current[i];
          if (reelEl) {
            const d = Number(padded3[i]) || 0;
            reelEl.style.transform = `translateY(-${d * 10}%)`;
          }
        }
        if (counterRollRef.current) {
          counterRollRef.current.setAttribute('data-value', padded3);
        }
      }

      const svgPathEl = svgPathRef.current;
      if (svgPathEl) {
        const measuredLen =
          typeof svgPathEl.getTotalLength === 'function'
            ? svgPathEl.getTotalLength()
            : archGeometry.perimeter;
        const offset = calculateStrokeDashoffset(progressVal, measuredLen);
        svgPathEl.style.strokeDasharray = `${measuredLen}`;
        svgPathEl.style.strokeDashoffset = `${offset}`;
      }
    },
    [archGeometry.perimeter]
  );

  const runSqueezeAndExpandTransition = useCallback(
    (nextPath: AppPath, hash?: string, pushUrl?: string) => {
      const overlayEl = overlayRef.current;
      const archFrameEl = archFrameRef.current;
      const archMorphEl = archMorphRef.current;
      const svgPathEl = svgPathRef.current;
      const counterWrapEl = counterWrapRef.current;
      const counterRollEl = counterRollRef.current;
      const contentEl = pageContentRef?.current;

      if (!overlayEl || !archFrameEl || !archMorphEl || !svgPathEl || !counterWrapEl || !counterRollEl) {
        if (pushUrl && typeof window !== 'undefined') {
          window.history.pushState({}, '', pushUrl);
        }
        setCurrentPath(nextPath);
        scrollToTopImmediate();
        if (hash) setTimeout(() => scrollToHash(hash), 80);
        return;
      }

      if (activeTlRef.current) {
        activeTlRef.current.kill();
      }

      hasNavigatedInAppRef.current = true;
      setHasNavigatedInApp(true);
      setIsTransitioning(true);
      overlayEl.style.pointerEvents = 'auto';
      overlayEl.style.visibility = 'visible';

      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const targetArchW = isMobile ? '260px' : '320px';
      const targetArchH = isMobile ? '350px' : '430px';

      const measuredLen =
        typeof svgPathEl.getTotalLength === 'function'
          ? svgPathEl.getTotalLength()
          : archGeometry.perimeter;

      // Initial state at t = 0: Fullscreen #EEEDE7 viewport frame over #000000 backdrop
      gsap.set(overlayEl, {
        opacity: 1,
        backgroundColor: '#000000',
      });

      gsap.set(archFrameEl, {
        width: '100vw',
        height: '100vh',
        borderRadius: '0px',
        opacity: 1,
      });

      gsap.set(archMorphEl, {
        opacity: 1,
        backgroundColor: '#EEEDE7',
      });

      gsap.set(svgPathEl, {
        strokeDasharray: measuredLen,
        strokeDashoffset: measuredLen,
        fillOpacity: 0,
        strokeOpacity: 0,
      });

      gsap.set(counterWrapEl, {
        opacity: 0,
      });

      gsap.set(counterRollEl, {
        yPercent: 0,
        opacity: 1,
      });

      lastTrackedIntRef.current = -1;
      syncArchProgress(0);

      const proxy = { count: 0 };

      const tl = gsap.timeline({
        onComplete: () => {
          overlayEl.style.pointerEvents = 'none';
          overlayEl.style.visibility = 'hidden';
          setIsTransitioning(false);
          ScrollTrigger.refresh();
          if (hash) {
            setTimeout(() => scrollToHash(hash), 60);
          }
        },
      });

      // =========================================================================
      // STEP 1 — Smooth Reverse Squeeze (100vw × 100vh -> Centered Arch Frame, 0.9s)
      // =========================================================================
      tl.to(
        archFrameEl,
        {
          width: targetArchW,
          height: targetArchH,
          borderRadius: '160px 160px 0px 0px',
          duration: 0.9,
          ease: SQUEEZE_EASE,
        },
        0
      );

      // Dim the #EEEDE7 fill toward the end of squeeze so the 000->100 trace & fill in Step 2 is crisp
      tl.to(
        archMorphEl,
        {
          opacity: 0.12,
          duration: 0.35,
          ease: 'power2.inOut',
        },
        0.55
      );

      // =========================================================================
      // STEP 2 — Synchronized 000 -> 100 Odometer & Arch Outline Trace (1.05s)
      // =========================================================================
      const step2Start = 0.9;

      tl.set(svgPathEl, { strokeOpacity: 1 }, step2Start - 0.04);

      tl.to(
        counterWrapEl,
        {
          opacity: 1,
          duration: 0.22,
          ease: 'power2.out',
        },
        step2Start - 0.04
      );

      tl.to(
        proxy,
        {
          count: 100,
          duration: 1.05,
          ease: 'power2.inOut',
          onUpdate: () => {
            syncArchProgress(proxy.count);
          },
        },
        step2Start
      );

      // Solidify arch interior to #EEEDE7 as counter climbs to 100%
      tl.to(
        archMorphEl,
        {
          opacity: 1,
          duration: 0.9,
          ease: 'power2.inOut',
        },
        step2Start + 0.15
      );

      // =========================================================================
      // STEP 3 — Clean Route Settlement (150ms hold) + Odometer Exit Roll + Outward Expansion (0.95s)
      // =========================================================================
      const atHundredTime = step2Start + 1.05; // 1.95s

      // At 100%: push route and reset Lenis & window scroll immediately while behind solid #EEEDE7 arch
      tl.add(() => {
        syncArchProgress(100);
        if (pushUrl && typeof window !== 'undefined') {
          window.history.pushState({}, '', pushUrl);
        }
        setCurrentPath(nextPath);
        scrollToTopImmediate();
        if (contentEl) {
          gsap.set(contentEl, { clearProps: 'transform,filter,opacity' });
        }
      }, atHundredTime);

      // Hold 0.15s (150ms) at 100, then roll the 3-digit odometer downward out of its masked baseline (translateY(105%), opacity: 0, 0.45s)
      const expandStart = atHundredTime + 0.15; // 2.10s

      tl.to(
        counterRollEl,
        {
          yPercent: 105,
          opacity: 0,
          duration: 0.45,
          ease: 'power3.inOut',
        },
        expandStart
      );

      tl.to(
        svgPathEl,
        {
          strokeOpacity: 0,
          duration: 0.25,
          ease: 'power2.out',
        },
        expandStart
      );

      // Expand the #EEEDE7 arch mirror smoothly outward (0.95s, ease: [0.16, 1, 0.3, 1]) back to 100vw × 100vh
      tl.to(
        archFrameEl,
        {
          width: '100vw',
          height: '100vh',
          borderRadius: '0px',
          duration: 0.95,
          ease: EXPAND_EASE,
        },
        expandStart
      );

      tl.to(
        overlayEl,
        {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        },
        expandStart + 0.9
      );

      activeTlRef.current = tl;
    },
    [archGeometry.perimeter, pageContentRef, scrollToHash, scrollToTopImmediate, syncArchProgress]
  );

  const navigate = useCallback(
    (rawHref: string, options?: NavigateOptions) => {
      if (options?.topic) {
        setBookingTopic(options.topic);
      }

      // Pure hash link on current page
      if (rawHref.startsWith('#')) {
        if (currentPathRef.current !== '/') {
          runSqueezeAndExpandTransition('/', rawHref, `/${rawHref}`);
        } else {
          scrollToHash(rawHref);
        }
        return;
      }

      const [pathAndQuery, rawHash] = rawHref.split('#');
      const [rawPath, rawQuery] = (pathAndQuery || '/').split('?');
      const nextPath = normalizeAppPath(rawPath || '/');
      const hash = options?.hash || (rawHash ? `#${rawHash}` : undefined);

      if (rawQuery) {
        const params = new URLSearchParams(rawQuery);
        const topicParam = params.get('topic');
        if (topicParam) setBookingTopic(topicParam);
      }

      if (nextPath === currentPathRef.current) {
        if (hash) {
          scrollToHash(hash);
        } else if (lenis) {
          lenis.scrollTo(0);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      const fullUrl = `${nextPath}${rawQuery ? `?${rawQuery}` : ''}${hash || ''}`;
      runSqueezeAndExpandTransition(nextPath, hash, fullUrl);
    },
    [lenis, runSqueezeAndExpandTransition, scrollToHash]
  );

  useEffect(() => {
    const handlePopState = () => {
      const nextPath = normalizeAppPath(window.location.pathname);
      const hash = window.location.hash || undefined;
      if (nextPath !== currentPathRef.current) {
        runSqueezeAndExpandTransition(nextPath, hash);
      } else if (hash) {
        scrollToHash(hash);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [runSqueezeAndExpandTransition, scrollToHash]);

  const paddedCounter = String(Math.min(100, Math.max(0, Math.round(counterNumber)))).padStart(3, '0');

  return (
    <PageTransitionContext.Provider
      value={{
        currentPath,
        bookingTopic,
        setBookingTopic,
        isTransitioning,
        hasNavigatedInApp,
        navigate,
      }}
    >
      {children}

      {/* Fullscreen Pitch-Black Arch Mirror "Squeeze & Expand" Transition Overlay */}
      <div
        ref={overlayRef}
        data-testid="route-transition-curtain"
        aria-hidden={!isTransitioning}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-[#000000] pointer-events-none invisible overflow-hidden"
      >
        {/* Centered Morphing #EEEDE7 Arch Window Frame (100vw × 100vh -> 260x350 / 320x430 -> 100vw × 100vh) */}
        <div
          ref={archFrameRef}
          data-testid="transition-arch-frame"
          style={{
            width: '320px',
            height: '430px',
            borderRadius: '160px 160px 0px 0px',
          }}
          className="relative flex items-center justify-center overflow-hidden will-change-[width,height,border-radius]"
        >
          {/* Interior Morphing Surface (#EEEDE7) */}
          <div
            ref={archMorphRef}
            data-testid="transition-arch-morph"
            style={{ backgroundColor: '#EEEDE7' }}
            className="absolute inset-0 w-full h-full"
          />

          {/* Crisp White SVG Arch Outline (viewBox="0 0 320 430", stroke="#FFFFFF", strokeWidth="1.5") */}
          <svg
            viewBox={`0 0 ${ARCH_VIEWBOX_W} ${ARCH_VIEWBOX_H}`}
            preserveAspectRatio="none"
            className="relative z-10 w-full h-full block overflow-visible pointer-events-none"
            aria-label="Architectural arch mirror transition loader"
          >
            <path
              ref={svgPathRef}
              data-testid="transition-arch-path"
              d={archGeometry.d}
              fill="#EEEDE7"
              fillOpacity={0}
              stroke="#FFFFFF"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* Bottom-Left Lusion-Style 3-Digit Rolling Odometer Counter (000 -> 100) */}
        <div
          ref={counterWrapRef}
          data-testid="transition-arch-counter"
          className="fixed bottom-6 left-6 sm:bottom-8 sm:left-10 z-30 pointer-events-none select-none overflow-hidden opacity-0"
        >
          <div
            ref={counterRollRef}
            data-testid="transition-arch-counter-digits"
            data-value={paddedCounter}
            aria-label={paddedCounter}
            className="inline-flex items-baseline font-sans font-semibold tabular-nums text-5xl sm:text-6xl md:text-7xl tracking-tight text-white leading-none will-change-transform"
          >
            {[0, 1, 2].map((slotIdx) => {
              const digitVal = Number(paddedCounter[slotIdx]) || 0;
              return (
                <span
                  key={slotIdx}
                  data-testid={`transition-odometer-slot-${slotIdx}`}
                  className="inline-block overflow-hidden h-[1em] leading-none align-baseline"
                >
                  <span
                    ref={(el) => {
                      digitReelRefs.current[slotIdx] = el;
                    }}
                    style={{ transform: `translateY(-${digitVal * 10}%)` }}
                    className="flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                      <span key={d} className="block h-[1em] leading-none">
                        {d}
                      </span>
                    ))}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransitionContext.Provider>
  );
};

interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  topic?: string;
  onNavigate?: () => void;
  children: React.ReactNode;
}

export const TransitionLink: React.FC<TransitionLinkProps> = ({
  href,
  topic,
  onNavigate,
  onClick,
  children,
  ...rest
}) => {
  const { navigate } = usePageTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0 ||
      rest.target === '_blank'
    ) {
      onClick?.(e);
      return;
    }
    e.preventDefault();
    onClick?.(e);
    onNavigate?.();
    navigate(href, { topic });
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};
