'use client';

import { TimelineExportButton } from './timeline-export-button';
import { TimelineViewToggle } from './timeline-view-toggle';
import { useTimelineView } from './timeline-view-context';

export function TimelineHeaderControls() {
  const { view, setView } = useTimelineView();
  
  return (
    <div className="flex items-center gap-3 flex-shrink-0" suppressHydrationWarning>
      <TimelineViewToggle view={view} onViewChange={setView} />
      <TimelineExportButton />
    </div>
  );
}

