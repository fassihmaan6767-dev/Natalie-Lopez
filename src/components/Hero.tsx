import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import { ArchitecturalArtwork } from './ArchitecturalArtwork';
import { GlassSurface } from './ui/GlassSurface';
import { HERO_CLIENT_AVATARS, AVATAR_FALLBACKS, Language } from '../data/portfolioData';
import { getCompactGlassSurfaceConfig } from '../utils/preloaderMath';
import { TransitionLink } from '../context/PageTransitionContext';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  lang: Language;
  onBookClick: () => void;
}

export const HERO_VIDEO_URL =
  'https://natalielopez.dk/wp-content/uploads/2026/10/WhatsApp-Video-2026-10-05-at-11.09.26-AM.mp4';

export const SUB_HERO_STATEMENT: Record<Language, string> = {
  DA: 'En renovering består af hundredevis af beslutninger. Jeg hjælper dig med at skabe overblik, træffe de rigtige valg og sikre, at visionen bevares hele vejen fra idé til færdigt hjem.',
  EN: 'A renovation consists of hundreds of decisions. I help you create clarity, make the right choices, and ensure your vision is preserved all the way from idea to finished home.',
};

/**
 * 4. FULL-BLEED HERO SECTION & COMPACT LIQUID GLASS PILL
 * - Fullscreen background video (`w-full h-screen min-h-[680px] object-cover scale-105 pointer-events-none`).
 * - Subtle ambient scrim (`bg-black/20`) + tall bottom gradient fade (`h-44 md:h-56`, `linear-gradient(to top, #EEEDE7 0%, rgba(238, 237, 231, 0.8) 35%, rgba(238, 237, 231, 0) 100%)`).
 * - Bottom-left unselectable (`select-none`) bilingual headline + primary magnetic pill CTA (`mt-5`).
 * - Bottom-right compact `GlassSurface` pill (`width={245}` on mobile, `width={270}` on desktop, `height={56}`, `borderRadius={28}`)
 *   with 3 high-resolution Unsplash portrait avatars (`h-7 w-7 rounded-full object-cover ring-1 ring-white/40`, `-space-x-2`).
 *
 * 5. SUB-HERO SCROLL-FILL STATEMENT SECTION (LARGER TYPOGRAPHY + COMPLETE VIEWPORT FILL)
 * - `py-28 sm:py-36 md:py-44 px-6 md:px-14 bg-[#EEEDE7] border-none`
 * - `max-w-5xl mx-auto text-3xl sm:text-4xl md:text-[50px] lg:text-[58px] font-light leading-[1.22] tracking-tight`
 * - GSAP ScrollTrigger (`scrub: 0.35`, `start: "top 80%"`, `end: "center 45%"`) with `inline-block whitespace-nowrap` spans.
 */
export const Hero: React.FC<HeroProps> = ({ lang, onBookClick }) => {
  const [avatarSrcs, setAvatarSrcs] = useState<string[]>(HERO_CLIENT_AVATARS);
  const [videoFailed, setVideoFailed] = useState<boolean>(false);
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );
  const [magneticOffset, setMagneticOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const btnRef = useRef<HTMLAnchorElement | null>(null);
  const statementSectionRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const statementWords = SUB_HERO_STATEMENT[lang].split(' ');
  const glassPillConfig = getCompactGlassSurfaceConfig(viewportWidth);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAvatarError = (index: number) => {
    setAvatarSrcs((prev) => {
      if (prev[index] === AVATAR_FALLBACKS[index]) return prev;
      const next = [...prev];
      next[index] = AVATAR_FALLBACKS[index];
      return next;
    });
  };

  const handleMagneticMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.28;
    setMagneticOffset({ x: dx, y: dy });
  };

  const handleMagneticLeave = () => {
    setMagneticOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    const sectionEl = statementSectionRef.current;
    const words = wordRefs.current
      .slice(0, statementWords.length)
      .filter(Boolean) as HTMLSpanElement[];
    if (!sectionEl || words.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(words, { color: 'rgba(18, 15, 23, 0.16)' });

      gsap.to(words, {
        color: '#120F17',
        stagger: 0.045,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top 80%',
          end: 'bottom 32%',
          scrub: 1.15,
        },
      });
    }, sectionEl);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [lang, statementWords.length]);

  return (
    <section id="top" data-testid="hero-section" className="w-full border-none">
      {/* FULL-BLEED EDGE-TO-EDGE VIDEO VIEWPORT */}
      <div
        data-testid="hero-fullbleed-viewport"
        className="relative w-full h-screen min-h-[680px] overflow-hidden bg-[#080808]"
      >
        {/* Architectural interior fallback canvas & live stream layer underneath in case WP MP4 URL is unreachable */}
        <div className="absolute inset-0 z-0">
          <ArchitecturalArtwork variant="hero-video-scene" className="w-full h-full object-cover" />
          {videoFailed && (
            <iframe
              src="https://streamable.com/e/oqdz6d?autoplay=1&muted=1&nocontrols=1"
              title="Natalie Lopez Architectural Showcase"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-[1.18] border-0"
              allow="autoplay; fullscreen"
            />
          )}
        </div>

        {/* Primary Edge-to-Edge HTML5 Video */}
        <video
          data-testid="hero-background-video"
          src={HERO_VIDEO_URL}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoFailed(true)}
          className="relative z-5 w-full h-screen min-h-[680px] object-cover scale-105 pointer-events-none"
        />

        {/* Subtle ambient scrim (bg-black/20) */}
        <div className="absolute inset-0 z-10 bg-black/20 pointer-events-none" />

        {/* Tall bottom gradient fade dissolving into #EEEDE7 */}
        <div
          data-testid="hero-bottom-fade"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(to top, #EEEDE7 0%, rgba(238, 237, 231, 0.8) 35%, rgba(238, 237, 231, 0) 100%)',
          }}
          className="h-44 md:h-56 w-full absolute bottom-0 left-0 pointer-events-none z-10"
        />

        {/* Floating Bottom Controls */}
        <div className="absolute bottom-8 sm:bottom-12 left-6 sm:left-10 right-6 sm:right-10 z-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          {/* Bottom-Left: Unselectable Headline + Primary Magnetic Pill CTA */}
          <div className="flex flex-col items-start">
            <motion.h1
              key={`hero-headline-${lang}`}
              initial={{ y: 7, opacity: 0.65 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              data-testid="hero-headline"
              style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
              className="select-none text-2xl sm:text-3xl md:text-[34px] font-light leading-[1.2] tracking-tight text-white drop-shadow-sm max-w-md"
            >
              {lang === 'DA' ? (
                <>
                  Når æstetik og byggeri skal hænge{' '}
                  <span className="italic font-serif font-normal">sammen</span>
                </>
              ) : (
                <>
                  Where aesthetics and construction come{' '}
                  <span className="italic font-serif font-normal">together</span>
                </>
              )}
            </motion.h1>

            <TransitionLink
              href="/booking"
              topic="Renovering"
              onMouseMove={handleMagneticMove as any}
              onMouseLeave={handleMagneticLeave}
              data-testid="hero-book-button"
              style={{
                transform: `translate3d(${magneticOffset.x}px, ${magneticOffset.y}px, 0)`,
              }}
              className="mt-5 group relative overflow-hidden px-7 py-3.5 rounded-full bg-white text-[#120F17] font-medium text-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 shadow-lg"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[#120F17] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full"
              />
              <motion.span
                key={`hero-cta-${lang}`}
                initial={{ y: 7, opacity: 0.65 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 transition-colors duration-300 group-hover:text-white"
              >
                {lang === 'DA' ? 'Book en samtale' : 'Book a consultation'}
              </motion.span>
              <span className="relative z-10 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </TransitionLink>
          </div>

          {/* Bottom-Right: Compact Liquid Glass Pill (GlassSurface: width=245/270, height=56, borderRadius=28) */}
          <div data-testid="hero-rating-badge" className="z-20 shrink-0">
            <GlassSurface
              width={glassPillConfig.width}
              height={glassPillConfig.height}
              borderRadius={glassPillConfig.borderRadius}
              refraction={true}
              className="shrink-0"
            >
              <div className="w-full px-3 py-1.5 flex items-center gap-2.5">
                {/* 3 Crisp High-Resolution Circular Client Avatars */}
                <div className="flex -space-x-2 overflow-hidden shrink-0">
                  {avatarSrcs.map((src, idx) => (
                    <img
                      key={idx}
                      className="h-7 w-7 rounded-full ring-1 ring-white/40 object-cover"
                      src={src}
                      onError={() => handleAvatarError(idx)}
                      referrerPolicy="no-referrer"
                      alt={`Client ${idx + 1}`}
                    />
                  ))}
                </div>
                <motion.div
                  key={`hero-pill-text-${lang}`}
                  initial={{ y: 7, opacity: 0.65 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col justify-center text-left min-w-0"
                >
                  <span className="text-xs font-semibold text-white leading-tight truncate">
                    {lang === 'DA' ? '150+ Hjem' : '150+ Homes'}
                  </span>
                  <span className="text-[10px] text-white/75 leading-tight font-light truncate">
                    {lang === 'DA' ? 'Gennemført med omtanke' : 'Crafted with care'}
                  </span>
                </motion.div>
              </div>
            </GlassSurface>
          </div>
        </div>
      </div>

      {/* 5. SUB-HERO SCROLL-FILL STATEMENT SECTION (LARGER TYPOGRAPHY + COMPLETE VIEWPORT FILL) */}
      <div
        ref={statementSectionRef}
        data-testid="hero-subtext-section"
        className="py-28 sm:py-36 md:py-44 px-6 md:px-14 bg-[#EEEDE7] border-none"
      >
        <motion.p
          key={`sub-hero-statement-${lang}`}
          initial={{ y: 7, opacity: 0.65 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          data-testid="sub-hero-statement-paragraph"
          className="max-w-5xl mx-auto text-3xl sm:text-4xl md:text-[48px] lg:text-[56px] font-semibold leading-[1.24] tracking-tight"
        >
          {statementWords.map((word, idx) => (
            <React.Fragment key={`${lang}-${idx}`}>
              <span
                ref={(el) => {
                  wordRefs.current[idx] = el;
                }}
                data-testid="sub-hero-word"
                style={{ color: 'rgba(18, 15, 23, 0.16)' }}
                className="inline-block whitespace-nowrap"
              >
                {word}
              </span>
              {idx < statementWords.length - 1 ? ' ' : ''}
            </React.Fragment>
          ))}
        </motion.p>
      </div>
    </section>
  );
};
