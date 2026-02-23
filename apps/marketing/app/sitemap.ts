import type { MetadataRoute } from 'next';
import { i18n } from '../i18n-config';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gateflow.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/features',
    '/pricing',
    '/solutions',
    '/blog',
    '/resources',
    '/help',
    '/company',
    '/contact',
    '/solutions/compounds',
    '/solutions/schools',
    '/solutions/events',
    '/solutions/clubs',
    '/legal/privacy',
    '/legal/terms',
    '/legal/cookies',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const locale of i18n.locales) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1.0 : 0.8,
      });
    }
  }

  return sitemapEntries;
}
