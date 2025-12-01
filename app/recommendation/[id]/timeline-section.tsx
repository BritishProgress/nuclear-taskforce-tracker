'use client';

import { Timeline } from '@/components/shared/timeline-event';
import { TimelineItem } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface TimelineSectionProps {
  items: TimelineItem[];
}

export function TimelineSection({ items }: TimelineSectionProps) {
  const router = useRouter();

  const handleTagClick = (tag: string) => {
    // Navigate to dashboard with tag filter
    router.push(`/?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <Timeline 
      items={items} 
      showRecommendations={false}
      onTagClick={handleTagClick}
    />
  );
}

