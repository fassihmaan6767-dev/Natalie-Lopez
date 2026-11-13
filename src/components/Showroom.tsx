import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Language,
  SHOWROOM_IMAGE_URL,
  SHOWROOM_IMAGE_FALLBACK,
} from '../data/portfolioData';
import { RevealText, KineticLangBlock } from './ui/RevealHeading';
import { SplitText } from './ui/SplitText';
import { AnimatedContent } from './ui/AnimatedContent';
import { TransitionLink } from '../context/PageTransitionContext';

gsap.registerPlugin(ScrollTrigger);

interface ShowroomProps {
  lang?: Language;
  onBookVisit: () => void;
}

/**
 * 10. "SHOWROOM, STRANDVEJEN" (`BOOK ET BESØG →`) WITH DEDICATED SHOWROOM IMAGE
 * - 2-column showcase: `max-w-6xl mx-auto px-6 sm:px-8 md:px-14 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-center`
 * - Left Column (`lg:col-span-6 text-left`):
 *   - Baseline-animated heading: `Showroom, Strandvejen`
 *   - Subheading: `Et sted skabt til beslutninger` (DA) / `A space made for decisions` (EN)
 *   - Body text + interactive CTA `Book et besøg →` / `Book a visit →` with arrow glide hover micro-interaction.
 * - Right Column (`lg:col-span-6`):
 *   - Hosted Showroom image (`https://i.ibb.co/bg8sj870/4813c938-d72e-4d3b-8fa0-d167ebce350b.webp`)
 *   - `w-full aspect-[4/3] rounded-2xl overflow-hidden relative bg-[#E3E1D9] shadow-sm`
 *   - GSAP ScrollTrigger corner-expand mask reveal (`clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)` to `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)`) with smooth scale (`1.12` -> `1.0`).
 */
export const Showroom: React.FC<ShowroomProps> = ({ lang = 'DA', onBookVisit }) => {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imgSrc, setImgSrc] = useState<string>(SHOWROOM_IMAGE_URL);

  useEffect(() => {
    const frameEl = frameRef.current;
    const imgEl = imgRef.current;
    if (!frameEl || !imgEl) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        frameEl,
        {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 1.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: frameEl,
            start: 'top 85%',
            toggleActions: 'play none none reset',
          },
        }
      );

      gsap.fromTo(
        imgEl,
        {
          scale: 1.12,
          transformOrigin: 'bottom left',
        },
        {
          scale: 1.0,
          transformOrigin: 'bottom left',
          duration: 1.25,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: frameEl,
            start: 'top 85%',
            toggleActions: 'play none none reset',
          },
        }
      );
    }, frameEl);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="booking"
      data-testid="showroom-section"
      className="border-t border-[#120F17]/12 bg-[#EEEDE7]"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-14 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-center">
        {/* Left Column — Editorial Showroom Details (lg:col-span-6 text-left) */}
        <div className="lg:col-span-6 text-left space-y-6">
          <RevealText
            as="p"
            className="text-xs uppercase tracking-[0.22em] text-[#120F17]/60 font-medium"
          >
            Strandvejen 153 · 2900 Hellerup
          </RevealText>

          <SplitText
            tag="h2"
            text="Showroom, Strandvejen"
            splitType="words,chars"
            mask={true}
            effect="rise"
            duration={1.0}
            delay={25}
            textAlign="left"
            className="font-serif-display text-3xl sm:text-5xl text-[#120F17] font-normal tracking-tight"
          />

          <AnimatedContent
            animateOpacity
            blur="{6}"
            direction="vertical"
            distance="{45}"
            duration="{0.85}"
            ease="power3.out"
            initialOpacity="{0}"
            stagger="{0.08}"
            threshold="{0.12}"
          >
            <KineticLangBlock langKey={`showroom-copy-${lang}`} className="space-y-6">
              <p className="font-serif-display text-xl sm:text-2xl italic text-[#120F17]/80">
                {lang === 'DA'
                  ? 'Et sted skabt til beslutninger'
                  : 'A space made for decisions'}
              </p>

              <p className="text-base sm:text-lg leading-relaxed text-[#120F17]/80 max-w-[56ch]">
                {lang === 'DA'
                  ? 'Fra natursten og træ til armaturer og tekstiler. Showroomet samler materialer og løsninger, så du kan opleve helheden, før projektet bliver til virkelighed.'
                  : 'From natural stone and wood to fixtures and textiles. The showroom brings materials and solutions together so you can experience the whole before the project becomes reality.'}
              </p>

              <div className="pt-2">
                <TransitionLink
                  href="/booking?topic=showroom"
                  topic="Showroom besøg"
                  data-testid="showroom-book-button"
                  className="group px-7 py-4 rounded-full bg-[#120F17] text-[#EEEDE7] text-xs sm:text-sm font-medium tracking-wide hover:bg-[#272230] transition-colors inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>{lang === 'DA' ? 'Book et besøg' : 'Book a visit'}</span>
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </TransitionLink>
              </div>
            </KineticLangBlock>
          </AnimatedContent>
        </div>

        {/* Right Column — Hosted Showroom Feature Image (lg:col-span-6) */}
        <div className="lg:col-span-6">
          <div
            ref={frameRef}
            data-testid="showroom-image-container"
            style={{
              clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
            }}
            className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative bg-[#E3E1D9] shadow-sm border border-[#120F17]/12"
          >
            <img
              ref={imgRef}
              data-testid="showroom-feature-image"
              src={imgSrc}
              referrerPolicy="no-referrer"
              alt="Showroom Strandvejen - Natalie Lopez"
              onError={() => {
                if (imgSrc !== SHOWROOM_IMAGE_FALLBACK) {
                  setImgSrc(SHOWROOM_IMAGE_FALLBACK);
                }
              }}
              style={{ transformOrigin: 'bottom left' }}
              className="w-full h-full object-cover will-change-transform"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
