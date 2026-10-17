import React from 'react';
import { Search, X, SlidersHorizontal, Download, Printer } from 'lucide-react';
import { Button } from '../Button';

export interface FilterChip<T = string> {
  id: T;
  label: string;
  count?: number;
}

export interface TableControlsProps<T = string> {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  filterChips?: FilterChip<T>[];
  activeFilter?: T;
  onFilterChange?: (filterId: T) => void;
  totalResults?: number;
  onExport?: () => void;
  onPrint?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Modern TableControls Toolbar (shadcn / Tailwind UI style)
 * =========================================================
 * Provides unified search with keyboard shortcut pip, status pill filters,
 * export buttons, and counter metrics.
 */
export const TableControls = <T extends string>({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search records by ID, commodity, or tag...',
  filterChips,
  activeFilter,
  onFilterChange,
  totalResults,
  onExport,
  onPrint,
  actions,
  className = '',
}: TableControlsProps<T>): React.ReactElement => {
  return (
    <div className={`flex flex-col gap-3 sm:gap-4 select-none ${className}`}>
      {/* Top Bar: Search and Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input Box */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-pine/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-14 py-2 text-xs rounded-control bg-white border border-sand/70 placeholder:text-pine/40 text-pine font-medium focus:border-olive focus:ring-1 focus:ring-olive transition-all shadow-subtle"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-pine/40 hover:text-pine p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[9px] font-mono text-pine/40 bg-snow border border-sand/40 rounded">
              /
            </kbd>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {typeof totalResults === 'number' && (
            <span className="text-[11px] font-mono font-medium text-pine/60 mr-1 hidden md:inline">
              {totalResults} record{totalResults !== 1 ? 's' : ''}
            </span>
          )}

          {onPrint && (
            <Button
              variant="outline"
              size="sm"
              onClick={onPrint}
              icon={<Printer className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Print
            </Button>
          )}

          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              icon={<Download className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Export
            </Button>
          )}

          {actions}
        </div>
      </div>

      {/* Filter Chips Bar (if provided) */}
      {filterChips && filterChips.length > 0 && onFilterChange && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-heading font-bold text-pine/50 uppercase tracking-wider mr-1 hidden sm:inline">
            Filter:
          </span>
          {filterChips.map((chip) => {
            const isActive = activeFilter === chip.id;

            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => onFilterChange(chip.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-badge text-[11px] font-heading font-bold transition-all duration-150 border shrink-0 ${
                  isActive
                    ? 'bg-olive text-snow border-olive shadow-subtle'
                    : 'bg-white text-pine/70 border-sand/60 hover:border-olive/50 hover:bg-snow'
                }`}
              >
                <span>{chip.label}</span>
                {typeof chip.count === 'number' && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${
                      isActive ? 'bg-snow/20 text-snow' : 'bg-sand/20 text-pine/70'
                    }`}
                  >
                    {chip.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
