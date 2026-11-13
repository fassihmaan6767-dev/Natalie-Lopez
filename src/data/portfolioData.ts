export type Language = 'DA' | 'EN';

export type AppRoutePage = 'home' | 'projekter' | 'showroom';

export interface MenuLinkItem {
  label: string;
  labelEn: string;
  displayText: string;
  displayTextEn: string;
  href: string;
  route?: AppRoutePage;
}

export interface ServiceItem {
  number: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  imageUrl: string;
  fallbackImageUrl: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
}

export interface ProjectCarouselItem {
  src: string;
  fallbackSrc?: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  description: string;
  descriptionEn: string;
}

export interface PillarItem {
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
}

export interface ReviewCardItem {
  name: string;
  quote: string;
  quoteEn: string;
}

export const BRAND_LOGO_URL =
  'https://natalielopez.dk/wp-content/uploads/2026/08/459201499_872852584379790_838935452870768594_n-removebg-preview.png';

export const NATALIE_PORTRAIT_URL =
  'https://i.ibb.co/2Yfyzf1G/Whats-App-Image-2026-09-07-at-3-53-38-PM.jpg';

export const NATALIE_PORTRAIT_FALLBACK = '/images/projects/curved-kitchen-chair.jpg';

export const SHOWROOM_IMAGE_URL =
  'https://i.ibb.co/bg8sj870/4813c938-d72e-4d3b-8fa0-d167ebce350b.webp';

export const SHOWROOM_IMAGE_FALLBACK = '/images/projects/showroom-hellerup.jpg';

export const FALLBACK_LOGO_DATA_URI =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 220" fill="none">
      <path d="M242 98 A38 38 0 0 1 318 98 L318 134 L242 134 Z" stroke="#120F17" stroke-width="2.2" fill="none"/>
      <line x1="280" y1="60" x2="280" y2="134" stroke="#120F17" stroke-width="1.4" stroke-opacity="0.5"/>
      <text x="280" y="172" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="38" font-weight="500" letter-spacing="10" fill="#120F17">NATALIE LOPEZ</text>
      <text x="280" y="198" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="500" letter-spacing="5" fill="#4A474F">INDRETNINGSARKITEKT &amp; BOLIGSTYLIST</text>
    </svg>
  `);

export const HERO_CLIENT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&auto=format&fit=crop&q=85',
];

export const AVATAR_FALLBACKS = [
  'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#D5D0C5"/><circle cx="40" cy="31" r="14" fill="#8C8275"/><path d="M16 72 C16 54 64 54 64 72" fill="#8C8275"/></svg>`
    ),
  'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#C8C2B6"/><circle cx="40" cy="31" r="14" fill="#6E665B"/><path d="M16 72 C16 54 64 54 64 72" fill="#6E665B"/></svg>`
    ),
  'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#DFDCD2"/><circle cx="40" cy="31" r="14" fill="#5A534A"/><path d="M16 72 C16 54 64 54 64 72" fill="#5A534A"/></svg>`
    ),
];

/**
 * Curated Unnumbered Menu Links (Section 3.2):
 * Clean, architectural uppercase serif typography without 01., 02. prefix numbers.
 */
export const MENU_OVERLAY_LINKS: MenuLinkItem[] = [
  {
    label: 'YDELSER',
    labelEn: 'SERVICES',
    displayText: 'YDELSER',
    displayTextEn: 'SERVICES',
    href: '#ydelser',
  },
  {
    label: 'PROCES',
    labelEn: 'PROCESS',
    displayText: 'PROCES',
    displayTextEn: 'PROCESS',
    href: '#proces',
  },
  {
    label: 'Leverandører',
    labelEn: 'Suppliers',
    displayText: 'Leverandører',
    displayTextEn: 'Suppliers',
    href: '#leverandorer',
  },
  {
    label: 'Booking',
    labelEn: 'Booking',
    displayText: 'Booking',
    displayTextEn: 'Booking',
    href: '/booking',
  },
  {
    label: 'REVIEWS',
    labelEn: 'REVIEWS',
    displayText: 'REVIEWS',
    displayTextEn: 'REVIEWS',
    href: '#reviews',
  },
  {
    label: 'OM NATALIE',
    labelEn: 'ABOUT NATALIE',
    displayText: 'OM NATALIE',
    displayTextEn: 'ABOUT NATALIE',
    href: '#om-natalie',
  },
];

export const SERVICES_DATA: ServiceItem[] = [
  {
    number: '01',
    title: 'Renovering',
    titleEn: 'Renovation',
    description:
      'En renovering består af hundredevis af beslutninger. Jeg hjælper dig med at skabe overblik, træffe de rigtige valg og sikre, at visionen bevares hele vejen fra idé til færdigt hjem.',
    descriptionEn:
      'A renovation involves hundreds of decisions. I help you create clarity, make the right choices, and ensure your vision is preserved all the way from idea to finished home.',
    imageUrl:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=85',
    fallbackImageUrl: '/images/projects/islands-brygge-2.jpg',
  },
  {
    number: '02',
    title: 'Æstetisk rådgivning',
    titleEn: 'Aesthetic Advisory',
    description:
      'De bedste løsninger opstår, når alle valg spiller sammen. Jeg hjælper med at skabe en rød tråd på tværs af materialer, detaljer og rum.',
    descriptionEn:
      'The best solutions emerge when every choice works together. I help create a cohesive thread across materials, details, and rooms.',
    imageUrl:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop&q=85',
    fallbackImageUrl: '/images/projects/koebenhavn-k-doors.jpg',
  },
  {
    number: '03',
    title: 'Sparring',
    titleEn: 'Design Sparring',
    description:
      'Har du egne håndværkere? Jeg bidrager med æstetisk sparring og hjælper dig med at træffe de rigtige beslutninger undervejs.',
    descriptionEn:
      'Do you have your own craftsmen? I provide aesthetic sparring and help you make the right decisions along the way.',
    imageUrl:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=85',
    fallbackImageUrl: '/images/projects/klampenborg-living.jpg',
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Afklaring',
    titleEn: 'Clarification',
    description: 'Vi definerer ønsker, behov og rammer for projektet.',
    descriptionEn: 'We define wishes, needs, and the framework for the project.',
  },
  {
    number: '02',
    title: 'Retning',
    titleEn: 'Direction',
    description: 'Materialer, løsninger og detaljer udvælges med fokus på en samlet vision.',
    descriptionEn: 'Materials, solutions, and details are selected with focus on a unified vision.',
  },
  {
    number: '03',
    title: 'Realisering',
    titleEn: 'Realization',
    description: 'Projektet koordineres, og de mange beslutninger omsættes til virkelighed.',
    descriptionEn: 'The project is coordinated, and the many decisions are turned into reality.',
  },
  {
    number: '04',
    title: 'Indretning',
    titleEn: 'Interior Styling',
    description:
      'Møbler, belysning, gardiner og tekstiler udvælges, så hjemmet hænger sammen som en helhed.',
    descriptionEn:
      'Furniture, lighting, curtains, and textiles are curated so the home comes together as a whole.',
  },
  {
    number: '05',
    title: 'Overdragelse',
    titleEn: 'Handover',
    description: 'Et færdigt hjem, hvor helheden er tænkt ind i hver eneste detalje.',
    descriptionEn:
      'A finished home where cohesion is thoughtfully built into every single detail.',
  },
];

/**
 * 16 Restored Fresh ImgBB Project Images & Automatic Project Text Scene (Section 8.3)
 */
export const PROJECT_CAROUSEL_ITEMS: ProjectCarouselItem[] = [
  {
    src: 'https://i.ibb.co/5gMSmTg6/IMG-0947-1024x683-jpg.jpg',
    fallbackSrc: '/images/projects/islands-brygge-2.jpg',
    title: 'TOTAL RENOVERING',
    titleEn: 'FULL RENOVATION',
    subtitle: 'Islands Brygge',
    description:
      'Komplet arkitektonisk ombygning, specialsnedkererede løsninger og gennemgående materialevalg.',
    descriptionEn:
      'Complete architectural remodeling, bespoke joinery solutions, and cohesive material curation.',
  },
  {
    src: 'https://i.ibb.co/27Rd2gk3/IMG-0942-1024x683-jpg.jpg',
    fallbackSrc: '/images/projects/skodsborg.jpg',
    title: 'TOTAL RENOVERING',
    titleEn: 'FULL RENOVATION',
    subtitle: 'Skodsborg',
    description:
      'Harmonisk sammenhæng mellem lysindfald, natursten og varme træsorter langs kysten.',
    descriptionEn:
      'Harmonious interplay between natural daylight, stone surfaces, and warm coastal timber.',
  },
  {
    src: 'https://i.ibb.co/mrMbG6gh/IMG-0943-1-1024x683-jpg.jpg',
    fallbackSrc: '/images/projects/oesterbro.jpg',
    title: 'TOTAL RENOVERING',
    titleEn: 'FULL RENOVATION',
    subtitle: 'Østerbro',
    description:
      'Klassisk herskabslejlighed nyfortolket med respekt for originale detaljer og moderne komfort.',
    descriptionEn:
      'Classic heritage apartment reimagined with respect for original architectural details and modern comfort.',
  },
  {
    src: 'https://i.ibb.co/tTxQgFMC/Whats-App-Image-2026-09-21-at-11-30-10-AM.jpg',
    fallbackSrc: '/images/projects/islands-brygge-1.jpg',
    title: 'TOTAL RENOVERING',
    titleEn: 'FULL RENOVATION',
    subtitle: 'Islands Brygge II',
    description:
      'Skræddersyet planløsning og æstetisk rød tråd fra entré til stue og køkkenalrum.',
    descriptionEn:
      'Tailored floor plan and cohesive aesthetic thread from entryway to living and kitchen spaces.',
  },
  {
    src: 'https://i.ibb.co/5Xmtpgx9/Whats-App-Image-2026-09-21-at-11-33-52-AM.jpg',
    fallbackSrc: '/images/projects/hellerup-staircase.jpg',
    title: 'TOTALINDRETNING',
    titleEn: 'COMPLETE INTERIOR',
    subtitle: 'Hellerup',
    description:
      'Helhedsorienteret indretning med specialdesignede møbler, tekstiler og afstemt belysning.',
    descriptionEn:
      'Holistic interior design featuring custom furniture, curated textiles, and balanced lighting.',
  },
  {
    src: 'https://i.ibb.co/tTt94XWh/Whats-App-Image-2026-09-21-at-11-34-02-AM.jpg',
    fallbackSrc: '/images/projects/koebenhavn-k-doors.jpg',
    title: 'ÆSTETISK RÅDGIVNING',
    titleEn: 'AESTHETIC ADVISORY',
    subtitle: 'København K',
    description:
      'Farvesætning, materialekombinationer og sparring gennem hele byggeprocessen.',
    descriptionEn:
      'Color palettes, material pairings, and close design sparring throughout the construction process.',
  },
  {
    src: 'https://i.ibb.co/Hfvk7kM1/Whats-App-Image-2026-09-21-at-11-35-50-AM.jpg',
    fallbackSrc: '/images/projects/klampenborg-living.jpg',
    title: 'BOLIGSTYLING',
    titleEn: 'INTERIOR STYLING',
    subtitle: 'Klampenborg',
    description:
      'Kuraterede overflader, gardiner og taktile elementer der binder rummene sammen.',
    descriptionEn:
      'Curated surfaces, drapery, and tactile elements that seamlessly unite the rooms.',
  },
  {
    src: 'https://i.ibb.co/0RTXHZwm/Whats-App-Image-2026-09-21-at-11-35-59-AM.jpg',
    fallbackSrc: '/images/projects/strandvejen-153.jpg',
    title: 'TOTAL RENOVERING',
    titleEn: 'FULL RENOVATION',
    subtitle: 'Strandvejen',
    description:
      'Eksklusiv villa-renovering med fokus på ro, rene linjer og tidløst håndværk.',
    descriptionEn:
      'Exclusive villa renovation focused on serenity, clean architectural lines, and timeless craftsmanship.',
  },
  {
    src: 'https://i.ibb.co/LDykTmHv/Whats-App-Image-2026-09-21-at-11-36-37-AM.jpg',
    fallbackSrc: '/images/projects/showroom-hellerup.jpg',
    title: 'MATERIALER & DETALJER',
    titleEn: 'MATERIALS & DETAILS',
    subtitle: 'Showroom',
    description:
      'Sammensætning af natursten, messingarmaturer og snedkerdetaljer.',
    descriptionEn:
      'Composition of natural stone, brass fixtures, and bespoke joinery details.',
  },
  {
    src: 'https://i.ibb.co/YTk6HD20/Whats-App-Image-2026-09-21-at-11-36-49-AM.jpg',
    fallbackSrc: '/images/projects/curved-kitchen-chair.jpg',
    title: 'KØKKEN & BAD',
    titleEn: 'KITCHEN & BATH',
    subtitle: 'Specialdesign',
    description:
      'Skræddersyede vådrum og køkkenløsninger med præcision i hver samling.',
    descriptionEn:
      'Bespoke wet rooms and architectural kitchen solutions crafted with precision in every joint.',
  },
  {
    src: 'https://i.ibb.co/hJk3P2Dn/Whats-App-Image-2026-09-21-at-11-37-06-AM.jpg',
    fallbackSrc: '/images/projects/sunset-lounge-sofa.jpg',
    title: 'INDRETNING & LYS',
    titleEn: 'INTERIOR & LIGHT',
    subtitle: 'Frederiksberg',
    description:
      'Arkitektonisk belysning og bløde tekstiler skaber ro og balance.',
    descriptionEn:
      'Architectural lighting and soft textiles creating calm and spatial balance.',
  },
  {
    src: 'https://i.ibb.co/sxsFDkx/Whats-App-Image-2026-09-21-at-11-53-43-AM.jpg',
    fallbackSrc: '/images/projects/textured-wardrobe.jpg',
    title: 'SNEDKERDETALJER',
    titleEn: 'BESPOKE JOINERY',
    subtitle: 'Charlottenlund',
    description:
      'Specialfremstillede opbevaringsløsninger integreret i boligens arkitektur.',
    descriptionEn:
      'Custom-built storage solutions seamlessly integrated into the architecture of the home.',
  },
  {
    src: 'https://i.ibb.co/BH1QZMP2/Whats-App-Image-2026-09-21-at-11-59-04-AM.jpg',
    fallbackSrc: '/images/projects/galley-kitchen-terrace.jpg',
    title: 'HELHEDSLØSNING',
    titleEn: 'TURNKEY SOLUTION',
    subtitle: 'Vedbæk',
    description:
      'Fra første plantegning til nøglefærdigt og indflytningsklart hjem.',
    descriptionEn:
      'From initial floor plan to turnkey, move-in-ready residence.',
  },
  {
    src: 'https://i.ibb.co/MyL53gqz/Whats-App-Image-2026-09-24-at-2-21-03-PM.jpg',
    fallbackSrc: '/images/projects/marble-sink-vanity.jpg',
    title: 'MATERIALEPALET',
    titleEn: 'MATERIAL PALETTE',
    subtitle: 'Hellerup Showroom',
    description:
      'Taktile overflader i træ, sten og tekstil udvalgt til private bygherrer.',
    descriptionEn:
      'Tactile surfaces in timber, stone, and textiles curated for private homeowners.',
  },
  {
    src: 'https://i.ibb.co/R46fmqhd/Whats-App-Image-2026-09-24-at-2-21-29-PM.jpg',
    fallbackSrc: '/images/projects/dining-wine-room.jpg',
    title: 'ARKITEKTONISK SPARRING',
    titleEn: 'ARCHITECTURAL SPARRING',
    subtitle: 'Nordsjælland',
    description:
      'Tæt koordinering mellem bygherre, arkitekt og håndværkere.',
    descriptionEn:
      'Close coordination between homeowner, architect, and master craftsmen.',
  },
  {
    src: 'https://i.ibb.co/DHv8pZdB/IMG-2719-768x1024-jpg.jpg',
    fallbackSrc: '/images/projects/living-room-fireplace.jpg',
    title: 'RUM & BALANCE',
    titleEn: 'SPACE & BALANCE',
    subtitle: 'København',
    description:
      'Æstetiske proportioner og gennemførte detaljer i hvert eneste rum.',
    descriptionEn:
      'Aesthetic proportions and refined details in every single room.',
  },
];

export const INTERIOR_ITEMS: ProjectCarouselItem[] = PROJECT_CAROUSEL_ITEMS;

export const ABOUT_PILLARS: PillarItem[] = [
  {
    title: 'Æstetik',
    titleEn: 'Aesthetics',
    subtitle: 'Detaljer med omtanke',
    subtitleEn: 'Thoughtful details',
  },
  {
    title: 'Håndværk',
    titleEn: 'Craftsmanship',
    subtitle: 'Øje for detaljer',
    subtitleEn: 'Eye for detail',
  },
  {
    title: 'Helhed',
    titleEn: 'Wholeness',
    subtitle: 'Samlede løsninger',
    subtitleEn: 'Cohesive solutions',
  },
];

export const SUPPLIER_TRACK_1: string[] = [
  'Poliform',
  'United Alabaster',
  'St. Leo',
  'Trækompagniet',
  'Toni Copenhagen',
  'Dornbracht',
  'Prado',
  'Atelier Luxus',
  'Anker&Co',
  'Møller & Rothe',
  'Handcrafted Interior',
  'Brandt Cph',
  'Gaggenau',
  'Antonio Lupi',
  'Vivaporte',
  'Agape',
  'Bomma',
];

export const SUPPLIER_TRACK_2: string[] = [
  'Gallotti & Radice',
  'Flos',
  'CTO Lighting',
  'Jab',
  'Massimo',
  'Dedar',
  'Nobilis',
  'Borderstone',
  'SolidStudio',
  'Florim',
  'Porcelanosa',
  'Kronos',
  'CasaCeramic',
  'Lithoss',
  'Ochre',
  'J. Adams & Co',
];

export const SUPPLIER_BRANDS: string[] = [...SUPPLIER_TRACK_1, ...SUPPLIER_TRACK_2];

export const FEATURED_REVIEW = {
  quote:
    '"Natalie har været fantastisk fra start til slut. Vi giver hende vores varmeste anbefalinger og vil uden tvivl benytte hende igen. Vi har en travl hverdag og vores byggeprojekt virkede uoverskueligt indtil Natalie kom ind og skabte klarhed og struktur. Med sin store erfaring formåede hun at styre hele processen, fra plantegning til færdiggørelse, med overblik og præcision. Hendes passion for projekterne er tydelig, og hun har et enestående øje for både funktionelle og æstetiske løsninger."',
  quoteEn:
    '"Natalie has been fantastic from start to finish. We give her our warmest recommendations and will undoubtedly work with her again. We have busy everyday lives and our building project felt overwhelming until Natalie stepped in and created clarity and structure. With her vast experience, she managed to guide the entire process, from floor plan to completion, with overview and precision. Her passion for her projects is unmistakable, and she has an exceptional eye for both functional and aesthetic solutions."',
  author: '— Ellen & Emil',
};

export const CLIENT_REVIEWS: ReviewCardItem[] = [
  {
    name: 'Saschah ♡',
    quote: 'Tusinde tak for din kæmpe hjælp under renoveringen, du er den bedste!',
    quoteEn: 'Thank you so much for your immense help during the renovation, you are the best!',
  },
  {
    name: 'Stephanie ♡',
    quote: 'Den bedste rådgivning og samarbejde',
    quoteEn: 'The very best advisory and collaboration',
  },
  {
    name: 'Pouline ♡',
    quote:
      'Tak for et trygt og altid 100% transparent samarbejde. Det er afgørende, når man står midt i et stort projekt og skal træffe mange beslutninger.',
    quoteEn:
      'Thank you for a reassuring and always 100% transparent collaboration. That is crucial when you are in the middle of a large project with many decisions to make.',
  },
];
