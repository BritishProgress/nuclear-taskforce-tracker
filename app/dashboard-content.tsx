'use client';

import { useState, useMemo } from 'react';
import { HeroStats, FilterControls, DeadlineSidebar } from '@/components/dashboard';
import { ChapterSection } from '@/components/recommendations';
import { 
  StatusCounts, 
  ChapterWithRecommendations, 
  UpcomingDeadline, 
  RecentUpdate, 
  FilterState,
  Chapter,
  Recommendation,
} from '@/lib/types';

interface DashboardContentProps {
  counts: StatusCounts;
  chaptersWithRecs: ChapterWithRecommendations[];
  deadlines: UpcomingDeadline[];
  recentUpdates: RecentUpdate[];
  owners: string[];
  chapters: Chapter[];
}

export function DashboardContent({
  counts,
  chaptersWithRecs,
  deadlines,
  recentUpdates,
  owners,
  chapters,
}: DashboardContentProps) {
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    chapter: 'all',
    owner: 'all',
    search: '',
  });

  // Filter recommendations based on current filters
  const filteredChapters = useMemo(() => {
    return chaptersWithRecs
      .map((chapter) => {
        // Filter by chapter if specified
        if (filters.chapter !== 'all' && chapter.id !== filters.chapter) {
          return null;
        }

        // Filter recommendations within each chapter
        const filteredRecs = chapter.recommendations.filter((rec) => {
          // Status filter
          if (filters.status !== 'all' && rec.overall_status.status !== filters.status) {
            return false;
          }

          // Owner filter
          if (filters.owner !== 'all') {
            const hasOwner = 
              rec.ownership.primary_owner === filters.owner ||
              rec.ownership.co_owners?.includes(filters.owner);
            if (!hasOwner) return false;
          }

          // Search filter
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const matchesSearch =
              rec.titles.short.toLowerCase().includes(searchLower) ||
              rec.titles.long.toLowerCase().includes(searchLower) ||
              rec.text.toLowerCase().includes(searchLower) ||
              rec.code.toLowerCase().includes(searchLower);
            if (!matchesSearch) return false;
          }

          return true;
        });

        if (filteredRecs.length === 0) return null;

        return {
          ...chapter,
          recommendations: filteredRecs,
        };
      })
      .filter((chapter): chapter is ChapterWithRecommendations => chapter !== null);
  }, [chaptersWithRecs, filters]);

  const totalFiltered = filteredChapters.reduce(
    (sum, ch) => sum + ch.recommendations.length,
    0
  );

  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.chapter !== 'all' ||
    filters.owner !== 'all' ||
    filters.search !== '';

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-beige to-background py-12 md:py-16">
        <div className="container">
          <HeroStats counts={counts} />
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-9 space-y-6">
            {/* Filter Controls */}
            <FilterControls
              filters={filters}
              onFilterChange={setFilters}
              chapters={chapters}
              owners={owners}
            />

            {/* Results count */}
            {hasActiveFilters && (
              <p className="text-sm text-muted-foreground">
                Showing {totalFiltered} recommendation{totalFiltered !== 1 ? 's' : ''}
                {filters.search && (
                  <> matching &ldquo;{filters.search}&rdquo;</>
                )}
              </p>
            )}

            {/* Chapter Sections */}
            {filteredChapters.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">No recommendations match your filters.</p>
                <p className="text-sm mt-2">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredChapters.map((chapter, index) => (
                  <ChapterSection
                    key={chapter.id}
                    chapter={chapter}
                    recommendations={chapter.recommendations}
                    defaultOpen={index < 2} // First two chapters open by default
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-20">
              <DeadlineSidebar
                deadlines={deadlines}
                recentUpdates={recentUpdates}
              />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

