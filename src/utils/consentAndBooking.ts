export type AppPath =
  | '/'
  | '/booking'
  | '/cookiepolitik'
  | '/handelsbetingelser'
  | '/persondatapolitik';

export interface CookieConsentState {
  necessary: true;
  statistics: boolean;
  marketing: boolean;
  updatedAt: string;
}

export const COOKIE_STORAGE_KEY = 'nl_cookie_consent';
export const COOKIE_NAME = 'nl_consent';

export const DEFAULT_COOKIE_CONSENT: CookieConsentState = {
  necessary: true,
  statistics: false,
  marketing: false,
  updatedAt: '',
};

export function normalizeAppPath(rawPathname: string): AppPath {
  const cleaned = (rawPathname || '/').split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
  switch (cleaned) {
    case '/booking':
      return '/booking';
    case '/cookiepolitik':
      return '/cookiepolitik';
    case '/handelsbetingelser':
      return '/handelsbetingelser';
    case '/persondatapolitik':
      return '/persondatapolitik';
    default:
      return '/';
  }
}

export function buildConsentRecord(
  statistics: boolean,
  marketing: boolean,
  nowIso: string = new Date().toISOString()
): CookieConsentState {
  return {
    necessary: true,
    statistics: Boolean(statistics),
    marketing: Boolean(marketing),
    updatedAt: nowIso,
  };
}

export function parseConsentJson(raw: string | null | undefined): CookieConsentState | null {
  if (!raw || typeof raw !== 'string') return null;
  try {
    const parsed = JSON.parse(raw) as Partial<CookieConsentState>;
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof parsed.statistics !== 'boolean' ||
      typeof parsed.marketing !== 'boolean'
    ) {
      return null;
    }
    return {
      necessary: true,
      statistics: parsed.statistics,
      marketing: parsed.marketing,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '',
    };
  } catch {
    return null;
  }
}

export function serializeConsentCookie(state: CookieConsentState): string {
  const compact = encodeURIComponent(
    JSON.stringify({
      n: 1,
      s: state.statistics ? 1 : 0,
      m: state.marketing ? 1 : 0,
    })
  );
  return `${COOKIE_NAME}=${compact}; max-age=31536000; path=/; SameSite=Lax`;
}

export interface BookingFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  interest: string;
}

export interface BookingValidationResult {
  valid: boolean;
  fieldErrors: Partial<Record<keyof BookingFormValues, string>>;
  summaryError: string | null;
}

export function validateBookingForm(
  values: BookingFormValues,
  lang: 'DA' | 'EN'
): BookingValidationResult {
  const fieldErrors: Partial<Record<keyof BookingFormValues, string>> = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.firstName.trim()) {
    fieldErrors.firstName =
      lang === 'DA' ? 'Indtast venligst dit fornavn.' : 'Please enter your first name.';
  }
  if (!values.lastName.trim()) {
    fieldErrors.lastName =
      lang === 'DA' ? 'Indtast venligst dit efternavn.' : 'Please enter your last name.';
  }
  if (!values.email.trim() || !emailPattern.test(values.email.trim())) {
    fieldErrors.email =
      lang === 'DA'
        ? 'Indtast venligst en gyldig e-mailadresse.'
        : 'Please enter a valid email address.';
  }
  if (!values.phone.trim() || values.phone.replace(/\D/g, '').length < 6) {
    fieldErrors.phone =
      lang === 'DA'
        ? 'Indtast venligst et gyldigt telefonnummer.'
        : 'Please enter a valid phone number.';
  }
  if (!values.message.trim() || values.message.trim().length < 5) {
    fieldErrors.message =
      lang === 'DA'
        ? 'Fortæl venligst kort om dit projekt (mindst 5 tegn).'
        : 'Please briefly describe your project (at least 5 characters).';
  }

  const valid = Object.keys(fieldErrors).length === 0;
  const summaryError = valid
    ? null
    : lang === 'DA'
      ? 'Udfyld venligst alle påkrævede felter korrekt.'
      : 'Please complete all required fields accurately.';

  return { valid, fieldErrors, summaryError };
}
