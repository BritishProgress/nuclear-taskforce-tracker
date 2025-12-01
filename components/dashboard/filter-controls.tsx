'use client';

import { cn } from '@/lib/utils';
import { OverallStatus, Chapter, FilterState } from '@/lib/types';
import { OVERALL_STATUS_LABELS } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Filter, ChevronDown } from 'lucide-react';

interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  chapters: Chapter[];
  owners: string[];
  className?: string;
}

export function FilterControls({
  filters,
  onFilterChange,
  chapters,
  owners,
  className,
}: FilterControlsProps) {
  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.chapter !== 'all' ||
    filters.owner !== 'all' ||
    filters.search !== '';

  const clearFilters = () => {
    onFilterChange({
      status: 'all',
      chapter: 'all',
      owner: 'all',
      search: '',
      tag: undefined,
    });
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search recommendations..."
          value={filters.search}
          onChange={(e) =>
            onFilterChange({ ...filters, search: e.target.value })
          }
          className="pl-10 bg-card"
        />
        {filters.search && (
          <button
            onClick={() => onFilterChange({ ...filters, search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Filter size={14} />
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
              'appearance-none px-4 py-2 pr-8 text-sm rounded-md border bg-card cursor-pointer transition-all',
              'hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
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
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Chapter filter */}
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
              'appearance-none px-4 py-2 pr-8 text-sm rounded-md border bg-card cursor-pointer transition-all',
              'hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
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
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Owner filter */}
        <div className="relative inline-block">
          <select
            value={filters.owner}
            onChange={(e) =>
              onFilterChange({ ...filters, owner: e.target.value })
            }
            className={cn(
              'appearance-none px-4 py-2 pr-8 text-sm rounded-md border bg-card cursor-pointer transition-all',
              'hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
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
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Active tag filter */}
        {filters.tag && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border border-primary bg-primary/10 text-primary font-medium">
            <span>Tag: #{filters.tag}</span>
            <button
              onClick={() => onFilterChange({ ...filters, tag: undefined })}
              className="hover:text-primary/70"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={14} className="mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

