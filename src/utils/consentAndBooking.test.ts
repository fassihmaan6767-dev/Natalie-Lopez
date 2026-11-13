import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeAppPath,
  buildConsentRecord,
  parseConsentJson,
  serializeConsentCookie,
  validateBookingForm,
} from './consentAndBooking';

test('normalizeAppPath maps supported routes and strips trailing slashes/queries', () => {
  assert.equal(normalizeAppPath('/'), '/');
  assert.equal(normalizeAppPath('/booking/'), '/booking');
  assert.equal(normalizeAppPath('/booking?topic=renovering'), '/booking');
  assert.equal(normalizeAppPath('/cookiepolitik'), '/cookiepolitik');
  assert.equal(normalizeAppPath('/handelsbetingelser/'), '/handelsbetingelser');
  assert.equal(normalizeAppPath('/persondatapolitik#section'), '/persondatapolitik');
  assert.equal(normalizeAppPath('/unknown-route'), '/');
});

test('cookie consent record builder, parser, and cookie string serializer round-trip accurately', () => {
  const record = buildConsentRecord(true, false, '2026-11-13T10:00:00.000Z');
  assert.deepEqual(record, {
    necessary: true,
    statistics: true,
    marketing: false,
    updatedAt: '2026-11-13T10:00:00.000Z',
  });

  const parsed = parseConsentJson(JSON.stringify(record));
  assert.deepEqual(parsed, record);
  assert.equal(parseConsentJson('not-json'), null);
  assert.equal(parseConsentJson(JSON.stringify({ statistics: 'yes' })), null);

  const cookieStr = serializeConsentCookie(record);
  assert.ok(cookieStr.startsWith('nl_consent='));
  assert.ok(cookieStr.includes('max-age=31536000'));
  assert.ok(cookieStr.includes('path=/'));
  assert.ok(cookieStr.includes('SameSite=Lax'));
});

test('validateBookingForm enforces all 5 required fields in DA and EN', () => {
  const emptyRes = validateBookingForm(
    {
      firstName: '',
      lastName: '',
      email: 'bad-email',
      phone: '12',
      message: '',
      interest: 'Renovering',
    },
    'DA'
  );
  assert.equal(emptyRes.valid, false);
  assert.ok(emptyRes.fieldErrors.firstName);
  assert.ok(emptyRes.fieldErrors.lastName);
  assert.ok(emptyRes.fieldErrors.email);
  assert.ok(emptyRes.fieldErrors.phone);
  assert.ok(emptyRes.fieldErrors.message);
  assert.equal(emptyRes.summaryError, 'Udfyld venligst alle påkrævede felter korrekt.');

  const validRes = validateBookingForm(
    {
      firstName: 'Sofie',
      lastName: 'Madsen',
      email: 'sofie@example.dk',
      phone: '+45 28 18 76 25',
      message: 'Totalrenovering af villa i Hellerup i foråret.',
      interest: 'Renovation',
    },
    'EN'
  );
  assert.equal(validRes.valid, true);
  assert.deepEqual(validRes.fieldErrors, {});
  assert.equal(validRes.summaryError, null);
});
