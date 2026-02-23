export function OrganizationJsonLd({ locale }: { locale: string }) {
  const isAr = locale === 'ar-EG';
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GateFlow',
    url: 'https://gateflow.io',
    logo: 'https://gateflow.io/icons/logo-full.png',
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
