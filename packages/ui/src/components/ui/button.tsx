import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * GateFlow Button — Atlassian Design System GA spec
 * Phase 6: Evolving Buttons pattern with full dark-mode CSS var support.
 * All variants use static --ds- tokens that respond to .dark automatically.
 *
 * Variant map (ADS aligned):
 *   default    → Neutral button (subtle gray)
 *   primary    → Brand bold (blue CTA)
 *   brand      → Alias for primary
 *   destructive → Danger bold (red)
 *   outline    → Neutral w/ visible border
 *   secondary  → Selected/brand subtle
 *   ghost      → No background, subtle text
 *   link       → Inline hyperlink style
 *   subtle     → Minimal, low visual weight
 *   success    → Success bold (green)
 *   warning    → Warning bold (yellow)
 *   discovery  → Discovery/Rovo AI (purple)
 *
 * NEW in Phase 6:
 *   icon-only  → Square icon button (use size="icon-sm" or size="icon")
 *   link-btn   → Semantic button that renders as link-style
 */
const buttonVariants = cva(
  // Base: static styling per ADS "Evolving Buttons" spec
  // gap-2 built-in so icons never need mr-2
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'rounded-[var(--ds-border-radius-200,4px)]',
    'text-sm font-semibold',
    'ring-offset-background transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-[var(--ds-border-focused,#4C9AFF)]',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-40',
    'active:scale-[0.98]',
    'select-none',
  ].join(' '),
  {
    variants: {
      variant: {
        // ─── Neutral (default) ──────────────────────────────
        default: [
          'bg-[var(--ds-background-neutral,#F4F5F7)]',
          'text-[var(--ds-text,#172B4D)]',
          'hover:bg-[var(--ds-background-neutral-hovered,#EBECF0)]',
          'active:bg-[var(--ds-background-neutral-pressed,#DFE1E6)]',
        ].join(' '),

        // ─── Brand / Primary ────────────────────────────────
        primary: [
          'bg-[var(--ds-background-brand-bold,#0052CC)]',
          'text-[var(--ds-text-inverse,#FFFFFF)]',
          'hover:bg-[var(--ds-background-brand-bold-hovered,#004EBE)]',
          'active:bg-[var(--ds-background-brand-bold-pressed,#0065FF)]',
          'shadow-[0_1px_2px_rgba(9,30,66,.25)]',
        ].join(' '),

        brand: [
          'bg-[var(--ds-background-brand-bold,#0052CC)]',
          'text-[var(--ds-text-inverse,#FFFFFF)]',
          'hover:bg-[var(--ds-background-brand-bold-hovered,#004EBE)]',
          'active:bg-[var(--ds-background-brand-bold-pressed,#0065FF)]',
          'shadow-[0_1px_2px_rgba(9,30,66,.25)]',
        ].join(' '),

        // ─── Danger / Destructive ───────────────────────────
        destructive: [
          'bg-[var(--ds-background-danger-bold,#DE350B)]',
          'text-[var(--ds-text-inverse,#FFFFFF)]',
          'hover:bg-[var(--ds-background-danger-bold-hovered,#BF2600)]',
        ].join(' '),

        // ─── Outline ────────────────────────────────────────
        outline: [
          'border border-[var(--ds-border,#DFE1E6)]',
          'bg-transparent',
          'text-[var(--ds-text,#172B4D)]',
          'hover:bg-[var(--ds-background-neutral-subtle,#FAFBFC)]',
          'hover:border-[var(--ds-border-bold,#A5ADBA)]',
          'active:bg-[var(--ds-background-neutral-hovered,#EBECF0)]',
        ].join(' '),

        // ─── Secondary (Selected/Brand subtle) ──────────────
        secondary: [
          'bg-[var(--ds-background-selected,#DEEBFF)]',
          'text-[var(--ds-text-selected,#0052CC)]',
          'hover:bg-[var(--ds-background-selected-hovered,#B3D4FF)]',
        ].join(' '),

        // ─── Ghost ──────────────────────────────────────────
        ghost: [
          'bg-transparent',
          'text-[var(--ds-text-subtle,#42526E)]',
          'hover:bg-[var(--ds-background-neutral-subtle,#FAFBFC)]',
          'active:bg-[var(--ds-background-neutral-hovered,#EBECF0)]',
        ].join(' '),

        // ─── Link ───────────────────────────────────────────
        link: [
          'bg-transparent',
          'text-[var(--ds-text-link,#0052CC)]',
          'underline-offset-4 hover:underline',
          'hover:text-[var(--ds-text-brand,#0052CC)]',
          'p-0 h-auto',
        ].join(' '),

        // ─── Subtle ─────────────────────────────────────────
        subtle: [
          'bg-transparent',
          'text-[var(--ds-text-subtle,#42526E)]',
          'hover:bg-[var(--ds-background-neutral-subtle,#FAFBFC)]',
        ].join(' '),

        // ─── Success ────────────────────────────────────────
        success: [
          'bg-[var(--ds-background-success-bold,#00875A)]',
          'text-[var(--ds-text-inverse,#FFFFFF)]',
          'hover:bg-[var(--ds-background-success-bold-hovered,#006644)]',
          'shadow-[0_1px_2px_rgba(9,30,66,.15)]',
        ].join(' '),

        // ─── Warning ────────────────────────────────────────
        warning: [
          'bg-[var(--ds-background-warning-bold,#FFAB00)]',
          'text-[var(--ds-text-warning-inverse,#172B4D)]',
          'hover:bg-[var(--ds-background-warning-bold-hovered,#FF991F)]',
        ].join(' '),

        // ─── Discovery / Rovo AI ────────────────────────────
        discovery: [
          'bg-[var(--ds-background-discovery-bold,#5243AA)]',
          'text-[var(--ds-text-inverse,#FFFFFF)]',
          'hover:bg-[var(--ds-background-discovery-bold-hovered,#403294)]',
          'shadow-[0_1px_2px_rgba(82,67,170,.3)]',
        ].join(' '),

        // ─── Discovery Subtle ───────────────────────────────
        'discovery-subtle': [
          'bg-[var(--ds-background-discovery-subtle,#EAE6FF)]',
          'text-[var(--ds-text-discovery,#403294)]',
          'hover:bg-[var(--ds-background-discovery-subtle-hovered,#C0B6F2)]',
          'border border-[var(--ds-border-discovery,#998DD9)]',
        ].join(' '),
      },
      size: {
        default: 'h-9 px-4 py-2 text-sm',
        sm:      'h-8 px-3 text-xs',
        lg:      'h-11 px-6 text-base',
        xl:      'h-12 px-8 text-base font-bold',
        icon:    'h-9 w-9 p-0 rounded-[var(--ds-border-radius-200,4px)]',
        'icon-sm': 'h-7 w-7 p-0 text-xs rounded-[var(--ds-border-radius-200,4px)]',
        compact: 'h-7 px-2 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
