import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateArchPath,
  calculateStrokeDashoffset,
  formatCounterValue,
  computeViewportExpansion,
  resolveSequencePhase,
  parseNumericProp,
  computeFlexCarouselCardStyle,
  getResponsiveFlexCarouselConfig,
  computeWordFillColors,
  getCompactGlassSurfaceConfig,
  computeServiceCardTilt,
} from './preloaderMath';
import {
  MENU_OVERLAY_LINKS,
  SERVICES_DATA,
  PROCESS_STEPS,
  INTERIOR_ITEMS,
  PROJECT_CAROUSEL_ITEMS,
  ABOUT_PILLARS,
  SUPPLIER_BRANDS,
  SUPPLIER_TRACK_1,
  SUPPLIER_TRACK_2,
  FEATURED_REVIEW,
  CLIENT_REVIEWS,
  NATALIE_PORTRAIT_URL,
} from '../data/portfolioData';

test('generateArchPath constructs a 320x430 shorter arch mirror (1:1.35 ratio, radius 160px)', () => {
  const geom = generateArchPath(320, 430, 0);
  assert.equal(geom.innerWidth, 320);
  assert.equal(geom.innerHeight, 430);
  assert.equal(geom.archRadius, 160);
  assert.ok(geom.d.startsWith('M 160 430'));
  assert.ok(geom.d.includes('A 160 160 0 0 1 320 160'));
  assert.ok(geom.d.endsWith('Z'));

  const expectedPerimeter = 2 * 270 + Math.PI * 160 + 320;
  assert.ok(Math.abs(geom.perimeter - expectedPerimeter) < 1e-6);
});

test('calculateStrokeDashoffset maps 0% to full pathLength and 100% to 0', () => {
  const length = 1362.65;
  assert.equal(calculateStrokeDashoffset(0, length), length);
  assert.ok(Math.abs(calculateStrokeDashoffset(50, length) - length * 0.5) < 1e-6);
  assert.equal(calculateStrokeDashoffset(100, length), 0);
  assert.equal(calculateStrokeDashoffset(-15, length), length);
  assert.equal(calculateStrokeDashoffset(120, length), 0);
});

test('formatCounterValue formats 00 to 100% properly', () => {
  assert.deepEqual(formatCounterValue(0), {
    raw: 0,
    paddedDigits: '00',
    label: '00%',
  });
  assert.deepEqual(formatCounterValue(7.4), {
    raw: 7,
    paddedDigits: '07',
    label: '07%',
  });
  assert.deepEqual(formatCounterValue(42), {
    raw: 42,
    paddedDigits: '42',
    label: '42%',
  });
  assert.deepEqual(formatCounterValue(100), {
    raw: 100,
    paddedDigits: '100',
    label: '100%',
  });
});

test('computeViewportExpansion handles mobile and ultrawide viewports', () => {
  const mobile = computeViewportExpansion(390, 844, 240, 322);
  assert.ok(mobile.scaleX > 1.5);
  assert.ok(mobile.scaleY > 2.5);
  assert.ok(mobile.coverScale >= mobile.scaleY);

  const ultrawide = computeViewportExpansion(2560, 1080, 320, 430);
  assert.ok(ultrawide.scaleX >= 8);
  assert.ok(ultrawide.coverScale >= ultrawide.scaleX);
});

test('resolveSequencePhase transitions cleanly through Phases 1 to 5', () => {
  assert.equal(resolveSequencePhase(0).phase, 1);
  assert.equal(resolveSequencePhase(0.25).phase, 1);
  assert.equal(resolveSequencePhase(0.5).phase, 2);
  assert.equal(resolveSequencePhase(0.7).phase, 3);
  assert.equal(resolveSequencePhase(0.85).phase, 4);
  assert.equal(resolveSequencePhase(0.95).phase, 5);
  assert.equal(resolveSequencePhase(1).phase, 5);
});

test('parseNumericProp and computeFlexCarouselCardStyle calculate lens focus and twist dispersion accurately', () => {
  assert.equal(parseNumericProp('{0.32}', 0), 0.32);
  assert.equal(parseNumericProp('{-180}', 0), -180);
  assert.equal(parseNumericProp(1.12, 0), 1.12);

  const focused = computeFlexCarouselCardStyle({
    index: 2,
    activeIndex: 2,
    totalItems: 10,
    bend: 0.32,
    cardHeight: 0.56,
    dispersion: 0.45,
    lensHeight: 1.12,
    lensWidth: 0.74,
    reach: 0.36,
    squeeze: 0.18,
    tilt: 58,
    curl: 'twist',
  });
  const neighbor = computeFlexCarouselCardStyle({
    index: 3,
    activeIndex: 2,
    totalItems: 10,
    bend: 0.32,
    cardHeight: 0.56,
    dispersion: 0.45,
    lensHeight: 1.12,
    lensWidth: 0.74,
    reach: 0.36,
    squeeze: 0.18,
    tilt: 58,
    curl: 'twist',
  });

  assert.equal(focused.isFocused, true);
  assert.equal(neighbor.isFocused, false);
  assert.ok(focused.flexGrow > neighbor.flexGrow);
  assert.ok(focused.heightScale > neighbor.heightScale);
  assert.equal(focused.rotateYDeg, 0);
  assert.ok(neighbor.rotateYDeg < 0);
  assert.ok(neighbor.rotateZDeg > 0);
});

test('getResponsiveFlexCarouselConfig returns exact WebGL liquid lens desktop (>= 768px) and mobile (< 768px) parameters', () => {
  const desktop = getResponsiveFlexCarouselConfig(1440);
  assert.deepEqual(desktop, {
    isMobile: false,
    height: 540,
    cardHeight: 0.54,
    gap: 12,
    squeeze: 0.2,
    lensWidth: 0.74,
    lensHeight: 1.18,
    tilt: 62,
    bend: 0.34,
    reach: 0.38,
    dispersion: 0.45,
  });

  const mobile = getResponsiveFlexCarouselConfig(390);
  assert.deepEqual(mobile, {
    isMobile: true,
    height: 460,
    cardHeight: 0.62,
    gap: 10,
    squeeze: 0.08,
    lensWidth: 1.05,
    lensHeight: 1.05,
    tilt: 28,
    bend: 0.22,
    reach: 0.28,
    dispersion: 0.35,
  });
});

test('getCompactGlassSurfaceConfig and computeServiceCardTilt match Section 3.3 and Section 6 specs', () => {
  assert.deepEqual(getCompactGlassSurfaceConfig(390), {
    width: 245,
    height: 56,
    borderRadius: 28,
  });
  assert.deepEqual(getCompactGlassSurfaceConfig(1440), {
    width: 270,
    height: 56,
    borderRadius: 28,
  });

  const topLeftCorner = computeServiceCardTilt({
    clientX: 100,
    clientY: 200,
    rectLeft: 100,
    rectTop: 200,
    rectWidth: 400,
    rectHeight: 300,
    maxDeg: 3.5,
  });
  assert.equal(topLeftCorner.mouseX, 0);
  assert.equal(topLeftCorner.mouseY, 0);
  assert.equal(topLeftCorner.rotateX, 3.5);
  assert.equal(topLeftCorner.rotateY, -3.5);
  assert.equal(topLeftCorner.isInside, true);

  const centerHover = computeServiceCardTilt({
    clientX: 300,
    clientY: 350,
    rectLeft: 100,
    rectTop: 200,
    rectWidth: 400,
    rectHeight: 300,
    maxDeg: 3.5,
  });
  assert.equal(centerHover.rotateX, 0);
  assert.equal(centerHover.rotateY, 0);

  const outsideHover = computeServiceCardTilt({
    clientX: 50,
    clientY: 250,
    rectLeft: 100,
    rectTop: 200,
    rectWidth: 400,
    rectHeight: 300,
    maxDeg: 3.5,
  });
  assert.equal(outsideHover.isInside, false);
  assert.equal(outsideHover.rotateX, 0);
  assert.equal(outsideHover.rotateY, 0);
});

test('computeWordFillColors transitions words sequentially from rgba(18, 15, 23, 0.18) to #120F17', () => {
  const initial = computeWordFillColors(0, 5);
  assert.deepEqual(initial, [
    'rgba(18, 15, 23, 0.18)',
    'rgba(18, 15, 23, 0.18)',
    'rgba(18, 15, 23, 0.18)',
    'rgba(18, 15, 23, 0.18)',
    'rgba(18, 15, 23, 0.18)',
  ]);

  const midway = computeWordFillColors(0.5, 5);
  assert.equal(midway[0], '#120F17');
  assert.equal(midway[4], 'rgba(18, 15, 23, 0.18)');

  const complete = computeWordFillColors(1, 5);
  assert.deepEqual(complete, ['#120F17', '#120F17', '#120F17', '#120F17', '#120F17']);
});

test('Bilingual content data, unnumbered menu links, LogoLoop brand tracks, 16 restored PROJECT_CAROUSEL_ITEMS with descriptions, Showroom image, and Natalie Portrait URL match specifications', () => {
  assert.equal(
    NATALIE_PORTRAIT_URL,
    'https://i.ibb.co/2Yfyzf1G/Whats-App-Image-2026-09-07-at-3-53-38-PM.jpg'
  );
  assert.deepEqual(
    MENU_OVERLAY_LINKS.map((l) => l.displayText),
    ['YDELSER', 'PROCES', 'Leverandører', 'Booking', 'REVIEWS', 'OM NATALIE']
  );
  assert.deepEqual(
    MENU_OVERLAY_LINKS.map((l) => l.displayTextEn),
    ['SERVICES', 'PROCESS', 'Suppliers', 'Booking', 'REVIEWS', 'ABOUT NATALIE']
  );
  assert.deepEqual(
    MENU_OVERLAY_LINKS.map((l) => l.href),
    ['#ydelser', '#proces', '#leverandorer', '/booking', '#reviews', '#om-natalie']
  );
  assert.equal(SERVICES_DATA.length, 3);
  assert.ok(SERVICES_DATA.every((s) => s.imageUrl.startsWith('https://images.unsplash.com/')));
  assert.equal(
    SERVICES_DATA[0].descriptionEn,
    'A renovation involves hundreds of decisions. I help you create clarity, make the right choices, and ensure your vision is preserved all the way from idea to finished home.'
  );
  assert.equal(PROCESS_STEPS.length, 5);
  assert.equal(INTERIOR_ITEMS.length, 16);
  assert.equal(PROJECT_CAROUSEL_ITEMS.length, 16);
  assert.ok(PROJECT_CAROUSEL_ITEMS.every((item) => item.src.startsWith('https://i.ibb.co/')));
  assert.ok(PROJECT_CAROUSEL_ITEMS.every((item) => item.description.length > 10));
  assert.ok(PROJECT_CAROUSEL_ITEMS.every((item) => item.descriptionEn.length > 10));
  assert.deepEqual(
    PROJECT_CAROUSEL_ITEMS.map((item) => item.subtitle),
    [
      'Islands Brygge',
      'Skodsborg',
      'Østerbro',
      'Islands Brygge II',
      'Hellerup',
      'København K',
      'Klampenborg',
      'Strandvejen',
      'Showroom',
      'Specialdesign',
      'Frederiksberg',
      'Charlottenlund',
      'Vedbæk',
      'Hellerup Showroom',
      'Nordsjælland',
      'København',
    ]
  );
  assert.equal(ABOUT_PILLARS.length, 3);
  assert.equal(SUPPLIER_TRACK_1.length, 17);
  assert.equal(SUPPLIER_TRACK_2.length, 16);
  assert.equal(SUPPLIER_BRANDS.length, 33);
  assert.equal(SUPPLIER_TRACK_1[0], 'Poliform');
  assert.equal(SUPPLIER_TRACK_1[16], 'Bomma');
  assert.equal(SUPPLIER_TRACK_2[0], 'Gallotti & Radice');
  assert.equal(SUPPLIER_TRACK_2[15], 'J. Adams & Co');
  assert.equal(FEATURED_REVIEW.author, '— Ellen & Emil');
  assert.equal(CLIENT_REVIEWS.length, 3);
  assert.equal(
    CLIENT_REVIEWS[1].quoteEn,
    'The very best advisory and collaboration'
  );
});
