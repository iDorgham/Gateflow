import * as React from 'react';

export function LegalLayout({ title, lastUpdated, children }: { title: string; lastUpdated: string; children: React.ReactNode }) {
  return (
    <div className="container px-6 py-24 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl lg:text-5xl font-black mb-4">{title}</h1>
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">
          {lastUpdated}
        </p>
      </div>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        {children}
      </div>
    </div>
  );
}
