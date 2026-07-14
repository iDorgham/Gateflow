import React from 'react';
import { CmsNestedNav } from '@/components/cms/cms-nested-nav';

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      <div className="w-full md:w-64 shrink-0">
        <CmsNestedNav />
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
