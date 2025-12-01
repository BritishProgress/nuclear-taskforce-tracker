'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { HeroStats, FilterControls, DeadlineSidebar } from '@/components/dashboard';
import { ChapterSection } from '@/components/recommendations';
import { getChapterColors } from '@/lib/constants';
import { X } from 'lucide-react';
import { 
  StatusCounts, 
  ChapterWithRecommendations, 
  UpcomingDeadline, 
  RecentUpdate, 
  FilterState,
  Chapter,
  Recommendation,
  OverallStatus,
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
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>(() => {
    const chapterParam = searchParams.get('chapter');
    const tagParam = searchParams.get('tag');
    return {
      status: 'all',
      chapter: chapterParam ? parseInt(chapterParam) : 'all',
      owner: 'all',
      search: '',
      tag: tagParam || undefined,
    };
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.chapter !== 'all') {
      params.set('chapter', filters.chapter.toString());
    }
    if (filters.tag) {
      params.set('tag', filters.tag);
    }
    const newUrl = params.toString() ? `/?${params.toString()}` : '/';
    router.replace(newUrl, { scroll: false });
  }, [filters.chapter, filters.tag, router]);

  // Scroll to chapter overview when chapter filter is set from URL
  useEffect(() => {
    if (filters.chapter !== 'all') {
      setTimeout(() => {
        const element = document.querySelector('[data-chapter-overview]');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [filters.chapter]);

  const handleStatusClick = (status: OverallStatus | 'all') => {
    setFilters(prev => ({
      ...prev,
      status: status,
    }));
    // Scroll to filters section
    setTimeout(() => {
      document.querySelector('[data-filter-section]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleTagClick = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tag: tag,
    }));
    // Scroll to filters section
    setTimeout(() => {
      document.querySelector('[data-filter-section]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

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

          // Tag filter - check if any update has the tag
          if (filters.tag) {
            const hasTag = rec.updates?.some(update => 
              update.tags?.includes(filters.tag!)
            );
            if (!hasTag) return false;
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
    filters.search !== '' ||
    filters.tag !== undefined;

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-beige to-background py-8 md:py-16">
        <div className="container">
          <HeroStats counts={counts} onStatusClick={handleStatusClick} />
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-9 space-y-6">
            {/* Filter Controls */}
            <div data-filter-section>
              <FilterControls
                filters={filters}
                onFilterChange={setFilters}
                chapters={chapters}
                owners={owners}
              />
            </div>

            {/* Chapter Overview */}
            {filters.chapter !== 'all' && (() => {
              const chapter = chapters.find(c => c.id === filters.chapter);
              const chapterData = chaptersWithRecs.find(c => c.id === filters.chapter);
              if (!chapter || !chapterData) return null;
              
              const completed = chapterData.recommendations.filter(r => r.overall_status.status === 'completed').length;
              const onTrack = chapterData.recommendations.filter(r => r.overall_status.status === 'on_track').length;
              const offTrack = chapterData.recommendations.filter(r => r.overall_status.status === 'off_track').length;
              const notStarted = chapterData.recommendations.filter(r => r.overall_status.status === 'not_started').length;
              const colors = getChapterColors(chapter.id);
              
              return (
                <div data-chapter-overview className={cn('p-6 rounded-lg border mb-6', colors.bg, colors.border)}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className={cn('font-display font-bold text-2xl mb-2', colors.text)}>
                        Chapter {chapter.id}: {chapter.title}
                      </h2>
                    </div>
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, chapter: 'all' }))}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Clear chapter filter"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{chapterData.recommendations.length}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    {completed > 0 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-neon-green">{completed}</div>
                        <div className="text-xs text-muted-foreground">Completed</div>
                      </div>
                    )}
                    {onTrack > 0 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-dark-green">{onTrack}</div>
                        <div className="text-xs text-muted-foreground">On Track</div>
                      </div>
                    )}
                    {offTrack > 0 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-deep-red">{offTrack}</div>
                        <div className="text-xs text-muted-foreground">Off Track</div>
                      </div>
                    )}
                    {notStarted > 0 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-charcoal">{notStarted}</div>
                        <div className="text-xs text-muted-foreground">Not Started</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

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

