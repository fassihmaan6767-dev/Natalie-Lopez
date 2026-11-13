import { Language } from './portfolioData';

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LegalDocument {
  title: string;
  subtitle: string;
  updatedAt: string;
  sections: LegalSection[];
}

export const COOKIE_POLICY_DATA: Record<Language, LegalDocument> = {
  DA: {
    title: 'Cookiepolitik',
    subtitle: 'Information om brug af cookies og lignende teknologier på natalielopez.dk',
    updatedAt: 'Senest opdateret: November 2026',
    sections: [
      {
        heading: '1. Dataansvarlig & Kontaktoplysninger',
        paragraphs: [
          'Denne hjemmeside udbydes af Natalie Lopez ApS, CVR-nr. 45 13 53 30, Strandvejen 153, 2900 Hellerup, Danmark.',
          'Har du spørgsmål til vores brug af cookies eller dine rettigheder, er du altid velkommen til at kontakte os på kontakt@natalielopez.dk eller telefon +45 28 18 76 25.',
        ],
      },
      {
        heading: '2. Hvad er cookies?',
        paragraphs: [
          'En cookie er en lille tekstfil, der lagres i din browser for at kunne genkende din enhed ved tilbagevendende besøg, huske dine præferencer samt udarbejde statistik og målrettet markedsføring. Cookies indeholder ikke skadelig kode såsom virus.',
        ],
      },
      {
        heading: '3. Kategorier af cookies vi anvender',
        paragraphs: [
          'Nødvendige cookies: Sikrer at hjemmesiden fungerer teknisk korrekt, herunder navigation, sprogvalg (DA/EN) og lagring af dine cookie-indstillinger (nl_consent). Disse cookies kan ikke fravælges.',
          'Statistik (Google Analytics, Hotjar): Hjælper os med at forstå, hvordan besøgende interagerer med hjemmesiden, hvilke projekter og ydelser der vækker størst interesse, samt hvordan vi løbende kan forbedre brugeroplevelsen.',
          'Marketing (Meta, LinkedIn, Adform): Anvendes til at måle effekten af vores kampagner og vise relevant inspiration om indretningsarkitektur og boligstyling på tværs af platforme, hvis du har givet samtykke hertil.',
        ],
      },
      {
        heading: '4. Opbevaring, tilbagekaldelse & sletning',
        paragraphs: [
          'Dit samtykke gemmes i op til 12 måneder, hvorefter du bliver bedt om at tage stilling på ny. Du kan til enhver tid ændre eller trække dit samtykke tilbage via knappen "Cookie-indstillinger" i sidens footer.',
          'Du kan desuden blokere eller slette cookies direkte i din browsers indstillinger. Bemærk venligst, at visse funktioner på hjemmesiden kan fungere mindre optimalt, hvis alle cookies blokeres.',
        ],
      },
    ],
  },
  EN: {
    title: 'Cookie Policy',
    subtitle: 'Information on the use of cookies and similar technologies at natalielopez.dk',
    updatedAt: 'Last updated: November 2026',
    sections: [
      {
        heading: '1. Data Controller & Contact Information',
        paragraphs: [
          'This website is operated by Natalie Lopez ApS, CVR No. 45 13 53 30, Strandvejen 153, 2900 Hellerup, Denmark.',
          'If you have any questions regarding our use of cookies or your rights, please contact us at kontakt@natalielopez.dk or by telephone at +45 28 18 76 25.',
        ],
      },
      {
        heading: '2. What are cookies?',
        paragraphs: [
          'A cookie is a small text file stored in your browser to recognize your device on return visits, remember your preferences, and compile anonymized statistics or relevant marketing. Cookies do not contain harmful code such as viruses.',
        ],
      },
      {
        heading: '3. Categories of cookies we use',
        paragraphs: [
          'Necessary cookies: Ensure the technical operation of the website, including navigation, language selection (DA/EN), and storing your cookie consent preferences (nl_consent). These cookies cannot be disabled.',
          'Statistics (Google Analytics, Hotjar): Help us understand how visitors interact with our website, which projects and services generate the greatest interest, and how we can continuously refine the digital experience.',
          'Marketing (Meta, LinkedIn, Adform): Used to measure campaign performance and present relevant inspiration about interior architecture and residential styling across platforms, only when you have given explicit consent.',
        ],
      },
      {
        heading: '4. Retention, withdrawal & deletion',
        paragraphs: [
          'Your consent choice is stored for up to 12 months, after which you will be asked to review your preferences again. You can modify or withdraw your consent at any time via the "Cookie settings" button in the footer.',
          'You may also block or delete cookies directly through your browser settings. Please note that disabling all cookies may affect certain interactive features of the website.',
        ],
      },
    ],
  },
};

export const PRIVACY_POLICY_DATA: Record<Language, LegalDocument> = {
  DA: {
    title: 'Privatlivspolitik',
    subtitle: 'Sådan behandler og beskytter Natalie Lopez ApS dine personoplysninger',
    updatedAt: 'Senest opdateret: November 2026',
    sections: [
      {
        heading: '1. Dataansvarlig',
        paragraphs: [
          'Natalie Lopez ApS (CVR-nr. 45 13 53 30), Strandvejen 153, 2900 Hellerup, er dataansvarlig for behandlingen af de personoplysninger, vi modtager om dig i forbindelse med henvendelser, showroombesøg og indretningsprojekter.',
          'Kontakt vedrørende persondata kan rettes til kontakt@natalielopez.dk eller +45 28 18 76 25.',
        ],
      },
      {
        heading: '2. Hvilke oplysninger indsamler vi, og til hvilke formål?',
        paragraphs: [
          'Når du booker en samtale eller sender en forespørgsel via vores formular, behandler vi dit fornavn, efternavn, e-mailadresse, telefonnummer samt de projektbeskrivelser, du vælger at dele med os.',
          'Formålet er at besvare din henvendelse, forberede et indledende møde i vores showroom eller i din bolig samt levere den aftalte rådgivning, renovering eller boligstyling.',
        ],
      },
      {
        heading: '3. Retsgrundlag & opbevaringsperiode',
        paragraphs: [
          'Behandlingen sker på baggrund af GDPR artikel 6, stk. 1, litra b (opfyldelse af kontrakt eller foranstaltninger forud for kontraktindgåelse) samt litra f (legitim interesse i at kommunikere professionelt med potentielle og eksisterende kunder).',
          'Vi opbevarer dine oplysninger, så længe det er nødvendigt for det aktuelle projektforløb og i henhold til gældende dansk bogføringslovgivning.',
        ],
      },
      {
        heading: '4. Videregivelse & databehandlere',
        paragraphs: [
          'Vi sælger eller videregiver aldrig dine personoplysninger til uvedkommende tredjeparter. Oplysninger deles udelukkende med betroede samarbejdspartnere (f.eks. håndværkere, leverandører eller IT-databehandlere), når det er direkte nødvendigt for at realisere dit projekt.',
        ],
      },
      {
        heading: '5. Dine rettigheder efter GDPR',
        paragraphs: [
          'Du har til enhver tid ret til at få indsigt i de oplysninger, vi behandler om dig, få rettet urigtige oplysninger, få slettet oplysninger (retten til at blive glemt), få begrænset behandlingen samt gøre indsigelse mod behandlingen.',
          'Ønsker du at gøre brug af dine rettigheder, bedes du kontakte kontakt@natalielopez.dk. Du har ligeledes ret til at indgive en klage til Datatilsynet (www.datatilsynet.dk).',
        ],
      },
    ],
  },
  EN: {
    title: 'Privacy Policy',
    subtitle: 'How Natalie Lopez ApS processes and safeguards your personal data',
    updatedAt: 'Last updated: November 2026',
    sections: [
      {
        heading: '1. Data Controller',
        paragraphs: [
          'Natalie Lopez ApS (CVR No. 45 13 53 30), Strandvejen 153, 2900 Hellerup, Denmark, is the data controller for the personal information we receive in connection with inquiries, showroom visits, and interior architecture projects.',
          'Any questions regarding personal data may be directed to kontakt@natalielopez.dk or +45 28 18 76 25.',
        ],
      },
      {
        heading: '2. Information we collect and purposes',
        paragraphs: [
          'When you book a consultation or submit an inquiry via our booking page, we process your first name, last name, email address, telephone number, and the project details you choose to share with us.',
          'The purpose is to respond to your inquiry, prepare an introductory meeting in our Hellerup showroom or at your residence, and deliver agreed advisory, renovation, or styling services.',
        ],
      },
      {
        heading: '3. Legal basis & retention period',
        paragraphs: [
          'Processing is conducted under GDPR Article 6(1)(b) (performance of a contract or pre-contractual measures) and Article 6(1)(f) (legitimate interest in communicating professionally with prospective and active clients).',
          'We retain your information only for as long as necessary for the project collaboration and in accordance with applicable Danish bookkeeping legislation.',
        ],
      },
      {
        heading: '4. Disclosure & data processors',
        paragraphs: [
          'We never sell or disclose your personal data to unauthorized third parties. Information is shared solely with trusted project partners (such as master craftsmen, suppliers, or vetted IT processors) when strictly necessary to execute your project.',
        ],
      },
      {
        heading: '5. Your rights under GDPR',
        paragraphs: [
          'You have the right at any time to request access to the personal data we hold about you, have inaccurate information rectified, request erasure, restrict processing, or object to processing.',
          'To exercise your rights, please contact kontakt@natalielopez.dk. You also have the right to lodge a complaint with the Danish Data Protection Agency (www.datatilsynet.dk).',
        ],
      },
    ],
  },
};

export const TERMS_DATA: Record<Language, LegalDocument> = {
  DA: {
    title: 'Handelsbetingelser',
    subtitle: 'Vilkår for rådgivning, totalrenovering, indretningsarkitektur og specialbestillinger',
    updatedAt: 'Senest opdateret: November 2026',
    sections: [
      {
        heading: '1. Generelt & Aftaleindgåelse',
        paragraphs: [
          'Nærværende handelsbetingelser gælder for alle aftaler om indretningsarkitektur, æstetisk rådgivning, sparring, projektkoordinering og levering af møbler/materialer indgået mellem kunden og Natalie Lopez ApS (CVR-nr. 45 13 53 30), Strandvejen 153, 2900 Hellerup.',
          'En aftale betragtes som bindende ved skriftlig ordrebekræftelse eller godkendt tilbud pr. e-mail.',
        ],
      },
      {
        heading: '2. Rådgivning, Projektering & Udførelse',
        paragraphs: [
          'Omfanget af rådgivning og projektstyring fastlægges individuelt i det fremsendte tilbud. Ændringer eller tilkøb undervejs i bygge- eller indretningsprocessen aftales skriftligt og afregnes efter gældende timepris eller særskilt tillægsaftale.',
          'Ved renoveringsprojekter fungerer Natalie Lopez ApS som kundens æstetiske rådgiver og sparringspartner mellem bygherre, arkitekt og udførende håndværkere, medmindre andet er udtrykkeligt aftalt.',
        ],
      },
      {
        heading: '3. Priser & Betalingsbetingelser',
        paragraphs: [
          'Alle priser til private forbrugere oplyses i danske kroner (DKK) inkl. moms, medmindre andet er angivet. Betaling sker i rater i takt med projektets fremdrift eller forud for bestilling af specialfremstillede materialer, møbler og tekstiler.',
          'Ved forsinket betaling pålægges morarenter i henhold til rentelovens bestemmelser.',
        ],
      },
      {
        heading: '4. Specialbestillinger & Leveringstid',
        paragraphs: [
          'Bestillinger af specialfremstillede løsninger, snedkerinventar, natursten, gardiner og designmøbler fremstilles efter kundens specifikke mål og valg. Fortrydelsesretten bortfalder derfor ved igangsættelse af produktion, jf. forbrugeraftalelovens § 18, stk. 2, nr. 3.',
          'Oplyste leveringstider fra eksterne producenter og leverandører er vejledende. Eventuelle forsinkelser hos underleverandører meddeles hurtigst muligt.',
        ],
      },
      {
        heading: '5. Immaterielle Rettigheder & Lovvalg',
        paragraphs: [
          'Alle oplæg, plantegninger, materialecollager, belysningsplaner og designkoncepter udarbejdet af Natalie Lopez ApS tilhører Natalie Lopez ApS og må ikke videregives til tredjemand eller anvendes til andre projekter uden forudgående skriftlig aftale.',
          'Enhver tvist afgøres efter dansk ret ved de danske domstole.',
        ],
      },
    ],
  },
  EN: {
    title: 'Terms & Conditions',
    subtitle: 'Terms governing advisory, full renovations, interior architecture, and bespoke orders',
    updatedAt: 'Last updated: November 2026',
    sections: [
      {
        heading: '1. General & Formation of Agreement',
        paragraphs: [
          'These terms and conditions apply to all agreements for interior architecture, aesthetic advisory, design sparring, project coordination, and the supply of furniture and materials entered into between the client and Natalie Lopez ApS (CVR No. 45 13 53 30), Strandvejen 153, 2900 Hellerup, Denmark.',
          'An agreement becomes binding upon written order confirmation or email acceptance of a proposal.',
        ],
      },
      {
        heading: '2. Advisory, Design Planning & Execution',
        paragraphs: [
          'The scope of advisory and project coordination is defined individually in the accepted proposal. Adjustments or additions requested during the construction or styling process are agreed in writing and billed at the applicable hourly rate or under a separate addendum.',
          'For renovation projects, Natalie Lopez ApS acts as the client’s aesthetic advisor and sparring partner across homeowner, architect, and craftsmen unless expressly agreed otherwise.',
        ],
      },
      {
        heading: '3. Pricing & Payment Terms',
        paragraphs: [
          'All prices quoted to private clients are stated in Danish Kroner (DKK) inclusive of VAT unless otherwise specified. Payments are invoiced in milestones aligned with project progress or prior to placing orders for custom-made materials, furniture, and textiles.',
          'Late payments incur statutory default interest in accordance with the Danish Interest Act.',
        ],
      },
      {
        heading: '4. Bespoke Orders & Lead Times',
        paragraphs: [
          'Orders for bespoke joinery, natural stone, custom drapery, and made-to-order furniture are produced to the client’s exact specifications. Accordingly, statutory cancellation rights do not apply once production has commenced pursuant to Section 18(2)(3) of the Danish Consumer Contracts Act.',
          'Estimated delivery times from external manufacturers and suppliers are indicative. Any supplier delays are communicated promptly.',
        ],
      },
      {
        heading: '5. Intellectual Property & Governing Law',
        paragraphs: [
          'All concepts, floor plans, material boards, lighting plans, and design documentation prepared by Natalie Lopez ApS remain the intellectual property of Natalie Lopez ApS and may not be shared with third parties or reused for other projects without prior written consent.',
          'Any dispute is governed by Danish law and subject to the jurisdiction of Danish courts.',
        ],
      },
    ],
  },
};
