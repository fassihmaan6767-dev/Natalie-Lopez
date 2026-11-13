import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { TransitionLink } from '../../context/PageTransitionContext';
import {
  COOKIE_STORAGE_KEY,
  buildConsentRecord,
  parseConsentJson,
  serializeConsentCookie,
} from '../../utils/consentAndBooking';

interface CookieConsentProps {
  preloaderComplete: boolean;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ preloaderComplete }) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showPreferences, setShowPreferences] = useState<boolean>(false);
  const [statistics, setStatistics] = useState<boolean>(false);
  const [marketing, setMarketing] = useState<boolean>(false);

  // Show drawer 1.2s after entry preloader completes if no consent is saved
  useEffect(() => {
    if (!preloaderComplete || typeof window === 'undefined') return;

    const existing = parseConsentJson(window.localStorage.getItem(COOKIE_STORAGE_KEY));
    if (existing) {
      setStatistics(existing.statistics);
      setMarketing(existing.marketing);
      return;
    }

    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [preloaderComplete]);

  // Listen for footer "Cookie-indstillinger" trigger
  useEffect(() => {
    const handleOpenSettings = () => {
      const existing = parseConsentJson(window.localStorage.getItem(COOKIE_STORAGE_KEY));
      if (existing) {
        setStatistics(existing.statistics);
        setMarketing(existing.marketing);
      }
      setShowPreferences(true);
      setIsOpen(true);
    };

    window.addEventListener('open-cookie-settings', handleOpenSettings);
    return () => window.removeEventListener('open-cookie-settings', handleOpenSettings);
  }, []);

  const persistAndClose = (nextStats: boolean, nextMarketing: boolean) => {
    const record = buildConsentRecord(nextStats, nextMarketing);
    try {
      window.localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(record));
    } catch {
      // ignore storage errors
    }
    document.cookie = serializeConsentCookie(record);
    setStatistics(nextStats);
    setMarketing(nextMarketing);
    setShowPreferences(false);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          key="gdpr-cookie-consent"
          data-testid="cookie-consent-drawer"
          role="dialog"
          aria-label={language === 'DA' ? 'Cookie-indstillinger' : 'Cookie preferences'}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 left-5 right-5 sm:right-auto sm:w-[390px] z-[90] bg-[#120F17]/95 backdrop-blur-xl text-[#EEEDE7] border border-[#EEEDE7]/15 rounded-2xl p-5 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-serif text-xl font-normal tracking-tight text-[#EEEDE7]">
              {language === 'DA' ? 'Vi værner om dit privatliv' : 'We value your privacy'}
            </h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={language === 'DA' ? 'Luk' : 'Close'}
              className="text-xs text-[#EEEDE7]/55 hover:text-[#EEEDE7] transition-colors px-1.5 py-0.5 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-[#EEEDE7]/75">
            {language === 'DA' ? (
              <>
                Vi bruger cookies til at sikre sidens drift, analysere trafik og målrette indhold.
                Læs mere i vores{' '}
                <TransitionLink
                  href="/cookiepolitik"
                  onNavigate={() => setIsOpen(false)}
                  className="underline underline-offset-4 text-[#EEEDE7] hover:text-[#D5CFC3] transition-colors"
                >
                  cookiepolitik
                </TransitionLink>
                .
              </>
            ) : (
              <>
                We use cookies to ensure site functionality, analyze traffic, and personalize
                content. Read more in our{' '}
                <TransitionLink
                  href="/cookiepolitik"
                  onNavigate={() => setIsOpen(false)}
                  className="underline underline-offset-4 text-[#EEEDE7] hover:text-[#D5CFC3] transition-colors"
                >
                  cookie policy
                </TransitionLink>
                .
              </>
            )}
          </p>

          {/* Expandable Preferences Panel */}
          <AnimatePresence initial={false}>
            {showPreferences && (
              <motion.div
                data-testid="cookie-preferences-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-[#EEEDE7]/12 space-y-3">
                  {/* Necessary (Always Active) */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs">
                      <p className="font-medium text-[#EEEDE7]">
                        {language === 'DA' ? 'Nødvendige cookies' : 'Necessary cookies'}
                      </p>
                      <p className="text-[11px] text-[#EEEDE7]/55">
                        {language === 'DA' ? 'Altid aktiv' : 'Always active'}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={true}
                      disabled
                      aria-label={language === 'DA' ? 'Nødvendige cookies' : 'Necessary cookies'}
                      className="w-10 h-5.5 rounded-full bg-[#EEEDE7]/40 p-0.5 flex items-center justify-end cursor-not-allowed opacity-75"
                    >
                      <span className="w-4.5 h-4.5 rounded-full bg-[#EEEDE7]" />
                    </button>
                  </div>

                  {/* Statistics */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs">
                      <p className="font-medium text-[#EEEDE7]">
                        {language === 'DA'
                          ? 'Statistik (Google Analytics, Hotjar)'
                          : 'Statistics (Google Analytics, Hotjar)'}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      data-testid="cookie-switch-statistics"
                      aria-checked={statistics}
                      aria-label={
                        language === 'DA'
                          ? 'Statistik (Google Analytics, Hotjar)'
                          : 'Statistics (Google Analytics, Hotjar)'
                      }
                      onClick={() => setStatistics((prev) => !prev)}
                      className={`w-10 h-5.5 rounded-full p-0.5 flex items-center transition-colors duration-200 cursor-pointer shrink-0 ${
                        statistics ? 'bg-[#9E8B78] justify-end' : 'bg-[#EEEDE7]/20 justify-start'
                      }`}
                    >
                      <span className="w-4.5 h-4.5 rounded-full bg-[#EEEDE7]" />
                    </button>
                  </div>

                  {/* Marketing */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs">
                      <p className="font-medium text-[#EEEDE7]">
                        {language === 'DA'
                          ? 'Marketing (Meta, LinkedIn, Adform)'
                          : 'Marketing (Meta, LinkedIn, Adform)'}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      data-testid="cookie-switch-marketing"
                      aria-checked={marketing}
                      aria-label={
                        language === 'DA'
                          ? 'Marketing (Meta, LinkedIn, Adform)'
                          : 'Marketing (Meta, LinkedIn, Adform)'
                      }
                      onClick={() => setMarketing((prev) => !prev)}
                      className={`w-10 h-5.5 rounded-full p-0.5 flex items-center transition-colors duration-200 cursor-pointer shrink-0 ${
                        marketing ? 'bg-[#9E8B78] justify-end' : 'bg-[#EEEDE7]/20 justify-start'
                      }`}
                    >
                      <span className="w-4.5 h-4.5 rounded-full bg-[#EEEDE7]" />
                    </button>
                  </div>

                  <button
                    type="button"
                    data-testid="cookie-save-preferences"
                    onClick={() => persistAndClose(statistics, marketing)}
                    className="w-full mt-2 py-2.5 px-4 rounded-full bg-[#EEEDE7] text-[#120F17] text-xs font-medium tracking-wide hover:bg-[#D5CFC3] transition-colors cursor-pointer"
                  >
                    {language === 'DA' ? 'Gem valg' : 'Save preferences'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main 3 Action Buttons */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              data-testid="cookie-accept-all"
              onClick={() => persistAndClose(true, true)}
              className="px-4 py-2 rounded-full bg-[#EEEDE7] text-[#120F17] text-xs font-medium hover:bg-[#D5CFC3] transition-colors whitespace-nowrap cursor-pointer"
            >
              {language === 'DA' ? 'Accepter alle' : 'Accept all'}
            </button>
            <button
              type="button"
              data-testid="cookie-necessary-only"
              onClick={() => persistAndClose(false, false)}
              className="px-4 py-2 rounded-full border border-[#EEEDE7]/25 text-[#EEEDE7] text-xs font-medium hover:bg-[#EEEDE7]/10 transition-colors whitespace-nowrap cursor-pointer"
            >
              {language === 'DA' ? 'Kun nødvendige' : 'Necessary only'}
            </button>
            <button
              type="button"
              data-testid="cookie-toggle-settings"
              onClick={() => setShowPreferences((prev) => !prev)}
              aria-expanded={showPreferences}
              className="px-3 py-2 text-xs text-[#EEEDE7]/75 hover:text-[#EEEDE7] underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer ml-auto"
            >
              {language === 'DA' ? 'Indstillinger' : 'Preferences'}
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
