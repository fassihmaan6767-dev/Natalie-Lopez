import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { TransitionLink, usePageTransition } from '../context/PageTransitionContext';
import { RevealText, KineticLangBlock } from '../components/ui/RevealHeading';
import { SplitText } from '../components/ui/SplitText';
import { validateBookingForm } from '../utils/consentAndBooking';

interface InterestOption {
  id: string;
  labelDa: string;
  labelEn: string;
}

const INTEREST_OPTIONS: InterestOption[] = [
  { id: 'Renovering', labelDa: 'Renovering', labelEn: 'Renovation' },
  { id: 'Æstetisk rådgivning', labelDa: 'Æstetisk rådgivning', labelEn: 'Aesthetic Advisory' },
  { id: 'Sparring', labelDa: 'Sparring', labelEn: 'Design Sparring' },
  { id: 'Showroom besøg', labelDa: 'Showroom besøg', labelEn: 'Showroom Visit' },
];

interface SubmittedSummary {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  interest: string;
}

export const BookingPage: React.FC = () => {
  const { language } = useLanguage();
  const { bookingTopic } = usePageTransition();

  const [selectedInterest, setSelectedInterest] = useState<string>('Renovering');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<SubmittedSummary | null>(null);

  useEffect(() => {
    if (!bookingTopic) return;
    const lower = bookingTopic.toLowerCase();
    if (lower.includes('showroom')) {
      setSelectedInterest('Showroom besøg');
    } else if (lower.includes('sparring')) {
      setSelectedInterest('Sparring');
    } else if (lower.includes('rådgivning') || lower.includes('advisory')) {
      setSelectedInterest('Æstetisk rådgivning');
    } else {
      setSelectedInterest('Renovering');
    }
  }, [bookingTopic]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateBookingForm(
      {
        firstName,
        lastName,
        email,
        phone,
        message,
        interest: selectedInterest,
      },
      language
    );

    if (!validation.valid) {
      setFieldErrors(validation.fieldErrors as Record<string, string>);
      setSummaryError(validation.summaryError);
      return;
    }

    setFieldErrors({});
    setSummaryError(null);
    setIsSending(true);

    window.setTimeout(() => {
      setIsSending(false);
      setSubmitted({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        interest: selectedInterest,
      });
    }, 450);
  };

  const handleReset = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setFieldErrors({});
    setSummaryError(null);
    setSubmitted(null);
  };

  const activeInterestObj =
    INTEREST_OPTIONS.find((opt) => opt.id === selectedInterest) || INTEREST_OPTIONS[0];

  return (
    <section
      data-testid="booking-page"
      className="min-h-screen pt-32 sm:pt-40 pb-24 px-6 sm:px-10 md:px-16 text-[#120F17] bg-[#EEEDE7]"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column */}
        <div className="lg:col-span-5">
          <TransitionLink
            href="/"
            data-testid="booking-back-link"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.18em] uppercase text-[#120F17]/65 hover:text-[#120F17] transition-colors mb-8"
          >
            {language === 'DA' ? '← Tilbage til forsiden' : '← Back to home'}
          </TransitionLink>

          <RevealText
            as="p"
            className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#8C7A6B]"
          >
            {language === 'DA' ? '— KONTAKT OS' : '— CONTACT US'}
          </RevealText>

          <SplitText
            tag="h1"
            text={language === 'DA' ? 'Hvordan kan vi hjælpe?' : 'How can we help?'}
            splitType="words,chars"
            mask={true}
            effect="rise"
            duration={1.0}
            delay={25}
            textAlign="left"
            className="font-serif font-light text-4xl sm:text-5xl md:text-[54px] leading-[1.1] tracking-tight mt-3 text-[#120F17]"
          />

          <KineticLangBlock langKey={`booking-subtitle-${language}`}>
            <p className="mt-6 text-base sm:text-[17px] leading-[1.7] text-[#120F17]/75 max-w-md">
              {language === 'DA'
                ? 'Alle projekter starter med en god dialog. Fortæl kort om dine planer, ønsker og tidsramme, så vender jeg tilbage hurtigst muligt.'
                : 'Every project begins with a good conversation. Share a few details about your plans, wishes, and timeline, and I will get back to you shortly.'}
            </p>
          </KineticLangBlock>

          <div className="mt-10 pt-8 border-t border-[#120F17]/12 space-y-3 text-sm text-[#120F17]/75">
            <p>
              <span className="font-medium text-[#120F17]">Showroom:</span> Strandvejen 153, 2900
              Hellerup
            </p>
            <p>
              <span className="font-medium text-[#120F17]">E-mail:</span>{' '}
              <a
                href="mailto:kontakt@natalielopez.dk"
                className="hover:text-[#120F17] underline underline-offset-4 transition-colors"
              >
                kontakt@natalielopez.dk
              </a>
            </p>
            <p>
              <span className="font-medium text-[#120F17]">
                {language === 'DA' ? 'Telefon:' : 'Phone:'}
              </span>{' '}
              <a
                href="tel:+4528187625"
                className="hover:text-[#120F17] underline underline-offset-4 transition-colors"
              >
                +45 28 18 76 25
              </a>
            </p>
          </div>
        </div>

        {/* Right Column — Bespoke Interactive Form Card */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-[#E6E3DA]/80 border border-[#120F17]/10 p-7 sm:p-10 md:p-12 shadow-sm">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="booking-confirmation"
                  data-testid="booking-confirmation"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 text-[#120F17]">
                    <CheckCircle2 className="w-6 h-6 text-[#8C7A6B] shrink-0" />
                    <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight">
                      {language === 'DA' ? 'Tak for din henvendelse' : 'Thank you for your inquiry'}
                    </h2>
                  </div>

                  <p className="text-sm sm:text-base leading-relaxed text-[#120F17]/80">
                    {language === 'DA'
                      ? `Kære ${submitted.firstName}, jeg har modtaget din forespørgsel og vender tilbage til dig hurtigst muligt.`
                      : `Dear ${submitted.firstName}, I have received your inquiry and will get back to you shortly.`}
                  </p>

                  <div className="rounded-2xl bg-[#EEEDE7]/90 border border-[#120F17]/12 p-5 space-y-2.5 text-sm">
                    <div className="flex justify-between gap-4 border-b border-[#120F17]/10 pb-2">
                      <span className="text-[#120F17]/55">
                        {language === 'DA' ? 'Fokus' : 'Focus'}
                      </span>
                      <span className="font-medium text-[#120F17]">
                        {language === 'DA' ? activeInterestObj.labelDa : activeInterestObj.labelEn}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-[#120F17]/10 pb-2">
                      <span className="text-[#120F17]/55">
                        {language === 'DA' ? 'Navn' : 'Name'}
                      </span>
                      <span className="font-medium text-[#120F17]">
                        {submitted.firstName} {submitted.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-[#120F17]/10 pb-2">
                      <span className="text-[#120F17]/55">E-mail</span>
                      <span className="font-medium text-[#120F17]">{submitted.email}</span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-[#120F17]/10 pb-2">
                      <span className="text-[#120F17]/55">
                        {language === 'DA' ? 'Telefon' : 'Phone'}
                      </span>
                      <span className="font-medium text-[#120F17]">{submitted.phone}</span>
                    </div>
                    <div className="pt-1">
                      <span className="block text-[#120F17]/55 mb-1">
                        {language === 'DA' ? 'Besked' : 'Message'}
                      </span>
                      <p className="text-[#120F17]/85 leading-relaxed">{submitted.message}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    data-testid="booking-reset-button"
                    onClick={handleReset}
                    className="px-6 py-3 rounded-full border border-[#120F17]/25 text-xs font-mono tracking-[0.16em] uppercase text-[#120F17] hover:bg-[#120F17] hover:text-[#EEEDE7] transition-colors cursor-pointer"
                  >
                    {language === 'DA' ? 'Send en ny besked' : 'Send another message'}
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="booking-form"
                  data-testid="booking-form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Selectable Interest Controls */}
                  <div>
                    <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#120F17]/60 mb-3">
                      {language === 'DA' ? 'Projektets fokus' : 'Project focus'}
                    </p>
                    <div
                      role="group"
                      aria-label={language === 'DA' ? 'Vælg ydelse' : 'Select service'}
                      className="flex flex-wrap gap-2"
                    >
                      {INTEREST_OPTIONS.map((option) => {
                        const active = selectedInterest === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setSelectedInterest(option.id)}
                            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                              active
                                ? 'bg-[#120F17] text-[#EEEDE7]'
                                : 'bg-[#EEEDE7]/80 text-[#120F17]/75 border border-[#120F17]/15 hover:text-[#120F17]'
                            }`}
                          >
                            {language === 'DA' ? option.labelDa : option.labelEn}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 5 Required Form Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="booking-first-name"
                        className="block text-xs font-medium text-[#120F17] mb-2"
                      >
                        {language === 'DA' ? 'Fornavn' : 'First name'} *
                      </label>
                      <input
                        id="booking-first-name"
                        name="firstName"
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          if (fieldErrors.firstName) {
                            setFieldErrors((prev) => ({ ...prev, firstName: '' }));
                          }
                        }}
                        placeholder={language === 'DA' ? 'Dit fornavn' : 'Your first name'}
                        className="w-full bg-[#EEEDE7]/90 border border-[#120F17]/15 focus:border-[#120F17] focus:ring-0 focus:outline-none rounded-xl px-4 py-3.5 text-sm text-[#120F17] placeholder:text-[#120F17]/40 transition-colors"
                      />
                      {fieldErrors.firstName && (
                        <p className="mt-1.5 text-xs text-red-900">{fieldErrors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="booking-last-name"
                        className="block text-xs font-medium text-[#120F17] mb-2"
                      >
                        {language === 'DA' ? 'Efternavn' : 'Last name'} *
                      </label>
                      <input
                        id="booking-last-name"
                        name="lastName"
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          if (fieldErrors.lastName) {
                            setFieldErrors((prev) => ({ ...prev, lastName: '' }));
                          }
                        }}
                        placeholder={language === 'DA' ? 'Dit efternavn' : 'Your last name'}
                        className="w-full bg-[#EEEDE7]/90 border border-[#120F17]/15 focus:border-[#120F17] focus:ring-0 focus:outline-none rounded-xl px-4 py-3.5 text-sm text-[#120F17] placeholder:text-[#120F17]/40 transition-colors"
                      />
                      {fieldErrors.lastName && (
                        <p className="mt-1.5 text-xs text-red-900">{fieldErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="booking-email"
                        className="block text-xs font-medium text-[#120F17] mb-2"
                      >
                        {language === 'DA' ? 'E-mail' : 'Email'} *
                      </label>
                      <input
                        id="booking-email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (fieldErrors.email) {
                            setFieldErrors((prev) => ({ ...prev, email: '' }));
                          }
                        }}
                        placeholder={
                          language === 'DA' ? 'Din e-mailadresse' : 'Your email address'
                        }
                        className="w-full bg-[#EEEDE7]/90 border border-[#120F17]/15 focus:border-[#120F17] focus:ring-0 focus:outline-none rounded-xl px-4 py-3.5 text-sm text-[#120F17] placeholder:text-[#120F17]/40 transition-colors"
                      />
                      {fieldErrors.email && (
                        <p className="mt-1.5 text-xs text-red-900">{fieldErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="booking-phone"
                        className="block text-xs font-medium text-[#120F17] mb-2"
                      >
                        {language === 'DA' ? 'Telefonnummer' : 'Phone number'} *
                      </label>
                      <input
                        id="booking-phone"
                        name="phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (fieldErrors.phone) {
                            setFieldErrors((prev) => ({ ...prev, phone: '' }));
                          }
                        }}
                        placeholder={language === 'DA' ? 'Dit telefonnummer' : 'Your phone number'}
                        className="w-full bg-[#EEEDE7]/90 border border-[#120F17]/15 focus:border-[#120F17] focus:ring-0 focus:outline-none rounded-xl px-4 py-3.5 text-sm text-[#120F17] placeholder:text-[#120F17]/40 transition-colors"
                      />
                      {fieldErrors.phone && (
                        <p className="mt-1.5 text-xs text-red-900">{fieldErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="booking-message"
                      className="block text-xs font-medium text-[#120F17] mb-2"
                    >
                      {language === 'DA' ? 'Besked' : 'Message'} *
                    </label>
                    <textarea
                      id="booking-message"
                      name="message"
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (fieldErrors.message) {
                          setFieldErrors((prev) => ({ ...prev, message: '' }));
                        }
                      }}
                      placeholder={
                        language === 'DA'
                          ? 'Fortæl kort om dit projekt'
                          : 'Tell us briefly about your project'
                      }
                      className="w-full bg-[#EEEDE7]/90 border border-[#120F17]/15 focus:border-[#120F17] focus:ring-0 focus:outline-none rounded-xl px-4 py-3.5 text-sm text-[#120F17] placeholder:text-[#120F17]/40 transition-colors"
                    />
                    {fieldErrors.message && (
                      <p className="mt-1.5 text-xs text-red-900">{fieldErrors.message}</p>
                    )}
                  </div>

                  {summaryError && (
                    <p
                      role="alert"
                      data-testid="booking-error-alert"
                      className="text-xs text-red-900 bg-red-100/80 border border-red-900/15 rounded-xl px-4 py-3"
                    >
                      {summaryError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSending}
                    data-testid="booking-submit-button"
                    className="w-full py-4 rounded-full bg-[#120F17] text-[#EEEDE7] text-xs font-mono tracking-[0.2em] uppercase hover:bg-[#120F17]/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSending
                      ? language === 'DA'
                        ? 'Sender...'
                        : 'Sending...'
                      : language === 'DA'
                        ? 'BOOK SAMTALE ↗'
                        : 'SUBMIT INQUIRY ↗'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
