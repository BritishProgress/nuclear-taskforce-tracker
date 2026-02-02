'use client';

import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { Timeline } from '@/components/shared/timeline-event';
import { TimelineGrid } from '@/components/timeline/timeline-grid';
import { TimelineItem } from '@/lib/types';
import { TimelineGridData } from '@/lib/timeline-grid';
import { useTimelineView } from './timeline-view-context';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface TimelineClientProps {
  items: TimelineItem[];
  gridData: TimelineGridData;
  view: 'list' | 'grid';
  onViewChange: (view: 'list' | 'grid') => void;
}

export function TimelineClient({ items, gridData, view, onViewChange }: TimelineClientProps) {
  const router = useRouter();
  const { gridViewMode } = useTimelineView();
  const [displayView, setDisplayView] = useState<'list' | 'grid'>(view);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInitialMount, setIsInitialMount] = useState(true);

  // On initial mount, sync immediately without animation
  useLayoutEffect(() => {
    if (isInitialMount) {
      if (view !== displayView) {
        setDisplayView(view);
      }
      setIsInitialMount(false);
    }
  }, []); // Only run once on mount

  // Handle view transitions with proper exit/enter animations
  // Only animate if not on initial mount
  useEffect(() => {
    if (!isInitialMount && view !== displayView) {
      setIsTransitioning(true);
      // Wait for exit animation to complete before switching content
      const timer = setTimeout(() => {
        setDisplayView(view);
        // Small delay before starting enter animation
        setTimeout(() => setIsTransitioning(false), 50);
      }, 300);
      return () => clearTimeout(timer);
    } else if (isInitialMount && view !== displayView) {
      // On initial mount, just sync without animation
      setDisplayView(view);
    }
  }, [view, displayView, isInitialMount]);

  const handleTagClick = useCallback((tag: string) => {
    // Navigate to dashboard with tag filter
    router.push(`/?tag=${encodeURIComponent(tag)}`);
  }, [router]);

  return (
    <div className="space-y-4" suppressHydrationWarning>
      <div className="relative">
        {/* List View */}
        {displayView === 'list' && (
          <div
            className={cn(
              'transition-all duration-300 ease-in-out',
              isTransitioning
                ? 'opacity-0 translate-y-2 scale-[0.98] pointer-events-none'
                : 'opacity-100 translate-y-0 scale-100'
            )}
            suppressHydrationWarning
          >
            <div className="max-w-3xl">
              <Timeline
                items={items}
                showRecommendations={true}
                onTagClick={handleTagClick}
              />
            </div>
          </div>
        )}

        {/* Grid View */}
        {displayView === 'grid' && (
          <div
            className={cn(
              'transition-all duration-300 ease-in-out',
              isTransitioning
                ? 'opacity-0 translate-y-2 scale-[0.98] pointer-events-none'
                : 'opacity-100 translate-y-0 scale-100'
            )}
            suppressHydrationWarning
          >
            <div className="w-full">
              <TimelineGrid data={gridData} viewMode={gridViewMode} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

