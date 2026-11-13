import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { parseNumericProp } from '../../utils/preloaderMath';

gsap.registerPlugin(ScrollTrigger);

export type WipeDirection = 'up' | 'down' | 'left' | 'right' | 'center' | false;

export interface AnimatedContentProps {
  children: React.ReactNode;
  distance?: number | string;
  direction?: 'vertical' | 'horizontal';
  reverse?: boolean;
  duration?: number | string;
  ease?: string;
  initialOpacity?: number | string;
  animateOpacity?: boolean;
  scale?: number | string;
  blur?: number | string;
  rotate?: number | string;
  tilt?: number | string;
  wipe?: WipeDirection;
  threshold?: number | string;
  delay?: number | string;
  stagger?: number | string;
  staggerFrom?: 'start' | 'center' | 'edges' | 'random' | 'end' | number;
  trigger?: 'scroll' | 'mount';
  once?: boolean;
  scrub?: boolean | number;
  className?: string;
  style?: React.CSSProperties;
}

const WIPE_FROM: Record<Exclude<WipeDirection, false>, string> = {
  up: 'inset(100% 0% 0% 0%)',
  down: 'inset(0% 0% 100% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
  center: 'inset(50% 50% 50% 50%)',
};

/**
 * React Bits `AnimatedContent` powered by GSAP & ScrollTrigger.
 * Uses decoupled downward-play trigger (`top ${startPct}%`) and offscreen-only reset (`top 106%`)
 * so elements never vanish while visible on screen.
 */
export const AnimatedContent: React.FC<AnimatedContentProps> = ({
  children,
  distance = 45,
  direction = 'vertical',
  reverse = false,
  duration = 0.85,
  ease = 'power3.out',
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  blur = 0,
  rotate = 0,
  tilt = 0,
  wipe = false,
  threshold = 0.12,
  delay = 0,
  stagger = 0,
  staggerFrom = 'start',
  trigger = 'scroll',
  once = false,
  scrub = false,
  className = '',
  style,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const numDistance = parseNumericProp(distance, 45);
  const numDuration = parseNumericProp(duration, 0.85);
  const numInitialOpacity = parseNumericProp(initialOpacity, 0);
  const numScale = parseNumericProp(scale, 1);
  const numBlur = parseNumericProp(blur, 0);
  const numRotate = parseNumericProp(rotate, 0);
  const numTilt = parseNumericProp(tilt, 0);
  const numThreshold = parseNumericProp(threshold, 0.12);
  const numDelay = parseNumericProp(delay, 0);
  const numStagger = parseNumericProp(stagger, 0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const targets =
      numStagger > 0 && el.children.length > 1
        ? (Array.from(el.children) as HTMLElement[])
        : [el];

    if (prefersReducedMotion) {
      gsap.set(targets, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        rotationX: 0,
        filter: 'blur(0px)',
        clipPath: 'none',
      });
      return;
    }

    const axis = direction === 'horizontal' ? 'x' : 'y';
    const offset = reverse ? -numDistance : numDistance;
    const startPct = Math.round((1 - Math.min(0.95, Math.max(0.01, numThreshold))) * 100);

    const fromVars: gsap.TweenVars = {
      [axis]: offset,
      scale: numScale,
      rotation: numRotate,
      rotationX: numTilt,
      opacity: animateOpacity ? numInitialOpacity : 1,
      ...(numBlur > 0 ? { filter: `blur(${numBlur}px)` } : {}),
      ...(wipe && WIPE_FROM[wipe] ? { clipPath: WIPE_FROM[wipe] } : {}),
    };

    const toVars: gsap.TweenVars = {
      [axis]: 0,
      scale: 1,
      rotation: 0,
      rotationX: 0,
      opacity: 1,
      duration: numDuration,
      delay: numDelay,
      ease,
      ...(numBlur > 0 ? { filter: 'blur(0px)' } : {}),
      ...(wipe && WIPE_FROM[wipe] ? { clipPath: 'inset(0% 0% 0% 0%)' } : {}),
      ...(numStagger > 0 && targets.length > 1
        ? {
            stagger: {
              each: numStagger,
              from: staggerFrom,
            },
          }
        : {}),
    };

    const ctx = gsap.context(() => {
      if (numTilt !== 0) {
        gsap.set(el, { transformPerspective: 900 });
      }
      gsap.set(targets, fromVars);

      if (trigger === 'mount') {
        gsap.to(targets, toVars);
      } else if (scrub) {
        gsap.to(targets, {
          ...toVars,
          scrollTrigger: {
            trigger: el,
            start: `top ${startPct}%`,
            end: 'bottom 20%',
            scrub,
          },
        });
      } else {
        let revealed = false;
        const tl = gsap.timeline({
          paused: true,
          onComplete: () => {
            revealed = true;
          },
        });
        tl.fromTo(targets, fromVars, { ...toVars, immediateRender: true }, 0);

        ScrollTrigger.create({
          trigger: el,
          start: `top ${startPct}%`,
          onEnter: () => {
            if (!revealed && !tl.isActive()) {
              tl.restart();
            } else if (!revealed) {
              tl.play();
            }
          },
        });

        if (!once) {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 106%',
            onLeaveBack: () => {
              tl.pause(0);
              revealed = false;
            },
          });
        }

        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * (startPct / 100)) {
          tl.play();
        }
      }
    }, el);

    return () => {
      ctx.revert();
    };
  }, [
    animateOpacity,
    direction,
    ease,
    numBlur,
    numDelay,
    numDistance,
    numDuration,
    numInitialOpacity,
    numRotate,
    numScale,
    numStagger,
    numThreshold,
    numTilt,
    once,
    reverse,
    scrub,
    staggerFrom,
    trigger,
    wipe,
  ]);

  return (
    <div
      ref={ref}
      data-component="@react-bits/AnimatedContent"
      style={style}
      className={className}
    >
      {children}
    </div>
  );
};

export default AnimatedContent;
