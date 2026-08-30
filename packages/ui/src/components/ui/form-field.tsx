'use client';

import * as React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface StandaloneFormFieldProps {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  id?: string;
  className?: string;
  children: React.ReactElement;
}

/**
 * GateFlow Composable FormField
 * Connects label, control, helper text, and error message with accessible ARIA relationships.
 */
export function FormField({
  label,
  helperText,
  errorMessage,
  isRequired,
  isInvalid: customIsInvalid,
  isDisabled,
  id: explicitId,
  className,
  children,
}: StandaloneFormFieldProps) {
  const generatedId = React.useId();
  const id = explicitId || generatedId;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const isInvalid = customIsInvalid || Boolean(errorMessage);

  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 w-full text-start',
        isDisabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-[var(--ds-text-primary)] flex items-center gap-1"
        >
          {label}
          {isRequired && (
            <span className="text-[var(--ds-color-danger)] font-bold" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {React.isValidElement(children) &&
        React.cloneElement(children as React.ReactElement<any>, {
          id,
          'aria-invalid': isInvalid ? true : undefined,
          'aria-describedby': isInvalid
            ? errorId
            : helperText
            ? helperId
            : undefined,
          disabled: isDisabled,
          className: cn(
            (children.props as any).className,
            isInvalid && 'border-[var(--ds-color-danger)] focus-visible:ring-[var(--ds-color-danger)]'
          ),
        })}

      {isInvalid && errorMessage ? (
        <p
          id={errorId}
          role="alert"
          className="text-xs text-[var(--ds-color-danger)] font-medium flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-[var(--ds-text-subtle)]">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

FormField.displayName = 'FormField';
