import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Instagram, Mail, MapPin } from 'lucide-react';
import { Language } from '../data/portfolioData';
import { TechText } from './ui/TechText';
import { SplitText } from './ui/SplitText';
import { TransitionLink, usePageTransition } from '../context/PageTransitionContext';

gsap.registerPlugin(ScrollTrigger);

interface FooterProps {
  lang?: Language;
}

/**
 * 4. AWWWARDS FOOTER WITH `TechText` ("Natalie Lopez"), STACKED CARD ELEVATION & SCROLL PARALLAX
 * - Dark obsidian/espresso background (`relative z-30 bg-[#120F17] text-[#EEEDE7] rounded-t-[32px] md:rounded-t-[48px] shadow-[0_-24px_70px_rgba(0,0,0,0.35)]`)
 * - Inner parallax container (`footerInnerRef`) linked to GSAP ScrollTrigger (`start: 'top bottom'`, `end: 'bottom bottom'`, `scrub: 0.6`)
 *   animating `y: -90, scale: 0.96, opacity: 0.75` -> `y: 0, scale: 1, opacity: 1`
 * - Interactive `<TechText text="Natalie Lopez" ... />` Display Signature
 * - Two-tier non-overlapping bar directly beneath `<TechText />`:
 *   - Tier 1: Contact, Social, Address & Company/CVR
 *   - Tier 2: Legal TransitionLinks (`/cookiepolitik`, `/persondatapolitik`, `/handelsbetingelser`), `Cookie-indstillinger` button, & Copyright
 */
export const Footer: React.FC<FooterProps> = ({ lang = 'DA' }) => {
  const { currentPath } = usePageTransition();
  const isBookingPage = currentPath === '/booking';

  const footerRef = useRef<HTMLElement | null>(null);
  const footerInnerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const footerEl = footerRef.current;
    const innerEl = footerInnerRef.current;
    if (!footerEl || !innerEl) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerEl,
        {
          y: -75,
          scale: 0.97,
          transformOrigin: 'center bottom',
        },
        {
          y: 0,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: footerEl,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
          },
        }
      );
    }, footerEl);

    return () => {
      ctx.revert();
    };
  }, [currentPath]);

  return (
    <footer
      ref={footerRef}
      data-testid="footer-section"
      className="relative z-30 bg-[#120F17] text-[#EEEDE7] rounded-t-[32px] md:rounded-t-[48px] shadow-[0_-24px_70px_rgba(0,0,0,0.35)] overflow-hidden select-none"
    >
      <div
        ref={footerInnerRef}
        data-testid="footer-parallax-inner"
        className="will-change-transform"
      >
        {/* Top Booking CTA Block (shown on editorial routes; hidden on /booking itself to avoid redundancy) */}
        {!isBookingPage && (
          <div
            data-testid="footer-booking-cta"
            className="pt-24 pb-12 px-6 max-w-3xl mx-auto text-center flex flex-col items-center"
          >
            <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#EEEDE7]/55">
              {lang === 'DA' ? 'NÆSTE SKRIDT' : 'NEXT STEP'}
            </p>

            <SplitText
              tag="h2"
              text={lang === 'DA' ? 'Lad os tale om dit projekt' : "Let's talk about your project"}
              splitType="words,chars"
              mask={true}
              effect="rise"
              duration={1.0}
              delay={25}
              textAlign="center"
              className="mt-3 font-serif-display text-3xl sm:text-4xl md:text-5xl text-[#EEEDE7] font-normal tracking-tight leading-[1.15]"
            />

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#EEEDE7]/75 max-w-xl font-light">
              {lang === 'DA'
                ? 'Alle projekter starter med en god dialog. Fortæl mig om dine planer, så tager vi den derfra.'
                : 'Every project begins with a good conversation. Tell me about your plans, and we will take it from there.'}
            </p>

            <div className="mt-8">
              <TransitionLink
                href="/booking"
                data-testid="footer-book-button"
                className="px-7 py-3.5 rounded-full border border-[#EEEDE7]/25 bg-[#EEEDE7]/10 hover:bg-[#EEEDE7] hover:text-[#120F17] text-[#EEEDE7] text-xs font-mono tracking-[0.2em] uppercase transition-all duration-300 inline-flex items-center gap-2.5 cursor-pointer"
              >
                <span>{lang === 'DA' ? 'BOOK EN SAMTALE' : 'BOOK A CONSULTATION'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </TransitionLink>
            </div>
          </div>
        )}

        {/* Interactive TechText Display Signature ("Natalie Lopez") */}
        <div className="w-full h-[140px] sm:h-[200px] md:h-[260px] my-6 pt-6">
          <TechText
            text="Natalie Lopez"
            fontFamily="Playfair Display, Georgia, serif"
            fontWeight={400}
            fontSize={160}
            color="#EEEDE7"
            accentColor="#A89F91"
            reach={180}
            dashLength={4}
            dashGap={3}
            strokeWidth={1.2}
            guides={false}
            intro="metrics"
            introDuration={0.9}
          />
        </div>

        {/* Spacious, Non-Overlapping Two-Tier Footer Bar Directly Beneath TechText */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-14 pt-8 border-t border-[#EEEDE7]/12 flex flex-col gap-6">
          {/* Tier 1 — Contact, Social & Address */}
          <div
            data-testid="footer-info-row"
            className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 text-xs sm:text-sm text-[#EEEDE7]/75"
          >
            <a
              href="https://www.instagram.com/Natalielopezdesign"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-instagram-link"
              className="inline-flex items-center gap-2 hover:text-[#EEEDE7] hover:underline underline-offset-4 transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 text-[#A89F91] shrink-0" />
              <span>Natalielopezdesign</span>
            </a>

            <a
              href="mailto:kontakt@natalielopez.dk"
              data-testid="footer-email-link"
              className="inline-flex items-center gap-2 hover:text-[#EEEDE7] hover:underline underline-offset-4 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#A89F91] shrink-0" />
              <span>kontakt@natalielopez.dk</span>
            </a>

            <a
              href="https://www.google.com/maps/place/Strandvejen+153,+2900+Gentofte,+Denmark/@55.7310307,12.5732034,17z/data=!3m1!4b1!4m6!3m5!1s0x4652527dc7986d03:0xcc8f36e5211ee20c!8m2!3d55.7310277!4d12.5757783!16s%2Fg%2F11bw3ww54t?entry=ttu&g_ep=EgoyMDI2MDkxNC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-maps-link"
              className="inline-flex items-center gap-2 hover:text-[#EEEDE7] hover:underline underline-offset-4 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#A89F91] shrink-0" />
              <span>Strandvejen 153, 2900 Hellerup, Denmark</span>
            </a>

            <span className="font-mono-counter text-xs sm:text-sm text-[#EEEDE7]/75">
              Natalie Lopez ApS · CVR 45 13 53 30
            </span>
          </div>

          {/* Tier 2 — Legal Links & Copyright (Zero Overlap) */}
          <div
            data-testid="footer-legal-row"
            className="pt-6 pb-12 border-t border-[#EEEDE7]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#EEEDE7]/55"
          >
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-7 gap-y-2">
              <TransitionLink
                href="/cookiepolitik"
                data-testid="footer-cookiepolitik-link"
                className="hover:text-[#EEEDE7] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
              >
                {lang === 'DA' ? 'Cookiepolitik' : 'Cookie Policy'}
              </TransitionLink>
              <TransitionLink
                href="/persondatapolitik"
                data-testid="footer-persondatapolitik-link"
                className="hover:text-[#EEEDE7] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
              >
                {lang === 'DA' ? 'Persondatapolitik' : 'Privacy Policy'}
              </TransitionLink>
              <TransitionLink
                href="/handelsbetingelser"
                data-testid="footer-handelsbetingelser-link"
                className="hover:text-[#EEEDE7] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
              >
                {lang === 'DA' ? 'Handelsbetingelser' : 'Terms & Conditions'}
              </TransitionLink>
              <button
                type="button"
                data-testid="footer-cookie-settings-btn"
                onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
                className="hover:text-[#EEEDE7] hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
              >
                {lang === 'DA' ? 'Cookie-indstillinger' : 'Cookie settings'}
              </button>
            </div>

            <div className="text-center sm:text-right shrink-0">
              © {new Date().getFullYear()} Natalie Lopez ApS · CVR 45 13 53 30
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
