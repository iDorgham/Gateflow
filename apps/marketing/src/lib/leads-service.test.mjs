import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateLeadSubmission,
  formatCrmWebhookPayload,
} from './leads-service.ts';

describe('leads-service (node:test)', () => {
  it('validates a complete and legitimate lead submission', () => {
    const result = validateLeadSubmission({
      name: 'Tariq Al-Sabah',
      email: 'tariq@palms-compound.com',
      phone: '+201012345678',
      companyName: 'Palms Development Group',
      propertyType: 'COMPOUND',
      gateCount: 6,
      primaryGoal: 'Eliminate peak-hour vehicle bottleneck',
      utmSource: 'google_search',
      utmCampaign: 'compound_security_mena',
    });

    assert.equal(result.isValid, true);
    assert.ok(result.data);
    assert.equal(result.data.name, 'Tariq Al-Sabah');
    assert.equal(result.data.email, 'tariq@palms-compound.com');
    assert.equal(result.data.gateCount, 6);
    assert.equal(result.data.attribution.utmSource, 'google_search');
  });

  it('rejects submissions with invalid email or missing phone', () => {
    const badEmail = validateLeadSubmission({
      name: 'Ahmed',
      email: 'not-an-email',
      phone: '+201000',
      propertyType: 'COMMERCIAL',
      gateCount: 2,
    });
    assert.equal(badEmail.isValid, false);
    assert.ok(badEmail.errors.email);

    const badPhone = validateLeadSubmission({
      name: 'Ahmed',
      email: 'ahmed@test.com',
      phone: '123',
      propertyType: 'COMMERCIAL',
      gateCount: 2,
    });
    assert.equal(badPhone.isValid, false);
    assert.ok(badPhone.errors.phone);
  });

  it('formats clean webhook payloads for sales notifications', () => {
    const validation = validateLeadSubmission({
      name: 'Laila Hassan',
      email: 'laila@cairo-events.eg',
      phone: '+201122334455',
      companyName: 'Cairo Expo Center',
      propertyType: 'EVENT',
      gateCount: 12,
    });

    assert.ok(validation.data);
    const webhook = formatCrmWebhookPayload(validation.data);

    assert.equal(webhook.channel, '#sales-inbound-leads');
    assert.ok(webhook.summary.includes('Laila Hassan'));
    assert.ok(webhook.summary.includes('Cairo Expo Center'));
    assert.ok(webhook.summary.includes('12 Gates'));
    assert.equal(webhook.fields.length, 8);
  });
});
