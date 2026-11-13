import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { FEATURED_REVIEW, CLIENT_REVIEWS, Language } from '../data/portfolioData';
import { computeServiceCardTilt } from '../utils/preloaderMath';
import { KineticLangBlock } from './ui/RevealHeading';
import { SplitText } from './ui/SplitText';
import { AnimatedContent } from './ui/AnimatedContent';

gsap.registerPlugin(ScrollTrigger);

interface ReviewsProps {
  lang?: Language;
}

interface ReviewGlowCardProps {
  testId?: string;
  className?: string;
  innerClassName?: string;
  cardRef?: (el: HTMLElement | null) => void;
  isActiveGlow?: boolean;
  children: React.ReactNode;
}

const ReviewGlowCard: React.FC<ReviewGlowCardProps> = ({
  testId,
  className = '',
  innerClassName = 'p-7 sm:p-9',
  cardRef,
  isActiveGlow,
  children,
}) => {
  const localRef = useRef<HTMLElement | null>(null);
  const [selfHovered, setSelfHovered] = useState(false);

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rawTranslateY = useMotionValue(0);
  const rawScale = useMotionValue(1);

  const rotateX = useSpring(rawRotateX, { stiffness: 260, damping: 26, mass: 0.6 });
  const rotateY = useSpring(rawRotateY, { stiffness: 260, damping: 26, mass: 0.6 });
  const translateY = useSpring(rawTranslateY, { stiffness: 260, damping: 26, mass: 0.6 });
  const scale = useSpring(rawScale, { stiffness: 260, damping: 26, mass: 0.6 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = localRef.current;
    if (!el) return;
    if (!selfHovered) setSelfHovered(true);
    const rect = el.getBoundingClientRect();
    const tilt = computeServiceCardTilt({
      clientX: e.clientX,
      clientY: e.clientY,
      rectLeft: rect.left,
      rectTop: rect.top,
      rectWidth: rect.width,
      rectHeight: rect.height,
      maxDeg: 3,
    });

    el.style.setProperty('--mouse-x', `${tilt.mouseX}px`);
    el.style.setProperty('--mouse-y', `${tilt.mouseY}px`);
    rawRotateX.set(tilt.rotateX);
    rawRotateY.set(tilt.rotateY);
    rawTranslateY.set(-4);
    rawScale.set(1.01);
  };

  const handleMouseLeave = () => {
    setSelfHovered(false);
    rawRotateX.set(0);
    rawRotateY.set(0);
    rawTranslateY.set(0);
    rawScale.set(1);
  };

  const showGlow = isActiveGlow !== undefined ? isActiveGlow : selfHovered;

  return (
    <div style={{ perspective: '1000px' }} className={`h-full ${className}`.trim()}>
      {/* Layer 1: Outer Border Wrapper (rounded-3xl p-[1.5px] overflow-hidden bg-[#120F17]/10) */}
      <motion.article
        ref={(el) => {
          localRef.current = el;
          cardRef?.(el);
        }}
        data-testid={testId}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          y: translateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
        className="group relative h-full rounded-3xl p-[1.5px] overflow-hidden bg-[#120F17]/10 will-change-transform"
      >
        {/* Mouse-following radial spotlight layer */}
        <div
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(240px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(158, 139, 120, 0.85), rgba(18, 15, 23, 0.2) 45%, transparent 75%)',
          }}
          className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
            showGlow ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Layer 2: Inner Solid Card Surface */}
        <div
          className={`relative rounded-[calc(1.5rem-1.5px)] bg-[#EEEDE7] w-full h-full z-10 ${innerClassName}`}
        >
          {children}
        </div>
      </motion.article>
    </div>
  );
};

function renderSignatureWithHeart(name: string) {
  const heartIdx = name.indexOf('♡');
  if (heartIdx === -1) {
    return <span>{name}</span>;
  }
  const before = name.slice(0, heartIdx);
  const after = name.slice(heartIdx + 1);
  return (
    <>
      <span>{before}</span>
      <span className="inline-block transition-all duration-300 group-hover:text-[#9E8B78] group-hover:scale-110">
        ♡
      </span>
      {after && <span>{after}</span>}
    </>
  );
}

/**
 * SEKTION 8: REVIEWS / ANMELDELSER (SMOOTH CSS `sticky` CARD-STACKING + NON-PINNING SCRUB)
 * - Uses native hardware-accelerated CSS `sticky` (`sticky z-20 bg-[#EEEDE7] rounded-t-[32px] md:rounded-t-[48px] shadow-[0_-20px_60px_rgba(18,15,23,0.07)]`)
 *   with dynamic `ResizeObserver` `--reviews-h` offset (`top: 'min(0px, calc(100vh - var(--reviews-h, 100vh)))'`) for zero-jump locking.
 * - Non-pinning GSAP ScrollTrigger (`trigger: footerEl`, `start: 'top bottom'`, `end: 'top top'`, `scrub: true`)
 *   scales down and dims the inner Reviews container (`scale: 1` -> `0.95`, `opacity: 1` -> `0.65`) as Footer glides over it.
 * - Fast, immediate entrance for the 3 bottom review cards (`start: 'top 95%'`, `y: 20` -> `0`, `duration: 0.5`, `stagger: 0.06`, `ease: 'power3.out'`).
 */
export const Reviews: React.FC<ReviewsProps> = ({ lang = 'DA' }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reviewsInnerRef = useRef<HTMLDivElement | null>(null);
  const bottomGridRef = useRef<HTMLDivElement | null>(null);
  const bottomItemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [isGridHovered, setIsGridHovered] = useState(false);

  const [stickyTop, setStickyTop] = useState<number>(0);

  // Dynamically measure height via ResizeObserver for smooth CSS sticky top offset
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const updateStickyTop = () => {
      const reviewsHeight = el.offsetHeight;
      const viewportHeight = window.innerHeight;
      const nextTop = Math.min(0, viewportHeight - reviewsHeight);
      setStickyTop(nextTop);
      el.style.setProperty('--reviews-h', `${reviewsHeight}px`);
    };

    updateStickyTop();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(updateStickyTop);
      ro.observe(el);
    }

    window.addEventListener('resize', updateStickyTop, { passive: true });
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', updateStickyTop);
    };
  }, []);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    const innerEl = reviewsInnerRef.current;
    const gridEl = bottomGridRef.current;
    const items = bottomItemRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!el || !innerEl) return;

    const ctx = gsap.context(() => {
      // 1. Non-pinning ScrollTrigger linked to Footer rising over the sticky Reviews section
      const footerEl = document.querySelector('[data-testid="footer-section"]');
      if (footerEl) {
        gsap.fromTo(
          innerEl,
          {
            scale: 1,
            opacity: 1,
            transformOrigin: 'center bottom',
          },
          {
            scale: 0.95,
            opacity: 0.65,
            ease: 'none',
            scrollTrigger: {
              trigger: footerEl,
              start: 'top bottom',
              end: 'top top',
              scrub: true,
            },
          }
        );
      }

      // 2. Snappy, immediate entrance for the 3 bottom review cards (start: 'top 95%', no scrub, no pin)
      if (gridEl && items.length > 0) {
        const prefersReducedMotion =
          typeof window !== 'undefined' &&
          typeof window.matchMedia === 'function' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
          gsap.set(items, { opacity: 1, y: 0 });
        } else {
          let revealed = false;
          const cardsTl = gsap.timeline({
            paused: true,
            onComplete: () => {
              revealed = true;
            },
          });

          cardsTl.fromTo(
            items,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.06,
              ease: 'power3.out',
              immediateRender: true,
            },
            0
          );

          ScrollTrigger.create({
            trigger: gridEl,
            start: 'top 95%',
            onEnter: () => {
              if (!revealed && !cardsTl.isActive()) {
                cardsTl.restart();
              } else if (!revealed) {
                cardsTl.play();
              }
            },
          });

          ScrollTrigger.create({
            trigger: gridEl,
            start: 'top 106%',
            onLeaveBack: () => {
              cardsTl.pause(0);
              revealed = false;
            },
          });

          const rect = gridEl.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.95) {
            cardsTl.play();
          }
        }
      }
    }, el);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleGridMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isGridHovered) setIsGridHovered(true);
    cardRefs.current.forEach((cardEl) => {
      if (!cardEl) return;
      const rect = cardEl.getBoundingClientRect();
      const mouseX = Math.round(e.clientX - rect.left);
      const mouseY = Math.round(e.clientY - rect.top);
      cardEl.style.setProperty('--mouse-x', `${mouseX}px`);
      cardEl.style.setProperty('--mouse-y', `${mouseY}px`);
    });
  };

  const handleGridMouseLeave = () => {
    setIsGridHovered(false);
    cardRefs.current.forEach((cardEl) => {
      if (!cardEl) return;
      cardEl.style.setProperty('--mouse-x', '-999px');
      cardEl.style.setProperty('--mouse-y', '-999px');
    });
  };

  return (
    <section
      ref={sectionRef}
      id="reviews"
      data-testid="reviews-section"
      style={{ top: `${stickyTop}px` }}
      className="sticky z-20 bg-[#EEEDE7] rounded-t-[32px] md:rounded-t-[48px] shadow-[0_-20px_60px_rgba(18,15,23,0.07)] will-change-transform pt-24 pb-28 sm:pt-32 sm:pb-36 px-6 sm:px-10 border-t border-[#120F17]/12"
    >
      <div
        ref={reviewsInnerRef}
        data-testid="reviews-inner-card"
        className="max-w-7xl mx-auto will-change-transform"
      >
        <SplitText
          tag="p"
          text={lang === 'DA' ? 'Klientoplevelser & Anmeldelser' : 'Client Experiences & Reviews'}
          splitType="words,chars"
          mask={true}
          effect="rise"
          duration={1.0}
          delay={25}
          textAlign="left"
          className="text-xs uppercase tracking-[0.22em] text-[#120F17]/60 font-medium"
        />

        {/* Featured Review Card (Ellen & Emil) */}
        <AnimatedContent
          animateOpacity
          blur="{4}"
          direction="vertical"
          distance="{28}"
          duration="{0.65}"
          ease="power3.out"
          initialOpacity="{0}"
          threshold="{0.08}"
          className="mt-8"
        >
          <ReviewGlowCard
            testId="featured-review-card"
            innerClassName="p-8 sm:p-12 md:p-14 flex flex-col justify-between"
          >
            <span
              aria-hidden="true"
              className="block text-4xl font-serif leading-none text-[#9E8B78]/40 transition-all duration-500 group-hover:text-[#9E8B78] group-hover:-translate-y-1 select-none mb-2"
            >
              “
            </span>

            <KineticLangBlock langKey={`featured-review-${lang}`}>
              <blockquote className="font-serif-display text-2xl sm:text-3xl md:text-4xl leading-[1.35] text-[#120F17]/75 group-hover:text-[#120F17] transition-colors duration-300 font-normal max-w-5xl">
                {lang === 'DA' ? FEATURED_REVIEW.quote : FEATURED_REVIEW.quoteEn}
              </blockquote>
              <p className="mt-8 text-sm sm:text-base font-medium tracking-wide text-[#120F17] transition-transform duration-300 ease-out group-hover:translate-x-1.5">
                {FEATURED_REVIEW.author}
              </p>
            </KineticLangBlock>
          </ReviewGlowCard>
        </AnimatedContent>

        {/* 3 Bottom Client Review Cards with Immediate Snappy Entrance & Sibling Dimming */}
        <div
          ref={bottomGridRef}
          data-testid="reviews-bottom-grid"
          onMouseMove={handleGridMouseMove}
          onMouseLeave={handleGridMouseLeave}
          className="mt-10 group/reviews grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {CLIENT_REVIEWS.map((review, idx) => (
            <div
              key={review.name}
              ref={(el) => {
                bottomItemRefs.current[idx] = el;
              }}
              className="transition-opacity duration-300 group-hover/reviews:opacity-70 hover:!opacity-100 h-full will-change-transform"
            >
              <ReviewGlowCard
                testId={`review-card-${idx + 1}`}
                isActiveGlow={isGridHovered}
                cardRef={(el) => {
                  cardRefs.current[idx] = el;
                }}
                innerClassName="p-7 sm:p-9 flex flex-col justify-between"
              >
                <div>
                  <span
                    aria-hidden="true"
                    className="block text-4xl font-serif leading-none text-[#9E8B78]/40 transition-all duration-500 group-hover:text-[#9E8B78] group-hover:-translate-y-1 select-none mb-2"
                  >
                    “
                  </span>
                  <KineticLangBlock langKey={`review-${review.name}-${lang}`}>
                    <p className="text-sm sm:text-base leading-relaxed text-[#120F17]/75 group-hover:text-[#120F17] transition-colors duration-300">
                      {lang === 'DA' ? review.quote : review.quoteEn}
                    </p>
                  </KineticLangBlock>
                </div>

                <h3 className="mt-6 pt-4 border-t border-[#120F17]/10 font-serif-display text-xl text-[#120F17] font-normal transition-transform duration-300 ease-out group-hover:translate-x-1.5">
                  {renderSignatureWithHeart(review.name)}
                </h3>
              </ReviewGlowCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
