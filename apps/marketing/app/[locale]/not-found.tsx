import { ErrorContent } from '../../components/sections/error-content';
import type { Locale } from '../../i18n-config';

// Next.js fallback for Not Found
// In Next.js app router, you trigger this using notFound()
export default function NotFoundPage({ params }: { params?: { locale?: Locale } }) {
  const locale = params?.locale || 'en';
  return <ErrorContent locale={locale} code="404" />;
}
