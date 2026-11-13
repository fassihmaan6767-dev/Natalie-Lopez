import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MENU_OVERLAY_LINKS, MenuLinkItem, Language } from '../data/portfolioData';
import { TransitionLink, usePageTransition } from '../context/PageTransitionContext';

interface NavigationOverlayProps {
  isOpen: boolean;
  isScrolled?: boolean;
  lang: Language;
  onChangeLang: (lang: Language) => void;
  onToggle: () => void;
  onSelectLink: (item: MenuLinkItem) => void;
  headerLogoImgRef: React.RefObject<HTMLImageElement | null>;
  logoSrc: string;
  onLogoError: () => void;
}

/**
 * 2. HEADER: LARGER NATALIE LOPEZ LOGO, ADAPTIVE NEGATIVE MENU (`mix-blend-difference` -> solid `#120F17`) & `DA / EN` TOGGLE
 * 3. AWWWARDS-INSPIRED FULLSCREEN NAVIGATION OVERLAY (NO NUMBERS, NO SCROLLBAR, EDGE FADES)
 */
export const NavigationOverlay: React.FC<NavigationOverlayProps> = ({
  isOpen,
  isScrolled = false,
  lang,
  onChangeLang,
  onToggle,
  onSelectLink,
  headerLogoImgRef,
  logoSrc,
  onLogoError,
}) => {
  const { currentPath, navigate } = usePageTransition();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onToggle();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onToggle]);

  const hoverLabel = isOpen
    ? lang === 'DA'
      ? 'LUK'
      : 'CLOSE'
    : lang === 'DA'
      ? 'LUK OP'
      : 'OPEN';

  // At top of Hero video (!isScrolled && !isOpen && currentPath === '/'): mix-blend-difference + pure white
  // When scrolled past 45% of Hero OR when menu overlay is open OR on subpages: solid #120F17
  const useDarkMenuStyle = isScrolled || isOpen || currentPath !== '/';

  return (
    <>
      <header
        data-testid="site-header"
        className={`fixed top-0 left-0 w-full ${
          isOpen ? 'z-[70]' : 'z-50'
        } px-5 sm:px-8 md:px-14 py-2.5 md:py-3 flex items-center justify-between bg-transparent`}
      >
        {/* Left: Significantly Larger, Crisp & Clearly Visible Natalie Lopez Logo */}
        <TransitionLink
          href="/"
          id="header-logo-target"
          data-testid="header-brand-logo"
          aria-label="Natalie Lopez — Indretningsarkitekt & Boligstylist"
          onClick={() => {
            if (isOpen) {
              onToggle();
            }
          }}
          className="flex items-center shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#120F17]"
        >
          <img
            ref={headerLogoImgRef}
            src={logoSrc}
            onError={onLogoError}
            referrerPolicy="no-referrer"
            alt="Natalie Lopez"
            style={{
              imageRendering: '-webkit-optimize-contrast' as React.CSSProperties['imageRendering'],
            }}
            className="h-24 sm:h-28 md:h-28 lg:h-32 w-auto min-h-[96px] md:min-h-[112px] object-contain block transition-transform duration-300"
          />
        </TransitionLink>

        {/* Right-Side Controls Group (Awwwards Language Toggle + Adaptive Negative Menu Button) */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Awwwards-Style Instant Bilingual Language Toggle (DA / EN) */}
          <div
            data-testid="language-toggle"
            role="group"
            aria-label="Language switcher"
            className="h-8 sm:h-9 px-1 rounded-full border border-[#120F17]/20 bg-white/35 backdrop-blur-md flex items-center relative text-[11px] font-mono tracking-wider select-none"
          >
            {(['DA', 'EN'] as const).map((code) => {
              const isActive = lang === code;
              return (
                <motion.button
                  key={code}
                  type="button"
                  data-testid={`lang-btn-${code}`}
                  aria-pressed={isActive}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => onChangeLang(code)}
                  className={`relative z-10 px-2.5 h-6 sm:h-7 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? 'text-[#EEEDE7] font-medium'
                      : 'text-[#120F17]/75 hover:text-[#120F17]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="lang-pill"
                      transition={{ type: 'spring', stiffness: 520, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-[#120F17] -z-10"
                    />
                  )}
                  <span>{code}</span>
                </motion.button>
              );
            })}
          </div>

          {/* 3-Line Rolling Menu Trigger with Dynamic mix-blend-difference -> Solid #120F17 Switch */}
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls="fullscreen-navigation-overlay"
            aria-label={
              isOpen ? (lang === 'DA' ? 'Luk menu' : 'Close menu') : `MENU — ${hoverLabel}`
            }
            data-testid="menu-toggle-button"
            className={`group relative h-8 sm:h-9 flex items-center gap-2.5 sm:gap-3 cursor-pointer z-[70] transition-colors duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 whitespace-nowrap shrink-0 ${
              useDarkMenuStyle
                ? 'mix-blend-normal text-[#120F17] focus-visible:outline-[#120F17]'
                : 'mix-blend-difference text-white focus-visible:outline-white'
            }`}
          >
            {/* Rolling Text Label */}
            <span
              style={{ perspective: '400px' }}
              className={`relative block h-4 overflow-hidden text-xs font-medium tracking-[0.22em] uppercase transition-colors duration-300 ease-out ${
                useDarkMenuStyle ? 'text-[#120F17]' : 'text-white'
              }`}
            >
              <span
                className={`block origin-bottom transition-all duration-300 ease-out ${
                  useDarkMenuStyle ? 'text-[#120F17]' : 'text-white'
                } ${
                  isOpen
                    ? '-translate-y-full rotate-x-90 opacity-0'
                    : 'group-hover:-translate-y-full group-hover:rotate-x-90 group-hover:opacity-0'
                }`}
              >
                MENU
              </span>
              <span
                className={`block origin-top transition-all duration-300 ease-out ${
                  useDarkMenuStyle ? 'text-[#120F17]' : 'text-white'
                } ${
                  isOpen
                    ? '-translate-y-full rotate-x-0 opacity-100'
                    : 'translate-y-0 -rotate-x-90 opacity-0 group-hover:-translate-y-full group-hover:rotate-x-0 group-hover:opacity-100'
                }`}
              >
                {hoverLabel}
              </span>
            </span>

            {/* 3 Crisp Horizontal Lines morphing into X */}
            <span
              aria-hidden="true"
              className="relative flex flex-col justify-center items-end w-6 sm:w-7 h-5"
            >
              <span
                className={`block w-6 sm:w-7 h-[1.5px] transition-all duration-300 ease-out ${
                  useDarkMenuStyle ? 'bg-[#120F17]' : 'bg-white'
                } ${isOpen ? 'translate-y-[1.5px] rotate-45' : '-translate-y-1.5'}`}
              />
              <span
                className={`block h-[1.5px] transition-all duration-300 ease-out ${
                  useDarkMenuStyle ? 'bg-[#120F17]' : 'bg-white'
                } ${isOpen ? 'w-0 opacity-0' : 'w-6 sm:w-7 opacity-100'}`}
              />
              <span
                className={`block w-6 sm:w-7 h-[1.5px] transition-all duration-300 ease-out ${
                  useDarkMenuStyle ? 'bg-[#120F17]' : 'bg-white'
                } ${isOpen ? '-translate-y-[1.5px] -rotate-45' : 'translate-y-1.5'}`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* 3. AWWWARDS-INSPIRED FULLSCREEN NAVIGATION OVERLAY (NO NUMBERS, NO SCROLLBAR, EDGE FADES) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="fullscreen-navigation-overlay"
            id="fullscreen-navigation-overlay"
            data-testid="navigation-overlay-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Hovednavigation"
            initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{
              clipPath: 'inset(0% 0% 100% 0%)',
              transition: { duration: 0.65, delay: 0.1, ease: [0.76, 0, 0.24, 1] },
            }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[60] bg-[#EEEDE7] text-[#120F17] overflow-hidden"
          >
            {/* Soft #EEEDE7 Top & Bottom Edge Fade Gradients */}
            <div
              aria-hidden="true"
              data-testid="nav-vignette-top"
              style={{
                background:
                  'linear-gradient(to bottom, #EEEDE7 0%, rgba(238, 237, 231, 0.85) 45%, rgba(238, 237, 231, 0) 100%)',
              }}
              className="pointer-events-none absolute top-0 left-0 right-0 h-28 sm:h-36 z-20"
            />
            <div
              aria-hidden="true"
              data-testid="nav-vignette-bottom"
              style={{
                background:
                  'linear-gradient(to top, #EEEDE7 0%, rgba(238, 237, 231, 0.85) 45%, rgba(238, 237, 231, 0) 100%)',
              }}
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 sm:h-32 z-20"
            />

            {/* Hidden Scrollbar + Top & Bottom Edge Mask Scroll Container */}
            <div
              data-testid="nav-scroll-container"
              style={{
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                maskImage:
                  'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
              }}
              className="overflow-y-auto h-full pt-36 pb-28 px-6 sm:px-12 md:px-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col justify-center"
            >
              <nav aria-label="Sektionslinks" className="max-w-6xl w-full mx-auto my-auto">
                <ul className="group/list space-y-2 sm:space-y-3">
                  {MENU_OVERLAY_LINKS.map((item, idx) => {
                    const text = lang === 'DA' ? item.displayText : item.displayTextEn;
                    const isRouteLink = item.href.startsWith('/');
                    return (
                      <li
                        key={item.href}
                        className="overflow-hidden group-hover/list:opacity-35 hover:!opacity-100 transition-opacity duration-300"
                      >
                        <motion.div
                          initial={{ y: '115%', opacity: 0 }}
                          animate={{
                            y: '0%',
                            opacity: 1,
                            transition: {
                              duration: 0.7,
                              delay: 0.18 + idx * 0.055,
                              ease: [0.16, 1, 0.3, 1],
                            },
                          }}
                          exit={{
                            y: '-110%',
                            opacity: 0,
                            transition: {
                              duration: 0.38,
                              ease: [0.76, 0, 0.24, 1],
                            },
                          }}
                        >
                          <motion.a
                            key={`${item.href}-${lang}`}
                            initial={{ y: 7, opacity: 0.65 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                            href={item.href}
                            onClick={(e) => {
                              e.preventDefault();
                              if (isRouteLink) {
                                onToggle();
                                navigate(item.href);
                              } else {
                                onSelectLink(item);
                              }
                            }}
                            data-testid={`nav-overlay-link-${idx + 1}`}
                            className="group/link inline-flex items-center gap-4 font-serif font-light text-4xl sm:text-5xl md:text-6xl lg:text-[64px] tracking-tight leading-[1.15] text-[#120F17] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-x-3"
                          >
                            {/* Dual-Layer Rolling Upright-to-Italic Typography */}
                            <span className="relative block h-[1.15em] overflow-hidden">
                              <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:-translate-y-full">
                                {text}
                              </span>
                              <span className="block italic font-serif text-[#120F17]/80 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:-translate-y-full">
                                {text}
                              </span>
                            </span>

                            {/* Delicate ↗ Hover Indicator */}
                            <span
                              aria-hidden="true"
                              className="text-2xl sm:text-3xl md:text-4xl font-sans font-light opacity-0 -translate-x-2 translate-y-1 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:opacity-75 group-hover/link:translate-x-0 group-hover/link:translate-y-0"
                            >
                              ↗
                            </span>
                          </motion.a>
                        </motion.div>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
