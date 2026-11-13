'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

const DEFAULT_FROM = { opacity: 0, y: 40 };
const DEFAULT_TO = { opacity: 1, y: 0 };
const STIFFNESS = 180;
const DAMPING = 19;
const KICK = 0.024;

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const fontsAreLoaded = () =>
  typeof document !== 'undefined' && (!document.fonts || document.fonts.status === 'loaded');

const waveEase = (t: number) => 1 - Math.cos(t * Math.PI * 1.5) * Math.pow(1 - t, 1.2);

const getEffect = (effect: string, em: number) => {
  switch (effect) {
    case 'fade':
      return { from: { opacity: 0 }, to: { opacity: 1 }, ease: 'power2.inOut' };
    case 'blur':
      return {
        from: { opacity: 0, filter: `blur(${Math.round(em * 1.4) / 10}px)` },
        to: { opacity: 1, filter: 'blur(0px)' },
        ease: 'power2.out',
      };
    case 'flip': {
      const setup = { transformPerspective: em * 6, transformOrigin: '50% 100%' };
      return {
        from: { ...setup, opacity: 0, rotationX: -90 },
        to: { ...setup, opacity: 1, rotationX: 0 },
        ease: 'power3.out',
      };
    }
    case 'pop':
      return { from: { opacity: 0, scale: 0 }, to: { opacity: 1, scale: 1 }, ease: 'back.out(1.6)' };
    case 'skew':
      return {
        from: { transformOrigin: '50% 100%', opacity: 0, x: -em * 0.4, skewX: -24 },
        to: { transformOrigin: '50% 100%', opacity: 1, x: 0, skewX: 0 },
        ease: 'expo.out',
      };
    case 'wave':
      return { from: { opacity: 0, y: em * 0.45 }, to: { opacity: 1, y: 0 }, ease: waveEase };
    default:
      return { from: { ...DEFAULT_FROM }, to: { ...DEFAULT_TO }, ease: 'power3.out' };
  }
};

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: string;
  from?: Record<string, any>;
  to?: Record<string, any>;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  staggerFrom?: 'start' | 'center' | 'edges' | 'random' | 'end' | number;
  mask?: boolean;
  effect?: 'rise' | 'fade' | 'blur' | 'flip' | 'pop' | 'skew' | 'wave' | string;
  trigger?: 'view' | 'load' | 'hover' | 'click';
  loop?: boolean;
  loopDelay?: number;
  hoverEffect?: 'none' | 'lift' | 'wave';
  color?: string;
  accentColor?: string;
  onLetterAnimationComplete?: () => void;
  'data-testid'?: string;
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 35,
  duration = 1.1,
  ease,
  splitType = 'chars',
  from,
  to,
  threshold = 0.1,
  rootMargin = '-60px',
  textAlign = 'left',
  tag = 'h2',
  staggerFrom = 'start',
  mask = true,
  effect = 'rise',
  trigger = 'view',
  loop = false,
  loopDelay = 1.5,
  hoverEffect = 'none',
  color,
  accentColor,
  onLetterAnimationComplete,
  'data-testid': testId,
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const completedTextRef = useRef<string | null>(null);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const liveRef = useRef({ trigger, hoverEffect, accentColor });
  const [fontsLoaded, setFontsLoaded] = useState(fontsAreLoaded);
  const [ready, setReady] = useState(true);

  useIsoLayoutEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
    liveRef.current = { trigger, hoverEffect, accentColor };
    setReady(true);
  });

  useEffect(() => {
    setReady(true);
    if (fontsLoaded) return undefined;
    let active = true;
    document.fonts.ready.then(() => {
      if (active) setFontsLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [fontsLoaded]);

  useGSAP(
    () => {
      const el = ref.current;
      setReady(true);
      if (!el || !text || !fontsLoaded) return;
      el.getBoundingClientRect();
      if (!fontsAreLoaded()) {
        setFontsLoaded(false);
        return;
      }

      const finish = () => {
        if (completedTextRef.current === text) return;
        completedTextRef.current = text;
        onCompleteRef.current?.();
      };

      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        setReady(true);
        finish();
        return;
      }

      const unit = splitType.includes('chars')
        ? 'chars'
        : splitType.includes('words')
          ? 'words'
          : 'lines';

      const em = parseFloat(getComputedStyle(el).fontSize) || 16;
      const custom = from !== undefined || to !== undefined;
      const look = getEffect(effect, em);
      const fromVars = custom ? { ...(from || DEFAULT_FROM) } : look.from;
      const toVars = custom ? { ...(to || DEFAULT_TO) } : look.to;
      const easing = ease || (custom ? 'power3.out' : look.ease);
      const exit = Math.max(0.35, duration * 0.55);

      let pieces: HTMLElement[] = [];
      let movers: HTMLElement[] = [];
      let order = gsap.utils.distribute({ each: delay / 1000, from: staggerFrom });
      let revealed = false;
      let intro: gsap.core.Timeline | null = null;
      let busy: gsap.core.Timeline | null = null;
      let queued: gsap.core.Tween | null = null;
      let triggers: ScrollTrigger[] = [];
      let raf = 0;
      let last = 0;
      let centers: Array<{ x: number; y: number }> | null = null;
      const lift = em * 0.2;
      const springs: Array<{ y: number; v: number }> = [];
      const kicks: Array<{ index: number; velocity: number; at: number }> = [];
      const pointer = { x: 0, y: 0, inside: false };

      const reveal = (initial: boolean, vars?: gsap.TimelineVars) => {
        const accent = liveRef.current.accentColor;
        const tl = gsap.timeline(vars);
        tl.fromTo(
          pieces,
          { ...fromVars, willChange: 'transform, opacity' },
          { ...toVars, duration, ease: easing, stagger: order, immediateRender: initial },
          0
        );
        if (accent) {
          tl.fromTo(
            pieces,
            { color: accent },
            {
              color: getComputedStyle(el).color,
              duration: duration * 0.7,
              ease: 'power1.inOut',
              stagger: order,
              immediateRender: initial,
            },
            duration * 0.3
          );
        }
        return tl;
      };

      const conceal = () => {
        const accent = liveRef.current.accentColor;
        const tl = gsap.timeline();
        tl.fromTo(
          pieces,
          { ...toVars, willChange: 'transform, opacity' },
          { ...fromVars, duration: exit, ease: 'power2.in', stagger: order, immediateRender: false },
          0
        );
        if (accent)
          tl.to(pieces, { color: accent, duration: exit, ease: 'power1.in', stagger: order }, 0);
        return tl;
      };

      const cycle = () => {
        if (busy || !revealed || !pieces.length) return;
        queued?.kill();
        queued = null;
        busy = gsap
          .timeline({
            onComplete: () => {
              busy = null;
              queue();
            },
          })
          .add(conceal(), 0)
          .add(reveal(false), exit);
      };

      const queue = () => {
        queued?.kill();
        queued = loop ? gsap.delayedCall(loopDelay, cycle) : null;
      };

      const measure = () => {
        const box = el.getBoundingClientRect();
        centers = movers.map((node, i) => {
          const rect = node.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2 - box.left,
            y: rect.top + rect.height / 2 - box.top - (springs[i]?.y || 0),
          };
        });
      };

      const tick = (now: number) => {
        raf = 0;
        const dt = Math.min(0.032, Math.max(0.001, (now - last) / 1000));
        last = now;
        const spots =
          liveRef.current.hoverEffect === 'lift' && pointer.inside && revealed ? centers : null;
        const radius = em * 1.15;
        let moving = false;
        for (let k = kicks.length - 1; k >= 0; k--) {
          if (now < kicks[k].at) continue;
          const spring = springs[kicks[k].index];
          if (spring) spring.v -= kicks[k].velocity;
          kicks.splice(k, 1);
        }
        movers.forEach((node, i) => {
          const spring = springs[i] || (springs[i] = { y: 0, v: 0 });
          const spot = spots?.[i];
          let target = 0;
          if (spot) {
            const dx = (spot.x - pointer.x) / radius;
            const dy = (spot.y - pointer.y) / (radius * 1.4);
            target = -lift * Math.exp(-(dx * dx + dy * dy) * 0.5);
          }
          spring.v += (STIFFNESS * (target - spring.y) - DAMPING * spring.v) * dt;
          spring.y += spring.v * dt;
          if (Math.abs(target - spring.y) < 0.02 && Math.abs(spring.v) < 0.05) {
            spring.y = target;
            spring.v = 0;
          } else {
            moving = true;
          }
          node.style.translate = Math.abs(spring.y) > 0.01 ? `0 ${spring.y.toFixed(2)}px` : '';
        });
        if (moving || kicks.length) raf = requestAnimationFrame(tick);
      };

      const wake = () => {
        if (raf) return;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      };

      const locate = (e: PointerEvent) => {
        const box = el.getBoundingClientRect();
        pointer.x = e.clientX - box.left;
        pointer.y = e.clientY - box.top;
      };

      const onEnter = (e: PointerEvent) => {
        locate(e);
        pointer.inside = true;
        if (!revealed) return;
        const live = liveRef.current;
        if (live.trigger === 'hover') cycle();
        if (live.hoverEffect === 'none') return;
        measure();
        if (live.hoverEffect === 'wave' && centers) {
          const now = performance.now();
          const speed = em * 9;
          const velocity = (em * 0.16) / KICK;
          centers.forEach((center, index) => {
            kicks.push({
              index,
              velocity,
              at: now + (Math.abs(center.x - pointer.x) / speed) * 1000,
            });
          });
        }
        wake();
      };

      const onMove = (e: PointerEvent) => {
        locate(e);
        pointer.inside = true;
        if (!revealed || liveRef.current.hoverEffect !== 'lift') return;
        if (!centers) measure();
        wake();
      };

      const onLeave = () => {
        pointer.inside = false;
        wake();
      };

      const onClick = () => {
        if (liveRef.current.trigger === 'click') cycle();
      };

      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === 'lines',
        mask: (mask ? unit : undefined) as any,
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
        reduceWhiteSpace: false,
        onSplit: (self: any) => {
          triggers.forEach((st) => st.kill());
          triggers = [];

          pieces =
            ([self[unit], self.chars, self.words, self.lines].find(
              (list) => list && list.length
            ) as HTMLElement[]) || [];
          movers =
            mask && self.masks?.length === pieces.length
              ? (self.masks as HTMLElement[])
              : pieces;
          order = gsap.utils.distribute({ each: delay / 1000, from: staggerFrom });
          centers = null;
          springs.length = 0;
          kicks.length = 0;
          if (busy && busy !== intro) {
            busy.kill();
            busy = null;
          }
          if (intro) {
            intro.kill();
            intro = null;
          }

          intro = reveal(true, {
            paused: trigger !== 'load',
            onComplete: () => {
              revealed = true;
              busy = null;
              finish();
              queue();
            },
          });
          busy = intro;

          if (trigger !== 'load') {
            // Trigger 1 (Play on Downward Entry)
            const playTrigger = ScrollTrigger.create({
              trigger: el,
              start: 'top 88%',
              onEnter: () => {
                if (!revealed && !intro?.isActive()) {
                  intro?.restart();
                } else if (!revealed) {
                  intro?.play();
                }
              },
            });

            // Trigger 2 (Silent Reset ONLY When Completely Below Viewport)
            const resetTrigger = ScrollTrigger.create({
              trigger: el,
              start: 'top 106%',
              onLeaveBack: () => {
                intro?.pause(0);
                revealed = false;
                queued?.kill();
              },
            });

            triggers.push(playTrigger, resetTrigger);

            // Safety check: if el is already above top 88% on initial load or after a route change, play immediately
            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.88) {
              intro.play();
            }
          } else {
            intro.play();
          }

          return intro;
        },
      });
      setReady(true);

      el.addEventListener('pointerenter', onEnter as EventListener);
      el.addEventListener('pointermove', onMove as EventListener);
      el.addEventListener('pointerleave', onLeave);
      el.addEventListener('click', onClick);

      return () => {
        cancelAnimationFrame(raf);
        queued?.kill();
        busy?.kill();
        intro?.kill();
        triggers.forEach((st) => st.kill());
        triggers = [];
        el.removeEventListener('pointerenter', onEnter as EventListener);
        el.removeEventListener('pointermove', onMove as EventListener);
        el.removeEventListener('pointerleave', onLeave);
        el.removeEventListener('click', onClick);
        movers.forEach((node) => {
          node.style.translate = '';
        });
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === el) st.kill();
        });
        splitInstance.revert();
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        staggerFrom,
        mask,
        effect,
        trigger,
        loop,
        loopDelay,
        fontsLoaded,
      ],
      scope: ref,
      revertOnUpdate: true,
    }
  );

  const Tag = (tag || 'p') as React.ElementType;
  const clip =
    hoverEffect === 'none' &&
    (from !== undefined || to !== undefined || effect === 'rise' || effect === 'fade');

  return (
    <Tag
      ref={ref}
      key={text}
      data-testid={testId}
      className={`split-parent ${className}`.trim()}
      style={{
        textAlign,
        overflow: clip ? 'hidden' : 'visible',
        display: 'inline-block',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        color: color || undefined,
        cursor: trigger === 'click' ? 'pointer' : undefined,
        visibility: ready ? 'visible' : 'hidden',
      }}
    >
      {text}
    </Tag>
  );
};

export default SplitText;
