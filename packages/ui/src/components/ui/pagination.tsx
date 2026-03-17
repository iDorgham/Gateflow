'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './button';

import Link from 'next/link';
import { useMemo } from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  getHref?: (page: number) => string;
  className?: string;
  maxVisible?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  getHref,
  className,
  maxVisible = 5,
}: PaginationProps) {
  const pages = useMemo(() => {
    const items: (number | string)[] = [];
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      items.push(1);
      if (currentPage > 3) items.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) items.push(i);
      if (currentPage < totalPages - 2) items.push('...');
      items.push(totalPages);
    }
    return items;
  }, [currentPage, totalPages, maxVisible]);

  const Item = ({ page, active, disabled, children }: { page: number; active?: boolean; disabled?: boolean; children: React.ReactNode }) => {
    const commonClass = cn(
      'inline-flex items-center justify-center rounded-sm text-sm font-semibold transition-all',
      'min-w-[32px] h-8 px-2',
      active
        ? 'bg-[var(--ds-background-selected,#DEEBFF)] dark:bg-[#DEEBFF]/10 text-[var(--ds-text-selected,#0747A6)] dark:text-[#4C9AFF]'
        : 'text-[var(--ds-text-subtle,#42526E)] dark:text-[#97A0AF] hover:bg-[var(--ds-background-neutral-subtle,#F4F5F7)] dark:hover:bg-[#2C333A]',
      disabled && 'opacity-30 pointer-events-none'
    );

    if (getHref && !disabled) {
      return (
        <Link href={getHref(page)} className={commonClass}>
          {children}
        </Link>
      );
    }

    return (
      <button
        type="button"
        onClick={() => onPageChange?.(page)}
        disabled={disabled}
        className={commonClass}
      >
        {children}
      </button>
    );
  };

  return (
    <nav className={cn('flex items-center justify-center gap-1', className)} aria-label="Pagination">
      <Item page={currentPage - 1} disabled={currentPage <= 1}>
        <ChevronLeft className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Prev</span>
      </Item>

      <div className="flex items-center gap-0.5">
        {pages.map((p, i) => (
          typeof p === 'number' ? (
            <Item key={i} page={p} active={currentPage === p}>
              {p}
            </Item>
          ) : (
            <span key={i} className="px-2 text-[var(--ds-text-subtlest,#6B778C)] font-black">
              &hellip;
            </span>
          )
        ))}
      </div>

      <Item page={currentPage + 1} disabled={currentPage >= totalPages}>
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4 ml-1" />
      </Item>
    </nav>
  );
}
