import React from 'react';
import { PROCESS_STEPS, Language } from '../data/portfolioData';
import { RevealText, KineticLangBlock } from './ui/RevealHeading';
import { SplitText } from './ui/SplitText';
import { AnimatedContent } from './ui/AnimatedContent';

interface ProcessProps {
  lang?: Language;
}

/**
 * 8. "SÅDAN ARBEJDER VI / HOW WE WORK" SECTION (OPEN 5-COLUMN CONTRASTING BAND — STRICTLY NO BOXES)
 * - Contrasting Full-Width Background Tone: `w-full bg-[#D5CFC3] text-[#120F17] py-24 sm:py-28 md:py-36`
 * - Left-Aligned Architectural Header (`max-w-7xl mx-auto px-6 sm:px-10 md:px-16`):
 *   - Eyebrow: `text-[11px] font-mono tracking-[0.22em] uppercase text-[#8C7A6B] mb-3` (`SÅDAN ARBEJDER VI` / `HOW WE WORK`)
 *   - Main Title: `font-serif font-light text-3xl sm:text-4xl md:text-5xl lg:text-[52px] text-[#120F17] tracking-tight leading-[1.15]`
 * - Open 5-Column Layout with Thin Vertical Hairline Dividers (NO Boxes or Cards):
 *   - `mt-14 md:mt-16 lg:pl-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-y-10 lg:gap-y-0`
 *   - Desktop dividers: `lg:[&:not(:first-child)]:border-l lg:border-[#120F17]/18 lg:pl-7 lg:pr-5 first:lg:pr-5`
 *   - Mobile dividers: `border-t border-[#120F17]/15 pt-6 lg:border-t-0 lg:pt-0`
 *   - Step Anatomy (`text-left flex flex-col items-start`):
 *     - Italic Muted Taupe Numeral: `text-2xl md:text-[28px] font-light italic text-[#9E8B78] leading-none mb-4`
 *     - Editorial Serif Step Title: `font-serif text-lg md:text-xl font-normal text-[#120F17] mb-3`
 *     - Clean Body Copy: `text-xs sm:text-[13px] leading-[1.65] text-[#120F17]/75 max-w-[220px]`
 */
export const Process: React.FC<ProcessProps> = ({ lang = 'DA' }) => {
  return (
    <section
      id="proces"
      data-testid="process-section"
      className="w-full bg-[#D5CFC3] text-[#120F17] py-24 sm:py-28 md:py-36"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
        {/* Left-Aligned Architectural Header */}
        <div className="text-left">
          <RevealText
            as="p"
            wrapperClassName="mb-3"
            className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#8C7A6B]"
          >
            {lang === 'DA' ? 'SÅDAN ARBEJDER VI' : 'HOW WE WORK'}
          </RevealText>

          <SplitText
            tag="h2"
            text={
              lang === 'DA'
                ? 'En gennemtænkt proces fra start til slut'
                : 'A thoughtful process from start to finish'
            }
            splitType="words,chars"
            mask={true}
            effect="rise"
            duration={1.0}
            delay={25}
            textAlign="left"
            className="font-serif font-light text-3xl sm:text-4xl md:text-5xl lg:text-[52px] text-[#120F17] tracking-tight leading-[1.15]"
          />
        </div>

        {/* Open 5-Column Layout with Thin Vertical Hairline Dividers (Strictly NO Boxes or Cards) */}
        <AnimatedContent
          animateOpacity
          blur="{6}"
          direction="vertical"
          distance={28}
          duration={0.85}
          ease="power3.out"
          initialOpacity={0}
          stagger={0.08}
          threshold={0.12}
          data-testid="process-open-columns"
          className="mt-14 md:mt-16 lg:pl-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-y-10 lg:gap-y-0"
        >
          {PROCESS_STEPS.map((step) => {
            const displayTitle = lang === 'DA' ? step.title : step.titleEn;
            const displayDescription = lang === 'DA' ? step.description : step.descriptionEn;
            return (
              <div
                key={step.number}
                data-testid={`process-step-${step.number}`}
                className="text-left flex flex-col items-start border-t border-[#120F17]/15 pt-6 lg:border-t-0 lg:pt-0 lg:[&:not(:first-child)]:border-l lg:border-[#120F17]/18 lg:pl-7 lg:pr-5 first:lg:pr-5"
              >
                {/* Italic Muted Taupe Numeral */}
                <span
                  data-testid={`process-step-numeral-${step.number}`}
                  className="font-serif text-2xl md:text-[28px] font-light italic text-[#9E8B78] leading-none mb-4 select-none"
                >
                  {step.number}
                </span>

                <KineticLangBlock langKey={`process-step-${step.number}-${lang}`}>
                  {/* Editorial Serif Step Title */}
                  <h3 className="font-serif text-lg md:text-xl font-normal text-[#120F17] mb-3">
                    {displayTitle}
                  </h3>

                  {/* Clean Body Copy */}
                  <p className="text-xs sm:text-[13px] leading-[1.65] text-[#120F17]/75 max-w-[220px]">
                    {displayDescription}
                  </p>
                </KineticLangBlock>
              </div>
            );
          })}
        </AnimatedContent>
      </div>
    </section>
  );
};
