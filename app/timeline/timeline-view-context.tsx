'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type ViewMode = 'list' | 'grid';
type GridViewMode = 'departments' | 'recommendations';

interface TimelineViewContextType {
  view: ViewMode;
  setView: (view: ViewMode) => void;
  gridViewMode: GridViewMode;
  setGridViewMode: (mode: GridViewMode) => void;
}

const TimelineViewContext = createContext<TimelineViewContextType | undefined>(undefined);

export function TimelineViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewMode>('list');
  const [gridViewMode, setGridViewMode] = useState<GridViewMode>('departments');
  
  return (
    <TimelineViewContext.Provider value={{ view, setView, gridViewMode, setGridViewMode }}>
      {children}
    </TimelineViewContext.Provider>
  );
}

export function useTimelineView() {
  const context = useContext(TimelineViewContext);
  if (!context) {
    throw new Error('useTimelineView must be used within TimelineViewProvider');
  }
  return context;
}

