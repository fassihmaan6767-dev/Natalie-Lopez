import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { PROJECT_CAROUSEL_ITEMS, ProjectCarouselItem, Language } from '../data/portfolioData';
import { getResponsiveFlexCarouselConfig } from '../utils/preloaderMath';
import { FlexCarousel } from './ui/FlexCarousel';
import { RevealText } from './ui/RevealHeading';
import { SplitText } from './ui/SplitText';

interface ProjectsProps {
  lang: Language;
}

/**
 * 8. UDVALGTE SAGER (RESTORED IMGBB CAROUSEL + AUTOMATIC CAPTION & LIGHTBOX SCENE)
 * 1. Single-Viewport Fit (`100svh` Layout — No Clipped Heading on Desktop or Mobile):
 *    `w-full h-[100svh] min-h-[620px] max-h-[100svh] pt-24 md:pt-28 pb-8 md:pb-12 flex flex-col justify-between items-center overflow-hidden bg-[#EEEDE7]`
 * 2. Compact Centered Header (`shrink-0 mb-3 md:mb-5 px-4 text-center`):
 *    - Eyebrow (`UDVALGTE SAGER` / `SELECTED WORKS`) + Main Title (`Fra rum til helhed` / `From space to whole`, `text-3xl sm:text-4xl md:text-5xl`) + 1px divider line.
 * 3. Responsive `FlexCarousel` Container (`w-full flex-1 min-h-0 max-h-[480px] md:max-h-[540px] relative flex items-center justify-center`):
 *    - Desktop (`>= 768px`): `cardHeight={0.56}`, `gap={12}`, `squeeze={0.18}`, `lensWidth={0.74}`, `lensHeight={1.12}`, `tilt={58}`, `bend={0.32}`, `reach={0.36}`, `captions`, `focusOnClick`.
 *    - Mobile (`< 768px`): `cardHeight={0.66}`, `gap={10}`, `squeeze={0.04}`, `lensWidth={1.12}`, `lensHeight={1.02}`, `tilt={22}`, `bend={0.16}`, `reach={0.24}`, `captions`, `focusOnClick`.
 * 4. Fullscreen Lightbox Modal (`fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl`).
 */
export const Projects: React.FC<ProjectsProps> = ({ lang }) => {
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );
  const [lightboxItem, setLightboxItem] = useState<ProjectCarouselItem | null>(null);
  const [lightboxImgSrc, setLightboxImgSrc] = useState<string>('');

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!lightboxItem) return;
    setLightboxImgSrc(lightboxItem.src);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxItem]);

  const responsiveConfig = getResponsiveFlexCarouselConfig(viewportWidth);

  return (
    <section
      id="udvalgte-sager"
      data-testid="projects-section"
      className="w-full h-[100svh] min-h-[620px] max-h-[100svh] pt-24 md:pt-28 pb-8 md:pb-12 flex flex-col justify-between items-center overflow-hidden bg-[#EEEDE7] border-t border-[#120F17]/12"
    >
      {/* 1. Compact Centered Header with Baseline Float-Up & Blur-to-Reveal Animation */}
      <div
        data-testid="projects-header-reveal"
        className="shrink-0 mb-3 md:mb-5 px-4 text-center flex flex-col items-center z-10"
      >
        <RevealText
          as="p"
          className="font-mono tracking-[0.25em] text-xs uppercase text-[#120F17]/70"
        >
          {lang === 'DA' ? 'UDVALGTE SAGER' : 'SELECTED WORKS'}
        </RevealText>

        <SplitText
          tag="h2"
          text={lang === 'DA' ? 'Fra rum til helhed' : 'From space to whole'}
          splitType="words,chars"
          mask={true}
          effect="rise"
          duration={1.0}
          delay={25}
          textAlign="center"
          className="mt-1.5 font-serif-display text-3xl sm:text-4xl md:text-5xl text-[#120F17] font-normal tracking-tight"
        />

        {/* Subtle 1px Divider Line */}
        <div
          data-testid="projects-header-divider"
          className="mt-3 w-40 sm:w-56 h-[1px] bg-[#120F17]/25 origin-center"
        />
      </div>

      {/* 2. Responsive FlexCarousel Container Fitting Remaining Viewport Height */}
      <div
        data-testid="full-bleed-carousel-wrapper"
        data-mobile={responsiveConfig.isMobile ? 'true' : 'false'}
        className="w-full flex-1 min-h-0 relative flex items-center justify-center overflow-hidden"
      >
        <div className="relative z-10 w-full h-full">
          <FlexCarousel
            items={PROJECT_CAROUSEL_ITEMS}
            lang={lang}
            preset="liquid"
            cardHeight={responsiveConfig.cardHeight}
            gap={responsiveConfig.gap}
            radius={0}
            lensWidth={responsiveConfig.lensWidth}
            lensHeight={responsiveConfig.lensHeight}
            tilt={responsiveConfig.tilt}
            roundness={1}
            bend={responsiveConfig.bend}
            reach={responsiveConfig.reach}
            curl="twist"
            dispersion={responsiveConfig.dispersion}
            squeeze={responsiveConfig.squeeze}
            autoplay={true}
            interval={2.2}
            focusOnClick={false}
            captions
            captureWheel={true}
            className="w-full h-full"
            onSelect={(_idx, item) => setLightboxItem(item)}
          />
        </div>
      </div>

      {/* 3. FULLSCREEN LIGHTBOX MODAL (Portaled to document.body) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {lightboxItem && (
              <motion.div
                key="project-lightbox-backdrop"
                data-testid="project-lightbox-modal"
                role="dialog"
                aria-modal="true"
                aria-label={lang === 'DA' ? lightboxItem.description : lightboxItem.descriptionEn}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                onClick={() => setLightboxItem(null)}
                className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
              >
                {/* Minimalist floating close button (✕) at top-right */}
                <button
                  type="button"
                  data-testid="project-lightbox-close"
                  aria-label={lang === 'DA' ? 'Luk billede' : 'Close image'}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxItem(null);
                  }}
                  className="fixed top-6 right-6 z-[110] w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  ✕
                </button>

                {/* Animated Image & Single Description Sentence Container */}
                <motion.div
                  data-testid="project-lightbox-content"
                  initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.92, filter: 'blur(10px)' }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col items-center max-w-[90vw]"
                >
                  <img
                    data-testid="project-lightbox-image"
                    src={lightboxImgSrc || lightboxItem.src}
                    referrerPolicy="no-referrer"
                    loading="eager"
                    onError={() => {
                      if (
                        lightboxItem.fallbackSrc &&
                        lightboxImgSrc !== lightboxItem.fallbackSrc
                      ) {
                        setLightboxImgSrc(lightboxItem.fallbackSrc);
                      }
                    }}
                    alt={`${lightboxItem.title} — ${lightboxItem.subtitle}`}
                    className="max-h-[75vh] max-w-[90vw] object-contain rounded-xl shadow-2xl select-none"
                  />

                  {/* Concise Side-by-Side Category & Location Tags (No long description or dividers) */}
                  <div
                    data-testid="project-lightbox-caption"
                    className="mt-5 flex items-center justify-center gap-3.5 text-center select-none"
                  >
                    <span
                      data-testid="project-lightbox-category"
                      className="text-[11px] font-mono tracking-[0.22em] uppercase text-white/60"
                    >
                      {lang === 'EN' && lightboxItem.titleEn
                        ? lightboxItem.titleEn
                        : lightboxItem.title}
                    </span>
                    <span aria-hidden="true" className="w-1 h-1 rounded-full bg-white/35" />
                    <span
                      data-testid="project-lightbox-location"
                      className="font-serif text-lg sm:text-xl font-light text-white tracking-normal"
                    >
                      {lightboxItem.subtitle}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
};
