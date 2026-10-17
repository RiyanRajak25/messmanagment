import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Modern Breadcrumb Component (shadcn UI style)
 * =============================================
 * Provides crisp, institutional hierarchical navigation across deep operational pages.
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = '',
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs text-pine/70 font-medium select-none ${className}`}
    >
      <ol className="flex items-center space-x-1 sm:space-x-2">
        <li>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-olive hover:text-olive-deep transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only sm:not-sr-only text-[11px] font-heading font-semibold">HQ</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.current;

          return (
            <li key={index} className="flex items-center space-x-1 sm:space-x-2">
              <ChevronRight className="w-3.5 h-3.5 text-sand shrink-0" aria-hidden="true" />
              {isLast || !item.href ? (
                <span
                  className="font-heading font-bold text-olive-deep text-[11px] tracking-tight truncate max-w-[200px]"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="text-pine/70 hover:text-olive transition-colors text-[11px] font-heading font-semibold truncate max-w-[150px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
