'use client';

import { cn } from '@/lib/utils';
import { OverallStatus, Chapter, FilterState } from '@/lib/types';
import { OVERALL_STATUS_LABELS } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Filter } from 'lucide-react';

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
        <select
          value={filters.status}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              status: e.target.value as OverallStatus | 'all',
            })
          }
          className={cn(
            'px-3 py-1.5 text-sm rounded-full border bg-card cursor-pointer transition-colors',
            filters.status !== 'all'
              ? 'border-primary bg-primary/10 text-primary font-medium'
              : 'border-border text-foreground hover:border-primary/50'
          )}
        >
          <option value="all">All Status</option>
          {Object.entries(OVERALL_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        {/* Chapter filter */}
        <select
          value={filters.chapter}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              chapter: e.target.value === 'all' ? 'all' : parseInt(e.target.value),
            })
          }
          className={cn(
            'px-3 py-1.5 text-sm rounded-full border bg-card cursor-pointer transition-colors',
            filters.chapter !== 'all'
              ? 'border-primary bg-primary/10 text-primary font-medium'
              : 'border-border text-foreground hover:border-primary/50'
          )}
        >
          <option value="all">All Chapters</option>
          {chapters.map((chapter) => (
            <option key={chapter.id} value={chapter.id}>
              Ch. {chapter.id}: {chapter.title}
            </option>
          ))}
        </select>

        {/* Owner filter */}
        <select
          value={filters.owner}
          onChange={(e) =>
            onFilterChange({ ...filters, owner: e.target.value })
          }
          className={cn(
            'px-3 py-1.5 text-sm rounded-full border bg-card cursor-pointer transition-colors',
            filters.owner !== 'all'
              ? 'border-primary bg-primary/10 text-primary font-medium'
              : 'border-border text-foreground hover:border-primary/50'
          )}
        >
          <option value="all">All Owners</option>
          {owners.map((owner) => (
            <option key={owner} value={owner}>
              {owner}
            </option>
          ))}
        </select>

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

