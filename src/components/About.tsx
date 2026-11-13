import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ABOUT_PILLARS,
  Language,
  NATALIE_PORTRAIT_URL,
  NATALIE_PORTRAIT_FALLBACK,
} from '../data/portfolioData';
import { KineticLangBlock } from './ui/RevealHeading';
import { SplitText } from './ui/SplitText';
import { AnimatedContent } from './ui/AnimatedContent';

gsap.registerPlugin(ScrollTrigger);

interface AboutProps {
  lang?: Language;
}

/**
 * 9. "OM NATALIE" SECTION: PRECISION ALIGNMENT (MOBILE & DESKTOP) + CORNER-EXPAND PORTRAIT
 * - Container: `max-w-6xl mx-auto px-6 sm:px-8 md:px-14 py-24 md:py-36`
 * - Grid: `grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-16 items-stretch`
 * - Left Column (`lg:col-span-5`):
 *   `w-full max-w-md mx-auto lg:max-w-none aspect-[4/5] rounded-2xl overflow-hidden relative bg-[#E3E1D9]`
 *   with GSAP ScrollTrigger corner-expand reveal (`scrub: 0.8`, `start: "top 85%"`, `end: "top 35%"`)
 *   and inner `<img>` (`w-full h-full object-cover object-top`, `referrerPolicy="no-referrer"`) scaling from `1.18` to `1.0`.
 * - Right Column (`lg:col-span-7 flex flex-col justify-between text-left lg:pt-2`):
 *   Top Content Block (Heading + Bio Paragraphs) + Bottom Aligned 3 Expertise Pillars (`items-end`).
 */
export const About: React.FC<AboutProps> = ({ lang = 'DA' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [portraitSrc, setPortraitSrc] = useState<string>(NATALIE_PORTRAIT_URL);

  useEffect(() => {
    const containerEl = containerRef.current;
    const imgEl = imgRef.current;
    if (!containerEl || !imgEl) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerEl,
        {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 1.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerEl,
            start: 'top 85%',
            toggleActions: 'play none none reset',
          },
        }
      );

      gsap.fromTo(
        imgEl,
        {
          scale: 1.18,
          transformOrigin: 'bottom left',
        },
        {
          scale: 1.0,
          transformOrigin: 'bottom left',
          duration: 1.25,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerEl,
            start: 'top 85%',
            toggleActions: 'play none none reset',
          },
        }
      );
    }, containerEl);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="om-natalie"
      data-testid="about-section"
      className="border-t border-[#120F17]/12 bg-[#E6E4DC]/35"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-14 py-24 md:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-16 items-stretch">
          {/* Left Column: Natalie Lopez Portrait (lg:col-span-5) */}
          <div className="lg:col-span-5 flex items-stretch">
            <div
              ref={containerRef}
              data-testid="about-portrait-container"
              style={{
                clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
              }}
              className="w-full max-w-md mx-auto lg:max-w-none aspect-[4/5] rounded-2xl overflow-hidden relative bg-[#E3E1D9] border border-[#120F17]/12"
            >
              <img
                ref={imgRef}
                src={portraitSrc}
                referrerPolicy="no-referrer"
                alt="Natalie Lopez — Indretningsarkitekt & Boligstylist"
                onError={() => {
                  if (portraitSrc !== NATALIE_PORTRAIT_FALLBACK) {
                    setPortraitSrc(NATALIE_PORTRAIT_FALLBACK);
                  }
                }}
                style={{ transformOrigin: 'bottom left' }}
                className="w-full h-full object-cover object-top will-change-transform"
              />
            </div>
          </div>

          {/* Right Column: Aligned Message & 3 Expertise Pillars (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col justify-between text-left lg:pt-2">
            {/* Top Content Block (Heading + Bio Paragraphs) */}
            <div>
              <SplitText
                tag="h2"
                text={lang === 'DA' ? 'Om Natalie' : 'About Natalie'}
                splitType="words,chars"
                mask={true}
                effect="rise"
                duration={1.0}
                delay={25}
                textAlign="left"
                className="mb-6 text-3xl sm:text-4xl md:text-5xl font-serif font-light tracking-tight text-[#120F17]"
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
                <KineticLangBlock
                  langKey={`about-bio-${lang}`}
                  className="space-y-4 text-base sm:text-[17px] leading-[1.75] text-[#120F17]/80 max-w-2xl"
                >
                  {lang === 'DA' ? (
                    <>
                      <p>
                        Min interesse for renovering opstod gennem egne projekter og en fascination
                        af, hvordan de rigtige valg kan forandre et hjem. Jeg oplevede, hvor svært
                        det kan være at skabe overblik, når design, håndværkere og utallige
                        beslutninger skal gå op i en højere enhed.
                      </p>
                      <p>
                        Gennem de seneste seks år har jeg arbejdet med renoveringer for private
                        boligejere og hjulpet med at skabe sammenhæng mellem æstetik, håndværk og
                        udførelse. Mit mål er altid det samme: at skabe overblik, træffe de rigtige
                        valg og føre en vision sikkert fra idé til færdigt hjem.
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        My interest in renovation grew out of my own projects and a fascination with
                        how the right choices can transform a home. I experienced firsthand how
                        challenging it can be to maintain clarity when design, craftsmen, and
                        countless decisions need to come together into a unified whole.
                      </p>
                      <p>
                        Over the past six years, I have worked on renovations for private
                        homeowners, helping bridge aesthetics, craftsmanship, and execution. My goal
                        is always the same: to create overview, make the right choices, and guide a
                        vision safely from idea to finished home.
                      </p>
                    </>
                  )}
                </KineticLangBlock>
              </AnimatedContent>
            </div>

            {/* Bottom Aligned 3 Expertise Pillars Grid */}
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
              className="mt-10 pt-8 border-t border-[#120F17]/12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 items-end"
            >
              {ABOUT_PILLARS.map((pillar) => (
                <KineticLangBlock
                  key={pillar.title}
                  langKey={`pillar-${pillar.title}-${lang}`}
                  className="flex flex-col gap-1.5 text-left"
                >
                  <h3 className="font-serif text-lg md:text-xl text-[#120F17] font-normal">
                    {lang === 'DA' ? pillar.title : pillar.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#120F17]/65">
                    {lang === 'DA' ? pillar.subtitle : pillar.subtitleEn}
                  </p>
                </KineticLangBlock>
              ))}
            </AnimatedContent>
          </div>
        </div>
      </div>
    </section>
  );
};
