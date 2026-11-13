import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Language } from '../data/portfolioData';
import { RevealText } from './ui/RevealHeading';
import { AnimatedContent } from './ui/AnimatedContent';

interface ContactProps {
  lang?: Language;
  selectedTopic: string;
  onTopicChange: (topic: string) => void;
}

interface BookingEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  notes: string;
}

/**
 * SEKTION 9: NÆSTE SKRIDT & KONTAKT / NEXT STEP & CONTACT
 */
export const Contact: React.FC<ContactProps> = ({
  lang = 'DA',
  selectedTopic,
  onTopicChange,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingEntry[]>([]);
  const [showForm, setShowForm] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !email.includes('@') || !notes.trim()) {
      setError(
        lang === 'DA'
          ? 'Udfyld venligst dit navn, en gyldig e-mailadresse og en kort beskrivelse af dit projekt.'
          : 'Please enter your name, a valid email address, and a brief description of your project.'
      );
      return;
    }

    setError(null);
    setBookings((prev) => [
      {
        id: `b-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        topic: selectedTopic,
        notes: notes.trim(),
      },
      ...prev,
    ]);
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
  };

  return (
    <section
      id="kontakt"
      data-testid="contact-section"
      className="py-20 md:py-28 px-6 sm:px-10 border-t border-[#120F17]/12 bg-[#E6E4DC]/55"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 space-y-6">
          <RevealText
            as="p"
            className="text-xs uppercase tracking-[0.22em] text-[#120F17]/60 font-medium"
          >
            {lang === 'DA' ? 'Næste skridt' : 'Next Step'}
          </RevealText>

          <RevealText
            as="h2"
            delay={0.08}
            className="font-serif-display text-3xl sm:text-5xl text-[#120F17] font-normal tracking-tight"
          >
            {lang === 'DA' ? 'Lad os tale om dit projekt' : "Let's talk about your project"}
          </RevealText>

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
            className="space-y-6"
          >
            <p className="text-base sm:text-lg leading-relaxed text-[#120F17]/80">
              {lang === 'DA'
                ? 'Alle projekter starter med en god dialog. Fortæl mig om dine planer, så tager vi den derfra.'
                : 'Every project begins with a good conversation. Tell me about your plans, and we will take it from there.'}
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(true);
                  document.getElementById('booking-name-input')?.focus();
                }}
                className="px-7 py-4 bg-[#120F17] text-[#EEEDE7] text-xs sm:text-sm font-medium tracking-wide hover:bg-[#272230] transition-colors inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{lang === 'DA' ? 'Book en samtale' : 'Book a consultation'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </AnimatedContent>

          {bookings.length > 0 && (
            <div className="pt-6 border-t border-[#120F17]/12 space-y-3">
              <p className="text-xs font-medium text-[#120F17] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#120F17]" />
                <span>
                  {lang === 'DA'
                    ? `Din henvendelse er registreret (${bookings.length})`
                    : `Your inquiry has been registered (${bookings.length})`}
                </span>
              </p>
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 bg-[#EEEDE7] border border-[#120F17]/15 text-xs space-y-1"
                >
                  <div className="font-medium text-[#120F17]">
                    {b.name} · {b.topic}
                  </div>
                  <p className="text-[#120F17]/75">{b.notes}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Booking Dialog Form */}
        {showForm && (
          <AnimatedContent
            animateOpacity
            blur="{6}"
            direction="vertical"
            distance="{45}"
            duration="{0.85}"
            ease="power3.out"
            initialOpacity="{0}"
            threshold="{0.12}"
            className="lg:col-span-7"
          >
            <form
              onSubmit={handleSubmit}
              noValidate
              className="p-8 sm:p-10 bg-[#EEEDE7] border border-[#120F17]/15 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="booking-name-input"
                    className="block text-xs font-medium text-[#120F17] mb-2"
                  >
                    {lang === 'DA' ? 'Fulde navn' : 'Full name'}
                  </label>
                  <input
                    id="booking-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === 'DA' ? 'Dit navn' : 'Your name'}
                    className="w-full px-4 py-3 bg-[#E6E4DC]/40 border border-[#120F17]/20 text-sm text-[#120F17] focus:outline-none focus:border-[#120F17]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="booking-email-input"
                    className="block text-xs font-medium text-[#120F17] mb-2"
                  >
                    {lang === 'DA' ? 'E-mail' : 'Email'}
                  </label>
                  <input
                    id="booking-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={lang === 'DA' ? 'din@email.dk' : 'you@email.com'}
                    className="w-full px-4 py-3 bg-[#E6E4DC]/40 border border-[#120F17]/20 text-sm text-[#120F17] focus:outline-none focus:border-[#120F17]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="booking-phone-input"
                    className="block text-xs font-medium text-[#120F17] mb-2"
                  >
                    {lang === 'DA' ? 'Telefon (valgfri)' : 'Phone (optional)'}
                  </label>
                  <input
                    id="booking-phone-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+45"
                    className="w-full px-4 py-3 bg-[#E6E4DC]/40 border border-[#120F17]/20 text-sm text-[#120F17] focus:outline-none focus:border-[#120F17]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="booking-topic-select"
                    className="block text-xs font-medium text-[#120F17] mb-2"
                  >
                    {lang === 'DA' ? 'Ydelse / Fokus' : 'Service / Focus'}
                  </label>
                  <select
                    id="booking-topic-select"
                    value={selectedTopic}
                    onChange={(e) => onTopicChange(e.target.value)}
                    className="w-full px-4 py-3 bg-[#E6E4DC]/40 border border-[#120F17]/20 text-sm text-[#120F17] focus:outline-none focus:border-[#120F17]"
                  >
                    <option value="01 Renovering">
                      {lang === 'DA' ? '01 Renovering' : '01 Renovation'}
                    </option>
                    <option value="02 Æstetisk rådgivning">
                      {lang === 'DA' ? '02 Æstetisk rådgivning' : '02 Aesthetic Advisory'}
                    </option>
                    <option value="03 Sparring">
                      {lang === 'DA' ? '03 Sparring' : '03 Design Sparring'}
                    </option>
                    <option value="Showroom besøg, Strandvejen">
                      {lang === 'DA'
                        ? 'Showroom besøg, Strandvejen'
                        : 'Showroom Visit, Strandvejen'}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="booking-notes-textarea"
                  className="block text-xs font-medium text-[#120F17] mb-2"
                >
                  {lang === 'DA'
                    ? 'Fortæl kort om dit projekt og dine planer'
                    : 'Briefly tell us about your project and plans'}
                </label>
                <textarea
                  id="booking-notes-textarea"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    lang === 'DA'
                      ? 'Boligtype, beliggenhed, omfang og ønsket tidsramme...'
                      : 'Property type, location, scope, and desired timeframe...'
                  }
                  className="w-full px-4 py-3 bg-[#E6E4DC]/40 border border-[#120F17]/20 text-sm text-[#120F17] focus:outline-none focus:border-[#120F17]"
                />
              </div>

              {error && (
                <p role="alert" className="text-xs text-red-900 bg-red-100/80 px-3.5 py-2.5">
                  {error}
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-7 py-4 bg-[#120F17] text-[#EEEDE7] text-xs sm:text-sm font-medium tracking-wide hover:bg-[#272230] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {lang === 'DA'
                    ? 'Send forespørgsel · Book en samtale'
                    : 'Send inquiry · Book a consultation'}
                </button>
              </div>
            </form>
          </AnimatedContent>
        )}
      </div>
    </section>
  );
};
