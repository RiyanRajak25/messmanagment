import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItemProps {
  id: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  badgeVariant?: any;
  content?: React.ReactNode;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}

export interface AccordionProps {
  items: AccordionItemProps[];
  allowMultiple?: boolean;
  className?: string;
}

/**
 * Modern Accordion Component (shadcn UI style)
 * ============================================
 * Enables progressive disclosure of complex logistics, commodity specifications,
 * audit traces, and fiscal notes on click without page clutter.
 */
export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className = '',
}) => {
  const [openIds, setOpenIds] = useState<string[]>(() => {
    return items.filter((item) => item.defaultOpen).map((item) => item.id);
  });

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const isOpen = prev.includes(id);
      if (allowMultiple) {
        return isOpen ? prev.filter((i) => i !== id) : [...prev, id];
      } else {
        return isOpen ? [] : [id];
      }
    });
  };

  return (
    <div className={`divide-y divide-sand/40 border border-sand/60 rounded-card bg-white shadow-subtle overflow-hidden ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);

        return (
          <div key={item.id} className="transition-colors duration-150">
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              aria-expanded={isOpen}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-snow/60 focus-visible:bg-snow/80 transition-all duration-150 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1 min-w-0 pr-2">
                <div className="font-heading font-bold text-sm text-olive-deep group-hover:text-olive transition-colors flex items-center gap-2">
                  {item.title}
                </div>
                {item.subtitle && (
                  <span className="text-xs text-pine/60 font-medium truncate">
                    {item.subtitle}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.badge}
                <div
                  className={`w-6 h-6 rounded-full bg-snow border border-sand/40 flex items-center justify-center text-olive transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-olive text-snow' : 'group-hover:border-sand'
                  }`}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 pt-1 bg-snow/20 border-t border-sand/20 animate-in fade-in duration-200">
                {item.content || item.children}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
