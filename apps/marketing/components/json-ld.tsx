const BASE_URL = 'https://gateflow.io';

export function OrganizationJsonLd({ locale }: { locale: string }) {
  const isAr = locale === 'ar-EG';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GateFlow',
    url: BASE_URL,
    logo: `${BASE_URL}/icons/logo-full.png`,
    description: isAr
      ? 'نظام ذكي للتحكم في الدخول عبر رمز QR للمجمعات السكنية والمدارس والفعاليات في مصر والخليج.'
      : 'Modern QR-based access control for gated communities, schools, events, and clubs across Egypt and the Gulf.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'New Cairo',
      addressCountry: 'EG',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+20-100-000-0000',
      contactType: 'sales',
      availableLanguage: ['Arabic', 'English'],
    },
    sameAs: [
      'https://linkedin.com/company/gateflow',
      'https://twitter.com/gateflow',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd({ locale }: { locale: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GateFlow',
    url: BASE_URL,
    inLanguage: locale === 'ar-EG' ? 'ar' : 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/en/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqPageJsonLd({ items }: { items: FaqItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
