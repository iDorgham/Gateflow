"use client";

import * as React from 'react';
import { cn } from '../../lib/utils';

interface SheetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | undefined>(undefined);

function useSheet() {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error('Sheet components must be used within a Sheet');
  }
  return context;
}

const Sheet = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { open?: boolean; onOpenChange?: (open: boolean) => void }
>(({ className, open: controlledOpen, onOpenChange, children, ...props }, ref) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = onOpenChange !== undefined ? onOpenChange : setUncontrolledOpen;

  const value = React.useMemo(() => ({ open, setOpen }), [open, setOpen]);

  return (
    <SheetContext.Provider value={value}>
      <div ref={ref} className={cn('', className)} {...props}>
        {children}
      </div>
    </SheetContext.Provider>
  );
});
Sheet.displayName = 'Sheet';

const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, asChild: _asChild, onClick, ...props }, ref) => {
  const { open, setOpen } = useSheet();
  return (
    <button
      ref={ref}
      className={cn('', className)}
      onClick={(e) => {
        setOpen(!open);
        onClick?.(e);
      }}
      {...props}
    />
  );
});
SheetTrigger.displayName = 'SheetTrigger';

const SheetPortal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('fixed inset-0 z-50', className)} {...props} />
));
SheetPortal.displayName = 'SheetPortal';

const SheetOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, onClick, ...props }, ref) => {
  const { setOpen } = useSheet();
  return (
    <div
      ref={ref}
      className={cn('fixed inset-0 z-50 bg-black/50 backdrop-blur-sm', className)}
      onClick={(e) => {
        setOpen(false);
        onClick?.(e);
      }}
      {...props}
    />
  );
});
SheetOverlay.displayName = 'SheetOverlay';

const SheetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { side?: 'top' | 'bottom' | 'left' | 'right' }
>(({ className, side = 'right', children, ...props }, ref) => {
  const { open } = useSheet();

  if (!open) return null;

  const sideClasses = {
    top: 'top-0 left-0 right-0 border-b',
    bottom: 'bottom-0 left-0 right-0 border-t',
    left: 'top-0 bottom-0 left-0 border-r',
    right: 'top-0 bottom-0 right-0 border-l',
  };

  return (
    <SheetPortal>
      <SheetOverlay />
      <div
        ref={ref}
        className={cn(
          'fixed z-50 gap-4 bg-white p-6 shadow-lg transition ease-in-out animate-in duration-300',
          side === 'left' ? 'slide-in-from-left' : 'slide-in-from-right',
          sideClasses[side],
          side === 'top' || side === 'bottom' ? 'h-auto w-full' : 'h-full w-3/4 sm:max-w-sm',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SheetPortal>
  );
});
SheetContent.displayName = 'SheetContent';

const SheetHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
));
SheetHeader.displayName = 'SheetHeader';

const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn('text-lg font-semibold text-slate-950', className)} {...props} />
));
SheetTitle.displayName = 'SheetTitle';

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-slate-500', className)} {...props} />
));
SheetDescription.displayName = 'SheetDescription';

const SheetFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
));
SheetFooter.displayName = 'SheetFooter';

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetOverlay,
};
