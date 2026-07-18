// Mirrors apps/admin-dashboard/src/components/cms/blocks/types.ts#BlockContent —
// the shape the CMS page builder actually writes into
// LandingPageSection.contentEn/contentAr. Keep in sync with that file.
export interface BlockContent {
  headline?: string;
  subheadline?: string;
  body?: string;
  ctaText?: string;
  ctaLink?: string;
  items?: Array<{ icon?: string; title: string; description?: string }>;
  [key: string]: any;
}
