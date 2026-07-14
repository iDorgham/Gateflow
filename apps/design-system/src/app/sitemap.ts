import { MetadataRoute } from 'next';

const BASE_URL = 'https://design.gateflow.site';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/foundations',
    '/tokens',
    '/accessibility',
    '/components/primitives',
    '/components/patterns',
    '/components/ai',
    '/packages',
    '/guidelines',
    '/changelog',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
