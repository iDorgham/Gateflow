'use client';

import { motion } from 'framer-motion';
import { Building, Mail, Phone, Eye, Pencil } from 'lucide-react';
import { cn } from '@gate-access/ui';
import type { ContactRow } from '@/lib/residents/use-contacts';

interface ResidentCardProps {
  contact: ContactRow;
  onView?: () => void;
  onEdit?: () => void;
}

export function ResidentCard({ contact, onView, onEdit }: ResidentCardProps) {
  const initials = [contact.firstName[0], contact.lastName[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase();

  const hasUnits = contact.units.length > 0;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={cn(
        'group relative flex flex-col gap-3 rounded-lg border border-[var(--ds-border,#DFE1E6)] bg-[var(--ds-surface-raised,#FFFFFF)] p-4',
        'shadow-[0_1px_1px_rgba(9,30,66,0.08),0_0_1px_rgba(9,30,66,0.08)]',
        'hover:border-[var(--ds-border-focused,#4C9AFF)] hover:shadow-[0_4px_8px_-2px_rgba(9,30,66,0.16),0_0_1px_rgba(9,30,66,0.08)]',
        'transition-[border-color,box-shadow] duration-150',
      )}
    >
      {/* Header: Avatar + Name */}
      <div className="flex items-center gap-3">
        {contact.avatarUrl ? (
          <img
            src={contact.avatarUrl}
            alt={`${contact.firstName} ${contact.lastName}`}
            className="h-10 w-10 rounded-full object-cover shrink-0 ring-2 ring-[var(--ds-border,#DFE1E6)]"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--ds-background-neutral,#EBECF0)] text-sm font-black text-[var(--ds-text-subtle,#42526E)]">
            {initials}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[var(--ds-text,#172B4D)]">
            {contact.firstName} {contact.lastName}
          </p>
          {contact.jobTitle && (
            <p className="truncate text-[11px] text-[var(--ds-text-subtlest,#6B778C)]">
              {contact.jobTitle}
            </p>
          )}
        </div>

        {/* Action buttons — visible on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
          {onView && (
            <button
              onClick={onView}
              className="flex h-7 w-7 items-center justify-center rounded-sm hover:bg-[var(--ds-background-neutral-subtle-hovered,#EBECF0)] text-[var(--ds-icon-subtle,#6B778C)] transition-colors"
              aria-label="View contact"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex h-7 w-7 items-center justify-center rounded-sm hover:bg-[var(--ds-background-neutral-subtle-hovered,#EBECF0)] text-[var(--ds-icon-subtle,#6B778C)] transition-colors"
              aria-label="Edit contact"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Contact info */}
      <div className="flex flex-col gap-1.5 ps-1">
        {contact.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 shrink-0 text-[var(--ds-icon-subtle,#6B778C)]" aria-hidden="true" />
            <span className="truncate text-xs text-[var(--ds-text-subtle,#42526E)]">{contact.email}</span>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 shrink-0 text-[var(--ds-icon-subtle,#6B778C)]" aria-hidden="true" />
            <span className="text-xs text-[var(--ds-text-subtle,#42526E)]">{contact.phone}</span>
          </div>
        )}
        {contact.company && (
          <div className="flex items-center gap-2">
            <Building className="h-3 w-3 shrink-0 text-[var(--ds-icon-subtle,#6B778C)]" aria-hidden="true" />
            <span className="truncate text-xs text-[var(--ds-text-subtle,#42526E)]">{contact.company}</span>
          </div>
        )}
      </div>

      {/* Footer: units + visits */}
      <div className="flex items-center justify-between gap-2 border-t border-[var(--ds-border-subtle,#F4F5F7)] pt-2.5">
        <div className="flex flex-wrap gap-1">
          {hasUnits ? (
            contact.units.slice(0, 2).map((unit) => (
              <span
                key={unit.id}
                className="inline-flex items-center rounded-[3px] bg-[var(--ds-background-brand-subtle,#DEEBFF)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--ds-text-brand,#0052CC)] uppercase tracking-tight"
              >
                {unit.name}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-[var(--ds-text-subtlest,#6B778C)]">No units</span>
          )}
          {contact.units.length > 2 && (
            <span className="inline-flex items-center rounded-[3px] bg-[var(--ds-background-neutral-subtle,#F4F5F7)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--ds-text-subtlest,#6B778C)]">
              +{contact.units.length - 2}
            </span>
          )}
        </div>

        <span className="shrink-0 text-[10px] font-bold tabular-nums text-[var(--ds-text-subtlest,#6B778C)]">
          {contact.visitsInRange} visits
        </span>
      </div>
    </motion.div>
  );
}
