import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getOrganizationJsonLd,
  getSoftwareApplicationJsonLd,
  getFaqPageJsonLd,
  getBreadcrumbJsonLd,
} from './seo-schema.ts';

describe('seo-schema (node:test)', () => {
  it('generates valid Organization JSON-LD', () => {
    const org = getOrganizationJsonLd();
    assert.equal(org['@context'], 'https://schema.org');
    assert.equal(org['@type'], 'Organization');
    assert.equal(org.name, 'GateFlow');
    assert.equal(org.url, 'https://gateflow.site');
  });

  it('generates localized SoftwareApplication JSON-LD', () => {
    const appEn = getSoftwareApplicationJsonLd('en');
    assert.equal(appEn['@type'], 'SoftwareApplication');
    assert.ok(appEn.name.includes('GateFlow'));

    const appAr = getSoftwareApplicationJsonLd('ar');
    assert.ok(appAr.name.includes('جيت فلو'));
  });

  it('generates valid FAQPage JSON-LD', () => {
    const faqs = [
      {
        question: 'How fast is QR pass scanning?',
        answer: 'Under 4 seconds at the gate.',
      },
      {
        question: 'Does it work offline?',
        answer: 'Yes, our scanner app works 100% offline.',
      },
    ];
    const faqSchema = getFaqPageJsonLd(faqs);

    assert.equal(faqSchema['@type'], 'FAQPage');
    assert.equal(faqSchema.mainEntity.length, 2);
    assert.equal(faqSchema.mainEntity[0].name, 'How fast is QR pass scanning?');
  });

  it('generates valid BreadcrumbList JSON-LD', () => {
    const crumbs = [
      { name: 'Home', url: 'https://gateflow.site' },
      { name: 'Solutions', url: 'https://gateflow.site/solutions' },
      { name: 'Compounds', url: 'https://gateflow.site/solutions/compounds' },
    ];
    const breadcrumbSchema = getBreadcrumbJsonLd(crumbs);

    assert.equal(breadcrumbSchema['@type'], 'BreadcrumbList');
    assert.equal(breadcrumbSchema.itemListElement.length, 3);
    assert.equal(breadcrumbSchema.itemListElement[2].position, 3);
    assert.equal(breadcrumbSchema.itemListElement[2].name, 'Compounds');
  });
});
