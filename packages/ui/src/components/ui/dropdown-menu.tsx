'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils';
import { Slot } from '@radix-ui/react-slot';

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
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

export function getDropdownFixedStyle(
  rect: Pick<DOMRect, 'top' | 'bottom' | 'left' | 'right' | 'width' | 'height'>,
  options: {
    align?: 'start' | 'center' | 'end';
    side?: 'top' | 'bottom' | 'left' | 'right';
    sideOffset?: number;
    viewportWidth: number;
  }
): React.CSSProperties {
  const align = options.align ?? 'end';
  const side = options.side ?? 'bottom';
  const sideOffset = options.sideOffset ?? 8;
  const { viewportWidth } = options;

  const style: React.CSSProperties = { position: 'fixed' };

  if (side === 'bottom') {
    style.top = rect.bottom + sideOffset;
  } else if (side === 'top') {
    style.top = rect.top - sideOffset;
    style.transform = 'translateY(-100%)';
  } else if (side === 'right') {
    style.left = rect.right + sideOffset;
  } else {
    style.right = viewportWidth - rect.left + sideOffset;
  }

  if (side === 'top' || side === 'bottom') {
    if (align === 'start') {
      style.left = rect.left;
    } else if (align === 'center') {
      style.left = rect.left + rect.width / 2;
      style.transform = [style.transform, 'translateX(-50%)']
        .filter(Boolean)
        .join(' ');
    } else {
      style.right = viewportWidth - rect.right;
    }
  } else if (side === 'left' || side === 'right') {
    if (align === 'start') {
      style.top = rect.top;
    } else if (align === 'center') {
      style.top = rect.top + rect.height / 2;
      style.transform = [style.transform, 'translateY(-50%)']
        .filter(Boolean)
        .join(' ');
    } else {
      style.top = rect.bottom;
      style.transform = [style.transform, 'translateY(-100%)']
        .filter(Boolean)
        .join(' ');
    }
  }

  return style;
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

  const triggerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (contentRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, setOpen]);

  const value = React.useMemo(
    () => ({ open, setOpen, triggerRef, contentRef }),
    [open, setOpen]
  );

  return (
    <DropdownMenuContext.Provider value={value}>
      <div
        ref={triggerRef}
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
  const { open, triggerRef, contentRef } = useDropdownMenu();
  const [coords, setCoords] = React.useState<React.CSSProperties>({});

  React.useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    const update = () => {
      if (!triggerRef.current) return;
      setCoords(
        getDropdownFixedStyle(triggerRef.current.getBoundingClientRect(), {
          align,
          side,
          sideOffset,
          viewportWidth: window.innerWidth,
        })
      );
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, align, side, sideOffset, triggerRef]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      ref={contentRef}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-xl border border-[var(--ds-border-subtle)] bg-[var(--ds-surface-raised)] p-1 text-[var(--ds-text)] shadow-lg animate-in fade-in zoom-in-95',
        className
      )}
      style={{ ...coords, ...style }}
      {...props}
    />,
    document.body
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
        'relative flex cursor-default select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-all hover:bg-[var(--ds-background-neutral-subtle)] focus:bg-[var(--ds-background-selected)] focus:text-[var(--ds-text-selected)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 group-hover:bg-[var(--ds-background-neutral-subtle)]',
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
