'use client';

import { createContext, useContext, useState, useEffect, useLayoutEffect, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { getTimelineViewState, storeTimelineViewState } from '@/lib/url-utils';

type ViewMode = 'list' | 'grid';
type GridViewMode = 'departments' | 'recommendations';

interface TimelineViewContextType {
  view: ViewMode;
  setView: (view: ViewMode) => void;
  gridViewMode: GridViewMode;
  setGridViewMode: (mode: GridViewMode) => void;
}

const TimelineViewContext = createContext<TimelineViewContextType | undefined>(undefined);

function TimelineViewProviderInner({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  
  // Get URL params (available on both server and client)
  const urlView = searchParams.get('view') as ViewMode | null;
  const urlGridView = searchParams.get('gridView') as GridViewMode | null;
  
  // Always initialize with URL params or defaults to match server render
  // This ensures server and client render the same initial HTML
  // We use a function initializer to ensure consistent behavior
  const [view, setView] = useState<ViewMode>(() => urlView || 'list');
  const [gridViewMode, setGridViewMode] = useState<GridViewMode>(() => urlGridView || 'departments');
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Immediately on mount (before paint), restore from sessionStorage if no URL params
  // This runs synchronously before browser paint to minimize flash
  useLayoutEffect(() => {
    setIsHydrated(true);
    
    // Only check sessionStorage if URL params weren't provided
    if (!urlView && !urlGridView && typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('timelineViewState');
        if (stored) {
          const parsed = JSON.parse(stored);
          // Only restore 'grid' if it was previously 'grid' (not default 'list')
          // This ensures we default to 'list' unless user was explicitly on 'grid'
          if (parsed.view === 'grid' && parsed.view !== view) {
            setView('grid');
          }
          // Only restore gridViewMode if it's not the default 'departments'
          if (parsed.gridViewMode && parsed.gridViewMode !== 'departments' && parsed.gridViewMode !== gridViewMode) {
            setGridViewMode(parsed.gridViewMode);
          }
        }
      } catch (e) {
        // Ignore errors
      }
    }
  }, []); // Only run once on mount
  
  // Update state when URL params change
  useEffect(() => {
    if (urlView) setView(urlView);
    if (urlGridView) setGridViewMode(urlGridView);
  }, [urlView, urlGridView]);
  
  // Store state changes (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      storeTimelineViewState(view, gridViewMode);
    }
  }, [view, gridViewMode, isHydrated]);
  
  return (
    <TimelineViewContext.Provider value={{ view, setView, gridViewMode, setGridViewMode }}>
      {children}
    </TimelineViewContext.Provider>
  );
}

export function TimelineViewProvider({ children }: { children: ReactNode }) {
  return <TimelineViewProviderInner>{children}</TimelineViewProviderInner>;
}

export function useTimelineView() {
  const context = useContext(TimelineViewContext);
  if (!context) {
    throw new Error('useTimelineView must be used within TimelineViewProvider');
  }
  return context;
}

