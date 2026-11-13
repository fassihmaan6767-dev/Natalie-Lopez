import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

interface RevealTextProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  wrapperClassName?: string;
  delay?: number;
  style?: React.CSSProperties;
  'data-testid'?: string;
}

/**
 * Downward-Only Scroll Replay RevealText for Eyebrows & Labels
 * - Scrolling Down Into View (onEnter): plays smoothly from start to finish.
 * - Scrolling Up Back Through the Page (onEnterBack): stays cleanly visible.
 * - Resetting Above the Viewport (onLeaveBack): silently resets to hidden state
 *   (toggleActions: 'play none none reset') so scrolling down again replays fresh.
 */
export const RevealText: React.FC<RevealTextProps> = ({
  children,
  as: Tag = 'h2',
  className = '',
  wrapperClassName = '',
  delay = 0,
  style,
  'data-testid': testId,
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLElement | null>(null);
  const ComponentTag = Tag as React.ElementType;

  useEffect(() => {
    const wrapperEl = wrapperRef.current;
    const innerEl = innerRef.current;
    if (!wrapperEl || !innerEl) return;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(innerEl, { y: '0%', opacity: 1, filter: 'blur(0px)' });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerEl,
        {
          y: '115%',
          opacity: 0,
          filter: 'blur(8px)',
        },
        {
          y: '0%',
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.85,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrapperEl,
            start: 'top 90%',
            toggleActions: 'play none none reset',
          },
        }
      );
    }, wrapperEl);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={wrapperRef} className={`overflow-hidden pb-1.5 ${wrapperClassName}`.trim()}>
      <ComponentTag ref={innerRef} data-testid={testId} style={style} className={className}>
        {children}
      </ComponentTag>
    </div>
  );
};

interface KineticLangBlockProps {
  langKey: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Instant Text Swap + Kinetic Snap Animation when toggling between `DA` and `EN`:
 * `key={lang}`, `initial={{ y: 7, opacity: 0.65 }}`, `animate={{ y: 0, opacity: 1 }}`,
 * `transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}`
 */
export const KineticLangBlock: React.FC<KineticLangBlockProps> = ({
  langKey,
  children,
  className = '',
}) => {
  return (
    <motion.div
      key={langKey}
      initial={{ y: 7, opacity: 0.65 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
