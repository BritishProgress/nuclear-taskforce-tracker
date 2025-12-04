'use client';

import { useState, useEffect } from 'react';
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

  // Handle view transitions with proper exit/enter animations
  useEffect(() => {
    if (view !== displayView) {
      setIsTransitioning(true);
      // Wait for exit animation to complete before switching content
      const timer = setTimeout(() => {
        setDisplayView(view);
        // Small delay before starting enter animation
        setTimeout(() => setIsTransitioning(false), 50);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [view, displayView]);

  const handleTagClick = (tag: string) => {
    // Navigate to dashboard with tag filter
    router.push(`/?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="space-y-4">
      <div className="relative min-h-[400px]">
        {/* List View */}
        <div 
          className={cn(
            'transition-all duration-300 ease-in-out',
            displayView === 'list' 
              ? (isTransitioning 
                  ? 'opacity-0 translate-y-2 scale-[0.98] pointer-events-none relative' 
                  : 'opacity-100 translate-y-0 scale-100 relative')
              : 'absolute inset-0 opacity-0 pointer-events-none translate-y-2 scale-[0.98]'
          )}
        >
          <div className="max-w-3xl">
            <Timeline 
              items={items} 
              showRecommendations={true}
              onTagClick={handleTagClick}
            />
          </div>
        </div>

        {/* Grid View */}
        <div 
          className={cn(
            'transition-all duration-300 ease-in-out',
            displayView === 'grid'
              ? (isTransitioning 
                  ? 'opacity-0 translate-y-2 scale-[0.98] pointer-events-none relative' 
                  : 'opacity-100 translate-y-0 scale-100 relative')
              : 'absolute inset-0 opacity-0 pointer-events-none translate-y-2 scale-[0.98]'
          )}
        >
          <div className="w-full">
            <TimelineGrid data={gridData} viewMode={gridViewMode} />
          </div>
        </div>
      </div>
    </div>
  );
}

