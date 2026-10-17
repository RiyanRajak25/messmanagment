import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, hint, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-xs font-bold text-crust tracking-wide uppercase">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-4 text-crust pointer-events-none flex items-center">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full h-11 px-4 text-sm font-medium text-ink bg-canvas border-2.5 border-ink rounded-full outline-none transition-all placeholder:text-crust/50 focus:shadow-chibi-focus focus:border-ink ${
              icon ? 'pl-11' : ''
            } ${error ? 'border-tomato ring-2 ring-tomato/30' : ''} ${className}`}
            {...props}
          />
        </div>
        {hint && !error && <span className="text-[11px] text-crust/70 px-2">{hint}</span>}
        {error && <span className="text-xs font-bold text-tomato px-2">⚠ {error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
