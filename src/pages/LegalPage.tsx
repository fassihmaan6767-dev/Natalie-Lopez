import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TransitionLink } from '../context/PageTransitionContext';
import { COOKIE_POLICY_DATA, PRIVACY_POLICY_DATA, TERMS_DATA } from '../data/legalData';
import { KineticLangBlock, RevealText } from '../components/ui/RevealHeading';
import { SplitText } from '../components/ui/SplitText';

interface LegalPageProps {
  docType: 'cookiepolitik' | 'persondatapolitik' | 'handelsbetingelser';
}

export const LegalPage: React.FC<LegalPageProps> = ({ docType }) => {
  const { language } = useLanguage();

  const doc =
    docType === 'cookiepolitik'
      ? COOKIE_POLICY_DATA[language]
      : docType === 'persondatapolitik'
        ? PRIVACY_POLICY_DATA[language]
        : TERMS_DATA[language];

  return (
    <article
      data-testid={`legal-page-${docType}`}
      className="min-h-screen bg-[#EEEDE7] text-[#120F17]"
    >
      <div className="max-w-3xl mx-auto px-6 sm:px-10 pt-36 pb-28">
        <TransitionLink
          href="/"
          data-testid="legal-back-link"
          className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.18em] uppercase text-[#120F17]/65 hover:text-[#120F17] transition-colors mb-10"
        >
          {language === 'DA' ? '← Tilbage til forsiden' : '← Back to home'}
        </TransitionLink>

        <RevealText
          as="p"
          className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#8C7A6B]"
        >
          {doc.updatedAt}
        </RevealText>

        <SplitText
          tag="h1"
          text={doc.title}
          splitType="words,chars"
          mask={true}
          effect="rise"
          duration={1.0}
          delay={25}
          textAlign="left"
          className="font-serif font-light text-4xl sm:text-5xl text-[#120F17] tracking-tight mt-3"
        />

        <KineticLangBlock langKey={`legal-${docType}-${language}`}>
          <p className="mt-4 text-base sm:text-lg text-[#120F17]/75 leading-relaxed">
            {doc.subtitle}
          </p>

          <div className="mt-12 pt-8 border-t border-[#120F17]/12 space-y-10">
            {doc.sections.map((section) => (
              <section key={section.heading} className="space-y-3">
                <h2 className="font-serif text-2xl font-normal text-[#120F17]">
                  {section.heading}
                </h2>
                {section.paragraphs.map((p, idx) => (
                  <p key={idx} className="text-sm sm:text-base leading-[1.75] text-[#120F17]/80">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>

          {docType === 'cookiepolitik' && (
            <div className="mt-12 pt-8 border-t border-[#120F17]/12">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
                className="px-6 py-3 rounded-full bg-[#120F17] text-[#EEEDE7] text-xs font-mono tracking-[0.18em] uppercase hover:bg-[#120F17]/90 transition-colors cursor-pointer"
              >
                {language === 'DA' ? 'Åbn cookie-indstillinger' : 'Open cookie settings'}
              </button>
            </div>
          )}
        </KineticLangBlock>
      </div>
    </article>
  );
};
