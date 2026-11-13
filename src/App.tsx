/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { PreloaderOverlay } from './components/PreloaderOverlay';
import { GradualBlur } from './components/GradualBlur';
import { NavigationOverlay } from './components/NavigationOverlay';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Process } from './components/Process';
import { Projects } from './components/Projects';
import { About } from './components/About';
import { Showroom } from './components/Showroom';
import { Suppliers } from './components/Suppliers';
import { Reviews } from './components/Reviews';
import { Footer } from './components/Footer';
import { CookieConsent } from './components/ui/CookieConsent';
import { BookingPage } from './pages/BookingPage';
import { LegalPage } from './pages/LegalPage';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { PageTransitionProvider, usePageTransition } from './context/PageTransitionContext';
import { SmoothScrollProvider } from './components/layout/SmoothScrollProvider';
import {
  BRAND_LOGO_URL,
  FALLBACK_LOGO_DATA_URI,
  MenuLinkItem,
} from './data/portfolioData';
import { PreloaderPhase } from './utils/preloaderMath';

const AppShell: React.FC<{
  pageContentRef: React.RefObject<HTMLDivElement | null>;
}> = ({ pageContentRef }) => {
  const { language, setLanguage } = useLanguage();
  const { currentPath, hasNavigatedInApp, navigate } = usePageTransition();

  const initialSkip = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      return true;
    }
    return false;
  }, []);

  const [sequenceComplete, setSequenceComplete] = useState<boolean>(initialSkip);
  const [activePhase, setActivePhase] = useState<PreloaderPhase>(initialSkip ? 5 : 1);
  const [replayTrigger] = useState<number>(0);
  const [targetPhaseJump] = useState<PreloaderPhase | null>(null);
  const [headerLogoSrc, setHeaderLogoSrc] = useState<string>(BRAND_LOGO_URL);

  // Scroll-activated top GradualBlur state (hidden at top of Hero, visible past 45% of viewport height)
  const [showGradualBlur, setShowGradualBlur] = useState<boolean>(false);

  // Fullscreen 3-line menu overlay state
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const headerLogoImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (hasNavigatedInApp && !sequenceComplete) {
      setSequenceComplete(true);
      setActivePhase(5);
    }
  }, [hasNavigatedInApp, sequenceComplete]);

  useEffect(() => {
    const updateGradualBlurVisibility = () => {
      const threshold = window.innerHeight * 0.45;
      setShowGradualBlur(window.scrollY > threshold);
    };

    updateGradualBlurVisibility();
    window.addEventListener('scroll', updateGradualBlurVisibility, { passive: true });
    window.addEventListener('resize', updateGradualBlurVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateGradualBlurVisibility);
      window.removeEventListener('resize', updateGradualBlurVisibility);
    };
  }, []);

  const handleHeaderLogoError = useCallback(() => {
    setHeaderLogoSrc((prev) => (prev !== FALLBACK_LOGO_DATA_URI ? FALLBACK_LOGO_DATA_URI : prev));
  }, []);

  const handleSequenceComplete = useCallback(() => {
    setSequenceComplete(true);
    setActivePhase(5);
  }, []);

  const handleSelectMenuLink = useCallback(
    (item: MenuLinkItem) => {
      setIsMenuOpen(false);
      if (item.href.startsWith('/')) {
        navigate(item.href);
        return;
      }
      if (currentPath !== '/') {
        navigate(`/${item.href}`);
      } else {
        setTimeout(() => {
          navigate(item.href);
        }, 280);
      }
    },
    [currentPath, navigate]
  );

  const handleSelectService = useCallback(
    (serviceTitle: string) => {
      navigate('/booking', { topic: serviceTitle });
    },
    [navigate]
  );

  return (
    <div
      data-state={sequenceComplete ? 'revealed' : `preloader-phase-${activePhase}`}
      data-route={currentPath}
      data-lang={language}
      style={{ backgroundColor: 'rgb(238, 237, 231)' }}
      className="min-h-screen text-[#120F17] selection:bg-[#120F17] selection:text-[#EEEDE7]"
    >
      {/* 1. CINEMATIC ENTRY PRELOADER */}
      <PreloaderOverlay
        isCompleted={sequenceComplete}
        replayTrigger={replayTrigger}
        routeTransitionTrigger={0}
        targetPhaseJump={targetPhaseJump}
        headerLogoImgRef={headerLogoImgRef}
        pageContentRef={pageContentRef}
        onPhaseChange={setActivePhase}
        onSequenceComplete={handleSequenceComplete}
      />

      {/* 2. SCROLL-ACTIVATED TOP GRADUAL BLUR OVERLAY */}
      <GradualBlur
        position="top"
        height="7.5rem"
        tint="rgba(238, 237, 231, 0.55)"
        layers={8}
        className={`transition-opacity duration-500 ease-out pointer-events-none ${
          showGradualBlur || currentPath !== '/' ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 3. HEADER, BILINGUAL TOGGLE & 3-LINE ROLLING NAVIGATION */}
      <NavigationOverlay
        isOpen={isMenuOpen}
        isScrolled={showGradualBlur}
        lang={language}
        onChangeLang={setLanguage}
        onToggle={() => setIsMenuOpen((prev) => !prev)}
        onSelectLink={handleSelectMenuLink}
        headerLogoImgRef={headerLogoImgRef}
        logoSrc={headerLogoSrc}
        onLogoError={handleHeaderLogoError}
      />

      {/* PAGE CONTENT REVEAL */}
      <div
        ref={pageContentRef}
        data-testid="page-content-reveal"
      >
        <main>
          {currentPath === '/' && (
            <>
              <Hero lang={language} onBookClick={() => navigate('/booking', { topic: 'Renovering' })} />
              <Services lang={language} onSelectService={handleSelectService} />
              <Process lang={language} />
              <Projects lang={language} />
              <About lang={language} />
              <Showroom
                lang={language}
                onBookVisit={() => navigate('/booking?topic=showroom', { topic: 'Showroom besøg' })}
              />
              <Suppliers lang={language} />
            </>
          )}

          {currentPath === '/booking' && <BookingPage />}
          {currentPath === '/cookiepolitik' && <LegalPage docType="cookiepolitik" />}
          {currentPath === '/persondatapolitik' && <LegalPage docType="persondatapolitik" />}
          {currentPath === '/handelsbetingelser' && <LegalPage docType="handelsbetingelser" />}
        </main>

        {/* Shared Card-Stacking Wrapper for Sticky Reviews + Rising Parallax Footer */}
        <div className="relative bg-[#EEEDE7]">
          {currentPath === '/' && <Reviews lang={language} />}
          <Footer lang={language} />
        </div>
      </div>

      {/* GDPR COOKIE CONSENT DRAWER */}
      <CookieConsent preloaderComplete={sequenceComplete} />
    </div>
  );
};

export default function App() {
  const pageContentRef = useRef<HTMLDivElement | null>(null);

  return (
    <LanguageProvider>
      <SmoothScrollProvider>
        <PageTransitionProvider pageContentRef={pageContentRef}>
          <AppShell pageContentRef={pageContentRef} />
        </PageTransitionProvider>
      </SmoothScrollProvider>
    </LanguageProvider>
  );
}
