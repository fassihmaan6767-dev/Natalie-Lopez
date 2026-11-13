import React, { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { SERVICES_DATA, ServiceItem, Language } from '../data/portfolioData';
import { computeServiceCardTilt } from '../utils/preloaderMath';
import { RevealText, KineticLangBlock } from './ui/RevealHeading';
import { SplitText } from './ui/SplitText';
import { AnimatedContent } from './ui/AnimatedContent';
import { TransitionLink } from '../context/PageTransitionContext';

interface ServicesProps {
  lang?: Language;
  onSelectService: (serviceTitle: string) => void;
}

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
  lang: Language;
  isGridActive: boolean;
  cardRef: (el: HTMLElement | null) => void;
  onSelectService: (serviceTitle: string) => void;
}

/**
 * Interactive `<ServiceCard>` component with:
 * 1. Permanent production-safe 2-layer physical inset border glow (`rounded-3xl p-[1.5px]` + solid `#EEEDE7` interior).
 * 2. Subtle 3D perspective tilt (strictly clamped to max ±3.5deg on rotateX/rotateY)
 *    with a gentle `translateY(-4px)` and `scale(1.01)` hover float.
 */
const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  index,
  lang,
  isGridActive,
  cardRef,
  onSelectService,
}) => {
  const localRef = useRef<HTMLElement | null>(null);

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rawTranslateY = useMotionValue(0);
  const rawScale = useMotionValue(1);

  const rotateX = useSpring(rawRotateX, { stiffness: 260, damping: 26, mass: 0.6 });
  const rotateY = useSpring(rawRotateY, { stiffness: 260, damping: 26, mass: 0.6 });
  const translateY = useSpring(rawTranslateY, { stiffness: 260, damping: 26, mass: 0.6 });
  const scale = useSpring(rawScale, { stiffness: 260, damping: 26, mass: 0.6 });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = localRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const tilt = computeServiceCardTilt({
      clientX: e.clientX,
      clientY: e.clientY,
      rectLeft: rect.left,
      rectTop: rect.top,
      rectWidth: rect.width,
      rectHeight: rect.height,
      maxDeg: 3.5,
    });

    el.style.setProperty('--mouse-x', `${tilt.mouseX}px`);
    el.style.setProperty('--mouse-y', `${tilt.mouseY}px`);
    rawRotateX.set(tilt.rotateX);
    rawRotateY.set(tilt.rotateY);
    rawTranslateY.set(-4);
    rawScale.set(1.01);
  };

  const handleCardMouseLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
    rawTranslateY.set(0);
    rawScale.set(1);
  };

  const displayTitle = lang === 'DA' ? service.title : service.titleEn;
  const displayDescription = lang === 'DA' ? service.description : service.descriptionEn;

  return (
    <div style={{ perspective: '1000px' }} className="h-full">
      {/* Layer 1: Outer Border Wrapper (rounded-3xl p-[1.5px] overflow-hidden bg-[#120F17]/10) */}
      <motion.article
        ref={(el) => {
          localRef.current = el;
          cardRef(el);
        }}
        data-testid={`service-card-${service.number}`}
        onMouseMove={handleCardMouseMove}
        onMouseLeave={handleCardMouseLeave}
        style={{
          rotateX,
          rotateY,
          y: translateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
        className="group relative h-full rounded-3xl p-[1.5px] overflow-hidden bg-[#120F17]/10 will-change-transform"
      >
        {/* Mouse-following spotlight layer (physically occluded in interior by solid inner card surface) */}
        <div
          aria-hidden="true"
          data-testid={`service-card-glow-${service.number}`}
          style={{
            background:
              'radial-gradient(240px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(158, 139, 120, 0.85), rgba(18, 15, 23, 0.2) 45%, transparent 75%)',
          }}
          className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
            isGridActive ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Layer 2: Inner Solid Card Surface (rounded-[calc(1.5rem-1.5px)] bg-[#EEEDE7] w-full h-full z-10) */}
        <div className="relative rounded-[calc(1.5rem-1.5px)] bg-[#EEEDE7] w-full h-full z-10 p-7 sm:p-9 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono-counter text-[#120F17]/55 pb-5 border-b border-[#120F17]/10">
              <span>{service.number}</span>
              <span>0{index + 1} / 03</span>
            </div>

            <KineticLangBlock langKey={`service-${service.number}-${lang}`}>
              <h3 className="font-serif-display text-2xl sm:text-3xl text-[#120F17] mt-5 font-normal">
                {service.number} {displayTitle}
              </h3>

              <p className="mt-3.5 text-sm sm:text-base leading-relaxed text-[#120F17]/80">
                {displayDescription}
              </p>
            </KineticLangBlock>
          </div>

          <div className="mt-8 pt-5 border-t border-[#120F17]/10 flex items-center justify-between gap-4">
            <TransitionLink
              href="/booking"
              topic={service.title}
              data-testid={`service-book-link-${service.number}`}
              className="text-xs font-medium text-[#120F17] group-hover:underline underline-offset-4 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <motion.span
                key={`service-btn-${service.number}-${lang}`}
                initial={{ y: 7, opacity: 0.65 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              >
                {lang === 'DA' ? `Vælg ${displayTitle}` : `Select ${displayTitle}`}
              </motion.span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </TransitionLink>
          </div>
        </div>
      </motion.article>
    </div>
  );
};

export const Services: React.FC<ServicesProps> = ({ lang = 'DA', onSelectService }) => {
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [isGridActive, setIsGridActive] = useState<boolean>(false);

  const handleGridMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isGridActive) setIsGridActive(true);
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
    setIsGridActive(false);
    cardRefs.current.forEach((cardEl) => {
      if (!cardEl) return;
      cardEl.style.setProperty('--mouse-x', '-999px');
      cardEl.style.setProperty('--mouse-y', '-999px');
    });
  };

  return (
    <section
      id="ydelser"
      data-testid="services-section"
      className="py-20 md:py-28 px-6 sm:px-10 border-t border-[#120F17]/12"
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <RevealText
            as="p"
            className="text-xs uppercase tracking-[0.22em] text-[#120F17]/60 font-medium"
          >
            {lang === 'DA' ? 'Ydelser' : 'Services'}
          </RevealText>

          <SplitText
            tag="h2"
            text={
              lang === 'DA'
                ? 'Vælg den løsning, der passer til dit projekt'
                : 'Choose the solution that fits your project'
            }
            splitType="words,chars"
            mask={true}
            effect="rise"
            duration={1.0}
            delay={25}
            textAlign="left"
            className="font-serif-display text-3xl sm:text-5xl text-[#120F17] mt-3 font-normal tracking-tight"
          />
        </div>

        <div
          data-testid="services-cards-grid"
          onMouseMove={handleGridMouseMove}
          onMouseLeave={handleGridMouseLeave}
          className="mt-14"
        >
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
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {SERVICES_DATA.map((service, idx) => (
              <ServiceCard
                key={service.number}
                service={service}
                index={idx}
                lang={lang}
                isGridActive={isGridActive}
                cardRef={(el) => {
                  cardRefs.current[idx] = el;
                }}
                onSelectService={onSelectService}
              />
            ))}
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
};
