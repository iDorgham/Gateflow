import React from 'react';
import { Button } from '@gateflow/ui';
import {
  Plus,
  LayoutTemplate,
  MoreVertical,
  Edit2,
  Copy,
  Trash,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n/i18n-config';

export const metadata = { title: 'Landing Pages | CMS' };

// Mock data
const MOCK_PAGES = [
  {
    id: 'home',
    title: 'Main Homepage',
    slug: '/',
    status: 'PUBLISHED',
    locale: 'en',
    aiContent: 3,
    updatedAt: '2 hours ago',
  },
  {
    id: 'enterprise',
    title: 'Enterprise Security',
    slug: '/enterprise',
    status: 'DRAFT',
    locale: 'en',
    aiContent: 8,
    updatedAt: '1 day ago',
  },
  {
    id: 'home-ar',
    title: 'الرئيسية',
    slug: '/ar',
    status: 'PUBLISHED',
    locale: 'ar',
    aiContent: 3,
    updatedAt: '2 days ago',
  },
];

export default async function LandingPagesPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ds-text">
            Landing Pages
          </h1>
          <p className="text-sm text-ds-text-subtle mt-1">
            Build and manage high-converting marketing pages
          </p>
        </div>
        <Button className="gap-2 bg-ds-background-brand-bold text-ds-text-inverse hover:bg-ds-background-brand-bold/90">
          <Plus className="h-4 w-4" /> Create Page
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PAGES.map((page) => (
          <div
            key={page.id}
            className="group relative bg-ds-surface border border-ds-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            {/* Thumbnail Placeholder */}
            <div className="h-40 bg-ds-surface-subtle border-b border-ds-border relative overflow-hidden flex items-center justify-center">
              <LayoutTemplate className="h-12 w-12 text-ds-icon-subtle opacity-20" />
              <div className="absolute top-3 right-3 flex gap-2">
                {page.status === 'PUBLISHED' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-ds-background-success-subtle text-ds-text-success border border-ds-border-success">
                    <CheckCircle2 className="h-3 w-3" /> Published
                  </span>
                )}
                {page.status === 'DRAFT' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-ds-surface-neutral-hovered text-ds-text-subtle border border-ds-border-subtle">
                    Draft
                  </span>
                )}
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-ds-text text-lg leading-tight mb-1">
                {page.title}
              </h3>
              <p className="text-sm text-ds-text-subtle mb-4">{page.slug}</p>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3 text-xs text-ds-text-subtle">
                  <span className="flex items-center gap-1 bg-ds-surface-subtle px-1.5 py-0.5 rounded border border-ds-border">
                    <Globe className="h-3 w-3" /> {page.locale.toUpperCase()}
                  </span>
                  <span>{page.aiContent} AI Sections</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/${locale}/cms/pages/${page.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-ds-text-brand"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-ds-text-danger"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
