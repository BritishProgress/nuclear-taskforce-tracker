'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  const urlView = searchParams.get('view') as ViewMode | null;
  const urlGridView = searchParams.get('gridView') as GridViewMode | null;
  
  // Try to restore from URL params, then sessionStorage, then defaults
  const storedState = typeof window !== 'undefined' ? getTimelineViewState() : {};
  const initialView = urlView || storedState.view || 'list';
  const initialGridView = urlGridView || storedState.gridViewMode || 'departments';
  
  const [view, setView] = useState<ViewMode>(initialView);
  const [gridViewMode, setGridViewMode] = useState<GridViewMode>(initialGridView);
  
  // Update state when URL params change
  useEffect(() => {
    if (urlView) setView(urlView);
    if (urlGridView) setGridViewMode(urlGridView);
  }, [urlView, urlGridView]);
  
  // Store state changes
  useEffect(() => {
    storeTimelineViewState(view, gridViewMode);
  }, [view, gridViewMode]);
  
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

