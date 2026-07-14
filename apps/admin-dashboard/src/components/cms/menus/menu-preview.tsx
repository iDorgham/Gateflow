import React from 'react';
import { cn } from '@gateflow/ui';
import { MenuItem } from './menu-item-row';
import { ChevronDown, Monitor, Smartphone, Globe } from 'lucide-react';
import { Button } from '@gateflow/ui';

interface MenuPreviewProps {
  items: MenuItem[];
}

export function MenuPreview({ items }: MenuPreviewProps) {
  const [locale, setLocale] = React.useState<'en' | 'ar'>('en');
  const [breakpoint, setBreakpoint] = React.useState<'desktop' | 'mobile'>(
    'desktop'
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-ds-surface p-2 border border-ds-border rounded-lg shadow-sm">
        <div className="flex gap-1 bg-ds-surface-subtle p-1 rounded-md border border-ds-border">
          <Button
            variant={locale === 'en' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setLocale('en')}
            className="h-7 px-2 text-[10px] font-bold uppercase"
          >
            English
          </Button>
          <Button
            variant={locale === 'ar' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setLocale('ar')}
            className="h-7 px-2 text-[10px] font-bold uppercase"
          >
            العربية
          </Button>
        </div>

        <div className="flex gap-1 bg-ds-surface-subtle p-1 rounded-md border border-ds-border">
          <Button
            variant={breakpoint === 'desktop' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setBreakpoint('desktop')}
            className="h-7 px-2"
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant={breakpoint === 'mobile' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setBreakpoint('mobile')}
            className="h-7 px-2"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          'bg-ds-surface border border-ds-border rounded-xl shadow-xl overflow-hidden transition-all duration-300 mx-auto',
          breakpoint === 'mobile' ? 'max-w-[375px]' : 'w-full'
        )}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Navigation Bar Mock */}
        <div className="h-16 border-b border-ds-border px-6 flex items-center justify-between bg-ds-surface">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-ds-background-brand-bold rounded-lg flex items-center justify-center">
              <Globe className="h-5 w-5 text-ds-text-inverse" />
            </div>
            <span className="font-black text-lg tracking-tighter uppercase">
              GateFlow
            </span>
          </div>

          {breakpoint === 'desktop' ? (
            <ul className="flex items-center gap-8">
              {items.map((item) => (
                <li key={item.id} className="relative group">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-ds-text-subtle hover:text-ds-text cursor-pointer transition-colors py-2">
                    {locale === 'ar'
                      ? item.labelAr || item.label
                      : item.label || 'New Item'}
                    {item.children && item.children.length > 0 && (
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    )}
                  </div>

                  {item.children && item.children.length > 0 && (
                    <div className="absolute top-full ltr:left-0 rtl:right-0 mt-1 w-48 bg-ds-surface border border-ds-border rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50 translate-y-2 group-hover:translate-y-0">
                      {item.children.map((child) => (
                        <div
                          key={child.id}
                          className="px-4 py-2 text-xs font-medium hover:bg-ds-surface-subtle cursor-pointer transition-colors"
                        >
                          {locale === 'ar'
                            ? child.labelAr || child.label
                            : child.label || 'Sub Item'}
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="h-10 w-10 flex flex-col items-center justify-center gap-1.5 cursor-pointer">
              <div className="h-0.5 w-6 bg-ds-text" />
              <div className="h-0.5 w-6 bg-ds-text" />
              <div className="h-0.5 w-6 bg-ds-text" />
            </div>
          )}
        </div>

        {/* Content Placeholder */}
        <div className="h-64 bg-ds-surface-subtle flex items-center justify-center text-ds-text-subtlest text-xs uppercase font-bold tracking-widest">
          Website Content Preview
        </div>
      </div>
    </div>
  );
}
