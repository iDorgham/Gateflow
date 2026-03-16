import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@gate-access/ui';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  homeHref?: string;
  className?: string;
}

export function PageHeader({ 
  title, 
  subtitle, 
  badge, 
  actions, 
  breadcrumbs, 
  homeHref,
  className 
}: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {homeHref && (
            <>
              <Link 
                href={homeHref}
                className="flex items-center text-[#6B778C] hover:text-[#0052CC] transition-colors"
                aria-label="Home"
              >
                <Home className="h-3.5 w-3.5" />
              </Link>
              <ChevronRight className="h-3 w-3 text-[#C1C7D0] shrink-0" />
            </>
          )}
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-2 shrink-0">
              {crumb.href ? (
                <Link 
                  href={crumb.href}
                  className="text-[11px] font-black uppercase tracking-widest text-[#6B778C] hover:text-[#0052CC] transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[11px] font-black uppercase tracking-widest text-[#172B4D]">
                  {crumb.label}
                </span>
              )}
              {idx < breadcrumbs.length - 1 && (
                <ChevronRight className="h-3 w-3 text-[#C1C7D0] shrink-0" />
              )}
            </div>
          ))}
        </nav>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-[#172B4D] dark:text-white">
              {title}
            </h1>
            {badge}
          </div>
          {subtitle && (
            <p className="text-[14px] text-[#6B778C] dark:text-[#97A0AF] leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 shrink-0 animate-in fade-in slide-in-from-right-4 duration-500">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
