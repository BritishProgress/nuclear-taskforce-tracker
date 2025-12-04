'use client';

import { TimelineClient } from './timeline-client';
import { TimelineItem } from '@/lib/types';
import { TimelineGridData } from '@/lib/timeline-grid';
import { useTimelineView } from './timeline-view-context';

interface TimelinePageClientProps {
  timelineItems: TimelineItem[];
  gridData: TimelineGridData;
}

export function TimelinePageClient({ timelineItems, gridData }: TimelinePageClientProps) {
  const { view, setView } = useTimelineView();

  return (
    <TimelineClient items={timelineItems} gridData={gridData} view={view} onViewChange={setView} />
  );
}

