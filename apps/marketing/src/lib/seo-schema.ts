/**
 * Structured JSON-LD SEO Schema generator for GateFlow marketing pages.
 */

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generates schema.org/Organization JSON-LD.
 */
export function getOrganizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GateFlow',
    url: 'https://gateflow.site',
    logo: 'https://gateflow.site/brand/gateflow-logo.png',
    description:
      'Autonomous visitor management and high-throughput physical gate access control system for the MENA region.',
    sameAs: [
      'https://www.linkedin.com/company/gateflow',
      'https://twitter.com/gateflowapp',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'sales@gateflow.site',
      availableLanguage: ['English', 'Arabic'],
    },
  };
}

/**
 * Generates schema.org/SoftwareApplication JSON-LD.
 */
export function getSoftwareApplicationJsonLd(
  locale: 'en' | 'ar' = 'en'
): Record<string, unknown> {
  const isAr = locale === 'ar';

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: isAr
      ? 'نظام جيت فلو لإدارة بوابات الدخول'
      : 'GateFlow Access Control & Visitor Management',
    operatingSystem: 'iOS, Android, Web',
    applicationCategory: 'BusinessApplication, SecurityApplication',
    offers: {
      '@type': 'Offer',
      price: '120.00',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        priceType: 'Subscription',
        unitText: 'MONTH',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '128',
      bestRating: '5',
    },
  };
}

/**
 * Generates schema.org/FAQPage JSON-LD.
 */
export function getFaqPageJsonLd(faqs: FaqItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generates schema.org/BreadcrumbList JSON-LD.
 */
export function getBreadcrumbJsonLd(
  items: BreadcrumbItem[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
