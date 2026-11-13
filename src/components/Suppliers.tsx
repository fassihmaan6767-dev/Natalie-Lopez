import React, { useMemo } from 'react';
import { SUPPLIER_TRACK_1, SUPPLIER_TRACK_2, Language } from '../data/portfolioData';
import { SplitText } from './ui/SplitText';
import { AnimatedContent } from './ui/AnimatedContent';
import { LogoLoop } from './ui/LogoLoop';

interface SuppliersProps {
  lang?: Language;
}

/**
 * 9. "LEVERANDØRER / SUPPLIERS" SECTION USING REACT BITS `LogoLoop`
 * - Track 1 (`direction="left"`, `speed={48}`, `logoHeight={26}`, `gap={52}`, `fadeOut`, `fadeOutWidth={0.14}`, `hoverSpeed={0}`, `scaleOnHover`, `draggable`):
 *   17 luxury brands (Poliform .. Bomma)
 * - Track 2 (`direction="right"`, `speed={42}`, `logoHeight={26}`, `gap={52}`, `fadeOut`, `fadeOutWidth={0.14}`, `hoverSpeed={0}`, `scaleOnHover`, `draggable`):
 *   16 luxury brands (Gallotti & Radice .. J. Adams & Co)
 */
export const Suppliers: React.FC<SuppliersProps> = ({ lang = 'DA' }) => {
  const track1Nodes = useMemo(
    () =>
      SUPPLIER_TRACK_1.map((brandName) => ({
        title: brandName,
        node: (
          <span className="font-serif text-xl sm:text-2xl md:text-[26px] tracking-[0.08em] uppercase text-[#120F17]/75 hover:text-[#120F17] transition-colors duration-300 px-2">
            {brandName}
          </span>
        ),
      })),
    []
  );

  const track2Nodes = useMemo(
    () =>
      SUPPLIER_TRACK_2.map((brandName) => ({
        title: brandName,
        node: (
          <span className="font-serif text-xl sm:text-2xl md:text-[26px] tracking-[0.08em] uppercase text-[#120F17]/75 hover:text-[#120F17] transition-colors duration-300 px-2">
            {brandName}
          </span>
        ),
      })),
    []
  );

  return (
    <section
      id="leverandorer"
      data-testid="suppliers-section"
      className="py-20 md:py-28 border-t border-[#120F17]/12 bg-[#E6E4DC]/45 overflow-hidden"
    >
      <div id="leverandoerer" className="sr-only" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="max-w-2xl">
          <SplitText
            tag="h2"
            text={lang === 'DA' ? 'Leverandører' : 'Suppliers'}
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
            threshold="{0.12}"
          >
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#120F17]/80">
              {lang === 'DA'
                ? 'Leverandører og brands, som jeg ofte vender tilbage til på grund af deres kvalitet, håndværk og materialer.'
                : 'Suppliers and brands I frequently return to for their quality, craftsmanship, and materials.'}
            </p>
          </AnimatedContent>
        </div>
      </div>

      {/* Two Opposing Editorial Brand Tracks via React Bits LogoLoop */}
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
        className="mt-14 space-y-8"
      >
        <div data-testid="suppliers-loop-track-1" className="py-3 border-t border-b border-[#120F17]/10">
          <LogoLoop
            logos={track1Nodes}
            direction="left"
            speed={48}
            logoHeight={26}
            gap={52}
            fadeOut
            fadeOutWidth={0.14}
            hoverSpeed={0}
            scaleOnHover
            draggable
            ariaLabel={lang === 'DA' ? 'Leverandører spor 1' : 'Suppliers track 1'}
          />
        </div>

        <div data-testid="suppliers-loop-track-2" className="py-3 border-t border-b border-[#120F17]/10">
          <LogoLoop
            logos={track2Nodes}
            direction="right"
            speed={42}
            logoHeight={26}
            gap={52}
            fadeOut
            fadeOutWidth={0.14}
            hoverSpeed={0}
            scaleOnHover
            draggable
            ariaLabel={lang === 'DA' ? 'Leverandører spor 2' : 'Suppliers track 2'}
          />
        </div>
      </AnimatedContent>
    </section>
  );
};
