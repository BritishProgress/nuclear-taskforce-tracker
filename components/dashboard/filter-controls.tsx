'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { OverallStatus, Chapter, FilterState } from '@/lib/types';
import { OVERALL_STATUS_LABELS } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Search, X, Filter, ChevronDown } from 'lucide-react';

interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  chapters: Chapter[];
  owners: string[];
  className?: string;
  exportButton?: React.ReactNode;
}

export function FilterControls({
  filters,
  onFilterChange,
  chapters,
  owners,
  className,
  exportButton,
}: FilterControlsProps) {
  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.chapter !== 'all' ||
    filters.owner !== 'all' ||
    filters.search !== '' ||
    filters.tag !== undefined;

  const [isOpen, setIsOpen] = useState(hasActiveFilters);

  const clearFilters = () => {
    onFilterChange({
      status: 'all',
      chapter: 'all',
      owner: 'all',
      search: '',
      tag: undefined,
    });
  };

  const FilterContent = () => (
    <div className="space-y-3">
      {/* Search bar with export button on large screens */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search recommendations..."
            value={filters.search}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
            className="pl-9 h-8 text-sm bg-card"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
        </div>
        {exportButton && (
          <div className="hidden lg:block flex-shrink-0">
            {exportButton}
          </div>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Filter size={12} />
          Filter:
        </span>

        {/* Status filter */}
        <div className="relative inline-block">
          <select
            value={filters.status}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                status: e.target.value as OverallStatus | 'all',
              })
            }
            className={cn(
              'appearance-none px-2.5 py-1 pr-7 text-xs rounded-md border bg-card cursor-pointer transition-all h-7',
              'hover:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary',
              filters.status !== 'all'
                ? 'border-primary bg-primary/10 text-primary font-medium'
                : 'border-border text-foreground'
            )}
          >
            <option value="all">All Status</option>
            {Object.entries(OVERALL_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
        </div>

        {/* Chapter filter - only show chapters with recommendations */}
        <div className="relative inline-block">
          <select
            value={filters.chapter}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                chapter: e.target.value === 'all' ? 'all' : parseInt(e.target.value),
              })
            }
            className={cn(
              'appearance-none px-2.5 py-1 pr-7 text-xs rounded-md border bg-card cursor-pointer transition-all h-7',
              'hover:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary',
              filters.chapter !== 'all'
                ? 'border-primary bg-primary/10 text-primary font-medium'
                : 'border-border text-foreground'
            )}
          >
            <option value="all">All Chapters</option>
            {chapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                Ch. {chapter.id}: {chapter.title}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
        </div>

        {/* Owner filter */}
        <div className="relative inline-block">
          <select
            value={filters.owner}
            onChange={(e) =>
              onFilterChange({ ...filters, owner: e.target.value })
            }
            className={cn(
              'appearance-none px-2.5 py-1 pr-7 text-xs rounded-md border bg-card cursor-pointer transition-all h-7',
              'hover:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary',
              filters.owner !== 'all'
                ? 'border-primary bg-primary/10 text-primary font-medium'
                : 'border-border text-foreground'
            )}
          >
            <option value="all">All Owners</option>
            {owners.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
        </div>

        {/* Active tag filter */}
        {filters.tag && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border border-primary bg-primary/10 text-primary font-medium">
            <span>Tag: #{filters.tag}</span>
            <button
              onClick={() => onFilterChange({ ...filters, tag: undefined })}
              className="hover:text-primary/70"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
          >
            <X size={12} className="mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Export button on mobile and medium screens - below all controls */}
      {exportButton && (
        <div className="flex justify-end lg:hidden">
          {exportButton}
        </div>
      )}
    </div>
  );

  return (
    <div className={cn('w-full', className)}>
      {/* Collapsible for both mobile and desktop */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className={cn(
          'rounded-md border transition-all',
          hasActiveFilters
            ? 'border-primary bg-primary/5'
            : 'border-border/50 bg-muted/50'
        )}>
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                'w-full flex items-center justify-between p-2.5 transition-all',
                'hover:bg-muted/50',
                isOpen && 'border-b border-border'
              )}
            >
              <div className="flex items-center gap-2">
                <Filter size={16} className={hasActiveFilters ? 'text-primary' : 'text-muted-foreground'} />
                <span className={cn(
                  'text-sm font-medium',
                  hasActiveFilters ? 'text-primary' : 'text-foreground'
                )}>
                  {hasActiveFilters ? 'Filters Active' : 'Filters & Export'}
                </span>
                {hasActiveFilters && (
                  <span className="px-1.5 py-0.5 text-xs rounded-full bg-primary/20 text-primary font-medium">
                    Active
                  </span>
                )}
              </div>
              <ChevronDown
                size={16}
                className={cn(
                  'text-muted-foreground transition-transform',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-3">
              <FilterContent />
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}

