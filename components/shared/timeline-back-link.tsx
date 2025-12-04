'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { buildTimelineUrl, getTimelineViewState } from '@/lib/url-utils';

export function TimelineBackLink() {
  const [backUrl, setBackUrl] = useState('/timeline');
  const [isFromTimeline, setIsFromTimeline] = useState(false);

  useEffect(() => {
    // Check if we came from timeline
    const viewState = getTimelineViewState();
    if (viewState.view || viewState.gridViewMode) {
      setIsFromTimeline(true);
      setBackUrl(buildTimelineUrl(viewState.view, viewState.gridViewMode));
    } else {
      // Check document.referrer
      if (typeof window !== 'undefined' && document.referrer.includes('/timeline')) {
        setIsFromTimeline(true);
        setBackUrl('/timeline');
      }
    }
  }, []);

  if (!isFromTimeline) {
    return null;
  }

  return (
    <Link
      href={backUrl}
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft size={16} />
      Back to Timeline
    </Link>
  );
}

