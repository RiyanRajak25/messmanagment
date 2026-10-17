import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { label: string; value: string | number }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="text-xs font-bold text-crust tracking-wide uppercase">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={`w-full h-11 pl-4 pr-10 text-sm font-bold text-ink bg-canvas border-2.5 border-ink rounded-full outline-none appearance-none cursor-pointer transition-all focus:shadow-chibi-focus focus:border-ink ${
              error ? 'border-tomato ring-2 ring-tomato/30' : ''
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 w-4 h-4 text-crust pointer-events-none stroke-[2.5]" />
        </div>
        {hint && !error && <span className="text-[11px] text-crust/70 px-2">{hint}</span>}
        {error && <span className="text-xs font-bold text-tomato px-2">⚠ {error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
