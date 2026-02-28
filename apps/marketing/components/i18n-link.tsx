import Link from 'next/link';
import { type Locale } from '../i18n-config';

interface I18nLinkProps extends React.ComponentProps<typeof Link> {
  locale: Locale;
}

export function I18nLink({ locale, href, ...props }: I18nLinkProps) {
  const path = href.toString();

  // We want to keep the locale in the URL
  const localizedHref = path.startsWith('/')
    ? `/${locale}${path === '/' ? '' : path}`
    : path;

  return <Link href={localizedHref} {...props} />;
}
