'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Slot } from '@radix-ui/react-slot';

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownMenuContext = React.createContext<
  DropdownMenuContextValue | undefined
>(undefined);

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error('Dropdown components must be used within a DropdownMenu');
  }
  return context;
}

export function DropdownMenu({
  className,
  open: controlledOpen,
  onOpenChange,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen =
    onOpenChange !== undefined ? onOpenChange : setUncontrolledOpen;

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, setOpen]);

  const value = React.useMemo(() => ({ open, setOpen }), [open, setOpen]);

  return (
    <DropdownMenuContext.Provider value={value}>
      <div
        ref={containerRef}
        className={cn('relative inline-block', className)}
        {...props}
      >
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

DropdownMenu.displayName = 'DropdownMenu';

export function DropdownMenuTrigger({
  className,
  asChild = false,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { open, setOpen } = useDropdownMenu();
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={className}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        setOpen(!open);
        onClick?.(e);
      }}
      {...props}
    />
  );
}

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

export function DropdownMenuContent({
  className,
  align = 'end',
  side = 'bottom',
  sideOffset = 8,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
}) {
  const { open } = useDropdownMenu();

  if (!open) return null;

  const isVertical = side === 'top' || side === 'bottom';

  const sideClass =
    side === 'bottom'
      ? 'top-full'
      : side === 'top'
        ? 'bottom-full'
        : side === 'right'
          ? 'left-full'
          : 'right-full';

  const alignClass = isVertical
    ? align === 'start'
      ? 'left-0'
      : align === 'center'
        ? 'left-1/2 -translate-x-1/2'
        : 'right-0'
    : align === 'start'
      ? 'top-0'
      : align === 'center'
        ? 'top-1/2 -translate-y-1/2'
        : 'bottom-0';

  const offsetStyle: React.CSSProperties =
    side === 'bottom'
      ? { marginTop: sideOffset }
      : side === 'top'
        ? { marginBottom: sideOffset }
        : side === 'right'
          ? { marginLeft: sideOffset }
          : { marginRight: sideOffset };

  return (
    <div
      className={cn(
        'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 text-slate-950 dark:text-slate-100 shadow-md animate-in fade-in zoom-in-95',
        sideClass,
        alignClass,
        className
      )}
      style={{ ...offsetStyle, ...style }}
      {...props}
    />
  );
}

DropdownMenuContent.displayName = 'DropdownMenuContent';

export function DropdownMenuItem({
  className,
  inset,
  asChild = false,
  onClick,
  disabled,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  inset?: boolean;
  asChild?: boolean;
  disabled?: boolean;
}) {
  const { setOpen } = useDropdownMenu();
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        inset && 'pl-8',
        className
      )}
      data-disabled={disabled ? '' : undefined}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled) {
          return;
        }
        setOpen(false);
        onClick?.(e);
      }}
      {...props}
    />
  );
}

DropdownMenuItem.displayName = 'DropdownMenuItem';

export function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }) {
  return (
    <div
      className={cn(
        'px-2 py-1.5 text-sm font-semibold',
        inset && 'pl-8',
        className
      )}
      {...props}
    />
  );
}

DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export function DropdownMenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        '-mx-1 my-1 h-px bg-slate-200 dark:bg-slate-700',
        className
      )}
      {...props}
    />
  );
}

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export function DropdownMenuGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('', className)} {...props} />;
}

DropdownMenuGroup.displayName = 'DropdownMenuGroup';
